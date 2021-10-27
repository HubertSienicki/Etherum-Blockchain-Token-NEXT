//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./NEXTToken.sol";

contract NEXT_Token_Sale{
    /*TODO:
        - Admin assigment : DONE, TESTED 
        - Token contract : DONE, TESTED 
        - Token Price : DONE, TESTED
        - Buying tokens function: DONE, TESTED
        - Set up provision to tokenSale: DONE, TESTED
        - Ending the tokenSale: 
    */

    /*
    public variable tokensSold
    returns: number of tokens sold(uint256)
    */
    uint256 public tokensSold;

    /*
    public variable tokenPrice
    returns: price of a token (uint256)
    */
    uint256 public tokenPrice;
    
    /*
    public variable NEXT_Token
    returns: smart contract instance (contract)
    */
    NEXT_Token public tokenContract;

    /*
    private variable admin
    returns: admin of the contract (address)
    */
    address admin;

    /*
    private event Sell
    returns: Sell event trigger (event)
    */
    event Sell(
        address _buyer,
        uint256 _amount
    );

    constructor(NEXT_Token _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    // https://github.com/dapphub/ds-math/blob/master/src/math.sol
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        // Require that the number of tokens is equal to value
        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        // Require that there are enough number of tokens in the contracts
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

        // Require that transfer succesful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // Keeps track of tokens sold
        tokensSold += _numberOfTokens;

        // Emit a sell trigger
        emit Sell(msg.sender, _numberOfTokens);

        
        
    }

    function endSale() public{
        // Require admin
        require(msg.sender == admin);
        
        // Transfer the amount of tokens back to the admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        
        // Destroy contract
        address payable temp = payable(admin);

        temp.transfer(address(this).balance);
    }

}