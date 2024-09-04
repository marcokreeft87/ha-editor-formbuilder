"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_card_helpers_1 = require("custom-card-helpers");
const lit_1 = require("lit");
const interfaces_1 = require("./interfaces");
const controls_1 = require("./utils/controls");
const controls_2 = require("./utils/controls");
class EditorForm extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this.controlRenderers = {
            [interfaces_1.FormControlType.Dropdown]: controls_1.renderDropdown,
            [interfaces_1.FormControlType.Radio]: controls_1.renderRadio,
            [interfaces_1.FormControlType.Checkboxes]: controls_1.renderCheckboxes,
            [interfaces_1.FormControlType.EntityDropdown]: controls_1.renderDropdown,
            [interfaces_1.FormControlType.Switch]: controls_1.renderSwitch,
            [interfaces_1.FormControlType.Textbox]: controls_1.renderTextbox,
            [interfaces_1.FormControlType.Filler]: controls_1.renderFiller,
        };
    }
    setConfig(config) {
        this._config = config;
        this.requestUpdate("_config");
    }
    set hass(hass) {
        this._hass = hass;
    }
    renderForm(formRows) {
        return (0, lit_1.html) `
            <div class="card-config">
                ${formRows.map(row => {
            const cssClass = row.cssClass ? `form-row ${row.cssClass}` : "form-row";
            return row.hidden ? '' : (0, lit_1.html) `
                        <div class="${cssClass}">
                            <label>${row.label}</label>
                            ${row.controls.map(control => this.renderControl(control))}
                        </div>
                        `;
        })}          	 
            </div>
            `;
    }
    renderControl(control) {
        const renderer = this.controlRenderers[control.type];
        if (!renderer) {
            throw new Error(`Unsupported control type: ${control.type}`);
        }
        return renderer(this, control);
    }
    _valueChanged(ev) {
        if (!this._config || !this._hass) {
            return;
        }
        const target = ev.target;
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
            }
            else if (!target.checked && index > -1) {
                nestedConfig[arrayKey].splice(index, 1);
            }
            // Remove the key if the array is empty
            if (nestedConfig[arrayKey].length === 0) {
                delete nestedConfig[arrayKey];
            }
            this._config = (0, controls_2.deepMerge)(this._config, config);
        }
        else if (target.configValue) {
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
            const newValue = target.checked !== undefined || !(detail === null || detail === void 0 ? void 0 : detail.value) ? target.value || target.checked : target.checked || detail.value;
            if (newValue === "" || newValue === null || newValue === undefined) {
                delete nestedConfig[lastKey];
            }
            else {
                nestedConfig[lastKey] = newValue;
            }
            this._config = (0, controls_2.deepMerge)(this._config, config);
        }
        (0, custom_card_helpers_1.fireEvent)(this, "config-changed", {
            config: this._config,
        }, {
            bubbles: true,
            composed: true,
        });
        this.requestUpdate("_config");
    }
    static get styles() {
        return (0, lit_1.css) `
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
exports.default = EditorForm;
