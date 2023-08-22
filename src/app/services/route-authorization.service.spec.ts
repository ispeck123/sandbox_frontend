import { TestBed } from '@angular/core/testing';

import { RouteAuthorizationService } from './route-authorization.service';

describe('RouteAuthorizationService', () => {
  let service: RouteAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
