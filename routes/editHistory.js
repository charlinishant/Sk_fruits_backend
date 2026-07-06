const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

// Fetch edited receipts by date range
router.post("/edited-receipts", async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start date and end date are required" });
  }

  try {
    const sql = `
      SELECT 
        r.receipt_id,
        r.date,
        r.from_account as Customer,
        r.mobile_no,
        r.deposite as cash,
        r.online_deposite_bank,
        r.online_deposite as online,
        r.discount,
        r.deposite_carate_price as inCarat,
        r.note,
        r.remaining,
        eh.old_quantity as previous_remaining,
        r.validate,
        r.added_by,
        r.updated_at,
        eh.edit_date,
        eh.edit_time,
        eh.edited_by,
        eh.id as edit_id,
        'Edited' as history_status
      FROM receipt r
      INNER JOIN (
        SELECT bill_no, MAX(CONCAT(edit_date, ' ', edit_time)) as max_edit
        FROM edit_history
        WHERE type = 'receipt'
          AND (product_details IS NULL OR product_details NOT LIKE 'RECEIPT_DELETED:%')
          AND DATE(edit_date) BETWEEN ? AND ?
        GROUP BY bill_no
      ) latest ON latest.bill_no = r.receipt_id
      INNER JOIN edit_history eh ON eh.bill_no = r.receipt_id 
        AND CONCAT(eh.edit_date, ' ', eh.edit_time) = latest.max_edit
        AND eh.type = 'receipt'
        AND (eh.product_details IS NULL OR eh.product_details NOT LIKE 'RECEIPT_DELETED:%')
      ORDER BY eh.edit_date DESC, eh.edit_time DESC, r.receipt_id DESC
    `;

    const deletedSql = `
      SELECT 
        bill_no,
        customer_name,
        product_details,
        edited_by,
        edit_date,
        edit_time,
        id as edit_id
      FROM edit_history
      WHERE type = 'receipt'
        AND product_details LIKE 'RECEIPT_DELETED:%'
        AND DATE(edit_date) BETWEEN ? AND ?
      ORDER BY edit_date DESC, edit_time DESC, bill_no DESC
    `;

    const [results, deletedLogs] = await Promise.all([
      query(sql, [startDate, endDate]),
      query(deletedSql, [startDate, endDate]),
    ]);

    const deletedResults = deletedLogs.map((log) => {
      let deletedData = {};

      if (
        typeof log.product_details === "string" &&
        log.product_details.startsWith("RECEIPT_DELETED:")
      ) {
        try {
          deletedData = JSON.parse(
            log.product_details.replace("RECEIPT_DELETED:", "")
          );
        } catch (parseError) {
          console.warn("Could not parse deleted receipt snapshot:", parseError.message);
        }
      }

      return {
        receipt_id: log.bill_no,
        date: deletedData.date || null,
        Customer: log.customer_name,
        mobile_no: deletedData.mobile_no || "",
        cash: deletedData.cash || 0,
        online_deposite_bank: deletedData.online_deposite_bank || "",
        online: deletedData.online || 0,
        discount: deletedData.discount || 0,
        inCarat: deletedData.inCarat || 0,
        note: deletedData.note || "",
        previous_remaining: deletedData.remaining || 0,
        remaining: 0,
        validate: "Deleted",
        added_by: deletedData.added_by || "",
        updated_at: null,
        edit_date: log.edit_date,
        edit_time: log.edit_time,
        edited_by: log.edited_by,
        edit_id: log.edit_id,
        history_status: "Deleted",
      };
    });

    const combinedResults = [...results, ...deletedResults].sort((a, b) => {
      const dateA = new Date(`${a.edit_date} ${a.edit_time || "00:00:00"}`);
      const dateB = new Date(`${b.edit_date} ${b.edit_time || "00:00:00"}`);
      return dateB - dateA;
    });

    if (combinedResults.length === 0) {
      return res.status(404).json({ message: "No edited receipts found" });
    }

    res.json(combinedResults);
  } catch (error) {
    console.error("Error fetching edited receipts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch edit history with date range filter
router.post("/fetch", async (req, res) => {
  const { startDate, endDate, type } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start date and end date are required" });
  }

  try {
    let sql = `
      SELECT 
        eh.id,
        eh.type,
        eh.bill_no,
        eh.customer_name,
        eh.product_details,
        eh.old_quantity,
        eh.new_quantity,
        eh.edited_by,
        eh.edit_date,
        eh.edit_time
      FROM edit_history eh
      WHERE DATE(eh.edit_date) BETWEEN ? AND ?
    `;
    
    const params = [startDate, endDate];

    if (type && type !== 'all') {
      sql += ` AND eh.type = ?`;
      params.push(type);
    }

    sql += ` ORDER BY eh.edit_date DESC, eh.edit_time DESC`;

    const results = await query(sql, params);
    
    res.json(results);
  } catch (error) {
    console.error("Error fetching edit history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Log edit action (called when sale/receipt is edited)
router.post("/log", async (req, res) => {
  const { type, bill_no, customer_name, product_details, old_quantity, new_quantity, edited_by } = req.body;

  if (!type || !bill_no || !edited_by) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const sql = `
      INSERT INTO edit_history 
      (type, bill_no, customer_name, product_details, old_quantity, new_quantity, edited_by, edit_date, edit_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), NOW())
    `;
    
    const values = [type, bill_no, customer_name, product_details, old_quantity, new_quantity, edited_by];
    
    await query(sql, values);
    
    res.json({ message: "Edit history logged successfully" });
  } catch (error) {
    console.error("Error logging edit history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
