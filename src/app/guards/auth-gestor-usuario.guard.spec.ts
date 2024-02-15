import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGestorUsuarioGuard } from './auth-gestor-usuario.guard';

describe('AuthGestorUsuarioGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGestorUsuarioGuard]
    });
  });

  it('should ...', inject([AuthGestorUsuarioGuard], (guard: AuthGestorUsuarioGuard) => {
    expect(guard).toBeTruthy();
  }));
});
