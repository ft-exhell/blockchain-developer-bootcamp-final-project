// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Crypto Briefing User Authentication
/// @author Anton Tarasov
/// @notice This is a final project for the ConsenSys Bootcamp
contract CBAuth is Ownable {
    /// @dev Each address has a timestamp after which a subscription is inactive.
    mapping(address=>uint256) public subscriptions;
    
    /// @dev Receives a subscription fee and assigns a timestamp in the future.
    function subscribe() public payable {
        require(msg.value == 0.5 ether, "Wrong fee.");
        require(subscriptions[msg.sender] == 0 || subscriptions[msg.sender] < block.timestamp, "Already subscribed.");
        subscriptions[msg.sender] = block.timestamp + 31536000;
    }
    
    /// @dev Checks whether a tx sender is subscribed.
    function isSubscribed() public view returns(bool) {
        if (subscriptions[msg.sender] == 0 || subscriptions[msg.sender] < block.timestamp) {
            return(false);
        } else {
            return (true);
        }
    }

    /// @dev Checks whether a person is subscribed and the grace period of 1 month isn't over. If all ok -> refund.
    function requestRefund() public payable {
        require(subscriptions[msg.sender] > 0 && subscriptions[msg.sender] > block.timestamp, "Not Subscribed.");
        require(subscriptions[msg.sender] - 31536000 + 2628288 > block.timestamp, "Grace Period Ended.");
        /// @dev Update state variable before making an external call to prevent re-entrancy.
        subscriptions[msg.sender] = 0;
        (bool sent, bytes memory data) = msg.sender.call{value: 0.5 ether}("");
        require(sent, "Failed to Refund");
    }

    /// @dev Allows only the Owner of the smart-contract to withdraw funds.
    /// @inheritdoc Ownable 
    function withdraw() public payable onlyOwner {
        (bool sent, bytes memory data) = owner().call{value: address(this).balance}("");
        require(sent, "Failed to withdraw");
    }
}