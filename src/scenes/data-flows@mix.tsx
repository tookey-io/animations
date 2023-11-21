import { makeScene2D } from "@motion-canvas/2d";

import { ChangeMode, DemoContext } from "../DemoContext";
import { all } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const context = new DemoContext();

  yield context.init(view);
  // yield* context.showHeader(ChangeMode.Immediate);
  yield* context.selectTrigger(
    "@activepieces",
    "piece-google-sheets",
    "new_row"
  );

  yield* context.replaceAction(
    1,
    "@activepieces",
    "piece-airtable",
    "airtable_create_record"
  );
  yield* context.removeAction(0);
  yield* context.replaceAction(
    1,
    "@activepieces",
    "piece-apitable",
    "apitable_create_record"
  );
  yield* all(
    context.replaceAction(1, "@activepieces", "piece-openai", "ask_chatgpt"),
    context.replaceAction(
      2,
      "@activepieces",
      "piece-apitable",
      "apitable_create_record"
    )
  );
  yield* context.replaceAction(
    2,
    "@tookey-io",
    "piece-ethereum",
    "contractCall"
  );
  yield* context.removeAction(0);
  yield* context.removeAction(0);
  yield* context.removeAction(0);
});
