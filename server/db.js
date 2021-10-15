'use strict';

import sqlite3 from 'sqlite3';

// open database
// todo: aggiungere nome file db
const db = new sqlite3.Database('./coso.db', (err) => {
  if (err) throw err;
});

export default db;
