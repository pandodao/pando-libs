import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import { Buffer } from "buffer";

export function mergeUint8Array(...arrays: Uint8Array[]) {
  const totalLength = arrays.reduce((acc, array) => acc + array.byteLength, 0);
  const mergedUint8Array = new Uint8Array(totalLength);

  let offset = 0;

  for (const array of arrays) {
    mergedUint8Array.set(array, offset);

    offset += array.byteLength;
  }

  return mergedUint8Array;
}

export function uint8ArrayToBase64(uint8Array: Uint8Array) {
  return Buffer.from(uint8Array).toString("base64");
}

export function base64ToUint8Array(str: string) {
  return new Uint8Array(Buffer.from(str, "base64"));
}

// number 0 - 256
export function uint8ToUint8Array(n: number) {
  const buffer = new ArrayBuffer(1);
  const view = new DataView(buffer);

  view.setUint8(0, n);

  return new Uint8Array(buffer);
}

// number 0 - 65535
export function uint16ToUint8Array(n: number) {
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);

  view.setUint16(0, n);

  return new Uint8Array(buffer);
}

// uint64
export function uint64ToUint8Array(n: bigint) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  view.setBigUint64(0, n);

  return new Uint8Array(buffer);
}

export function stringToUint8Array(str: string) {
  return new Uint8Array(str.split("").map((c, i) => str.charCodeAt(i)));
}

export function uuidToUint8Array(string: string) {
  const uuidBytes = uuidParse(string);
  const uint8Array = new Uint8Array(uuidBytes);

  return uint8Array;
}

// number: 0 - 256
export function uint8ArrayToUint8(arr: Uint8Array) {
  const view = new DataView(arr.buffer);

  return view.getUint8(0);
}

// number: 0 - 65535
export function uint8ArrayToUint16(arr: Uint8Array) {
  const view = new DataView(arr.buffer);

  return view.getUint16(0);
}

export function uint8ArrayToUint64(arr: Uint8Array) {
  const view = new DataView(arr.buffer);

  return view.getBigUint64(0);
}

export function uint8ArrayToUUID(arr: Uint8Array) {
  return uuidStringify(arr);
}

export function uint8ArrayToString(arr: Uint8Array) {
  return String.fromCharCode.apply(null, arr as any);
}

export interface Header {
  version: number;
  protocol_id: number;
  has_follow_id: number; // 0 or 1
  follow_id?: string; // uuid
  action: number;
}

export function encodeHeader(header: Header) {
  const arrays: Uint8Array[] = [];

  arrays.push(uint8ToUint8Array(header.version));
  arrays.push(uint8ToUint8Array(header.protocol_id));
  arrays.push(uint8ToUint8Array(header.has_follow_id));

  if (header.has_follow_id) {
    if (!header.follow_id)
      throw new Error("has_follow_id is truthy, but no follow id provide");

    arrays.push(uuidToUint8Array(header.follow_id));
  }

  arrays.push(uint16ToUint8Array(header.action));

  return mergeUint8Array(...arrays);
}

export function decodeHeader(arr: Uint8Array): Header {
  const header: Partial<Header> = {};

  header.version = uint8ArrayToUint8(arr.slice(0, 1));
  header.protocol_id = uint8ArrayToUint8(arr.slice(1, 2));
  header.has_follow_id = uint8ArrayToUint8(arr.slice(2, 3));

  if (header.has_follow_id) {
    header.follow_id = uint8ArrayToUUID(arr.slice(3, 19));
    header.action = uint8ArrayToUint16(arr.slice(19, 21));
  } else {
    header.action = uint8ArrayToUint16(arr.slice(3, 5));
  }

  return header as Header;
}

export function getHeaderByteLength(header: Header) {
  return header.follow_id ? 21 : 5;
}

export interface MMISG {
  version: number;
  member_count: number;
  threshold?: number;
  members?: string[];
}

export function encodeMMISG(mmisg: MMISG) {
  const arrays: Uint8Array[] = [];

  arrays.push(uint8ToUint8Array(mmisg.version));
  arrays.push(uint8ToUint8Array(mmisg.member_count));

  if (mmisg.member_count === 0) {
    return mergeUint8Array(...arrays);
  } else if (mmisg.member_count > 1) {
    arrays.push(uint8ToUint8Array(mmisg.threshold!));
  }

  for (const member of mmisg.members!) {
    arrays.push(uuidToUint8Array(member));
  }

  return mergeUint8Array(...arrays);
}

export function decodeMMISG(arr: Uint8Array): MMISG {
  const mmisg: Partial<MMISG> = {};

  mmisg.version = uint8ArrayToUint8(arr.slice(0, 1));
  mmisg.member_count = uint8ArrayToUint8(arr.slice(1, 2));

  if (mmisg.member_count === 0) {
    return mmisg as MMISG;
  } else if (mmisg.member_count === 1) {
    mmisg.members = [uint8ArrayToUUID(arr.slice(2, 18))];

    return mmisg as MMISG;
  } else {
    let offset = 3;

    mmisg.threshold = uint8ArrayToUint8(arr.slice(2, 3));
    mmisg.members = [];

    for (let i = 0; i < mmisg.member_count; i++) {
      mmisg.members.push(uint8ArrayToUUID(arr.slice(offset, offset + 16)));

      offset += 16;
    }

    return mmisg as MMISG;
  }
}

export function getMMISGByteLength(mmisg: MMISG) {
  return mmisg.member_count === 0
    ? 2
    : mmisg.member_count === 1
    ? 18
    : 3 + mmisg.member_count * 16;
}
