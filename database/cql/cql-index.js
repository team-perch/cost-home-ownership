/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const auth = require('./cql-auth');

const createDbConn = async (scopeAuth) => {
  const env = process.env.NODE_ENV || 'dev';
  const {
    user, password, host,
  } = scopeAuth[env];

  const options = {
    contactPoints,
    localDataCenter,
    pooling: {
      coreConnectionsPerHost: {
        [distance.local]: 2,
        [distance.remote]: 1
      }
    }
  };

  const client = new Client(options);

  const state = client.getState();
  for (let host of state.getConnectedHosts()) {
    console.log('Host %s: open connections = %d; in flight queries = %d',
      host.address, state.getOpenConnections(host), state.getInFlightQueries(host));
  }


  const database = `perch_${env}`;
  const query = `
    DROP KEYSPACE ${database} IF EXISTS;
    CREATE KEYSPACE ${database} WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };

    USE ${database};
  `;
  await conn.query(query);
  await conn.end();




  let pool;
  try {
    pool = mysql.createPool({
      host,
      user,
      database,
      password,
      multipleStatements: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  } catch (error) {
    console.log(`error creating pool for mysql database '${database}'`);
    console.log(error);
  }

  console.log(`MySQL connected for '${env}' env to database '${database}'`);
  return pool;
};

const createDbTables = (conn) => {
  const schemaFile = path.resolve(__dirname, 'cql-schema.cql');
  const createDBQuery = fs.readFileSync(schemaFile).toString();

  return conn.query(createDBQuery);
};

const cleanDbTables = (conn) => {
  const query = `
    SET FOREIGN_KEY_CHECKS = 0;

    TRUNCATE TABLE rates;
    TRUNCATE TABLE lenders;
    TRUNCATE TABLE properties;
    TRUNCATE TABLE zips;

    SET FOREIGN_KEY_CHECKS = 1;
  `;
  return conn.query(query);
};

module.exports = {
  dbConn: createDbConn(auth).catch(console.log),
  createDbTables,
  cleanDbTables,
};
