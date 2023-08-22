import { TestBed } from '@angular/core/testing';

import { SystemUsageService } from './system-usage.service';

describe('SystemUsageService', () => {
  let service: SystemUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
