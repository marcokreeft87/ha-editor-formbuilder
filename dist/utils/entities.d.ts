import { HomeAssistant } from "custom-card-helpers";
import { DropdownOption } from "../interfaces";
export declare const getAllEntities: (hass: HomeAssistant) => DropdownOption[];
export declare const getEntitiesByDomain: (hass: HomeAssistant, domain: string) => DropdownOption[];
export declare const getEntitiesByDeviceClass: (hass: HomeAssistant, domain: string, device_class: string) => DropdownOption[];
export declare const formatList: (entity: string, hass: HomeAssistant) => DropdownOption;
export declare const getDropdownOptionsFromEnum: (enumValues: any) => DropdownOption[];
