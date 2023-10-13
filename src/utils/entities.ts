import { HomeAssistant } from "custom-card-helpers";
import { DropdownOption } from "../interfaces";

export const getEntitiesByDomain = (hass: HomeAssistant, domain: string): DropdownOption[] => {
    return Object.keys(hass.states)
        .filter((eid: string) => eid.substr(0, eid.indexOf(".")) === domain)
        .map((item) => formatList(item, hass));
}

export const getEntitiesByDeviceClass = (hass: HomeAssistant, domain: string, device_class: string): DropdownOption[] => {
    return Object.keys(hass.states)
        .filter((eid: string) => eid.substr(0, eid.indexOf(".")) === domain && hass.states[eid].attributes.device_class === device_class)
        .map((item) => formatList(item, hass));
}

export const formatList = (entity: string, hass: HomeAssistant): DropdownOption => ({
    label: hass.states[entity].attributes.friendly_name,
    value: entity
});

export const getDropdownOptionsFromEnum = (enumValues: any): DropdownOption[] => {
    const options: DropdownOption[] = [];
    for (const [key, value] of Object.entries(enumValues)) {
        options.push({ value: value, label: key } as DropdownOption);
    }
    return options;
}