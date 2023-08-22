import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAlertRulesComponent } from './project-alert-rules.component';

describe('ProjectAlertRulesComponent', () => {
  let component: ProjectAlertRulesComponent;
  let fixture: ComponentFixture<ProjectAlertRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAlertRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAlertRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
