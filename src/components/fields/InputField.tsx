import {
  Img,
  Layout, Rect,
  RectProps,
  Txt,
  initial,
  signal
} from "@motion-canvas/2d";
import { SimpleSignal, createRef, createSignal } from "@motion-canvas/core";


export interface InputFieldProps extends RectProps { 
  label: string,
}

export class InputField extends Rect {
  @initial("")
  @signal()
  public label: SimpleSignal<string, this>;

  public value = createSignal("");

  constructor(props?: InputFieldProps) {
    super({
      ...props,
    });

    const content = createRef<Txt>();

    this.add(
      <Rect
        layout
        direction="row"
        stroke="#9e9e9e"
        lineWidth={1}
        padding={[10, 15, 10, 10]}
        alignItems="center"
        width='100%'
      >
        <Txt ref={content} padding={5} text={() => this.value() || this.label()} />
      </Rect>
    );
  }
}
