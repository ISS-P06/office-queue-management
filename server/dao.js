'use strict';

import db from './db';
export function callNextClient(idCounter, idTicketServed) {
    return new Promise((resolve, reject) => {
      console.log("idCounter"+idCounter);
      console.log("idTicket"+idTicketServed);
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
