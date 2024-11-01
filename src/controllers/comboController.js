const { responseErrorHandler } = require('../utils/common');
const comboService = require('../services/comboService');

const addCombo = async (req, res) => {
    try {
        const result = await comboService.addCombo(req.body, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
};

const updateCombo = async (req, res) => {
    try {
        const result = await comboService.updateComboById(req.body, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}

const updateComboStatus = async (req, res) => {
    try {
        const result = await comboService.updateComboStatusByIds(req.body, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}

const deleteCombos = async (req, res) => {
    try {
        const result = await comboService.deleteComboByIds(req.body, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}

const copyComboById = async (req, res) => {
    try {
        const result = await comboService.copyComboById(req.body, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}

const getComboById = async (req, res) => {
    try {
        const result = await comboService.getComboById(req.query.id, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}

const getComboList = async (req, res) => {
    try {
        const result = await comboService.getComboList(req.body, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}

const getAllComboList = async (req, res) => {
    try {
        const result = await comboService.getAllComboList(req.query.keyword, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}

module.exports = {
    addCombo,
    updateCombo,
    updateComboStatus,
    deleteCombos,
    copyComboById,
    getComboById,
    getComboList,
    getAllComboList
}