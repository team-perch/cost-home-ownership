# Project Name

> fRiend - Cost of Home Ownership module

## Related Projects

  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> API Endpoints

PROPERTIES
  GET /api/costHomeOwnership/properties?id
  Get basic info about the property
  Returns object with the basic info (propertyId, zipCode, redfinCostEstimate, insuranceRate, propertyTaxRate)

  POST /api/costHomeOwnership/properties/
  Add a new property
  Returns success message

  PUT /api/costHomeOwnership/properties?id
  Update the basic info about the property
  Returns the updated basic info object

  DELETE /api/costHomeOwnership/properties
  Delete a property

RATES (LOAN OFFERINGS)  (update name of endpoints noun that is not case sensitve, put the details here, don't put it in the code)
  GET /api/costHomeOwnership/rates?id
  Get all loan options for a property listing based on the query params cost, zipCode, term, type, downPay, credit, origYear
  Returns an array of loan option objects that have rateId, zipCode, apr, term, loanType, costLow, costHigh, downPaymentMin, lenderId

  POST /api/costHomeOwnership/rates
  Add a new loan option to a given property that match the query params
  Returns the new loan offering entry object

  PUT /api/costHomeOwnership/rates?id
  Update the specified loan option
  Returns the updated loan offering entry object

  DELETE /api/costHomeOwnership/rates
  Delete a specific rate loan offering

LENDERS
  GET /api/costHomeOwnership/lenders?id
  Get basic lender info based on the lender id
  Returns an array of basic lender information objects with lenderId, originationYear, lenderLogoUrl, lenderNmls

  POST /api/costHomeOwnership/lenders
  Add a new lender to the listing

  PUT /api/costHomeOwnership/lenders?id
  Update the specified lender info
  Returns the updated lender info object

  DELETE /api/costHomeOwnership/lenders
  Delete a specific lender




## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

# NZ-Service


# More Information


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

/* ********  DELETE REQUEST *********
DELETE request is sent to address:
    http:// [[SERVER NAME OR IP ADDRESS]] :3001/api/costHomeOwnership/properties

For example:
    http://localhost:3001/api/costHomeOwnership/properties

Ensure data to be sent follows below format:
      {"propertyId":2}

Result returned: success code and console logged sucess message
*/


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
