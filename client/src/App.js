import React, { useState, useEffect } from "react";
import CBAuth from './contracts/CBAuth.json'
import getWeb3 from "./getWeb3";
import Navbar from './components/Navbar'
import Promo from './components/Promo'

import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(undefined)
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        // const networkId = await web3.eth.net.getId();
        // const deployedNetwork = SimpleStorageContract.networks[networkId];
        // const instance = new web3.eth.Contract(
        //   SimpleStorageContract.abi,
        //   deployedNetwork && deployedNetwork.address,
        // );

        // Set web3, accounts, and contract to the state.
        setWeb3(web3)
        setAccounts(accounts)
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };
  
    init();
  }, [])

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        <Navbar web3={web3} accounts={accounts}/>
        <Promo />
      </div>
    );
}

export default App;
