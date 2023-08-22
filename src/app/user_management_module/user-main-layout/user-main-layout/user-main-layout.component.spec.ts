import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMainLayoutComponent } from './user-main-layout.component';

describe('UserMainLayoutComponent', () => {
  let component: UserMainLayoutComponent;
  let fixture: ComponentFixture<UserMainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMainLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
