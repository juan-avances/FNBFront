import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanciamientoArchivoDesagregadoComponent } from './financiamiento-archivo-desagregado.component';

describe('FinanciamientoArchivoDesagregadoComponent', () => {
  let component: FinanciamientoArchivoDesagregadoComponent;
  let fixture: ComponentFixture<FinanciamientoArchivoDesagregadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanciamientoArchivoDesagregadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanciamientoArchivoDesagregadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
