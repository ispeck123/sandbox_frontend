import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFailureChartComponent } from './login-failure-chart.component';

describe('LoginFailureChartComponent', () => {
  let component: LoginFailureChartComponent;
  let fixture: ComponentFixture<LoginFailureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginFailureChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFailureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
