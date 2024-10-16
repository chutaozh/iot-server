const { responseErrorHandler } = require('../utils/common');
const logService = require('../services/logService');

const getLogList = async (req, res) => {
    try {
        const result = await logService.getLogList(req.body);
        res.sendResponse({
            data: result,
            message: '获取日志列表成功'
        });
    } catch (error) {
        responseErrorHandler(res, error);
    }
};


module.exports = { getLogList };