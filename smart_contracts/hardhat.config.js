//0xd79b1585531e57A8d239ADc5262398279b4F5c91

require("@nomiclabs/hardhat-waffle");


module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/iPpbTmDGGmBqDoydlWiNWqu6YbrXDV5x",
      accounts: [
        process.env.REACT_APP_PRIVATE_KEY,
      ],
    },
  },
};
