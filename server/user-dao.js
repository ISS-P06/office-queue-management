'use strict';

/* Data Access Object (DAO) module for accessing users */
import bcrypt from 'bcrypt';
import db from './db';

export function getUserById(id) {
  // todo: aggiustare i paramentri della tabella
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Employee WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: 'User not found.' });
      } else {
        const user = { id: row.id, role: row.role, username: row.username };
        resolve(user);
      }
    });
  });
}

export function getUser(username, password) {
  // todo: aggiustare i paramentri della tabella
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Employee WHERE username=?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, role: row.role, username: row.username };

        if (password === row.password) {
          resolve(user);
        } else {
          resolve(false);
        }

        // todo add hash password
        // bcrypt
        //   .compare(password, row.hash)
        //   .then((result) => {
        //     if (result) {
        //       resolve(user);
        //     } else {
        //       resolve(false);
        //     }
        //   })
        //   .catch((err) => console.log(err));
      }
    });
  });
}
