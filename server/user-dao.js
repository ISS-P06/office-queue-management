'use strict';

/* Data Access Object (DAO) module for accessing users */
import bcrypt from 'bcrypt';
import db from './db';

export function getUserById() {
  // todo: aggiustare i paramentri della tabella
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: 'User not found.' });
      } else {
        const user = { id: row.id, email: row.email, username: row.username };
        resolve(user);
      }
    });
  });
}

export function getUser() {
  // todo: aggiustare i paramentri della tabella
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email=?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, email: row.email, username: row.username };

        bcrypt
          .compare(password, row.hash)
          .then((result) => {
            if (result) {
              resolve(user);
            } else {
              resolve(false);
            }
          })
          .catch((err) => console.log(err));
      }
    });
  });
}

export function callNextClient(idCounter, idTicketServed) {
  return new Promise((resolve, reject) => {
    
    //set the previous ticket as served
    const sql = "UPDATE ticket SET status=? WHERE id=?"; 
    db.run(
      sql,
      ["served", idTicketServed],
      function (err) {
        if (err) {
          console.log(err)
          reject(err);
          return;
        }
        resolve(null);
      });

    //select the next service_type to serve
    const sql2 = `SELECT Service_Type.id as id, Service_Type.service_time as service:time, count(*) as lengthQueue 
    FROM COUNTER, SERVICE, SERVICE_TYPE, TICKET
    WHERE counter.id=? AND counter.id=Service.ref_counter AND service.ref_service_type=Service_Type.id AND Ticket.ref_service=Service_Type.id AND status="not served"
    GROUP BY Service_Type.id
    ORDER BY lengthQueue, Service_Type.service_time DESC;`; 
    db.all(
      sql2,
      [idCounter], (err,rows) => {
          //select the next ticket to serve
        const sql3 = `	SELECT  Ticket.id as id
        FROM Ticket, Service_Type
        WHERE Ticket.ref_service=Service_Type.id AND Ticket.status="not served" AND Ticket.ref_service=?
        ORDER BY Ticket.date`; 
        db.all(
          sql3,
          [rows[0].id], (err,rows) => {
            //set the current ticket as in queue
            const query = `UPDATE ticket SET status="in-queue" WHERE id=?`;
            db.run(
              query,
              [rows[0].id],
              function (err) {
                if (err) {
                  console.log(err)
                  reject(err);
                  return;
                }
                resolve(rows[0].id);
              });
          });
        if (err) {
          console.log(err)
          reject(err);
          return;
        }
        resolve(null);
      });
   
  });
}