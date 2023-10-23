export interface DropdownOption {
    label: string | undefined;
    value: string;
}

export interface ValueChangedEvent {
    detail: {
        value: {
            itemValue: string;
            parentElement: {
                configValue: string;
            };
        }
    };
    target: {
        value: string;
        configValue: string;
        checked?: boolean;
        tagName?: string;
    };
    
}

export interface FormControlRow {
    label?: string;
    controls?: FormControl[];
    tabs?: FormControlTab[];
    cssClass?: string;
    hidden?: boolean;
    buttons?: FornButton[];
}

export interface FormControlTab {
    label: string;
    rows: FormControlRow[];
}

export interface FormControl {
    label?: string;
    configValue?: string;
    type: FormControlType;
    items?: DropdownOption[] | undefined;
    cssClass?: string;
    domain?: string;
    value?: string;
}

export interface FornButton {
    icon: string;
    label: string;
    action: Function;
}

export enum FormControlType {
    Dropdown = "dropdown",
    Checkbox = "checkbox",
    Checkboxes = "checkboxes",
    Radio = "radio",
    Switch = "switch",
    Textbox = "textbox",
    Filler = "filler",
    Icon = "icon",
    EntityDropdown = "entity-dropdown"
}

export interface mwcTabBarEvent extends Event {
    detail: {
        index: number;
    };
}