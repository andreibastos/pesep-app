import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboreComponent } from './colabore.component';

describe('ColaboreComponent', () => {
  let component: ColaboreComponent;
  let fixture: ComponentFixture<ColaboreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColaboreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaboreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
