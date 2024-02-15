import { Component, OnInit } from '@angular/core';
import { FinanciamientoEdicionService } from '../../../../services/feature.service.index';
import { Financiamiento } from '../../../../models/financiamiento.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-financiamiento-form',
  templateUrl: './financiamiento-form.component.html',
  styleUrls: []
})
export class FinanciamientoFormComponent implements OnInit {
  finacimientoInit: Financiamiento;
  constructor(
    public _activatedRoute: ActivatedRoute,
    public _financiamientoEdicionService: FinanciamientoEdicionService
  ) {}

  ngOnInit() {
    this._financiamientoEdicionService.init(this._activatedRoute).subscribe(response => {      
      this.finacimientoInit = response;
    });
  }
}
