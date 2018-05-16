import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurtoCircuitoComponent } from './curto-circuito.component';

describe('CurtoCircuitoComponent', () => {
  let component: CurtoCircuitoComponent;
  let fixture: ComponentFixture<CurtoCircuitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurtoCircuitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurtoCircuitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
