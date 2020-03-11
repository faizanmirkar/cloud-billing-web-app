import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { FormBuilder, Validators } from '@angular/forms';
import { SettingService } from '../../services/setting.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Utility } from 'src/app/shared/services/utility';

@Component({
  selector: 'app-setting-index',
  templateUrl: './setting-index.component.html',
  styleUrls: ['./setting-index.component.scss']
})
export class SettingIndexComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(
    private injector: Injector,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private toast: ToastService,
    private settingService: SettingService) {
    super(injector);
    // init form
    this.form = this.formBuilder.group({
      costCode: this.formBuilder.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      autoProductSerialNo: this.formBuilder.control(false, [Validators.required]),
      productSerialNo: this.formBuilder.control(''),
      quotationSerialNo: this.formBuilder.control('', [Validators.required]),
      orderSerialNo: this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnInit() {
    // register event
    this.registerAutoSerialNoChangedEvent();
    // load setting
    this.loadSetting();
  }

  private registerAutoSerialNoChangedEvent() {
    const ref = this.form.get('autoProductSerialNo').valueChanges.subscribe(value => {
      const productSerialNoControl = this.form.get('productSerialNo');
      productSerialNoControl.clearValidators();
      if (value) {
        productSerialNoControl.setValidators([Validators.required]);
      }
    });
    this.subscription.add(ref);
  }

  private loadSetting() {
    const ref = this.settingService.setting().subscribe(value => {
      if (value) {
        this.setValue('autoProductSerialNo', value.autoProductSerialNo);
        this.setValue('costCode', value.costCode);
        this.setValue('orderSerialNo', value.orderSerialNo);
        this.setValue('productSerialNo', value.productSerialNo);
        this.setValue('quotationSerialNo', value.quotationSerialNo);
      }
    });
    this.subscription.add(ref);
  }

  submit() {
    if (this.form.valid) {
      this.loader.show();
      const ref = this.settingService.save({
        autoProductSerialNo: this.getValue('autoProductSerialNo'),
        costCode: this.getValue('costCode'),
        orderSerialNo: Utility.toFloat(this.getValue('orderSerialNo')),
        productSerialNo: Utility.toFloat(this.getValue('productSerialNo')),
        quotationSerialNo: Utility.toFloat(this.getValue('quotationSerialNo'))
      }).subscribe(result => {
        this.loader.hide();
        this.toast.show(result);
      });
      this.subscription.add(ref);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
