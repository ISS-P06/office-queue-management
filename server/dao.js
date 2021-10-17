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
            const counters = rows.map((c) => ({ id: c.id, officer: c.ref_officer }));
            resolve(counters);
        });
    });
};

// get all the offered services for each counter
export function listOfferedServices() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT ref_counter, id, name FROM Service s, Service_Type st WHERE s.ref_service_type = st.id';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const offered_services = rows.map((os) => ({ counter_id: os.ref_counter, service_id: os.id, service_name: os.name }));
            resolve(offered_services);
        });
    });
};

// add a new counter
export function createCounter(c) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Counter(id, ref_officer) VALUES(?, ?)';
        db.run(sql, [c.id, c.officer], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

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
};

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
};

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
};

// delete a single officer
export function deleteOfficer(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Employee WHERE id = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}