import { TestBed, inject } from '@angular/core/testing';

import { MathPowerService } from './math-power.service';

describe('MathPowerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MathPowerService]
    });
  });

  it('should be created', inject([MathPowerService], (service: MathPowerService) => {
    expect(service).toBeTruthy();
  }));
});
