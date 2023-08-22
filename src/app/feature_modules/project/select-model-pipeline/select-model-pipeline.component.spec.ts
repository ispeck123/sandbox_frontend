import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectModelPipelineComponent } from './select-model-pipeline.component';

describe('SelectModelPipelineComponent', () => {
  let component: SelectModelPipelineComponent;
  let fixture: ComponentFixture<SelectModelPipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectModelPipelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectModelPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
