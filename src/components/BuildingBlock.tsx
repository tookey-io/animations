import {
  Node,
  NodeProps,
  Rect,
  Img,
  initial,
  signal,
  Txt,
} from "@motion-canvas/2d";
import { SimpleSignal, createRef } from "@motion-canvas/core";

export interface BuildingBlockProps extends NodeProps {
  logoUrl: string;
  name: string;
  title: string;
  warning?: boolean;
}

export class BuildingBlock extends Node {
  @initial("")
  @signal()
  public declare readonly logoUrl: SimpleSignal<string, this>;

  @initial("")
  @signal()
  public declare readonly name: SimpleSignal<string, this>;

  @initial("")
  @signal()
  public declare readonly title: SimpleSignal<string, this>;
  
  @initial(false)
  @signal()
  public declare readonly warning: SimpleSignal<boolean, this>;

  public readonly contrainer = createRef<Rect>();

  constructor(props?: BuildingBlockProps) {
    super({
      ...props,
    });

    this.add(
      <>
        <Rect
          ref={this.contrainer}
          size={[300, 90]}
          fill="white"
          layout
          direction="row"
          gap={15}
          padding={[15, 15]}
        >
          <Img src={this.logoUrl} size={[60, 60]} />
          <Rect
            grow={1}
            layout
            direction="column"
            justifyContent="center"
            gap={8}
          >
            <Txt
              fontFamily="Mulish"
              fontSize={16}
              fill="rgba(72, 72, 72, 1)"
              textAlign="left"
              offset={[1, 0.5]}
              x={0}
              y={-10}
              text={this.name}
              />
            <Rect layout direction="row" justifyContent="space-between">
              <Txt
                fontFamily="Mulish"
                fontSize={12}
                fill="rgba(140, 140, 140, 1)"
                textAlign="left"
                offset={[1, 0.5]}
                x={0}
                y={10}
                text={this.title}
              />
              {/* <Rect fill="rgba(255, 192, 72, 0.3)" size={[16, 16]} radius={16} layout alignItems='center' justifyContent='center' opacity={this.warning ? 1 : 0}>
                <Txt fontFamily='Mulish' fontSize={12} fill="rgb(204, 136, 5)" fontStyle='bold'>!</Txt>
              </Rect> */}
            </Rect>
          </Rect>
        </Rect>
      </>
    );
  }
}
