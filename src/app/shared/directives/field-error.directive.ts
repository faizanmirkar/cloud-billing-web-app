import { Directive, Self, OnInit, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appFieldError]'
})
export class FieldErrorDirective implements OnInit, OnDestroy {

  private subscription: Subscription;
  @HostBinding('class.no-error')
  private isValid = false;

  @HostBinding('class.field-error')
  private isInValid = false;

  constructor(@Self() private ngControl: NgControl) { }


  ngOnInit(): void {
    if (this.ngControl) {
      this.setCssClass();
      this.subscription = this.ngControl.valueChanges.subscribe(() => {
        this.setCssClass();
      });
    }
  }

  @HostListener('blur')
  private onBlur() {
    this.setCssClass();
  }

  private setCssClass() {
    this.isInValid = this.hasError();
    this.isValid = this.hasNoError();
  }

  hasNoError() {
    return !this.ngControl || !this.ngControl.value;
  }

  hasError() {
    if ((this.ngControl.touched || this.ngControl.dirty) && this.ngControl.errors) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
