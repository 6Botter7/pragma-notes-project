import Index from '../../src/index.js';
import Database from '../../src/database.js';

export default class NotesInput extends HTMLElement {
    get html() { return import.meta.url.replace('.js', '.html'); }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        console.log("Notes Component connected");
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();
    }

    async load() {
        requestAnimationFrame(async () => {
            // this.openDatabase();
            const index = new Index();
            // await index.openDatabase();
            this.shadowRoot.getElementById('add-button').addEventListener('click', (event) => {
                event.preventDefault();
                const form = this.shadowRoot.getElementById('add-form');
                index.addData('name', {name: form.elements.name.value});
            });

            this.shadowRoot.getElementById('update-button').addEventListener('click', (event) => {
                const form = this.shadowRoot.getElementById('update-form');
                index.updateData('name', {name: form.elements.name.value});
            });

            this.shadowRoot.getElementById('delete-button').addEventListener('click', (event) => {
                const form = this.shadowRoot.getElementById('delete-form');
                index.deleteData('name', form.elements.id.value);
            });

            await index.displayData('name');
        });
    }
}

customElements.define('notes-input', NotesInput);