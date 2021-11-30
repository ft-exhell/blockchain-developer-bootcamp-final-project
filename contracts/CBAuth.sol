// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title Crypto Briefing User Authentication
/// @author Anton Tarasov
/// @notice Enables users to get access to SIMETRI via ETH or a stablecoin
/// @dev Lifetime subsription via an NFT minter will be implemented
contract CBAuth is Ownable {

	/// @notice Emitted when a person is subscribed for the service
	/// @param subscriber Subscriber ETH address
	event Subscribed(address subscriber);

	/// @notice Emitted when a person gets a refund
	/// @param subscriber Subscriber ETH address
	event Refunded(address subscriber);

	/// @notice Subscription price is in USD
	/// @dev Assigned in constructor
	uint256 public subscriptionPrice;

	/// @dev Lengths of subscription and grace period in seconds for tracking expiration & refund eligibility
	uint256 internal year = 31536000;
	uint256 internal gracePeriod = 2592000;

	/// @dev IERC20 interface for interacting with DAI
	IERC20 internal dai;

	/// @dev Chainlink interface for getting the price of ETH in USD
	AggregatorV3Interface internal ETHUSDPriceFeed;

	/// @dev Helps determining in which currency the subscriber paid, important for refunds
	enum Currency { ETH, DAI }
	Currency constant defaultChoice = Currency.ETH;

	/// @dev Data used for checking whether a subscription is active and is refund possible
	struct Subscription {
		uint256 expiration;
		Currency currency;
		uint256 balance;
	}

	/// @notice Information about each ETH address subscription, all zeroes means "not subscribed"
	mapping(address=>Subscription) public subscriptions;

	/// @param daiAddress Address of the DAI contract
	/// @param ethUsdOracle Address of Chainlink data feed
	/// @param initSubscriptionPrice Sets initial price of a subscription in USD w/o decimals
	/// @dev Had to use USDT contract on Rinkeby instead of DAI
	constructor(address daiAddress, address ethUsdOracle, uint256 initSubscriptionPrice) {
			dai = IERC20(daiAddress);
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
		require(subscriptions[msg.sender].expiration - year + gracePeriod > block.timestamp, "Grace Period Ended.");
		_;
	}
    
	///@dev Queries ETH/USD price from Chainlink data feed, the feed returns multiple items but we only need "answer"
	function getETHUSDPrice() 
		internal 
		view 
		returns (int256) {
			(
					, int256 answer, , ,
			) = ETHUSDPriceFeed.latestRoundData();
			return answer / 1e8;
		}

	/// @dev Uses Chainlink data to calculate price of a subscription, DAI has 18 decimals, so multiplying the price by 1e18
	function calculateETHPrice()
		public 
		view
		returns (uint256) {
			int256 ethPrice = getETHUSDPrice();
			return subscriptionPrice * 1e18 / uint256(ethPrice);
		}

	/// @notice Checks whether a sender has enough ETH and if yes accepts payment and makes a new subscription
	/// @dev Accepts only the exact amount to avoid the need to send funds back
	function subscribeETH() 
		external 
		payable 
		notSubscribed {
			require(msg.value == calculateETHPrice(), "Please, pay the exact amount in ETH.");

			subscriptions[msg.sender].expiration = block.timestamp + year;
			subscriptions[msg.sender].currency = Currency.ETH;
			subscriptions[msg.sender].balance = msg.value;

			emit Subscribed(msg.sender);
    }

	/// @notice Checks whether a sender has enough DAI and if yes accepts payment and makes a new subscription
	/// @dev Prevent an unnecessary call to DAI contract in the case of not enough funds with "require"
	function subscribeDAI() 
		external 
		notSubscribed {
			require(dai.balanceOf(msg.sender) >= subscriptionPrice * 1e18, "You don't have enough DAI.");

			dai.transferFrom(msg.sender, address(this), subscriptionPrice * 1e18);
			subscriptions[msg.sender].expiration = block.timestamp + year;
			subscriptions[msg.sender].currency = Currency.DAI;
			subscriptions[msg.sender].balance = subscriptionPrice * 1e18;

			emit Subscribed(msg.sender);
    }

	/// @notice Mint an NFT that represents a lifetime subscription
	/// @dev The NFT minter will be a separate contract
	function subscribeLifetime() external {
		// TODO: create an external NFT minter an a function that calls it and updates state.
	}

	/// @notice Checks whether an address is subscribed
	/// @param subscriber ETH address being checked
	function isSubscribed(address subscriber) 
		public 
		view 
		returns(bool) {
			if (subscriptions[subscriber].expiration == 0 || subscriptions[subscriber].expiration < block.timestamp)
				return false;
			else
				return true;
	}

	/// @notice Checks whether an address is subscribed and the grace period of 30 days isn't over, then refunds
	/// @dev Uses checks-effects-interactions pattern to prevent re-entrancy
	function requestRefund() 
		external 
		subscribed 
		refundActive {
			uint256 refundAmount = subscriptions[msg.sender].balance;

			subscriptions[msg.sender].balance = 0;
			subscriptions[msg.sender].expiration = 0;

			if (subscriptions[msg.sender].currency == Currency.ETH) {
					(bool sent, ) = msg.sender.call{value: refundAmount}("");
					require(sent, "Failed to Refund");
			} else if (subscriptions[msg.sender].currency == Currency.DAI) {
					dai.transfer(msg.sender, refundAmount);
			}
		}

	/// @notice Lets the owner to update the yearly price in USD
	/// @param _subscriptionPrice New subscription price
	function updatePrice(uint256 _subscriptionPrice)
		external
		onlyOwner {
			subscriptionPrice = _subscriptionPrice;
		}
		
	/// @notice Lets the owner to withdraw funds
	/// @dev Prevents unnecessary call to DAI if the contract doesn't hold DAI
	function withdraw() 
			external 
			onlyOwner {
				(bool sent, ) = owner().call{value: address(this).balance}("");
				require(sent, "Failed to withdraw");
				if (dai.balanceOf(address(this)) > 0)
					dai.transfer(msg.sender, dai.balanceOf(address(this)));
		}
}