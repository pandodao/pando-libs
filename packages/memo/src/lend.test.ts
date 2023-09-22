import {
  encodeWithdrawMemo,
  encodeLoanMemo,
  encodeCancelMemo,
  encodePledgeMemo,
  encodeRepayMemo,
} from "./lend";

describe("Test Lend Encode", () => {
  it("test encodeWithdrawMemo", () => {
    const params = {
      follow_id: "b3b4c09c-2421-41ec-b8d4-bdedfbbd58b1",
      plege_type: 1,
      asset_id: "c94ac88f-4671-3976-b60a-09064f1811e8",
      amount: "1",
      contract_id: "",
    };

    const memo = encodeWithdrawMemo(params);

    expect(memo).eq(
      "AgYBs7TAnCQhQey41L3t+71YsQACASRjOTRhYzg4Zi00NjcxLTM5NzYtYjYwYS0wOTA2NGYxODExZTgBMQAaZeIZ"
    );
  });

  it("test encodePledgeMemo", () => {
    const params = {
      follow_id: "b3b4c09c-2421-41ec-b8d4-bdedfbbd58b1",
      plege_type: 2,
      contract_id: "1",
    };

    const memo = encodePledgeMemo(params);

    expect(memo).eq("AgYBs7TAnCQhQey41L3t+71YsQABAgExKotNWQ==");
  });

  it("test encodeLoanMemo", () => {
    const params = {
      follow_id: "b3b4c09c-2421-41ec-b8d4-bdedfbbd58b1",
      amount: "1",
    };

    const memo = encodeLoanMemo(params);

    expect(memo).eq("AgYBs7TAnCQhQey41L3t+71YsQADATHU2Q9T");
  });

  it("test encodeCancelMemo", () => {
    const params = {
      follow_id: "b3b4c09c-2421-41ec-b8d4-bdedfbbd58b1",
      id: "12",
    };

    const memo = encodeCancelMemo(params);

    expect(memo).eq("AgYBs7TAnCQhQey41L3t+71YsQAFAjEyMRpxfA==");
  });

  it("test encodeRepayMemo", () => {
    const params = { follow_id: "b3b4c09c-2421-41ec-b8d4-bdedfbbd58b1" };

    const memo = encodeRepayMemo(params);

    expect(memo).eq("AgYBs7TAnCQhQey41L3t+71YsQAEcl7GMw==");
  });
});
