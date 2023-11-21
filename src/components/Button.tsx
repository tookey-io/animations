import {
  LayoutProps, Rect, Txt,
  initial,
  signal
} from "@motion-canvas/2d";
import { SimpleSignal } from "@motion-canvas/core";
import {
  BUTTON_GRAY_COLOR,
  BUTTON_GRAY_TEXT_COLOR
} from "../constants";


export interface ButtonProps extends LayoutProps {
  label: string;
  disabled?: boolean;
  color?: "gray";
}

export class Button extends Rect {
  @initial("")
  @signal()
  public readonly label: SimpleSignal<string, this>;

  constructor(props?: ButtonProps) {
    super({
      ...props,
    });

    this.padding([7, 10]);
    this.fontSize(14);
    this.lineHeight(21);
    this.fill(BUTTON_GRAY_COLOR);

    this.add(
      <Txt fill={BUTTON_GRAY_TEXT_COLOR} fontSize={14}>
        {this.label()}
      </Txt>
    );
  }
}
