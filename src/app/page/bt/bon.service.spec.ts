import { TestBed } from '@angular/core/testing';

import { BonService } from './bon.service';

describe('BonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BonService = TestBed.get(BonService);
    expect(service).toBeTruthy();
  });
});
