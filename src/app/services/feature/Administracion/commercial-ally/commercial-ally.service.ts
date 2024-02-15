import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import { PrimeTable, Column } from '../../../../@core/models/prime-table.model';
import { UsuarioService } from '../../../backend.service.index';
import { Router } from '@angular/router';
import { FeatureListService } from '../../../../@core/services/feature-list.service';

import { FeatureListConfig } from '../../../../@core/models/feature-list.model';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/primeng';
import { Usuario } from 'src/app/models/usuario.model';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommercialAllyService {
  dataTable: Table;

  constructor() {}
}
