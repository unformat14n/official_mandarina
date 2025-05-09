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
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        completionDate TEXT,
        user_id INTEGER NOT NULL,
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
    x;
};

// Create a new task
export const createTask = async (user_id, title, description, date, priority) => {
    console.log("Creating task:", user_id, title, description, date, priority);
    const db = await initializeDB();
    await db.runAsync(
        "INSERT INTO tasks (title, description, date, status, priority, completionDate, user_id) VALUES (?, ?, ?, 'PENDING', ?, NULL, ?)",
        [title, description, date, priority, user_id]
    );
};

// Get all tasks for a user
export const getTasks = async (user_id) => {
    const db = await initializeDB();
    const results = await db.getAllAsync(
        "SELECT * FROM tasks WHERE user_id = ?",
        [user_id]
    );
    return results;
};

export { initializeDB, db };
