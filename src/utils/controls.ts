import { html } from "lit";
import { FormControl } from "../interfaces";
import EditorForm from "../index";
import { getEntitiesByDomain } from "./entities";

export const renderFiller = () => {
    return html`<div class="form-control"></div>`;
}

export const renderEntityDropdown = (card: EditorForm, control: FormControl) => {
    return html`
    <div class="form-control">
        <ha-entity-picker
            label="${control.label}"
            .value="${card._config[control.configValue] ?? ''}"
            .configValue="${control.configValue}"
            .hass="${card._hass}"
            domain-filter="${control.domain}"
            @change="${card._valueChanged}">
        </ha-entity-picker>
    </div>
    `;
}

export const renderTextbox = (card: EditorForm, control: FormControl) => {
    return html`
    <div class="form-control">
        <ha-textfield
            label="${control.label}"
            .value="${card._config[control.configValue] ?? ''}"
            .configValue="${control.configValue}"
            @input="${card._valueChanged}"
            @change="${card._valueChanged}">
        </ha-textfield>
    </div>
    `;
}

export const renderSwitch = (card: EditorForm, control: FormControl) => {
    return html`
    <div class="form-control">
        <ha-switch
            id="${control.configValue}"
            name="${control.configValue}"
            .checked="${card._config[control.configValue]}"
            .configValue="${control.configValue}"
            @change="${card._valueChanged}"
        >
        </ha-switch>
        <label for="${control.configValue}">${control.label}</label>
    </div>
    `;
}

export const renderDropdown = (card: EditorForm, control: FormControl) => {
    const items = control.items ?? getEntitiesByDomain(card._hass, control.domain)
    return html`  
    <div class="form-control">
        <ha-combo-box
            label="${control.label}"
            .value="${card._config[control.configValue]}"
            .configValue="${control.configValue}"
            .items="${items}"
            @value-changed="${card._valueChanged}"
            @change=${card._valueChanged}
        ></ha-combo-box>
    </div>
      `;
}

export const renderRadio = (card: EditorForm, control: FormControl) => {
    return html`
        <div class="form-control">
            <label>${control.label}</label>
            ${control.items.map(item => {
                return html`
                    <ha-radio
                        id="${control.configValue}_${item.value}"
                        name="${control.configValue}"
                        .checked="${card._config[control.configValue] === item.value}"
                        .configValue="${control.configValue}"
                        .value="${item.value}"
                        @change="${card._valueChanged}"
                    >
                    </ha-radio>
                    <label for="${control.configValue}_${item.value}">${item.label}</label>
                `;
            })}
        </div>
      `;
}

export const renderCheckboxes = (card: EditorForm, control: FormControl) => {
    return html`
        <label>${control.label}</label>
        ${control.items.map(item => {
            return html`                
            <div class="form-control">
                <ha-checkbox
                    id="${control.configValue}_${item.value}"
                    name="${control.configValue}[]"
                    .checked="${card._config[control.configValue]?.indexOf(item.value) > -1}"
                    .configValue="${control.configValue}"
                    .value="${item.value}"
                    @change="${card._valueChanged}"
                >
                </ha-checkbox>
                <label for="${control.configValue}_${item.value}">${item.label}</label>
            </div>
            `;
        })}
      `;
}