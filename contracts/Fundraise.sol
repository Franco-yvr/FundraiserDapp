// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Fundraise {
    // even to emit when the memo is made
    event NewMemo (
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // list of all memos
    Memo[] memos;

    //address of contract deployer
    address payable owner;

    // deployment logic
    constructor() {
        owner = payable(msg.sender);
    }

    /*
    * @dev buy a coffee for the contract owner
    * @param _name name of the coffee buyer
    * @param _message message from the sender
    */
    function sendFunds(string memory _name, string memory _message) public payable {
        // Ensure the amount is greater than zero or fail transaction
        require(msg.value > 0, "value must be higher than 0");
        // Add new memo to the array
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        // Emit new event
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /*
    * @dev withdraws funds if contract owner
    */
    function withdrawFunds() public {
        // Ensure the caller is the contract owner
         require(owner.send(address(this).balance));
//        require(msg.value == owner, "Caller must the contract owner");
//        owner.send(address(this).balance);
    }

    /*
    * @dev change Owner Address
    * @param _address to replace with
    */
    function changeOwnerAddress(address _address) public {
        // Ensure the caller is the contract owner
        require(msg.sender == owner, "You are not the contract owner.");
        owner = payable(_address);
    }

    /*
    * @dev returns list of memos written to the owner
    */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }

}
