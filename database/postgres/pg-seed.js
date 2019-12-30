/* eslint-disable no-console */
const faker = require('faker/locale/en_US');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const { dbConn, createDbTables, cleanDbTables } = require('./pg-index');

const appendFile = Promise.promisify(fs.appendFile);

const seedZips = (conn, zips) => {
  const taxLow = 0.8;
  const taxRange = 0.4;

  let query = '';
  for (let i = 0; i < zips.length; i += 1) {
    const zip = zips[i];
    const taxRate = taxLow + faker.random.number(taxRange * 1000) / 1000;
    const partialQuery = `INSERT INTO zips (
      zip_code,
      property_tax_rate
      ) VALUES (
      ${zip},
      ${taxRate}
    );\n`;
    query += partialQuery;
  }

  return conn.query(query);
};

const seedLenders = (conn) => {
  // TODO - use S3 API to programmatically retrieve list of urls
  const lenderLogoUrls = [
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10271_logo.gif',
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10612_logo.gif',
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/7834_logo.gif',
  ];

  const lenderCount = 3;
  let query = '';
  for (let i = 0; i < lenderCount; i += 1) {
    const nmls = faker.random.number({ min: 100000, max: 999999 });
    const partialQuery = `INSERT INTO lenders (
      lender_logo_url,
      lender_nmls
      ) VALUES (
        '${lenderLogoUrls[i]}',
        ${nmls}
      );\n`;
    query += partialQuery;
  }

  return conn.query(query);
};

const seedLoans = (conn, zips) => {
  // weighted toward more popular options
  const terms = [3, 5, 7, 10, 10, 15, 15, 20, 30, 30, 30, 30];
  const types = ['ARM', 'Fixed', 'Fixed'];

  const loanCount = 10;
  let query = '';
  for (let i = 0; i < loanCount; i += 1) {
    const zip = zips[faker.random.number(zips.length - 1)];
    const apr = faker.random.number({ min: 4, max: 5.25, precision: 0.001 });
    const type = types[faker.random.number(types.length - 1)];
    const term = terms[faker.random.number(type === 'Fixed'
      ? { min: 4, max: terms.length - 1 }
      : 3)];
    const low = faker.random.number({ min: 10000, max: 2000000, precision: 10000 });
    const high = faker.random.number({ min: 1000000, max: 3500000, precision: 100000 });
    const downPaymentMin = faker.random.number({ min: 0, max: 20, precision: 10 });
    const creditMin = faker.random.number({ min: 660, max: 740, precision: 20 });
    const lenderId = faker.random.number({ min: 1, max: 3 });

    const partialQuery = `INSERT INTO loans (
      zip_code,
      apr,
      term,
      loan_type,
      cost_low,
      cost_high,
      down_payment_min,
      credit_min,
      lender_id,
      origination_year
    ) VALUES (
      ${zip},
      ${apr},
      ${term},
      '${type}',
      ${low},
      ${high},
      ${downPaymentMin},
      ${creditMin},
      ${lenderId},
      2019
    );\n`;
    query += partialQuery;
  }

  return conn.query(query);
};

const buildPropertiesString = async (conn, zips) => {
  const costLow = 600000;
  const costHigh = 2000000;

  const insuranceLow = 0.1;
  const insuranceHigh = 0.2;

  const hoaDuesLow = 0;
  const hoaDuesHigh = 1000;

  const constructionYearLow = 1900;
  const constructionYearHigh = 2019;

  const propertyCount = 1000000; // edit this as needed
  let query = '';
  for (let j = 1; j <= propertyCount; j += 1) {
    const zip = zips[faker.random.number(zips.length - 1)];
    const cost = costLow + faker.random.number(costHigh / 10000) * 10000;
    const insuranceRate = insuranceLow + faker.random.number(insuranceHigh * 100) / 100;
    const hoaDues = hoaDuesLow + faker.random.number(hoaDuesHigh / 10) * 10;
    const constrYear = faker.random.number({ min: constructionYearLow, max: constructionYearHigh });

    const partialQuery = `${zip},${cost},${insuranceRate},${hoaDues},${constrYear}\n`;
    query += partialQuery;
  }
  return query;
};

const createCSV = async (query) => {
  if (!fs.existsSync('queries/query.csv')) {
    await appendFile('queries/query.csv', query)
      .then((err) => {
        if (err) {
          throw err;
        }
        console.log('I wrote the file!');
      });
  }
};

const seedFromCSV = (csvPath, conn) => {
  conn.query(`COPY properties(zip_code, property_cost, home_insurance_rate, hoa_monthly_dues, construction_year) FROM '${csvPath}' DELIMITER ',';`)
    .then(() => {
      console.log('I read the file!');
    });
};

const seedDb = async (conn) => {
  const db = await conn;

  let sharedZips = new Set();
  while (sharedZips.size < 10) {
    const zip = faker.address.zipCode();
    if (zip.length === 5) {
      sharedZips.add(zip);
    }
  }
  sharedZips = [...sharedZips];

  await createDbTables(db);
  console.log('created database tables if non-existant');

  await cleanDbTables(db);
  console.log('cleaned database tables');

  await seedZips(db, sharedZips);
  console.log('seeded zips table');

  await seedLenders(db);
  console.log('seeded lenders table');

  await seedLoans(db, sharedZips);
  console.log('seeded loans table');

  await buildPropertiesString(db, sharedZips) // my async here is not working because the file is getting read before written for one of the 10 loops - fix later
    .then(async (result) => {
      await createCSV(result);
    })
    .then(() => {
      for (let i = 0; i < 10; i += 1) {
        seedFromCSV(path.resolve('queries/query.csv'), db);
      }
    });
  // await db.end();
};

seedDb(dbConn).catch(console.log);
