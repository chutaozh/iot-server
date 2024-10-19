const crypto = require('crypto');
const { LogType, CacheType } = require('../utils/constant');
const { dataFieldToSnakeCase, dataFieldToCamelCase, camelCaseToSnakeCase } = require('../utils/common');
const { generateToken, verifyToken } = require('../utils/tokenHandler');
const logModel = require('../models/logModel');
const cacheModel = require('../models/cacheModel');
const roleModel = require('../models/roleModel');
const userModel = require('../models/userModel');

class UserService {
    /** 登录 */
    static async login(body, clientInfo) {
        try {
            const { ip, ua, domain } = clientInfo;
            const { account, password, verifyCode, sessionId } = body;
            const result = { data: null };

            if (!sessionId) {
                result.code = 400;
                result.message = '会话ID缺失（sessionId）';
                return result;
            }

            if (!verifyCode) {
                result.code = 400;
                result.message = '请输入验证码';
                return result;
            }

            const cache = await cacheModel.getCache(sessionId);

            if (!cache) {
                result.code = 400;
                result.message = '验证码失效，请重新获取';
                return result;
            }

            if (cache?.content.toLowerCase() !== verifyCode.toLowerCase()) {
                result.code = 400;
                result.message = '验证码错误';
                return result;
            }

            const user = await userModel.getUserByAccount(account);

            if (user && user.is_del === 0) {
                if (user.status === 0) {
                    result.code = 400;
                    result.message = '该账号已被禁用';
                    return result;
                }

                if (user.password.toLowerCase() !== password.toLowerCase()) {
                    result.code = 400;
                    result.message = '密码错误';
                    return result;
                }

                result.code = 200;
                result.message = '登录成功';
                result.data = generateToken({
                    account: user.account,
                    userId: user.id,
                    userName: user.user_name,
                    ip,
                    ua,
                    domain
                });
                await cacheModel.deleteCache(sessionId); // 删除验证码缓存
                await cacheModel.deleteCache(user.id); // 删除旧token缓存
                await cacheModel.addCache({
                    id: user.id,
                    content: result.data,
                    type: CacheType.TOKEN
                });
                logModel.add(LogType.LOGIN, `登录系统，IP：${ip}`, '', user.id);
            } else {
                result.code = 400;
                result.message = '账号不存在';
                return result;
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'userService.login');
            throw new Error(error);
        }
    }

    /** 刷新token */
    static async refreshToken(req) {
        try {
            const authorization = req.headers['authorization'] || req.headers['Authorization'];
            const token = authorization?.split(' ')[1];
            const data = verifyToken(token);
            const clientInfo = req.clientInfo;
            const now = (new Date().getTime() / 1000);
            const exp = (data?.exp) || 0 - (30 * 60);
            const result = { code: 200, data: token, message: '刷新成功' };

            if (data?.ip === clientInfo?.ip && data?.ua === clientInfo?.ua && data?.domain === clientInfo?.domain && now > exp) {
                const newToken = generateToken({
                    ip: clientInfo?.ip,
                    ua: clientInfo?.ua,
                    domain: clientInfo?.domain,
                    userId: data?.userId,
                    userName: data?.userName,
                    account: data?.account,
                });
                await cacheModel.deleteCache(data?.userId);
                await cacheModel.addCache({ id: data?.userId, content: newToken, type: CacheType.TOKEN });
                result.data = newToken;
                return result;
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'userService.refreshToken', req.loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 添加账号 */
    static async addUser({ account, userName, roleId }, loginInfo) {
        try {
            const result = { code: 400, messageL: '' };

            if (!account?.trim() || !userName?.trim()) {
                result.message = '账号或用户名不能为空';
                return result;
            }

            if (!roleId) {
                result.message = '必须分配角色';
                return result;
            }

            const user = await userModel.getUserByAccount(account?.trim());

            if (user) {
                result.message = '账号已存在';
                return result;
            }

            const res = await userModel.addUser({
                account: account?.trim(),
                userName: userName?.trim(),
                password: crypto.createHash('md5').update('12345678').digest('hex')
            }, loginInfo);

            if (res.affectedRows === 1) {
                result.code = 200;
                result.message = '添加成功';
                result.data = res.insertId;
                logModel.add(LogType.OPERATION, `添加账号：${account}`, '', loginInfo?.userId);
                await roleModel.addUserRoles({ userId: res.insertId, roleIds: [roleId] });
            } else {
                result.message = '添加失败';
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'userService.addUser', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 修改用户 */
    static async updateUser(data, loginInfo) {
        try {
            const { userId, roleIds, ...restProps } = data;
            if (restProps?.hasOwnProperty('userName') && !restProps?.userName?.trim()) {
                return {
                    code: 400,
                    message: '用户名不能为空'
                };
            }

            let tempCount = 0;
            let updateUserFlag = false;
            const logContent = [];
            const user = await userModel.getUserById(userId);
            const roles = await roleModel.getUserRoles([userId]);

            if (restProps?.hasOwnProperty('userName')) {
                updateUserFlag = true;

                if (user?.user_name !== restProps.userName) {
                    logContent.push(`修改用户名：${user?.user_name} 改为 ${restProps.userName}`);
                }
            }

            if (restProps?.hasOwnProperty('status')) {
                updateUserFlag = true;

                if (user?.status !== restProps.status) {
                    logContent.push(`修改账号状态：${user?.status === 1 ? '启用' : '禁用'} 改为 ${restProps.status === 1 ? '启用' : '禁用'}`);
                }
            }

            if (updateUserFlag) {
                const res = await userModel.updateUserById(userId, dataFieldToSnakeCase(restProps), loginInfo);
                tempCount += res.affectedRows;
            }

            const _roleIds = roles.map(role => role.role_id).sort((a, b) => a - b);
            const changed = roleIds?.sort((a, b) => parseInt(a) - parseInt(b)).toString() !== _roleIds.toString();

            if (roleIds?.length > 0) {
                await roleModel.deleteUserRole(userId);
                const roleRes = await roleModel.addUserRoles({ userId, roleIds });
                tempCount += roleRes.affectedRows;

                if (changed) {
                    const newRoles = await roleModel.getRolesByIds(roleIds);
                    logContent.push(`修改角色：改为 ${newRoles.map(role => role.role_name).join('、')}`);
                }
            }

            const resCount = updateUserFlag ? 1 + (roleIds?.length || 0) : 1;
            
            if (tempCount === resCount) {
                if (logContent.length > 0) {
                    logContent.push(`账号：${user?.account}`);
                    logModel.add(LogType.OPERATION, logContent.join('；'), '', loginInfo?.userId);
                }

                return {
                    code: 200,
                    message: '修改成功'
                };
            }

            return {
                code: 400,
                message: '修改失败'
            }
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'userService.updateUser', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 删除用户 */
    static async deleteUsers({ userIds }, loginInfo) {
        try {
            const res = await userModel.deleteUsers(userIds, loginInfo);

            if (res.result.affectedRows >= 1) {
                logModel.add(LogType.OPERATION, `删除用户：${res.users.map(item => item.account).join('，')}`, '', loginInfo?.userId);
                return {
                    code: 200,
                    message: '删除成功'
                };
            }

            return {
                code: 400,
                message: '删除失败'
            }
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'userService.deleteUsers', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 修改密码 */
    static async updatePassword({ userId, oldPassword, newPassword }) {
        try {
            const result = { code: 400, message: '修改密码失败' };

            if (!oldPassword) {
                result.message = '原密码不能为空';
                return result;
            }

            if (!newPassword) {
                result.message = '新密码不能为空';
                return result;
            }

            const user = await userModel.getUserById(userId);

            if (user?.password.toLowerCase() !== oldPassword.toLowerCase()) {
                result.message = '原密码错误';
                return result;
            }

            const res = await userModel.updatePassword(userId, newPassword.toLowerCase());

            if (res.affectedRows >= 1) {
                result.code = 200;
                result.message = '修改密码成功';
                return result;
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'userService.updatePassword', userId);
            throw new Error(error);
        }
    }

    /** 获取用户信息 */
    static async getUserInfo(userId) {
        try {
            const user = await userModel.getUserById(userId);
            const userRoles = await roleModel.getUserRoles([userId]);
            const roleList = await roleModel.getRolesByIds(userRoles?.map((item) => item.role_id) || []);

            const result = {
                id: user.id,
                status: user.status,
                account: user.account,
                userName: user.user_name,
                roles: roleList?.map(dataFieldToCamelCase) || []
            };

            return {
                code: 200,
                message: '获取成功',
                data: result
            };
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'userService.getUserInfo', userId);
            throw new Error(error);
        }
    }

    /** 获取用户列表 */
    static async getUserList({ roleId, keyword, status, startTime, endTime, pageNum, pageSize, orderBy = 'create_time', orderType = 'desc' } = {}, loginInfo) {
        try {
            const userList = userModel.getUserList({
                pageNum,
                pageSize,
                roleId,
                keyword,
                status,
                startTime,
                endTime,
                orderBy: camelCaseToSnakeCase(orderBy),
                orderType: orderType.toLowerCase()
            });
            const userCount = userModel.getUserCount({ roleId, keyword, status, startTime, endTime });
            const res = await Promise.all([userList, userCount]);
            const roleList = await roleModel.getRolesByUserIds(res[0].map(item => item.id));

            return {
                code: 200,
                message: '获取列表成功',
                data: {
                    total: res[1],
                    pageNum,
                    pageSize,
                    list: res[0].map(item => ({
                        ...dataFieldToCamelCase(item),
                        roles: roleList.filter(role => role.user_id === item.id).map(role => ({
                            id: role.id,
                            roleName: role.role_name
                        }))
                    }))
                }
            };
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'userService.getUserList', loginInfo?.userId);
            throw new Error(error);
        }
    }
}

module.exports = UserService;