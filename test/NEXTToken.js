const NEXTToken = artifacts.require("./NEXT_Token.sol");

contract('NEXT_Token', function (accounts) {
    var tokenInstance;
    
    it('initializes contract with the correct values', function () {
        return NEXTToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'NEXT Token', 'has a correct name');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'NEXT', 'has a correct symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'NEXT Token v1.0', 'has a correct standard');
        })
    })

    it('allocates the initial supply upon demand', function () {
        return NEXTToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function (totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 
            'sets totalSupply to 1,000,000'); //first test checks that the totalSupply = 1,000,000 (PASSED!)
            return tokenInstance.balanceOf(accounts[0])
        }).then(function (adminBalance) {
            assert.equal(adminBalance.toNumber(), 1000000,
            'it allocates the _initialSupply to the admin account')
        });
    });

    it('transfers token ownership', function () {
        return NEXTToken.deployed().then(function (instance){
            tokenInstance = instance;
            //TEST: 1 transferring larger amount than senders balance
            return tokenInstance.transfer.call(accounts[1], 9999999999999) 
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        }).then(function(success){
            assert.equal(success, true, ' it returns true');
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] })
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event')
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from')
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to')
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount')
            return tokenInstance.balanceOf(accounts[1])
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiver account')
            return tokenInstance.balanceOf(accounts[0])
        }).then(function(balance){
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account')
        });
    });

    it('approves token for a delegated transfer', function(){
        return NEXTToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100)
        }).then(function(success){
            assert.equal(success, true, 'it returns true')
            return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event')
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are approved from')
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are approved to')
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount')
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer')
        })
    });

    it('handles delegated transfer', function(){
        return NEXTToken.deployed().then(function (instance){
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            //Transfer some tokens to fromAccount
            return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
        }).then(function(receipt){
            //Approves spendingAccount to spend 10 tokenInstance from fromAccount
            return tokenInstance.approve(spendingAccount, 10, { from: fromAccount })
        }).then(function(receipt){
            //Try transferring something larger than the sender's balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from:spendingAccount });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
            //Try transferring something larger than the approved amount'
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
            //Test return value of the function
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(success){
            assert.equal(success, true, 'it returns true');
            //Transaction as a whole
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event')
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from')
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to')
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount')  
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 90, 'deducts amount from the sending account')
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10, 'adds the amount to the receiving account')
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance')
        });
    });
})