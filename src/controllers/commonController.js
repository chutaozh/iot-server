const { responseErrorHandler } = require('../utils/common');
const cacheService = require('../services/cacheService');

const getCaptcha = async (req, res) => {
    try {
        const result = await cacheService.getCaptcha(req.query.sessionId);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

module.exports = { getCaptcha };