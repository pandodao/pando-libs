import {
  encodeHeader,
  uint8ToUint8Array,
  stringToUint8Array,
  checkSum,
  uint8ArrayToBase64,
  mergeUint8Array,
} from "./encode";
import { HeaderVersion, LendActionIds, LendProtocolId } from "./constants";

export interface WithdrawParams {
  plege_type: number;
  follow_id: string;
  asset_id: string;
  amount: string;
  contract_id: string;
}

export function encodeWithdrawMemo(params: WithdrawParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LendProtocolId,
    has_follow_id: 1,
    follow_id: params.follow_id,
    action: LendActionIds.Withdraw,
  });

  const array: Uint8Array[] = [];

  array.push(uint8ToUint8Array(params.plege_type));
  array.push(uint8ToUint8Array(params.asset_id.length));
  array.push(stringToUint8Array(params.asset_id));
  array.push(uint8ToUint8Array(params.amount.length));
  array.push(stringToUint8Array(params.amount));
  array.push(uint8ToUint8Array(params.contract_id.length));
  array.push(stringToUint8Array(params.contract_id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export interface PledgeParams {
  plege_type: number;
  follow_id: string;
  contract_id: string;
}

export function encodePledgeMemo(params: PledgeParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LendProtocolId,
    has_follow_id: 1,
    follow_id: params.follow_id,
    action: LendActionIds.Pledge,
  });

  const array: Uint8Array[] = [];

  array.push(uint8ToUint8Array(params.plege_type));
  array.push(uint8ToUint8Array(params.contract_id.length));
  array.push(stringToUint8Array(params.contract_id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export interface LoanParams {
  follow_id: string;
  amount: string;
}

export function encodeLoanMemo(params: LoanParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LendProtocolId,
    has_follow_id: 1,
    follow_id: params.follow_id,
    action: LendActionIds.Loan,
  });

  const array: Uint8Array[] = [];

  array.push(uint8ToUint8Array(params.amount.length));
  array.push(stringToUint8Array(params.amount));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}

export interface RepayParams {
  follow_id: string;
}

export function encodeRepayMemo(params: RepayParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LendProtocolId,
    has_follow_id: 1,
    follow_id: params.follow_id,
    action: LendActionIds.Repay,
  });

  return uint8ArrayToBase64(checkSum(header));
}

export interface CancelParams {
  follow_id: string;
  id: string;
}

export function encodeCancelMemo(params: CancelParams) {
  const header = encodeHeader({
    version: HeaderVersion,
    protocol_id: LendProtocolId,
    has_follow_id: 1,
    follow_id: params.follow_id,
    action: LendActionIds.Cancel,
  });

  const array: Uint8Array[] = [];

  array.push(uint8ToUint8Array(params.id.length));
  array.push(stringToUint8Array(params.id));

  return uint8ArrayToBase64(checkSum(mergeUint8Array(header, ...array)));
}
