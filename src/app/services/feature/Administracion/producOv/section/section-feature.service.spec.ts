import { TestBed, inject } from '@angular/core/testing';

import { SectionFeatureService } from './section-feature.service';

describe('SectionFeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectionFeatureService]
    });
  });

  it('should be created', inject([SectionFeatureService], (service: SectionFeatureService) => {
    expect(service).toBeTruthy();
  }));
});
