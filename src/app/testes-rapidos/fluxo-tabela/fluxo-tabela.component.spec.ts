import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoTabelaComponent } from './fluxo-tabela.component';

describe('FluxoTabelaComponent', () => {
  let component: FluxoTabelaComponent;
  let fixture: ComponentFixture<FluxoTabelaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxoTabelaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxoTabelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
