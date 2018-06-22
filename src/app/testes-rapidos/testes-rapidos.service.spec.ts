import { TestBed, inject } from '@angular/core/testing';

import { TestesRapidosService } from './testes-rapidos.service';

describe('TestesRapidosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestesRapidosService]
    });
  });

  it('should be created', inject([TestesRapidosService], (service: TestesRapidosService) => {
    expect(service).toBeTruthy();
  }));
});
