import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelVerifyComponent } from './model-verify.component';

describe('ModelVerifyComponent', () => {
  let component: ModelVerifyComponent;
  let fixture: ComponentFixture<ModelVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
