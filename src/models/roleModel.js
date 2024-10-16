const db = require('../config/db');

class RoleModel {
    static async addRole({ roleName, remark }, loginInfo) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO iot_role (role_name, remark, update_id, update_time, create_id, create_time, is_del) VALUES (?, ?, ?, NOW(), ?, NOW(), 0)',
                [roleName, remark, loginInfo?.userId, loginInfo?.userId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    static async deleteRoles(ids = [], loginInfo) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE iot_role SET is_Del = 1, update_id = ?, update_time = NOW() WHERE id IN (?) AND is_del = 0', [loginInfo?.userId, ids], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    db.query('SELECT id, role_name FROM iot_role WHERE id IN (?) AND is_del = 1', [ids], (_, roles) => {
                        resolve({
                            result,
                            roles
                        });
                    });
                };
            });
        });
    }

    static async updateRoleById(id, role, loginInfo) {
        return new Promise((resolve, reject) => {
            const allowFields = ['role_name', 'remark'];
            const updateFields = Object.keys(role).filter((key) => allowFields.includes(key)).map(key => `${key} = ?`).join(', ');
            const values = Object.values(role).map((value) => value === '' ? null : value);

            db.query(`UPDATE iot_role SET ${updateFields}, update_id = ?, update_time = NOW() WHERE id = ? AND is_del = 0`, [...values, loginInfo?.userId, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    }

    static async isExistRoleName({ roleId, roleName }) {
        return new Promise((resolve, reject) => {
            const where = [`is_del = 0 AND role_name = ${roleName}`];

            if (roleId) {
                where.push(`id != ${roleId}`);
            }

            const sql = `SELECT COUNT(*) as count FROM iot_role WHERE ${where.join(' AND ')}`;

            db.promise().query(sql).then(result => {
                resolve(result[0][0].count);
            }).catch(reject);
        });
    }

    static async getRoleById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, role_name FROM iot_role WHERE id = ? AND is_del = 0', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        })
    }
}

module.exports = RoleModel;