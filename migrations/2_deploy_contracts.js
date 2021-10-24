var SimpleStorage = artifacts.require("./CBAuth.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
