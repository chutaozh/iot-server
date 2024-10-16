const crypto = require('crypto');
const { LogType, CacheType } = require('../utils/constant');
const { dataFieldToSnakeCase } = require('../utils/common');
const { generateToken, verifyToken } = require('../utils/tokenHandler');
const logService = require('./logService');
const cacheService = require('./cacheService');
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

            const cache = await cacheService.getCache(sessionId);

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
                await cacheService.deleteCache(sessionId); // 删除验证码缓存
                await cacheService.deleteCache(user.id); // 删除旧token缓存
                await cacheService.addCache({
                    id: user.id,
                    content: result.data,
                    type: CacheType.TOKEN
                });
                logService.add(LogType.LOGIN, `登录系统，IP：${ip}`, '', user.id);
            } else {
                result.code = 400;
                result.message = '账号不存在';
                return result;
            }

            return result;
        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'userService.login');
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

            if (data?.ip === clientInfo?.ip && data?.ua === clientInfo?.ua && data?.domain === clientInfo?.domain && now > exp) {
                const newToken = generateToken({
                    ip: clientInfo?.ip,
                    ua: clientInfo?.ua,
                    domain: clientInfo?.domain,
                    userId: data?.userId,
                    userName: data?.userName,
                    account: data?.account,
                });
                await cacheService.deleteCache(data?.userId);
                await cacheService.addCache({ id: data?.userId, content: newToken, type: CacheType.TOKEN });
                return newToken;
            }

            return token;

        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'userService.refreshToken', req.loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 添加账号 */
    static async addUser({ account, userName }, loginInfo) {
        try {
            const result = { code: 400, messageL: '' };

            if (!account?.trim() || !userName?.trim()) {
                result.message = '账号或用户名不能为空';
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
                logService.add(LogType.OPERATION, `添加账号：${account}`, '', loginInfo?.userId);
            } else {
                result.message = '添加失败';
            }

            return result;
        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'userService.addUser', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 修改用户 */
    static async updateUser(data, loginInfo) {
        try {
            const { userId, ...restProps } = data;
            if (restProps?.hasOwnProperty('userName') && !restProps?.userName?.trim()) {
                return {
                    code: 400,
                    message: '用户名不能为空'
                };
            }

            const user = await userModel.getUserById(userId);
            const res = await userModel.updateUserById(userId, dataFieldToSnakeCase(restProps), loginInfo);

            if (res.affectedRows === 1) {
                const logContent = [];

                if (restProps?.hasOwnProperty('userName') && user?.user_name !== restProps.userName) {
                    logContent.push(`修改用户名：${user?.user_name} 改为 ${restProps.userName}`);
                }

                if (restProps?.hasOwnProperty('status') && user?.status !== restProps.status) {
                    logContent.push(`修改账号状态：${user?.status === 1 ? '启用' : '禁用'} 改为 ${restProps.status === 1 ? '启用' : '禁用'}`);
                }

                if(logContent.length > 0){
                    logContent.push(`账号：${user?.account}`);
                    logService.add(LogType.OPERATION, logContent.join('；'), '', loginInfo?.userId);
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
            logService.add(LogType.ERROR, error.message, 'userService.updateUser', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 删除用户 */
    static async deleteUsers({ userIds }, loginInfo) {
        try {
            const res = await userModel.deleteUsers(userIds, loginInfo);

            if (res.result.affectedRows >= 1) {
                logService.add(LogType.OPERATION, `删除用户：${res.users.map(item => item.account).join('，')}`, '', loginInfo?.userId);
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
            logService.add(LogType.ERROR, error.message, 'userService.deleteUsers', loginInfo?.userId);
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
            logService.add(LogType.ERROR, error.message, 'userService.updatePassword', userId);
            throw new Error(error);
        }
    }
}

module.exports = UserService;