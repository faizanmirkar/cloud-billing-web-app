import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appNavigate]'
})
export class NavigateDirective {

  @Input() link: string;
  constructor(private router: Router) { }

  @HostListener('click')
  private onClick() {
    if (this.link) {
      this.router.navigateByUrl(this.link);
    }
  }

}
