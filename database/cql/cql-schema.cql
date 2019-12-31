CREATE TABLE IF NOT EXISTS properties(
  property_id int,
  zip_code int,
  property_cost int,
  home_insurance_rate decimal,
  hoa_monthly_dues decimal,
  construction_year int,
  PRIMARY KEY (property_id),
);

CREATE TABLE IF NOT EXISTS loans(
  lender_id uuid,
  lender_logo_url text,
  lender_nmls int,
  loan_id uuid,
  zip_code text,
  apr decimal,
  term int,
  loan_type text,
  cost_low decimal,
  cost_high decimal,
  down_payment_min int,
  credit_min int,
  origination_year int,
  PRIMARY KEY (lender_id, loan_id),
);

CREATE TABLE IF NOT EXISTS lenders(
  lender_id uuid,
  loan_id uuid,
  lender_logo_url text,
  lender_nmls int,
  PRIMARY KEY (lender_id, loan_id),
);

CREATE TABLE IF NOT EXISTS zips(
	zip_code int,
  property_tax_rate decimal,
  PRIMARY KEY (zip_code),
);