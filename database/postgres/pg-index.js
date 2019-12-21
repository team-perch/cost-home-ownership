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

  const conn = new pg.Client({
    user,
    host,
    password,
    port,
    database: 'postgres',
  });
  // I tried to set up unique users but permission is denied - need to fix later
  // const setupUser = `
  //   CREATE ROLE ${scopeAuth[env].user} WITH LOGIN PASSWORD '${scopeAuth[env].password}';
  //   ALTER ROLE ${scopeAuth[env].user} CREATEDB;
  // `;
  const database = `loans_${env}`;
  const dropDb = `
    DROP DATABASE IF EXISTS ${database};
  `;
  const createDb = `
    CREATE DATABASE ${database};
  `;
  await conn.connect();
  // await conn.query(setupUser);
  await conn.query(dropDb);
  await conn.query(createDb);
  await conn.end();

  let pool;
  try {
    pool = new pg.Pool({
      host,
      user,
      database,
      password,
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
