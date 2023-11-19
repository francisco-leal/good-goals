ADDRESS=$(npx hardhat run scripts/deployApeCoin.js --network baseGoerli | grep 'contract address' | cut -d' ' -f3)
echo "CONTRACT ADDRESS $ADDRESS"
