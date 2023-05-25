export function formatToInt64(n: number): bigint {
  return BigInt((n * 10 ** 8).toFixed(0));
}

export function bigIntToNumber(n: bigint): number {
  return Number(n) / 10 ** 8;
}

export function formatToInt(n: number, percision: number) {
  return Number((n * 10 ** percision).toFixed(0));
}

export function intToNumber(n: number, percision: number): number {
  return n / 10 ** percision;
}
