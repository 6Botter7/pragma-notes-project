/**
 * This file is used to create a worker that can be used to perform the database operations.
 *
 */



import Database from './database.js';

self.onmessage = async (event) => {
    const { method, storeName, data } = event.data;
    const db = await new Database().open();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    switch (method) {
        case "add":
            store.add(data);
            break;
        case "read":
            store.getAll().onsuccess = (event) => {
                self.postMessage(event.target.result);
            };
            break;
        case "update":
            store.put(data);
            break;
        case "delete":
            store.delete(data.id);
            break;
    }
};


