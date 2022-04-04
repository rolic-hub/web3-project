import React, { createContext, useEffect, useState, useContext } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constant";

const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactioncount")
  );
  const [usetransactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionContract = getEthereumContract();
        const availableTransactions =
          await transactionContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );
        console.log(structuredTransactions)

        setTransactions(structuredTransactions);
      } else {
        console.log("ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isWalletConnected = async () => {
    try {
      if (!ethereum) {
        alert("please install metamask");
      } else {
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          getAllTransactions();
        } else {
          console.log("No accounts found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransExist = async () => {
    try {
      if (ethereum) {
        const transactionContract = getEthereumContract();
        const currentTransactioncount =
          await transactionContract.getTransactionCount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactioncount
        );
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransactions = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            }
          ],
        });

        const transactionHash = await transactionContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();

        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount =
          await transactionContract.getTransactionCount();
        setTransactionCount(transactionsCount.toNumber());

        window.location.reload();
      }else{
        console.log('No ethereum object')
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    isWalletConnected();
    checkIfTransExist();
  }, [transactionCount]);


  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        sendTransactions,
        currentAccount,
        formData,
        handleChange,
        usetransactions,
        transactionCount,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
export const useTransactionContext = () => useContext(TransactionContext);
