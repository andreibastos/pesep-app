import { TestesRapidosModule } from './testes-rapidos.module';

describe('TestesRapidosModule', () => {
  let testesRapidosModule: TestesRapidosModule;

  beforeEach(() => {
    testesRapidosModule = new TestesRapidosModule();
  });

  it('should create an instance', () => {
    expect(testesRapidosModule).toBeTruthy();
  });
});
