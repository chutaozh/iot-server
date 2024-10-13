const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

class SessionModel {
    static insertSession({ id, code }) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO iot_session (id, verify_code, create_time) VALUES (?, ?, ?)',
                [id, code, new Date()],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static deleteSession(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM iot_session WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static getSession(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM iot_session WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    }
}

module.exports = SessionModel;