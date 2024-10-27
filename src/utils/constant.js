const LogType = {
    LOGIN: 1, // 登录日志
    OPERATION: 2, // 操作日志
    ERROR: 3, // 错误日志
};

const CacheType = {
    CAPTCHA: 1, // 验证码
    TOKEN: 2, // token
}

const ComboTypeMap = {
    1: '流量包',
    2: '短信包',
}

const ComboStatusMap = {
    1: '上架',
    2: '下架',
}

const ClientTypeMap = {
    1: '个人客户',
    2: '企业客户',
}

module.exports = {
    LogType,
    CacheType,
    ComboTypeMap,
    ComboStatusMap,
    ClientTypeMap
}