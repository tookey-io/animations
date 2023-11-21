import {
  Img,
  Layout,
  Node,
  NodeProps,
  Rect,
  RectProps,
  Txt,
  initial,
  signal,
} from "@motion-canvas/2d";
import { BASE_TEXT_COLOR, HEADER_BG_COLOR } from "../constants";
import {
  SimpleSignal,
  all,
  createRef,
  createSignal,
} from "@motion-canvas/core";
import defs from "../../defs";
import { BuildingBlock } from "./BuildingBlock";

interface BlockPickerItemProps extends NodeProps {
  logoUrl: string;
  title: string;
}

class BlockPickerItem extends Node {
  @signal()
  private readonly logoUrl: SimpleSignal<string, this>;

  @signal()
  private readonly title: SimpleSignal<string, this>;

  constructor(props: BlockPickerItemProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        layout
        direction="row"
        gap={10}
        padding={15}
        alignItems="center"
        stroke={HEADER_BG_COLOR}
        lineWidth={1}
      >
        <Img src={this.logoUrl} size={[32, 32]} />
        <Txt fontWeight={400} text={this.title} />
      </Rect>
    );
  }
}

export interface BlockPickerProps extends RectProps {}

export class BlockPicker extends Rect {
  public readonly searchRect = createRef<Rect>();
  public readonly searchString = createSignal("Search 123");
  public readonly resultsRect = createRef<Rect>();

  private pieces(query: string) {
    return Object.values(defs)
      .map((packages) => Object.values(packages))
      .flat()
      .filter((def) => def.displayName.startsWith(query))
      .slice(0, 15)
      .map((def) => ({
        logoUrl: `/pieces/${def.logoUrl.split("/").pop()}`,
        title: def.displayName,
      }));
  }

  constructor(props: BlockPickerProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        layout
        direction="column"
        padding={[20, 30, 20, 20]}
        gap={20}
        width={390}
        minWidth={390}
      >
        <Rect layout direction="row" gap={5} alignItems="center">
          <Txt>Select integration</Txt>
          <Layout grow={1} />
          <Img src="/icons/cross.svg" width={12} height={12} />
        </Rect>

        <Rect
          stroke={BASE_TEXT_COLOR}
          lineWidth={2}
          padding={15}
          layout
          direction="row"
          gap={10}
          ref={this.searchRect}
        >
          <Img src="/icons/search.svg" height={24} />
          <Rect grow={1} clip>
            <Txt fontWeight={400} text={() => this.searchString()} />
          </Rect>
        </Rect>

        <Rect layout direction="column" gap={10} ref={this.resultsRect}>
          {this.pieces("").map((piece) => (
            <BlockPickerItem {...piece} />
          ))}
        </Rect>
      </Rect>
    );
  }

  *search(query: string, time: number = 0.5) {
    console.log("search", query);
    yield* all(
      this.searchString("", 0.1),
      ...this.resultsRect()
        .children()
        .map((child) => child.x(-50, 0.2)),
      ...this.resultsRect()
        .children()
        .map((child) => child.opacity(0, 0.2))
    );
    this.resultsRect().removeChildren();
    this.resultsRect().add(
      this.pieces(query).map((piece) => (
        <BlockPickerItem {...piece} opacity={0} x={50} />
      ))
    );
    yield* this.searchString(query, time);
    yield* all(
      ...this.resultsRect()
        .children()
        .map((child) => child.opacity(1, 0.2)),
      ...this.resultsRect()
        .children()
        .map((child) => child.x(0, 0.2))
    );
  }
}
