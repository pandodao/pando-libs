import { v4 as uuid } from "uuid";
import {
  mergeUint8Array,
  uint8ArrayToBase64,
  base64ToUint8Array,
  uint16ToUint8Array,
  uint8ToUint8Array,
  uint64ToUint8Array,
  uuidToUint8Array,
  uint8ArrayToUint8,
  uint8ArrayToUint16,
  uint8ArrayToUint64,
  uint8ArrayToUUID,
  encodeHeader,
  decodeHeader,
  encodeMMISG,
  decodeMMISG,
  stringToUint8Array,
  uint8ArrayToString,
  checkSum,
} from "./encode";

describe("Test Encode", () => {
  it("test mergeUint8Array", () => {
    const arr1 = new Uint8Array([1, 2, 3]);
    const arr2 = new Uint8Array([4, 5, 6]);
    const arr3 = new Uint8Array([1, 2, 3, 4, 5, 6]);

    expect(mergeUint8Array(arr1, arr2)).toEqual(arr3);
  });

  it("test base64ToUint8Array", () => {
    const uint8Array = uuidToUint8Array(uuid());
    const str = uint8ArrayToBase64(uint8Array);

    expect(base64ToUint8Array(str)).toEqual(uint8Array);
  });

  it("test uint8ToUint8Array", () => {
    const num = 255;
    const uint8Array = uint8ToUint8Array(num);

    expect(uint8Array.byteLength).eq(1);
    expect(uint8ArrayToUint8(uint8Array)).eq(num);
  });

  it("test uint16ToUint8Array", () => {
    const num = 65535;
    const uint8Array = uint16ToUint8Array(num);

    expect(uint8Array.byteLength).eq(2);
    expect(uint8ArrayToUint16(uint8Array)).eq(num);
  });

  it("test uint64ToUint8Array", () => {
    const num = 2n ** 64n - 1n;
    const uint8Array = uint64ToUint8Array(num);

    expect(uint8Array.byteLength).eq(8);
    expect(uint8ArrayToUint64(uint8Array)).eq(num);
  });

  it("test uuidToUint8Array", () => {
    const id = uuid();
    const uint8Array = uuidToUint8Array(id);

    expect(uint8Array.byteLength).eq(16);
    expect(uint8ArrayToUUID(uint8Array)).eq(id);
  });

  it("test stringToUint8Array", () => {
    const str = uuid();
    const uint8Array = stringToUint8Array(str);

    expect(uint8ArrayToString(uint8Array)).toEqual(str);
  });

  it("test encodeHeader 1", () => {
    const header = {
      version: 1,
      protocol_id: 1,
      has_follow_id: 0,
      action: 1,
    };

    const uint8Array = encodeHeader(header);

    expect(uint8Array.byteLength).eq(5);
    expect(decodeHeader(uint8Array)).toEqual(header);
  });

  it("test encodeHeader 2", () => {
    const header = {
      version: 1,
      protocol_id: 1,
      has_follow_id: 1,
      follow_id: uuid(),
      action: 1,
    };

    const uint8Array = encodeHeader(header);

    expect(uint8Array.byteLength).eq(21);
    expect(decodeHeader(uint8Array)).toEqual(header);
  });

  it("test encodeMMISG 1", () => {
    const mmisg = {
      version: 1,
      member_count: 0,
    };

    const uint8Array = encodeMMISG(mmisg);

    expect(uint8Array.byteLength).eq(2);
    expect(decodeMMISG(uint8Array)).toEqual(mmisg);
  });

  it("test encodeMMISG 2", () => {
    const mmisg = {
      version: 1,
      member_count: 1,
      members: [uuid()],
    };

    const uint8Array = encodeMMISG(mmisg);

    expect(uint8Array.byteLength).eq(18);
    expect(decodeMMISG(uint8Array)).toEqual(mmisg);
  });

  it("test encodeMMISG 3", () => {
    const mmisg = {
      version: 1,
      member_count: 3,
      threshold: 2,
      members: [uuid(), uuid(), uuid()],
    };

    const uint8Array = encodeMMISG(mmisg);

    expect(uint8Array.byteLength).eq(3 + 16 * 3);
    expect(decodeMMISG(uint8Array)).toEqual(mmisg);
  });

  it("test checkSum", () => {
    const arr = new Uint8Array([1, 2, 3, 4, 5, 6]);

    expect(checkSum(arr).length).eq(10);
  });
});
