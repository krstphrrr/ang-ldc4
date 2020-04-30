import { TestBed } from '@angular/core/testing';

import { AboutSelService } from './services/about-sel.service';

describe('AboutSelService', () => {
  let service: AboutSelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutSelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
