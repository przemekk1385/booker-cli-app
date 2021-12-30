let database = null; // TODO: move outside

export const getDatabase = () => {
  return new Promise((resolve, reject) => {
    if (database) {
      resolve(database);
    }

    const request = window.indexedDB.open("bookerClientDB");

    request.onerror = (event) => {
      console.log("ERROR: Unable to open database", event);
      reject("Error");
    };

    request.onsuccess = (event) => {
      database = event.target.result;
      resolve(database);
    };

    request.onupgradeneeded = (event) => {
      database = event.target.result;

      database.createObjectStore("slots", {
        keyPath: "value",
      });
      database.createObjectStore("bookings", {
        keyPath: "id",
      });
    };
  });
};

export const slotBatchCreate = async (slots) => {
  const database = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction("slots", "readwrite");
    const store = transaction.objectStore("slots");

    slots.forEach((item) => store.put(item));

    transaction.oncomplete = () => {
      resolve("Item successfully saved.");
    };

    transaction.onerror = (event) => {
      reject(event);
    };
  });
};

export const slotClear = async () => {
  const database = await getDatabase();

  const result = await new Promise((resolve, reject) => {
    const transaction = database.transaction(["slots"], "readonly");
    const store = transaction.objectStore("slots");

    store.clear();

    transaction.oncomplete = () => resolve("Ok");

    transaction.onerror = (event) => reject(event);
  });
  return result;
};

export const slotList = async () => {
  const database = await getDatabase();

  const slots = await new Promise((resolve, reject) => {
    const transaction = database.transaction(["slots"], "readonly");
    const store = transaction.objectStore("slots");
    let slots = [];

    store.openCursor().onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        slots.push(cursor.value);
        cursor.continue();
      }
    };

    transaction.oncomplete = () => {
      resolve(slots);
    };

    transaction.onerror = (event) => {
      reject(event);
    };
  });
  return slots;
};
