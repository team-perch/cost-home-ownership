/* eslint-disable import/extensions */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import ErrorBoundary from './ErrorBoundary.jsx';
import Summary from './components/Summary.jsx';
import CostInputs from './components/CostInputs.jsx';
import Rates from './components/Rates.jsx';
import { formatLoan, unFormatLoan } from './utils';
import { AppContainer, ModuleHeader, Label } from './components/styles.jsx';

const localhost = 'http://localhost:3001';
const aws = 'http://ec2-52-52-118-225.us-west-1.compute.amazonaws.com';
const { origin } = window.location;
const host = (origin && !origin.includes('localhost')) ? aws : localhost;
if (host === localhost) {
  console.log(`using ${localhost} for API server since client loaded at 'localhost'`);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyId: props.id,
      zipCode: '',
      redfinCostEstimate: null,
      insuranceRate: null,
      propertyTaxRate: null,
      hoa: 200,
      cost: 10,
      loanType: formatLoan(30, 'Fixed'),
      loanTypes: [
        formatLoan(30, 'Fixed'),
        formatLoan(15, 'Fixed'),
        formatLoan(5, 'ARM'),
      ],
      downPay: 20,
      credit: 740,
      origYear: 2019,
      rateUser: 4.625,
      rates: [],
    };

    this.handleUserSubmit = this.handleUserSubmit.bind(this);
  }

  componentDidMount() {
    const { propertyId } = this.state;
    this.getPropertyData(propertyId);
  }

  async getPropertyData(id) {
    try {
      const res = await axios.get(`${host}/api/costHomeOwnership/properties?id=${id}`);
      const {
        propertyId,
        zipCode,
        redfinCostEstimate,
        insuranceRate,
        propertyTaxRate,
      } = await res.data[0];

      // TODO - change to server supplying available loanTypes
      this.setState({
        propertyId,
        zipCode,
        redfinCostEstimate,
        insuranceRate,
        propertyTaxRate,
        cost: redfinCostEstimate,
      }, this.getRates);
    } catch (err) {
      console.log(err);
    }
  }

  async getRates() {
    const {
      cost, zipCode, loanType, downPay, credit, origYear,
    } = this.state;

    const { term, type } = unFormatLoan(loanType);

    const queries = {
      cost, zipCode, term, type, downPay, credit, origYear,
    };

    const queryString = Object.keys(queries)
      .map((k) => `${k}=${queries[k]}`)
      .join('&');

    try {
      console.log(`${host}/api/costHomeOwnership/rates?${queryString}`);
      const res = await axios.get(`${host}/api/costHomeOwnership/rates?${queryString}`);
      const rates = await res.data;

      this.setState({ rates });
    } catch (err) {
      console.log(err);
    }
  }

  handleUserSubmit(stateKey, stateVal) {
    this.setState({ [stateKey]: stateVal }, this.getRates);
  }

  render() {
    const {
      insuranceRate,
      propertyTaxRate,
      loanType,
      loanTypes,
      credit,
      rateUser,
      rates,
      cost,
      hoa,
      downPay,
      redfinCostEstimate,
    } = this.state;

    return (
      <ErrorBoundary>
        <AppContainer>
          <ModuleHeader>
            <Label fontSize="1.375rem">
              Payment Calculator
            </Label>
          </ModuleHeader>
          <Summary
            insuranceRate={insuranceRate}
            propertyTaxRate={propertyTaxRate}
            loanType={loanType}
            rateUser={rateUser}
            cost={cost}
            hoa={hoa}
            downPay={downPay}
          />
          <CostInputs
            key={cost * downPay}
            handleUserSubmit={this.handleUserSubmit}
            cost={cost}
            downPay={downPay}
            redfinCostEstimate={redfinCostEstimate}
          />
          <Rates
            // add key
            handleUserSubmit={this.handleUserSubmit}
            loanType={loanType}
            loanTypes={loanTypes}
            credit={credit}
            cost={cost}
            rates={rates}
            downPay={downPay}
          />
        </AppContainer>
      </ErrorBoundary>
    );
  }
}

export default App;
