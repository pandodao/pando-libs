import cases from "./swap.cases.json";
import {
  encodeAddLiquidityMemo,
  encodeRemoveLiquidityMemo,
  encodeSwapMemo,
} from "./swap";
import { SwapActionIds } from "./constants";

describe("Test Swap Encode", () => {
  cases.forEach((item, index) => {
    it(`test swap memo encoding with case ${index}`, () => {
      if (item.header.action === SwapActionIds.AddLiquidity) {
        const memo = encodeAddLiquidityMemo({
          follow_id: item.header.has_follow_id ? item.header.follow_id : "",
          asset_id: item.params.asset!,
          slippage: Number(item.params.slippage!),
          timeout: item.params.exp!,
          members: item.mmsig.members,
          threshold: item.mmsig.threshold,
        });

        expect(memo).eq(item.memo);
      }

      if (item.header.action === SwapActionIds.RemoveLiquidity) {
        const memo = encodeRemoveLiquidityMemo({
          follow_id: item.header.has_follow_id ? item.header.follow_id : "",
          threshold: item.mmsig.threshold,
          members: item.mmsig.members,
        });

        expect(memo).eq(item.memo);
      }

      if (item.header.action === SwapActionIds.Swap) {
        const memo = encodeSwapMemo({
          follow_id: item.header.has_follow_id ? item.header.follow_id : "",
          threshold: item.mmsig.threshold,
          members: item.mmsig.members,
          fill_asset_id: item.params.asset!,
          minimum: Number(item.params.min!),
          route_hash: item.params.route!,
        });

        expect(memo).eq(item.memo);
      }
    });
  });
});
