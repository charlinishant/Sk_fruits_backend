CREATE TABLE IF NOT EXISTS receipt_master (
  id INT NOT NULL AUTO_INCREMENT,
  receipt_id INT NOT NULL,
  bill_number VARCHAR(50) NOT NULL,
  receipt_type ENUM('Daily Sales Receipt','Daily Receipt Details','Purchase Receipt') NOT NULL,
  receipt_date DATE DEFAULT NULL,
  customer_name VARCHAR(255) DEFAULT NULL,
  user_name VARCHAR(100) DEFAULT NULL,
  route_name VARCHAR(255) DEFAULT NULL,
  original_receipt_json JSON NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_receipt_master_source (receipt_id, receipt_type),
  KEY idx_receipt_master_filters (receipt_date, bill_number, customer_name, user_name, route_name, receipt_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS receipt_edit_history (
  id INT NOT NULL AUTO_INCREMENT,
  receipt_id INT NOT NULL,
  bill_number VARCHAR(50) NOT NULL,
  receipt_type ENUM('Daily Sales Receipt','Daily Receipt Details','Purchase Receipt') NOT NULL,
  edited_by VARCHAR(100) NOT NULL,
  edited_date DATE NOT NULL,
  edited_time TIME NOT NULL,
  edit_reason VARCHAR(500) NOT NULL,
  before_receipt_json JSON NOT NULL,
  after_receipt_json JSON NOT NULL,
  version INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_receipt_edit_version (receipt_id, receipt_type, version),
  KEY idx_receipt_edit_latest (receipt_id, receipt_type, version),
  KEY idx_receipt_edit_date (edited_date, edited_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO receipt_master
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
    'route', COALESCE(a.route_detail, ''),
    'mobile_no', r.mobile_no,
    'note', r.note,
    'previous_balance', r.previous_balance,
    'deposite', r.deposite,
    'online_deposite_bank', r.online_deposite_bank,
    'online_deposite', r.online_deposite,
    'discount', r.discount,
    'carate_100', r.carate_100,
    'carate_150', r.carate_150,
    'carate_250', r.carate_250,
    'carate_350', r.carate_350,
    'deposite_carate_price', r.deposite_carate_price,
    'remaining', r.remaining,
    'created_at', r.created_at
  )
FROM receipt r
LEFT JOIN account_table a ON a.name = r.from_account;

INSERT IGNORE INTO receipt_master
  (receipt_id, bill_number, receipt_type, receipt_date, customer_name, user_name, route_name, original_receipt_json)
SELECT
  r.receipt_id,
  CAST(r.receipt_id AS CHAR),
  'Daily Sales Receipt',
  r.date,
  r.from_account,
  r.added_by,
  COALESCE(a.route_detail, ''),
  JSON_OBJECT(
    'receipt_id', r.receipt_id,
    'bill_number', CAST(r.receipt_id AS CHAR),
    'receipt_type', 'Daily Sales Receipt',
    'date', r.date,
    'customer_name', r.from_account,
    'user', r.added_by,
    'route', COALESCE(a.route_detail, ''),
    'mobile_no', r.mobile_no,
    'note', r.note,
    'previous_balance', r.previous_balance,
    'deposite', r.deposite,
    'online_deposite_bank', r.online_deposite_bank,
    'online_deposite', r.online_deposite,
    'discount', r.discount,
    'carate_100', r.carate_100,
    'carate_150', r.carate_150,
    'carate_250', r.carate_250,
    'carate_350', r.carate_350,
    'deposite_carate_price', r.deposite_carate_price,
    'remaining', r.remaining,
    'created_at', r.created_at
  )
FROM receipt r
LEFT JOIN account_table a ON a.name = r.from_account;

INSERT IGNORE INTO receipt_master
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
    'route', '',
    'gadi_number', p.gadi_number,
    'total_quantity', p.total_quantity,
    'expenses', p.expenses,
    'created_at', p.created_at
  )
FROM purchase p;

INSERT IGNORE INTO admin_access_config (name, status)
VALUES ('Edited Receipt', 'active');

INSERT IGNORE INTO access_config (name, status)
VALUES ('Edited Receipt', 'inactive');
