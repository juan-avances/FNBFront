import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesbloqueoUsuarioComponent } from './desbloqueo-usuario.component';

describe('DesbloqueoUsuarioComponent', () => {
  let component: DesbloqueoUsuarioComponent;
  let fixture: ComponentFixture<DesbloqueoUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesbloqueoUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesbloqueoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
