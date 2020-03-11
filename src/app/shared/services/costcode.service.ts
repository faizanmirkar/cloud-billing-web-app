import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CostcodeService {

  constructor() { }

  getCostCode(code: string, value: number): string {
    let cc: string = '';
    const costCodes = code.split('');
    const amounts = value.toFixed(2).toString().split('');
    // amounts
    const total = amounts.length;
    for (let i = 0; i < total; i++) {
      const amt = amounts[i];
      cc += amt == '.' ? '.' : costCodes[parseInt(amt, 10)];
    }
    return cc;
  }
}
