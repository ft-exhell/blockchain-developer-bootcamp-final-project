# Inheritance and Interfaces

Used OpenZeppelin's `Ownable` for access control and `IERC20` for making calls to stablecoin smart contract.

# Oracles

The contract uses Chainlink data feed to get ETH/USD price.

# Access Control Design Pattern

Used `onlyOwner` to anable withdrawal to only the contract's owner.

# Inter-Contract Execution

The contract accepts payments in ERC20 tokens, which requires making calls to the respective token's contract.