# Pando Memo Encoding Proto

This typescript repo provide implementation of [Pando Memo Encoding Proto](https://developers.pando.im/references/action.html)

## Usage

Here is an example for converting swap params to base64 formated memo:

```ts
import { swap as MemoEncoder } from "@foxone/memo-encode";

// swap encode
const params = {
  follow_id: uuid(),
  fill_asset_id: uuid(),
  minimum: 1.00001,
  route_hash: "xyz",
  members: [],
};

// base64 memo for mixin transaction
const memo = MemoEncoder.encodeSwapMemo(params);
```

Other functions and params please read source code from `src/index.ts`
