import React, { useState, useEffect } from "react";
import Usdc from './contracts/Usdc.json'
import CBAuth from './contracts/CBAuth.json'
import getWeb3 from "./getWeb3";
import Navbar from './components/Navbar'
import Promo from './components/Promo'
import MainPage from "./components/MainPage";

import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(undefined)
  const [instance, setInstance] = useState(undefined)
  const [usdcInstance, setUsdcInstance] = useState(undefined)
  const [accounts, setAccounts] = useState([])
  const [subscribed, setSubscribed] = useState(false)
  const [usdcForSubscription, setUsdcForSubscription] = useState(0)
  const [ethForSubscription, setEthForSubscription] = useState(0)

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

        console.log(await instance.methods.subscriptions(accounts[0]).call())

        // Get subscription prices
        const usdcForSubscription = await instance.methods.subscriptionPrice().call();
        const ethUsdPrice = await instance.methods.getETHUSDPrice().call();
        const ethForSubscription =  usdcForSubscription / ethUsdPrice;

        const usdcInstance = await new web3.eth.Contract(Usdc, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
        // console.log(await usdcInstance.methods.balanceOf(instance.options.address).call())

        // Set web3, accounts, and contract to the state.
        setWeb3(web3)
        setAccounts(accounts)
        setInstance(instance)
        setUsdcInstance(usdcInstance)
        setSubscribed(subscribed)
        setUsdcForSubscription(usdcForSubscription)
        setEthForSubscription(ethForSubscription)
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

  const handleETHSubscription = async () => {
    try {
      await instance.methods.subscribeETH().send({ from: accounts[0], value: web3.utils.toWei(ethForSubscription.toString(), 'ether')})

      const subscribed = await instance.methods.isSubscribed().call({from: accounts[0]})
      setSubscribed(subscribed)
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleUSDCSubscription = async () => {
    try {
      await instance.methods.subscribeUSDC().send({ from: accounts[0]})

      const subscribed = await instance.methods.isSubscribed().call({from: accounts[0]})
      setSubscribed(subscribed)
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleRefund = async () => {
    await instance.methods.requestRefund().send({ from: accounts[0] })

    setSubscribed(false)
  }

  return (
    <div className="App">
      <Navbar web3={web3} accounts={accounts} subscribed={subscribed} />
      {subscribed ? <MainPage handleRefund={handleRefund}/> : <Promo instance={instance} usdcInstance={usdcInstance} accounts={accounts} handleETHSubscription={handleETHSubscription} handleUSDCSubscription={handleUSDCSubscription} usdcForSubscription={usdcForSubscription} ethForSubscription={ethForSubscription} />}
    </div>
  );
}

export default App;
