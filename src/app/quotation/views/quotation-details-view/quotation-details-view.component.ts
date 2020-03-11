import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotationService } from '../../services/quotation.service';
import { Observable } from 'rxjs';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Breadcrumb } from 'src/app/shared/views/page-header/models/breadcrumb.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-quotation-details-view',
  templateUrl: './quotation-details-view.component.html',
  styleUrls: ['./quotation-details-view.component.scss']
})
export class QuotationDetailsViewComponent extends BaseComponent implements OnInit, OnDestroy {

  title = 'Loading...';
  quotation: any = null;
  quotationId: string;
  result$: Observable<any>;
  breadcrumbs: Breadcrumb[] = [{
    link: '/app/quotation',
    name: 'Quotation List'
  }];
  constructor(
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private quotationService: QuotationService,
    private loader: LoaderService,
    private toast: ToastService,
    private confirmationService: ConfirmationService) {
    super(injector);
  }

  ngOnInit() {
    this.quotationId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.quotationId) {
      // edit mode
      this.title = 'Loading...';
      this.editMode();
    }
  }

  editMode() {
    this.loader.show();
    // get the quotation details
    const ref = this.quotationService.byId(this.quotationId).subscribe(value => {
      this.loader.hide();
      if (value) {
        console.log(value);
        this.title = `${value.title} Details (${value.quotationNo})`;
        this.quotation = value;
      }
    });
    this.subscription.add(ref);
  }

  exportToPdf() {
    const data = document.getElementById('quotation-print-section');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${this.quotation.quotationNo}.pdf`);
    });
  }

  getTotal(key: string): number {
    let total = 0;
    if (this.quotation && this.quotation.products) {
      const products = this.quotation.products as Array<any>;
      products.forEach(item => {
        total += parseFloat(item[key]);
      });
    }
    return total;
  }

  handleMarkAsInvoice() {
    this.confirmationService.confirm({
      message: 'Are you sure?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // remove
        this.loader.show();
        this.quotationService.markInvoice(this.quotationId).subscribe(result => {
          this.loader.hide();
          this.toast.show(result);
          if (this.isSuccessResult(result)) {
            // do next
            this.editMode();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
