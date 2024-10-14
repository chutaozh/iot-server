const crypto = require('crypto');
const { LogType, CacheType } = require('../utils/constant');
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
                result.message = '验证码已过期';
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

                cacheService.deleteCache(sessionId);
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
                await cacheService.deleteCache(user.id);
                await cacheService.addCache({
                    id: user.id,
                    content: result.data,
                    type: CacheType.TOKEN
                });
                logService.add({ type: LogType.LOGIN, content: `${user.user_name}于 ${new Date().toLocaleString()} 登录系统，IP：${ip}`, source: '' });
            } else {
                result.code = 400;
                result.message = '账号不存在';
                return result;
            }

            return result;
        } catch (error) {
            logService.add({ type: LogType.ERROR, content: error.message, source: 'userService.login' });
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
            logService.add({ type: LogType.ERROR, content: error.message, source: 'userService.refreshToken' });
            throw new Error(error);
        }
    }

    /** 添加账号 */
    static async addUser({ account, userName }) {
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
            });

            if (res.affectedRows === 1) {
                result.code = 200;
                result.message = '添加成功';
                result.data = res.insertId;
            } else {
                result.message = '添加失败';
            }

            return result;
        } catch (error) {
            logService.add({ type: LogType.ERROR, content: error.message, source: 'userService.addUser' });
            throw new Error(error);
        }
    }
}

module.exports = UserService;