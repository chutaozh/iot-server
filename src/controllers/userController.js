const userService = require('../services/userService');

const login = async (req, res) => {
    try {
        const result = await userService.login(req.body, req.clientInfo);
        res.sendResponse(result);
    } catch (error) {
        res.sendResponse({
            code: 500,
            data: null,
            message: '服务器异常'
        });
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
        res.sendResponse({
            code: 500,
            data: null,
            message: '服务器异常'
        });
    }
};

const addUser = async (req, res) => {
    try {
        const result = await userService.addUser(req.body);
        res.sendResponse(result);
    } catch (error) {
        res.sendResponse({
            code: 500,
            data: null,
            message: '服务器异常'
        });
    }
};

module.exports = { login, refreshToken, addUser };