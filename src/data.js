import React, { Fragment, useEffect, useState } from "react";
import { v2 } from "@aave/protocol-js";
import { formatUserSummaryData } from "./computeData";

export const Data = () => {
  const [poolReservesData, setPoolReservesData] = useState(null);
  const [rawUserReserves, setRawUserReserves] = useState(null);
  const [userSummary, setUserSummary] = useState(null);
  const [usdPriceEth, setUsdPriceEth] = useState(null);

  const userAddress = "0x28557eaed24ffc12316219053d26b495b1eb3e32";
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Address for rewards 0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5   => toLowerCase

  const rewardsInfo = {
    emissionEndTimestamp: 1645353539,
    incentivePrecision: 18,
    rewardTokenAddress: "0x4da27a545c0c5b758a6ba100e3a049001de870f5",
    rewardTokenDecimals: 18,
    rewardTokenPriceEth: 240619450713917,
  };


  // Pool id is lending pool id
  useEffect(() => {
    fetch(`https://api.thegraph.com/subgraphs/name/aave/protocol-v2-kovan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
       {
  reserves (where: {
    pool: "0x88757f2f99175387ab4c6a4b3067c77a695b0349"
  }){
    id
  underlyingAsset
  name
  symbol
  decimals
  isActive
  isFrozen
  usageAsCollateralEnabled
  borrowingEnabled
  stableBorrowRateEnabled
  baseLTVasCollateral
  optimalUtilisationRate
  averageStableRate
  stableRateSlope1
  stableRateSlope2
  baseVariableBorrowRate
  variableRateSlope1
  variableRateSlope2
  variableBorrowIndex
  variableBorrowRate
  totalScaledVariableDebt
  liquidityIndex
  reserveLiquidationThreshold
  aToken {
    id
  }
  vToken {
    id
  }
  sToken {
    id
  }
  availableLiquidity
  stableBorrowRate
  liquidityRate
  totalPrincipalStableDebt
  totalLiquidity
  utilizationRate
  reserveLiquidationBonus
  price {
    priceInEth
  }
  lastUpdateTimestamp
  stableDebtLastUpdateTimestamp
  reserveFactor
  }
}
        `,
      }),
    })
      .then((res) => res.json())
      .then(({ data: { reserves } }) => setPoolReservesData(reserves));
    fetch(`https://api.thegraph.com/subgraphs/name/aave/protocol-v2-kovan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
   userReserves(where: {user: "0x28557eaed24ffc12316219053d26b495b1eb3e32", pool: "0x88757f2f99175387ab4c6a4b3067c77a695b0349"}) {
   scaledATokenBalance
  reserve {
    id
    underlyingAsset
    name
    symbol
    decimals
    liquidityRate
    reserveLiquidationBonus
    lastUpdateTimestamp
    aToken {
      id
    }
  }
  usageAsCollateralEnabledOnUser
  stableBorrowRate
  stableBorrowLastUpdateTimestamp
  principalStableDebt
  scaledVariableDebt
  variableBorrowIndex
  lastUpdateTimestamp
  }
}
        `,
      }),
    })
      .then((res) => res.json())
      .then(({ data: { userReserves } }) => setRawUserReserves(userReserves));

    fetch(`https://api.thegraph.com/subgraphs/name/aave/protocol-v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
  priceOracle(id: 1) {
    usdPriceEth
  }
}
        `,
      }),
    })
      .then((res) => res.json())
      .then(({ data: { priceOracle } }) => setUsdPriceEth(priceOracle.usdPriceEth));
  }, []);

  if (!poolReservesData || !rawUserReserves) return <>Loading...</>;
  else {
    // const _userSummary = v2.formatUserSummaryData(poolReservesData, rawUserReserves, userAddress, Math.floor(Date.now() / 1000), rewardsInfo);
    // const _userSummary = formatUserSummaryData(poolReservesData, rawUserReserves, userAddress, Math.floor(Date.now() / 1000), rewardsInfo);
    // console.log(_userSummary, "SUM");
    // console.log(usdPriceEth);
    return (
      <Fragment>
        <h3>DATA</h3>
      </Fragment>
    );
  }
};
