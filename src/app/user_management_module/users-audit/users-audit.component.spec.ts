import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAuditComponent } from './users-audit.component';

describe('UsersAuditComponent', () => {
  let component: UsersAuditComponent;
  let fixture: ComponentFixture<UsersAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
