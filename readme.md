# Description
@marcokreeft/ha-editor-formbuilder is a Node.js package that provides a convenient tool for creating easy Home Assistant editor forms for custom cards. It simplifies the process of designing and customizing forms for Home Assistant cards, making it accessible to both developers and non-developers.

## Installation

Run the following command to install the Custom Card Editor Form Builder using npm:

```
npm install -g ha-editor-formbuilder
```

Once the installation is complete, you can use the tool to create and customize card forms.

## Example usage

```
@customElement(CARD_EDITOR_NAME)
export class FormulaOneCardEditor extends EditorForm {

    protected render(): TemplateResult {
        if (!this._hass || !this._config) {
            return html``;
        }

        return this.renderForm([
            { controls: [{ label: "Card Type (Required)", configValue: "card_type", type: FormControlType.Dropdown, items: this.getDropdownOptionsFromEnum(FormulaOneCardType) }] },
            { controls: [{ label: "Title", configValue: "title", type: FormControlType.Textbox }] },
            {
                label: "Basic configuration",
                cssClass: 'side-by-side',
                controls: [
                    { label: "Use F1 font", configValue: "f1_font", type: FormControlType.Switch },
                    { label: "Image clickable", configValue: "image_clickable", type: FormControlType.Switch },
                    { label: "Show carnumber", configValue: "show_carnumber", type: FormControlType.Switch },
                    { label: "Location clickable", configValue: "location_clickable", type: FormControlType.Switch },
                    { label: "Show race information", configValue: "show_raceinfo", type: FormControlType.Switch },
                    { label: "Hide track layout", configValue: "hide_tracklayout", type: FormControlType.Switch },
                    { label: "Hide race dates and times", configValue: "hide_racedatetimes", type: FormControlType.Switch },
                    { label: "Show last years result", configValue: "show_lastyears_result", type: FormControlType.Switch },
                    { label: "Only show date", configValue: "only_show_date", type: FormControlType.Switch }
                ]
            },    
            {
                label: "Countdown Type",
                cssClass: 'side-by-side',
                controls: [{ configValue: "countdown_type", type: FormControlType.Checkboxes, items: this.getDropdownOptionsFromEnum(CountdownType) }]
            },
            {
                cssClass: 'side-by-side',
                controls: [
                    { label: "Next race delay", configValue: "next_race_delay", type: FormControlType.Textbox },
                    { label: "Row limit", configValue: "row_limit", type: FormControlType.Textbox },
                ]
            },
            { controls: [{ label: "Previous race", configValue: "previous_race", type: FormControlType.Dropdown, items: this.getDropdownOptionsFromEnum(PreviousRaceDisplay) }] },
            {
                label: "Standings",
                cssClass: 'side-by-side',
                controls: [
                    { label: "Show team", configValue: "standings.show_team", type: FormControlType.Switch },
                    { label: "Show flag", configValue: "standings.show_flag", type: FormControlType.Switch },
                    { label: "Show teamlogo", configValue: "standings.show_teamlogo", type: FormControlType.Switch }
                ]
            }, 
            {
                cssClass: 'side-by-side',
                controls: [
                    { label: "Next race delay", configValue: "next_race_delay", type: FormControlType.Textbox },
                    { label: "Row limit", configValue: "row_limit", type: FormControlType.Textbox },
                ]
            },
            {
                label: "Weather",
                cssClass: 'side-by-side',
                controls: [
                    { label: "Show weather", configValue: "show_weather", type: FormControlType.Switch },
                    { type: FormControlType.Filler },
                    { label: "API key", configValue: "weather_options.api_key", type: FormControlType.Textbox },
                    { label: "Unit", configValue: "weather_options.unit", type: FormControlType.Dropdown, items: this.getDropdownOptionsFromEnum(WeatherUnit) },
                    { label: "Show icon", configValue: "weather_options.show_icon", type: FormControlType.Switch },
                    { label: "Show precipitation", configValue: "weather_options.show_precipitation", type: FormControlType.Switch },
                    { label: "Show wind", configValue: "weather_options.show_wind", type: FormControlType.Switch },
                    { label: "Show temperature", configValue: "weather_options.show_temperature", type: FormControlType.Switch },
                    { label: "Show cloud coverage", configValue: "weather_options.show_cloud_cover", type: FormControlType.Switch },
                    { label: "Show visibility", configValue: "weather_options.show_visibility", type: FormControlType.Switch },
                    { label: "Show Icon", configValue: "weather_options.show_icon", type: FormControlType.Switch },
                    { label: "Show Icon", configValue: "weather_options.show_icon", type: FormControlType.Switch },
                ]
            }, 
        ]);
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
            .hidden {
                display: none;
            }
        `;
    }
}

```
