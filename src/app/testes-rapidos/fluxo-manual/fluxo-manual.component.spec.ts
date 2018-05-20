import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoManualComponent } from './fluxo-manual.component';

describe('FluxoManualComponent', () => {
  let component: FluxoManualComponent;
  let fixture: ComponentFixture<FluxoManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxoManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxoManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
