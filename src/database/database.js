const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Local do banco
const dbPath = path.join(
    __dirname,
    "bot.sqlite"
);

// Criar conexão
const db = new sqlite3.Database(
    dbPath,
    (err) => {

        if (err) {

            console.error(
                "❌ Erro ao conectar SQLite:",
                err
            );

        } else {

            console.log(
                "🗄️ SQLite conectado"
            );

        }

    }
);

// Ativar foreign keys
db.run(`
    PRAGMA foreign_keys = ON;
`);

// Criar tabelas
db.serialize(() => {

    /*
    =========================
        ECONOMY USERS
    =========================
    */

    db.run(`

        CREATE TABLE IF NOT EXISTS economy_users (

            guild_id TEXT NOT NULL,

            user_id TEXT NOT NULL,

            wallet INTEGER DEFAULT 0,

            bank INTEGER DEFAULT 0,

            xp INTEGER DEFAULT 0,

            level INTEGER DEFAULT 1,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY (
                guild_id,
                user_id
            )

        );

    `);

    /*
    =========================
        ECONOMY TRANSACTIONS
    =========================
    */

    db.run(`

        CREATE TABLE IF NOT EXISTS economy_transactions (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            guild_id TEXT NOT NULL,

            user_id TEXT NOT NULL,

            amount INTEGER NOT NULL,

            type TEXT NOT NULL,

            description TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        );

    `);

    /*
    =========================
        WARNINGS
    =========================
    */

    db.run(`

        CREATE TABLE IF NOT EXISTS warnings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            guild_id TEXT NOT NULL,

            user_id TEXT NOT NULL,

            moderator_id TEXT NOT NULL,

            reason TEXT NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        );

    `);

    /*
    =========================
        INVENTÁRIO
    =========================
    */

    db.run(`

        CREATE TABLE IF NOT EXISTS inventories (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id TEXT NOT NULL,

            guild_id TEXT NOT NULL,

            item_id TEXT NOT NULL,

            quantity INTEGER DEFAULT 1,

            UNIQUE(
                user_id,
                guild_id,
                item_id
            )

        );

    `);

    /*
    =========================
        COOLDOWNS
    =========================
    */

    db.run(`

        CREATE TABLE IF NOT EXISTS cooldowns (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id TEXT NOT NULL,

            guild_id TEXT NOT NULL,

            command TEXT NOT NULL,

            expires_at INTEGER NOT NULL,

            UNIQUE(
                user_id,
                guild_id,
                command
            )

        );

    `);

    /*
    =========================
        CONFIGURAÇÕES
    =========================
    */

    db.run(`

        CREATE TABLE IF NOT EXISTS guild_settings (

            guild_id TEXT PRIMARY KEY,

            log_channel TEXT,

            economy_enabled INTEGER DEFAULT 1,

            moderation_enabled INTEGER DEFAULT 1,

            prefix TEXT DEFAULT "!"

        );

    `);

});

// Helpers

function run(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.run(
            sql,
            params,
            function(err) {

                if (err)
                    reject(err);
                else
                    resolve(this);

            }
        );

    });

}

function get(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.get(
            sql,
            params,
            (err, row) => {

                if (err)
                    reject(err);
                else
                    resolve(row);

            }
        );

    });

}

function all(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.all(
            sql,
            params,
            (err, rows) => {

                if (err)
                    reject(err);
                else
                    resolve(rows);

            }
        );

    });

}

module.exports = {

    db,

    run,

    get,

    all

};