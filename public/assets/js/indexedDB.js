const dbName = "Budget_DB"
const storeName = "transactionData"
const request = window.indexedDB.open(dbName, 1)

if (!window.indexedDB) {
    console.log("Your browser doesn't support IndexedDB.");
};

request.onerror = function (e) {
    console.log("Unable to use IdexedDB, There was an error");
};

request.onupgradeneeded = function (e) {
    const db = e.target.result;
    const objectStore = db.createObjectStore(storeName, { autoIncrement: true });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("value", "value", { unique: false });
    console.log('upgradeneeded');

};

request.onsuccess = function (e) {
    console.log('workig');
    db = e.target.result;
    tx = db.transaction(storeName, "readwrite");
    store = tx.objectStore(storeName);
   
    const tx2 = db.transaction([storeName], 'readwrite');
    const objStore = tx2.objectStore(storeName);
    const all = objStore.getAll();
       all.onsuccess = function () {
            if (all.result.length > 0) {
                fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(all.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(() => {
                    const tx2 = db.transaction([storeName], 'readwrite');
                    const objectStore = tx2.objectStore(storeName);
                    objectStore.clear();
                });
            }
        };
    
}