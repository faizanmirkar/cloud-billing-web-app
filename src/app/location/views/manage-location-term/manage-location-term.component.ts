import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-manage-location-term',
  templateUrl: './manage-location-term.component.html',
  styleUrls: ['./manage-location-term.component.scss']
})
export class ManageLocationTermComponent extends BaseComponent implements OnInit {

  locationId: string = null;
  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private toast: ToastService,
    private loader: LoaderService) {
    super(injector);

    this.form = this.formBuilder.group({
      locationId: this.formBuilder.control('', [Validators.required]),
      quotationTerm: this.formBuilder.control('', [Validators.required]),
      invoiceTerm: this.formBuilder.control('', [Validators.required]),
      orderTerm: this.formBuilder.control('')
    });
  }

  ngOnInit() {
    // get location
    this.locationId = this.config.data;
    this.setValue('locationId',this.locationId);
    // load term
    this.loadTerm();
  }

  private loadTerm() {
    const ref = this.locationService.term(this.locationId).subscribe(result => {
      if (result) {
        this.form.patchValue(result);
      }
    });
  }

  submit() {
    if (this.form.valid) {
      this.loader.show();
      this.locationService.manageTerm(this.form.value).subscribe(result => {
        this.loader.hide();
        this.toast.show(result);
        if (this.isSuccessResult(result)) {
          this.ref.close(result);
        }
      });
    }
  }

}
