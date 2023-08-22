import { TestBed } from '@angular/core/testing';

import { ClassUiChangerService } from './class-ui-changer.service';

describe('ClassUiChangerService', () => {
  let service: ClassUiChangerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassUiChangerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
