import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injectable, ErrorHandler, Inject, InjectionToken } from '@angular/core';
import 'hammerjs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import * as Rollbar from 'rollbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { AccountLayoutComponent } from './layout/account-layout/account-layout.component';
import { MenuBarComponent } from './shared/views/menu-bar/menu-bar.component';
import { PrimeNgModule } from './shared/modules/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenHttpInterceptor } from './shared/interceptors/token-http-interceptor';
import { ErrorHttpInterceptor } from './shared/interceptors/error-http-interceptor';
import { ToggleDirective } from './shared/directives/toggle.directive';
import { ChangePasswordComponent } from './shared/views/change-password/change-password.component';
import { DialogService, ConfirmationService, MessageService } from 'primeng/api';

const rollbarConfig = {
  accessToken: '92ba6054a5bb44489ececb9b198e5dfb',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');
@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) { }

  handleError(err: any): void {
    this.rollbar.error(err.originalError || err);
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}



@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AccountLayoutComponent,
    MenuBarComponent,
    ToggleDirective,
    ChangePasswordComponent
  ],
  entryComponents: [
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PrimeNgModule,
    NgxSpinnerModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

/*
    {
      provide: ErrorHandler,
      useClass: RollbarErrorHandler
    },
    {
      provide: RollbarService,
      useFactory: rollbarFactory
    }
*/