import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IResult, IResultStatus } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  success(message: string) {
    this.messageService.add({ severity: 'success', summary: message });
  }

  warning(message: string) {
    this.messageService.add({ severity: 'error', summary: message });
  }

  error(message: string) {
    this.messageService.add({ severity: 'error', summary: message });
  }

  show(result: IResult) {
    if (Number(result.status) === IResultStatus.Success) {
      this.success(result.message);
    } else if (Number(result.status) === IResultStatus.Error) {
      this.error(result.message);
    } else {
      this.warning(result.message);
    }
  }
}
