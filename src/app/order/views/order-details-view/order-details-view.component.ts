import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from 'src/app/shared/views/page-header/models/breadcrumb.model';
import { BaseComponent } from 'src/app/wrapper/base-component';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { OrderService } from '../../services/order.service';
import { Utility } from 'src/app/shared/services/utility';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-order-details-view',
  templateUrl: './order-details-view.component.html',
  styleUrls: ['./order-details-view.component.scss']
})
export class OrderDetailsViewComponent extends BaseComponent implements OnInit, OnDestroy {

  title = 'Loading...';
  order: any = null;
  orderId: string;
  result$: Observable<any>;
  breadcrumbs: Breadcrumb[] = [{
    link: '/app/order',
    name: 'Order List'
  }];
  constructor(
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService,
    private orderService: OrderService) {
    super(injector);
  }

  ngOnInit() {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.orderId) {
      // edit mode
      this.title = 'Loading...';
      this.editMode();
    }
  }

  editMode() {
    this.loader.show();
    // get the quotation details
    const ref = this.orderService.byId(this.orderId).subscribe(value => {
      this.loader.hide();
      if (value) {
        this.title = `Order Details (${value.orderNo})`;
        this.order = value;
        console.log(value);
      }
    });
    this.subscription.add(ref);
  }

  exportToPdf() {
    const data = document.getElementById('order-print-section');
    html2canvas(data).then(canvas => {
      console.log(canvas);
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${this.order.orderNo}.pdf`);
    });
  }

  getTotal(key: string): number {
    let total = 0;
    if (this.order && this.order.products) {
      const products = this.order.products as Array<any>;
      products.forEach(item => {
        total += parseFloat(item[key]);
      });
    }
    return total;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
