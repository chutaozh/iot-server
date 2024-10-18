const { responseErrorHandler } = require('../utils/common');
const roleService = require('../services/roleService');

const addRole = async (req, res) => {
    try {
        const result = await roleService.addRole(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const updateRole = async (req, res) => {
    try {
        const result = await roleService.updateRole(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const deleteRoles = async (req, res) => {
    try {
        const result = await roleService.deleteRoles(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getRoleList = async (req, res) => {
    try {
        const result = await roleService.getRoleList(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getRoleListAll = async (req, res) => {
    try {
        const result = await roleService.getRoleListAll();
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

module.exports = {
    addRole,
    updateRole,
    deleteRoles,
    getRoleList,
    getRoleListAll
}