# Final Project - Crypto Briefing User Authentication

## Deployed app
**URL:** https://blockchain-developer-bootcamp-final-project-lovat.vercel.app/

**Network:** Rinkeby

**Notice:** I struggled to find a good DAI representation on testnets, which I could effortlessly obtain from a faucet. 

Hence, while the original idea was to use DAI, I used Compound USDT on Rinkeby. Hit me up if you need some of it for testing, I have a ton.

## Directory Structure
    .
    ├── client                  # Frontend and contract artifacts
    ├── contracts               # Project's contract and Truffle migrations contract
    ├── migrations              # Truffle migrations scripts
    └── test                    # Truffle tests

## How to run this project locally

### Prerequisites
- Node.js >= v16.6.1
- NPM >= 7.20.3
- Truffle and Ganache CLI (make sure you have `ganache-cli`)
- Infura account

### Contracts
- Run `git clone https://github.com/ft-exhell/blockchain-developer-bootcamp-final-project.git && cd blockchain-developer-bootcamp-final-project`
- Run `npm install` in the project's root
- Run `echo "INFURA_API_KEY=<your Infura account's API key>" > .env`
- Open the project's root in the new terminal window
- Run `sh ganache-mainnet-fork.sh`, this will launch Ethereum mainnet fork on Ganache
    - If you want to play around with the local frontend, copy the mnemonic phrase for later use in Metamask, otherwise it will be buried under Ganache updates
- Go back to the previous terminal window
- Run `truffle console --network mainnet_fork`, this will give you access to Ganache
- Run `test` 

### Frontend
- Run `cd client && npm install && npm start`
- If the url wasn't opened automatically, go to `http://localhost:3000/`
- In you Metamask paste in the mnemonic phrase you copied when you launched Ganache
- If you wanna test payments via DAI, you will

## Screencast link

## Ethereum address for certification

`0xC2F607b2f12B0E67ea00A787ab6EcEa7D5Cce62b`

## Project Description

Crypto Briefing is a media company that focuses on delivering quality coverage of the latest news in the blockchain space. We also have a research-focused branch SIMETRI, which has a subscription service.

This app is a mockup demo of an authentication service that will enable SIMETRI subscribers access website material by using their web3 wallets. 

## Simple workflow

1. Go to https://blockchain-developer-bootcamp-final-project-lovat.vercel.app/, your Metamask should be connected to Rinkeby

2. Allow the app to connect to your wallet.

3. Choose between paying for the subscription in DAI (I had to use Compound USDT on Rinkeby) or in ETH.
    1. DAI: 
        - You most likely don't have allowance, so the app will ask you to enable spending 1000 of your Compound USDT.
        - If you don't have Compound USDT, HMU. Otherwise, make sure you have 1k and click on the payment button again.
        - Once the payment goes through, you will be directed to the welcome screen.
        - You can request a refund to get your precious testnet tokens out of the contract :)
    2. ETH:
        - Click on the payment button.
        - Once the payment goes through, you will be directed to the welcome screen.

## Scheduled workflow for lifetime subscription (not implemented)

1. Click on the `Buy lifetime` button.
2. Pay for the NFT.
3. Once the payment goes through, you will have an NFT on your wallet and the app will transfer you to the welcome screen.

## Environment variables
```
MNEMONIC=
INFURA_API_KEY=
```

## TODO
- Lifetime subscription via NFT