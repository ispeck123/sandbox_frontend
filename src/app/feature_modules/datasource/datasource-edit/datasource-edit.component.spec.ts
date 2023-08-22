import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceEditComponent } from './datasource-edit.component';

describe('DatasourceEditComponent', () => {
  let component: DatasourceEditComponent;
  let fixture: ComponentFixture<DatasourceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasourceEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
