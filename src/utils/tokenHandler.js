const jwt = require('jsonwebtoken');

// 密钥，通常在环境变量中存储
const secretKey = 'ABCD1234';

// 生成 Token 的函数
const generateToken = ({ domain, ua, ip, account, userId, userName }) => {
    const payload = {
        ua,
        ip,
        userId,
        domain,
        account,
        userName
    };

    const options = {
        expiresIn: '2h', // 过期时间
    };

    return jwt.sign(payload, secretKey, options);
};

// 验证 Token 的函数
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded; // 返回解码后的数据
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {
    generateToken,
    verifyToken
}
