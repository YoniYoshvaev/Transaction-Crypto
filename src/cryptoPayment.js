import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CryptoPayment = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  const adminWallet = '0x2f3673C7Cef039016de39fF7fbde35cA1De861eF'; 

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);
        setWalletConnected(true);
      } catch (error) {
        setMessage('Error connecting wallet');
      }
    } else {
      setMessage('Please install MetaMask');
    }
  };

  const handlePayment = async () => {
    try {
      if (!window.ethereum) {
        setMessage('Please install MetaMask');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const amountInEther = ethers.utils.parseEther(amount); 

      const tx = await signer.sendTransaction({
        to: adminWallet,
        value: amountInEther,
      });

      setTransactionHash(tx.hash);
      setMessage('Transaction sent, waiting for confirmation...');
      
      checkTransactionStatus(tx.hash, provider);
    } catch (error) {
      setMessage(`Payment failed: ${error.message}`);
    }
  };

  const checkTransactionStatus = async (txHash, provider) => {
    const receipt = await provider.waitForTransaction(txHash);
    if (receipt.status === 1) {
      setMessage('Payment successful!');
    } else {
      setMessage('Payment failed: Transaction was reverted.');
    }
  };

  useEffect(() => {
    if (walletConnected) {
      setMessage(`Connected: ${account}`);
    }
  }, [walletConnected, account]);

  return (
    <div className="max-w-md mx-auto p-4 bg-indigo-100 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Crypto Payment</h2>
      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">Amount (ETH):</label>
            <input
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="mt-3 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm p-2 transition-colors duration-300"
/>

          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Pay
          </button>
        </>
      )}
      {message && <p className="mt-4 text-sm text-indigo-500">{message}</p>}
    </div>
  );
};

export default CryptoPayment;
