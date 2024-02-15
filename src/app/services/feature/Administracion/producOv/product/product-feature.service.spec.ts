import { TestBed, inject } from '@angular/core/testing';

import { ProductFeatureService } from './product-feature.service';

describe('ProductFeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductFeatureService]
    });
  });

  it('should be created', inject([ProductFeatureService], (service: ProductFeatureService) => {
    expect(service).toBeTruthy();
  }));
});
