import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestesRapidosComponent } from './testes-rapidos.component';

describe('TestesRapidosComponent', () => {
  let component: TestesRapidosComponent;
  let fixture: ComponentFixture<TestesRapidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestesRapidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestesRapidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
