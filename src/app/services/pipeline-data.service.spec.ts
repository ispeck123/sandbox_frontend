import { TestBed } from '@angular/core/testing';

import { PipelineDataService } from './pipeline-data.service';

describe('PipilineDataService', () => {
  let service: PipelineDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PipelineDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
