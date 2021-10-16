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
};

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
};

// delete all services
export function deleteServices() {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Service_Type';
        db.run(sql, (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
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
            } else
                resolve(null);
        });
    });
}