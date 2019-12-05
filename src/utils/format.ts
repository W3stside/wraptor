// Formatting utils here
export const toNativeDecimals = (weiValue: string | number, decimals: string | number = 18): number =>
  +weiValue / 10 ** +decimals
