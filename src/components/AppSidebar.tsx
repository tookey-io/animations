import { Rect, RectProps } from "@motion-canvas/2d";
import { __APP_BORDER_COLOR } from "../constants";

export interface SidebarProps extends RectProps {}
export class AppSidebar extends Rect {
  constructor(props?: SidebarProps) {
    super({
      ...props,
    });

    this.clip(true)
    this.layout(true)
    this.direction("row")
    this.maxHeight(720 - 60)

    this.add(
      <Rect layout direction="row" fill={"white"} clip={true}>
        <Rect fill={__APP_BORDER_COLOR} width={10} />
        <Rect layout direction="row" grow={1} width={390} clip={true}>
          {props.children}
        </Rect>
      </Rect>
    );
  }

  public *show(immediate: boolean = false) {
  }

  public *hide(immediate: boolean = false) {
  }
}
