import React, { useState } from "react";
import AddContractComponent from "./AddContractComponent";
import ContractComponent from "./ContractComponent";

export default ({ drizzle, drizzleState }) => {
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
    <>
      <div className="d-flex align-items-baseline mt-4">
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
              <option key={key} value={key}>{accounts[key]}</option>
            ))}
          </select>
        </div>
      </div>
      <AddContractComponent
        drizzle={drizzle}
        drizzleState={drizzleState}
        currentAccountIndex={currentAccountIndex}
      />
      {Object.keys(drizzle.contracts).map((key) => {
        return (
          <ContractComponent
            key={key}
            contractName={key}
            contractInstance={drizzle.contracts[key]}
            contractState={contracts[key]}
            drizzle={drizzle}
            drizzleState={drizzleState}
            currentAccountIndex={currentAccountIndex}
          />
        );
      })}
    </>
  );
};
