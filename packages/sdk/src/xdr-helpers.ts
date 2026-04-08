// XDR helpers — full Stellar SDK integration wired in Phase 7
// These are placeholder types for frontend compilation

export function bigintToScVal(value: bigint): any {
  return value; // placeholder
}

export function u128ToBigint(val: any): bigint {
  return BigInt(val ?? 0);
}

export function addressToScVal(address: string): any {
  return address; // placeholder
}
