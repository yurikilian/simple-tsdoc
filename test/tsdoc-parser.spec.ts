import path from 'path';
import {
  CompilerOptions,
  FunctionDeclaration,
  Node,
  ScriptTarget,
  SyntaxKind
} from 'typescript';
import TsProgram, { TsCompileStatus } from '../src/ts-compiler';
import { parse } from '../src/tsdoc-parser';
import FunctionParser from '../src/parser/FunctionParser';

describe('TSDOC Parser Test', function () {
  it('Should parse text ranges', () => {
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

    if (rootSourceFile) {
      info.program
        .getSourceFiles()
        .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
        .forEach((rootSourceFile) => {
          const root = rootSourceFile as Node;

          root.forEachChild((child) => {
            if (child.kind === SyntaxKind.FunctionDeclaration) {
              const artifact = new FunctionParser().parse(
                child as FunctionDeclaration
              );
              if (artifact) {
                for (const comment of artifact.comments) {
                  const parsedComment = parse(comment);

                  expect(parsedComment.summary).toBe('My lambda handler\n\n');
                  expect(parsedComment.remarks).toBe(
                    '\nThis method handles the AWS lambda event received from a SQS\n\n'
                  );
                  expect(parsedComment.parameters.length).toBe(2);
                  expect(parsedComment.output).toBe(
                    ' The lambda response having all events\n'
                  );
                }
              }
            }
          });
        });
    }
  });
});