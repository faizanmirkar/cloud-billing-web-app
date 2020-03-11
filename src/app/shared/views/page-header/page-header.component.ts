import { Component, OnInit, Input } from '@angular/core';
import { Breadcrumb } from './models/breadcrumb.model';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  private pageTitle: string;
  @Input()
  set title(value: string) {
    this.pageTitle = value;
  }
  get title() { return this.pageTitle; }

  @Input() breadcrumbs: Breadcrumb[] = [];

  constructor() { }

  ngOnInit() {
  }

}
