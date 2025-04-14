import * as SQLite from "expo-sqlite";

let db = null;

const initializeDB = async () => {
    if (db) return db; // Avoid re-opening

    db = await SQLite.openDatabaseAsync("taskManager.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    console.log("Database initialized");
    return db;
};

export const loginUser = async (username, password) => {
    const db = await initializeDB();
    const result = await db.getFirstAsync(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password]
    );
    return result;
};

export const registerUser = async (username, password) => {
    const db = await initializeDB();
    await db.runAsync("INSERT INTO users (username, password) VALUES (?, ?)", [
        username,
        password,
    ]);
};

export { initializeDB, db};
