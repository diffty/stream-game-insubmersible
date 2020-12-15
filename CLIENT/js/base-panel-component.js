export class PanelBaseComponent extends HTMLElement {
    constructor() {
        super();

        var htmlTemplate = this.getTemplate();
        this.template = htmlTemplate.content.cloneNode(true);
    }

    connectedCallback() {
        this.appendChild(this.template);

        Object.defineProperty(this, "value", {
            get: () => {
                return this.getValue();
            }
        });

        this.setDefault();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName == "name") {

        }
        else if (attrName == "value") {

        }
    }

    getTemplate() {
        throw "getTemplate method is undefined!";
    }

    static get observedAttributes() {
        return ['name', 'value'];
    }
}

// customElements.define('metadata-properties', MetadataControl);
