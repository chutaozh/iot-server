const svgCaptcha = require('svg-captcha');
const { v4: uuidv4 } = require('uuid');
const svgToBase64 = require('../utils/svgToBase64');
const sessionModel = require('../models/sessionModel');

class SessionService {
    /** 获取图形验证码 */
    static async getCaptcha(sessionId) {
        try {
            if (sessionId) {
                sessionModel.deleteSession(sessionId);
            }

            const _sessionId = sessionId || uuidv4().replaceAll('-', '');
            const captcha = svgCaptcha.create();
            await sessionModel.insertSession({ id: _sessionId, code: captcha.text });
            const base64Captcha = await svgToBase64(captcha.data);

            return {
                sessionId:_sessionId,
                captcha: base64Captcha
            };
        } catch (error) {
            // TODO: 错误日志
            throw new Error(error);
        }
    }
}

module.exports = SessionService;