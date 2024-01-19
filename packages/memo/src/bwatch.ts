import { BWatchActionIds, BWatchProtocolId, HeaderVersion } from "./constants";
import {
  encodeHeader,
  uuidToUint8Array,
  uint8ArrayToBase64,
  mergeUint8Array,
  checkSum,
} from "./encode";

export interface BuyParams {
  etf_id: string;
  follow_id: string;
}

export interface RedeemParams {
  etf_id: string;
  follow_id: string;
}

export function encodeBuyMemo(params: BuyParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: BWatchProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: BWatchActionIds.buy,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.etf_id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export function encodeRedeemMemo(params: RedeemParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: BWatchProtocolId,
    has_follow_id: params.follow_id ? 1 : 0,
    follow_id: params.follow_id,
    action: BWatchActionIds.redeem,
  });

  const array: Uint8Array[] = [];

  array.push(uuidToUint8Array(params.etf_id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}
