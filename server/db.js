const sqlite = require('sqlite3');
// todo: aggiungere nome file db
const db = new sqlite.Database('database.db', (err) => {
  if (err)
  { throw err; }
});

module.exports = db;