/* eslint-disable import/extensions */
import React from 'react';
import { FullContainer, HalfContainer } from './styles.jsx';
import LoanType from './Rates/LoanType.jsx';
// import CreditScore from './Rates/CreditScore.jsx';

const Rates = (props) => {
  const {
    handleUserSubmit, loanTerm, loanType,
  } = props;

  return (
    <div>
      <FullContainer>
        <HalfContainer>
          <LoanType
            loanTerm={loanTerm}
            loanType={loanType}
            handleUserSubmit={handleUserSubmit}
          />
        </HalfContainer>
        <HalfContainer>
          {/* <CreditScore
            credit={credit}
            handleUserSubmit={handleUserSubmit}
          /> */}
        </HalfContainer>
      </FullContainer>
      <FullContainer>
        {/* Loans component */}
      </FullContainer>
      {/* view all rates footer */}
    </div>
  );
};

export default Rates;
