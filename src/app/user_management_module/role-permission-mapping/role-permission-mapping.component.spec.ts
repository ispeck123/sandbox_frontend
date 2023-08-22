import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionMappingComponent } from './role-permission-mapping.component';

describe('RolePermissionMappingComponent', () => {
  let component: RolePermissionMappingComponent;
  let fixture: ComponentFixture<RolePermissionMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolePermissionMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePermissionMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
