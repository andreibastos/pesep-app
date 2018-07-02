import { TestesModule } from './testes.module';

describe('TestesModule', () => {
  let testesModule: TestesModule;

  beforeEach(() => {
    testesModule = new TestesModule();
  });

  it('should create an instance', () => {
    expect(testesModule).toBeTruthy();
  });
});
