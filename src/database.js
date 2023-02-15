
/**
 * @class Database - this class is responsible for all database operations
 * 1. connect to database
 * 2. create data
 * 3. update data
 * 4. delete data
 *
 * // This class will make use of a web worker to perform database operations
 */


export default class Database {
    constructor(name, version, stores) {
        this.name = name;
        this.version = version;
        this.stores = stores;
    }

    async open() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.name, this.version);
            request.onerror = (event) => {
                console.error("An error occurred while opening the database", event.target.error);
                reject(event.target.error);
            };
            request.onupgradeneeded = (event) => {
                console.log("Upgrading database...");
                const db = event.target.result;
                for (const storeName in this.stores) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, this.stores[storeName]);
                    }
                }
            };
            request.onsuccess = (event) => {
                console.log("Database opened successfully");
                resolve(event.target.result);
            };
        });
    }
}





// export default class Database {
//     constructor(name, version, stores) {
//         this.name = name;
//         this.version = version;
//         this.stores = stores;
//         this.db = null;
//         this.open();
//     }
//
//
//     async open() {
//         return new Promise((resolve, reject) => {
//             const request = window.indexedDB.open(this.name, this.version);
//             request.onupgradeneeded = (event) => {
//                 const db = event.target.result;
//                 for (let storeName in this.stores) {
//                     if (!db.objectStoreNames.contains(storeName)) {
//                         db.createObjectStore(storeName, this.stores[storeName]);
//                     }
//                 }
//             };
//             request.onsuccess = (event) => {
//                 this.db = event.target.result;
//                 resolve();
//             };
//             request.onerror = (event) => {
//                 reject(event.target.errorCode);
//             };
//         });
//     }
//
//     async addData(storeName, data) {
//         const tx = this.db.transaction(storeName, 'readwrite');
//         const store = tx.objectStore(storeName);
//         await store.add(data);
//         console.log("Data added");
//     }
//
//     async readData(storeName) {
//         return new Promise((resolve, reject) => {
//             const tx = this.db.transaction(storeName, 'readonly');
//             const store = tx.objectStore(storeName);
//             const request = store.getAll();
//             request.onsuccess = (event) => {
//                 resolve(event.target.result);
//             };
//             request.onerror = (event) => {
//                 reject(event.target.errorCode);
//             };
//         });
//     }
//
//     async updateData(storeName, data) {
//         const db = await this.open();
//         const tx = db.transaction(storeName, 'readwrite');
//         const store = tx.objectStore(storeName);
//
//         const existingRecord = await store.get(data.name);
//         if (existingRecord) {
//             await store.delete(existingRecord.name);
//             const updatedRecord = {...existingRecord, ...data};
//             await store.add(updatedRecord);
//             console.log("Data updated");
//             await this.displayData(storeName);
//         } else {
//             console.log("Record not found.");
//         }
//         await this.displayData(storeName);
//     }
//
//     async deleteData(storeName, key) {
//         const db = await this.open();
//         const tx = db.transaction(storeName, 'readwrite');
//         const store = tx.objectStore(storeName);
//         await store.delete(key);
//         console.log("Data deleted");
//     }
//
//     async displayData(storeName) {
//         const db = await this.open();
//         const tx = db.transaction(storeName, 'readonly');
//         const store = tx.objectStore(storeName);
//         const data = await store.getAll();
//         console.log("Data retrieved:", data);
//         return data;
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