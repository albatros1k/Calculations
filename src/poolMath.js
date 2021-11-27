import BigNumber from "bignumber.js";

import { BigNumberValue, valueToBigNumber, valueToZDBigNumber, pow10 } from "./bigNumber";
import * as RayMath from "./rayMath";
import { SECONDS_PER_YEAR } from "./constants";

export const LTV_PRECISION = 4;

export function calculateCompoundedInterest(rate, currentTimestamp, lastUpdateTimestamp) {
  const timeDelta = valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp);
  const ratePerSecond = valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR);
  return RayMath.binomialApproximatedRayPow(ratePerSecond, timeDelta);
}

export function getCompoundedBalance(_principalBalance, _reserveIndex, _reserveRate, _lastUpdateTimestamp, currentTimestamp) {
  const principalBalance = valueToZDBigNumber(_principalBalance);
  if (principalBalance.eq("0")) {
    return principalBalance;
  }

  const compoundedInterest = calculateCompoundedInterest(_reserveRate, currentTimestamp, _lastUpdateTimestamp);
  const cumulatedInterest = RayMath.rayMul(compoundedInterest, _reserveIndex);
  const principalBalanceRay = RayMath.wadToRay(principalBalance);

  return RayMath.rayToWad(RayMath.rayMul(principalBalanceRay, cumulatedInterest));
}

export const calculateLinearInterest = (rate, currentTimestamp, lastUpdateTimestamp) => {
  const timeDelta = RayMath.wadToRay(valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp));
  const timeDeltaInSeconds = RayMath.rayDiv(timeDelta, RayMath.wadToRay(SECONDS_PER_YEAR));
  return RayMath.rayMul(rate, timeDeltaInSeconds).plus(RayMath.RAY);
};

export function getReserveNormalizedIncome(rate, index, lastUpdateTimestamp, currentTimestamp) {
  if (valueToZDBigNumber(rate).eq("0")) {
    return valueToZDBigNumber(index);
  }

  const cumulatedInterest = calculateLinearInterest(rate, currentTimestamp, lastUpdateTimestamp);

  return RayMath.rayMul(cumulatedInterest, index);
}

export function getLinearBalance(balance, index, rate, lastUpdateTimestamp, currentTimestamp) {
  return RayMath.rayToWad(RayMath.rayMul(RayMath.wadToRay(balance), getReserveNormalizedIncome(rate, index, lastUpdateTimestamp, currentTimestamp)));
  debugger;
}

export function getCompoundedStableBalance(_principalBalance, _userStableRate, _lastUpdateTimestamp, currentTimestamp) {
  const principalBalance = valueToZDBigNumber(_principalBalance);
  if (principalBalance.eq("0")) {
    return principalBalance;
  }

  const cumulatedInterest = calculateCompoundedInterest(_userStableRate, currentTimestamp, _lastUpdateTimestamp);
  const principalBalanceRay = RayMath.wadToRay(principalBalance);

  return RayMath.rayToWad(RayMath.rayMul(principalBalanceRay, cumulatedInterest));
}

export function calculateHealthFactorFromBalances(collateralBalanceETH, borrowBalanceETH, currentLiquidationThreshold) {
  if (valueToBigNumber(borrowBalanceETH).eq(0)) {
    return valueToBigNumber("-1"); // invalid number
  }
  return valueToBigNumber(collateralBalanceETH).multipliedBy(currentLiquidationThreshold).dividedBy(pow10(LTV_PRECISION)).div(borrowBalanceETH);
}

export function calculateHealthFactorFromBalancesBigUnits(collateralBalanceETH, borrowBalanceETH, currentLiquidationThreshold) {
  return calculateHealthFactorFromBalances(
    collateralBalanceETH,
    borrowBalanceETH,
    new BigNumber(currentLiquidationThreshold).multipliedBy(pow10(LTV_PRECISION)).decimalPlaces(0, BigNumber.ROUND_DOWN)
  );
}

export function calculateAvailableBorrowsETH(collateralBalanceETH, borrowBalanceETH, currentLtv) {
  if (valueToZDBigNumber(currentLtv).eq(0)) {
    return valueToZDBigNumber("0");
  }
  const availableBorrowsETH = valueToZDBigNumber(collateralBalanceETH).multipliedBy(currentLtv).dividedBy(pow10(LTV_PRECISION)).minus(borrowBalanceETH);
  return availableBorrowsETH.gt("0") ? availableBorrowsETH : valueToZDBigNumber("0");
}

export function calculateAverageRate(index0, index1, timestamp0, timestamp1) {
  return valueToBigNumber(index1)
    .dividedBy(index0)
    .minus("1")
    .dividedBy(timestamp1 - timestamp0)
    .multipliedBy(SECONDS_PER_YEAR)
    .toString();
}
