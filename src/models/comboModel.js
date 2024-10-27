const db = require('../config/db');

class ComboModel {
    static async addCombo({
        comboNo,
        comboName,
        comboPeriod,
        comboCapacity,
        comboType,
        standardTariff,
        salesPrice,
        remark,
    }, loginInfo) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO iot_combo (
                        combo_no, 
                        combo_name, 
                        combo_period, 
                        combo_capacity,
                        combo_type, 
                        standard_tariff,
                        sales_price,
                        status,
                        remark,
                        update_id, 
                        update_time, 
                        create_id, 
                        create_time, 
                        is_del
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), ?, NOW(), 0)`,
                [comboNo, comboName, comboPeriod, comboCapacity, comboType, standardTariff, salesPrice, remark, loginInfo.userId, loginInfo.userId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
        });
    }

    static async updateComboById(id, combo, loginInfo) {
        return new Promise((resolve, reject) => {
            const allowFields = ['combo_name', 'combo_period', 'combo_capacity', 'combo_type', 'standard_tariff', 'sales_price', 'remark'];
            const updateFields = Object.keys(combo).filter((key) => allowFields.includes(key));
            const values = updateFields.map(key => combo[key]).map((value) => value === '' ? null : value);
            db.query(`UPDATE iot_combo SET ${updateFields.map(key => `${key} = ?`).join(', ')}, update_id = ?, update_time = NOW() WHERE id = ? AND is_del = 0`, [...values, loginInfo?.userId, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async updateComboStatusById(id, status, loginInfo) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE iot_combo SET status = ?, update_id = ?, update_time = NOW() WHERE id = ? AND is_del = 0`, [status, loginInfo?.userId, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async deleteCombos(ids = [], loginInfo) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE iot_combo SET is_Del = 1, update_id = ?, update_time = NOW() WHERE id IN (?)', [loginInfo?.userId, ids], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    db.query('SELECT id, combo_no, combo_name FROM iot_combo WHERE id IN (?)', [ids], (_, combos) => {
                        resolve({
                            result,
                            combos
                        });
                    });
                };
            });
        });
    }

    static async getComboById(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
                        id,
                        combo_no, 
                        combo_name, 
                        combo_period, 
                        combo_capacity,
                        combo_type, 
                        standard_tariff,
                        sales_price,
                        status,
                        remark,
                        create_time
                FROM iot_combo WHERE id = ? AND is_del = 0`, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });
    }

    static async getCurrentDateCount() {
        return new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) as count FROM iot_combo WHERE DATE_FORMAT(create_time, "%Y-%m-%d") = CURDATE()', (err, result) => {
                if (err) reject(err);
                else resolve(result[0].count);
            });
        });
    }

    static async getComboList({ comboType, comboName, status, startTime, standardTariffRange, salesPriceRange, endTime, pageNum, pageSize, orderBy = 'create_time', orderType = 'desc' } = {}) {
        return new Promise((resolve, reject) => {
            const allowOrderType = ['asc', 'desc'];
            const allowOrderBy = ['combo_no', 'combo_name', 'combo_type', 'status', 'create_time', 'combo_period', 'combo_capacity', 'sales_price', 'standard_tariff'];
            const where = [];

            if ([0, 1, 2].includes(parseInt(status))) {
                where.push(`status = ${status}`);
            }

            if (comboName) {
                where.push(`combo_name LIKE '%${comboName}%'`);
            }

            if ([1, 2].includes(parseInt(comboType))) {
                where.push(`combo_type = ${comboType}`);
            }

            if (standardTariffRange?.length === 2) {
                const [min, max] = standardTariffRange;

                if (parseFloat(min) >= 0 && parseFloat(min) < parseFloat(max)) {
                    where.push(`standard_tariff BETWEEN ${min} AND ${max}`);
                }
            }

            if (salesPriceRange?.length === 2) {
                const [min, max] = salesPriceRange;

                if (parseFloat(min) >= 0 && parseFloat(min) < parseFloat(max)) {
                    where.push(`sales_price BETWEEN ${min} AND ${max}`);
                }
            }

            if (startTime && endTime) {
                where.push(`create_time BETWEEN '${startTime}' AND '${endTime}'`);
            }

            const order = allowOrderBy.includes(orderBy) && allowOrderType.includes(orderType) ? `ORDER BY ${orderBy} ${orderType}` : '';

            const sql = `SELECT 
                            id,
                            combo_no, 
                            combo_name, 
                            combo_period, 
                            combo_capacity,
                            combo_type, 
                            standard_tariff,
                            sales_price,
                            status,
                            remark,
                            create_time
                        FROM iot_combo
                        WHERE is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''} 
                        ${order}
                        LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        });
    }

    static async getComboListAll({ comboName }) {
        return new Promise((resolve, reject) => {
            const where = [];

            if (comboName) {
                where.push(`combo_name LIKE '%${comboName}%'`);
            }

            const sql = `SELECT 
                            id,
                            combo_no, 
                            combo_name, 
                            combo_period, 
                            combo_capacity,
                            combo_type, 
                            standard_tariff,
                            sales_price,
                            status,
                            remark,
                            create_time
                        FROM iot_combo
                        WHERE is_del = 0 AND status = 1 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''}`;
            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        });
    }

    static async getComboCount({ comboType, comboName, status, standardTariffRange, salesPriceRange, startTime, endTime } = {}) {
        return new Promise((resolve, reject) => {
            const where = [];

            if ([0, 1, 2].includes(parseInt(status))) {
                where.push(`status = ${status}`);
            }

            if (comboName) {
                where.push(`combo_name LIKE '%${comboName}%'`);
            }

            if ([1, 2].includes(parseInt(comboType))) {
                where.push(`combo_type = ${comboType}`);
            }

            if (standardTariffRange?.length === 2) {
                const [min, max] = standardTariffRange;

                if (parseFloat(min) >= 0 && parseFloat(min) < parseFloat(max)) {
                    where.push(`standard_tariff BETWEEN ${min} AND ${max}`);
                }
            }

            if (salesPriceRange?.length === 2) {
                const [min, max] = salesPriceRange;

                if (parseFloat(min) >= 0 && parseFloat(min) < parseFloat(max)) {
                    where.push(`sales_price BETWEEN ${min} AND ${max}`);
                }
            }

            if (startTime && endTime) {
                where.push(`create_time BETWEEN '${startTime}' AND '${endTime}'`);
            }

            const sql = `SELECT COUNT(*) AS count
                            FROM iot_combo
                            WHERE is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''}`;
            db.promise().query(sql).then(result => {
                resolve(result[0][0].count);
            }).catch(reject);
        })
    }
}

module.exports = ComboModel;