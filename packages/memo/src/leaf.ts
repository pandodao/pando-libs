import { LeafActionIds, HeaderVersion, LeafProtocolId } from "./constants";
import {
  encodeHeader,
  uuidToUint8Array,
  uint64ToUint8Array,
  mergeUint8Array,
  uint8ArrayToBase64,
  checkSum,
  base64ToUint8Array,
  decodeHeader,
  getHeaderByteLength,
  uint8ArrayToUUID,
  uint8ArrayToUint64,
} from "./encode";

import { formatToInt64, bigIntToNumber } from "./helper";

export interface OpenVaultParams {
  collateral_id: string;
  amount: number; // debt amount
  follow_id: string;
}

export interface GenerateParams {
  vault_id: string;
  amount: number; // debt amount
  follow_id: string;
}

export interface DepositParams {
  vault_id: string;
  follow_id: string;
}

export interface PaybackParams {
  vault_id: string;
  follow_id: string;
}

export interface WithdrawParams {
  vault_id: string;
  follow_id: string;
  amount: number; // withdraw amount
}

export interface BidParams {
  follow_id: string;
  flip_id: string;
  amount: number;
}

export function encodeOpenVaultMemo(params: OpenVaultParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LeafProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LeafActionIds.OpenVault,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.collateral_id));
  array.push(uint64ToUint8Array(formatToInt64(params.amount)));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeOpenVaultMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<OpenVaultParams> = {};

  let offset = headerByteLength;

  params.collateral_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  params.amount = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );

  return { header, params };
}

export function encodeGenerateMemo(params: GenerateParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LeafProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LeafActionIds.Generate,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.vault_id));
  array.push(uint64ToUint8Array(formatToInt64(params.amount)));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeGenerateMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<GenerateParams> = {};

  let offset = headerByteLength;

  params.vault_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  params.amount = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );

  return { header, params };
}

export function encodeDepositMemo(params: DepositParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LeafProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LeafActionIds.Deposit,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.vault_id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeDepositMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<DepositParams> = {};

  const offset = headerByteLength;

  params.vault_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));

  return { header, params };
}

export function encodePaybackMemo(params: PaybackParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LeafProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LeafActionIds.Payback,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.vault_id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodePaybackMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<PaybackParams> = {};

  const offset = headerByteLength;

  params.vault_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));

  return { header, params };
}

export function encodeWithdrawMemo(params: WithdrawParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LeafProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LeafActionIds.Withdraw,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.vault_id));
  array.push(uint64ToUint8Array(formatToInt64(params.amount)));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeWithdrawMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<WithdrawParams> = {};

  let offset = headerByteLength;

  params.vault_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  params.amount = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );

  return { header, params };
}

export function encodeBidMemo(params: BidParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LeafProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LeafActionIds.Bid,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.flip_id));
  array.push(uint64ToUint8Array(formatToInt64(params.amount)));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeBidMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<BidParams> = {};

  let offset = headerByteLength;

  params.flip_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  params.amount = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );

  return { header, params };
}
