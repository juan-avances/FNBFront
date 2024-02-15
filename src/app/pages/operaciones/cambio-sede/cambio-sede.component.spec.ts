import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioSedeComponent } from './cambio-sede.component';

describe('CambioSedeComponent', () => {
  let component: CambioSedeComponent;
  let fixture: ComponentFixture<CambioSedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioSedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
