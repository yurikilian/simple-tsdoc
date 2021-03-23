export interface GlobalDocumentation {
  functions: Array<any>;
  interfaces: Array<any>;
}

export interface RendererOptions {
  templatePath: string;
  outputPath: string;
}

export abstract class Renderer {
  protected readonly options: RendererOptions;

  constructor(options: RendererOptions) {
    this.options = options;
  }

  abstract render(documentation: GlobalDocumentation): void;
}
