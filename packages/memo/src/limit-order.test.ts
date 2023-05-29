import {
  encodePutLimitOrderMemo,
  encodeCancelLimitOrderMemo,
} from "./limit-order";
import cases from "./limit-order.cases.json";
import { LimitOrderActionIds } from "./constants";

describe("Test Limit Order Encode", () => {
  cases.forEach((item, index) => {
    it(`test limit order memo encoding ${index}`, () => {
      if (item.header.action === LimitOrderActionIds.PutOrder) {
        const memo = encodePutLimitOrderMemo({
          follow_id: item.header.has_follow_id ? item.header.follow_id : "",
          fill_asset_id: item.params.fill_asset!,
          expect_amount: Number(item.params.expect_amount!),
          expire: item.params.expire_at!,
        });

        expect(memo).eq(item.memo);
      } else if (item.header.action === LimitOrderActionIds.CancelOrder) {
        const memo = encodeCancelLimitOrderMemo({
          order_id: item.params.order_id!,
          follow_id: item.header.has_follow_id ? item.header.follow_id : "",
        });

        expect(memo).eq(item.memo);
      }
    });
  });
});
