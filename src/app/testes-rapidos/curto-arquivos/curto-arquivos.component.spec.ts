import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurtoArquivosComponent } from './curto-arquivos.component';

describe('CurtoArquivosComponent', () => {
  let component: CurtoArquivosComponent;
  let fixture: ComponentFixture<CurtoArquivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurtoArquivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurtoArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
