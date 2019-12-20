
CREATE TABLE IF NOT EXISTS properties(
  property_id uuid,
  zip_code varchar(10),
  redfin_cost_estimate int,
  insurance_rate decimal(5,3),
	zip_code varchar(10),
  property_tax_rate decimal(5,3),
  PRIMARY KEY (property_id),
);


CREATE TABLE IF NOT EXISTS loans(
  rate_id uuid,
  zip_code varchar(10),
  apr decimal(5,3),
  term int,
  loan_type varchar(5),
  cost_low int,
  cost_high int,
  down_payment_min int,
  credit_min int,
  origination_year int,
  lender_id uuid,
  lender_logo_url varchar(80),
  lender_nmls int,
  PRIMARY KEY (rate_id),
) WITH CLUSTERING ORDER BY (lender_id DESC)

CREATE TABLE IF NOT EXISTS lenders(
  lender_id uuid,
  lender_logo_url varchar(80),
  lender_nmls int,
  PRIMARY KEY (rate_id),
);

CREATE TABLE IF NOT EXISTS taxrates(
	zip_code uuid,
  property_tax_rate decimal(5,3),
  PRIMARY KEY (zip_code),
);
