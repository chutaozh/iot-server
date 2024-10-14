const logService = require('../services/logService');

const getLogList = async (req, res) => {
    try {
        const result = await logService.getLogList(req.body);
        res.sendResponse({
            data: result,
            message: '获取日志列表成功'
        });
    } catch (error) {
        res.sendResponse({
            code: 500,
            data: null,
            message: '服务器异常'
        });
    }
};


module.exports = { getLogList };