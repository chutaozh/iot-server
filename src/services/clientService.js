const { LogType, ClientTypeMap } = require('../utils/constant');
const { dataFieldToSnakeCase, dataFieldToCamelCase, camelCaseToSnakeCase, snakeCaseToCamelCase } = require('../utils/common');
const logModel = require('../models/logModel');
const clientModel = require('../models/clientModel');

class ClientService {
    /** 添加客户 */
    static async addClient(client, loginInfo) {
        try {
            const result = { code: 400, message: '' };
            const count = await clientModel.getCurrentDateCount();
            const clientNo = `C${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}${String(count + 1).padStart(4, '0')}`;
            const res = await clientModel.addClient({
                ...client,
                clientNo,
                updateId: loginInfo?.userId,
                createId: loginInfo?.userId
            });

            if (res.affectedRows === 1) {
                result.code = 200;
                result.message = '添加成功';
                result.data = res.insertId;
                logModel.add(LogType.OPERATION, `添加客户：${clientNo}|${client.clientName}`, '', loginInfo?.userId);
            } else {
                result.message = '添加失败';
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'clientService.addClient', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 修改客户 */
    static async updateClientById(client, loginInfo) {
        try {
            const result = { code: 400, message: '' };
            const { id, ...restProps } = client;
            const res = await clientModel.updateClient(id, dataFieldToSnakeCase({ ...restProps, updateId: loginInfo?.userId }));

            if (res.affectedRows === 1) {
                result.code = 200;
                result.message = '修改成功';
                clientModel.getClientById(id).then((info) => {
                    const paramKeys = Object.keys(restProps);
                    const updatedInfo = [info.client_no].concat(Object.keys(info)
                        .filter(key => paramKeys.includes(snakeCaseToCamelCase(key)))
                        .map(key => {
                            if (key === 'client_type') {
                                return ClientTypeMap[restProps[snakeCaseToCamelCase(key)]];
                            }
                            if (['contact_province', 'contact_city', 'contact_area', 'contact_street', 'salesman'].includes(key)) {
                                return info[`${key}_name`];
                            }
                            return restProps[snakeCaseToCamelCase(key)];
                        }));
                    logModel.add(LogType.OPERATION, `修改客户：${updatedInfo.join('|')}`, '', loginInfo?.userId);
                });
            } else {
                result.message = '修改失败';
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'clientService.updateClientById', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 删除客户 */
    static async deleteClientByIds({ ids }, loginInfo) {
        try {
            const result = { code: 400, message: '删除失败' };

            if (ids?.length > 0) {
                const res = await clientModel.deleteClients(ids, loginInfo?.userId);

                if (res.result.affectedRows > 0) {
                    result.code = 200;
                    result.message = '删除成功';
                    logModel.add(LogType.OPERATION, `删除客户：${res.clients.map(item => `${item.client_no}|${item.client_name}`).join('，')}`, '', loginInfo?.userId);
                }
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'clientService.deleteClientByIds', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取客户 */
    static async getClientById(id, loginInfo) {
        try {
            const result = { code: 400, message: '获取失败', data: null };
            const client = await clientModel.getClientById(id);

            if (client) {
                result.code = 200;
                result.message = '获取成功';
                result.data = dataFieldToCamelCase(client);
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'clientService.getClientById', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取所有客户列表 */
    static async getAllClientList(keyword, loginInfo) {
        try {
            const result = await clientModel.getAllClientList({ keyword });
            return {
                code: 200,
                message: '获取所有客户成功',
                data: result.map(dataFieldToCamelCase)
            };
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'clientService.getAllClientList', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取客户列表 */
    static async getClientList({ clientType, clientName, contact, contactPhone, startTime, endTime, pageNum, pageSize, orderBy = 'create_time', orderType = 'desc' }, loginInfo) {
        try {
            const clientList = clientModel.getClientList({
                pageNum,
                pageSize,
                clientType,
                clientName,
                contact,
                contactPhone,
                startTime,
                endTime,
                orderBy: camelCaseToSnakeCase(orderBy),
                orderType: orderType.toLowerCase()
            });
            const clientCount = clientModel.getClientCount({
                clientType,
                clientName,
                contact,
                contactPhone,
                startTime,
                endTime,
            });
            const res = await Promise.all([clientList, clientCount]);

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
            logModel.add(LogType.ERROR, error.message, 'clientService.getClientList', loginInfo?.userId);
            throw new Error(error);
        }
    }
}

module.exports = ClientService;