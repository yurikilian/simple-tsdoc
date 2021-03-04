import os from 'os';
import {
  CompilerOptions,
  Program,
  Diagnostic,
  createProgram,
  flattenDiagnosticMessageText
} from 'typescript';

export enum TsCompileStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface TSCompilerResult {
  status: TsCompileStatus;
  messages: Array<string>;
  program: Program;
}

export default class TsCompiler {
  private compilerOptions: CompilerOptions;

  constructor(compilerOptions: CompilerOptions) {
    this.compilerOptions = compilerOptions;
  }

  public compile(filePaths: Array<string>): TSCompilerResult {
    const info: TSCompilerResult = {
      status: TsCompileStatus.ERROR,
      messages: [],
      program: createProgram(filePaths, this.compilerOptions)
    };

    const compilerMessages = info.program.getSemanticDiagnostics();
    if (compilerMessages.length > 0) {
      info.messages = this.extractErrorMessages(compilerMessages);
      info.status = TsCompileStatus.ERROR;
    } else {
      info.status = TsCompileStatus.SUCCESS;
    }

    return info;
  }

  private extractErrorMessages(compilerMessages: readonly Diagnostic[]) {
    return compilerMessages.map((diagnostic) => {
      const message = flattenDiagnosticMessageText(
        diagnostic.messageText,
        os.EOL
      );

      if (diagnostic.file) {
        const location = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start || 0
        );

        return `${diagnostic.file.fileName}(${location.line + 1},${
          location.character + 1
        }): [TypeScript] ${message}`;
      } else {
        return message;
      }
    });
  }
}
