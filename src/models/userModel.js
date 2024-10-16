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