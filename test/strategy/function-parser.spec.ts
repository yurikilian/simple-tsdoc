import path from 'path';
import {
  FunctionDeclaration,
  Node,
  ScriptTarget,
  SyntaxKind
} from 'typescript';
import TsProgram from '../../src/ts-compiler';
import FunctionParser from '../../src/strategy/FunctionParser';

describe('Function Parser DOC Generator', () => {
  it('Should throw exception given no explicit function return', () => {
    const tsProgram = new TsProgram({
      target: ScriptTarget.ES5
    });

    const compilation = tsProgram.compile([
      path.resolve(
        path.join(__dirname, '..', 'fixture', 'function-implict-return.ts')
      )
    ]);

    compilation.program
      .getSourceFiles()
      .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
      .forEach((rootSourceFile) => {
        const root = rootSourceFile as Node;

        root.forEachChild((child) => {
          if (child.kind === SyntaxKind.FunctionDeclaration) {
            const parser = new FunctionParser();
            try {
              parser.parse(child as FunctionDeclaration);
              fail('should give error');
            } catch (err) {
              expect(err).toBeDefined();
              expect(err.message).toBe(
                'Not Implemented: function with anonymous return types are not yet supported'
              );
            }
          }
        });
      });
  });

  it('Should throw exception given implicit input parameter declaration', () => {
    const tsProgram = new TsProgram({
      target: ScriptTarget.ES5
    });

    const compilation = tsProgram.compile([
      path.resolve(
        path.join(__dirname, '..', 'fixture', 'function-implicit-parameters.ts')
      )
    ]);

    compilation.program
      .getSourceFiles()
      .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
      .forEach((rootSourceFile) => {
        const root = rootSourceFile as Node;

        root.forEachChild((child) => {
          if (child.kind === SyntaxKind.FunctionDeclaration) {
            const parser = new FunctionParser();

            try {
              parser.parse(child as FunctionDeclaration);
              fail('should give error');
            } catch (err) {
              expect(err).toBeDefined();
              expect(err.message).toBe(
                'Not Implemented: functions with implicit parameters type are not supported yet'
              );
            }
          }
        });
      });
  });

  it('Should parse given correct function declarations', () => {
    const tsProgram = new TsProgram({
      target: ScriptTarget.ES5
    });

    const compilation = tsProgram.compile([
      path.resolve(path.join(__dirname, '..', 'fixture', 'function.ts'))
    ]);

    compilation.program
      .getSourceFiles()
      .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
      .forEach((rootSourceFile) => {
        const root = rootSourceFile as Node;

        root.forEachChild((child) => {
          if (child.kind === SyntaxKind.FunctionDeclaration) {
            const parser = new FunctionParser();

            const functionSkeleton = parser.parse(child as FunctionDeclaration);
            expect(functionSkeleton.parameters.size).toBe(1);
            console.log('Function Skeleton: ', functionSkeleton);
          }
        });
      });
  });
});
