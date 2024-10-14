const db = require('../config/db');

class UserModel {
    static async addUser({ account, userName, password }) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO iot_user (account, user_name, password, status, is_del, update_time, create_time) VALUES (?, ?, ?, 1, 0, NOW(), NOW())', [account, userName, password], (err, result) => {
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

    static async updateUserById(id, user) {
        return new Promise((resolve, reject) => {
            const allowFields = ['user_name', 'password', 'status', 'is_del'];
            const updateFields = Object.keys(user).filter((key) => allowFields.includes(key)).map(key => `${key} = ?`).join(', ');
            const values = Object.values(user);
            db.query(`UPDATE iot_user SET ${updateFields}, update_time = NOW() WHERE id = ?`, [...values, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = UserModel;