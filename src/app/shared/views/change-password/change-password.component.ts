import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { AccountService } from 'src/app/account/services/account.service';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { LoaderService } from '../../services/loader.service';
import { DynamicDialogRef } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends BaseComponent implements OnInit, OnDestroy {


  constructor(
    private injector: Injector,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private loader: LoaderService,
    private dialogRef: DynamicDialogRef,
    private accountService: AccountService) {
    super(injector);
    // init form
    this.form = this.formBuilder.group({
      oldPwd: this.formBuilder.control('', [Validators.required]),
      newPwd: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      confirmPwd: this.formBuilder.control('', [Validators.required, Validators.minLength(6)])
    }, { validators: this.checkPasswords });
  }

  ngOnInit() {
  }

  checkPasswords(group: FormGroup) {
    const newPwd = group.get('newPwd').value;
    const confirmPwd = group.get('confirmPwd').value;
    return newPwd === confirmPwd ? null : { 'password-not-match': false };
  }

  submit() {
    if (this.form.valid) {
      this.loader.show();
      const ref = this.accountService.changePassword({
        newPassword: this.getValue('confirmPwd'),
        oldPassword: this.getValue('oldPwd')
      }).subscribe(result => {
        this.loader.hide();
        this.toast.show(result);
        if (this.isSuccessResult(result)) {
          this.dialogRef.close(true);
        }
      });
      this.subscription.add(ref);
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
