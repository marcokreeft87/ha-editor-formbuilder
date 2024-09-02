import { html } from "lit";
import { FormControl, ValueChangedEvent } from "../interfaces";
import EditorForm from "../index";
import { getEntitiesByDomain } from "./entities";

const getNestedProperty = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function deepMerge<T>(target: T, source: T): T {
    for (const key of Object.keys(source)) {
      const targetValue = (target as any)[key];
      const sourceValue = (source as any)[key];
  
      if (key === 'type') {
        // Preserve the type property
        (target as any)[key] = sourceValue;
      } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        (target as any)[key] = [...new Set([...targetValue, ...sourceValue])]; // Merge arrays while removing duplicates
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        (target as any)[key] = deepMerge(targetValue, sourceValue);
      } else {
        (target as any)[key] = sourceValue;
      }
    }
    return target;
  }
  
  function isObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object';
  }

export const renderFiller = () => {
  return html`<div class="form-control"></div>`;
};

export const renderEntityDropdown = (card: EditorForm, control: FormControl) => {
  return html`
  <div class="form-control">
    <ha-entity-picker
      label="${control.label}"
      .value="${getNestedProperty(card._config, control.configValue) ?? ''}"
      .configValue="${control.configValue}"
      .hass="${card._hass}"
      domain-filter="${control.domain}"
      @change="${card._valueChanged}">
    </ha-entity-picker>
  </div>
  `;
};

export const renderTextbox = (card: EditorForm, control: FormControl) => {
  return html`
  <div class="form-control">
    <ha-textfield
      label="${control.label}"
      .value="${getNestedProperty(card._config, control.configValue) ?? ''}"
      .configValue="${control.configValue}"
      @input="${card._valueChanged}"
      @change="${card._valueChanged}">
    </ha-textfield>
  </div>
  `;
};

export const renderSwitch = (card: EditorForm, control: FormControl) => {
  return html`
  <div class="form-control">
    <ha-switch
      id="${control.configValue}"
      name="${control.configValue}"
      .checked="${getNestedProperty(card._config, control.configValue)}"
      .configValue="${control.configValue}"
      @change="${card._valueChanged}"
    >
    </ha-switch>
    <label for="${control.configValue}">${control.label}</label>
  </div>
  `;
};

export const renderDropdown = (card: EditorForm, control: FormControl) => {
  const items = control.items ?? getEntitiesByDomain(card._hass, control.domain);
  return html`
  <div class="form-control">
    <ha-combo-box
      label="${control.label}"
      .value="${getNestedProperty(card._config, control.configValue)}"
      .configValue="${control.configValue}"
      .items="${items}"
      @value-changed="${card._valueChanged}"
      @change="${card._valueChanged}"
    ></ha-combo-box>
  </div>
  `;
};

export const renderRadio = (card: EditorForm, control: FormControl) => {
  return html`
    <div class="form-control">
      <label>${control.label}</label>
      ${control.items.map(item => {
        return html`
          <ha-radio
            id="${control.configValue}_${item.value}"
            name="${control.configValue}"
            .checked="${getNestedProperty(card._config, control.configValue) === item.value}"
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
};

export const renderCheckboxes = (card: EditorForm, control: FormControl) => {
  return html`
    <label>${control.label}</label>
    ${control.items.map(item => {
      return html`
        <div class="form-control">
          <ha-checkbox
            id="${control.configValue}_${item.value}"
            name="${control.configValue}[]"
            .checked="${(getNestedProperty(card._config, control.configValue) || []).includes(item.value) ?? false}"
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
};
