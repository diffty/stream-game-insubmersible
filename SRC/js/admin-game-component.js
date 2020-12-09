import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

export class GameAdminElement extends LitElement {
    constructor() {
        super()
        
    }

    static get properties() {
        return {
            alarm: {type: Boolean},
            currTime: {type: String},
            maxTime: {type: Number},
        }
    }
        
    static get styles() {
        return css`.mood { color: green; }`;
    }

    onCurrTimeChanged(e) {
        let propertyName = e.target.id;
        this.currTime = e.target.value;
        this.onPropertyChanged(propertyName, e.target.value);
    }
    
    onMaxTimeChanged(e) {
        let propertyName = e.target.id;
        this.maxTime = e.target.value;
        this.onPropertyChanged(propertyName, e.target.value);
    }
    
    onAlarmChanged(e) {
        console.log(e);
        let propertyName = e.target.id;
        this.alarm = e.target.checked;
        console.log(e.target.checked)
        this.onPropertyChanged(propertyName, e.target.checked);
    }

    onPropertyChanged(propertyName, newValue) {
        let gameChangedEvent = new CustomEvent('changed', { 
            detail: { "propertyName": propertyName, "newValue": newValue },
            bubbles: true, 
            composed: true
        });

        this.dispatchEvent(gameChangedEvent);
    }

    render() {
        return html`
        <li>
            <h2>Game</h2>
            <ul>
                <li>Curr Time : <input id="currTime" value=${this.currTime} @change="${this.onCurrTimeChanged}" /></li>
                <li>Max Time : <input id="maxTime" value=${this.maxTime} @change="${this.onMaxTimeChanged}" /></li>
                <li>Alarm ? <input id="alarm" ?checked=${this.alarm} type="checkbox" @change="${this.onAlarmChanged}" /></li>
                <button>Start</button>
                <button>Pause</button>
                <button>Reset</button>
            </ul>
        </li>
        `;
    }
};

customElements.define('game-admin-element', GameAdminElement);
