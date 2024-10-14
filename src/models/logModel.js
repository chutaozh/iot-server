const db = require('../config/db');

class LogModel {
    static async getLogList({ pageNum = 1, pageSize = 10, startTime, endTime, type } = {}) {
        return new Promise((resolve, reject) => {
            const offset = (pageNum - 1) * pageSize;
            const limit = pageSize;
            const where = [];

            if (startTime) {
                where.push(`create_time >= '${startTime}'`);
            }

            if (endTime) {
                where.push(`create_time <= '${endTime}'`);
            }

            if (type) {
                where.push(`log_type = '${type}'`);
            }

            const sql = `SELECT * FROM iot_log ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY create_time DESC LIMIT ${offset}, ${limit}`;
            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        });
    }

    static async add({ type, content, source } = {}) {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO iot_log (log_info, log_type, log_source, create_time) VALUES (?, ?, ?, ?)`,
                [content, type, source, new Date()],
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
                where.push(`create_time >= '${endTime}'`);
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