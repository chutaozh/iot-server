const { verifyToken } = require('../utils/tokenHandler');

// 免验证接口白名单
const whiteList = ['/api/common/captcha'];

const requestHandler = (req, res, next) => {
    let path = req.path;
    
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
    }

    if (whiteList.includes(path)) {
        return next();
    }

    const authorization = req.headers['authorization'] || req.headers['Authorization'];
    const token = authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            code: 401,
            success: false,
            message: '未登录',
            data: null,
        });
    }

    try {
        const data = verifyToken(token);

        if (typeof data === 'object') {
            req.user = {
                id: data.id,
                userName: data.userName,
                account: data.account,
            };
        }
    } catch (error) {
        return res.status(403).json({
            code: 403,
            success: false,
            message: '登录过期，请重新登录',
            data: null,
        });
    }

    next();
};

module.exports = requestHandler;