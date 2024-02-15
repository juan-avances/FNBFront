import { PermisosService } from './permisos.service';
import { TestBed, inject } from '@angular/core/testing';

describe('PermisosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermisosService]
    });
  });

  it('should be created', inject([PermisosService], (service: PermisosService) => {
    expect(service).toBeTruthy();
  }));
});
