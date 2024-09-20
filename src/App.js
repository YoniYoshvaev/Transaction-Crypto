import React from 'react';
import CryptoPayment from './cryptoPayment';

const App = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Payment Page</h1>
      <CryptoPayment />
    </div>
  );
};

export default App;
