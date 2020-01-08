/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const controller = require('./pg-controller');
// const controller = require('./mysql-controller');
const keysToCamel = require('./camelCaseUtil');

const app = express();
app.use(cors());
app.use(compression());

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use('/loaderio-a8e10d693710fa4af7998b0dfb02bc89.txt', express.static(path.resolve(__dirname, '..', '/loaderio-a8e10d693710fa4af7998b0dfb02bc89.txt')));
app.use(bodyParser.urlencoded({ extended: false }));

// PROPERTIES

app.get('/api/costHomeOwnership/properties', async (req, res) => {
  // TODO - check security implications
  const { id } = req.query;
  if (id === undefined) {
    res.status(400).end('missing query parameters');
    return;
  }
  try {
    const propertyInfo = await controller.getPropertyData(id);
    res.json(keysToCamel(propertyInfo.rows));
  } catch (err) {
    console.log(err);
    res.status(500).end('server could not retrieve property data');
  }
});

app.post('/api/costHomeOwnership/properties', async (req, res) => {
  const {
    zip,
    propertyCost,
    homeInsuranceRate,
    hoa,
    constructionYear,
  } = req.body;
  if (req.body === undefined) {
    res.status(400).end('missing parameters');
    return;
  }
  try {
    await controller.addProperty(zip, propertyCost, homeInsuranceRate, hoa, constructionYear);
    res.status(200).end('inserted new property!');
  } catch (err) {
    console.log(err);
    res.status(500).end('server could not retrieve property data');
  }
});

app.delete('/api/costHomeOwnership/properties', async (req, res) => {
  const { id } = req.query;
  if (id === undefined) {
    res.status(400).end('missing query parameters');
    return;
  }
  try {
    const propertyInfo = await controller.deleteProperty(id);
    res.json(`You just deleted this many rows: ${propertyInfo.rowCount}`);
  } catch (err) {
    console.log(err);
    res.status(500).end('server could not delete property data');
  }
});

app.patch('/api/costHomeOwnership/properties', async (req, res) => {
  const updatesObj = req.query;
  const { property_id } = req.query;
  if (property_id === undefined) {
    res.status(400).end('missing query parameters');
    return;
  }
  try {
    const propertyInfo = await controller.updateProperty(property_id, updatesObj);
    res.json(`You updated this many rows: ${propertyInfo.rowCount}`);
  } catch (err) {
    console.log(err);
    res.status(500).end('server could not retrieve property data');
  }
});


// RATES

app.get('/api/costHomeOwnership/rates', async (req, res) => {
  // TODO - check security implications
  const queries = req.query;
  const params = ['cost', 'zipCode', 'term', 'type', 'downPay', 'credit', 'origYear'];
  for (let i = 0; i < params.length; i += 1) {
    if (queries[params[i]] === undefined) {
      res.status(400).end('missing query parameters');
      return;
    }
  }
  const {
    cost, zipCode, term, type, downPay, credit, origYear,
  } = queries;
  try {
    const rates = await controller.getRates(
      cost, zipCode, term, type, downPay, credit, origYear,
    );
    res.json(keysToCamel(rates.rows));
  } catch (err) {
    console.log(err);
    res.status(500).end('server could not retrieve rates data');
  }
});

app.post('/api/costHomeOwnership/rates', async (req, res) => {
  // Write function to post req.body to the database based on the propertyId. If the propertyId is already taken, confirm if the user wants it to be overwritten
});

app.put('/api/costHomeOwnership/rates', async (req, res) => {
  // Write function to update req.body to the database based on the propertyId. If the propertyId is already taken, confirm if the user wants it to be created new
});

app.delete('/api/costHomeOwnership/rates', async (req, res) => {
  // Write function to delete req.body to the database based on the propertyId. If the propertyId doesn't exist, confirm with user what they want to delete
});

module.exports = app;
