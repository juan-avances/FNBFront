import { TestBed, inject } from '@angular/core/testing';

import { CommercialAllyUpdateService } from './commercial-ally-update.service';

describe('CommercialAllyUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommercialAllyUpdateService]
    });
  });

  it('should be created', inject([CommercialAllyUpdateService], (service: CommercialAllyUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
