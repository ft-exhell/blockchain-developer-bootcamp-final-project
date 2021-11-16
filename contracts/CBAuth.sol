// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
/// @title Crypto Briefing User Authentication
/// @author Anton Tarasov
/// @notice This is a final project for the ConsenSys Bootcamp
contract CBAuth is Ownable {
    mapping(address=>uint256) public subscriptions;
    
    function subscribe() public {
        subscriptions[msg.sender] = block.timestamp + 31536000;
    }
    
    function isSubscribed() public view returns(bool) {
        if (subscriptions[msg.sender] == 0 || subscriptions[msg.sender] < block.timestamp) {
            return(false);
        } else {
            return (true);
        }
    }
}