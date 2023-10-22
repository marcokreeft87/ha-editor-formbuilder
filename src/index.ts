import { HomeAssistant, LovelaceCardConfig, fireEvent } from "custom-card-helpers";
import { LitElement, TemplateResult, css, html } from "lit-element";
import { FormControl, FormControlRow, FormControlType, ValueChangedEvent, mwcTabBarEvent } from "./interfaces";
import { renderCheckboxes, renderDropdown, renderEntityDropdown, renderFiller, renderRadio, renderSwitch, renderTextbox } from "./utils/controls";

export default class EditorForm extends LitElement {
    _hass: HomeAssistant;
    _config: LovelaceCardConfig;
    protected selectedTabIndex = 0;

    setConfig(config: LovelaceCardConfig) {
        this._config = config;
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
    }

    renderForm(formRows: FormControlRow[]) {
        return html`
            <div class="card-config">
                ${formRows.map(row => this.renderRow(row))}            
            </div>
            `;
    }

    controlRenderers = {
        [FormControlType.Dropdown]: renderDropdown,
        [FormControlType.Radio]: renderRadio,
        [FormControlType.Checkboxes]: renderCheckboxes,
        [FormControlType.EntityDropdown]: renderEntityDropdown,
        [FormControlType.Switch]: renderSwitch,
        [FormControlType.Textbox]: renderTextbox,
        [FormControlType.Filler]: renderFiller,
    };

    renderRow(row: FormControlRow) {
        const cssClass = row.cssClass ? `form-row ${row.cssClass}` : "form-row";
        return row.hidden ? '' : html`
            <div class="${cssClass}">                            
                <label>${row.label}</label>
                ${row.buttons?.map(button => html`<button @click="${button.action}">${button.label}</button>`)}
                ${row.controls?.map(control => this.renderControl(control))}
                ${row.tabs ? 
                    html`<mwc-tab-bar @MDCTabBar:activated=${(ev: mwcTabBarEvent) => {
                        this.selectedTabIndex = ev.detail.index;
                        console.log(this.selectedTabIndex);

                        this.requestUpdate();
                    }}>
                            ${row.tabs.map(tab => html`<mwc-tab label="${tab.label}"></mwc-tab>`)}
                        </mwc-tab-bar>
                        <section>
                        ${row.tabs.find((_, index) => index == this.selectedTabIndex)?.rows?.map(row => html`<article>${this.renderRow(row)}</article>`)}                        
                    </section>` : html``}    
            </div>
            `;
    }

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
        const target = ev.target;
        const detail = ev.detail;

        if (target.tagName === "HA-CHECKBOX") {
            // Add or remove the value from the array
            const index = this._config[target.configValue].indexOf(target.value);
            if (target.checked && index < 0) {
                this._config[target.configValue] = [...this._config[target.configValue], target.value];
            } else if (!target.checked && index > -1) {
                this._config[target.configValue] = [...this._config[target.configValue].slice(0, index), ...this._config[target.configValue].slice(index + 1)];
            }
        }
        else if (target.configValue) {

            const match = target.configValue.match(/\[(.*?)\]/);
            if (match) {
                const index = match[1];
                const configValue = target.configValue.replace(/\[(.*?)\]/, '');
                const [domain, entity] = configValue.split(".");
                const info_entities = this._config[domain];
                if (!info_entities) {
                    return;
                }
                
                if (info_entities[index]) {
                    info_entities[index][entity] = target.checked !== undefined || !(detail === null || detail === void 0 ? void 0 : detail.value) ? target.value || target.checked : target.checked || detail.value;
                }
                else {
                    info_entities.push({
                        [entity]: target.checked !== undefined || !(detail === null || detail === void 0 ? void 0 : detail.value) ? target.value || target.checked : target.checked || detail.value
                    });
                }
                
            }
            else if (target.configValue.indexOf(".") > -1) {
                const [domain, configValue] = target.configValue.split(".");
                this._config = {
                    ...this._config,
                    [domain]: {
                        ...this._config[domain],
                        [configValue]: target.checked
                    }
                }
            }
            else {
                this._config = {
                    ...this._config,
                    [target.configValue]: target.checked !== undefined || !detail?.value ? target.value || target.checked : target.checked || detail.value,
                }
            }
        }

        fireEvent(this, "config-changed", {
            config: this._config,
        }, {
            bubbles: true,
            composed: true,
        });

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