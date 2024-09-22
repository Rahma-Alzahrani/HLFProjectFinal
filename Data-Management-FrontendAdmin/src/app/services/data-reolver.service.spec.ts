import { TestBed } from '@angular/core/testing';

import { DataReolverService } from './data-reolver.service';

describe('DataReolverService', () => {
  let service: DataReolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataReolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
