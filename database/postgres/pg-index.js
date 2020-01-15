const fs = require('fs');
const path = require('path');
const pg = require('pg');
const auth = require('./pg-auth');

const port = 5432;

// Connect to PostgreSQL db
const createDbConn = async (scopeAuth) => {
  const env = process.env.NODE_ENV || 'dev';
  const {
    user, password, host,
  } = scopeAuth[env];

  //const database = `loans_${env}`;
  const database = `loans_dev`;

  // Need to fix - can create the database using the database interface for seeding instead of the below because if I leave this as is, it drops the database and re-creates it, but doesn't re-seed it

  // const conn = new pg.Client({
  //   user,
  //   host,
  //   password,
  //   port,
  //   database: 'postgres',
  // });
  // // I tried to set up unique users but permission is denied - need to fix later
  // // const setupUser = `
  // //   CREATE ROLE ${scopeAuth[env].user} WITH LOGIN PASSWORD '${scopeAuth[env].password}';
  // //   ALTER ROLE ${scopeAuth[env].user} CREATEDB;
  // // `;


  // const dropDb = `
  //   DROP DATABASE IF EXISTS ${database};
  // `;
  // const createDb = `
  //   CREATE DATABASE ${database};
  // `;
  // await conn.connect();
  // // await conn.query(setupUser);
  // await conn.query(dropDb);
  // await conn.query(createDb);
  // await conn.end();

  let pool;
  try {
    pool = new pg.Pool({
      host: '3.134.116.61',
      user: 'suejungshin',
      database,
      password: 'postgres',
      port,
    });
  } catch (error) {
    console.log(`error creating pool for postgreSQL database '${database}'`);
    console.log(error);
  }

  console.log(`PostgreSQL connected for '${env}' env to database '${database}'`);
  return pool;
};

const createDbTables = (conn) => {
  const schemaFile = path.resolve(__dirname, 'pg-schema.sql');
  const createDBQuery = fs.readFileSync(schemaFile).toString();

  return conn.query(createDBQuery);
};

const cleanDbTables = (conn) => {
  // using CASCADE removes error 'cannot truncate a table referenced in a foreign key' constraint
  const query = `
    TRUNCATE TABLE loans CASCADE;
    TRUNCATE TABLE lenders CASCADE;
    TRUNCATE TABLE properties CASCADE;
    TRUNCATE TABLE zips CASCADE;
  `;
  return conn.query(query);
};

module.exports = {
  dbConn: createDbConn(auth).catch(console.log),
  createDbTables,
  cleanDbTables,
};
