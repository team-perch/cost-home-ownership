CREATE TABLE IF NOT EXISTS properties(
  property_id uuid,
  zip_code int,
  redfin_cost_estimate int,
  insurance_rate int,
  property_tax_rate int,
  PRIMARY KEY (property_id),
);

CREATE TABLE IF NOT EXISTS loans(
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
  lender_id uuid,
  lender_logo_url text,
  lender_nmls int,
  PRIMARY KEY (loan_id),
)

CREATE TABLE IF NOT EXISTS lenders(
  lender_id uuid,
  lender_logo_url text,
  lender_nmls int,
  PRIMARY KEY (lender_id),
);

CREATE TABLE IF NOT EXISTS zips(
	zip_code uuid,
  property_tax_rate decimal,
  PRIMARY KEY (zip_code),
);


do loans by zip code and change the primary key
