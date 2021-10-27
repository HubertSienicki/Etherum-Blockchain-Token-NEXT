App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        console.log('App initialized...')
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            //If web3 is already initialized by Meta Mask
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider); 
        }
        else {
            //Specify instance if no web3
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }

        return App.initContracts();
    },

    initContracts: function() {
        $.getJSON("NEXT_Token_Sale.json", function(NEXTTokenSale) {
            App.contracts.NEXTTokenSale = TruffleContract(NEXTTokenSale);
            App.contracts.NEXTTokenSale.setProvider(App.web3Provider);
            App.contracts.NEXTTokenSale.deployed().then(function (NEXTTokenSale) {
                console.log("NEXT Token Sale Address: ", NEXTTokenSale.address);
                })
        }).done(function() {
            $.getJSON("NEXT_Token.json", function(NEXTToken) {
            App.contracts.NEXTToken = TruffleContract(NEXTToken);
            App.contracts.NEXTToken.setProvider(App.web3Provider);
            App.contracts.NEXTToken.deployed().then(function (NEXTToken) {
                console.log("NEXT Token Sale Address: ", NEXTToken.address);
                });
                return App.render();  
            });
        })
    },

    render: function() {
        //Load account data
        if(window.ethereum){
            ethereum.enable().then(function(account) {
                App.account = account[0]
                $("#accountAddress").html("Your account: " + App.account)
            })
        }
    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});