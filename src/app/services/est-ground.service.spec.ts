import { TestBed } from '@angular/core/testing';

import { EstGroundService } from './est-ground.service';

describe('EstGroundService', () => {
  let service: EstGroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstGroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
