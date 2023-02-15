import Database from './database.js';

export default class Index {

    constructor() {
        this.openDatabase();
    }

    async openDatabase() {
        this.db = await new Database('AndreDB', 1, {
            name: { keyPath: 'name', autoIncrement: false }
        }).open();
        console.log("AndreDB database opened");
    }


    async addData(storeName, data) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.add(data);
        console.log("Data added");
        await this.displayData(storeName);
    }

    // async readData(storeName) {
    //     const tx = this.db.transaction(storeName, 'readonly');
    //     const store = tx.objectStore(storeName);
    //     const data = await store.getAll();
    //     console.log("Data retrieved:", data);
    //     return data;
    // }
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



    async deleteData(storeName, key) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        console.log(store)
        await store.delete(key);
        console.log("Data deleted");
    }

    async displayData(storeName) {
        const data = await this.readData(storeName);
        await this.createTable(data);
    }


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

// const index = new Index();
// window.Index = Index;









// import Database from './database.js';
//
// export default class Index {
//     constructor() {
//         this.db = new Database('AndreDB', 1, {name: {keyPath: 'name', autoIncrement: false}});
//         this.displayData('name');
//     }
//
//
//     async addData(storeName, data) {
//         await this.db.addData(storeName, data);
//         await this.displayData(storeName);
//     }
//
//     async readData(storeName) {
//         const data = await this.db.readData(storeName);
//         return data;
//     }
//
//     async updateData(storeName, data) {
//         await this.db.updateData(storeName, data);
//         await this.displayData(storeName);
//     }
//
//     async deleteData(storeName, key) {
//         await this.db.deleteData(storeName, key);
//         await this.displayData(storeName);
//     }
//
//     async displayData(storeName) {
//         const data = await this.readData(storeName);
//         await this.createTable(data);
//     }
//
//     async createTable(data) {
//         const table = document.querySelector("notes-display").shadowRoot.querySelector("#notesTable");
//         table.innerHTML = "";
//         let count = 0;
//         data.forEach((d) => {
//             count++;
//             const tr = document.createElement('tr');
//             const tdName = document.createElement('td');
//             tdName.textContent = `${count.toString()} - ${d.name} `;
//             tr.appendChild(tdName);
//             table.appendChild(tr);
//         });
//     }
// }
