import { TestBed } from '@angular/core/testing';

import { MaplogService } from './maplog.service';

describe('MaplogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaplogService = TestBed.get(MaplogService);
    expect(service).toBeTruthy();
  });
});
