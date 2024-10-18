const sharp = require('sharp');

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

/**
 * svg 转换为 base64
 * @param {*} svg svg 字符串
 * @returns base64 编码的图片
 */
const svgToBase64 = async (svg) => {
    try {
      // 使用 sharp 处理 SVG 字符串并转换为 PNG
      const buffer = await sharp(Buffer.from(svg))
        .png() // 你可以选择其他格式，例如 .jpeg(), .webp() 等
        .toBuffer();
  
      // 转换为 Base64 编码
      const base64Image = buffer.toString('base64');
      const base64String = `data:image/png;base64,${base64Image}`; // 添加数据类型前缀
      
      return base64String;
    } catch (error) {
      throw new Error(error);
    }
  };

module.exports = {
    svgToBase64,
    dataFieldToSnakeCase,
    dataFieldToCamelCase,
    responseErrorHandler,
    camelCaseToSnakeCase,
    snakeCaseToCamelCase,
}