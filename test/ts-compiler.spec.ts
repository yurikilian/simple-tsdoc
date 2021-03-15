import path from 'path';
import { CompilerOptions, ScriptTarget } from 'typescript';
import TsProgram, { TsCompileStatus } from '../src/ts-compiler';

describe('TSDoc parser tests', () => {
  it('Should create program and evaluate given input file', () => {
    const fileInput: string = path.resolve(
      path.join(__dirname, 'fixture', 'project/src/index.ts')
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
    expect(rootSourceFile).toBeDefined();
  });
});
