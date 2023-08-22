import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePipelineComponent } from './save-pipeline.component';

describe('SavePipelineComponent', () => {
  let component: SavePipelineComponent;
  let fixture: ComponentFixture<SavePipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavePipelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
