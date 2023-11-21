import { makeScene2D } from "@motion-canvas/2d";

import { ChangeMode, DemoContext } from "../DemoContext";
import { all } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const context = new DemoContext();

  yield context.init(view);
  // yield* context.showHeader(ChangeMode.Immediate);
  yield* context.selectTrigger(
    "@tookey-io",
    "piece-ethereum",
    "event"
  );

  yield* context.replaceAction(
    1,
    "@tookey-io",
    "piece-ethereum",
    "contractCall"
  );
  yield* context.replaceAction(
    2,
    "@tookey-io",
    "piece-wallet",
    "sign-request"
  );
  yield* context.replaceAction(
    1,
    "@tookey-io",
    "piece-bitcoin",
    "fetch_ordinals"
  );
  yield* context.selectTrigger(
    "@activepieces",
    "piece-schedule",
    "every_x_minutes"
  );
  yield* context.replaceAction(
    1,
    "@tookey-io",
    "piece-allbridge",
    "swap_stables_exact_in"
  );

  yield* context.removeAction(0);
  yield* context.removeAction(0);
  yield* context.removeAction(0);
});
