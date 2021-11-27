import BigNumber from "bignumber.js";

export const BigNumberZD = BigNumber.clone({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export function valueToBigNumber(amount) {
  return new BigNumber(amount);
}

export function valueToZDBigNumber(amount) {
  return new BigNumberZD(amount);
}

const bn10 = new BigNumber(10);

const bn10PowLookup = {};

/**
 * It's a performance optimized version of 10 ** x, which essentially memoizes previously used pows and resolves them as lookup.
 * @param decimals
 * @returns 10 ** decimals
 */
export function pow10(decimals) {
  if (!bn10PowLookup[decimals]) bn10PowLookup[decimals] = bn10.pow(decimals);
  return bn10PowLookup[decimals];
}

export function normalize(n, decimals) {
  return normalizeBN(n, decimals).toString(10);
}

export function normalizeBN(n, decimals) {
  return valueToBigNumber(n).dividedBy(pow10(decimals));
}
