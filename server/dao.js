'use strict';

import db from './db';

export function callNextClient(idCounter, idTicketServed) {
    return new Promise((resolve, reject) => {
     
      if(idTicketServed){
         //set the previous ticket as served
        const sql = `UPDATE ticket SET status="served" WHERE id=?`; 
        db.run(
          sql,
          [idTicketServed],
          function (err) {
            if (err) {
              console.log(err)
              reject(err);
              return;
            }
          });
      }
      //select the next service_type to serve
      const sql2 = `SELECT Service_Type.id as id, Service_Type.service_time as service_time, count(*) as lengthQueue 
      FROM COUNTER, SERVICE, SERVICE_TYPE, TICKET
      WHERE counter.id=? AND counter.id=Service.ref_counter AND service.ref_service_type=Service_Type.id AND Ticket.ref_service=Service_Type.id AND status="in-queue"
      GROUP BY Service_Type.id
      ORDER BY lengthQueue DESC, Service_Type.service_time`; 
      db.all(
        sql2,
        [idCounter], (err,rows) => {
          if(rows.length==0){
            resolve(null);
          }
          else{
              //select the next ticket to serve
              const sql3 = `	SELECT  Ticket.id as id
              FROM Ticket, Service_Type
              WHERE Ticket.ref_service=Service_Type.id AND Ticket.status="in-queue" AND Ticket.ref_service=?
              ORDER BY Ticket.date`; 
              db.all(
                sql3,
                rows[0].id, (err,rows) => {
                  //set the current ticket as served
                  console.log(rows);
                  const query = `UPDATE ticket SET status="is-serving" WHERE id=?`;
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
          }
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
