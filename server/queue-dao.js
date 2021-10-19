'use strict';
// Data Access Object (DAO) for queues and related tables

import db from './db';

export function getQueueStatus() {
  return new Promise((resolve, reject) => {
    const sql = `
            SELECT ST.id AS id, ST.name AS service, MAX(T.number) AS currentTicket, C.number AS counter
            FROM service_type ST LEFT JOIN 
              (
                SELECT id, ref_service, number, ref_counter
                FROM ticket
                WHERE status = 'served'
              ) AS T ON ST.id = T.ref_service, service S, counter C
            WHERE ST.id = S.ref_service_type
                AND S.ref_counter = C.id
            GROUP BY ST.id, ST.name;`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      } else if (rows === []) {
        resolve({ error: 'No queue data found.' });
      } else {
        console.log(rows);
        let result = [];
        for (let row of rows) {
          result.push({
            id: row.id,
            name: row.service,
            currentTicket: row.currentTicket,
            counter: row.counter,
            update: false,
          });
        }

        console.log(result);
        resolve(result);
      }
    });
  });
}
