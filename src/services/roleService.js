const { LogType } = require('../utils/constant');
const { dataFieldToSnakeCase, dataFieldToCamelCase, camelCaseToSnakeCase } = require('../utils/common');
const logModel = require('../models/logModel');
const roleModel = require('../models/roleModel');

class RoleService {
    /** 添加角色 */
    static async addRole({ roleType, roleName, remark }, loginInfo) {
        try {
            const result = { code: 400, message: '', data: null };

            if (!roleName?.trim()) {
                result.message = '角色名称不能为空';
                return result;
            }

            const isExist = await roleModel.isExistRoleName({ roleName: roleName?.trim() });

            if (isExist) {
                result.message = '角色名称已存在';
                return result;
            }

            const res = await roleModel.addRole({ roleType, roleName: roleName?.trim(), remark: remark || '' }, loginInfo);

            if (res.affectedRows === 1) {
                result.code = 200;
                result.message = '添加成功';
                result.data = res.insertId;
                logModel.add(LogType.OPERATION, `添加角色：${roleName?.trim()}`, '', loginInfo?.userId);
            } else {
                result.message = '添加失败';
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'roleService.addRole', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 修改角色 */
    static async updateRole(data, loginInfo) {
        try {
            const result = { code: 400, message: '修改失败' };
            const { roleId, ...restProps } = data;

            if (restProps?.hasOwnProperty('roleName') && !restProps?.roleName?.trim()) {
                result.message = '角色名不能为空';
                return result;
            }

            const isExist = await roleModel.isExistRoleName({ roleId, roleName: restProps?.roleName?.trim() });

            if (isExist) {
                result.message = '角色名称已存在';
                return result;
            }

            const role = await roleModel.getRoleById(roleId);
            const res = await roleModel.updateRoleById(roleId, dataFieldToSnakeCase(restProps), loginInfo);

            if (res.affectedRows === 1) {
                if (restProps?.hasOwnProperty('roleName') && role?.role_name !== restProps.roleName) {
                    logModel.add(LogType.OPERATION, `修改角色名：${role?.role_name} 改为 ${restProps.roleName}`, '', loginInfo?.userId);
                }

                return {
                    code: 200,
                    message: '修改成功'
                };
            }

            return result;
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'roleService.updateRole', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 删除角色 */
    static async deleteRoles({ roleIds }, loginInfo) {
        try {
            const res = await roleModel.deleteRoles(roleIds, loginInfo);

            if (res.result.affectedRows >= 1) {
                logModel.add(LogType.OPERATION, `删除角色：${res.roles.map(item => item.role_name).join('，')}`, '', loginInfo?.userId);
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
            logModel.add(LogType.ERROR, error.message, 'roleService.deleteRoles', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 添加用户角色 */
    static async addUserRoles({ userId, roleIds }, loginInfo) {
        try {
            roleModel.deleteUserRole(userId); // 删除用户所有角色
            const res = await roleModel.addUserRoles({ userId, roleIds });

            if (res.result.affectedRows >= 1) {
                return {
                    code: 200,
                    message: '添加成功'
                };
            }

            return {
                code: 400,
                message: '添加失败'
            }
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'roleService.addUserRoles', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 删除角色用户 */
    static async deleteUserRole(userId, loginInfo) {
        try {
            const res = await roleModel.deleteUserRole(userId);

            if (res.result.affectedRows >= 1) {
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
            logModel.add(LogType.ERROR, error.message, 'roleService.deleteUserRole', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取角色列表 */
    static async getRoleList({ roleType, keyword, pageNum, pageSize, orderBy = 'createTime', orderType = 'desc' } = {}, loginInfo) {
        try {
            const result = await roleModel.getRoleList({
                pageNum,
                pageSize,
                roleType,
                keyword,
                orderBy: camelCaseToSnakeCase(orderBy),
                orderType: orderType.toLowerCase()
            });
            const total = await roleModel.getRoleCount({roleType, keyword});
            return {
                code: 200,
                message: '获取列表成功',
                data: {
                    total,
                    pageNum,
                    pageSize,
                    list: result.map(dataFieldToCamelCase)
                }
            }
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'roleService.getRoleList', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 获取所有角色 */
    static async getRoleListAll() {
        try {
            const result = await roleModel.getRoleListAll();
            return {
                code: 200,
                message: '获取所有角色成功',
                data: result.map(dataFieldToCamelCase)
            };
        } catch (error) {
            logModel.add(LogType.ERROR, error.message, 'roleService.getRoleListAll');
            throw new Error(error);
        }
    }
}

module.exports = RoleService;