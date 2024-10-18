const { responseErrorHandler } = require('../utils/common');
const userService = require('../services/userService');

const login = async (req, res) => {
    try {
        const result = await userService.login(req.body, req.clientInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const refreshToken = async (req, res) => {
    try {
        const result = await userService.refreshToken(req);
        res.sendResponse({
            code: 200,
            data: result,
            message: '刷新成功'
        });
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const addUser = async (req, res) => {
    try {
        const result = await userService.addUser(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const updateUser = async (req, res) => {
    try {
        const result = await userService.updateUser(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const deleteUsers = async (req, res) => {
    try {
        const result = await userService.deleteUsers(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const updatePassword = async (req, res) => {
    try {
        const result = await userService.updatePassword({...req.body, userId: req.loginInfo.userId});
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getUserInfo = async (req, res) => {
    try {
        const result = await userService.getUserInfo(req.loginInfo?.userId);
        res.sendResponse({
            code: 200,
            message: '获取成功',
            data: result
        });
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

module.exports = { 
    login, 
    refreshToken, 
    addUser, 
    updateUser, 
    deleteUsers, 
    updatePassword, 
    getUserInfo
 };