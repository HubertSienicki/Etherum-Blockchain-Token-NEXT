const NEXTToken = artifacts.require("./NEXT_Token.sol");

module.exports = function (deployer) {
  deployer.deploy(NEXTToken, 1000000);  //Contract extraction with _initialSupply set to 1,000,000

};
