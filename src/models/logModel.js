const db = require('../config/db');

class LogModel {
    static async getLogList({ pageNum = 1, pageSize = 10, startTime, endTime, type } = {}) {
        return new Promise((resolve, reject) => {
            const offset = (pageNum - 1) * pageSize;
            const limit = pageSize;
            const where = [];

            if (startTime) {
                where.push(`L.create_time >= '${startTime}'`);
            }

            if (endTime) {
                where.push(`L.create_time <= '${endTime}'`);
            }

            if (type) {
                where.push(`L.log_type = '${type}'`);
            }

            const sql = `SELECT L.*, U.user_name FROM iot_log L LEFT JOIN iot_user U ON L.create_id = U.id ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY L.create_time DESC LIMIT ${offset}, ${limit}`;
            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        });
    }

    static async add(type, content, source = '', userId = '') {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO iot_log (log_info, log_type, log_source, create_time, create_id) VALUES (?, ?, ?, ?, ?)`,
                [content, type, source, new Date(), userId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
        })
    }

    static async logCount({ startTime, endTime, type } = {}) {
        return new Promise((resolve, reject) => {
            const where = [];

            if (startTime) {
                where.push(`create_time >= '${startTime}'`);
            }

            if (endTime) {
                where.push(`create_time <= '${endTime}'`);
            }

            if (type) {
                where.push(`log_type = ${type}`);
            }

            const sql = `SELECT COUNT(*) as count FROM iot_log ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}`;
            db.promise().query(sql).then(result => {
                resolve(result[0][0].count);
            }).catch(reject);
        });
    }
}

module.exports = LogModel;