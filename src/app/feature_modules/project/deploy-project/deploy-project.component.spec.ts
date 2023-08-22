import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployProjectComponent } from './deploy-project.component';

describe('DeployProjectComponent', () => {
  let component: DeployProjectComponent;
  let fixture: ComponentFixture<DeployProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
