import { PermissionService } from './permission.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PermissionResolver implements Resolve<Observable<any>> {

    constructor(private service: PermissionService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const obs = Observable.create((observer: Observer<any>) => {
            this.service.access().subscribe(permission => {
                this.service.setPermission(permission);
                observer.next(permission);
                observer.complete();
            });
        });
        return obs;
    }
}
