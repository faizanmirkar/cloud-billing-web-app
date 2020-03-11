import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { AccountLayoutComponent } from './layout/account-layout/account-layout.component';
import { MasterTypes } from './master/models/master-model';
import { PermissionResolver } from './user/services/permission.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'account'
  },
  {
    path: 'account',
    component: AccountLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        loadChildren: () => import('./account/login/login.module').then(m => m.LoginModule)
      }
    ]
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    resolve: {
      access: PermissionResolver
    },
    children: [
      {
        path: 'manage',
        children: [
          {
            path: 'location',
            loadChildren: () => import('./location/location.module').then(m => m.LocationModule)
          },
          {
            path: 'category',
            loadChildren: () => import('./master/master.module').then(m => m.MasterModule),
            data: { typeId: MasterTypes.Category, title: 'Category List' }
          },
          {
            path: 'sub-category/:parentId',
            loadChildren: () => import('./master/master.module').then(m => m.MasterModule),
            data: { typeId: MasterTypes.SubCategory, title: 'Sub category List' }
          },
          {
            path: 'unit',
            loadChildren: () => import('./master/master.module').then(m => m.MasterModule),
            data: { typeId: MasterTypes.Unit, title: 'Unit List' }
          },
          {
            path: 'tax',
            loadChildren: () => import('./tax/tax.module').then(m => m.TaxModule)
          },
          {
            path: 'account',
            loadChildren: () => import('./user/user.module').then(m => m.UserModule)
          },
          {
            path: 'setting',
            loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)
          },
          {
            path: 'fy',
            loadChildren: () => import('./financial-year/financial-year.module').then(m => m.FinancialYearModule)
          }
        ]
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'quotation',
        loadChildren: () => import('./quotation/quotation.module').then(m => m.QuotationModule)
      },
      {
        path: 'order',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
