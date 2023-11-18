export STAKING_TOKEN=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
export GRANULARITY=60 # 1 minute per duration unit
ADDRESS=$(npx hardhat run scripts/deploy.js --network alfajores | grep 'contract address' | cut -d' ' -f3)
echo "CONTRACT ADDRESS $ADDRESS"
sleep 30
npx hardhat verify $ADDRESS $STAKING_TOKEN $GRANULARITY --network alfajores
