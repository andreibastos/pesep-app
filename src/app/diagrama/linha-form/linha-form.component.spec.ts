import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinhaFormComponent } from './linha-form.component';

describe('LinhaFormComponent', () => {
  let component: LinhaFormComponent;
  let fixture: ComponentFixture<LinhaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinhaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinhaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
