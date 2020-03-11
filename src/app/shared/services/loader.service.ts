import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    constructor(private spinner: NgxSpinnerService) {
    }

    show() {
        this.spinner.show(undefined, {
            type: 'ball-beat',
            size: 'default',
            bdColor: 'rgba(51,51,51,0.37)',
            color: '#fff',
            fullScreen: true
        });
    }

    hide() {
        this.spinner.hide(undefined);
    }
}

