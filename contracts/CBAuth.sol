//SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;
contract CBAuth {

    uint public yearlyPrice;
    uint public lifetimePrice;

    mapping (address => bool) public owners;
    uint requiredSignatures;

    mapping (address => uint) public subscriptions;

    constructor() public {

    }

    modifier onlyOwners() {
        _;
    }
    
    event SubscribedForYearly(address);
    
    function subscribed(address subscriber) public view returns (bool){
        if (subscriptions[subscriber] == 0) {
            return false;
        }
        return subscriptions[subscriber] < block.timestamp;
    }

    function buyYearly(address subscriber) public payable {
        require(msg.value == yearlyPrice, 'Wrong amount specified.');
        require(!subscribed(subscriber), 'You are already subscribed.');
        subscriptions[subscriber] = block.timestamp;
        emit SubscribedForYearly(subscriber);
    }

    function buyLifetime() public payable {

    }

    function updateYearlyPrice(uint _price) public onlyOwners {
        yearlyPrice = _price;
    }

    function updateLifetimePrice(uint _price) public onlyOwners{
        lifetimePrice = _price;
    }

    function Refund() public {
        
    }
}