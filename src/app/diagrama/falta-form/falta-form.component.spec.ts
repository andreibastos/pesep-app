import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaltaFormComponent } from './falta-form.component';

describe('FaltaFormComponent', () => {
  let component: FaltaFormComponent;
  let fixture: ComponentFixture<FaltaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaltaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaltaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
