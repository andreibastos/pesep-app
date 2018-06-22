import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemplosModalComponent } from './exemplos-modal.component';

describe('ExemplosModalComponent', () => {
  let component: ExemplosModalComponent;
  let fixture: ComponentFixture<ExemplosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExemplosModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemplosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
