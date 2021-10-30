const CommodityTradeMatching = artifacts.require("CommodityTradeMatching");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(
    CommodityTradeMatching,
    accounts[0],
    accounts[1],
    123456,
    "Energy",
    "Metals",
    10,
    2
  );
};
