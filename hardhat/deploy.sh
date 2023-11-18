export STAKING_TOKEN=0x7d91e51c8f218f7140188a155f5c75388630b6a8
export GRANULARITY=60 # 1 minute per duration unit
ADDRESS=$(npx hardhat run scripts/deploy.js --network alfajores | grep 'contract address' | cut -d' ' -f3)
echo "CONTRACT ADDRESS $ADDRESS"
npx hardhat verify $ADDRESS $STAKING_TOKEN $GRANULARITY --network alfajores
