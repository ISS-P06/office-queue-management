'use strict';

import db from './db';
import dayjs from 'dayjs';

// Get available services
export function getServices() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id , name FROM Service_Type';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export async function getTicket(serviceID) {
  let today = dayjs();
  //console.log(today.format('YYYY-MM-DD'))
}

export function maxTicketNum(serviceID) {
  let today = dayjs().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
    let sql =
      'SELECT MAX(ticket_number) AS lastNumber FROM Ticket where date = ? AND ref_service = ? ';
    db.get(sql, [today, serviceID], (err, lastNumber) => {
      if (err) reject(err);
      else resolve(lastNumber.lastNumber);
    });
  });
}

export async function insertNewTicket(serviceID) {
  let maxTicketNumber = await maxTicketNum(serviceID);
  let ticketNumber = maxTicketNumber + 1;
  let today = dayjs().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO Ticket(id , ref_service ,date , status ,ticket_number) VALUES (?,?,?,?,?)';
    db.run(sql, [null, serviceID, today, 'in-queue', ticketNumber], (err) => {
      if (err) reject(err);
      else resolve(0);
    });
  });
}

export function callNextClient(idCounter, idTicketServed) {
  return new Promise((resolve, reject) => {
    if (idTicketServed) {
      //set the previous ticket as served
      const sql = `UPDATE ticket SET status="served" WHERE id=?`;
      db.run(sql, [idTicketServed], function (err) {
        if (err) {
          console.log(err);
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
    db.all(sql2, [idCounter], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      if (rows.length == 0) {
        resolve(null);
      } else {
        const serviceType = rows[0].id;

        //select the next ticket to serve
        const sql3 = `SELECT Ticket.number as id
              FROM Ticket, Service_Type
              WHERE Ticket.ref_service=Service_Type.id AND Ticket.status="in-queue" AND Ticket.ref_service=?
              ORDER BY Ticket.date`;
        db.all(sql3, [serviceType], (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          const ticketId = rows[0].id;

          //set the current ticket as served
          const query = `UPDATE ticket SET status="is-serving" WHERE id=?`;
          db.run(query, [ticketId], function (err) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            resolve(ticketId);
          });
        });
      }
    });
  });
}

//Reset tickets and queues
export const reset = () => {
  return new Promise((resolve, reject) => {
    const sql = `
                    UPDATE Ticket
                    SET status = "not-served"
                    WHERE status = "in-queue"
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
