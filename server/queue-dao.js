'use strict';
// Data Access Object (DAO) for queues and related tables

import db from './db';

export function getQueueStatus() {
  return new Promise((resolve, reject) => {
    const sql = `
            SELECT ST.id AS id, ST.name AS service, MIN(T.number) AS currentTicket, C.number AS counter
            FROM ticket T, service_type ST, service S, counter C
            WHERE T.ref_service = ST.id
                AND ST.id = S.ref_service_type
                AND S.ref_counter = C.id
                AND T.status = 'not-served'
            GROUP BY ST.id, ST.name;`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      } else if (rows === []) {
        resolve({ error: 'No queue data found.' });
      } else {
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
        resolve(result);
      }
    });
  });
}
