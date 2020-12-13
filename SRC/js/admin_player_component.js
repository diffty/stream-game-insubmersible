import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

export class PlayerElement extends LitElement {
    constructor() {
        super()
        
    }

    static get properties() {
        return {
            playerNum: {type: Number},
            playerName: {type: String},
            role: {type: String},
            oxygen: {type: Number},
            isDead: {type: Boolean},
        }
    }
        
    static get styles() {
        return css`.mood { color: green; }`;
    }

    onPlayerNameChanged(e) {
        let propertyName = e.target.id;
        this.playerName = e.target.value;
        this.onPropertyChanged(propertyName, e.target.value);
    }
    
    onRoleChanged(e) {
        let propertyName = e.target.id;
        this.role = e.target.value;
        this.onPropertyChanged(propertyName, e.target.value);
    }
    
    onOxygenChanged(e) {
        let propertyName = e.target.id;
        this.oxygen = e.target.value;
        this.onPropertyChanged(propertyName, e.target.value);
    }
    
    onIsDeadChanged(e) {
        let propertyName = e.target.id;
        this.isDead = e.target.checked;
        this.onPropertyChanged(propertyName, e.target.checked);
    }

    onPropertyChanged(propertyName, newValue) {
        console.log(propertyName, newValue)

        let playerChangedEvent = new CustomEvent('changed', { 
            detail: { "propertyName": propertyName, "newValue": newValue },
            bubbles: true, 
            composed: true
        });

        this.dispatchEvent(playerChangedEvent);
    }

    render() {
        return html`
        <li>
            <h2>Player ${this.playerNum + 1}</h2>
            <ul>
                <li>Name : <input id="playerName" value=${this.playerName} @change="${this.onPlayerNameChanged}" /></li>
                <li>Role : <input id="role" value=${this.role} @change="${this.onRoleChanged}" /></li>
                <li>Oxygen : <input id="oxygen" value=${this.oxygen} @change="${this.onOxygenChanged}" /></li>
                <li>Dead ? <input id="isDead" ?checked=${this.isDead} type="checkbox" @change="${this.onIsDeadChanged}" /></li>
            </ul>
        </li>
        `;
    }
};

customElements.define('player-element', PlayerElement);
