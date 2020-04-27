import { TestBed } from '@angular/core/testing';

import { ZoomEndService } from '../../services/mapLoad.service';

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
