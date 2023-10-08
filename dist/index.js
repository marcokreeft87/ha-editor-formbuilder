"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_card_helpers_1 = require("custom-card-helpers");
const lit_element_1 = require("lit-element");
const interfaces_1 = require("./interfaces");
class EditorForm extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.formatList = (entity, hass) => ({
            label: hass.states[entity].attributes.friendly_name,
            value: entity
        });
        this.renderTextbox = (label, configValue) => {
            var _a;
            return (0, lit_element_1.html) `
        <div class="form-control">
            <ha-textfield
                label="${label}"
                .value="${(_a = this._config[configValue]) !== null && _a !== void 0 ? _a : ''}"
                .configValue="${configValue}"
                @change="${this._valueChanged}">
            </ha-textfield>
        </div>
        `;
        };
        this.renderSwitch = (label, configValue) => {
            return (0, lit_element_1.html) `
        <div class="form-control">
            <ha-switch
                id="${configValue}"
                name="${configValue}"
                .checked="${this._config[configValue]}"
                .configValue="${configValue}"
                @change="${this._valueChanged}"
            >
            </ha-switch>
            <label for="${configValue}">${label}</label>
        </div>
        `;
        };
        this.renderDropdown = (label, configValue, items) => {
            return (0, lit_element_1.html) `  
        <div class="form-control">
            <ha-combo-box
                label="${label}"
                .value="${this._config[configValue]}"
                .configValue="${configValue}"
                .items="${items}"
                @value-changed="${this._valueChanged}"
                @change=${this._valueChanged}
            ></ha-combo-box>
        </div>
          `;
        };
        this.renderRadio = (label, configValue, items) => {
            return (0, lit_element_1.html) `
            <div class="form-control">
                <label>${label}</label>
                ${items.map(item => {
                return (0, lit_element_1.html) `
                        <ha-radio
                            id="${configValue}_${item.value}"
                            name="${configValue}"
                            .checked="${this._config[configValue] === item.value}"
                            .configValue="${configValue}"
                            .value="${item.value}"
                            @change="${this._valueChanged}"
                        >
                        </ha-radio>
                        <label for="${configValue}_${item.value}">${item.label}</label>
                    `;
            })}
            </div>
          `;
        };
        this.renderCheckboxes = (label, configValue, items) => {
            return (0, lit_element_1.html) `
            <label>${label}</label>
            ${items.map(item => {
                return (0, lit_element_1.html) `                
                <div class="form-control">
                    <ha-checkbox
                        id="${configValue}_${item.value}"
                        name="${configValue}[]"
                        .checked="${this._config[configValue].indexOf(item.value) > -1}"
                        .configValue="${configValue}"
                        .value="${item.value}"
                        @change="${this._valueChanged}"
                    >
                    </ha-checkbox>
                    <label for="${configValue}_${item.value}">${item.label}</label>
                </div>
                `;
            })}
          `;
        };
    }
    setConfig(config) {
        this._config = config;
    }
    set hass(hass) {
        this._hass = hass;
    }
    renderForm(formRows) {
        return (0, lit_element_1.html) `
        <div class="card-config">
            ${formRows.map(row => {
            const cssClass = row.cssClass ? `form-row ${row.cssClass}` : "form-row";
            return (0, lit_element_1.html) `
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
        switch (control.type) {
            case interfaces_1.FormControlType.Dropdown:
                return this.renderDropdown(control.label, control.configValue, control.items);
            case interfaces_1.FormControlType.Radio:
                if (control.items === undefined) {
                    throw new Error("Radio control must have items defined");
                }
                return this.renderRadio(control.label, control.configValue, control.items);
            case interfaces_1.FormControlType.Checkboxes:
                if (control.items === undefined) {
                    throw new Error("Radio control must have items defined");
                }
                return this.renderCheckboxes(control.label, control.configValue, control.items);
            case interfaces_1.FormControlType.Switch:
                return this.renderSwitch(control.label, control.configValue);
            case interfaces_1.FormControlType.Textbox:
                return this.renderTextbox(control.label, control.configValue);
        }
        return (0, lit_element_1.html) ``;
    }
    _valueChanged(ev) {
        if (!this._config || !this._hass) {
            return;
        }
        const target = ev.target;
        const detail = ev.detail;
        if (target.tagName === "HA-CHECKBOX") {
            // Add or remove the value from the array
            const index = this._config[target.configValue].indexOf(target.value);
            if (target.checked && index < 0) {
                this._config[target.configValue] = [...this._config[target.configValue], target.value];
            }
            else if (!target.checked && index > -1) {
                this._config[target.configValue] = [...this._config[target.configValue].slice(0, index), ...this._config[target.configValue].slice(index + 1)];
            }
        }
        else if (target.configValue) {
            this._config = {
                ...this._config,
                [target.configValue]: target.checked !== undefined || !(detail === null || detail === void 0 ? void 0 : detail.value) ? target.value || target.checked : target.checked || detail.value,
            };
        }
        (0, custom_card_helpers_1.fireEvent)(this, "config-changed", {
            config: this._config
        });
    }
    getEntitiesByDomain(domain) {
        return Object.keys(this._hass.states)
            .filter((eid) => eid.substr(0, eid.indexOf(".")) === domain)
            .map((item) => this.formatList(item, this._hass));
    }
    getEntitiesByDeviceClass(domain, device_class) {
        return Object.keys(this._hass.states)
            .filter((eid) => eid.substr(0, eid.indexOf(".")) === domain && this._hass.states[eid].attributes.device_class === device_class)
            .map((item) => this.formatList(item, this._hass));
    }
    getDropdownOptionsFromEnum(enumValues) {
        const options = [];
        for (const [key, value] of Object.entries(enumValues)) {
            options.push({ value: value, label: key });
        }
        return options;
    }
    static get styles() {
        return (0, lit_element_1.css) `
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
