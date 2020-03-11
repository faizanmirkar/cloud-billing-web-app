import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { UserInfo } from '../../../models/account.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-index-view',
  templateUrl: './login-index-view.component.html',
  styleUrls: ['./login-index-view.component.scss']
})
export class LoginIndexViewComponent extends BaseComponent implements OnInit {

  constructor(
    private injector: Injector,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private loader: LoaderService,
    private router: Router,
    private accountService: AccountService) {
    super(injector);
    // init form
    this.form = this.formBuilder.group({
      userName: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  login() {
    if (this.form.valid) {
      this.loader.show();
      this.accountService.login(this.form.value).subscribe(result => {
        this.loader.hide();
        this.toast.show(result);
        if (this.isSuccessResult(result)) {
          // set data
          this.accountService.setUser(result.data as UserInfo);
          this.router.navigateByUrl('/app');
        }
      });
    }
  }

}
