import { xdr, Address } from '@stellar/stellar-sdk';

export function bigintToU128(value: bigint): xdr.ScVal {
  const lo = value & BigInt("0xFFFFFFFFFFFFFFFF");
  const hi = value >> BigInt(64);
  return xdr.ScVal.scvU128(
    new xdr.UInt128Parts({ 
      hi: xdr.Uint64.fromString(hi.toString()), 
      lo: xdr.Uint64.fromString(lo.toString()) 
    })
  );
}

export function u128ToBigint(val: xdr.ScVal): bigint {
  if (val.switch() !== xdr.ScValType.scvU128()) {
    throw new Error("Expected scvU128");
  }
  const parts = val.u128();
  const hi = BigInt(parts.hi().toString());
  const lo = BigInt(parts.lo().toString());
  return (hi << BigInt(64)) | lo;
}

export function addressToScVal(address: string): xdr.ScVal {
  return new Address(address).toScVal();
}
