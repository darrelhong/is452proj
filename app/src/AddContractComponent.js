import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CommodityTradeMatchingContract from "./contracts/CommodityTradeMatching.json";

export default ({ drizzle, drizzleState, currentAccountIndex }) => {
  const commodityTypeMapping = {
    Agricultural: ["Cattle", "Lumber", "Soya Bean"],
    Energy: ["Coal", "Crude Oil", "Gasoline", "Heating Oil", "Natural Gas"],
    Metals: [
      "Aluminum",
      "Copper",
      "Gold",
      "Nickel",
      "Palladium",
      "Platium",
      "Silver",
      "Steel",
      "Zinc",
    ],
  };

  const { web3 } = drizzle;
  const { accounts } = drizzleState;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const currentCommodityCategory = watch("commodityCategory", "Agricultural");

  const [contractDeployError, setContractDeployError] = useState();

  const onSubmit = async (data) => {
    setContractDeployError(null);
    try {
      const newContract = await new web3.eth.Contract(
        CommodityTradeMatchingContract.abi
      )
        .deploy({
          data: CommodityTradeMatchingContract.bytecode,
          arguments: [
            data.buyerAddress,
            data.sellerAddress,
            data.expectedDateOfTrade,
            data.commodityCategory,
            data.commodityType,
            data.commodityPrice,
            data.commodityUnit,
          ],
        })
        .send({ from: accounts[currentAccountIndex], gas: 1500000 });

      drizzle.addContract(
        {
          contractName: "NewCommodityTradeMatching",
          web3Contract: newContract,
        },
        ["StatusChanged"]
      );
    } catch (err) {
      setContractDeployError(err.message.substring(66));
    }
  };

  return (
    <>
      <h3>Create contract</h3>
      <form className="row g-3 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-6">
          <label htmlFor="buyerAddress" className="form-label">
            Buyer address
          </label>
          <select className="form-select" {...register("buyerAddress")}>
            {Object.keys(accounts).map((key) => (
              <option key={key} value={accounts[key]}>
                {accounts[key]}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="sellerAddress" className="form-label">
            Seller address
          </label>
          <select className="form-select" {...register("sellerAddress")}>
            {Object.keys(accounts).map((key) => (
              <option key={key} value={accounts[key]}>
                {accounts[key]}
              </option>
            ))}
          </select>
        </div>
        <div className="col-4">
          <label htmlFor="expectedDateOfTrade" className="form-label">
            Expected date of trade
          </label>
          <input
            type="number"
            className="form-control"
            {...register("expectedDateOfTrade", {
              required: "Date is requred",
            })}
          />
          <div className="invalid-feedback d-block">
            {errors.expectedDateOfTrade?.message}
          </div>
        </div>
        <div className="col-4">
          <label htmlFor="commodityCategory" className="form-label">
            Category
          </label>
          <select className="form-select" {...register("commodityCategory")}>
            <option value="Agricultural">Agricultural</option>
            <option value="Energy">Energy</option>
            <option value="Metals">Metals</option>
          </select>
        </div>
        <div className="col-4">
          <label htmlFor="commodityCategory" className="form-label">
            Category
          </label>
          <select className="form-select" {...register("commodityType")}>
            {commodityTypeMapping[currentCommodityCategory].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="commodityPrice" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            {...register("commodityPrice", {
              required: "Price is requred",
              min: {
                value: 0,
                message: "Price cannot be less than zero",
              },
            })}
          />
          <div className="invalid-feedback d-block">
            {errors.commodityPrice?.message}
          </div>
        </div>
        <div className="col-6">
          <label htmlFor="commodityUnit" className="form-label">
            Unit
          </label>
          <input
            type="number"
            className="form-control"
            {...register("commodityUnit", {
              required: "Unit is requred",
              min: {
                value: 0,
                message: "Unit annot be less than zero",
              },
            })}
          />
          <div className="invalid-feedback d-block">
            {errors.commodityUnit?.message}
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary me-2">
            New contract
          </button>
          <p className="text-danger">{contractDeployError}</p>
        </div>
      </form>
      {/* <div className="row mb-4">
        <div className="col">
          <button
            className="btn btn-primary"
            onClick={async () => {
              const newContract = await new web3.eth.Contract(
                CommodityTradeMatchingContract.abi
              )
                .deploy({
                  data: CommodityTradeMatchingContract.bytecode,
                  arguments: [
                    accounts[2],
                    accounts[3],
                    654321,
                    "Agricultural",
                    "Cattle",
                    8888,
                    88,
                  ],
                })
                .send({ from: accounts[2], gas: 1500000 });

              drizzle.addContract(
                {
                  contractName: "NewCommodityTradeMatching",
                  web3Contract: newContract,
                },
                ["StatusChanged"]
              );
            }}
          >
            New contract
          </button>
        </div>
      </div> */}
    </>
  );
};
