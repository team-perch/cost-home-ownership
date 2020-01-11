/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { dbConn } = require('../database/postgres/pg-index.js');

const updateClientBundle = async () => {
  const url = 'https://hrsf-fec-nz.s3-us-west-2.amazonaws.com/bundle.js';
  const bundleFilePath = path.resolve(__dirname, '..', 'public', 'bundle.js');
  const writer = fs.createWriteStream(bundleFilePath);

  const res = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  res.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log('bundle updated from s3');
      resolve();
    });
    writer.on('error', (err) => {
      console.log('error retrieving bundle from s3');
      console.log(err);
      reject();
    });
  });
};

const getPropertyData = async (id) => {
  const query = 'SELECT * FROM "properties" JOIN "zips" ON "properties"."zip_code" = "zips"."zip_code" WHERE "property_id" = $1';

  const conn = await dbConn;
  return conn.query(query, [id]);
};

const addProperty = async (zip, propertyCost, homeInsuranceRate, hoa, constructionYear) => {
  const query = 'insert into properties (zip_code, property_cost, home_insurance_rate, hoa_monthly_dues, construction_year) values ($1, $2, $3, $4, $5)';
  // for example: 91326, 800000, 0.250, 300, 1950
  const conn = await dbConn;
  return conn.query(query, [
    zip,
    propertyCost,
    homeInsuranceRate,
    hoa,
    constructionYear,
  ]);
};

const deleteProperty = async (id) => {
  const query = 'delete from properties where property_id = $1';

  const conn = await dbConn;
  return conn.query(query, [id]);
};

const updateProperty = async (id, dataObj) => {
  let queryString = '';
  const keys = Object.keys(dataObj)
  keys.forEach((key) => {
    if (key !== 'property_id') {
      queryString += `${key}=${dataObj[key]}, `;
    }
  });
  queryString = queryString.substring(0, queryString.length - 2); // remove the last comma
  console.log(queryString)

  const query = `update properties set ${queryString} where property_id = $1`;

  const conn = await dbConn;
  return conn.query(query, [id]);
};

const getRates = async (cost, zip, term, type, downPay, credit, origYear) => {
  const query = `SELECT * FROM "loans" AS r JOIN "lenders" AS l
    ON r.lender_id = l.lender_id
    WHERE r.cost_low <= $1
    AND r.cost_high >= $2
    AND r.zip_code_low <= $3
    AND r.zip_code_high >= $4
    AND r.term = $5
    AND r.loan_type = $6
    AND r.down_payment_min <= $7
    AND r.credit_min <= $8
    AND r.origination_year = $9`;

  const financedCost = parseInt(cost * ((100 - downPay) / 100), 10);
  const conn = await dbConn;
  return conn.query(query, [
    financedCost,
    financedCost,
    zip,
    zip,
    term,
    type,
    downPay,
    credit,
    origYear,
  ]);
};

module.exports = {
  updateClientBundle,
  getPropertyData,
  getRates,
  addProperty,
  deleteProperty,
  updateProperty,
};
