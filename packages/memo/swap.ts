import {
  base64ToUint8Array,
  decodeHeader,
  decodeMMISG,
  encodeHeader,
  encodeMMISG,
  getHeaderByteLength,
  getMMISGByteLength,
  mergeUint8Array,
  stringToUint8Array,
  uint16ToUint8Array,
  uint64ToUint8Array,
  uint8ArrayToBase64,
  uint8ArrayToString,
  uint8ArrayToUUID,
  uint8ArrayToUint16,
  uint8ArrayToUint64,
  uint8ArrayToUint8,
  uint8ToUint8Array,
  uuidToUint8Array,
} from "./encode";
import { formatToInt64, bigIntToNumber } from "./helper";
import {
  HeaderVersion,
  MMISGVersion,
  SwapProtocolId,
  SwapActionIds,
} from "./constants";

export interface MMISGParams {
  threshold?: number;
  members: string[];
}

export interface SwapParams {
  follow_id: string; // uuid
  fill_asset_id: string; // uuid
  minimum: number; // uint64
  route_hash: string;
}

export function encodeSwapMemo(params: SwapParams & MMISGParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: SwapProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: SwapActionIds.Swap,
  });

  const mmisg = encodeMMISG({
    version: MMISGVersion,
    member_count: params.members.length,
    threshold: params.threshold,
    members: params.members,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.fill_asset_id));
  array.push(uint8ToUint8Array(params.route_hash.length));
  array.push(stringToUint8Array(params.route_hash));
  array.push(uint64ToUint8Array(formatToInt64(params.minimum)));

  return uint8ArrayToBase64(mergeUint8Array(header, mmisg, ...array));
}

export function decodeSwapMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const mmisg = decodeMMISG(arr.slice(headerByteLength));
  const mmisgByteLength = getMMISGByteLength(mmisg);

  const params: Partial<SwapParams> = {};

  let offset = headerByteLength + mmisgByteLength;

  params.fill_asset_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  const routeHashLength = uint8ArrayToUint8(arr.slice(offset, offset + 1));
  offset += 1;
  params.route_hash = uint8ArrayToString(
    arr.slice(offset, offset + routeHashLength)
  );
  offset = offset + routeHashLength;

  params.minimum = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );
  offset += 8;

  return {
    header,
    mmisg,
    params,
  };
}

export interface AddLiquidityParams {
  asset_id: string; // uuid
  slippage: number;
  timeout: number;
  follow_id: string;
}

export function encodeAddLiquidityMemo(
  params: AddLiquidityParams & MMISGParams
) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: SwapProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: SwapActionIds.AddLiquidity,
  });

  const mmisg = encodeMMISG({
    version: MMISGVersion,
    member_count: params.members.length,
    threshold: params.threshold,
    members: params.members,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.asset_id));
  array.push(uint64ToUint8Array(formatToInt64(params.slippage)));
  array.push(uint16ToUint8Array(params.timeout));

  return uint8ArrayToBase64(mergeUint8Array(header, mmisg, ...array));
}

export function decodeAddLiquidityMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const mmisg = decodeMMISG(arr.slice(headerByteLength));
  const mmisgByteLength = getMMISGByteLength(mmisg);

  const params: Partial<AddLiquidityParams> = {};

  let offset = headerByteLength + mmisgByteLength;

  params.asset_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  params.slippage = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );
  offset += 8;

  params.timeout = uint8ArrayToUint16(arr.slice(offset, offset + 2));

  return {
    header,
    mmisg,
    params,
  };
}

export interface RemoveLiquidityParams {
  follow_id: string;
}

export function encodeRemoveLiquidityMemo(
  params: MMISGParams & RemoveLiquidityParams
) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: SwapProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: SwapActionIds.RemoveLiquidity,
  });

  const mmisg = encodeMMISG({
    version: MMISGVersion,
    member_count: params.members.length,
    threshold: params.threshold,
    members: params.members,
  });

  return uint8ArrayToBase64(mergeUint8Array(header, mmisg));
}

export function decodeRemoveLiquidityMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const mmisg = decodeMMISG(arr.slice(headerByteLength));

  return {
    header,
    mmisg,
  };
}
