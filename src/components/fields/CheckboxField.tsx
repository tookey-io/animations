import {
  Img,
  Layout, Rect,
  RectProps,
  Txt,
  initial,
  signal
} from "@motion-canvas/2d";
import { SimpleSignal, createRef } from "@motion-canvas/core";
import { __BODY_COLOR } from "../../constants";


export interface CheckboxProps extends RectProps { 
  label: string,
}

export class CheckboxField extends Rect {
  @initial("")
  @signal()
  public label: SimpleSignal<string, this>;

  public value = createRef<string>();

  constructor(props?: CheckboxProps) {
    super({
      ...props,
    });

    const content = createRef<Txt>();

    this.add(
      <Rect
        layout
        direction="row"
        alignItems="center"
        width='100%'
        gap={10}
      >
        <Rect radius={100} width={40} fill={__BODY_COLOR} height={20}>
          <Rect layout={false} width={16} height={16} radius={100} fill={"white"} x={() => Boolean(this.value()) ? 18 : -2} offset={[1, 0]}/>
        </Rect>
        <Txt ref={content} padding={5} text={this.label} />
      </Rect>
    );
  }
}
