import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { GlobalService } from '../services/global.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  @ViewChild('drawer', { static: true }) drawer: MatSidenav;
  private ocultar: boolean;
  public scrollbars: PerfectScrollbarConfigInterface = {};
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver, public _global: GlobalService, _router: Router) {
    _router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && a instanceof NavigationEnd)
      )
      .subscribe(_ => this.drawer.close());

    this.ocultar = _global.ocultar;
  }

  public ocultarConfig() {
    this._global.ocultar = false;
  }
}
