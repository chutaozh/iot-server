const { LogType } = require('../utils/constant');
const { dataFieldToSnakeCase } = require('../utils/common');
const logService = require('./logService');
const roleModel = require('../models/roleModel');

class RoleService {
    /** 添加角色 */
    static async addRole({ roleName, remark }, loginInfo) {
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

            const res = await roleModel.addRole({ roleName: roleName?.trim(), remark: remark || '' }, loginInfo);

            if (res.affectedRows === 1) {
                result.code = 200;
                result.message = '添加成功';
                result.data = res.insertId;
                logService.add(LogType.OPERATION, `添加角色：${roleName?.trim()}`, '', loginInfo?.userId);
            } else {
                result.message = '添加失败';
            }

            return result;
        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'roleService.addRole', loginInfo?.userId);
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
                    logService.add(LogType.OPERATION, `修改角色名：${role?.role_name} 改为 ${restProps.roleName}`, '', loginInfo?.userId);
                }

                return {
                    code: 200,
                    message: '修改成功'
                };
            }

            return result;
        } catch (error) {
            logService.add(LogType.ERROR, error.message, 'roleService.updateRole', loginInfo?.userId);
            throw new Error(error);
        }
    }

    /** 删除角色 */
    static async deleteRoles({ roleIds }, loginInfo) {
        try {
            const res = await roleModel.deleteRoles(roleIds, loginInfo);

            if (res.result.affectedRows >= 1) {
                logService.add(LogType.OPERATION, `删除角色：${res.roles.map(item => item.role_name).join('，')}`, '', loginInfo?.userId);
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
            logService.add(LogType.ERROR, error.message, 'roleService.deleteRoles', loginInfo?.userId);
            throw new Error(error);
        }
    }
}

module.exports = RoleService;