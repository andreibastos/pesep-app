import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemplosComponent } from './exemplos.component';

describe('ExemplosComponent', () => {
  let component: ExemplosComponent;
  let fixture: ComponentFixture<ExemplosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExemplosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemplosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
