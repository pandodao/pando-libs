import {
  encodePutLimitOrderMemo,
  // decodePutLimitOrderMemo,
  // encodeCancelLimitOrderMemo,
  // encodePutAggSwapOrderMemo,
} from "./limit-order";
import cases from "./limit-order.cases.json";
import { LimitOrderActionIds } from "./constants";

describe("Test Limit Order Encode", () => {
  // it(`test limit order memo encoding`, () => {
  //   const item = cases[470];

  //   const memo = encodePutLimitOrderMemo({
  //     follow_id: item.header.follow_id,
  //     fill_asset_id: item.order_action.fill_asset_id!,
  //     expect_amount: item.order_action.expects!,
  //     expire: item.order_action.expired_at!,
  //   });

  //   expect(memo).eq(item.memo);
  // });

  cases.forEach((item, index) => {
    it(`test limit order memo encoding ${index}`, () => {
      if (item.order_action.type === 2) {
        // const memo = encodePutAggSwapOrderMemo({
        //   follow_id: item.header.follow_id,
        //   fill_asset_id: item.order_action.fill_asset_id!,
        //   min_amount: Number(item.order_action.min_amount!),
        //   routes: item.order_action.routes!,
        // });
        // expect(memo).eq(item.memo);
      } else {
        if (item.header.action === LimitOrderActionIds.PutOrder) {
          const memo = encodePutLimitOrderMemo({
            follow_id: item.header.follow_id,
            fill_asset_id: item.order_action.fill_asset_id!,
            expect_amount: item.order_action.expects!,
            expire: item.order_action.expired_at!,
          });
          expect(memo).eq(item.memo);
        } else if (item.header.action === LimitOrderActionIds.CancelOrder) {
          // const memo = encodeCancelLimitOrderMemo({
          //   order_id: item.params.order_id!,
          //   follow_id: item.header.has_follow_id ? item.header.follow_id : "",
          // });
          // expect(memo).eq(item.memo);
        }
      }
    });
  });
});
