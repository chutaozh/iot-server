const { LogType } = require('../utils/constant');
const logModel = require('../models/logModel');
const addressModel = require('../models/addressModel');

class AddressService {
    /** 获取省份列表 */
    static async getProvinceList(loginInfo) {
        try {
            const result = await addressModel.getProvinceList();

            return {
                code: 200,
                message: '获取成功',
                data: result
            };
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'addressService.getProvinceList', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取城市列表 */
    static async getCityList(provinceId, loginInfo) {
        try {
            const result = await addressModel.getCityList(provinceId);

            return {
                code: 200,
                message: '获取成功',
                data: result
            };
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'addressService.getCityList', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取区县列表 */
    static async getAreaList(cityId, loginInfo) {
        try {
            const result = await addressModel.getAreaList(cityId);

            return {
                code: 200,
                message: '获取成功',
                data: result
            }
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'addressService.getAreaList', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取街道列表 */
    static async getStreetList(areaId, loginInfo) {
        try {
            const result = await addressModel.getStreetList(areaId);

            return {
                code: 200,
                message: '获取成功',
                data: result
            };
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'addressService.getStreetList', loginInfo?.userId);
            throw new Error(error);
        }
    }
}

module.exports = AddressService;