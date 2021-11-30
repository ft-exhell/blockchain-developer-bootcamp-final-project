source .env

ganache-cli -f https://mainnet.infura.io/v3/$INFURA_API_KEY \
--unlock $DAI_WHALE \
--networkId 999