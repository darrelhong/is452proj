import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TradeStatus from "./TradeStatus";

export default ({
  drizzle,
  drizzleState,
  contractInstance,
  contractState,
  currentAccountIndex,
  contractName,
}) => {
  const { web3 } = drizzle;
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
    paymentVerified: null,
    paymentToContract: null,
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

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm();

  return (
    <div className="row mb-5">
      <div className="row">
        <div className="d-flex align-items-baseline">
          <h3 className="me-2">{contractName}</h3>
          <p className="text-secondary">{contractInstance.address}</p>
        </div>
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
      <div className="row row-cols-auto">
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
              setErrors((prev) => ({ ...prev, paymentVerified: null }));
              try {
                await contractInstance.methods
                  .paymentVerified()
                  .send({ from: accounts[currentAccountIndex] });
              } catch (err) {
                setErrors((prev) => ({
                  ...prev,
                  paymentVerified: err.message.substring(66),
                }));
              }
            }}
          >
            Payment Verified
          </button>
          <small className="text-danger">{errors.paymentVerified}</small>
        </div>
      </div>
      <form
        className="row row-cols-auto mt-3"
        onSubmit={handleSubmit(async (data) => {
          const { amount } = data;
          setErrors((prev) => ({ ...prev, paymentToContract: null }));
          try {
            await contractInstance.methods.paymentToContract().send({
              from: accounts[currentAccountIndex],
              value: web3.utils.toWei(amount, "ether"),
            });
            reset();
          } catch (err) {
            setErrors((prev) => ({
              ...prev,
              paymentToContract: err.message.substring(66),
            }));
          }
        })}
      >
        <div className="col">
          <input
            placeholder="Payment amount"
            type="number"
            className="form-control"
            {...register("amount", {
              required: "Payment amount is requred",
            })}
          />
        </div>
        <div className="col">
          <div className="col d-flex flex-column">
            <button className="btn btn-primary" type="submit">
              Pay
            </button>
            <small className="text-danger">
              {formErrors.amount?.message || errors.paymentToContract}
            </small>
          </div>
        </div>
      </form>
    </div>
  );
};
