export class UserManageModel {
    userId: string;
    name: string;
    userName: string;
    email: string;
    roleId: string;
    locationId: string;
    pwd: string;
    phoneNo: string;
}

export class UserViewModel extends UserManageModel {

}

export class RoleManageModel {
    roleId: string;
    name: string;
    permissionIds: string[];
}

export class RoleViewModel extends RoleManageModel {
    permissions: string;
}

export class PermissionModuleModel {
    id: string;
    name: string;
    status: boolean;
}

export class PermissionModel {
    key: string;
    value: boolean;
}

export enum PermissionFlags {
    can_view_customer = 'can_view_customer',
    can_manage_customer = 'can_manage_customer',
    can_view_item = 'can_view_item',
    can_manage_item = 'can_manage_item',
    can_view_quotation = 'can_view_quotation',
    can_manage_quotation = 'can_manage_quotation',
    can_view_order = 'can_view_order',
    can_manage_order = 'can_manage_order',
    can_view_supplier = 'can_view_supplier',
    can_manage_supplier = 'can_manage_supplier',
    can_view_master = 'can_view_master',
    can_manage_master = 'can_manage_master',
    can_view_tax = 'can_view_tax',
    can_manage_tax = 'can_manage_tax',
    can_view_location = 'can_view_location',
    can_manage_location = 'can_manage_location',
    can_view_user = 'can_view_user',
    can_manage_user = 'can_manage_user',
    can_manage_fy = 'can_manage_fy',
    can_manage_setting = 'can_manage_setting'
}