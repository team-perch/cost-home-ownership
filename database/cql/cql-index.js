/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const cassandra = require('cassandra-driver');
const Promise = require('bluebird');
const auth = require('./cql-auth');

const readFile = Promise.promisify(fs.readFile);

const createDbConn = async (scopeAuth) => {
  const env = process.env.NODE_ENV || 'dev';
  const { user, password, host } = scopeAuth[env];

  const options = {
    contactPoints: [scopeAuth[env].host],
    localDataCenter: 'datacenter1',
    credentials: {
      username: scopeAuth[env].user,
      password: scopeAuth[env].password,
    },
  };
  const client = new cassandra.Client(options);
  const database = `perch_${env}`;
  const query1 = `DROP KEYSPACE IF EXISTS ${database};`;
  const query2 = `CREATE KEYSPACE ${database} WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };`;
  const query3 = `USE ${database};`;

  await client.connect();
  await client.execute(query1);
  await client.execute(query2);
  await client.execute(query3);

  return client;
};

const createDbTables = async (conn) => {
  const schemaFile = path.resolve(__dirname, 'cql-schema.cql');
  const createDBQuery = await readFile(schemaFile, 'utf8');
  const queriesArr = createDBQuery.split('\n\n').filter((line) => line.length > 0);
  for (let i = 0; i < queriesArr.length; i += 1) {
    await conn.execute(queriesArr[i]);
  }
};

const cleanDbTables = async (conn) => {
  const queriesArr = [
    'TRUNCATE TABLE loans;',
    'TRUNCATE TABLE lenders;',
    'TRUNCATE TABLE properties;',
    'TRUNCATE TABLE zips;',
  ];
  for (let i = 0; i < queriesArr.length; i += 1) {
    await conn.execute(queriesArr[i]);
  }
};

module.exports = {
  dbConn: createDbConn(auth).catch(console.log),
  createDbTables,
  cleanDbTables,
};
