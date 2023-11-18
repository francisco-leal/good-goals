export STAKING_TOKEN=0x0846c393EBDA7214be271A3C2Ddc63B77ffDA7bd
export GRANULARITY=60 # 1 minute per duration unit
ADDRESS=$(npx hardhat run scripts/deploy.js --network arbitrumGoerli | grep 'contract address' | cut -d' ' -f3)
echo "CONTRACT ADDRESS $ADDRESS"
sleep 30
npx hardhat verify $ADDRESS $STAKING_TOKEN $GRANULARITY --network arbitrumGoerli
