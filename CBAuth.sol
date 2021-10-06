//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
contract CBAuth {

    uint yearlyPrice;
    uint lifetimePrice;

    mapping(address => bool) owners;
    uint requiredSignatures;

    mapping (address => uint) subscriptions;

    constructor() {

    }

    modifier onlyOwners() {
        _;
    }
    
    event Subscribed(address);

    function buyYearly() public payable {

    }

    function buyLifetime() public payable {

    }

    function updateYearlyPrice(uint _price) public onlyOwners {

    }

    function updateLifetimePrice(uint _price) public onlyOwners{
        
    }

    function Refund() public {

    }
}