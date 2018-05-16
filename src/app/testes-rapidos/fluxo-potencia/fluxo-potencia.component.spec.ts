import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoPotenciaComponent } from './fluxo-potencia.component';

describe('FluxoPotenciaComponent', () => {
  let component: FluxoPotenciaComponent;
  let fixture: ComponentFixture<FluxoPotenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxoPotenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxoPotenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
