/* eslint-disable camelcase */
// This file compares the performance of the various databases

const pg_conn = require('./postgres/pg-index.js').dbConn;
const cql_conn = require('./cql/cql-index.js').dbConn;
const mysql_conn = require('./mysql/index.js').dbConn;

const startTime = Date.now();

// MySQL from Nick Z's legacy code
const mysql_getPropertyData = async (id) => {
  const query = `SELECT * FROM properties AS p JOIN zips AS z
    ON p.zip_code = z.zip_code
    WHERE property_id = ?`;
  const conn = await mysql_conn;
  return conn.execute(query, [id]);
};

const mysql_getRates = async (cost, zip, term, type, downPay, credit, origYear) => {
  const query = `SELECT * FROM rates AS r JOIN lenders AS l
    ON r.lender_id = l.lender_id
    WHERE r.cost_low <= ?
    AND r.cost_high >= ?
    AND r.zip_code = ?
    AND r.term = ?
    AND r.loan_type = ?
    AND r.down_payment_min <= ?
    AND r.credit_min <= ?
    AND r.origination_year = ?`;
  const conn = await mysql_conn;
  const financedCost = cost * ((100 - downPay) / 100);

  return conn.execute(query, [
    financedCost,
    financedCost,
    zip,
    term,
    type,
    downPay,
    credit,
    origYear,
  ]);
};

const pg_getPropertyData = async (id) => {
  const query = `SELECT * FROM properties AS p JOIN zips AS z
    ON p.zip_code = z.zip_code
    WHERE property_id = ?`;
  const conn = await pg_conn;
  return conn.execute(query, [id]);
};

const pg_getRates = async (cost, zip, term, type, downPay, credit, origYear) => {
  const query = `SELECT * FROM rates AS r JOIN lenders AS l
    ON r.lender_id = l.lender_id
    WHERE r.cost_low <= ?
    AND r.cost_high >= ?
    AND r.zip_code = ?
    AND r.term = ?
    AND r.loan_type = ?
    AND r.down_payment_min <= ?
    AND r.credit_min <= ?
    AND r.origination_year = ?`;
  const conn = await pg_conn;
  const financedCost = cost * ((100 - downPay) / 100);

  return conn.execute(query, [financedCost, financedCost, zip, term, type, downPay, credit, origYear]);
};

const cql_getPropertyData = async (id) => {
  const query = `SELECT * FROM properties AS p JOIN zips AS z
    ON p.zip_code = z.zip_code
    WHERE property_id = ?`;
  const conn = await cql_conn;
  return conn.execute(query, [id]);
};

const cql_getRates = async (cost, zip, term, type, downPay, credit, origYear) => {
  const query = `SELECT * FROM rates AS r JOIN lenders AS l
    ON r.lender_id = l.lender_id
    WHERE r.cost_low <= ?
    AND r.cost_high >= ?
    AND r.zip_code = ?
    AND r.term = ?
    AND r.loan_type = ?
    AND r.down_payment_min <= ?
    AND r.credit_min <= ?
    AND r.origination_year = ?`;
  const conn = await cql_conn;
  const financedCost = cost * ((100 - downPay) / 100);

  return conn.execute(query, [financedCost, financedCost, zip, term, type, downPay, credit, origYear]);
};

const id = 1000;
const cost = 1000000;
const zip = 91326;
const term = xx;
const type = xx;
const downPay = xx;
const credit = xx;
const origYear = xx;
mysql_getPropertyData(id);
mysql_getRates(cost, zip, term, type, downPay, credit, origYear);

module.exports = {
  mysql_getPropertyData,
  mysql_getRates,
  pg_getPropertyData,
  pg_getRates,
  cql_getPropertyData,
  cql_getRates,
};
