// import cases from "./swap.cases.json";
import {
  decodeSwapMemo,
  // encodeAddLiquidityMemo,
  // encodeRemoveLiquidityMemo,
  encodeSwapMemo,
} from "./swap";
// import { SwapActionIds } from "./constants";

describe("Test Swap Encode", () => {
  it("test swap memo encoding", () => {
    const params = {
      follow_id: "515e0a05-88d5-4176-9e24-8a8fac161f6f",
      threshold: 2,
      members: [
        "854cecd8-1b74-4578-92e9-7f6397bafded",
        "92c471c7-0ebf-4ab3-85b8-0d20c031f697",
      ],
      fill_asset_id: "853a7ef4-01a2-4463-8b39-4befb4c53476",
      minimum: 16429,
      routes: [{ weight: 100, pairIds: [30] }],
    };
    const memo = encodeSwapMemo(params);

    expect(decodeSwapMemo(memo).params.routes).toEqual(params.routes);
  });

  // cases.forEach((item, index) => {
  //   it(`test swap memo encoding with case ${index}`, () => {
  //     if (item.header.action === SwapActionIds.AddLiquidity) {
  //       const memo = encodeAddLiquidityMemo({
  //         follow_id: item.header.has_follow_id ? item.header.follow_id : "",
  //         asset_id: item.params.asset!,
  //         slippage: Number(item.params.slippage!),
  //         timeout: item.params.exp!,
  //         members: item.mmsig.members,
  //         threshold: item.mmsig.threshold,
  //       });
  //       expect(memo).eq(item.memo);
  //     }
  //     if (item.header.action === SwapActionIds.RemoveLiquidity) {
  //       const memo = encodeRemoveLiquidityMemo({
  //         follow_id: item.header.has_follow_id ? item.header.follow_id : "",
  //         threshold: item.mmsig.threshold,
  //         members: item.mmsig.members,
  //       });
  //       expect(memo).eq(item.memo);
  //     }
  //     if (item.header.action === SwapActionIds.Swap) {
  //       const memo = encodeSwapMemo({
  //         follow_id: item.header.has_follow_id ? item.header.follow_id : "",
  //         threshold: item.mmsig.threshold,
  //         members: item.mmsig.members,
  //         fill_asset_id: item.params.asset!,
  //         minimum: Number(item.params.min!),
  //         route_hash: item.params.route!,
  //       });
  //       expect(memo).eq(item.memo);
  //     }
  //   });
  // });
});
