"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDropdownOptionsFromEnum = exports.formatList = exports.getEntitiesByDeviceClass = exports.getEntitiesByDomain = exports.getAllEntities = void 0;
const getAllEntities = (hass) => {
    return Object.keys(hass.states)
        .map((item) => (0, exports.formatList)(item, hass));
};
exports.getAllEntities = getAllEntities;
const getEntitiesByDomain = (hass, domain) => {
    return Object.keys(hass.states)
        .filter((eid) => eid.substr(0, eid.indexOf(".")) === domain)
        .map((item) => (0, exports.formatList)(item, hass));
};
exports.getEntitiesByDomain = getEntitiesByDomain;
const getEntitiesByDeviceClass = (hass, domain, device_class) => {
    return Object.keys(hass.states)
        .filter((eid) => eid.substr(0, eid.indexOf(".")) === domain && hass.states[eid].attributes.device_class === device_class)
        .map((item) => (0, exports.formatList)(item, hass));
};
exports.getEntitiesByDeviceClass = getEntitiesByDeviceClass;
const formatList = (entity, hass) => ({
    label: hass.states[entity].attributes.friendly_name,
    value: entity
});
exports.formatList = formatList;
const getDropdownOptionsFromEnum = (enumValues) => {
    const options = [];
    for (const [key, value] of Object.entries(enumValues)) {
        options.push({ value: value, label: key });
    }
    return options;
};
exports.getDropdownOptionsFromEnum = getDropdownOptionsFromEnum;
