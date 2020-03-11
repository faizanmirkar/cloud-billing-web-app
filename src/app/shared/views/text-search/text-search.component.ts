import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TextSearch } from './text-search-model';

@Component({
  selector: 'app-text-search',
  templateUrl: './text-search.component.html',
  styleUrls: ['./text-search.component.scss']
})
export class TextSearchComponent implements OnInit {

  private storageName = 'wildCardSearch';
  defaultText: string;
  @Input() section: string;
  @Input() placeholder = 'Search...';
  @Input() limit = 3;
  @Input() dealy = 300;
  @Output() search = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    this.searchFromStore();
  }

  handleSearch(text: string) {
    let searchText = null;
    if (text && text.length >= this.limit) {
      searchText = text;
    }
    setTimeout(() => {
      this.search.emit(searchText);
      this.writeSearch(searchText);
    }, this.dealy);
  }

  private writeSearch(text: string) {
    let models: TextSearch[] = [];
    const items = JSON.parse(localStorage.getItem(this.storageName)) as Array<TextSearch>;
    if (items && items.length > 0) {
      // clone
      models = [...items];
      const index = models.findIndex(m => m.section === this.section);
      if (index > -1) {
        // update
        models[index].text = text;
      } else {
        // insert
        models.push({
          section: this.section,
          text
        });
      }
    } else {
      models.push({
        section: this.section,
        text
      });
    }
    // set items
    localStorage.setItem(this.storageName, JSON.stringify(models));
  }

  private searchFromStore() {
    const models = JSON.parse(localStorage.getItem(this.storageName)) as Array<TextSearch>;
    if (models && models.length > 0) {
      const info = models.find(m => m.section === this.section);
      if (info && info.text) {
        this.defaultText = info.text;
        this.search.emit(info.text);
      }
    }
  }

}
