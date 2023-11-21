import { Img, Node, NodeProps, Path, Rect } from "@motion-canvas/2d";
import {
  PossibleVector2,
  Reference,
  Vector2,
  all,
  createRef,
  easeInCubic,
  easeInOutBounce,
  easeInOutCirc,
  easeInOutElastic,
  easeOutCubic,
  waitFor,
} from "@motion-canvas/core";

export interface CursorProps extends NodeProps {}

export class Cursor extends Node {
  private readonly sprite = createRef<Node>();
  private readonly rect = createRef<Rect>();

  constructor(props: CursorProps) {
    super({
      ...props,
    });

    this.add(
      <Rect width="100%" height="100%" ref={this.rect}>
        <Path
          data="M0,0l4.6,19.4l3.6-6.9L16,12L0,0z"
          fill="black"
          x={512}
          y={355}
          ref={this.sprite}
          offset={[-1, 0]}
        />
      </Rect>
    );
  }

  *cursorMovePosition(position: PossibleVector2) {
    yield* all(
      this.sprite().scale(1.5, 0.15, easeInCubic).to(1, 0.15, easeOutCubic),
      this.sprite().position(
        position,
        0.3,
        easeInOutCirc,
        Vector2.arcLerp
      )
    );
  }

  *cursorMove(ref: Node) {
    const refPosition = ref.absolutePosition();
    const localPosition = refPosition.transformAsPoint(
      this.rect().worldToLocal()
    );
    console.log({
      refPosition,
      localPosition,
    });

    yield* all(
      this.sprite().scale(1.5, 0.15, easeInCubic).to(1, 0.15, easeOutCubic),
      this.sprite().position(
        localPosition,
        0.3,
        easeInOutCirc,
        Vector2.arcLerp
      )
    );
  }

  *cursorClick() {
    yield* this.sprite().scale(0.8, 0.05, easeInOutCirc);
    // TODO sparkle
    yield* this.sprite().scale(1, 0.15, easeInOutCirc);
  }
}
