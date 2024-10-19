const db = require('../config/db');

class RoleModel {
    static async addRole({ roleType, roleName, remark }, loginInfo) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO iot_role (role_type, role_name, remark, update_id, update_time, create_id, create_time, is_del) VALUES (?, ?, ?, ?, NOW(), ?, NOW(), 0)',
                [roleType, roleName, remark, loginInfo?.userId, loginInfo?.userId],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    static async getRoleList({ roleType, keyword, pageNum, pageSize, orderBy = 'create_time', orderType = 'desc' } = {}) {
        return new Promise((resolve, reject) => {
            const allowOrderType = ['asc', 'desc'];
            const allowOrderBy = ['role_name', 'role_type', 'create_time','user_count'];
            const where = [];

            if (roleType) {
                where.push(`R.role_type = ${roleType}`);
            }

            if (keyword) {
                where.push(`(R.role_name LIKE '%${keyword}%' OR R.remark LIKE '%${keyword}%')`);
            }

            const order = allowOrderBy.includes(orderBy) && allowOrderType.includes(orderType) ? `ORDER BY ${orderBy} ${orderType}` : '';

            const sql = `SELECT 
                            R.id, 
                            R.role_type, 
                            R.role_name, 
                            R.remark, 
                            COUNT(UR.user_id) as user_count,
                            R.create_time
                        FROM iot_role R 
                        LEFT JOIN iot_user_role_ref UR ON R.id = UR.role_id 
                        WHERE R.is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''} 
                        GROUP BY R.id
                        ${order}
                        LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;

            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        });
    };

    static async getRoleListAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, role_type, role_name, remark, create_time FROM iot_role WHERE is_del = 0', (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
    }

    static async getRoleCount({ roleType, keyword }) {
        return new Promise((resolve, reject) => {
            let where = [];
            if (roleType) {
                where.push(`role_type = ${roleType}`);
            }
            if (keyword) {
                where.push(`role_name LIKE '%${keyword}%'`);
            }
            db.query(`SELECT COUNT(*) AS count FROM iot_role WHERE is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''}`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count);
                }
            });
        });
    }

    static async deleteRoles(ids = [], loginInfo) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE iot_role SET is_Del = 1, update_id = ?, update_time = NOW() WHERE id IN (?) AND role_type != 1 AND is_del = 0', [loginInfo?.userId, ids], (err, result) => {
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
            const allowFields = ['role_type', 'role_name', 'remark'];
            const updateFields = Object.keys(role).filter((key) => allowFields.includes(key));
            const values = updateFields.map(key=> role[key]).map((value) => value === '' ? null : value);

            db.query(`UPDATE iot_role SET ${updateFields.map(key => `${key} = ?`).join(', ')}, update_id = ?, update_time = NOW() WHERE id = ? AND role_type != 1 AND is_del = 0`, [...values, loginInfo?.userId, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    }

    static async isExistRoleName({ roleId, roleName }) {
        return new Promise((resolve, reject) => {
            const where = [`is_del = 0 AND role_name = '${String(roleName)}'`];

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

    static async getRolesByIds(ids) {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, role_name FROM iot_role WHERE id IN (?) AND is_del = 0', [ids], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    }

    static async getRolesByUserIds(userIds) {
        return new Promise((resolve, reject) => {
            db.query('SELECT UR.user_id, UR.role_id as id, R.role_name FROM iot_user_role_ref UR LEFT JOIN iot_role R ON R.id = UR.role_id WHERE UR.user_id IN (?)', [userIds], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    }

    static async addUserRoles({ userId, roleIds }) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO iot_user_role_ref (user_id, role_id, create_time) VALUES ?',
                [roleIds.map((roleId) => [userId, roleId, new Date()])],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    static async deleteUserRole(userId) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM iot_user_role_ref WHERE user_id = ?', [userId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
    }

    static async getUserRoles(userIds) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT user_id, role_id FROM iot_user_role_ref WHERE user_id IN (?)',
                [userIds],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }
}

module.exports = RoleModel;