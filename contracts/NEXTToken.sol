//in charge of the behavior of the cryptocurrency
//uses ERC-20 standard for smart contracts

pragma solidity ^0.8.9;


contract NEXT_TOKEN {
    /*TODO: 
         - Constructor : DONE
         - Total number of tokens in the contract : DONE 
         - Read total number of tokens : DONE, TESTED
         - Accept supply as a parameter of the function : DONE, TESTED
         - Keep track of the balance of each account : DONE, TESTED
         - Returning name and symbol of the contract : DONE, TESTED
         - Transfer function to transfer the amount of tokens between accounts: DONE, TESTED
         - Approval function to Approval the transfer on behalf of the sender : DONE, TESTED
         - Delegated transfer function :
    */

    /* 
    public variable totalSupply
    returns: the total amount of coins in the contract (uint256)
    */
    uint256 public totalSupply;

    /*
    event variable Approval
    returns: event triggered by Approval (event)
    */
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    /*
    event variable Transfer
    returns: event triggered by transfer (event)
    */
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    
    /*
    public variable balanceOf
    returns: balance of the owner of the address (uint256)
    */
    mapping(address => uint256) public balanceOf;

    /*
    public variable allowance
    returns: allowance of the owner of the address (uint256)
    */ 
    mapping(address => mapping(address => uint256)) public allowance;

    /*
    public variable name
    returns: name of the token (string)
    */
    string public name = "NEXT Token";

    /*
    public variable symbol
    returns: symbol of the token (string)
    */
    string public symbol = "NEXT";

    /*
    public variable standard
    returns: version of the token (string)
    */
    string public standard = "NEXT Token v1.0";

    constructor(uint256 _initialSupply){
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        
    } 
    
    /*
    public function transfer
    takes care of transfering amount of tokens (uint256) to another address (string)
    returns: success (boolean)
    */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        //Exception if account does not have enough tokens to transfer
        require(balanceOf[msg.sender] >= _value);

        //Token transfer
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        //Transfer event
        emit Transfer(msg.sender, _to, _value); 

        //return success (boolean)
        return true;
    }

    /*
    public function Approval
    Approves the transaction (event) on behalf of the spender (address)
    returns: success (boolean)
    */
    function approve(address _spender , uint256 _value) public returns (bool success) {
        //Allowance
        allowance[msg.sender][_spender] = _value;

        //Approval event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    /*
    public function transferFrom
    Takes care of the transfer (event) between two address (address)
    returns: success (boolean)
    */
    function transferFrom(address _from , address _to, uint256 _value) public returns (bool success) {
        //Require _from has enough tokenInstance
        require(_value <= balanceOf[_from]);

        //Require allowance is big enough
        require(_value <= allowance[_from][msg.sender]);

        //Call to the transfer event
        emit Transfer(_from, _to, _value);
        
        //Changes the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        //Update the allowance
        allowance[_from][msg.sender] -= _value;
        
        return true;
    }



}

