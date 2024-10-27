const db = require('../config/db');

class ClientModel {
    /** 添加客户 */
    static async addClient({
        clientNo,
        clientName,
        clientType,
        contact,
        contactPhone,
        contactProvince,
        contactCity,
        contactArea,
        contactStreet,
        contactAddress,
        salesman,
        updateId,
        createId,
    }) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO iot_client (
                client_no,
                client_name,
                client_type,
                contact,
                contact_phone,
                contact_province,
                contact_city,
                contact_area,
                contact_street,
                contact_address,
                salesman,
                update_id, 
                update_time, 
                create_id, 
                create_time, 
                is_del
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), 0)`,
                [clientNo, clientName, clientType, contact, contactPhone, contactProvince, contactCity, contactArea, contactStreet, contactAddress, salesman, updateId, createId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
        })
    }

    /** 更新客户 */
    static async updateClient(id, clien) {
        return new Promise((resolve, reject) => {
            const allowFields = ['client_name', 'client_type', 'contact', 'contact_phone', 'contact_province', 'contact_city', 'contact_area', 'contact_street', 'contact_address', 'salesman', 'update_id'];
            const updateFields = Object.keys(clien).filter((key) => allowFields.includes(key));
            const values = updateFields.map(key => clien[key]).map((value) => value === '' ? null : value);
            db.query(`UPDATE iot_client SET ${updateFields.map(key => `${key} = ?`).join(', ')}, update_time = NOW() WHERE id = ? AND is_del = 0`, [...values, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    }

    /** 删除客户 */
    static async deleteClients(ids = [], userId) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE iot_client SET is_Del = 1, update_id = ?, update_time = NOW() WHERE id IN (?)', [userId, ids], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    db.query('SELECT id, client_no, client_name FROM iot_client WHERE id IN (?)', [ids], (_, clients) => {
                        resolve({
                            result,
                            clients
                        });
                    });
                };
            });
        })
    }

    /** 获取客户 */
    static async getClientById(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
                    C.id, 
                    C.client_no, 
                    C.client_name, 
                    C.client_type, 
                    C.contact, 
                    C.contact_phone,
                    C.contact_province,
                    AP.name as contact_province_name,
                    C.contact_city,
                    AC.name as contact_city_name,
                    C.contact_area,
                    AA.name as contact_area_name,
                    C.contact_street,
                    AST.name as contact_street_name,
                    C.contact_address, 
                    C.salesman,
                    U.user_name as salesman_name,
                    C.create_time
                FROM iot_client C
                LEFT JOIN iot_user U ON C.salesman = U.id
                LEFT JOIN iot_address_province AP ON C.contact_province = AP.id
                LEFT JOIN iot_address_city AC ON C.contact_city = AC.id
                LEFT JOIN iot_address_area AA ON C.contact_area = AA.id
                LEFT JOIN iot_address_street AST ON C.contact_street = AST.id
                WHERE C.id = ?`, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        })
    }

    static async getCurrentDateCount() {
        return new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) as count FROM iot_client WHERE DATE_FORMAT(create_time, "%Y-%m-%d") = CURDATE()', (err, result) => {
                if (err) reject(err);
                else resolve(result[0].count);
            });
        });
    }

    static async getAllClientList({ keyword }) {
        return new Promise((resolve, reject) => {
            const where = [];

            if (keyword) {
                where.push(`client_name LIKE '%${keyword}%' OR contact LIKE '%${keyword}%' OR contact_phone LIKE '%${keyword}%'`);
            }

            const sql = `SELECT 
                            id,
                            client_no, 
                            client_name, 
                            contact,
                            contact_phone
                        FROM iot_client
                        WHERE is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''}`;
            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        });
    }

    static async getClientList({ clientType, clientName, contact, contactPhone, startTime, endTime, pageNum, pageSize, orderBy = 'create_time', orderType = 'desc' } = {}) {
        return new Promise((resolve, reject) => {
            const allowOrderType = ['asc', 'desc'];
            const allowOrderBy = ['client_no', 'client_name', 'client_type', 'contact', 'contact_phone', 'salesman', 'create_time'];
            const where = [];

            if (clientType) {
                where.push(`C.client_type = ${clientType}`);
            }

            if (clientName) {
                where.push(`C.client_name LIKE '%${clientName}%'`);
            }

            if (contact) {
                where.push(`C.contact LIKE '%${contact}%'`);
            }

            if (contactPhone) {
                where.push(`C.contact_phone LIKE '%${contactPhone}%'`);
            }

            if (startTime && endTime) {
                where.push(`C.create_time BETWEEN '${startTime}' AND '${endTime}'`);
            }

            const order = allowOrderBy.includes(orderBy) && allowOrderType.includes(orderType) ? `ORDER BY C.${orderBy} ${orderType}` : '';

            const sql = `SELECT 
                            C.id,
                            C.client_no, 
                            C.client_name, 
                            C.client_type, 
                            C.contact, 
                            C.contact_phone, 
                            C.contact_province,
                            AP.name as contact_province_name,
                            C.contact_city,
                            AC.name as contact_city_name,
                            C.contact_area,
                            AA.name as contact_area_name,
                            C.contact_street,
                            AST.name as contact_street_name,
                            C.contact_address, 
                            C.salesman,
                            U.user_name as salesman_name,
                            C.create_time
                        FROM iot_client C
                        LEFT JOIN iot_user U ON C.salesman = U.id
                        LEFT JOIN iot_address_province AP ON C.contact_province = AP.id
                        LEFT JOIN iot_address_city AC ON C.contact_city = AC.id
                        LEFT JOIN iot_address_area AA ON C.contact_area = AA.id
                        LEFT JOIN iot_address_street AST ON C.contact_street = AST.id
                        WHERE C.is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''} 
                        ${order}
                        LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        })
    }

    static async getClientCount({ clientType, clientName, contact, contactPhone, startTime, endTime } = {}) {
        return new Promise((resolve, reject) => {
            const where = [];

            if (clientType) {
                where.push(`client_type = ${clientType}`);
            }

            if (clientName) {
                where.push(`client_name LIKE '%${clientName}%'`);
            }

            if (contact) {
                where.push(`contact LIKE '%${contact}%'`);
            }

            if (contactPhone) {
                where.push(`contact_phone LIKE '%${contactPhone}%'`);
            }

            if (startTime && endTime) {
                where.push(`create_time BETWEEN '${startTime}' AND '${endTime}'`);
            }

            const sql = `SELECT COUNT(*) AS count
                            FROM iot_client
                            WHERE is_del = 0 ${where.length > 0 ? 'AND ' + where.join(' AND ') : ''}`;
            db.promise().query(sql).then(result => {
                resolve(result[0][0].count);
            }).catch(reject);
        })
    }
}

module.exports = ClientModel;