import { TestBed, inject } from '@angular/core/testing';

import { MathPowerService } from './testes-rapidos.service';

describe('TestesRapidosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MathPowerService]
    });
  });

  it('should be created', inject([MathPowerService], (service: MathPowerService) => {
    expect(service).toBeTruthy();
  }));
});
