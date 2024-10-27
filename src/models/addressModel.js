const db = require('../config/db');

class AddressModel {
    /** 获取省份列表 */
    static async getProvinceList(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM iot_address_province` + (id ? ` WHERE id = ${id}` : '');
            db.promise().query(sql).then(result => {
                resolve(result[0]);
            }).catch(reject);
        })
    }

    /** 获取城市列表 */
    static async getCityList(provinceId) {
        return new Promise((resolve, reject) => {
            db.promise().query('SELECT * FROM iot_address_city WHERE pid = ?', [provinceId]).then(result => {
                resolve(result[0]);
            }).catch(reject);
        })
    }

    /** 获取区域列表 */
    static async getAreaList(cityId) {
        return new Promise((resolve, reject) => {
            db.promise().query('SELECT * FROM iot_address_area WHERE pid = ?', [cityId]).then(result => {
                resolve(result[0]);
            }).catch(reject);
        })
    }

    /** 获取街道列表 */
    static async getStreetList(areaId) {
        return new Promise((resolve, reject) => {
            db.promise().query('SELECT * FROM iot_address_street WHERE pid = ?', [areaId]).then(result => {
                resolve(result[0]);
            }).catch(reject);
        })
    }
}

module.exports = AddressModel;