import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggle]'
})
export class ToggleDirective {

  @Input() ref: string;

  constructor(private elRef: ElementRef) { }

  @HostListener('click')
  private onClick() {
    if (this.ref) {
      const toggleElement = document.getElementById(this.ref);
      if (toggleElement) {
        let display = toggleElement.style.display;
        display = !display ? 'block' : (display === 'block' ? 'none' : 'block');
        toggleElement.style.display = display;
      }
    }
  }

}
