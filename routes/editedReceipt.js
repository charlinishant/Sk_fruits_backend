const express = require("express");
const router = express.Router();
const { query } = require("../dbService/database");

const RECEIPT_TYPES = [
  "Daily Sales Receipt",
  "Daily Receipt Details",
  "Purchase Receipt",
];

const SORT_COLUMNS = {
  bill_number: "rm.bill_number",
  date: "rm.receipt_date",
  customer_name: "rm.customer_name",
  user: "rm.user_name",
  route: "rm.route_name",
  receipt_type: "rm.receipt_type",
  edit_date: "COALESCE(latest.edited_date, legacy.edit_date, rm.source_edit_date)",
  edit_time: "COALESCE(latest.edited_time, legacy.edit_time, rm.source_edit_time)",
  status: "status",
};

const EDITABLE_FIELDS = [
  "date",
  "customer_name",
  "user",
  "route",
  "address",
  "mobile_no",
  "comment",
  "note",
  "previous_balance",
  "pre_balance",
  "deposite",
  "online_deposite_bank",
  "online_deposite",
  "cash",
  "online_acc",
  "online_amt",
  "amount",
  "carate_amount",
  "total_amount",
  "discount",
  "carate_100",
  "carate_150",
  "carate_250",
  "carate_350",
  "in_carate_100",
  "in_carate_150",
  "in_carate_250",
  "in_carate_350",
  "out_carate_100",
  "out_carate_150",
  "out_carate_250",
  "out_carate_350",
  "deposite_carate_price",
  "inCarat",
  "remaining",
  "balance",
  "baki_100",
  "baki_150",
  "baki_250",
  "baki_350",
  "gadi_number",
  "total_quantity",
  "expenses",
  "current_balance",
];

function normalizeType(type) {
  return RECEIPT_TYPES.includes(type) ? type : null;
}

function safeLimit(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function normalizeSnapshot(row, receiptType, extra = {}) {
  const receiptId = firstValue(row.receipt_id, row.bill_no, row.id);
  return {
    ...row,
    ...extra,
    receipt_id: receiptId,
    bill_number: String(receiptId),
    receipt_type: receiptType,
    date: row.date,
    customer_name: firstValue(
      row.from_account,
      row.cust_name,
      row.supplier_name,
      row.customer_name,
      ""
    ),
    user: row.added_by || "",
    route: firstValue(row.route, row.route_detail, ""),
    mobile_no: row.mobile_no || "",
    note: row.note || "",
  };
}

function masterValues(snapshot) {
  return [
    snapshot.receipt_id,
    snapshot.bill_number,
    snapshot.receipt_type,
    snapshot.date || null,
    snapshot.customer_name || "",
    snapshot.user || "",
    snapshot.route || "",
    JSON.stringify(snapshot),
  ];
}

async function upsertMasterSnapshot(snapshot) {
  const [history] = await query(
    `SELECT id FROM receipt_edit_history
      WHERE receipt_id = ? AND receipt_type = ?
      LIMIT 1`,
    [snapshot.receipt_id, snapshot.receipt_type]
  );

  await query(
    `INSERT INTO receipt_master
      (receipt_id, bill_number, receipt_type, receipt_date, customer_name, user_name, route_name, original_receipt_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       receipt_date = VALUES(receipt_date),
       customer_name = VALUES(customer_name),
       user_name = VALUES(user_name),
       route_name = VALUES(route_name),
       original_receipt_json = IF(? IS NULL, VALUES(original_receipt_json), original_receipt_json)`,
    [...masterValues(snapshot), history ? history.id : null]
  );
}

async function loadSourceSnapshot(receiptId, receiptType, includeItems = false) {
  if (receiptType === "Daily Sales Receipt") {
    const [sale] = await query("SELECT * FROM sale_table WHERE bill_no = ?", [
      receiptId,
    ]);
    if (!sale) return null;

    const extra = {};
    if (includeItems) {
      extra.products = await query(
        "SELECT * FROM sale_product WHERE bill_id = ? ORDER BY id",
        [receiptId]
      );
    }
    return normalizeSnapshot(sale, receiptType, extra);
  }

  if (receiptType === "Purchase Receipt") {
    const [purchase] = await query("SELECT * FROM purchase WHERE id = ?", [
      receiptId,
    ]);
    if (!purchase) return null;

    const extra = {};
    if (includeItems) {
      extra.products = await query(
        "SELECT * FROM purchase_product WHERE purchase_id = ? ORDER BY id",
        [receiptId]
      );
    }
    return normalizeSnapshot(purchase, receiptType, extra);
  }

  const [receipt] = await query(
    `SELECT r.*, COALESCE(a.route_detail, '') AS route_detail
       FROM receipt r
       LEFT JOIN account_table a ON a.name = r.from_account
      WHERE r.receipt_id = ?`,
    [receiptId]
  );
  if (!receipt) return null;
  return normalizeSnapshot(receipt, receiptType);
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function isAllFilterValue(value) {
  if (value === null || value === undefined) return true;
  const text = String(value).trim().toUpperCase();
  return text === "" || text === "*" || text === "ALL" || text === "ALL ROUTE";
}

function buildFilters(body) {
  const where = ["1 = 1"];
  const params = [];

  if (!isAllFilterValue(body.bill_number)) {
    where.push("rm.bill_number LIKE ?");
    params.push(`%${String(body.bill_number).trim()}%`);
  }
  if (body.from_date) {
    where.push("DATE(rm.receipt_date) >= ?");
    params.push(body.from_date);
  }
  if (body.to_date) {
    where.push("DATE(rm.receipt_date) <= ?");
    params.push(body.to_date);
  }
  if (!isAllFilterValue(body.user)) {
    where.push("rm.user_name = ?");
    params.push(body.user);
  }
  if (!isAllFilterValue(body.customer_name)) {
    where.push("rm.customer_name = ?");
    params.push(body.customer_name);
  }
  if (!isAllFilterValue(body.route)) {
    where.push("rm.route_name = ?");
    params.push(body.route);
  }
  if (!isAllFilterValue(body.receipt_type)) {
    const receiptType = normalizeType(body.receipt_type);
    if (receiptType) {
      where.push("rm.receipt_type = ?");
      params.push(receiptType);
    }
  }

  return { where: where.join(" AND "), params };
}

function sourceReceiptsSql() {
  return `
    SELECT
      r.receipt_id,
      CONVERT(CAST(r.receipt_id AS CHAR) USING utf8mb4) COLLATE utf8mb4_general_ci AS bill_number,
      CONVERT('Daily Receipt Details' USING utf8mb4) COLLATE utf8mb4_general_ci AS receipt_type,
      r.date AS receipt_date,
      CONVERT(r.from_account USING utf8mb4) COLLATE utf8mb4_general_ci AS customer_name,
      CONVERT(r.added_by USING utf8mb4) COLLATE utf8mb4_general_ci AS user_name,
      CONVERT(COALESCE(a.route_detail, '') USING utf8mb4) COLLATE utf8mb4_general_ci AS route_name,
      CONVERT('Active' USING utf8mb4) COLLATE utf8mb4_general_ci AS source_status,
      NULL AS source_edit_date,
      NULL AS source_edit_time
    FROM receipt r
    LEFT JOIN account_table a ON a.name = r.from_account
    UNION ALL
    SELECT
      s.bill_no AS receipt_id,
      CONVERT(CAST(s.bill_no AS CHAR) USING utf8mb4) COLLATE utf8mb4_general_ci AS bill_number,
      CONVERT('Daily Sales Receipt' USING utf8mb4) COLLATE utf8mb4_general_ci AS receipt_type,
      s.date AS receipt_date,
      CONVERT(s.cust_name USING utf8mb4) COLLATE utf8mb4_general_ci AS customer_name,
      CONVERT(s.added_by USING utf8mb4) COLLATE utf8mb4_general_ci AS user_name,
      CONVERT(s.route USING utf8mb4) COLLATE utf8mb4_general_ci AS route_name,
      CONVERT('Active' USING utf8mb4) COLLATE utf8mb4_general_ci AS source_status,
      NULL AS source_edit_date,
      NULL AS source_edit_time
    FROM sale_table s
    WHERE s.bill_no IS NOT NULL
    UNION ALL
    SELECT
      p.id AS receipt_id,
      CONVERT(CAST(p.id AS CHAR) USING utf8mb4) COLLATE utf8mb4_general_ci AS bill_number,
      CONVERT('Purchase Receipt' USING utf8mb4) COLLATE utf8mb4_general_ci AS receipt_type,
      p.date AS receipt_date,
      CONVERT(p.supplier_name USING utf8mb4) COLLATE utf8mb4_general_ci AS customer_name,
      CONVERT(p.added_by USING utf8mb4) COLLATE utf8mb4_general_ci AS user_name,
      CONVERT('' USING utf8mb4) COLLATE utf8mb4_general_ci AS route_name,
      CONVERT('Active' USING utf8mb4) COLLATE utf8mb4_general_ci AS source_status,
      NULL AS source_edit_date,
      NULL AS source_edit_time
    FROM purchase p
    UNION ALL
    SELECT
      eh.bill_no AS receipt_id,
      CONVERT(CAST(eh.bill_no AS CHAR) USING utf8mb4) COLLATE utf8mb4_general_ci AS bill_number,
      CONVERT('Daily Receipt Details' USING utf8mb4) COLLATE utf8mb4_general_ci AS receipt_type,
      eh.edit_date AS receipt_date,
      CONVERT(eh.customer_name USING utf8mb4) COLLATE utf8mb4_general_ci AS customer_name,
      CONVERT(eh.edited_by USING utf8mb4) COLLATE utf8mb4_general_ci AS user_name,
      CONVERT('' USING utf8mb4) COLLATE utf8mb4_general_ci AS route_name,
      CONVERT('Deleted' USING utf8mb4) COLLATE utf8mb4_general_ci AS source_status,
      eh.edit_date AS source_edit_date,
      eh.edit_time AS source_edit_time
    FROM edit_history eh
    LEFT JOIN receipt r ON r.receipt_id = eh.bill_no
    WHERE eh.type = 'receipt'
      AND eh.product_details LIKE 'RECEIPT_DELETED:%'
      AND r.receipt_id IS NULL
  `;
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS receipt_master (
      id INT NOT NULL AUTO_INCREMENT,
      receipt_id INT NOT NULL,
      bill_number VARCHAR(50) NOT NULL,
      receipt_type ENUM('Daily Sales Receipt','Daily Receipt Details','Purchase Receipt') NOT NULL,
      receipt_date DATE DEFAULT NULL,
      customer_name VARCHAR(255) DEFAULT NULL,
      user_name VARCHAR(100) DEFAULT NULL,
      route_name VARCHAR(255) DEFAULT NULL,
      original_receipt_json LONGTEXT NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_receipt_master_source (receipt_id, receipt_type),
      KEY idx_receipt_master_filters (receipt_date, bill_number, customer_name, user_name, route_name, receipt_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS receipt_edit_history (
      id INT NOT NULL AUTO_INCREMENT,
      receipt_id INT NOT NULL,
      bill_number VARCHAR(50) NOT NULL,
      receipt_type ENUM('Daily Sales Receipt','Daily Receipt Details','Purchase Receipt') NOT NULL,
      edited_by VARCHAR(100) NOT NULL,
      edited_date DATE NOT NULL,
      edited_time TIME NOT NULL,
      edit_reason VARCHAR(500) NOT NULL,
      before_receipt_json LONGTEXT NOT NULL,
      after_receipt_json LONGTEXT NOT NULL,
      version INT NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_receipt_edit_version (receipt_id, receipt_type, version),
      KEY idx_receipt_edit_latest (receipt_id, receipt_type, version),
      KEY idx_receipt_edit_date (edited_date, edited_time)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
}

async function syncReceiptMaster() {
  await ensureSchema();

  await query(`
    INSERT INTO receipt_master
      (receipt_id, bill_number, receipt_type, receipt_date, customer_name, user_name, route_name, original_receipt_json)
    SELECT
      r.receipt_id,
      CAST(r.receipt_id AS CHAR),
      'Daily Receipt Details',
      r.date,
      r.from_account,
      r.added_by,
      COALESCE(a.route_detail, ''),
      JSON_OBJECT(
        'receipt_id', r.receipt_id,
        'bill_number', CAST(r.receipt_id AS CHAR),
        'receipt_type', 'Daily Receipt Details',
        'date', r.date,
        'customer_name', r.from_account,
        'user', r.added_by,
        'route', COALESCE(a.route_detail, '')
      )
    FROM receipt r
    LEFT JOIN account_table a ON a.name = r.from_account
    ON DUPLICATE KEY UPDATE
      receipt_date = VALUES(receipt_date),
      customer_name = VALUES(customer_name),
      user_name = VALUES(user_name),
      route_name = VALUES(route_name),
      original_receipt_json = IF(
        (SELECT COUNT(*) FROM receipt_edit_history h
          WHERE h.receipt_id = receipt_master.receipt_id
            AND h.receipt_type = receipt_master.receipt_type) = 0,
        VALUES(original_receipt_json),
        original_receipt_json
      )
  `);

  await query(`
    INSERT INTO receipt_master
      (receipt_id, bill_number, receipt_type, receipt_date, customer_name, user_name, route_name, original_receipt_json)
    SELECT
      s.bill_no,
      CAST(s.bill_no AS CHAR),
      'Daily Sales Receipt',
      s.date,
      s.cust_name,
      s.added_by,
      s.route,
      JSON_OBJECT(
        'receipt_id', s.bill_no,
        'bill_number', CAST(s.bill_no AS CHAR),
        'receipt_type', 'Daily Sales Receipt',
        'date', s.date,
        'customer_name', s.cust_name,
        'user', s.added_by,
        'route', s.route
      )
    FROM sale_table s
    WHERE s.bill_no IS NOT NULL
    ON DUPLICATE KEY UPDATE
      receipt_date = VALUES(receipt_date),
      customer_name = VALUES(customer_name),
      user_name = VALUES(user_name),
      route_name = VALUES(route_name),
      original_receipt_json = IF(
        (SELECT COUNT(*) FROM receipt_edit_history h
          WHERE h.receipt_id = receipt_master.receipt_id
            AND h.receipt_type = receipt_master.receipt_type) = 0,
        VALUES(original_receipt_json),
        original_receipt_json
      )
  `);

  await query(`
    INSERT INTO receipt_master
      (receipt_id, bill_number, receipt_type, receipt_date, customer_name, user_name, route_name, original_receipt_json)
    SELECT
      p.id,
      CAST(p.id AS CHAR),
      'Purchase Receipt',
      p.date,
      p.supplier_name,
      p.added_by,
      '',
      JSON_OBJECT(
        'receipt_id', p.id,
        'bill_number', CAST(p.id AS CHAR),
        'receipt_type', 'Purchase Receipt',
        'date', p.date,
        'customer_name', p.supplier_name,
        'user', p.added_by,
        'route', ''
      )
    FROM purchase p
    ON DUPLICATE KEY UPDATE
      receipt_date = VALUES(receipt_date),
      customer_name = VALUES(customer_name),
      user_name = VALUES(user_name),
      route_name = VALUES(route_name),
      original_receipt_json = IF(
        (SELECT COUNT(*) FROM receipt_edit_history h
          WHERE h.receipt_id = receipt_master.receipt_id
            AND h.receipt_type = receipt_master.receipt_type) = 0,
        VALUES(original_receipt_json),
        original_receipt_json
      )
  `);

  await query(`
    DELETE rm FROM receipt_master rm
    LEFT JOIN receipt_edit_history h
      ON h.receipt_id = rm.receipt_id AND h.receipt_type = rm.receipt_type
    LEFT JOIN receipt r
      ON r.receipt_id = rm.receipt_id AND rm.receipt_type = 'Daily Receipt Details'
    LEFT JOIN sale_table s
      ON s.bill_no = rm.receipt_id AND rm.receipt_type = 'Daily Sales Receipt'
    LEFT JOIN purchase p
      ON p.id = rm.receipt_id AND rm.receipt_type = 'Purchase Receipt'
    WHERE h.id IS NULL
      AND (
        (rm.receipt_type = 'Daily Receipt Details' AND r.receipt_id IS NULL)
        OR (rm.receipt_type = 'Daily Sales Receipt' AND s.bill_no IS NULL)
        OR (rm.receipt_type = 'Purchase Receipt' AND p.id IS NULL)
      )
  `);
}

async function ensureMasterReceipt(receiptId, receiptType) {
  await ensureSchema();

  const sourceSnapshot = await loadSourceSnapshot(receiptId, receiptType, true);
  if (sourceSnapshot) {
    await upsertMasterSnapshot(sourceSnapshot);
  }

  const [master] = await query(
    "SELECT * FROM receipt_master WHERE receipt_id = ? AND receipt_type = ?",
    [receiptId, receiptType]
  );

  if (master) return master;
  return null;
}

async function loadDeletedReceiptLog(receiptId) {
  const [log] = await query(
    `SELECT *
       FROM edit_history
      WHERE type = 'receipt'
        AND bill_no = ?
        AND product_details LIKE 'RECEIPT_DELETED:%'
      ORDER BY edit_date DESC, edit_time DESC, id DESC
      LIMIT 1`,
    [receiptId]
  );

  if (!log || typeof log.product_details !== "string") return null;

  try {
    const snapshot = JSON.parse(
      log.product_details.replace("RECEIPT_DELETED:", "")
    );
    const before = normalizeSnapshot(
      {
        ...snapshot,
        receipt_id: log.bill_no,
        from_account: log.customer_name,
        added_by: snapshot.added_by || log.edited_by,
      },
      "Daily Receipt Details"
    );

    return {
      log,
      before,
      after: {
        ...before,
        status: "Deleted",
        deleted: true,
        deleted_by: log.edited_by,
        deleted_date: log.edit_date,
        deleted_time: log.edit_time,
        note: "Receipt deleted",
      },
    };
  } catch (error) {
    console.warn("Could not parse deleted receipt snapshot:", error.message);
    return null;
  }
}

async function loadLegacyEditLog(receiptId, receiptType) {
  const legacyType =
    receiptType === "Daily Sales Receipt"
      ? "sale"
      : receiptType === "Daily Receipt Details"
      ? "receipt"
      : null;

  if (!legacyType) return null;

  const [log] = await query(
    `SELECT *
       FROM edit_history
      WHERE type = ?
        AND bill_no = ?
        AND (product_details IS NULL OR product_details NOT LIKE 'RECEIPT_DELETED:%')
      ORDER BY edit_date DESC, edit_time DESC, id DESC
      LIMIT 1`,
    [legacyType, receiptId]
  );

  if (!log) return null;

  const before =
    parseJsonMaybe(log.old_receipt_data) ||
    normalizeSnapshot(
      {
        receipt_id: log.bill_no,
        from_account: log.customer_name,
        remaining: log.old_quantity,
        added_by: log.edited_by,
      },
      receiptType
    );
  const after =
    parseJsonMaybe(log.new_receipt_data) ||
    normalizeSnapshot(
      {
        receipt_id: log.bill_no,
        from_account: log.customer_name,
        remaining: log.new_quantity,
        added_by: log.edited_by,
      },
      receiptType
    );

  return {
    log,
    before: normalizeSnapshot(before, receiptType),
    after: normalizeSnapshot(after, receiptType),
  };
}

function parseJsonMaybe(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

router.post("/search", async (req, res) => {
  try {
    const page = safeLimit(req.body.page, 1, 100000);
    const pageSize = safeLimit(req.body.page_size, 10, 100);
    const offset = (page - 1) * pageSize;
    const sortBy = SORT_COLUMNS[req.body.sort_by] || "rm.receipt_date";
    const sortDir =
      String(req.body.sort_dir || "DESC").toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";
    const { where, params } = buildFilters(req.body);

    const baseSql = `
      FROM (${sourceReceiptsSql()}) rm
      LEFT JOIN (
        SELECT h.*
        FROM receipt_edit_history h
        INNER JOIN (
          SELECT receipt_id, receipt_type, MAX(version) AS version
          FROM receipt_edit_history
          GROUP BY receipt_id, receipt_type
        ) v ON v.receipt_id = h.receipt_id
           AND v.receipt_type = h.receipt_type
           AND v.version = h.version
      ) latest ON latest.receipt_id = rm.receipt_id
              AND latest.receipt_type = rm.receipt_type
      LEFT JOIN (
        SELECT eh.*
        FROM edit_history eh
        INNER JOIN (
          SELECT type, bill_no, MAX(CONCAT(edit_date, ' ', edit_time)) AS max_edit
          FROM edit_history
          WHERE product_details IS NULL OR product_details NOT LIKE 'RECEIPT_DELETED:%'
          GROUP BY type, bill_no
        ) v ON v.type = eh.type
           AND v.bill_no = eh.bill_no
           AND v.max_edit = CONCAT(eh.edit_date, ' ', eh.edit_time)
      ) legacy ON legacy.bill_no = rm.receipt_id
              AND (
                (legacy.type = 'receipt' AND rm.receipt_type = 'Daily Receipt Details')
                OR (legacy.type = 'sale' AND rm.receipt_type = 'Daily Sales Receipt')
              )
      WHERE ${where}
    `;

    const [countRow] = await query(
      `SELECT COUNT(*) AS total ${baseSql}`,
      params
    );

    const rows = await query(
      `SELECT
         rm.receipt_id AS id,
         rm.receipt_id,
         rm.bill_number,
         rm.receipt_type,
         rm.receipt_date AS date,
         rm.customer_name,
         rm.user_name AS user,
         rm.route_name AS route,
         COALESCE(latest.edited_time, legacy.edit_time, rm.source_edit_time) AS edit_time,
         COALESCE(latest.edited_date, legacy.edit_date, rm.source_edit_date) AS edit_date,
         COALESCE(latest.edited_by, legacy.edited_by, rm.user_name) AS edited_by,
         COALESCE(latest.edit_reason, 'Daily report edit') AS edit_reason,
         latest.version,
         CASE
           WHEN rm.source_status = 'Deleted' THEN 'Deleted'
           WHEN latest.id IS NULL AND legacy.id IS NULL THEN 'Not Edited'
           ELSE 'Edited'
         END AS status
       ${baseSql}
       ORDER BY ${sortBy} ${sortDir}, rm.receipt_id DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    res.json({
      data: rows,
      total: countRow ? countRow.total : 0,
      page,
      page_size: pageSize,
    });
  } catch (error) {
    console.error("Error searching edited receipts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/before/:receiptType/:receiptId", async (req, res) => {
  try {
    const receiptType = normalizeType(req.params.receiptType);
    if (!receiptType) {
      return res.status(400).json({ message: "Invalid receipt type" });
    }

    const master = await ensureMasterReceipt(req.params.receiptId, receiptType);
    if (!master && receiptType === "Daily Receipt Details") {
      const deleted = await loadDeletedReceiptLog(req.params.receiptId);
      if (deleted) {
        return res.json({
          receipt: deleted.before,
          meta: {
            receipt_id: deleted.log.bill_no,
            bill_number: String(deleted.log.bill_no),
            receipt_type: receiptType,
            deleted_by: deleted.log.edited_by,
            deleted_date: deleted.log.edit_date,
            deleted_time: deleted.log.edit_time,
            status: "Deleted",
          },
        });
      }
    }

    const legacy = await loadLegacyEditLog(req.params.receiptId, receiptType);
    if (legacy) {
      return res.json({
        receipt: legacy.before,
        meta: {
          receipt_id: legacy.log.bill_no,
          bill_number: String(legacy.log.bill_no),
          receipt_type: receiptType,
          edited_by: legacy.log.edited_by,
          edited_date: legacy.log.edit_date,
          edited_time: legacy.log.edit_time,
          status: "Edited",
        },
      });
    }

    if (!master) return res.status(404).json({ message: "Receipt not found" });

    res.json({
      receipt: JSON.parse(master.original_receipt_json),
      meta: {
        receipt_id: master.receipt_id,
        bill_number: master.bill_number,
        receipt_type: master.receipt_type,
      },
    });
  } catch (error) {
    console.error("Error fetching original receipt:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/after/:receiptType/:receiptId", async (req, res) => {
  try {
    const receiptType = normalizeType(req.params.receiptType);
    if (!receiptType) {
      return res.status(400).json({ message: "Invalid receipt type" });
    }

    const [history] = await query(
      `SELECT *
         FROM receipt_edit_history
        WHERE receipt_id = ? AND receipt_type = ?
        ORDER BY version DESC
        LIMIT 1`,
      [req.params.receiptId, receiptType]
    );

    if (!history) {
      if (receiptType === "Daily Receipt Details") {
        const deleted = await loadDeletedReceiptLog(req.params.receiptId);
        if (deleted) {
          return res.json({
            receipt: deleted.after,
            meta: {
              deleted_by: deleted.log.edited_by,
              deleted_date: deleted.log.edit_date,
              deleted_time: deleted.log.edit_time,
              status: "Deleted",
            },
          });
        }
      }
      const legacy = await loadLegacyEditLog(req.params.receiptId, receiptType);
      if (legacy) {
        return res.json({
          receipt: legacy.after,
          meta: {
            edited_by: legacy.log.edited_by,
            edited_date: legacy.log.edit_date,
            edited_time: legacy.log.edit_time,
            edit_reason: "Daily report edit",
            status: "Edited",
          },
        });
      }
      return res.status(404).json({ message: "No Edited Receipt Available" });
    }

    res.json({
      receipt: JSON.parse(history.after_receipt_json),
      meta: {
        edited_by: history.edited_by,
        edited_date: history.edited_date,
        edited_time: history.edited_time,
        edit_reason: history.edit_reason,
        version: history.version,
      },
    });
  } catch (error) {
    console.error("Error fetching edited receipt:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/history/:receiptType/:receiptId", async (req, res) => {
  try {
    const receiptType = normalizeType(req.params.receiptType);
    if (!receiptType) {
      return res.status(400).json({ message: "Invalid receipt type" });
    }

    const rows = await query(
      `SELECT id, receipt_id, bill_number, receipt_type, edited_by, edited_date,
              edited_time, edit_reason, version, created_at
         FROM receipt_edit_history
        WHERE receipt_id = ? AND receipt_type = ?
        ORDER BY version DESC`,
      [req.params.receiptId, receiptType]
    );

    res.json({ history: rows });
  } catch (error) {
    console.error("Error fetching receipt history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/edit/:receiptType/:receiptId", async (req, res) => {
  try {
    const receiptType = normalizeType(req.params.receiptType);
    if (!receiptType) {
      return res.status(400).json({ message: "Invalid receipt type" });
    }

    const editReason = String(req.body.edit_reason || "").trim();
    const editedBy = String(req.body.edited_by || "").trim();

    if (!editReason) {
      return res.status(400).json({ message: "Edit reason is required" });
    }
    if (!editedBy) {
      return res.status(400).json({ message: "Edited by is required" });
    }

    const master = await ensureMasterReceipt(req.params.receiptId, receiptType);
    if (!master) return res.status(404).json({ message: "Receipt not found" });

    const [latest] = await query(
      `SELECT *
         FROM receipt_edit_history
        WHERE receipt_id = ? AND receipt_type = ?
        ORDER BY version DESC
        LIMIT 1`,
      [req.params.receiptId, receiptType]
    );

    const beforeJson = latest
      ? JSON.parse(latest.after_receipt_json)
      : JSON.parse(master.original_receipt_json);
    const afterJson = { ...beforeJson };

    EDITABLE_FIELDS.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body.receipt || {}, field)) {
        afterJson[field] = req.body.receipt[field];
      }
    });

    afterJson.bill_number = master.bill_number;
    afterJson.receipt_id = master.receipt_id;
    afterJson.receipt_type = master.receipt_type;

    const nextVersion = latest ? latest.version + 1 : 1;

    await query(
      `INSERT INTO receipt_edit_history
        (receipt_id, bill_number, receipt_type, edited_by, edited_date, edited_time,
         edit_reason, before_receipt_json, after_receipt_json, version)
       VALUES (?, ?, ?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?)`,
      [
        master.receipt_id,
        master.bill_number,
        master.receipt_type,
        editedBy,
        editReason,
        JSON.stringify(beforeJson),
        JSON.stringify(afterJson),
        nextVersion,
      ]
    );

    res.json({
      message: "Receipt edit saved successfully",
      version: nextVersion,
    });
  } catch (error) {
    console.error("Error editing receipt:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/export", async (req, res) => {
  try {
    const { where, params } = buildFilters(req.body);
    const rows = await query(
      `SELECT
         rm.bill_number,
         rm.receipt_id,
         rm.receipt_date AS date,
         rm.customer_name,
         rm.user_name AS user,
         rm.route_name AS route,
         rm.receipt_type,
         COALESCE(latest.edited_time, legacy.edit_time, rm.source_edit_time) AS edit_time,
         COALESCE(latest.edited_date, legacy.edit_date, rm.source_edit_date) AS edit_date,
         CASE
           WHEN rm.source_status = 'Deleted' THEN 'Deleted'
           WHEN latest.id IS NULL AND legacy.id IS NULL THEN 'Not Edited'
           ELSE 'Edited'
         END AS status
       FROM (${sourceReceiptsSql()}) rm
       LEFT JOIN (
        SELECT h.*
        FROM receipt_edit_history h
        INNER JOIN (
          SELECT receipt_id, receipt_type, MAX(version) AS version
          FROM receipt_edit_history
          GROUP BY receipt_id, receipt_type
        ) v ON v.receipt_id = h.receipt_id
           AND v.receipt_type = h.receipt_type
           AND v.version = h.version
       ) latest ON latest.receipt_id = rm.receipt_id
              AND latest.receipt_type = rm.receipt_type
       LEFT JOIN (
        SELECT eh.*
        FROM edit_history eh
        INNER JOIN (
          SELECT type, bill_no, MAX(CONCAT(edit_date, ' ', edit_time)) AS max_edit
          FROM edit_history
          WHERE product_details IS NULL OR product_details NOT LIKE 'RECEIPT_DELETED:%'
          GROUP BY type, bill_no
        ) v ON v.type = eh.type
           AND v.bill_no = eh.bill_no
           AND v.max_edit = CONCAT(eh.edit_date, ' ', eh.edit_time)
       ) legacy ON legacy.bill_no = rm.receipt_id
               AND (
                 (legacy.type = 'receipt' AND rm.receipt_type = 'Daily Receipt Details')
                 OR (legacy.type = 'sale' AND rm.receipt_type = 'Daily Sales Receipt')
               )
       WHERE ${where}
       ORDER BY rm.receipt_date DESC, rm.receipt_id DESC`,
      params
    );

    const headers = [
      "Sr No",
      "Bill No",
      "Receipt No",
      "Date",
      "Customer Name",
      "User",
      "Route",
      "Receipt Type",
      "Edit Time",
      "Edit Date",
      "Status",
    ];

    const lines = [
      headers.map(csvEscape).join(","),
      ...rows.map((row, index) =>
        [
          index + 1,
          row.bill_number,
          row.receipt_id,
          row.date,
          row.customer_name,
          row.user,
          row.route,
          row.receipt_type,
          row.edit_time || "",
          row.edit_date || "",
          row.status,
        ]
          .map(csvEscape)
          .join(",")
      ),
    ];

    res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=edited_receipts.xls"
    );
    res.send(lines.join("\r\n"));
  } catch (error) {
    console.error("Error exporting edited receipts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
