'use strict';

import db from './db';
export function callNextClient(idCounter, idTicketServed) {
    return new Promise((resolve, reject) => {
      console.log("idCounter"+idCounter);
      console.log("idTicket"+idTicketServed);
      //set the previous ticket as served
      if(idTicketServed){
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
          });
      }
      //select the next service_type to serve
      const sql2 = `SELECT Service_Type.id as id, Service_Type.service_time as service_time, count(*) as lengthQueue 
      FROM COUNTER, SERVICE, SERVICE_TYPE, TICKET
      WHERE counter.id=? AND counter.id=Service.ref_counter AND service.ref_service_type=Service_Type.id AND Ticket.ref_service=Service_Type.id AND status="not served"
      GROUP BY Service_Type.id
      ORDER BY lengthQueue DESC, Service_Type.service_time`; 
      db.all(
        sql2,
        [idCounter], (err,rows) => {
          console.log("sql2");
          console.log(rows);
          if(rows.length==0){
            resolve(null);
          }
          else{
              //select the next ticket to serve
              const sql3 = `	SELECT  Ticket.id as id
              FROM Ticket, Service_Type
              WHERE Ticket.ref_service=Service_Type.id AND Ticket.status="not served" AND Ticket.ref_service=?
              ORDER BY Ticket.date`; 
              db.all(
                sql3,
                [rows[0].id], (err,rows) => {
                  console.log("sql3");
                  console.log(rows);
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
                      console.log(rows[0].id);
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
