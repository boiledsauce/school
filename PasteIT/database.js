const sqlite = require('sqlite3')
const db = new sqlite.Database('pasteit.db')
const pasteitdb = require('./pasteitdb')
const initDb = new pasteitdb(db)

/*  Paste queries  */
exports.getPastesFromIdRange = function (sliceFrom, sliceTo, callback) {
  const query = "SELECT id, name, post, strftime(\x22%Y-%m-%d %H:%M\x22, created_time, \x27unixepoch\x27, \x27localtime\x27) AS created_time FROM paste LIMIT ?,?"
  const values = [sliceFrom, sliceTo]

  db.all(query, values, function (error, pastes) {
    callback(error, pastes)
  })
}

exports.getPasteById = function (id, callback) {
  const query = "SELECT id, name, post, strftime(\x22%Y-%m-%d %H:%M\x22, created_time, \x27unixepoch\x27, \x27localtime\x27) AS created_time FROM paste WHERE id = ?"
  const values = [id]

  db.get(query, values, function (error, paste) {
    callback(error, paste)
  })
}

exports.createPaste = function (name, post, timeCreated, callback) {
  const query = "INSERT INTO paste (name, post, created_time) VALUES (?, ?, ?)"
  const values = [name, post, timeCreated]

  db.run(query, values, function (error) {
    callback(error, this.lastID)
  })
}

exports.updatePasteById = function (post, pasteName, id, callback) {
  const query = "UPDATE paste SET post = ?, name = ? WHERE id = ?"
  const values = [post, pasteName, id]

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.deletePasteById = function (id, callback) {
  const query = "DELETE FROM paste WHERE id = ?"
  const values = [id]

  db.run(query, values, function (error) {
    callback(error, this.lastID)
  })
}

exports.getAllPastesFromName = function (pasteName, callback) {
  const query = "SELECT * FROM paste WHERE name = ?"
  const values = [pasteName]

  db.get(query, values, function (error, pastes) {
    callback(error, pastes)
  })
}

exports.getAllPastesByDate = function (unixTimeOne, unixTimeTwo, callback) {
  const query = "SELECT id, name, post, strftime(\x22%Y-%m-%d %H:%M\x22, created_time, \x27unixepoch\x27, \x27localtime\x27) AS created_time FROM paste WHERE created_time BETWEEN ? AND ?"
  const values = [unixTimeOne, unixTimeTwo]

  db.all(query, values, function (error, pastes) {
    callback(error, pastes)
  })
}

/*    FAQ queries     */
exports.getAllFaqs = function (callback) {
  const query = "SELECT * FROM faq"
  db.all(query, function (error, faqs) {
    callback(error, faqs)
  })
}

exports.getFaqById = function (id, callback) {
  const query = "SELECT * FROM faq WHERE id = ?"
  const values = [id]

  db.get(query, values, function (error, faq) {
    callback(error, faq)
  })
}

exports.createFaq = function (question, answer, callback) {
  const query = "INSERT INTO faq (question, answer) VALUES (?, ?)"
  const values = [question, answer]

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.updateFaqById = function (question, answer, id, callback) {
  const query = "UPDATE faq SET question = ?, answer = ? WHERE id = ?"
  const values = [question, answer, id]

  db.run(query, values, function (error) {
    callback(error, this.lastID)
  })
}

exports.deleteFaqById = function (id, callback) {
  const query = "DELETE FROM faq WHERE id = ?"
  const values = [id]

  db.run(query, values, function (error) {
    callback(error, this.lastID)
  })
}

/*    GuestBook queries     */

exports.getAllGuestBookEntries = function (callback) {
  const query = "SELECT * FROM guestbook_entry"

  db.all(query, function (error, entries) {
    callback(error, entries)
  })
}

exports.getAllGuestBookCommentsFromEntryId = function (id, callback) {
  const query = "SELECT * FROM guestbook_comments WHERE id = ?"
  const values = [id]

  db.all(query, values, function (error, comments) {
    callback(error, comments)
  })
}

exports.createGuestbookEntry = function (entry, name, email, age, callback) {
  const query = "INSERT INTO guestbook_entry (entry, name, email, age) VALUES (?, ?, ?, ?)"
  const values = [entry, name, email, age]

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.updateGuestbookEntry = function (entry, name, email, age, id, callback) {
  const query = "UPDATE guestbook_entry SET entry = ?, name = ?, email = ?, age = ? WHERE id = ?"
  const values = [entry, name, email, age, id]

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.getGuestbookEntryById = function (id, callback) {
  const query = "SELECT * FROM guestbook_entry WHERE id = ?"
  const values = [id]

  db.get(query, values, function (error, entry) {
    callback(error, entry)
  })
}

exports.getAllGuestbookCommentsByEntryId = function (id, callback) {
  const query = "SELECT * FROM guestbook_comment WHERE guestbook_entry_id = ? ORDER BY id DESC"
  const values = [id]

  db.all(query, values, function (error, comments) {
    callback(error, comments)
  })
}

exports.getGuestbookCommentById = function (id, callback) {
  const query = "SELECT * FROM guestbook_comment WHERE id = ?"
  const values = [id]

  db.get(query, values, function (error, comment) {
    callback(error, comment)
  })
}

exports.createGuestbookCommentOnEntryId = function (id, comment, name, age, callback) {
  const query = "INSERT INTO guestbook_comment (guestbook_entry_id, comment, name, age) VALUES (?, ?, ?, ?)"
  const values = [id, comment, name, age]

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.updateGuestbookCommentById = function (id, comment, name, age, callback) {
  const query = "UPDATE guestbook_comment SET comment = ?, name = ?, age = ? WHERE id = ?"
  const values = [comment, name, age, id]

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.deleteGuestbookCommentById = function (id, callback) {
  const query = "DELETE FROM guestbook_comment WHERE id = ?"
  const values = [id]

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.deleteGuestbookEntryById = function (id, callback) {
  const query = "DELETE FROM guestbook_entry WHERE id = ?"
  const values = [id]

  db.run(query, values, function (error) {
    callback(error)
  })
}
