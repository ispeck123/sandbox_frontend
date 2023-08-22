import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermMapComponent } from './role-perm-map.component';

describe('RolePermMapComponent', () => {
  let component: RolePermMapComponent;
  let fixture: ComponentFixture<RolePermMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolePermMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePermMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
