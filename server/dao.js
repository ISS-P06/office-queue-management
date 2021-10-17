'use strict';

import db from './db';

export function callNextClient(idCounter, idTicketServed) {
  return new Promise((resolve, reject) => {
    console.log('idCounter=' + idCounter);
    console.log('idTicket=' + idTicketServed);
    //set the previous ticket as served
    const sql = 'UPDATE ticket SET status=? WHERE id=?';
    db.run(sql, ['served', idTicketServed], function (err) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
    });

    //select the next service_type to serve
    const sql2 = `SELECT ST.id as id,
                    ST.service_time as service_time,
                    count(*) as lengthQueue
                  FROM COUNTER C, SERVICE S, SERVICE_TYPE ST, TICKET T
                  WHERE C.id=? 
                  AND C.id=S.ref_counter 
                  AND S.ref_service_type=ST.id 
                  AND T.ref_service=ST.id 
                  AND T.status="not served"
                  GROUP BY ST.id
                  ORDER BY lengthQueue, ST.service_time DESC`;
    db.all(sql2, [idCounter], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      // when no one can be served return nextId=0
      if (rows.length <= 0) {
        resolve(0);
        return;
      }

      const serviceType = rows[0].id;

      //select the next ticket to serve
      const sql3 = `SELECT T.id as id
                    FROM TICKET T, SERVICE_TYPE ST
                    WHERE T.ref_service=ST.id 
                    AND T.status="not served" 
                    AND T.ref_service=?
                    ORDER BY T.date`;
      db.all(sql3, [serviceType], (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        const nextTicket = rows[0].id;

        //set the current ticket as in queue
        const query = `UPDATE ticket SET status="in-queue" WHERE id=?`;
        db.run(query, [nextTicket], function (err) {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(nextTicket);
        });
      });
    });
  });
}

//Reset tickets and queues
export const reset = () => {
  return new Promise((resolve, reject) => {
    const sql = `
                    UPDATE Ticket
                    SET status = "not_served"
                    WHERE status = "in_queue"
                   `;
    db.run(sql, [], (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`Tickets updated : ${this.changes}`);
      resolve(this.changes);
    });
  });
};
