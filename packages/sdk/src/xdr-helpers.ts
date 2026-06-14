import { Address, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';

export function addressToScVal(address: string): xdr.ScVal {
  return new Address(address).toScVal();
}

export function u128ToScVal(value: bigint): xdr.ScVal {
  return nativeToScVal(value, { type: 'u128' });
}

export function u64ToScVal(value: bigint | number): xdr.ScVal {
  return nativeToScVal(BigInt(value), { type: 'u64' });
}

export function u32ToScVal(value: number): xdr.ScVal {
  return nativeToScVal(value, { type: 'u32' });
}

export function scValToBigint(val: xdr.ScVal): bigint {
  return BigInt(scValToNative(val));
}

export { scValToNative };
