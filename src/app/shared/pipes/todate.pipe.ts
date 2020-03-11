import { Pipe, PipeTransform } from '@angular/core';
import { Utility } from '../services/utility';

@Pipe({
  name: 'todate'
})
export class TodatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      return Utility.ticksToDate(value);
    }
    return null;
  }

}
