import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguridadEdicionService } from 'src/app/services/feature.service.index';
import { GlobalService } from 'src/app/services/global.service';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent {
  items: MenuItem[];

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _seguridadEdicionService: SeguridadEdicionService,
    public _renderer2: Renderer2,
    public _route: Router,
    public _global: GlobalService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this._seguridadEdicionService.obtenerMenu(0).subscribe(res => {
      this.items = this.ObtenerHijos(res);
    });
  }

  ObtenerHijos(hijos: any): any {
    const items = [];
    hijos.map(hijo => {
      const item: any = {};
      item.id = hijo.id;
      item.label = hijo.label;
      item.icon = hijo.faIcon;
      if (hijo.items.length > 0) {
        item.items = [];
        item.items = this.ObtenerHijos(hijo.items);
      } else {
        item.routerLink = [hijo.link];
      }
      items.push(item);
    });
    return items;
  }

  selectedItem(event: any) {
    this._route.navigate([event.link]);
  }
}
