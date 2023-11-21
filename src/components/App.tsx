import {
  Layout,
  LayoutProps,
  Node,
  Rect
} from "@motion-canvas/2d";
import {
  DEFAULT,
  all,
  any,
  createRef,
  waitFor
} from "@motion-canvas/core";
import { Block } from "../types";
import { AppCanvas, DataPickerProps } from "./AppCanvas";
import { AppHeader, HeaderProps } from "./AppHeader";
import { AppSidebar, SidebarProps } from "./AppSidebar";
import { BlockEditor } from "./BlockEditor";
import { BlockPicker } from "./BlockPicker";

export interface AppProps extends LayoutProps {
  header?: HeaderProps;
  sidebar?: SidebarProps;
  dataPicker?: DataPickerProps;
}

export class App extends Layout {
  public readonly root = createRef<Rect>();
  public readonly header = createRef<AppHeader>();
  public readonly sidebar = createRef<AppSidebar>();
  public readonly canvas = createRef<AppCanvas>();
  public readonly sidebarContent = createRef<Node>();

  public picker = createRef<BlockPicker>();
  public editor = createRef<BlockEditor>();

  public *selectTrigger(block: Block, immediate: boolean = false) {
    yield* this.canvas().setTrigger(block, immediate);
  }

  *replaceAction(block: Block, index: number, immediate: boolean = false) {
    yield* this.canvas().replaceOrCreteBlock(block, index, immediate);
  }

  *removeAction(index: number, immediate: boolean = false) {
    yield* this.canvas().removeBlock(index, immediate);
  }

  public *showHeader(immediate: boolean = false) {
    if (immediate) {
      this.header().maxHeight(DEFAULT);
      this.header().opacity(1);
      yield* this.header().show(true);
    } else {
      yield* this.header().hide(true);
      yield* any(
        this.header().maxHeight(60, 0.6),
        this.header().opacity(1, 0.6),
        waitFor(0.4)
      );

      yield* this.header().show();
    }
  }

  public *hideHeader(immediate: boolean = false) {
    if (immediate) {
      this.header().maxHeight(0);
      this.header().opacity(0);
      yield* this.header().hide(true);
    } else {
      yield* this.header().show(true);
      yield* any(
        this.header().maxHeight(0, 0.6),
        this.header().opacity(0, 0.6),
        waitFor(0.4)
      );

      yield* this.header().hide();
    }
  }

  public *hideSidebar(immediate: boolean = false) {
    if (immediate) {
      this.sidebar().hide(true);
      this.sidebar().maxWidth(0);
      this.sidebar().opacity(0);
    } else {
      yield* this.sidebar().show(true);
      yield* any(
        this.sidebar().maxWidth(0, 0.6),
        this.sidebar().opacity(0, 0.6),
        waitFor(0.4)
      );
    }
  }

  public *showSidebar(immediate: boolean = false) {
    if (immediate) {
      this.sidebar().show(true);
      this.sidebar().maxWidth(390);
      this.sidebar().opacity(1);
    } else {
      yield* this.sidebar().hide(true);
      yield* any(
        this.sidebar().maxWidth(390, 0.6),
        this.sidebar().opacity(1, 0.6),
        waitFor(0.4)
      );

      yield* this.sidebar().show();
    }
  }

  public *showBlockPicker(immediate: boolean = false) {
    if (immediate) {
      this.sidebarContent().x(-390);
      this.editor().opacity(0);
      this.picker().opacity(1);
    } else {
      yield* all(
        this.sidebarContent().x(-390, 0.35),
        this.editor().opacity(0, 0.35),
        this.picker().opacity(1, 0.35),
      );
    }
  }

  public *showBlockEditor(immediate: boolean = false) {
    if (immediate) {
      this.sidebarContent().x(0);
      this.editor().opacity(1);
      this.picker().opacity(0);
    } else {
      yield* all(
        this.sidebarContent().x(0, 0.35),
        this.editor().opacity(1, 0.35),
        this.picker().opacity(0, 0.35),
      );
    }
  }

  constructor(props?: AppProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        fontFamily={"Mulish"}
        fontSize={16}
        lineHeight={24}
        ref={this.root}
        layout
        direction="column"
        width={1280}
        height={720}
        clip={true}
      >
        <AppHeader ref={this.header} opacity={0} maxHeight={0} />
        <Rect layout direction="row" grow={1}>
          <AppCanvas grow={1} ref={this.canvas} />
          <AppSidebar
            ref={this.sidebar}
            maxWidth={0}
            opacity={0}
            height={720 - 60}
          >
            <Node ref={this.sidebarContent}>
              <BlockEditor ref={this.editor} opacity={0}/>
              <BlockPicker ref={this.picker} opacity={0}/>
            </Node>
          </AppSidebar>
          {/* <Rect
            layout={false}
            fill="orange"
            width={200}
            height={450}
            bottomRight={this.canvas().bottomRight}
          /> */}
        </Rect>
      </Rect>
    );
  }
}
