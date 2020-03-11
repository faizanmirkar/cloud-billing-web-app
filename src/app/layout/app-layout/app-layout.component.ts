import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { AccountService } from 'src/app/account/services/account.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/api';
import { ChangePasswordComponent } from 'src/app/shared/views/change-password/change-password.component';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent extends BaseComponent implements OnInit {
  showHideSidebar = true;
  userName: string;
  locationName: string;
  constructor(
    private injector: Injector,
    private accountService: AccountService,
    private router: Router,
    private dialog: DialogService) {
    super(injector);
  }

  ngOnInit() {
    const userInfo = this.currentUser;
    if (userInfo) {
      this.userName = `${userInfo.name} (${userInfo.roleName})`;
      this.locationName = userInfo.locationName;
    }
  }

  signout() {
    this.accountService.clearUser();
    this.router.navigateByUrl('/account/login');
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      header: 'Change Password',
      width: '30%'
    });
    dialogRef.onClose.subscribe(value => {
      if (value) {
        this.signout();
      }
    });
  }

}
