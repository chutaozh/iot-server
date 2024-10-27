const { responseErrorHandler } = require('../utils/common');
const clientService = require('../services/clientService');

const addClient = async (req, res) => {
    try {
        const result = await clientService.addClient(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const updateClient = async (req, res) => {
    try {
        const result = await clientService.updateClientById(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const deleteClients = async (req, res) => {
    try {
        const result = await clientService.deleteClientByIds(req.body, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getClientById = async (req, res) => {
    try {
        const result = await clientService.getClientById(req.query.id, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}


const getAllClientList = async (req, res) => {
    try {
        const result = await clientService.getAllClientList(req.query.keyword, req.loginInfo);
        res.sendResponse(result);
    } catch (error) {
        responseErrorHandler(res, error);
    }
}

const getClientList = async (req, res) => {
    try {
        const result = await clientService.getClientList(req.body, req.loginInfo);
        return res.sendResponse(result);
    } catch (error) {
        return responseErrorHandler(res, error);
    }
}

module.exports = {
    addClient,
    updateClient,
    deleteClients,
    getClientById,
    getClientList,
    getAllClientList
}