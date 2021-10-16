'use strict';

import db from './db';

// get all services
export function listServices() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Service_Type';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const services = rows.map((s) => ({ id: s.id, name: s.name, time: s.time }));
            resolve(services);
        });
    });
};