import React, { useState, useEffect } from "react";
import CBAuth from './contracts/CBAuth.json'
import getWeb3 from "./getWeb3";
import Navbar from './components/Navbar'
import Promo from './components/Promo'
import MainPage from "./components/MainPage";

import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(undefined)
  const [instance, setInstance] = useState(undefined)
  const [accounts, setAccounts] = useState([])
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = CBAuth.networks[networkId];
        const instance = new web3.eth.Contract(
          CBAuth.abi,
          deployedNetwork && deployedNetwork.address,
        );
        
        // Check the subscription
        const subscribed = await instance.methods.isSubscribed().call({ from: accounts[0]})

        // Set web3, accounts, and contract to the state.
        setWeb3(web3)
        setAccounts(accounts)
        setInstance(instance)
        setSubscribed(subscribed)
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

  const handleSubscription = async () => {
    const subscribed = await instance.methods.subscribe().send({ from: accounts[0], value: 500000000000000000})

    setSubscribed(subscribed)
  }

  const handleRefund = async () => {
    await instance.methods.requestRefund().send({ from: accounts[0] })

    setSubscribed(false)
  }

  return (
    <div className="App">
      <Navbar web3={web3} accounts={accounts} subscribed={subscribed} />
      {subscribed ? <MainPage handleRefund={handleRefund}/> : <Promo handleSubscription={handleSubscription}/>}
    </div>
  );
}

export default App;
