import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoArquivosComponent } from './fluxo-arquivos.component';

describe('FluxoArquivosComponent', () => {
  let component: FluxoArquivosComponent;
  let fixture: ComponentFixture<FluxoArquivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxoArquivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxoArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
