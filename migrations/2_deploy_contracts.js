const NEXTToken = artifacts.require("./NEXT_Token.sol");

module.exports = function (deployer) {
  deployer.deploy(NEXTToken);
};
