import BigNumber from "bignumber.js";

export function formatToInt64(n: number | string): bigint {
  return BigInt(BigNumber(n).times(BigNumber(10).pow(8)).toString());
}

export function bigIntToNumber(n: bigint): number {
  return BigNumber(Number(n)).div(BigNumber(10).pow(8)).toNumber();
}

export function formatToInt(n: number, percision: number) {
  return BigNumber(n)
    .times(BigNumber(10).pow(percision))
    .decimalPlaces(0)
    .toString();
}

export function intToNumber(n: number, percision: number): number {
  return BigNumber(n).div(BigNumber(10).pow(percision)).toNumber();
}
