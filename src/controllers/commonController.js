const cacheService = require('../services/cacheService');

const getCaptcha = async (req, res) => {
    try {
        const result = await cacheService.getCaptcha(req.query.sessionId);
        res.sendResponse({
            data: result,
            message: '获取图形验证码成功'
        });
    } catch (error) {
        res.sendResponse({
            code: 500,
            data: null,
            message: '服务器异常'
        });
    }
};

module.exports = { getCaptcha };