import React, { useEffect, useState } from "react";
import TradeStatus from "./TradeStatus";

export default ({
  drizzleState,
  contractInstance,
  contractState,
  currentAccountIndex,
  contractName,
}) => {
  const { accounts } = drizzleState;

  const [dataKey, setDataKey] = useState();
  useEffect(() => {
    if (contractInstance?.methods) {
      setDataKey(contractInstance.methods["getInfo"].cacheCall());
    }
  }, []);

  const [errors, setErrors] = useState({
    inNegotiation: null,
    approve: null,
    reject: null,
    paid: null,
  });

  const {
    buyerAddress,
    sellerAddress,
    _commodityCategory,
    _commodityType,
    _commodityPrice,
    _commodityUnit,
    _tradeStatus,
  } = contractState.getInfo?.[dataKey]?.value || {};

  return (
    <div className="row">
      <div className="row">
        <h3>{contractName}</h3>
        <p>Buyer Address: {buyerAddress}</p>
        <p>Seller Address: {sellerAddress}</p>
        <p>CommodityCategory: {_commodityCategory}</p>
        <p>Commodity Type: {_commodityType}</p>
        <p>Commodity Value: {_commodityPrice}</p>
        <p>Commodity Unit: {_commodityUnit}</p>
        <p>
          Trade Status: <strong>{TradeStatus[_tradeStatus]}</strong>
        </p>
      </div>
      <div className="row">
        <div className="col d-flex flex-column">
          <button
            className="btn btn-primary"
            onClick={async () => {
              setErrors((prev) => ({ ...prev, inNegotiation: null }));
              try {
                await contractInstance.methods
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
        <div className="col d-flex flex-column">
          <button
            className="btn btn-success"
            onClick={async () => {
              setErrors((prev) => ({ ...prev, approve: null }));
              try {
                await contractInstance.methods
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
        <div className="col d-flex flex-column">
          <button
            className="btn btn-danger"
            onClick={async () => {
              setErrors((prev) => ({ ...prev, reject: null }));
              try {
                await contractInstance.methods
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
        <div className="col d-flex flex-column">
          <button
            className="btn btn-primary"
            onClick={async () => {
              setErrors((prev) => ({ ...prev, paid: null }));
              try {
                await contractInstance.methods
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
