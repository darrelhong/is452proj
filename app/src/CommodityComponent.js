import React, { useEffect, useState } from "react";
import TradeStatus from "./TradeStatus";
import CommodityTradeMatchingContract from "./contracts/CommodityTradeMatching.json";

export default ({ drizzle, drizzleState }) => {
  const { web3 } = drizzle;
  const { accounts, contracts } = drizzleState;
  // set account
  const [currentAccountIndex, setAccountIndex] = useState(0);
  const [contract, setContract] = useState({});
  // fetching contract date
  const [dataKey, setDataKey] = useState();
  const [errors, setErrors] = useState({
    inNegotiation: null,
    approve: null,
    reject: null,
    paid: null,
  });
  useEffect(() => {
    const getInstance = async () => {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork =
        CommodityTradeMatchingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CommodityTradeMatchingContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log(instance)
      setContract(instance);
    };
    getInstance();
  },[]);

  useEffect(() => {
    const contract = drizzle.contracts.CommodityTradeMatching;
    setDataKey(contract.methods["getInfo"].cacheCall());
  }, [drizzle.contracts.CommodityTradeMatching]);
  const { CommodityTradeMatching } = contracts;
  const {
    buyerAddress,
    sellerAddress,
    _commodityCategory,
    _commodityType,
    _commodityPrice,
    _commodityUnit,
    _tradeStatus,
  } = CommodityTradeMatching.getInfo?.[dataKey]?.value || {};

  return (
    <div className="mt-5">
      <div className="d-flex align-items-baseline">
        <h3 className="me-1">Current account: </h3>
        <p>{accounts[currentAccountIndex]}</p>
      </div>
      <div className="row px-2 mb-4">
        <select
          value={currentAccountIndex}
          onChange={(e) => {
            setAccountIndex(e.target.value);
          }}
          class="form-select"
          aria-label="Default select example"
        >
          {Object.keys(accounts).map((key) => (
            <option value={key}>{accounts[key]}</option>
          ))}
        </select>
      </div>
      <div className="row">
        <h3>Commodity Contract</h3>
        <p>Buyer Address: {buyerAddress}</p>
        <p>Seller Address: {sellerAddress}</p>
        <p>CommodityCategory: {_commodityCategory}</p>
        <p>Commodity Type: {_commodityType}</p>
        <p>Commodity Value: {_commodityPrice}</p>
        <p>Commodity Unit: {_commodityUnit}</p>
        <p>Trade Status: <strong>{TradeStatus[_tradeStatus]}</strong></p>
      </div>
      <div className="row">
        <div class="col d-flex flex-column">
          <button
            className="btn btn-primary"
            onClick={async () => {
              setErrors((prev) => ({ ...prev, inNegotiation: null }));
              try {
                await contract.methods
                  .inNegotiation()
                  .send({ from: accounts[currentAccountIndex] });
              } catch (err) {
                setErrors((prev) => ({
                  ...prev,
                  inNegotiation: err.message.substring(66),
                }));
              }
            }}
          >
            Set In Negotiation
          </button>
          <small className="text-danger">{errors.inNegotiation}</small>
        </div>
        <div class="col d-flex flex-column">
          <button
            className="btn btn-success"
            onClick={async () => {
              setErrors((prev) => ({ ...prev, approve: null }));
              try {
                await contract.methods
                  .approve()
                  .send({ from: accounts[currentAccountIndex] });
              } catch (err) {
                setErrors((prev) => ({
                  ...prev,
                  approve: err.message.substring(66),
                }));
              }
            }}
          >
            Approve
          </button>
          <small className="text-danger">{errors.approve}</small>
        </div>
        <div class="col d-flex flex-column">
          <button
            className="btn btn-danger"
            onClick={async () => {
              setErrors((prev) => ({ ...prev, reject: null }));
              try {
                await contract.methods
                  .reject()
                  .send({ from: accounts[currentAccountIndex] });
              } catch (err) {
                setErrors((prev) => ({
                  ...prev,
                  reject: err.message.substring(66),
                }));
              }
            }}
          >
            Reject
          </button>
          <small className="text-danger">{errors.reject}</small>
        </div>
        <div class="col d-flex flex-column">
          <button
            className="btn btn-primary"
            onClick={async () => {
              setErrors((prev) => ({ ...prev, paid: null }));
              try {
                await contract.methods
                  .paid()
                  .send({ from: accounts[currentAccountIndex] });
              } catch (err) {
                setErrors((prev) => ({
                  ...prev,
                  paid: err.message.substring(66),
                }));
              }
            }}
          >
            Set Paid
          </button>
          <small className="text-danger">{errors.paid}</small>
        </div>
      </div>
    </div>
  );
};
