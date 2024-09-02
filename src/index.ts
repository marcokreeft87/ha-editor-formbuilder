import { HomeAssistant, LovelaceCardConfig, fireEvent } from "custom-card-helpers";
import { LitElement, TemplateResult, css, html } from "lit";
import { FormControl, FormControlRow, FormControlType, ValueChangedEvent } from "./interfaces";
import { renderCheckboxes, renderDropdown, renderFiller, renderRadio, renderSwitch, renderTextbox } from "./utils/controls";
import { deepMerge } from './utils/controls'; // Import deepMerge

export default class EditorForm extends LitElement {
    _hass: HomeAssistant;
    _config: LovelaceCardConfig;

    setConfig(config: LovelaceCardConfig) {
        this._config = config;
        this.requestUpdate("_config");
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
    }

    renderForm(formRows: FormControlRow[]) {
        return html`
            <div class="card-config">
                ${formRows.map(row => {
            const cssClass = row.cssClass ? `form-row ${row.cssClass}` : "form-row";
            return row.hidden ? '' : html`
                        <div class="${cssClass}">
                            <label>${row.label}</label>
                            ${row.controls.map(control => this.renderControl(control))}
                        </div>
                        `;
        })}            
            </div>
            `;
    }

    controlRenderers = {
        [FormControlType.Dropdown]: renderDropdown,
        [FormControlType.Radio]: renderRadio,
        [FormControlType.Checkboxes]: renderCheckboxes,
        [FormControlType.EntityDropdown]: renderDropdown,
        [FormControlType.Switch]: renderSwitch,
        [FormControlType.Textbox]: renderTextbox,
        [FormControlType.Filler]: renderFiller,
    };

    renderControl(control: FormControl): TemplateResult {
        const renderer = this.controlRenderers[control.type];
        if (!renderer) {
            throw new Error(`Unsupported control type: ${control.type}`);
        }
        return renderer(this, control);
    }

    _valueChanged(ev: ValueChangedEvent): void {
      if (!this._config || !this._hass) {
        return;
      }

      const target = ev.target as any;
      const detail = ev.detail;

      if (target.tagName === "HA-CHECKBOX") {
        // Add or remove the value from the array
        const keys = target.configValue.split(".");
        let config = { ...this._config }; // Create a shallow copy of the config
        let nestedConfig = config;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!nestedConfig[keys[i]]) {
            nestedConfig[keys[i]] = {};
          }
          nestedConfig = nestedConfig[keys[i]];
        }

        const arrayKey = keys[keys.length - 1];
        if (!Array.isArray(nestedConfig[arrayKey])) {
          nestedConfig[arrayKey] = [];
        }

        const index = nestedConfig[arrayKey].indexOf(target.value);
        if (target.checked && index < 0) {
          nestedConfig[arrayKey].push(target.value);
        } else if (!target.checked && index > -1) {
          nestedConfig[arrayKey].splice(index, 1);
        }

        // Remove the key if the array is empty
        if (nestedConfig[arrayKey].length === 0) {
          delete nestedConfig[arrayKey];
        }

        this._config = deepMerge(this._config, config);
      } else if (target.configValue) {
        const keys = target.configValue.split(".");
        let config = { ...this._config }; // Create a shallow copy of the config
        let nestedConfig = config;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!nestedConfig[keys[i]]) {
            nestedConfig[keys[i]] = {};
          }
          nestedConfig = nestedConfig[keys[i]];
        }

        const lastKey = keys[keys.length - 1];
        const newValue = target.checked !== undefined || !(detail?.value) ? target.value || target.checked : target.checked || detail.value;

        if (newValue === "" || newValue === null || newValue === undefined) {
          delete nestedConfig[lastKey];
        } else {
          nestedConfig[lastKey] = newValue;
        }

        this._config = deepMerge(this._config, config);
      }

      // Fire the config-changed event
      fireEvent(this, "config-changed", {
        config: this._config,
      }, {
        bubbles: true,
        composed: true,
      });

      // Request an update to reflect the changes
      this.requestUpdate("_config");
    }
  
    static get styles() {
        return css`
            .form-row {
                margin-bottom: 10px;
            }
            .form-control {
                display: flex;
                align-items: center;
            }
            ha-switch {
                padding: 16px 6px;
            }
            .side-by-side {
                display: flex;
                flex-flow: row wrap;
            }            
            .side-by-side > label {
                width: 100%;
            }
            .side-by-side > .form-control {
                width: 49%;
                padding: 2px;
            }
            ha-textfield { 
                width: 100%;
            }
        `;
    }
}