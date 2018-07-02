import { TestesModule } from './testes-rapidos.module';

describe('TestesRapidosModule', () => {
  let testesRapidosModule: TestesModule;

  beforeEach(() => {
    testesRapidosModule = new TestesModule();
  });

  it('should create an instance', () => {
    expect(testesRapidosModule).toBeTruthy();
  });
});
