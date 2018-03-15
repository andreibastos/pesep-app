import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastTestComponent } from './fast-test.component';

describe('FastTestComponent', () => {
  let component: FastTestComponent;
  let fixture: ComponentFixture<FastTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
