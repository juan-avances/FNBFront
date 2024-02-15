import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionReniecComponent } from './validacion-reniec.component';

describe('ValidacionReniecComponent', () => {
  let component: ValidacionReniecComponent;
  let fixture: ComponentFixture<ValidacionReniecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidacionReniecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionReniecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
