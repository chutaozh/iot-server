const sharp = require('sharp');

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

module.exports = svgToBase64;
