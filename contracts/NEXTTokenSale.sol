pragma solidity ^0.8.9;

import "./NEXTToken.sol";

contract NEXT_Token_Sale{
    /*TODO:
        - Admin assigment : DONE, TESTED 
        - Token contract : 
        - Token Price : 
    */

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
    public variable admin
    returns: admin of the contract (address)
    */
    address admin;

    constructor(NEXT_Token _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;

    }
}