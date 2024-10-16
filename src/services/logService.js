const { dataFieldToCamelCase } = require('../utils/common');
const logModel = require('../models/logModel');

class LogService {
    static async getLogList({ pageNum = 1, pageSize = 10, startTime, endTime, type }) {
        try {
            const result = await logModel.getLogList({ pageNum, pageSize, startTime, endTime, type });
            const total = await logModel.logCount({ startTime, endTime, type });
            return {
                total,
                pageNum,
                pageSize,
                list: result.map(item => dataFieldToCamelCase({ ...item, create_time: new Date(item.create_time).toLocaleString() })),
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    static async add(type, content, source = '', userId = '') {
        logModel.add({ type, content, source, userId });
    }
}

module.exports = LogService;