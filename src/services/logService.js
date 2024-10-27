const { dataFieldToCamelCase } = require('../utils/common');
const logModel = require('../models/logModel');

class LogService {
    static async getLogList({ pageNum = 1, pageSize = 10, startTime, endTime, type }) {
        try {
            const result = await logModel.getLogList({ pageNum, pageSize, startTime, endTime, type });
            const total = await logModel.logCount({ startTime, endTime, type });
            return {
                message: '获取日志列表成功',
                data: {
                    total,
                    pageNum,
                    pageSize,
                    list: result.map(dataFieldToCamelCase),
                },
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = LogService;