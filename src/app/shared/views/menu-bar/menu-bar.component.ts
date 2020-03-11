import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { MenuModel } from './menu.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { PermissionService } from 'src/app/user/services/permission.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent extends BaseComponent implements OnInit, OnDestroy {

  menus: MenuModel[] = [];
  constructor(
    private injector: Injector,
    private permissionService: PermissionService) {
    super(injector);
  }

  ngOnInit() {
    const ref = this.permissionService.getMenu().subscribe(values => {
      this.menus = values;
    });
    this.subscription.add(ref);
  }

  toggle(item: MenuModel) {
    this.menus.forEach(menu => {
      if (menu.name !== item.name) {
        menu.opened = false;
      }
    });
    item.opened = !item.opened;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
