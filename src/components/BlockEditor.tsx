import {
  Node,
  Img,
  Layout,
  Rect,
  RectProps,
  Txt,
  signal,
} from "@motion-canvas/2d";
import { EMPTY_TRIGGER, __BLOCK_BORDER } from "../constants";
import { InputField } from "./fields/InputField";
import { all, createRef, createSignal } from "@motion-canvas/core";
import { DropdownInput } from "./DropdownInput";
import { CheckboxField } from "./fields/CheckboxField";

export interface BlockEditorProps extends RectProps {}

type FieldDef = {
  displayName: string;
  type:
    | "CHECKBOX"
    | "DROPDOWN"
    | "NUMBER"
    | "SHORT_TEXT"
    | "ARRAY"
    | "DYNAMIC"
    | "OBJECT"
    | "STATIC_DROPDOWN"
    | "FILE"
    | "LONG_TEXT"
    | "MULTI_SELECT_DROPDOWN"
    | "JSON";
  name: string;
  required: boolean;
  description: string;
};

export class BlockEditor extends Rect {
  public readonly logoUrl = createSignal(EMPTY_TRIGGER.logoUrl);
  public readonly packageName = createSignal("Empty");
  public readonly isTrigger = createSignal(false);
  public readonly name = createSignal("");
  public readonly fieldsGroup = createRef<Node>();
  public readonly actionGroup = createRef<Node>();

  public currentFields: Array<FieldDef> = [];

  setup({
    packageName,
    logoUrl,
    options,
    isTrigger,
  }: {
    packageName: string;
    logoUrl: string;
    options: string[];
    isTrigger: boolean;
  }) {
    this.packageName(packageName);
    this.logoUrl(logoUrl);
    this.isTrigger(isTrigger);

    this.actionGroup().removeChildren();
    this.actionGroup().add(
      <DropdownInput
        options={options}
        placeholder={isTrigger ? `Select a trigger` : `Select an action`}
      />
    );
  }

  *setupInteraction({
    name,
    fields,
  }: {
    name: string;
    fields: Array<FieldDef>;
  }) {
    const dropdown = this.actionGroup().children()[0] as DropdownInput;
    dropdown.selected(name);

    this.fieldsGroup().removeChildren();
    this.fieldsGroup().add(
      fields.map((field: any) => {
        switch (field.type) {
          case "CHECKBOX":
            return <CheckboxField label={field.displayName} isOn={false} />;
          default:
            return <InputField label={field.displayName} />;
        }
      })
    );

    this.currentFields = fields;
  }

  *setupFields(values: Record<string, string>, immediate: boolean = false) {
    yield* all(
      ...Object.entries(values).map(([name, value]) => {
        const index = this.currentFields.findIndex(
          (field) => field.name === name
        );
        if (index === -1) {
          return null;
        } else {
          const field = this.fieldsGroup().children()[index] as InputField;
          return field.value(value, immediate ? 0 : 0.2);
        }
      })
    );
  }

  constructor(props?: BlockEditorProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        layout
        direction="column"
        grow={1}
        padding={[20, 30, 20, 20]}
        gap={20}
        width={390}
        minWidth={390}
      >
        <Rect layout direction="row" gap={5} alignItems="center">
          <Txt
            text={() =>
              this.name() || (this.isTrigger() ? "Trigger" : "Action")
            }
          >
            Test action
          </Txt>
          <Img src="/icons/edit.svg" width={12} height={12} />
          <Layout grow={1} />
          <Img src="/icons/cross.svg" width={12} height={12} />
        </Rect>

        <Rect
          layout
          direction="row"
          gap={15}
          alignItems="center"
          padding={15}
          stroke={__BLOCK_BORDER}
          lineWidth={1}
          radius={5}
        >
          <Img src={() => this.logoUrl()} width={48} height={48} />
          <Txt fontWeight={400} text={() => this.packageName()} />
          <Layout grow={1} />
          <Rect padding={15}>
            <Img src="/icons/docs.svg" height={24} />
          </Rect>
        </Rect>

        <Node ref={this.actionGroup}></Node>
        <Node ref={this.fieldsGroup}></Node>
      </Rect>
    );
  }
}
