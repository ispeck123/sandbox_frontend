import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelsComponent } from './add-models.component';

describe('AddModelsComponent', () => {
  let component: AddModelsComponent;
  let fixture: ComponentFixture<AddModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
