const NEXTToken = artifacts.require("./NEXT_Token.sol");
const NEXTTokenSale = artifacts.require("./NEXT_Token_Sale.sol");

module.exports = function (deployer) {
  deployer.deploy(NEXTToken, 1000000).then(function(){
    //Token price is 0.001 ETH
    var tokenPrice = 1000000000000000;
    return deployer.deploy(NEXTTokenSale, NEXTToken.address, tokenPrice);
  });  //Contract extraction with _initialSupply set to 1,000,000
};
