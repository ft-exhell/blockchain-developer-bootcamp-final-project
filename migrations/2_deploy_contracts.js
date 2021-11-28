const CBAuth = artifacts.require("./CBAuth.sol");
const IERC20 = artifacts.require('./IERC20.sol')

module.exports = async function(deployer, network, addresses) {
  const [owner, subscriber, _] = addresses;

  const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const usdcWhale = '0x28c6c06298d514db089934071355e5743bf21d60'
  const ethUsdOracle = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
  const initSubscriptionPrice = 1000;
  deployer.deploy(CBAuth, usdcAddress, ethUsdOracle, initSubscriptionPrice, {from: owner});
  const usdc = await IERC20.at(usdcAddress)
  await usdc.transfer(subscriber, 1000000000, {from: usdcWhale})
};
