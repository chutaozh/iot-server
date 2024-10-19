const db = require('../config/db');

class UserModel {
    static async addUser({ account, userName, password }, loginInfo) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO iot_user (account, user_name, password, status, is_del, update_id, update_time, create_id, create_time) VALUES (?, ?, ?, 1, 0, ?, NOW(), ?, NOW())', [account, userName, password, loginInfo.userId, loginInfo.userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getUserByAccount(account) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM iot_user WHERE account = ? AND is_Del = 0', [account], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });
    }

    static async getUserById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM iot_user WHERE id = ? AND is_Del = 0', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });
    }

    static async getUserList({ roleId, keyword, status, startTime, endTime, pageNum, pageSize, orderBy = 'create_time', orderType = 'desc' } = {}) {
        return new Promise((resolve, reject) => {
            const allowOrderType = ['asc', 'desc'];
            const allowOrderBy = ['user_name', 'account', 'status', 'create_time'];
            const where = [];

            if(String(status)) {
                where.push(`U.status = ${status}`);
            }

            if (keyword) {
                where.push(`(U.user_name LIKE '%${keyword}%' OR U.account LIKE '%${keyword}%')`);
            }

            if (startTime && endTime) {
                where.push(`U.create_time BETWEEN '${startTime}' AND '${endTime}'`);
            }

            if (roleId) {
                where.push(`UR.role_id = ${roleId}`);
            }

            const order = allowOrderBy.includes(orderBy) && allowOrderType.includes(orderType) ? `ORDER BY U.${orderBy} ${orderType}` : '';

            const sql = `SELECT 
                            U.id, 
                            U.user_name, 
                            U.account, 
                            U.status,
                            U.create_time
                        FROM iot_user U
                        LEFT JOIN iot_user_role_ref UR ON U.id = UR.user_id 
                        WHERE U.is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''} 
                        ${order}
                        LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        });

    }

    static async getUserCount({ roleId, keyword,  status, startTime, endTime }) {
        return new Promise((resolve, reject) => {
            const where = [];

            if(String(status)) {
                where.push(`U.status = ${status}`);
            }

            if (keyword) {
                where.push(`(U.user_name LIKE '%${keyword}%' OR U.account LIKE '%${keyword}%')`);
            }

            if (startTime && endTime) {
                where.push(`U.create_time BETWEEN '${startTime}' AND '${endTime}'`);
            }

            if (roleId) {
                where.push(`UR.role_id = ${roleId}`);
            }

            const sql = `SELECT COUNT(*) AS count
                        FROM iot_user U
                        LEFT JOIN iot_user_role_ref UR ON U.id = UR.user_id 
                        WHERE U.is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''}`;
            db.promise().query(sql).then(result => {
                resolve(result[0][0].count);
            }).catch(reject);
        })
    }

    static async updateUserById(id, user, loginInfo) {
        return new Promise((resolve, reject) => {
            const allowFields = ['user_name', 'status'];
            const updateFields = Object.keys(user).filter((key) => allowFields.includes(key)).map(key => `${key} = ?`).join(', ');
            const values = Object.values(user);

            db.query(`UPDATE iot_user SET ${updateFields}, update_id = ?, update_time = NOW() WHERE id = ? AND is_del = 0`, [...values, loginInfo?.userId, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async deleteUsers(ids = [], loginInfo) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE iot_user SET is_Del = 1, update_id = ?, update_time = NOW() WHERE id IN (?) AND is_del = 0', [loginInfo?.userId, ids], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    db.query('SELECT id, account FROM iot_user WHERE id IN (?) AND is_del = 1', [ids], (_, users) => {
                        resolve({
                            result,
                            users
                        });
                    });
                };
            });
        });
    }

    static async updatePassword(id, password) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE iot_user SET password = ?, update_id = ?, update_time = NOW() WHERE id = ? AND is_del = 0', [password, id, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = UserModel;