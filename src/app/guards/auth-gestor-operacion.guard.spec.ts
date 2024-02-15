import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGestorOperacionGuard } from './auth-gestor-operacion.guard';

describe('AuthGestorOperacionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGestorOperacionGuard]
    });
  });

  it('should ...', inject([AuthGestorOperacionGuard], (guard: AuthGestorOperacionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
