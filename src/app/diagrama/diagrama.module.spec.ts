import { DiagramaModule } from './diagrama.module';

describe('DiagramaModule', () => {
  let diagramaModule: DiagramaModule;

  beforeEach(() => {
    diagramaModule = new DiagramaModule();
  });

  it('should create an instance', () => {
    expect(diagramaModule).toBeTruthy();
  });
});
