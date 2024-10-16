const db = require('../config/db');

class CacheModel {
    static addCache({ id, content, type }) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO iot_cache (id, content, create_time, cache_type) VALUES (?, ?, ?, ?)',
                [String(id), content, new Date(), type],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static deleteCache(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM iot_cache WHERE id = ?', [String(id)], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static getCache(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM iot_cache WHERE id = ?', [String(id)], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        })
    }
}

module.exports = CacheModel;