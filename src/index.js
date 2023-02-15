import Database from './database.js';

/**
 * @class Index - It's a class that handles all the IndexedDB operations
 *
 * */
export default class Index {

    constructor() {
        this.openDatabase();
    }

    /**
     * @method openDatabase - The function opens a database called AndreDB, version 1, with a keyPath of name and autoIncrement set to false
     */
    async openDatabase() {
        this.db = await new Database('AndreDB', 1, {
            name: { keyPath: 'name', autoIncrement: false }
        }).open();
        console.log("AndreDB database opened");
    }


    /**
     * @method addData - The function takes two arguments, the name of the store and the data to be added. It then creates a transaction,
     * gets the store, and adds the data to the store
     * @param storeName - The name of the object store you want to add data to.
     * @param data - The data to be added to the database.
     */
    async addData(storeName, data) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.add(data);
        console.log("Data added");
        await this.displayData(storeName);
    }

    /**
     * @method readData - The function opens the database, creates a transaction, gets the object store, gets all the data from the object
     * store, and then creates a table with the data
     * @param storeName - The name of the store you want to read from.
     */
    async readData(storeName) {
        const request = window.indexedDB.open("AndreDB", 1);
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["name"], "readonly");
            const store = transaction.objectStore("name");
            const data = store.getAll();
            data.onsuccess = (event) => {
                const transactions = event.target.result;
                this.createTable(transactions);
            };
        }.bind(this);
    }


    /**
     * @method updateData - It opens a transaction, gets the object store, gets the record, updates the record, and puts the updated record back
     * into the object store
     * @param storeName - The name of the object store to update.
     * @param data - The data to be updated.
     */
    async updateData(storeName, data) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        const existingRecord = await store.get(data.name);
        if (existingRecord) {
            const updatedRecord = { ...existingRecord, ...data };
            await store.put(updatedRecord);
            console.log("Data updated");
            await this.displayData(storeName);
        } else {
            console.log("Record not found.");
        }
    }



    /**
     * @method deleteData - It deletes data from the database.
     * @param storeName - The name of the object store you want to delete data from.
     * @param key - The key of the record to be deleted.
     */
    async deleteData(storeName, key) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        console.log(store)
        await store.delete(key);
        console.log("Data deleted");
    }

    /**
     * @method displayData - It reads data from the database, then creates a table from the data
     * @param storeName - The name of the store you want to display.
     */
    async displayData(storeName) {
        const data = await this.readData(storeName);
        await this.createTable(data);
    }


    /**
     * @method createTable - It takes an array of objects, loops through the array, and creates a table row for each object in the array
     * @param data - The data that will be used to create the table.
     */
    async createTable(data) {
        const table = document.querySelector("notes-display").shadowRoot.querySelector("#notesTable");
        table.innerHTML = "";
        let count = 0;
        data.forEach((d) => {
            count ++;
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            tdName.textContent = `${count.toString()} - ${d.name} `;
            tr.appendChild(tdName);
            table.appendChild(tr);
        });
    }

}

