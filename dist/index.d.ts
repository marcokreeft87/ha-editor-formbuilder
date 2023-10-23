import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";
import { LitElement, TemplateResult } from "lit-element";
import { FormControl, FormControlRow, ValueChangedEvent } from "./interfaces";
export default class EditorForm extends LitElement {
    _hass: HomeAssistant;
    _config: LovelaceCardConfig;
    protected selectedTabIndex: number;
    setConfig(config: LovelaceCardConfig): void;
    set hass(hass: HomeAssistant);
    renderForm(formRows: FormControlRow[]): TemplateResult<1>;
    controlRenderers: {
        dropdown: (card: EditorForm, control: FormControl) => TemplateResult<1>;
        radio: (card: EditorForm, control: FormControl) => TemplateResult<1>;
        checkboxes: (card: EditorForm, control: FormControl) => TemplateResult<1>;
        "entity-dropdown": (card: EditorForm, control: FormControl) => TemplateResult<1>;
        switch: (card: EditorForm, control: FormControl) => TemplateResult<1>;
        textbox: (card: EditorForm, control: FormControl) => TemplateResult<1>;
        filler: () => TemplateResult<1>;
        icon: (card: EditorForm, control: FormControl) => TemplateResult<1>;
    };
    renderRow(row: FormControlRow): any;
    renderControl(control: FormControl): TemplateResult;
    _valueChanged(ev: ValueChangedEvent): void;
    static get styles(): import("lit-element").CSSResult;
}
