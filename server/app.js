/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const controller = require('./controller');
const keysToCamel = require('./camelCaseUtil');

const app = express();
app.use(cors());
app.use(compression());

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({extended: false}));


/* Client side individual pages get rendered at:
     http:// [[SERVER NAME OR IP ADDRESS]] :3001/?id= [[ NUMBER BETWEEN 1 AND 100 ]]
   For example:
     http://localhost:3001/?id=2
 */


/*  *******************
       PROPERTIES
************************ */

/* ********  GET REQUEST *********
GET request is sent to address:
    http:// [[SERVER NAME OR IP ADDRESS]] :3001/api/costHomeOwnership/properties?id=${id}

Query parameter: id number between 1 and 100

For example:
    http://localhost:3001/api/costHomeOwnership/properties?id=2

The result returned looks like the below:
    [
      {"propertyId":2,
      "zipCode":"74716",
      "redfinCostEstimate":780000,
      "insuranceRate":"0.130",
      "propertyTaxRate":"0.900"}
    ]
*/

app.get('/api/costHomeOwnership/properties', async (req, res) => {
  // TODO - check security implications
  const { id } = req.query;
  if (id === undefined) {
    res.status(400).end('missing query parameters');
    return;
  }

  try {
    const [properties] = await controller.getPropertyData(id);
    res.json(keysToCamel(properties));
  } catch (err) {
    res.status(500).end('server could not retrieve property data');
  }
});

/* ********  POST REQUEST *********
POST request is sent to address:
    http:// [[SERVER NAME OR IP ADDRESS]] :3001/api/costHomeOwnership/properties

For example:
    http://localhost:3001/api/costHomeOwnership/properties

Ensure data to be sent follows below format:
      {"propertyId":2,
      "zipCode":"74716",
      "redfinCostEstimate":780000,
      "insuranceRate":"0.130",
      "propertyTaxRate":"0.900"}

Result returned: success code and console logged sucess message

*/

app.post('/api/costHomeOwnership/properties', async (req, res) => {
  // Write function to post req.body to the database based on the propertyId. If the propertyId is already taken, confirm if the user wants it to be overwritten
});


/* ********  PUT (UPDATE) REQUEST *********
PUT request is sent to address:
    http:// [[SERVER NAME OR IP ADDRESS]] :3001/api/costHomeOwnership/properties?id=${id}

Query parameter: id number between 1 and 100

For example:
    http://localhost:3001/api/costHomeOwnership/properties?id=2

Ensure data to be sent follows below format:
      {"propertyId":2,
      "zipCode":"74716",
      "redfinCostEstimate":780000,
      "insuranceRate":"0.130",
      "propertyTaxRate":"0.900"}

Result returned: success code and copy of new object

*/

app.put('/api/costHomeOwnership/properties', async (req, res) => {
// Write function to update req.body to the database based on the propertyId. If the propertyId is already taken, confirm if the user wants it to be created new
});


/* ********  DELETE REQUEST *********
DELETE request is sent to address:
    http:// [[SERVER NAME OR IP ADDRESS]] :3001/api/costHomeOwnership/properties

For example:
    http://localhost:3001/api/costHomeOwnership/properties

Ensure data to be sent follows below format:
      {"propertyId":2}

Result returned: success code and console logged sucess message
*/

app.delete('/api/costHomeOwnership/properties', async (req, res) => {
// Write function to delete req.body to the database based on the propertyId. If the propertyId doesn't exist, confirm with user what they want to delete
});


/* ****************************
******************************* */


/*  *******************
       RATES
************************ */

/* ********  GET REQUEST *********
GET request is sent to address:
    http:// [[SERVER NAME OR IP ADDRESS]] :3001/api/costHomeOwnership/rates?id=${id}

Query parameters include:
  cost, zipCode, term, type, downPay, credit, origYear

For example:
    http://localhost:3001/api/costHomeOwnership/rates?cost=2290000&zipCode=80354&term=30&type=Fixed&downPay=20&credit=740&origYear=2019

The result returned looks like the below, based on entries of
 loan options that would be available to a given person based on their
 inputted information for cost, zipCode, term, type, downPay, credit, origYear
[
  {"rateId":27,
  "zipCode":"80354",
  "apr":"4.617",
  "term":30,
  "loanType":"Fixed",
  "costLow":400000,
  "costHigh":2500000,
  "downPaymentMin":"0.0",
  "creditMin":680,
  "lenderId":1,
  "originationYear":2019,
  "lenderLogoUrl":"https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10271_logo.gif",
  "lenderNmls":619100
},
  {"rateId":125,
  "zipCode":"80354",
  "apr":"4.744",
  "term":30,
  "loanType":"Fixed",
  "costLow":790000,
  "costHigh":2000000,
  "downPaymentMin":"20.0",
  "creditMin":740,
  "lenderId":3,
  "originationYear":2019,
  "lenderLogoUrl":"https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/7834_logo.gif",
  "lenderNmls":772116}
]
*/

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
    const [rates] = await controller.getRates(
      cost, zipCode, term, type, downPay, credit, origYear,
    );
    res.json(keysToCamel(rates));
  } catch (err) {
    res.status(500).end('server could not retrieve rates data');
  }
});

/* ********  POST REQUEST *********
POST request is sent to address:
    http:// [[SERVER NAME OR IP ADDRESS]] :3001/api/costHomeOwnership/rates

For example:
    http://localhost:3001/api/costHomeOwnership/rates

Post requests are submitted to add potential loan options for buyers.
The data to be sent looks like the below:
  {"zipCode":"80354",
  "apr":"4.617",
  "term":30,
  "loanType":"Fixed",
  "costLow":400000,
  "costHigh":2500000,
  "downPaymentMin":"0.0",
  "creditMin":680,
  "lenderName": "FirstMidwestBank"}

The database would have to be queried to find the lender name listed
  {"lenderId":1,
  "originationYear":2019,
  "lenderLogoUrl":"https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10271_logo.gif",
  "lenderNmls":619100}
*/




module.exports = app;
