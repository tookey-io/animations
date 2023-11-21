import { makeScene2D } from "@motion-canvas/2d";
import {
  all,
  waitFor
} from "@motion-canvas/core";

import { ChangeMode, DemoContext } from "../DemoContext";


export default makeScene2D(function* (view) {
  const context = new DemoContext();

  yield context.init(view);
  yield* context.showHeader(ChangeMode.Immediate);
  yield* context.showTriggerPlaceholder(ChangeMode.Animated);
  // yield* context.showSidebar();

  yield* context.selectTrigger(
    "@activepieces",
    "piece-google-sheets",
    "new_row",
    ChangeMode.Implicit
  );

  yield* context.setupTrigger(
    "@activepieces",
    "piece-google-sheets",
    "new_row",
    {
      spreadsheet_id: "my-spreadsheet-id",
      sheet_id: "List 1",
      max_rows_to_poll: "100",
    },
    ChangeMode.Implicit
  )

  yield* context.hideSidebar()
  // yield* waitFor(0.5)

  yield* context.cursor().cursorMove(context.app().canvas().blocks[0]())

  yield* context.selectTrigger(
    "@activepieces",
    "piece-apitable",
    "new_record",
  );
  yield* context.cursor().cursorClick()
  yield* context.selectTrigger(
    "@tookey-io",
    "piece-ethereum",
    "event",
  );
  yield* context.cursor().cursorMovePosition([512, 355])

  yield* context.replaceAction(
    1,
    "@activepieces",
    "piece-google-sheets",
    "insert_row",
  );

  yield* context.replaceAction(
    1,
    "@activepieces",
    "piece-airtable",
    "airtable_create_record",
  );

  yield* context.replaceAction(
    2,
    "@activepieces",
    "piece-discord",
    "send_message_webhook",
  );
  
  yield* context.removeAction(
    1
  )

  yield* context.replaceAction(
    2,
    "@tookey-io",
    "piece-ethereum",
    "contractCall",
  );

  yield* context.replaceAction(
    3,
    "@tookey-io",
    "piece-wallet",
    "sign-request",
  );
  yield* context.selectTrigger(
    "@activepieces",
    "piece-schedule",
    "every_x_minutes",
  );

  yield* context.removeAction(
    1
  )
  yield* context.removeAction(
    1
  )
  yield* context.removeAction(
    1
  )
  yield* context.removeAction(
    0
  )

  // yield* context.replaceAction(
  //   0,
  //   "@activepieces",
  //   "piece-apitable",
  //   "apitable_create_record",
  // );
  // yield* context.replaceAction(
  //   0,
  //   "@activepieces",
  //   "piece-airtable",
  //   "airtable_create_record"
  // );
  // yield* context.replaceAction(
  //   0,
  //   "@activepieces",
  //   "piece-http",
  //   "send_request"
  // );
  // yield* context.replaceAction(
  //   0,
  //   "@tookey-io",
  //   "piece-ethereum",
  //   "contractCall"
  // );

  // yield* context.showTriggerPlaceholder(ChangeMode.Animated);

  // yield* context.addAction(1, "@tookey-io", "piece-wallet", "sign-request");

});
