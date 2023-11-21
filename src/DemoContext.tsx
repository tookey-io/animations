import { Img, Rect, View2D } from "@motion-canvas/2d";
import { all, createRef, waitFor } from "@motion-canvas/core";
import { App } from "./components/App";
import defs from "../defs";
import { EMPTY_TRIGGER, __GRAY_CARD_COLOR } from "./constants";
import { Cursor } from "./components/Cursor";

type Vendors = keyof typeof defs;
type VendorPackages<TVendor> = TVendor extends Vendors
  ? keyof (typeof defs)[TVendor]
  : never;
type Package<TVendor, TPackage> = TVendor extends Vendors
  ? TPackage extends VendorPackages<TVendor>
    ? (typeof defs)[TVendor][TPackage]
    : never
  : never;
type PackageTriggers<TVendor, TPackage> = TVendor extends Vendors
  ? TPackage extends VendorPackages<TVendor>
    ? Package<TVendor, TPackage> extends never
      ? never
      : keyof Package<TVendor, TPackage>["triggers"]
    : never
  : never;
type PackageActions<TVendor, TPackage> = TVendor extends Vendors
  ? TPackage extends VendorPackages<TVendor>
    ? Package<TVendor, TPackage> extends never
      ? never
      : keyof Package<TVendor, TPackage>["actions"]
    : never
  : never;

type TriggerProps<TVendor, TPackage, TTrigger> = TVendor extends Vendors
  ? TPackage extends VendorPackages<TVendor> & string
    ? TTrigger extends PackageTriggers<TVendor, TPackage> & string
      ? (typeof defs)[TVendor][TPackage] extends { triggers: object }
        ? (typeof defs)[TVendor][TPackage]["triggers"] extends Record<
            TTrigger,
            { props: Record<string, object> }
          >
          ? Record<
              keyof (typeof defs)[TVendor][TPackage]["triggers"][TTrigger]["props"],
              string
            >
          : never
        : never
      : never
    : never
  : never;

export enum ChangeMode {
  Immediate,
  Animated,
  Implicit,
}

export class DemoContext {
  public readonly app = createRef<App>();
  public readonly cursor = createRef<Cursor>();
  public readonly container = createRef<Rect>();
  public view: View2D;

  constructor() {}

  *init(view: View2D) {
    this.view = view;
    this.view.fill(__GRAY_CARD_COLOR);
    this.view.add(
      <>
        <Rect ref={this.container} width="100%" height="100%" />
        <App ref={this.app} />
        <Cursor ref={this.cursor} />
      </>
    );

    yield* waitFor();
  }

  *showTriggerPlaceholder(mode: ChangeMode = ChangeMode.Immediate) {
    yield* this.app().selectTrigger(
      EMPTY_TRIGGER,
      mode === ChangeMode.Immediate
    );
  }

  *showHeader(mode: ChangeMode = ChangeMode.Animated) {
    yield* this.app().showHeader(mode === ChangeMode.Immediate);
  }

  *hideHeader(mode: ChangeMode = ChangeMode.Animated) {
    yield* this.app().hideHeader(mode === ChangeMode.Immediate);
  }

  *showSidebar(immediate: boolean = false) {
    yield* this.app().showSidebar(immediate);
  }

  *hideSidebar(immediate: boolean = false) {
    yield* this.app().hideSidebar(immediate);
  }

  *createBlockPicker(immediate: boolean = false) {
    yield* this.app().showBlockPicker(immediate);
  }

  *setupTrigger<
    TVendor extends Vendors,
    TPackage extends VendorPackages<TVendor>,
    TTrigger extends PackageTriggers<TVendor, TPackage>,
    TValues extends TriggerProps<TVendor, TPackage, TTrigger>
  >(
    vendor: TVendor,
    pkg: TPackage,
    trigger: TTrigger,
    values: Partial<TValues>,
    mode: ChangeMode = ChangeMode.Animated
  ) {
    if (mode === ChangeMode.Implicit) {
      for (let [key, value] of Object.entries(values)) {
        yield* this.cursor().cursorMove(
          this.app().editor().fieldsGroup().children()[
            this.app()
              .editor()
              .currentFields.findIndex((f) => f.name === key)
          ]
        );
        yield* this.cursor().cursorClick();

        yield* this.app()
          .editor()
          .setupFields({
            [key]: value as string,
          });
      }
    } else {
      yield* this.app()
        .editor()
        .setupFields(
          values as Record<string, string>,
          mode === ChangeMode.Immediate
        );
    }
  }

  *createEditor<
    TVendor extends Vendors,
    TPackage extends VendorPackages<TVendor>
  >(
    vendor: TVendor,
    pkg: TPackage,
    isTrigger: boolean,
    mode: ChangeMode = ChangeMode.Animated
  ) {
    const packageDefinition = defs[vendor][
      pkg
    ] as (typeof defs)["@activepieces"]["piece-clickup"];
    const logoFile = (packageDefinition.logoUrl as string).split("/").pop();

    const interactions = isTrigger
      ? Object.values(packageDefinition.triggers)
      : Object.values(packageDefinition.actions);

    this.app()
      .editor()
      .setup({
        packageName: packageDefinition.displayName,
        logoUrl: `/pieces/${logoFile}`,
        isTrigger: isTrigger,
        options: interactions.map((i) => i.displayName),
      });

    yield* this.app().showBlockEditor(mode === ChangeMode.Immediate);
  }

  *removeAction(index: number, mode: ChangeMode = ChangeMode.Animated) {
    if (mode === ChangeMode.Implicit) {
      throw new Error("not yet...")
    } else {
      yield* this.app().removeAction(index, mode === ChangeMode.Immediate);
    }
  }

  *createTriggerEditor<
    TVendor extends Vendors,
    TPackage extends VendorPackages<TVendor>
  >(vendor: TVendor, pkg: TPackage, mode: ChangeMode = ChangeMode.Animated) {
    yield* this.createEditor(vendor, pkg, true, mode);
  }

  *createActionEditor<
    TVendor extends Vendors,
    TPackage extends VendorPackages<TVendor>
  >(vendor: TVendor, pkg: TPackage, mode: ChangeMode = ChangeMode.Animated) {
    yield* this.createEditor(vendor, pkg, false, mode);
  }

  *replaceTrigger<
    TVendor extends Vendors,
    TPackage extends VendorPackages<TVendor>,
    TTrigger extends PackageTriggers<TVendor, TPackage>
  >(
    vendor: TVendor,
    pkg: TPackage,
    trigger: TTrigger,
    mode: ChangeMode = ChangeMode.Animated
  ) {}

  *selectTrigger<
    TVendor extends Vendors,
    TPackage extends VendorPackages<TVendor>,
    TTrigger extends PackageTriggers<TVendor, TPackage>
  >(
    vendor: TVendor,
    pkg: TPackage,
    trigger: TTrigger,
    mode: ChangeMode = ChangeMode.Animated
  ) {
    const packageDefinition = defs[vendor][pkg] as any;
    const triggerDefinition = packageDefinition.triggers[trigger];
    const logoFile = (packageDefinition.logoUrl as string).split("/").pop();

    if (mode === ChangeMode.Implicit) {
      // show interaction
      yield* this.cursor().cursorMove(this.app().canvas().blocks[0]());
      yield* this.cursor().cursorClick();

      yield* this.createBlockPicker(true);

      yield* this.showSidebar();
      yield* this.cursor().cursorMove(this.app().picker().searchRect());
      yield* this.cursor().cursorClick();
      yield* this.app().picker()?.search(packageDefinition.displayName);

      yield* this.cursor().cursorMove(
        this.app().picker().resultsRect().children()[0]
      );
      yield* this.cursor().cursorClick();

      yield* all(
        this.createTriggerEditor(vendor, pkg),
        this.app().selectTrigger({
          name: triggerDefinition.displayName,
          title: packageDefinition.displayName,
          logoUrl: `/pieces/${logoFile}`,
        })
      );

      yield* this.cursor().cursorMove(
        this.app().editor().actionGroup().children()[0]
      );
      yield* this.cursor().cursorClick();

      yield* this.app()
        .editor()
        .setupInteraction({
          name: triggerDefinition.displayName,
          fields: Object.entries(triggerDefinition.props).map(
            ([name, def]: [string, any]) => ({
              ...def,
              name,
            })
          ),
        });
    } else {
      yield* this.app().selectTrigger(
        {
          name: triggerDefinition.displayName,
          title: packageDefinition.displayName,
          logoUrl: `/pieces/${logoFile}`,
        },
        mode === ChangeMode.Immediate
      );
    }
    // if ("triggers" in pkgDef) {
    // const def = pkg.triggers[trigger];
    // }
  }

  *replaceAction<
    TVendor extends Vendors,
    TPackage extends VendorPackages<TVendor>,
    TAction extends PackageActions<TVendor, TPackage>
  >(
    index: number,
    vendor: TVendor,
    pkg: TPackage,
    action: TAction,
    mode: ChangeMode = ChangeMode.Animated
  ) {
    const packageDefinition = defs[vendor][pkg] as any;
    const triggerDefinition = packageDefinition.actions[action];
    const logoFile = (packageDefinition.logoUrl as string).split("/").pop();

    if (mode === ChangeMode.Implicit) {
      // show interaction
      yield* this.cursor().cursorMove(this.app().canvas().blocks[0]());
      yield* this.cursor().cursorClick();

      yield* this.createBlockPicker(true);

      yield* this.showSidebar();
      yield* this.cursor().cursorMove(this.app().picker().searchRect());
      yield* this.cursor().cursorClick();
      yield* this.app().picker()?.search(packageDefinition.displayName);

      yield* this.cursor().cursorMove(
        this.app().picker().resultsRect().children()[0]
      );
      yield* this.cursor().cursorClick();

      yield* all(
        this.createActionEditor(vendor, pkg),
        this.app().replaceAction({
          name: triggerDefinition.displayName,
          title: packageDefinition.displayName,
          logoUrl: `/pieces/${logoFile}`,
        }, index)
      );

      yield* this.cursor().cursorMove(
        this.app().editor().actionGroup().children()[0]
      );
      yield* this.cursor().cursorClick();

      yield* this.app()
        .editor()
        .setupInteraction({
          name: triggerDefinition.displayName,
          fields: Object.entries(triggerDefinition.props).map(
            ([name, def]: [string, any]) => ({
              ...def,
              name,
            })
          ),
        });
    } else {
      yield* this.app().replaceAction(
        {
          name: triggerDefinition.displayName,
          title: packageDefinition.displayName,
          logoUrl: `/pieces/${logoFile}`,
        },
        index,
        mode === ChangeMode.Immediate
      );
    }
  }
}