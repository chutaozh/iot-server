const { verifyToken } = require('../utils/tokenHandler');
const cacheService = require('../services/cacheService');

// 免验证接口白名单
const whiteList = ['/api/common/captcha', '/api/user/login'];

const requestHandler = async (req, res, next) => {
    let path = req.path;

    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
    }
    req.clientInfo = {};
    req.clientInfo.ua = req.headers['user-agent'];
    req.clientInfo.domain = req.headers['host'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (ip.startsWith('::ffff:')) {
        req.clientInfo.ip = ip.replace('::ffff:', '');
    }

    if (whiteList.includes(path)) {
        return next();
    }

    const authorization = req.headers['authorization'] || req.headers['Authorization'];
    const token = authorization?.split(' ')[1];

    if (!token) {
        return res.status(200).json({
            code: 401,
            success: false,
            message: '未登录',
            data: null,
        });
    }

    try {
        const data = verifyToken(token);
        const expCallback = (code = 401, message = '登录过期，请重新登录') => {
            return res.status(200).json({
                code: code,
                success: false,
                message,
                data: null,
            })
        };

        if (typeof data === 'object') {
            const cache = await cacheService.getCache(data?.userId);

            const now = new Date().getTime() / 1000;

            if (now > data.exp || !cache) {
                return expCallback();
            }
            
            if (token !== cache?.content) {
                return expCallback(403, '账号异地登陆');
            }

            req.loginInfo = { ...data };
        }
    } catch (error) {
        return expCallback();
    }

    next();
};

module.exports = requestHandler;