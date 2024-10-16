const { responseErrorHandler } = require('../utils/common');
const cacheService = require('../services/cacheService');

const getCaptcha = async (req, res) => {
    try {
        const result = await cacheService.getCaptcha(req.query.sessionId);
        res.sendResponse({
            data: result,
            message: '获取图形验证码成功'
        });
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

module.exports = { getCaptcha };