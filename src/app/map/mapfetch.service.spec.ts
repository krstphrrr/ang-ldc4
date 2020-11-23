import { TestBed } from '@angular/core/testing';

import { MapfetchService } from './mapfetch.service';

describe('MapfetchService', () => {
  let service: MapfetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapfetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
