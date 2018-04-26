import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerFlowComponent } from './power-flow.component';

describe('PowerFlowComponent', () => {
  let component: PowerFlowComponent;
  let fixture: ComponentFixture<PowerFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
