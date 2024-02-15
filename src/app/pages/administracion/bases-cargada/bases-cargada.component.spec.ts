import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasesCargadaComponent } from './bases-cargada.component';

describe('BasesCargadaComponent', () => {
  let component: BasesCargadaComponent;
  let fixture: ComponentFixture<BasesCargadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasesCargadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasesCargadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
