const { LogType, ComboTypeMap, ComboStatusMap } = require('../utils/constant');
const { dataFieldToSnakeCase, dataFieldToCamelCase, camelCaseToSnakeCase, snakeCaseToCamelCase } = require('../utils/common');
const logModel = require('../models/logModel');
const comboModel = require('../models/comboModel');

class ComboService {
    /** 添加套餐 */
    static async addCombo(combo, loginInfo) {
        try {
            const result = { code: 400, message: '' };
            const count = await comboModel.getCurrentDateCount();
            const comboNo = `TC${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}${String(count + 1).padStart(4, '0')}`;
            const res = await comboModel.addCombo({ ...combo, comboNo }, loginInfo);

            if (res.affectedRows === 1) {
                result.code = 200;
                result.message = '添加成功';
                result.data = res.insertId;
                logModel.add(LogType.OPERATION, `添加套餐：${comboNo}|${combo.comboName}`, '', loginInfo?.userId);
            } else {
                result.message = '添加失败';
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'comboService.addCombo', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 修改套餐 */
    static async updateComboById(combo, loginInfo) {
        try {
            const result = { code: 400, message: '' };
            const { id, ...restProps } = combo;
            const res = await comboModel.updateComboById(id, dataFieldToSnakeCase(restProps), loginInfo);

            if (res.affectedRows === 1) {
                result.code = 200;
                result.message = '修改成功';
                comboModel.getComboById(id).then((info) => {
                    const paramKeys = Object.keys(restProps);
                    const updatedInfo = [info.combo_no].concat(Object.keys(info)
                        .filter(key => paramKeys.includes(snakeCaseToCamelCase(key)))
                        .map(key => {
                            if (key === 'combo_type') {
                                return ComboTypeMap[restProps[snakeCaseToCamelCase(key)]];
                            }
                            return restProps[snakeCaseToCamelCase(key)];
                        }));
                    logModel.add(LogType.OPERATION, `修改套餐：${updatedInfo.join('|')}`, '', loginInfo?.userId);
                });
            } else {
                result.message = '修改失败';
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'comboService.updateComboById', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 上下架 */
    static async updateComboStatusByIds({ ids, status }, loginInfo) {
        try {
            const result = { code: 400, message: '操作失败' };

            if (ids?.length === 0 || ![1, 2].includes(parseInt(status))) {
                return result;
            }

            const res = await comboModel.updateComboStatusByIds(ids, status, loginInfo);

            if (res.result.affectedRows === ids?.length) {
                result.code = 200;
                result.message = '操作成功';
                logModel.add(LogType.OPERATION, `${ComboStatusMap[status]}套餐：${res.combos.map(item => `${item.combo_no}|${item.combo_name}`)}`, '', loginInfo?.userId);
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'comboService.updateComboStatusByIds', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 复制套餐 */
    static async copyComboById({ id }, loginInfo) {
        try {
            const result = { code: 400, message: '复制失败' };
            const combo = await comboModel.getComboById(id);

            if (combo) {
                const count = await comboModel.getCurrentDateCount();
                const comboNo = `TC${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}${String(count + 1).padStart(4, '0')}`;
                const res = await comboModel.addCombo({ ...dataFieldToCamelCase(combo), comboNo }, loginInfo);

                if (res.affectedRows === 1) {
                    result.code = 200;
                    result.message = '复制成功';
                    result.data = res.insertId;
                    logModel.add(LogType.OPERATION, `复制套餐：${comboNo}|${combo.combo_name}`, '', loginInfo?.userId);
                }
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'comboService.copyComboById', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 删除套餐 */
    static async deleteComboByIds({ ids }, loginInfo) {
        try {
            const result = { code: 400, message: '删除失败' };

            if (ids?.length > 0) {
                const res = await comboModel.deleteCombos(ids, loginInfo);

                if (res.result.affectedRows > 0) {
                    result.code = 200;
                    result.message = '删除成功';
                    logModel.add(LogType.OPERATION, `删除套餐：${res.combos.map(item => `${item.combo_no}|${item.combo_name}`).join('，')}`, '', loginInfo?.userId);
                }
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'comboService.deleteComboByIds', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取套餐 */
    static async getComboById(id, loginInfo) {
        try {
            const result = { code: 400, message: '获取失败', data: null };
            const combo = await comboModel.getComboById(id);

            if (combo) {
                result.code = 200;
                result.message = '获取成功';
                result.data = dataFieldToCamelCase(combo);
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'comboService.getComboById', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取套餐列表 */
    static async getComboList({ comboType, comboName, status, startTime, salesPriceRange, standardTariffRange, endTime, pageNum, pageSize, orderBy = 'create_time', orderType = 'desc' }, loginInfo) {
        try {
            const comboList = comboModel.getComboList({
                pageNum,
                pageSize,
                comboType,
                comboName,
                status,
                startTime,
                endTime,
                salesPriceRange,
                standardTariffRange,
                orderBy: camelCaseToSnakeCase(orderBy),
                orderType: orderType.toLowerCase()
            });
            const comboCount = comboModel.getComboCount({
                comboType,
                comboName,
                status,
                salesPriceRange,
                standardTariffRange,
                startTime,
                endTime,
            });
            const res = await Promise.all([comboList, comboCount]);

            return {
                code: 200,
                message: '获取列表成功',
                data: {
                    total: res[1],
                    pageNum,
                    pageSize,
                    list: res[0].map(dataFieldToCamelCase)
                }
            }
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'comboService.getComboList', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取所有套餐列表 */
    static async getAllComboList(keyword, loginInfo) {
        try {
            const result = await comboModel.getComboListAll({ keyword });
            return {
                code: 200,
                message: '获取所有套餐成功',
                data: result.map(dataFieldToCamelCase)
            };
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'comboService.getAllComboList', loginInfo?.userId);
            throw new Error(error);
        }
    }
}

module.exports = ComboService;