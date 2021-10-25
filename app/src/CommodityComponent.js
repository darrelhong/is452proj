import React, { useState } from "react";
import ContractComponent from "./ContractComponent";
import CommodityTradeMatchingContract from "./contracts/CommodityTradeMatching.json";

export default ({ drizzle, drizzleState }) => {
  const { web3 } = drizzle;
  const { accounts, contracts } = drizzleState;
  // set account
  const [currentAccountIndex, setAccountIndex] = useState(0);

  // useEffect(() => {
  //   const getInstance = async () => {
  //     const networkId = await web3.eth.net.getId();
  //     const deployedNetwork =
  //       CommodityTradeMatchingContract.networks[networkId];
  //     const instance = new web3.eth.Contract(
  //       CommodityTradeMatchingContract.abi,
  //       deployedNetwork && deployedNetwork.address
  //     );
  //     setContract(instance);
  //   };
  //   getInstance();
  // }, []);

  return (
    <div className="mt-5">
      <div className="d-flex align-items-baseline">
        <h3 className="me-1">Current account: </h3>
        <p>{accounts[currentAccountIndex]}</p>
      </div>
      <div className="row mb-4">
        <div className="col">
          <select
            value={currentAccountIndex}
            onChange={(e) => {
              setAccountIndex(e.target.value);
            }}
            className="form-select"
            aria-label="Default select example"
          >
            {Object.keys(accounts).map((key) => (
              <option value={key}>{accounts[key]}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row mb-4">
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
      </div>
      {Object.keys(drizzle.contracts).map((key) => {
        return (
          <ContractComponent
            contractName={key}
            contractInstance={drizzle.contracts[key]}
            contractState={contracts[key]}
            drizzle={drizzle}
            drizzleState={drizzleState}
            currentAccountIndex={currentAccountIndex}
          />
        );
      })}
    </div>
  );
};
