import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraFormComponent } from './barra-form.component';

describe('BarraFormComponent', () => {
  let component: BarraFormComponent;
  let fixture: ComponentFixture<BarraFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarraFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
