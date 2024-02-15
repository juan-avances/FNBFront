import { TestBed, inject } from '@angular/core/testing';

import { SubcategoryFeatureService } from './subcategory-feature.service';

describe('SubcategoryFeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubcategoryFeatureService]
    });
  });

  it('should be created', inject([SubcategoryFeatureService], (service: SubcategoryFeatureService) => {
    expect(service).toBeTruthy();
  }));
});
