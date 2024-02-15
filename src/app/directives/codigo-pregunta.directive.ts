import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[codigoPregunta]'
})
export class CodigoPreguntaDirective {
  constructor(public el: ElementRef, public renderer: Renderer2) {}

  @HostListener('paste', ['$event']) onPaste(e:any) {

    const pattern = /^[A-Za-z0-9-_]*$/g;
    if (!pattern.test(e.clipboardData.getData('text'))) e.preventDefault();
  }

  @HostListener('keypress', ['$event']) onInput(e:any) {

    const pattern = /^[A-Za-z0-9-_]*$/g;
    if (!pattern.test(e.key)) e.preventDefault();
  }
}
