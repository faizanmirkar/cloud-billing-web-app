import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginIndexViewComponent } from './views/login-index-view/login-index-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from 'src/app/shared/modules/app-common.module';


@NgModule({
  declarations: [LoginIndexViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
