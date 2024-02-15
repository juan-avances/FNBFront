import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[onlyAddressStreet]'
})
export class OnlyAddressStreetDirective {
  constructor(public el: ElementRef, public renderer: Renderer2) {}

  @HostListener('paste', ['$event']) onPaste(e:any) {
    const pattern =  /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.?¿&%$\\.()\,\-\s\u00f1\u00d1]*$/g;
    if (!pattern.test(e.clipboardData.getData('text'))) e.preventDefault();
  }

  @HostListener('keypress', ['$event']) onInput(e:any) {
    const pattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.?¿&%$\\.()\,\-\s\u00f1\u00d1]*$/g;
    if (!pattern.test(e.key)) e.preventDefault();
  }
}
