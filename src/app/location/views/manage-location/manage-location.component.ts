import { Component, OnInit, Injector } from '@angular/core';
import { LocationModel } from '../../models/location';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BaseComponent } from 'src/app/wrapper/base-component';

@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.scss']
})
export class ManageLocationComponent extends BaseComponent implements OnInit {

  model: LocationModel = null;
  constructor(
    private injector: Injector,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private toastService: ToastService,
    private loader: LoaderService) {
    super(injector);

    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      code: this.formBuilder.control('', [Validators.required]),
      address: this.formBuilder.control(''),
      bankDetails: this.formBuilder.control(''),
      logo: this.formBuilder.control(''),
      allowNegativeStock: this.formBuilder.control(false),
      vatNo: this.formBuilder.control('')
    });
  }

  ngOnInit() {
    if (this.config.data) {
      this.model = this.config.data.model as LocationModel;
      if (this.model) {
        this.form.patchValue({ name: this.model.name });
        this.form.patchValue({ code: this.model.code });
        this.form.patchValue({ address: this.model.address });
        this.form.patchValue({ bankDetails: this.model.bankDetails });
        this.form.patchValue({ logo: this.model.logo });
        this.form.patchValue({ allowNegativeStock: this.model.allowNegativeStock });
        this.form.patchValue({ vatNo: this.model.vatNo });
      }
    }
  }

  submit() {
    if (this.form.valid) {
      this.loader.show();
      this.locationService.manage({
        locationId: this.model ? this.model.locationId : this.blankGuid,
        name: this.getValue('name'),
        code: this.getValue('code'),
        address: this.getValue('address'),
        status: true,
        isPrimary: false,
        allowNegativeStock: this.getValue('allowNegativeStock'),
        bankDetails: this.getValue('bankDetails'),
        logo: this.getValue('logo'),
        vatNo: this.getValue('vatNo')
      }).subscribe(result => {
        this.loader.hide();
        this.toastService.show(result);
        if (this.isSuccessResult(result)) {
          this.ref.close(result);
        }
      });
    }
  }

  handleFileChange($event): void {
    this.toBase64($event.target);
  }

  toBase64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.form.patchValue({ logo: myReader.result });
    }
    myReader.readAsDataURL(file);
  }

}
