import {
  Layout,
  LayoutProps,
  Line,
  Node,
  NodeProps,
  Rect,
  Txt,
  vector2Signal,
} from "@motion-canvas/2d";
import {
  PossibleVector2,
  Reference,
  SignalValue,
  Vector2Signal,
  all,
  createRef,
  createSignal,
  range,
} from "@motion-canvas/core";
import { Block } from "../types";
import { BuildingBlock } from "./BuildingBlock";

export interface ConnectionProps extends NodeProps {
  from: SignalValue<PossibleVector2>;
}

export class Connection extends Node {
  @vector2Signal()
  public readonly from: Vector2Signal<this>;

  private length = createSignal(0);
  private start = createSignal(() => this.from().addY(90 / 2 + 5));
  private end = createSignal(() => this.start().addY(this.length()));

  private leftArrowArm = createSignal(() =>
    this.start().sub(this.end()).normalized.rotate(45).mul(10)
  );
  private rightArrowArm = createSignal(() =>
    this.start().sub(this.end()).normalized.rotate(-45).mul(10)
  );

  private arrowPoints = createSignal(() => [
    this.end().add(this.leftArrowArm()),
    this.end(),
    this.end().add(this.rightArrowArm()),
  ]);

  private points = createSignal(() => [this.start(), this.end()]);
  private plusPos = createSignal(() => this.end().addY(25));

  private fade = createSignal(1);

  *appear(immediate: boolean = false) {
    if (immediate) {
      this.length(60);
      this.fade(0);
    } else {
      yield* all(this.length(60, 0.5), this.fade(0, 0.5));
    }
  }

  *hide(immediate: boolean = false) {
    if (immediate) {
      this.length(0);
      this.fade(1);
    } else {
      yield* all(this.length(0, 0.5), this.fade(1, 0.5));
    }
  }

  constructor(props: ConnectionProps) {
    super({
      ...props,
    });

    this.add(
      <Node opacity={() => 1 - this.fade()}>
        <Line stroke="#a6b1bf" lineWidth={2} points={() => this.points()} />
        <Line
          stroke="#a6b1bf"
          lineWidth={2}
          points={() => this.arrowPoints()}
        />
        <Rect
          width={15}
          height={15}
          radius={3}
          fill="#a6b1bf"
          position={() => this.plusPos()}
        ></Rect>
        <Txt fill="white" fontSize={12} position={() => this.plusPos().addY(1)}>
          +
        </Txt>
      </Node>
    );
  }
}

export interface DataPickerProps extends LayoutProps {}
export class AppCanvas extends Layout {
  public readonly blocks: Reference<BuildingBlock>[] = [];
  public readonly connections: Reference<Connection>[] = [];
  public readonly container = createRef<Rect>();
  public readonly connectionsContainer = createRef<Rect>();

  private newBlock(block: Block, index: number) {
    const newBlock = createRef<BuildingBlock>();
    this.container().add(
      <BuildingBlock
        title={block.title}
        name={block.name}
        logoUrl={block.logoUrl}
        ref={newBlock}
        y={index * (90 + 70)}
      />
    );
    return newBlock;
  }

  private newConnection(index: number) {
    const newConnection = createRef<Connection>();

    this.connectionsContainer().add(
      <Connection from={[0, index * (90 + 70)]} ref={newConnection} />
    );

    return newConnection;
  }

  *setTrigger(trigger: Block, immediate: boolean = false) {
    yield* this.replaceOrCreteBlock(trigger, 0, immediate);
  }

  *removeBlock(index: number, immediate: boolean) {
    if (index >= this.blocks.length) {
      return;
    }

    const center = ((this.blocks.length - 2) / 2) * -(90 + 70);

    if (immediate) {
      const ref = this.blocks[index];
      this.blocks.splice(index, 1);

      this.connectionsContainer().children().slice(-1)[0].remove();
      ref().remove();

      this.blocks.forEach((block, i) => {
        block().y(i * (90 + 70));
      });

      this.container().y(center);
      this.connectionsContainer().y(center);
    } else {
      yield* all(
        ...range(this.blocks.length).map((i) => {
          const blockRef = this.blocks[i];
          const connectionRef = this.connections[i];

          if (i < index) {
            return null;
          } else if (i === index) {
            return all(
              blockRef().scale(0.5, 0.5),
              blockRef().opacity(0, 0.5),
              connectionRef().hide()
            );
          } else {
            return all(
              blockRef().y((i - 1) * (90 + 70), 0.5),
              connectionRef().from([0, (i - 1) * (90 + 70)], 0.5)
            );
          }
        }),
        this.container().y(center, 0.5),
        this.connectionsContainer().y(center, 0.5)
      );
      this.blocks[index]().remove();
      this.connections[index]().remove();

      this.blocks.splice(index, 1);
      this.connections.splice(index, 1);
    }
  }

  *replaceOrCreteBlock(
    block: Block,
    index: number,
    immediate: boolean = false
  ) {
    const center = (Math.max(index, this.blocks.length - 1) / 2) * -(90 + 70);
    if (immediate) {
      const found = this.blocks[index];
      if (found) {
        found().title(block.title);
        found().name(block.name);
        found().logoUrl(block.logoUrl);
      } else {
        const newAction = this.newBlock(block, index);
        const newConnection = this.newConnection(index);
        yield* newConnection().appear(60, true);
        this.blocks[index] = newAction;
        this.connections[index] = newConnection;
      }
      this.container().y(center);
      this.connectionsContainer().y(center);
    } else {
      const found = this.blocks[index];
      if (found) {
        const newAction = this.newBlock(block, index);
        newAction().x(150).opacity(0).scale(1);
        yield* all(
          newAction().x(0, 0.5),
          newAction().opacity(1, 0.6),
          newAction().scale(1, 0.6),
          found().x(-150, 0.5),
          found().opacity(0, 0.6),
          found().scale(0.8, 0.6),
          this.container().y(center, 0.5),
          this.connectionsContainer().y(center, 0.5)
        );

        found().remove();

        this.blocks[index] = newAction;
      } else {
        const newAction = this.newBlock(block, index);
        const newConnection = this.newConnection(index);
        newAction().x(60).opacity(0);
        yield* all(
          newAction().x(60, 0).to(0, 0.5),
          newAction().opacity(0, 0).to(1, 0.6),
          this.container().y(center, 0.5),
          this.connectionsContainer().y(center, 0.5),
          newConnection().appear()
        );

        this.blocks[index] = newAction;
        this.connections[index] = newConnection;
      }
    }
  }

  constructor(props?: DataPickerProps) {
    super({
      ...props,
    });

    this.add(
      <>
        <Rect ref={this.connectionsContainer} layout={false}></Rect>
        <Rect ref={this.container} layout={false}></Rect>
      </>
    );
  }
}
