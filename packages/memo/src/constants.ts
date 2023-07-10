export const HeaderVersion = 1;
export const MMISGVersion = 1;

export const SwapProtocolId = 1;
export const LeafProtocolId = 2;
export const RingsProtocolId = 3;
export const EarnNodeProtocolId = 4;
export const LimitOrderProtocolId = 5;

export const SwapActionIds = {
  AddLiquidity: 1,
  RemoveLiquidity: 2,
  Swap: 3,
};

export const LimitOrderActionIds = {
  PutOrder: 1,
  CancelOrder: 2,
};

export const EarnNodeActionIds = {
  Buy: 1,
  Redeem: 2,
  Deposit: 3,
  InterestPay: 4,
  CancelQueue: 5,
};
