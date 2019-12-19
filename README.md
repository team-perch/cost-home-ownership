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

RATES (LOAN OFFERINGS)
  GET /api/costHomeOwnership/rates?id
  Get all loan options for a property listing based on the query params cost, zipCode, term, type, downPay, credit, origYear
  Returns an array of loan option objects that have rateId, zipCode, apr, term, loanType, costLow, costHigh, downPaymentMin, lenderId

  POST /api/costHomeOwnership/rates
  Add a new loan option to a given property that match the query params
  Returns the new image entry object

  PUT /api/costHomeOwnership/rates?id
  Update the specified loan option
  Returns the updated image entry object

  DELETE /api/costHomeOwnership/rates
  Delete a specific rate loan offering

LENDERS
  GET /api/costHomeOwnership/lenders?id
  Get basic lender info based on the lender id
  Returns an array of basic lender information lenderId, originationYear, lenderLogoUrl, lenderNmls

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