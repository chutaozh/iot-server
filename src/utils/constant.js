const LogType = {
    LOGIN: 1, // 登录日志
    OPERATION: 2, // 操作日志
    ERROR: 3, // 错误日志
};

const CacheType = {
    CAPTCHA: 1, // 验证码
    TOKEN: 2, // token
}

module.exports = {
    LogType,
    CacheType
}