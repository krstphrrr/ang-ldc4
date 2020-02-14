import { TestBed } from '@angular/core/testing';

import { CustomControlService } from './custom-control.service';

describe('CustomControlService', () => {
  let service: CustomControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
