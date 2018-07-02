import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestesComponent } from './testes-rapidos.component';

describe('TestesRapidosComponent', () => {
  let component: TestesComponent;
  let fixture: ComponentFixture<TestesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
