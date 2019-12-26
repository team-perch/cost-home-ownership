/* eslint-disable no-console */
const faker = require('faker/locale/en_US');
const { dbConn, createDbTables, cleanDbTables } = require('./cql-index');

const seedZips = (conn, zips) => {
  const taxLow = 0.8;
  const taxRange = 0.4;

  const queriesArr = [];
  for (let i = 0; i < zips.length; i += 1) {
    const zip = zips[i];
    const taxRate = taxLow + faker.random.number(taxRange * 1000) / 1000;
    const partialQuery = `INSERT INTO "perch_dev"."zips" (zip_code, property_tax_rate) VALUES (${zip}, ${taxRate});`;
    queriesArr.push(partialQuery);
  }
  return conn.batch(queriesArr);
};

const seedProperties = (conn, zips) => {
  const costLow = 600000;
  const costRange = 2000000;

  const insuranceLow = 0.1;
  const insuranceRange = 0.2;

  const propertyCount = 10;
  const queriesArr = [];
  for (let i = 1; i <= propertyCount; i += 1) {
    const zip = zips[faker.random.number(zips.length - 1)];
    const cost = costLow + faker.random.number(costRange / 10000) * 10000;
    const insuranceRate = insuranceLow + faker.random.number(insuranceRange * 100) / 100;
    const partialQuery = `INSERT INTO "perch_dev"."properties" (
      property_id,
      zip_code,
      redfin_cost_estimate,
      insurance_rate
      ) VALUES (
        uuid(),
        ${zip},
        ${cost},
        ${insuranceRate}
      );`;
    queriesArr.push(partialQuery);
  }

  return conn.batch(queriesArr);
};

const seedLenders = (conn) => {
  // TODO - use S3 API to programmatically retrieve list of urls
  const lenderLogoUrls = [
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10271_logo.gif',
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10612_logo.gif',
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/7834_logo.gif',
  ];

  const lenderCount = 3;
  const queriesArr = [];
  for (let i = 0; i < lenderCount; i += 1) {
    const nmls = faker.random.number({ min: 100000, max: 999999 });
    const partialQuery = `INSERT INTO "perch_dev"."lenders" (lender_id, lender_logo_url, lender_nmls) VALUES (uuid(), '${lenderLogoUrls[i]}', ${nmls});`;
    queriesArr.push(partialQuery);
  }

  return conn.batch(queriesArr);
};

const seedLoans = (conn, zips) => {
  // weighted toward more popular options
  const terms = [3, 5, 7, 10, 10, 15, 15, 20, 30, 30, 30, 30];
  const types = ['ARM', 'Fixed', 'Fixed'];

  const loanCount = 10;
  const queriesArr = [];
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
    // const lenderId = faker.random.number({ min: 1, max: 3 });

    const partialQuery = `INSERT INTO "perch_dev"."loans" (
      loan_id,
      zip_code,
      apr,
      term,
      loan_type,
      cost_low,
      cost_high,
      down_payment_min,
      credit_min,
      origination_year
    ) VALUES (
      uuid(),
      '${zip}',
      ${apr},
      ${term},
      '${type}',
      ${low},
      ${high},
      ${downPaymentMin},
      ${creditMin},
      2019
    );`;
    queriesArr.push(partialQuery);
  }

  return conn.batch(queriesArr);
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

  // await cleanDbTables(db);
  // console.log('cleaned database tables');

  // await seedZips(db, sharedZips);
  // console.log('seeded zips table');

  // await seedLenders(db);
  // console.log('seeded lenders table');

  // await seedLoans(db, sharedZips);
  // console.log('seeded rates table');

  // await seedProperties(db, sharedZips);
  // console.log('seeded properties table');


  await setTimeout(() => seedZips(db, sharedZips), 1000)
  await setTimeout(() => seedLenders(db), 1000)
  await setTimeout(() => seedLoans(db, sharedZips), 1000)
  await setTimeout(() => seedProperties(db, sharedZips), 1000)
  // await db.end();
};

seedDb(dbConn).catch(console.log);
