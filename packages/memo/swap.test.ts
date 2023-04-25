import { v4 as uuid } from "uuid";
import {
  decodeAddLiquidityMemo,
  decodeRemoveLiquidityMemo,
  decodeSwapMemo,
  encodeAddLiquidityMemo,
  encodeRemoveLiquidityMemo,
  encodeSwapMemo,
} from "./swap";
import {
  HeaderVersion,
  SwapProtocolId,
  SwapActionIds,
  MMISGVersion,
} from "./constants";

describe("Test Swap Encode", () => {
  it("test encodeSwapMemo 1", () => {
    const params = {
      follow_id: uuid(),
      fill_asset_id: uuid(),
      minimum: 1.00001,
      route_hash: "xyz",
      member_count: 0,
    };

    const memo = encodeSwapMemo(params);
    const decoded = decodeSwapMemo(memo);

    expect(decoded.header).toEqual({
      version: HeaderVersion,
      protocol_id: SwapProtocolId,
      has_follow_id: 1,
      follow_id: params.follow_id,
      action: SwapActionIds.Swap,
    });

    expect(decoded.mmisg).toEqual({
      version: MMISGVersion,
      member_count: 0,
    });

    expect(decoded.params).toEqual({
      fill_asset_id: params.fill_asset_id,
      minimum: params.minimum,
      route_hash: params.route_hash,
    });
  });

  it("test encodeSwapMemo 2", () => {
    const params = {
      follow_id: uuid(),
      fill_asset_id: uuid(),
      minimum: 1.00001231232131,
      route_hash: "xyz",
      member_count: 1,
      members: [uuid()],
    };

    const memo = encodeSwapMemo(params);
    const decoded = decodeSwapMemo(memo);

    expect(decoded.header).toEqual({
      version: HeaderVersion,
      protocol_id: SwapProtocolId,
      has_follow_id: 1,
      follow_id: params.follow_id,
      action: SwapActionIds.Swap,
    });

    expect(decoded.mmisg).toEqual({
      version: MMISGVersion,
      member_count: 1,
      members: params.members,
    });

    expect(decoded.params).toEqual({
      fill_asset_id: params.fill_asset_id,
      minimum: 1.00001231,
      route_hash: params.route_hash,
    });
  });

  it("test encodeAddLiquidityMemo", () => {
    const params = {
      asset_id: uuid(),
      slippage: 0.01,
      timeout: 60,
      follow_id: uuid(),
      member_count: 0,
    };

    const memo = encodeAddLiquidityMemo(params);
    const decoded = decodeAddLiquidityMemo(memo);

    expect(decoded.header).toEqual({
      version: HeaderVersion,
      protocol_id: SwapProtocolId,
      has_follow_id: 1,
      follow_id: params.follow_id,
      action: SwapActionIds.AddLiquidity,
    });

    expect(decoded.mmisg).toEqual({
      version: MMISGVersion,
      member_count: 0,
    });

    expect(decoded.params).toEqual({
      asset_id: params.asset_id,
      slippage: params.slippage,
      timeout: params.timeout,
    });
  });

  it("test encodeRemoveLiquidityMemo", () => {
    const params = {
      follow_id: uuid(),
      member_count: 0,
    };

    const memo = encodeRemoveLiquidityMemo(params);
    const decoded = decodeRemoveLiquidityMemo(memo);

    expect(decoded.header).toEqual({
      version: HeaderVersion,
      protocol_id: SwapProtocolId,
      has_follow_id: 1,
      follow_id: params.follow_id,
      action: SwapActionIds.RemoveLiquidity,
    });

    expect(decoded.mmisg).toEqual({
      version: MMISGVersion,
      member_count: 0,
    });
  });
});
