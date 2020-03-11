import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class Utility {

  static toFloat(value: string): number {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }

  static toInt(value: string): number {
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
  }

  static toPercentage(value: number, percent: number): number {
    return (percent / 100) * value;
  }

  static toPercentageWithValue(value: number, percent: number): number {
    return value + this.toPercentage(value, percent);
  }

  static toPercentageWithoutValue(value: number, percent: number): number {
    return value - this.toPercentage(value, percent);
  }

  static toPriceWithoutTax(priceWithTax: number, taxPercentage: number) {
    return (priceWithTax * 100) / (taxPercentage + 100);
  }

  static percentageOf(value1: number, value2: number): number {
    const decrease = value1 - value2;
    return decrease / value2 * 100;
  }

  static focus(elementId: string) {
    const ele: HTMLInputElement = document.getElementById(elementId) as HTMLInputElement;
    if (ele) {
      ele.focus();
      ele.select();
    }
  }

  static get epochTicks() {
    return 621355968000000000;
  }

  static ticksToDate(ticks: number): Date {
    if (ticks) {
      const ticksPerMillisecond = 10000;
      const ticksSinceEpoch = ticks - this.epochTicks;
      const millisecondsSinceEpoch = ticksSinceEpoch / ticksPerMillisecond;
      return new Date(millisecondsSinceEpoch);
    }
    return null;
  }

  static toTicks(dt: Date): number {
    if (dt) {
      // there are 10000 .net ticks per millisecond
      const ticksPerMillisecond = 10000;
      // calculate the total number of .net ticks for your date
      return this.epochTicks + (dt.getTime() * ticksPerMillisecond);
    }
    return 0;
  }

  static ticksToFormat(ticks: number, format: string) {
    new DatePipe('en-US').transform(Utility.ticksToDate(ticks), format);
  }

  static toSelectItems(items: any[], key: string, value: string): SelectItem[] {
    const models: SelectItem[] = [];
    if (items && items.length > 0) {
      items.forEach(item => {
        models.push({
          label: item[value],
          value: item[key]
        });
      });
    }
    return models;
  }

  static primeNgControlToValue(value: any, propertyName: string) {
    if (value) {
      if (value.hasOwnProperty(propertyName)) {
        return value[propertyName];
      }
    }
    return null;
  }

  static clearForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      // check that control is instance of form gorup
      if (control instanceof (FormGroup)) {
        const fg = control as FormGroup;
        this.clearForm(fg);
      } else {
        control.reset('');
      }
    });
  }

  static resetControl(formGroup: FormGroup, controls: string[]) {
    if (controls.length > 0) {
      controls.forEach(controlName => {
        const control = formGroup.get(controlName);
        // clear
        control.reset('');
      });
    }
  }

  static trim(obj: any) {
    Object.keys(obj).map(k => obj[k] = typeof obj[k] === 'string' ? obj[k].trim() : obj[k]);
  }

}
