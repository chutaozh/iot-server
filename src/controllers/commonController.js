const { responseErrorHandler } = require('../utils/common');
const cacheService = require('../services/cacheService');
const addressService = require('../services/addressService');

const getCaptcha = async (req, res) => {
    try {
        const result = await cacheService.getCaptcha(req.query.sessionId);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const getProvinceList = async (req, res) => {
    try {
        const result = await addressService.getProvinceList();
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getCityList = async (req, res) => {
    try {
        const result = await addressService.getCityList(req.query.provinceId);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getAreaList = async (req, res) => {
    try {
        const result = await addressService.getAreaList(req.query.cityId);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getStreetList = async (req, res) => {
    try {
        const result = await addressService.getStreetList(req.query.areaId);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

module.exports = { 
    getCaptcha,
    getProvinceList,
    getCityList,
    getAreaList,
    getStreetList
 };