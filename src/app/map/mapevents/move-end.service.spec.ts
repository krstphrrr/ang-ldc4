import { TestBed } from '@angular/core/testing';

import { MoveEndService } from '../../services/move-end.service';

describe('MoveEndService', () => {
  let service: MoveEndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveEndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
