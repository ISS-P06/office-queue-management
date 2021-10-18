'use strict';

import db from './db';

//
// Service queries
//

// get all service types
export function listServices() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Service_Type';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const services = rows.map((s) => ({ id: s.id, name: s.name, service_time: s.service_time }));
      resolve(services);
    });
  });
}

// add a new service type
export function createService(s) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Service_Type(name, service_time) VALUES(?, ?)';
    db.run(sql, [s.name, s.service_time], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

// delete all services
export function deleteServices() {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Service_Type';
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
}

// delete a single service type
export function deleteService(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Service_Type WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
}

//
// Counter queries
//

// get all counters
export function listCounters() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Counter';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const counters = rows.map((c) => ({ id: c.id, officer: c.ref_officer, number: c.number }));
      resolve(counters);
    });
  });
}

// get all the offered services for each counter
export function listOfferedServices() {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT ref_counter, id, name FROM Service s, Service_Type st WHERE s.ref_service_type = st.id';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const offered_services = rows.map((os) => ({
        counter_id: os.ref_counter,
        service_id: os.id,
        service_name: os.name,
      }));
      resolve(offered_services);
    });
  });
}

// add a new counter
export function createCounter(c) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Counter(ref_officer, number) VALUES(?, ?)';
    db.run(sql, [c.officer, c.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

// add a new offered service
export function createOfferedService(os) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Service(ref_counter, ref_service_type) VALUES(?, ?)';
    db.run(sql, [os.cid, os.sid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

// delete all data related to a counter
export function deleteCounter(id) {
  return new Promise((resolve, reject) => {
    const sql1 = 'DELETE FROM Service WHERE ref_counter = ?';
    db.run(sql1, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else {
        const sql2 = 'DELETE FROM Counter WHERE id = ?;';
        db.run(sql2, [id], (err) => {
          if (err) {
            reject(err);
            return;
          } else {
            resolve(null);
          }
        });
      }
    });
  });
}

//
// Officer queries
//

// get all officers
export function listOfficers() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, username FROM Employee WHERE role="officer"';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const officers = rows.map((o) => ({ id: o.id, username: o.username }));
      resolve(officers);
    });
  });
}

// add a new officer
export function createOfficer(o) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Employee(username, password, role) VALUES(?, ?, ?)';
    db.run(sql, [o.username, o.password, o.role], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

// delete a single officer
export function deleteOfficer(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Employee WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
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
