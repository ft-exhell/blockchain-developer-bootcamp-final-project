# Crypto Briefing User Authentication

## Project Description

Crypto Briefing is a media company that focuses on delivering quality coverage of the latest news in the blockchain space. We also have a research-focused branch SIMETRI, which has a subscription service.

This app is a mockup demo of an authentication service that will enable SIMETRI subscribers access website material by using their web3 wallets. 

The target chain is Polygon. Rationale: low fees and an NFT marketplace (OpenSea) for lifetime subscriptions.

## Directory Structure
    .
    ├── client                  # Frontend and contract artifacts
    ├── contracts               # Project's contract and Truffle migrations contract
    ├── migrations              # Truffle migrations scripts
    ├── test                    # Truffle tests
    ├── LICENSE
    └── README.md

## Ethereum Address

0xC2F607b2f12B0E67ea00A787ab6EcEa7D5Cce62b

## User Flow

- Go to the website;
- Connect the wallet;
- The app checks whether the user has a subscription;
  - If the user doesn't have a subscription, the dapp offers to buy one
    - Buying can be done either with wBTC, ETH or stablecoins.
    - If it's not a stablecoin, the price is taken from an oracle.
  - If the user has a subscription, the website data becomes available;
    - If the user want to get a refund during trial period, they go to the account page;
    - The app checks whether the user is still within the trial period;
    - If the user is still within the trial period, the button for withdrawal will be active.

## Owner flow

- The smart-contract acts as a multisig;
- 2/3 of the owners should sign a message before it can be sent;

## Installing Dependencies and Accessing

In your terminal type `cd client && npm install`. After all the dependencies are installed, you can run the frontend locally by typing `npm start`.

## Running Unit Tests

