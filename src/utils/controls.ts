import { html } from "lit-element";
import { FormControl } from "../interfaces";
import EditorForm from "../index";
import { getAllEntities, getEntitiesByDomain } from "./entities";

export const renderIconPicker = (card: EditorForm, control: FormControl) => {
    return html`
    <div class="form-control">
        <ha-icon-picker
            label="${control.label}"
            .value="${control.value ?? card._config[control.configValue] ?? ''}"
            .configValue="${control.configValue}"
            @value-changed="${card._valueChanged}">
        </ha-icon-picker>
    </div>
    `;
}

export const renderFiller = () => {
    return html`<div class="form-control"></div>`;
}

export const renderEntityDropdown = (card: EditorForm, control: FormControl) => {
    let entities = control.domain ? getEntitiesByDomain(card._hass, control.domain) : getAllEntities(card._hass);
    entities = entities.sort((a, b) => a.label?.localeCompare(b.label ?? '') ?? 0);
    return renderDropdown(card, { ...control, items: entities });
}

export const renderTextbox = (card: EditorForm, control: FormControl) => {
    return html`
    <div class="form-control">
        <ha-textfield
            label="${control.label}"
            .value="${control.value ?? card._config[control.configValue] ?? ''}"
            .configValue="${control.configValue}"
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
            name="${control.configValue}[]"
            .checked="${control.value ?? card._config[control.configValue]}"
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
            .value="${control.value ?? card._config[control.configValue]}"
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