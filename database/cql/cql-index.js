/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const cassandra = require('cassandra-driver');
const auth = require('./cql-auth');

const createDbConn = async (scopeAuth) => {
  const env = process.env.NODE_ENV || 'dev';
  const {
    user, password, host,
  } = scopeAuth[env];

  const options = {
    contactPoints: ['localhost', 'localhost', 'localhost'],
    localDataCenter: 'datacenter1',
    credentials: {
      username: scopeAuth[env].user,
      password: scopeAuth[env].password,
    },
    // pooling: {
    //   coreConnectionsPerHost: {
    //     [distance.local]: 2,
    //     [distance.remote]: 1,
    //   }
    // }
  };
  const client = new cassandra.Client(options);
  // const query = 'SELECT name, email FROM users WHERE key = ?';
  // const params = [];
  // client.execute(query, params)
  // .then(result => console.log('User with email %s', result.rows[0].email));
  const database = `perch_${env}`;
  const query1 = `DROP KEYSPACE IF EXISTS ${database};`;
  const query2 = `CREATE KEYSPACE ${database} WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };`;
  const query3 = `USE ${database};`;

  await client.connect();
  await client.execute(query1);
  await client.execute(query2);
  await client.execute(query3);
  //await client.end();

  // let cluster;
  // try {
  //   cluster = new pg.Pool({
  //     host,
  //     user,
  //     database,
  //     password,
  //     port,
  //   });
  // } catch (error) {
  //   console.log(`error creating pool for postgreSQL database '${database}'`);
  //   console.log(error);
  // }

  // console.log(`PostgreSQL connected for '${env}' env to database '${database}'`);
  return client;
};

const createDbTables = (conn) => {
  const schemaFile = path.resolve(__dirname, 'cql-schema.cql');
  const createDBQuery = fs.readFileSync(schemaFile).toString();
  const queriesArr = createDBQuery.split('\n\n');
  for (let i = 0; i < queriesArr.length; i += 1) {
    conn.execute(queriesArr[i]);
  }
  return conn;
};

const cleanDbTables = (conn) => {
  const queriesArr = [
    'TRUNCATE TABLE rates;',
    'TRUNCATE TABLE lenders;',
    'TRUNCATE TABLE properties;',
    'TRUNCATE TABLE zips;',
  ];
  for (let i = 0; i < queriesArr.length; i += 1) {
    conn.execute(queriesArr[i]);
  }
  return conn;
};

module.exports = {
  dbConn: createDbConn(auth).catch(console.log),
  createDbTables,
  cleanDbTables,
};
