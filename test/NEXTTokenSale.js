const NEXTTokenSale = artifacts.require("./NEXT_Token_Sale.sol"); 

contract('NEXT_Token_Sale', function (account) {
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // in wei 

    it('initializes the contract with the correct values',function () {
        return NEXTTokenSale.deployed().then(function (instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has contract address')
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has a token contract address')
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct')
        });
    });
})  