import {
  encodeHeader,
  uuidToUint8Array,
  uint64ToUint8Array,
  uint8ArrayToBase64,
  mergeUint8Array,
  base64ToUint8Array,
  decodeHeader,
  getHeaderByteLength,
  uint8ArrayToUUID,
  uint8ArrayToUint64,
  checkSum,
  uint8ToUint8Array,
  stringToUint8Array,
} from "./encode";
import { formatToInt64, bigIntToNumber } from "./helper";
import {
  HeaderVersion,
  LimitOrderProtocolId,
  LimitOrderActionIds,
} from "./constants";

export interface PutLimitOrderParams {
  follow_id: string;
  fill_asset_id: string;
  expect_amount: number | string;
  expire: number | string;
  order_type?: number;
}

export function encodePutLimitOrderMemo(params: PutLimitOrderParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LimitOrderProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LimitOrderActionIds.PutOrder,
  });

  const array: Uint8Array[] = [];

  // order type = 1
  array.push(uint8ToUint8Array(1));

  array.push(uuidToUint8Array(params.fill_asset_id));

  array.push(uint64ToUint8Array(formatToInt64(params.expect_amount)));

  array.push(uint64ToUint8Array(BigInt(params.expire)));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodePutLimitOrderMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<PutLimitOrderParams> = {};

  let offset = headerByteLength;

  params.order_type = arr[offset];
  offset += 1;

  params.fill_asset_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  params.expect_amount = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );
  offset += 8;

  params.expire = Number(uint8ArrayToUint64(arr.slice(offset, offset + 8)));

  return { header, params };
}

export interface CancelLimitOrderParams {
  order_id: string;
  follow_id: string;
}

export function encodeCancelLimitOrderMemo(params: CancelLimitOrderParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LimitOrderProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LimitOrderActionIds.CancelOrder,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.order_id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeCancelLimitOrderMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<CancelLimitOrderParams> = {};

  const offset = headerByteLength;

  params.order_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));

  return { header, params };
}

export interface Route {
  exchange: number;
  shares: number;
  routes: string;
}

export interface PutAggSwapOrderParams {
  follow_id: string;
  fill_asset_id: string;
  min_amount: number;
  routes: Route[];
}

export function encodePutAggSwapOrderMemo(params: PutAggSwapOrderParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LimitOrderProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: LimitOrderActionIds.PutOrder,
  });

  const array: Uint8Array[] = [];

  // order type = 2
  array.push(uint8ToUint8Array(2));
  array.push(uuidToUint8Array(params.fill_asset_id));
  array.push(uint64ToUint8Array(formatToInt64(params.min_amount)));

  const routes = mergeUint8Array(...params.routes.map(encodeRoute));

  array.push(uint8ToUint8Array(routes.length));
  array.push(routes);

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

function encodeRoute(route: Route) {
  const array: Uint8Array[] = [];

  const temp = ((route.exchange & 0xf) << 4) | (route.shares & 0xf);

  array.push(uint8ToUint8Array(temp));
  array.push(uint8ToUint8Array(route.routes.length));
  array.push(stringToUint8Array(route.routes));

  return mergeUint8Array(...array);
}
