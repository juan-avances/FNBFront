import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Motivo } from 'src/app/models/motivo.model';
import { FormGroup } from '@angular/forms';
import { MotivoEdicionService } from 'src/app/services/feature.service.index';

@Component({
  selector: 'app-edicion-motivo',
  templateUrl: './motivo-edicion.component.html',
  styles: []
})
export class MotivoEdicionComponent implements OnInit {
  motivoActual: Motivo;
  forma: FormGroup;
  isOrchestration: boolean;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _motivoEdicionServicio: MotivoEdicionService,
    public _renderer2: Renderer2,
    public _router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._motivoEdicionServicio.init(this._activatedRoute).subscribe(response => {
      this.motivoActual = response;
      this.forma = this._motivoEdicionServicio.getForm(this.motivoActual);
    });
  }

  onSubmit() {
    this._motivoEdicionServicio.saveChange(this.forma.getRawValue());
  }

  cancelar() {
    this._motivoEdicionServicio.cancel();
  }
}
