import {
  base64ToUint8Array,
  decodeHeader,
  encodeHeader,
  getHeaderByteLength,
  mergeUint8Array,
  uint16ToUint8Array,
  uint64ToUint8Array,
  uint8ArrayToBase64,
  uint8ArrayToUUID,
  uint8ArrayToUint16,
  uint8ArrayToUint64,
  uint8ArrayToUint8,
  uint8ToUint8Array,
  uuidToUint8Array,
  checkSum,
} from "./encode";
import { formatToInt64, bigIntToNumber } from "./helper";
import { HeaderVersion, SwapProtocolId, SwapActionIds } from "./constants";

export interface SwapParams {
  follow_id: string; // uuid
  fill_asset_id: string; // uuid
  minimum: number; // uint64
  routes: RouteItem[];
}

export interface RouteItem {
  weight: number; //
  pairIds: number[];
}

export function encodeRoutes(routes: RouteItem[]) {
  const arrays: Uint8Array[] = [];

  arrays.push(uint8ToUint8Array(routes.length));

  routes.forEach((route) => {
    arrays.push(uint8ToUint8Array(route.weight));
    arrays.push(uint8ToUint8Array(route.pairIds.length));

    route.pairIds.forEach((id) => {
      arrays.push(uint16ToUint8Array(id));
    });
  });

  return mergeUint8Array(...arrays);
}

export function decodeRoutes(array: Uint8Array): {
  routes: RouteItem[];
  length: number;
} {
  let offset = 0;

  const routes: RouteItem[] = [];
  const routeLength = uint8ArrayToUint8(array.slice(0, 1));

  offset += 1;

  for (let i = 0; i < routeLength; i++) {
    const pairIds: number[] = [];
    const weight = uint8ArrayToUint8(array.slice(offset, offset + 1));

    offset += 1;

    const pairIdsLength = uint8ArrayToUint8(array.slice(offset, offset + 1));

    offset += 1;

    for (let j = 0; j < pairIdsLength; j++) {
      pairIds.push(uint8ArrayToUint16(array.slice(offset, offset + 2)));
      offset += 2;
    }

    routes.push({ weight, pairIds });
  }

  return { routes, length: offset };
}

export function encodeSwapMemo(params: SwapParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: SwapProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: SwapActionIds.Swap,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.fill_asset_id));
  array.push(encodeRoutes(params.routes));
  array.push(uint64ToUint8Array(formatToInt64(params.minimum)));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeSwapMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<SwapParams> = {};

  let offset = headerByteLength;

  params.fill_asset_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  const { routes, length: RoutesLength } = decodeRoutes(arr.slice(offset));

  params.routes = routes;
  offset = offset + RoutesLength;

  params.minimum = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );
  offset += 8;

  return {
    header,
    params,
  };
}

export interface AddLiquidityParams {
  asset_id: string; // uuid
  slippage: number;
  timeout: number;
  follow_id: string;
}

export function encodeAddLiquidityMemo(params: AddLiquidityParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: SwapProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: SwapActionIds.AddLiquidity,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.asset_id));
  array.push(uint64ToUint8Array(formatToInt64(params.slippage)));
  array.push(uint16ToUint8Array(params.timeout));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function decodeAddLiquidityMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);
  const headerByteLength = getHeaderByteLength(header);

  const params: Partial<AddLiquidityParams> = {};

  let offset = headerByteLength;

  params.asset_id = uint8ArrayToUUID(arr.slice(offset, offset + 16));
  offset += 16;

  params.slippage = bigIntToNumber(
    uint8ArrayToUint64(arr.slice(offset, offset + 8))
  );
  offset += 8;

  params.timeout = uint8ArrayToUint16(arr.slice(offset, offset + 2));

  return {
    header,
    params,
  };
}

export interface RemoveLiquidityParams {
  follow_id: string;
}

export function encodeRemoveLiquidityMemo(params: RemoveLiquidityParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: SwapProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: SwapActionIds.RemoveLiquidity,
  });

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header)));
}

export function decodeRemoveLiquidityMemo(str: string) {
  const arr = base64ToUint8Array(str);

  const header = decodeHeader(arr);

  return {
    header,
  };
}
