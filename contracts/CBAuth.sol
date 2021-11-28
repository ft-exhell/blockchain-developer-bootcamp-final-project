// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title Crypto Briefing User Authentication
/// @author Anton Tarasov
/// @notice This is a final project for the ConsenSys Bootcamp
contract CBAuth is Ownable {

    uint256 public subscriptionPrice;

    IERC20 public usdc;
    AggregatorV3Interface internal ETHUSDPriceFeed;
    AggregatorV3Interface internal BTCUSDPriceFeed;

    enum Currency {
        ETH,
        USDC
    }

    Currency currency;
    Currency constant defaultChoice = Currency.ETH;

    struct Subscription {
        uint256 expiration;
        Currency currency;
        uint256 balance;
    }

    event Subscribed(address subscriber);

    /// @dev Each address has a timestamp after which a subscription is inactive.
    mapping(address=>Subscription) public subscriptions;

    constructor(address usdcAddress, address ethUsdOracle, uint256 initSubscriptionPrice) {
        usdc = IERC20(usdcAddress);
        ETHUSDPriceFeed = AggregatorV3Interface(ethUsdOracle);
        subscriptionPrice = initSubscriptionPrice; 
    }

    modifier notSubscribed {
        require(subscriptions[msg.sender].expiration == 0 || subscriptions[msg.sender].expiration < block.timestamp, "Already subscribed.");
        _;
    }

    modifier subscribed {
        require(subscriptions[msg.sender].expiration != 0 || subscriptions[msg.sender].expiration > block.timestamp, "Not subscribed.");
        _;
    }

    modifier refundActive {
        require(subscriptions[msg.sender].expiration - 31536000 + 2592000 > block.timestamp, "Grace Period Ended.");
        _;
    }
    
    ///@dev queries USDC price via Chainlink oracle.
    function getETHUSDPrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = ETHUSDPriceFeed.latestRoundData();
        return answer / 1e8;
    }

    ///@dev Receives a subscription fee in ETH, stores data about subscription, emits an event that a user is subscribed.
    function subscribeETH() external payable notSubscribed {
        uint256 ethPrice = uint256(getETHUSDPrice());
        uint256 ethForSubscription = subscriptionPrice / ethPrice;
        require(msg.value >= ethForSubscription, "You don't have enough ETH.");

        subscriptions[msg.sender].expiration = block.timestamp + 31536000;
        subscriptions[msg.sender].currency = Currency.ETH;
        subscriptions[msg.sender].balance = msg.value;

        emit Subscribed(msg.sender);
    }

    function subscribeUSDC() external notSubscribed {
        usdc.transferFrom(msg.sender, address(this), subscriptionPrice * 1000000);
        subscriptions[msg.sender].expiration = block.timestamp + 31536000;
        subscriptions[msg.sender].currency = Currency.USDC;
        subscriptions[msg.sender].balance = subscriptionPrice * 1000000;

        emit Subscribed(msg.sender);
    }

    /// @dev Checks whether a tx sender is subscribed.
    function isSubscribed() public view returns(bool) {
        if (subscriptions[msg.sender].expiration == 0 || subscriptions[msg.sender].expiration < block.timestamp) {
            return(false);
        } else {
            return (true);
        }
    }

    /// @dev Checks whether a person is subscribed and the grace period of 1 month isn't over. If all ok -> refund.
    function requestRefund() external subscribed refundActive {
        uint256 refundAmount = subscriptions[msg.sender].balance;
        subscriptions[msg.sender].balance = 0;
        subscriptions[msg.sender].expiration = 0;
        /// @dev Update state variable before making an external call to prevent re-entrancy.
        if (subscriptions[msg.sender].currency == Currency.ETH) {
            (bool sent, bytes memory data) = msg.sender.call{value: refundAmount}("");
            require(sent, "Failed to Refund");
        } else if (subscriptions[msg.sender].currency == Currency.USDC) {
            usdc.transfer(msg.sender, refundAmount);
        }
    }

    /// @dev Allows only the Owner of the smart-contract to withdraw funds.
    function withdraw() external onlyOwner {
        (bool sent, bytes memory data) = owner().call{value: address(this).balance}("");
        require(sent, "Failed to withdraw");
        usdc.transfer(msg.sender, usdc.balanceOf(address(this)));
    }
}