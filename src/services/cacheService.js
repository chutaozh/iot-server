const svgCaptcha = require('svg-captcha');
const { v4: uuidv4 } = require('uuid');
const { LogType, CacheType } = require('../utils/constant');
const svgToBase64 = require('../utils/svgToBase64');
const logService = require('./logService');
const cacheModel = require('../models/cacheModel');

class CacheService {
    /** 获取图形验证码 */
    static async getCaptcha(sessionId) {
        try {
            if (sessionId) {
                await cacheModel.deleteCache(sessionId);
            }

            const _sessionId = sessionId || uuidv4().replaceAll('-', '');
            const captcha = svgCaptcha.create();
            await cacheModel.addCache({ id: _sessionId, content: captcha.text, type: CacheType.CAPTCHA });
            const base64Captcha = await svgToBase64(captcha.data);

            return {
                sessionId: _sessionId,
                captcha: base64Captcha
            };
        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'cacheService.getCaptcha');
            throw new Error(error);
        }
    }

    static async addCache({ id, content, type }) {
        try {
            await cacheModel.addCache({ id, content, type });
        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'cacheService.addCache');
            throw new Error(error);
        }
    }

    static async getCache(id) {
        try {
            const session = await cacheModel.getCache(id);
            return session;
        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'cacheService.getCache');
            throw new Error(error);
        }
    }

    static async deleteCache(id) {
        try {
            if (id) {
                await cacheModel.deleteCache(id);
            }
        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'cacheService.deleteCache');
            throw new Error(error);
        }
    }
}

module.exports = CacheService;