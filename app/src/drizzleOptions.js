import Web3 from "web3";
import CommodityTradeMatching from "./contracts/CommodityTradeMatching.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:7545"),
  },
  contracts: [CommodityTradeMatching],
  events: {
    CommodityTradeMatching: ["StatusChanged"],
  },
};

export default options;
