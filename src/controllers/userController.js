const { responseErrorHandler } = require('../utils/common');
const userService = require('../services/userService');
const cacheService = require('../services/cacheService');

const login = async (req, res) => {
    try {
        const result = await userService.login(req.body, req.clientInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const logout = async (req, res) => {
    try {
        const result = await cacheService.deleteCache(req.loginInfo?.userId);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
};

const refreshToken = async (req, res) => {
    try {
        const result = await userService.refreshToken(req);
        res.sendResponse(result);
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
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getUserList = async (req, res) => {
    try {
        const result = await userService.getUserList(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

module.exports = { 
    login, 
    logout,
    refreshToken, 
    addUser, 
    updateUser, 
    deleteUsers, 
    updatePassword, 
    getUserInfo,
    getUserList
 };