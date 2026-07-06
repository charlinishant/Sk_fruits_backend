=-- Indexes for account_table
CREATE INDEX idx_route_detail ON account_table (route_detail);
CREATE INDEX idx_account_group ON account_table(account_group);
CREATE INDEX idx_current_balance ON account_table(current_balance);
CREATE INDEX idx_name ON account_table (name);
CREATE INDEX idx_id ON account_table (id);
CREATE INDEX idx_route_detail_name ON account_table (route_detail, name);
CREATE INDEX idx_account_filters ON account_table(account_group, current_balance, route_detail);
CREATE INDEX idx_account_group_name ON account_table(account_group, name);
CREATE INDEX idx_name_address_account_group ON account_table (name, address, account_group);
CREATE INDEX idx_mobile_no ON account_table (mobile_no);
CREATE INDEX idx_last_update ON account_table (last_update);
CREATE INDEX idx_account_group_mobile_no ON account_table (account_group, mobile_no);
CREATE INDEX idx_account_table_group_name_route ON account_table(account_group, name, route_detail);

-- Indexes for sale_table
CREATE INDEX idx_sale_date ON sale_table (date);
CREATE INDEX idx_sale_route ON sale_table (route);
CREATE INDEX idx_sale_added_by ON sale_table (added_by);
CREATE INDEX idx_sale_table_cust_name ON sale_table (cust_name);
CREATE INDEX idx_sale_table_added_by ON sale_table (added_by);
CREATE INDEX idx_sale_table_bill_no ON sale_table (bill_no);
CREATE INDEX idx_sale_date_route_added_by ON sale_table (date, route, added_by);
CREATE INDEX idx_sale_filters ON sale_table(date, cust_name, route, added_by, bill_no);
CREATE INDEX idx_date_added_by ON sale_table (date, added_by);
CREATE INDEX idx_sale_table_date_added_by_cust_name ON sale_table(date, added_by, cust_name);

-- Indexes for receipt table
CREATE INDEX idx_receipt_date ON receipt (date);
CREATE INDEX idx_receipt_id ON receipt (receipt_id);
CREATE INDEX idx_receipt_from_account ON receipt (from_account);
CREATE INDEX idx_receipt_added_by ON receipt (added_by);
CREATE INDEX idx_remaining ON receipt(remaining);
CREATE INDEX idx_previous_balance ON receipt(previous_balance);
CREATE INDEX idx_carate_100 ON receipt(carate_100);
CREATE INDEX idx_carate_150 ON receipt(carate_150);
CREATE INDEX idx_carate_250 ON receipt(carate_250);
CREATE INDEX idx_carate_350 ON receipt(carate_350);
CREATE INDEX idx_receipt_receipt_id_from_account ON receipt(receipt_id, from_account);
CREATE INDEX idx_receipt_date_from_account_added_by ON receipt (date, from_account, added_by);
CREATE INDEX idx_date_added_by ON receipt (date, added_by);
CREATE INDEX idx_validate ON receipt (validate);

-- Indexes for ledger table
CREATE INDEX idx_ledger_date ON ledger (date);
CREATE INDEX idx_ledger_route ON ledger (route);
CREATE INDEX idx_ledger_customer_name ON ledger (customer_name);
CREATE INDEX idx_summary ON ledger(summary);
CREATE INDEX idx_ledger_added_by ON ledger (added_by);
CREATE INDEX idx_ledger_date_route_customer_name_added_by ON ledger (date, route, customer_name, added_by);
CREATE INDEX idx_ledger_date_route_customer_name ON ledger (date, route, customer_name);

-- Indexes for payment table
CREATE INDEX idx_payment_date ON payment (date);
CREATE INDEX idx_payment_to_account ON payment(to_account);
CREATE INDEX idx_payment_date_to_account ON payment(date, to_account);
CREATE INDEX idx_p_id ON payment (p_id);

-- Indexes for purchase table
CREATE INDEX idx_purchase_gadi_number ON purchase (gadi_number);
CREATE INDEX idx_purchase_date ON purchase (date);
CREATE INDEX idx_purchase_supplier_name ON purchase (supplier_name);
CREATE INDEX idx_purchase_id ON purchase (id);
CREATE INDEX idx_purchase_date_supplier ON purchase(date, supplier_name);

-- Indexes for purchase product table
CREATE INDEX idx_purchase_product_purchase_id ON purchase_product (purchase_id);
CREATE INDEX idx_purchase_product_bata ON purchase_product (bata);
CREATE INDEX idx_p_date ON purchase_product (p_date);

-- Indexes for Stock table
CREATE INDEX idx_stock_purchase_id ON stock (purchase_id);
CREATE INDEX idx_stock_date ON stock(date);
CREATE INDEX idx_stock_bata ON stock(bata);
CREATE INDEX idx_stock_product_name ON stock(product_name);
CREATE INDEX idx_stock_gadi_number ON stock(gadi_number);
CREATE INDEX idx_stock_supplier_name ON stock(supplier_name);
CREATE INDEX idx_stock_filters ON stock(date, bata, product_name, gadi_number, supplier_name, purchase_id);

-- Indexes for Carate Report table
CREATE INDEX idx_cr_summary ON carate_report(summary);

-- Indexes on sale_product
CREATE INDEX idx_sale_product_bill_id ON sale_product(bill_id);
CREATE INDEX idx_bata ON sale_product(bata);

-- Index on access_config table
CREATE INDEX idx_access_config_name ON access_config(name);
CREATE INDEX idx_access_config_status ON access_config(status);
CREATE INDEX idx_access_config_id ON access_config(id);
CREATE INDEX idx_access_config_name_status ON access_config(name, status);

-- Index on account_group_table table
CREATE UNIQUE INDEX idx_id ON account_group_table (id);
CREATE INDEX idx_name ON account_group_table (name);

-- Index on carate_bill table
CREATE UNIQUE INDEX idx_id ON carate_bill (id);
CREATE INDEX idx_user_id ON carate_bill (user_id);
CREATE INDEX idx_bill_id ON carate_bill (bill_id);

-- Index on carate_user table
CREATE UNIQUE INDEX idx_user_id ON carate_user (user_id);
CREATE INDEX idx_caretes ON carate_user (carate_100, carate_150, carate_250, carate_350);

-- Index on category table
CREATE UNIQUE INDEX idx_id ON category (id);
CREATE UNIQUE INDEX idx_name ON category (name);

-- Index on footer_config table
CREATE INDEX idx_footer_config_name ON footer_config (name);
CREATE INDEX idx_footer_config_id ON footer_config (id);
CREATE INDEX idx_footer_config_name_status ON footer_config (name, status);

-- Index on supplier_outstanding table
CREATE INDEX idx_supplier_outstanding_id ON supplier_outstanding (id);
CREATE INDEX idx_supplier_name ON supplier_outstanding (supplier_name);

-- Indexes for product table
CREATE INDEX idx_product_id ON product (id);
CREATE INDEX idx_product_category_is_active ON product (category, is_active);

-- Indexes for route table
CREATE INDEX idx_route_id ON route(id);

-- Indexes for user_table 
CREATE INDEX idx_user_table_username ON user_table(username);
CREATE INDEX idx_user_table_username_password ON user_table(username, password);
CREATE INDEX idx_user_table_id ON user_table(id);

