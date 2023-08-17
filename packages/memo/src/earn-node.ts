import {
  EarnNodeProtocolId,
  HeaderVersion,
  EarnNodeActionIds,
} from "./constants";
import {
  encodeHeader,
  uint32ToUint8Array,
  uint8ToUint8Array,
  uint8ArrayToBase64,
  mergeUint8Array,
  stringToUint8Array,
  base64ToUint8Array,
  decodeHeader,
  uint8ArrayToUint32,
  uint8ArrayToUint8,
  getHeaderByteLength,
  checkSum,
  uint64ToUint8Array,
  uint8ArrayToUint64,
} from "./encode";
import { formatToInt64, bigIntToNumber } from "./helper";

export interface BuyParams {
  follow_id: string; // uuid
  product_id: number;
  product_status: number;
}

export function encodeBuyMemo(params: BuyParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: EarnNodeProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: EarnNodeActionIds.Buy,
  });

  const array: Uint8Array[] = [];

  array.push(uint32ToUint8Array(params.product_id));
  array.push(uint8ToUint8Array(params.product_status));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeBuyMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<BuyParams> = {};

  let offset = headerByteLength;

  params.product_id = uint8ArrayToUint32(arr.slice(offset, offset + 4));
  offset += 4;

  params.product_status = uint8ArrayToUint8(arr.slice(offset, offset + 1));

  return {
    header,
    params,
  };
}

export interface RedeemParams {
  follow_id: string; // uuid
  product_id: number;
  amount: string | number;
  product_status: number;
}

export function encodeRedeemMemo(params: RedeemParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: EarnNodeProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: EarnNodeActionIds.Redeem,
  });

  const array: Uint8Array[] = [];

  array.push(uint32ToUint8Array(params.product_id));
  array.push(uint64ToUint8Array(formatToInt64(params.amount)));
  array.push(uint8ToUint8Array(params.product_status));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeRedeemMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<RedeemParams> = {};

  let offset = headerByteLength;

  params.product_id = uint8ArrayToUint32(arr.slice(offset, offset + 4));
  offset += 4;

  params.amount =
    bigIntToNumber(uint8ArrayToUint64(arr.slice(offset, offset + 8))) + "";
  offset += 8;

  params.product_status = uint8ArrayToUint8(arr.slice(offset, offset + 1));

  return {
    header,
    params,
  };
}

export interface CancelQueueParams {
  follow_id: string;
  event_id: string;
}

export function encodeCancelQueueMemo(params: CancelQueueParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: EarnNodeProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: EarnNodeActionIds.CancelQueue,
  });

  const array: Uint8Array[] = [];

  array.push(uint8ToUint8Array(params.event_id.length));
  array.push(stringToUint8Array(params.event_id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}
