import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/account/services/account.service';

@Injectable()
export class ErrorHttpInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private toast: ToastService,
        private loader: LoaderService,
        private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    // hide if any loader
                    this.loader.hide();
                    const toastMsg = 'Error in processing request';
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                        // show toast
                        this.toast.error(toastMsg);
                    } else {
                        // server-side error
                        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                        if (error.status === 401) {
                            // unauthorize
                            this.accountService.clearUser();
                            this.router.navigateByUrl('/account/login');
                        } else {
                            // show toast
                            this.toast.error(toastMsg);
                        }
                    }

                    // throw
                    return throwError(errorMessage);
                })
            );
    }
}
