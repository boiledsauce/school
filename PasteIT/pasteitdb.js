class pasteitdb {
    foreignKeySupportOn = "PRAGMA foreign_keys=ON"
    db = null

    constructor(sqliteInstance) {

        this.db = sqliteInstance
        this.initUsers()
        this.initEmployees()
        this.initPaste()
        this.initGuestBook()
        this.initGuestBookComment()
        this.turnOnForeignKeySetting()
    }

    turnOnForeignKeySetting() {
        this.db.get(this.foreignKeySupportOn);
    }

    initGuestBook() {
        this.db.run
            (
                `CREATE TABLE IF NOT EXISTS guestbook_entry 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entry TEXT,
                name TEXT,
                email TEXT,
                age INTEGER
            );
            `
            )
    }

    initGuestBookComment() {
        this.db.run
            (
                `CREATE TABLE IF NOT EXISTS guestbook_comment 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guestbook_entry_id INTEGER,
                comment TEXT,
                name TEXT,
                age INTEGER,
                FOREIGN KEY(guestbook_entry_id) REFERENCES guestbook_entry(id) ON DELETE CASCADE
            );
            `
            )
    }

    initEmployees() {
        this.db.run
            (

                `CREATE TABLE IF NOT EXISTS guestbook 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entry TEXT
            );
            `
            )
    }


    initUsers() {
        this.db.run
            (
                `CREATE TABLE IF NOT EXISTS faq 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT,
                answer TEXT
            );
            `
            )
    }

    initPaste() {
        this.db.run
            (
                `CREATE TABLE IF NOT EXISTS paste (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                post TEXT,
                created_time INT
              );
            `
            )
    }
}

module.exports = pasteitdb