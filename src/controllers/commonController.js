const sessionService = require('../services/sessionService');

const getCaptcha = async (req, res) => {
    try {
        const result = await sessionService.getCaptcha();
        res.sendResponse({
            data: result,
            message: '获取图形验证码成功'
        });
    } catch (error) {
        res.sendResponse({
            code: 500,
            data: null,
            message: '获取图形验证码失败'
        });
    }
};


module.exports = { getCaptcha };