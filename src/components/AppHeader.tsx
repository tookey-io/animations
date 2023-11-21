import { Img, Rect, RectProps, Txt } from "@motion-canvas/2d";
import { all, createRef } from "@motion-canvas/core";
import {
  BASE_TEXT_COLOR,
  __APP_HEADER_COLOR,
  __BODY_COLOR,
} from "../constants";
import { Button } from "./Button";

export interface HeaderProps extends RectProps {}
export class AppHeader extends Rect {
  private logotypes = createRef<Img>();

  public *hide(immediate: boolean = false) {
    if (immediate) {
      this.logotypes().scale(1.2);
      this.logotypes().opacity(0);
      yield;
    } else {
      yield* all(
        this.logotypes().scale(1.2, 0.4),
        this.logotypes().opacity(0, 0.35)
      );
    }
  }

  public *show(immediate: boolean = false) {
    if (immediate) {
      this.logotypes().scale(1);
      this.logotypes().opacity(1);
    } else {
      yield* all(
        this.logotypes().scale(1, 0.4),
        this.logotypes().opacity(1, 0.35)
      );
    }
  }

  constructor(props?: HeaderProps) {
    super({
      ...props,
    });

    const rect = createRef<Rect>();

    this.add(
      <>
        <Rect
          layout
          ref={rect}
          direction="row"
          fill={__APP_HEADER_COLOR}
          padding={[12, 20, 12, 0]}
          width="100%"
          alignItems="center"
        >
          <Rect padding={[12, 20]}>
            <Img src="/icons/carret-left.svg" height={14} />
          </Rect>
          <Txt
            fontWeight={600}
            fill={BASE_TEXT_COLOR}
            textAlign="left"
            lineHeight={48}
          >
            Untitled
          </Txt>
          <Rect padding={12}>
            <Img src="/icons/carret-down.svg" width={9} />
          </Rect>
          <Rect grow={1} />
          <Button label="Publish" />
          <Rect
            width={36}
            height={36}
            radius={36}
            layout
            alignItems="center"
            justifyContent="center"
            fill={__BODY_COLOR}
            margin={[0, 0, 0, 16]}
          >
            <Txt fill="white">U</Txt>
          </Rect>
        </Rect>
        <Img
          ref={this.logotypes}
          src="/icons/logotypes.svg"
          height={42}
          layout={false}
        />
      </>
    );
  }
}
