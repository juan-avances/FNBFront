import { TestBed, inject } from '@angular/core/testing';

import { BrandFeatureService } from './brand-feature.service';

describe('BrandFeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrandFeatureService]
    });
  });

  it('should be created', inject([BrandFeatureService], (service: BrandFeatureService) => {
    expect(service).toBeTruthy();
  }));
});
