CREATE TABLE IF NOT EXISTS zips(
  zip_code INTEGER NOT NULL,
  property_tax_rate DECIMAL(5,3),
  CONSTRAINT zip_code PRIMARY KEY (zip_code)
);

-- property id is not set to serial/auto-increment to preserve behavior of endpoints from 1 to 1,000,000
CREATE TABLE IF NOT EXISTS properties(
  property_id SERIAL,
  zip_code INTEGER,
  property_cost MONEY,
  home_insurance_rate DECIMAL(5,3),
  hoa_monthly_dues MONEY,
  construction_year SMALLINT,
  FOREIGN KEY (zip_code) REFERENCES zips(zip_code),
  CONSTRAINT property_id PRIMARY KEY (property_id)
);

CREATE TABLE IF NOT EXISTS lenders(
  lender_id SERIAL,
  lender_logo_url TEXT,
  lender_nmls INTEGER,
  CONSTRAINT lender_id PRIMARY KEY (lender_id)
);

CREATE TABLE IF NOT EXISTS loans(
  loan_id SERIAL,
  lender_id INTEGER,
  zip_code INTEGER,
  apr DECIMAL(5,3),
  term SMALLINT,
  loan_type VARCHAR(5),
  cost_low MONEY,
  cost_high MONEY,
  down_payment_min DECIMAL(4,1),
  credit_min SMALLINT,
  origination_year INTEGER,
  FOREIGN KEY (zip_code) REFERENCES zips(zip_code),
  FOREIGN KEY (lender_id) REFERENCES lenders(lender_id),
  CONSTRAINT loan_id PRIMARY KEY (loan_id)
);