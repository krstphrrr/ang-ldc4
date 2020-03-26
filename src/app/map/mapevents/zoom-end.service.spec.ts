import { TestBed } from '@angular/core/testing';

import { ZoomEndService } from './zoom-end.service';

describe('ZoomEndService', () => {
  let service: ZoomEndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoomEndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
