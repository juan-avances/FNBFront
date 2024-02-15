import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoSeccionComponent } from './documento-seccion.component';

describe('DocumentoSeccionComponent', () => {
  let component: DocumentoSeccionComponent;
  let fixture: ComponentFixture<DocumentoSeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoSeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
