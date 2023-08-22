import { TestBed } from '@angular/core/testing';

import { PassLinkGuard} from './pass-link.guard';

describe('PassLinkGuard', () => {
  let guard: PassLinkGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PassLinkGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
