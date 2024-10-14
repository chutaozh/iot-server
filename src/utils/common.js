/** 字段转换 */
function dataFieldTransformer(data) {
    const result = {};

    if(Object.prototype.toString.call(data) === '[object Object]') {
        Object.keys(data).forEach(key => {
            const keyArr = key.split('_');
            const newKey = keyArr.map((item, index) => {
                return index === 0 ? item : item.charAt(0).toUpperCase() + item.slice(1);
            });

            result[newKey.join('')] = data[key];
        });
    }

    return result;
};

module.exports = {
    dataFieldTransformer
}