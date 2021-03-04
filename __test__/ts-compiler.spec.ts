import path from 'path';
import {
  CompilerOptions,
  ScriptTarget,
  Node,
  SyntaxKind,
  ParameterDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration
} from 'typescript';
import TsProgram from '../src/ts-compiler';
import { TsCompileStatus } from '../src/ts-compiler';

import TypescriptParsingStrategyFactory from '../src/strategy/TypescriptParsingStrategyFactory';

describe('TSDoc parser tests', () => {
  it('Should create program and evaluate given input file', () => {
    const fileInput: string = path.resolve(
      path.join(__dirname, '..', '__fixture__', 'project/src/index.ts')
    );

    const compilerOptions: CompilerOptions = {
      target: ScriptTarget.ES5
    };
    const tsProgram = new TsProgram(compilerOptions);
    const info = tsProgram.compile([fileInput]);

    expect(info).toBeDefined();
    expect(info.status).toBe(TsCompileStatus.SUCCESS);
    expect(info.messages.length).toBe(0);
    expect(info.program).toBeDefined();

    const rootSourceFile = info.program.getSourceFile(fileInput);
    if (rootSourceFile) {
      info.program
        .getSourceFiles()
        .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
        .forEach((rootSourceFile) => {
          const root = rootSourceFile as Node;

          root.forEachChild((child) => {
            TypescriptParsingStrategyFactory.get(child.kind)?.parse(child);
          });
        });
    }
  });
});
