export const HeaderVersion = 2;
export const MMISGVersion = 1;

export const SwapProtocolId = 1;
export const LeafProtocolId = 2;
export const RingsProtocolId = 3;
export const EarnNodeProtocolId = 4;
export const LimitOrderProtocolId = 5;
export const BWatchProtocolId = 6;
export const LendProtocolId = 6;

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

export const LendActionIds = {
  Pledge: 1,
  Withdraw: 2,
  Loan: 3,
  Repay: 4,
  Cancel: 5,
};

export const LeafActionIds = {
  OpenVault: 31,
  Generate: 35,
  Deposit: 32,
  Payback: 34,
  Withdraw: 33,
  Bid: 42,
};

export const BWatchActionIds = {
  buy: 1,
  redeem: 2,
};
