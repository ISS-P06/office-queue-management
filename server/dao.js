'use strict';

import db from './db';

//Reset tickets and queues
exports.reset = () => {
    return new Promise((resolve, reject) => {
      const sql = `
                    UPDATE Ticket
                    SET status = "not_served"
                    WHERE status = "in_queue"
                   `;
      db.run(sql, [], err => {
        if (err) {
          reject(err);
          return;
        }
        console.log(`Tickets updated : ${this.changes}`);
        resolve(this.changes);
      });
    });
  }