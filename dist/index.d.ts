import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";
import { LitElement, TemplateResult } from "lit-element";
import { DropdownOption, FormControl, FormControlRow } from "./interfaces";
export default class EditorForm extends LitElement {
    _hass: HomeAssistant;
    _config: LovelaceCardConfig;
    setConfig(config: LovelaceCardConfig): void;
    set hass(hass: HomeAssistant);
    renderForm(formRows: FormControlRow[]): TemplateResult<1>;
    renderControl(control: FormControl): TemplateResult;
    private _valueChanged;
    getEntitiesByDomain(domain: string): DropdownOption[];
    getEntitiesByDeviceClass(domain: string, device_class: string): DropdownOption[];
    formatList: (entity: string, hass: HomeAssistant) => DropdownOption;
    getDropdownOptionsFromEnum(enumValues: any): DropdownOption[];
    renderFiller: () => TemplateResult<1>;
    renderTextbox: (label: string | undefined, configValue: string) => TemplateResult<1>;
    renderSwitch: (label: string | undefined, configValue: string) => TemplateResult<1>;
    renderDropdown: (label: string | undefined, configValue: string, items?: DropdownOption[]) => TemplateResult<1>;
    renderRadio: (label: string | undefined, configValue: string, items: DropdownOption[]) => TemplateResult<1>;
    renderCheckboxes: (label: string | undefined, configValue: string, items: DropdownOption[]) => TemplateResult<1>;
    static get styles(): import("lit-element").CSSResult;
}
