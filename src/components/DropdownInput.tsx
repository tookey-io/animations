import {
  Img,
  Layout, Rect,
  RectProps,
  Txt,
  initial,
  signal
} from "@motion-canvas/2d";
import { SimpleSignal, createRef, createSignal } from "@motion-canvas/core";


export interface DropdownInputProps extends RectProps {
  options: string[];
  placeholder: string;
  selected?: string;
}

export class DropdownInput extends Rect {
  @signal()
  @initial("")
  readonly selected: SimpleSignal<string, this>

  @signal()
  @initial("")
  readonly placeholder: SimpleSignal<string, this>

  private readonly options: string[];

  constructor(props?: DropdownInputProps) {
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
        <Txt ref={content} padding={5} text={() => this.selected() || this.placeholder()} />
        <Layout grow={1} />
        <Img src="/icons/carret-down.svg" height={6} />
      </Rect>
    );
  }
}
