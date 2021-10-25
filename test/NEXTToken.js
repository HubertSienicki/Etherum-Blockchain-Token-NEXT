const NEXTToken = artifacts.require("./NEXT_Token.sol");

contract('NEXTToken', function (accounts) {

    it('sets the total supply upon demand', function () {
        return NEXTToken.deployed().then(function (instance) {
            token = instance;
            return token.totalSupply();
        }).then(function (totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 
            'sets totalSupply to 1,000,000'); //first test checks that the totalSupply = 1,000,000 (PASSED!)
        });
    });
})