/**
 * @class NotesDisplay - `NotesDisplay` is a custom element that displays a list of notes
 *
 * */
export default class NotesDisplay extends HTMLElement {
    get html() { return import.meta.url.replace('.js', '.html'); }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    async connectedCallback() {
        // await super.connectedCallback();
        this.shadowRoot.innerHTML = await (await fetch(this.html)).text();
    }
    async disconnectedCallback() {
        await super.disconnectedCallback();
    }


}

customElements.define('notes-display', NotesDisplay);
//






