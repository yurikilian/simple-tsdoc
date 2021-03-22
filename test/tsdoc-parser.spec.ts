import path from 'path';
import { CompilerOptions, Node, ScriptTarget } from 'typescript';
import TsProgram, { TsCompileStatus } from '../src/ts-compiler';

import Factory from '../src/parser/Factory';
import { Skeleton } from '../src/parser/Skeleton';

describe('Simple TSDoc Processor Tests', function () {
  it('Should parse all text ranges', () => {
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
    const documented: { [key: string]: Array<Skeleton> } = {
      function: [],
      interface: []
    };
    if (rootSourceFile) {
      info.program
        .getSourceFiles()
        .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
        .forEach((rootSourceFile) => {
          const root = rootSourceFile as Node;

          root.forEachChild((child) => {
            const parser = Factory.get(child.kind);
            if (parser) {
              documented[parser.name].push(parser.strategy.parse(child));
            }
          });
        });
    }

    console.log('Documented artifacts: ', documented);
  });
});
