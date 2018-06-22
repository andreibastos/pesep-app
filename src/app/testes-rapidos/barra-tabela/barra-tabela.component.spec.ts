import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraTabelaComponent } from './barra-tabela.component';

describe('BarraTabelaComponent', () => {
  let component: BarraTabelaComponent;
  let fixture: ComponentFixture<BarraTabelaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarraTabelaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarraTabelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
