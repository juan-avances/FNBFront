import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanciamientoReenviarComponent } from './financiamiento-reenviar.component';

describe('FinanciamientoReenviarComponent', () => {
  let component: FinanciamientoReenviarComponent;
  let fixture: ComponentFixture<FinanciamientoReenviarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanciamientoReenviarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanciamientoReenviarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
