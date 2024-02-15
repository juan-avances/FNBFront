import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionMotorizadoComponent } from './validacion-motorizado.component';

describe('ValidacionMotorizadoComponent', () => {
  let component: ValidacionMotorizadoComponent;
  let fixture: ComponentFixture<ValidacionMotorizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidacionMotorizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionMotorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
