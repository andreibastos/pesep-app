import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaoEncontradaComponent } from './nao-encontrada.component';

describe('NaoEncontradaComponent', () => {
  let component: NaoEncontradaComponent;
  let fixture: ComponentFixture<NaoEncontradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaoEncontradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaoEncontradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
