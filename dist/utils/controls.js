"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCheckboxes = exports.renderRadio = exports.renderDropdown = exports.renderSwitch = exports.renderTextbox = exports.renderEntityDropdown = exports.renderFiller = exports.renderIconPicker = void 0;
const lit_element_1 = require("lit-element");
const entities_1 = require("./entities");
const renderIconPicker = (card, control) => {
    var _a, _b;
    return (0, lit_element_1.html) `
    <div class="form-control">
        <ha-icon-picker
            label="${control.label}"
            .value="${(_b = (_a = control.value) !== null && _a !== void 0 ? _a : card._config[control.configValue]) !== null && _b !== void 0 ? _b : ''}"
            .configValue="${control.configValue}"
            @value-changed="${card._valueChanged}">
        </ha-icon-picker>
    </div>
    `;
};
exports.renderIconPicker = renderIconPicker;
const renderFiller = () => {
    return (0, lit_element_1.html) `<div class="form-control"></div>`;
};
exports.renderFiller = renderFiller;
const renderEntityDropdown = (card, control) => {
    let entities = control.domain ? (0, entities_1.getEntitiesByDomain)(card._hass, control.domain) : (0, entities_1.getAllEntities)(card._hass);
    entities = entities.sort((a, b) => { var _a, _b, _c; return (_c = (_a = a.label) === null || _a === void 0 ? void 0 : _a.localeCompare((_b = b.label) !== null && _b !== void 0 ? _b : '')) !== null && _c !== void 0 ? _c : 0; });
    return (0, exports.renderDropdown)(card, { ...control, items: entities });
};
exports.renderEntityDropdown = renderEntityDropdown;
const renderTextbox = (card, control) => {
    var _a, _b;
    return (0, lit_element_1.html) `
    <div class="form-control">
        <ha-textfield
            label="${control.label}"
            .value="${(_b = (_a = control.value) !== null && _a !== void 0 ? _a : card._config[control.configValue]) !== null && _b !== void 0 ? _b : ''}"
            .configValue="${control.configValue}"
            @change="${card._valueChanged}">
        </ha-textfield>
    </div>
    `;
};
exports.renderTextbox = renderTextbox;
const renderSwitch = (card, control) => {
    var _a;
    return (0, lit_element_1.html) `
    <div class="form-control">
        <ha-switch
            id="${control.configValue}"
            name="${control.configValue}[]"
            .checked="${(_a = control.value) !== null && _a !== void 0 ? _a : card._config[control.configValue]}"
            .configValue="${control.configValue}"
            @change="${card._valueChanged}"
        >
        </ha-switch>
        <label for="${control.configValue}">${control.label}</label>
    </div>
    `;
};
exports.renderSwitch = renderSwitch;
const renderDropdown = (card, control) => {
    var _a, _b;
    const items = (_a = control.items) !== null && _a !== void 0 ? _a : (0, entities_1.getEntitiesByDomain)(card._hass, control.domain);
    return (0, lit_element_1.html) `  
    <div class="form-control">
        <ha-combo-box
            label="${control.label}"
            .value="${(_b = control.value) !== null && _b !== void 0 ? _b : card._config[control.configValue]}"
            .configValue="${control.configValue}"
            .items="${items}"
            @value-changed="${card._valueChanged}"
            @change=${card._valueChanged}
        ></ha-combo-box>
    </div>
      `;
};
exports.renderDropdown = renderDropdown;
const renderRadio = (card, control) => {
    return (0, lit_element_1.html) `
        <div class="form-control">
            <label>${control.label}</label>
            ${control.items.map(item => {
        return (0, lit_element_1.html) `
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
};
exports.renderRadio = renderRadio;
const renderCheckboxes = (card, control) => {
    return (0, lit_element_1.html) `
        <label>${control.label}</label>
        ${control.items.map(item => {
        var _a;
        return (0, lit_element_1.html) `                
            <div class="form-control">
                <ha-checkbox
                    id="${control.configValue}_${item.value}"
                    name="${control.configValue}[]"
                    .checked="${((_a = card._config[control.configValue]) === null || _a === void 0 ? void 0 : _a.indexOf(item.value)) > -1}"
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
exports.renderCheckboxes = renderCheckboxes;
