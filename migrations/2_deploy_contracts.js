const BigNumber = require('bignumber.js')
const CBAuth = artifacts.require("./CBAuth.sol");
const IERC20 = artifacts.require('./IERC20.sol');

module.exports = async function(deployer, network, addresses) {
  const [owner, subscriber, _] = addresses;

  if (network == 'rinkeby') {
    // The original idea is payment in DAI, but finding good testnet DAI is a pain, 
    // hence using Compound USDT, which I have a ton. HMU if you need it, but
    // you can get it easily by borrowing on Compound
    const usdtAddress = '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02';
    const ethUsdOracle = '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e';
    const initSubscriptionPrice = 1000;
    deployer.deploy(CBAuth, usdtAddress, ethUsdOracle, initSubscriptionPrice)
  }

  if (network == 'mainnet_fork') {
    const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
    // You have to unlock daiWhale if you wanna transfer money from it
    const daiWhale = '0xC73f6738311E76D45dFED155F39773e68251D251'
    const ethUsdOracle = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
    const initSubscriptionPrice = 1000;
    deployer.deploy(CBAuth, daiAddress, ethUsdOracle, initSubscriptionPrice, {from: owner});
    const dai = await IERC20.at(daiAddress)
    await dai.transfer(subscriber, '1000000000000000000000', {from: daiWhale})
  }
};
