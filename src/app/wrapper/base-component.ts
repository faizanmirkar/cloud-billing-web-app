import { IResult, IResultStatus } from '../shared/models/result';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { UserInfo } from '../account/models/account.model';
import { PermissionFlags } from '../user/models/user';
import { Injector } from '@angular/core';
import { PermissionService } from '../user/services/permission.service';

export abstract class BaseComponent {
    protected blankGuid = '00000000-0000-0000-0000-000000000000';
    public form: FormGroup;
    protected subscription: Subscription = new Subscription();
    public permission = PermissionFlags;
    private permissionBaseService: PermissionService;
    private userInfo: UserInfo = null;

    constructor(private injectorBase: Injector) {

        // create object
        this.permissionBaseService = this.injectorBase.get(PermissionService);
    }

    isSuccessResult(result: IResult) {
        return Number(result.status) === IResultStatus.Success ? true : false;
    }

    getValue(controlName: string) {
        return this.form.controls[controlName].value;
    }

    setValue(controlName: string, value: any) {
        this.form.controls[controlName].setValue(value);
    }

    get currentUser(): UserInfo {
        if (!this.userInfo) {
            const item = JSON.parse(localStorage.getItem('userInfo'));
            if (item != null) {
                this.userInfo = item as UserInfo;
            }
        }

        return this.userInfo;
    }

    public hasPermission(permission: PermissionFlags) {
        return this.permissionBaseService.hasPermission(permission);
    }
}
