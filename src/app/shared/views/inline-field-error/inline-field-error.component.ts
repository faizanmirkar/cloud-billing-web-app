import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inline-field-error',
  template: `<div class="field-inline-error" *ngIf="this.form.get(this.control).invalid">{{getErrorMessage()}}</div>`
})
export class InlineFieldErrorComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() control: string;

  constructor() { }

  ngOnInit() {
  }

  getErrorMessage() {
    const control = this.form.get(this.control);
    if (control.touched) {
      if (control.hasError('required')) {
        return 'Required.';
      } else if (control.hasError('email')) {
        return 'Enter valid email.';
      }
    }
    return '';
  }

}
