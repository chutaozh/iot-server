function  dataFieldToSnakeCase(data) {
    const result = {};

    if (Object.prototype.toString.call(data) === '[object Object]') {
        Object.keys(data).forEach(key => {
            result[camelCaseToSnakeCase(key)] = data[key];
        });
    }

    return result;
}

function dataFieldToCamelCase(data) {
    const result = {};

    if (Object.prototype.toString.call(data) === '[object Object]') {
        Object.keys(data).forEach(key => {
            result[snakeCaseToCamelCase(key)] = data[key];
        });
    }

    return result;
};

function camelCaseToSnakeCase(str) {
    // 匹配小驼峰命名法（包含大写字母的字符串）
    const camelCasePattern = /^[a-z]+[A-Z][a-zA-Z]*$/;

    // 如果匹配小驼峰命名法
    if (camelCasePattern.test(str)) {
        // 使用正则替换：在大写字母前加下划线，并将大写字母转换为小写字母
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    } else {
        // 如果不是小驼峰，保持原样
        return str;
    }
}

function snakeCaseToCamelCase(str) {
    // 匹配下划线命名法（包含下划线的字符串）
    const snakeCasePattern = /^[a-z]+(_[a-z]+)*$/;

    // 如果匹配下划线命名法
    if (snakeCasePattern.test(str)) {
        // 使用正则替换：将下划线后面的字母转换为大写字母
        return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
    }
    // 如果不是下划线命名法，保持原样
    return str;
}

function responseErrorHandler(res, err) {
    res.sendResponse({
        code: 500,
        data: err,
        message: '服务器异常'
    });
}

module.exports = {
    dataFieldToSnakeCase,
    dataFieldToCamelCase,
    responseErrorHandler
}