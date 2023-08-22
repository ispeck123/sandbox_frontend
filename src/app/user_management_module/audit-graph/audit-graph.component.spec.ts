import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditGraphComponent } from './audit-graph.component';

describe('AuditGraphComponent', () => {
  let component: AuditGraphComponent;
  let fixture: ComponentFixture<AuditGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
