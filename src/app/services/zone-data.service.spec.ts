import { TestBed } from '@angular/core/testing';

import { ZoneDataService } from './zone-data.service';

describe('ZoneDataService', () => {
  let service: ZoneDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
