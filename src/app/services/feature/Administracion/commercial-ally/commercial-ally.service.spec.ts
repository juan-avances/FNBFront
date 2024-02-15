import { TestBed, inject } from '@angular/core/testing';

import { CommercialAllyService } from './commercial-ally.service';

describe('CommercialAllyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommercialAllyService]
    });
  });

  it('should be created', inject([CommercialAllyService], (service: CommercialAllyService) => {
    expect(service).toBeTruthy();
  }));
});
