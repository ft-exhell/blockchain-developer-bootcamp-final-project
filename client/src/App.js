import React, { useState, useEffect } from "react";
import IERC20 from './contracts/IERC20.json'
import CBAuth from './contracts/CBAuth.json'
import getWeb3 from "./getWeb3";
import Navbar from './components/Navbar'
import Promo from './components/Promo'
import MainPage from "./components/MainPage";
import BigNumber from 'bignumber.js';

import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(undefined)
  const [instance, setInstance] = useState(undefined)
  const [daiInstance, setUsdcInstance] = useState(undefined)
  const [daiAllowance, setUsdcAllowance] = useState(undefined)
  const [accounts, setAccounts] = useState([])
  const [subscribed, setSubscribed] = useState(false)
  const [daiForSubscription, setUsdcForSubscription] = useState(0)
  const [ethForSubscription, setEthForSubscription] = useState(0)
  const [ethForSubscriptionOriginal, setEthForSubscriptionOrigial] = useState(0)
  const [allowanceCheck, setAllowanceCheck] = useState(undefined)
  
  const DAI_MAINNET = '0x6b175474e89094c44da98b954eedeac495271d0f';
  const USDT_RINKEBY = '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02';

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        let instance;
        if (networkId == 999)  {
          const deployedNetwork = CBAuth.networks[networkId];
          instance = new web3.eth.Contract(
            CBAuth.abi,
            deployedNetwork && deployedNetwork.address
          );
        } else if (networkId == 4) {
          const rinkebyAddress = '0xDBF305B0B88FeFDd842E5C160477403A03136e7b';
          instance = new web3.eth.Contract(
            CBAuth.abi,
            rinkebyAddress
          );
        }
        
        // Check the subscription
        const subscribed = await instance.methods.isSubscribed(accounts[0]).call()

        // Get subscription prices
        const daiForSubscription = await instance.methods.subscriptionPrice().call();
        // const ethUsdPrice = await instance.methods.getETHUSDPrice().call();
        const ethForSubscription =  await instance.methods.calculateETHPrice().call() / 1e+18;
        const ethForSubscriptionOriginal = await instance.methods.calculateETHPrice().call();

        // Connect to DAI instance and get allowance.
        // if (networkId) 
        let stablecoinAddress;
        if (networkId == 999) {
          stablecoinAddress = DAI_MAINNET;
        } else if (networkId == 4) {
          stablecoinAddress = USDT_RINKEBY;
        }
        const daiInstance = await new web3.eth.Contract(IERC20.abi, stablecoinAddress)
        const daiAllowance =  await daiInstance.methods.allowance(accounts[0], instance.options.address).call()
        
        const allowanceCheck = new BigNumber(daiAllowance).isGreaterThanOrEqualTo(new BigNumber(daiForSubscription).multipliedBy(new BigNumber(1e+18)))

        // Set web3, accounts, contracts and prices.
        setWeb3(web3)
        setAccounts(accounts)
        setInstance(instance)
        setUsdcInstance(daiInstance)
        setUsdcAllowance(new BigNumber(daiAllowance))
        setSubscribed(subscribed)
        setUsdcForSubscription(daiForSubscription)
        setEthForSubscription(ethForSubscription)
        setEthForSubscriptionOrigial(ethForSubscriptionOriginal)
        setAllowanceCheck(allowanceCheck)
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error.message);
      }
    };
  
    init();
  }, [])

  const handleETHSubscription = async () => {
    try {
      await instance.methods.subscribeETH().send({ from: accounts[0], value: new BigNumber(ethForSubscriptionOriginal).toFixed()})

      const subscribed = await instance.methods.isSubscribed(accounts[0]).call()
      setSubscribed(subscribed)
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleApprove = async () => {
    try {
        const subscriptionPrice = await instance.methods.subscriptionPrice().call()
        const daiAllowance = await daiInstance.methods.approve(instance.options.address, (new BigNumber(subscriptionPrice).multipliedBy(new BigNumber(1e+18)).toFixed())).send({from: accounts[0]})
        setUsdcAllowance(new BigNumber(daiAllowance))
        setAllowanceCheck(true)
    } catch (err) {
      console.log(err.message)
    }
  }
  
  const handleDAISubscription = async () => {
    try {
      await instance.methods.subscribeDAI().send({ from: accounts[0]})

      const subscribed = await instance.methods.isSubscribed(accounts[0]).call()
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
      {subscribed ? <MainPage handleRefund={handleRefund}/> : <Promo allowanceCheck={allowanceCheck} daiAllowance={daiAllowance} handleApprove={handleApprove} handleETHSubscription={handleETHSubscription} handleDAISubscription={handleDAISubscription} daiForSubscription={daiForSubscription} ethForSubscription={ethForSubscription} subscriptionPrice={daiForSubscription}/>}
    </div>
  );
}

export default App;
