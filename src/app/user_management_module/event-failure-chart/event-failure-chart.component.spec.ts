import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFailureChartComponent } from './event-failure-chart.component';

describe('EventFailureChartComponent', () => {
  let component: EventFailureChartComponent;
  let fixture: ComponentFixture<EventFailureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventFailureChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFailureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
