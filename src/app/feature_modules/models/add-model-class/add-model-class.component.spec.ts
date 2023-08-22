import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelClassComponent } from './add-model-class.component';

describe('AddModelClassComponent', () => {
  let component: AddModelClassComponent;
  let fixture: ComponentFixture<AddModelClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModelClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModelClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
