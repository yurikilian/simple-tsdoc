import path from 'path';
import {
  FunctionDeclaration,
  Node,
  ScriptTarget,
  SyntaxKind
} from 'typescript';
import TsProgram from '../../src/ts-compiler';
import FunctionParser from '../../src/parser/FunctionParser';
import TsDocExtractor from '../../src/tsdoc-extractor';

describe('Function Parser DOC Generator', () => {
  it('Should parse a pure function correctly', () => {
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
            const parser = new FunctionParser(new TsDocExtractor());

            const functionSkeleton = parser.parse(child as FunctionDeclaration);
            expect(functionSkeleton.parameters.size).toBe(1);
            expect(functionSkeleton.name).toBe('utilCorrect');
            expect(functionSkeleton.parameters.has('input')).toBe(true);
            expect(functionSkeleton.parameters.get('input')).toBe(
              'FunctionInput'
            );
            expect(functionSkeleton.output.name).toBe('FunctionResponse');
            expect(functionSkeleton.output.typeArgs.size).toBe(0);
            console.log('Function Skeleton: ', functionSkeleton);
          }
        });
      });
  });

  it('Should parse an async function correctly', () => {
    const tsProgram = new TsProgram({
      target: ScriptTarget.ES5
    });

    const compilation = tsProgram.compile([
      path.resolve(path.join(__dirname, '..', 'fixture', 'async-function.ts'))
    ]);

    compilation.program
      .getSourceFiles()
      .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
      .forEach((rootSourceFile) => {
        const root = rootSourceFile as Node;

        root.forEachChild((child) => {
          if (child.kind === SyntaxKind.FunctionDeclaration) {
            const parser = new FunctionParser(new TsDocExtractor());

            const functionSkeleton = parser.parse(child as FunctionDeclaration);
            expect(functionSkeleton.parameters.size).toBe(1);
            expect(functionSkeleton.name).toBe('asyncHandler');
            expect(functionSkeleton.parameters.has('input')).toBe(true);
            expect(functionSkeleton.parameters.get('input')).toBe(
              'FunctionInput'
            );

            expect(functionSkeleton.output.name).toBe('Promise');
            expect(functionSkeleton.output.typeArgs.size).toBe(1);
            expect(
              functionSkeleton.output.typeArgs.has('FunctionResponse')
            ).toBe(true);
            console.info('Function Skeleton: ', functionSkeleton);
          }
        });
      });
  });

  it('Should parse a promise function correctly', () => {
    const tsProgram = new TsProgram({
      target: ScriptTarget.ES5
    });

    const compilation = tsProgram.compile([
      path.resolve(path.join(__dirname, '..', 'fixture', 'promise-function.ts'))
    ]);

    compilation.program
      .getSourceFiles()
      .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
      .forEach((rootSourceFile) => {
        const root = rootSourceFile as Node;

        root.forEachChild((child) => {
          if (child.kind === SyntaxKind.FunctionDeclaration) {
            const parser = new FunctionParser(new TsDocExtractor());

            const functionSkeleton = parser.parse(child as FunctionDeclaration);
            expect(functionSkeleton.parameters.size).toBe(1);
            expect(functionSkeleton.name).toBe('handler');
            expect(functionSkeleton.parameters.has('input')).toBe(true);
            expect(functionSkeleton.parameters.get('input')).toBe(
              'FunctionInput'
            );

            expect(functionSkeleton.output.name).toBe('Promise');
            expect(functionSkeleton.output.typeArgs.size).toBe(1);
            expect(
              functionSkeleton.output.typeArgs.has('FunctionResponse')
            ).toBe(true);
            console.log('Function Skeleton: ', functionSkeleton);
          }
        });
      });
  });

  it('Should not parse a function with implicit function return', () => {
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
            const parser = new FunctionParser(new TsDocExtractor());
            try {
              parser.parse(child as FunctionDeclaration);
              fail('should give error');
            } catch (err) {
              expect(err).toBeDefined();
              expect(err.message).toBe(
                'Not Implemented: function with implicit return types are not yet supported'
              );
            }
          }
        });
      });
  });

  it('Should not parse destructuring parameters', () => {
    const tsProgram = new TsProgram({
      target: ScriptTarget.ES5
    });

    const compilation = tsProgram.compile([
      path.resolve(
        path.join(
          __dirname,
          '..',
          'fixture',
          'function-implicit-parameters-left-side.ts'
        )
      )
    ]);

    compilation.program
      .getSourceFiles()
      .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
      .forEach((rootSourceFile) => {
        const root = rootSourceFile as Node;

        root.forEachChild((child) => {
          if (child.kind === SyntaxKind.FunctionDeclaration) {
            const parser = new FunctionParser(new TsDocExtractor());

            try {
              parser.parse(child as FunctionDeclaration);
              fail('should give error');
            } catch (err) {
              expect(err).toBeDefined();
              expect(err.message).toBe(
                'Not Implemented: parser does not support parameter destructuring yet'
              );
            }
          }
        });
      });
  });

  it('Should not parse types with inline definition', () => {
    const tsProgram = new TsProgram({
      target: ScriptTarget.ES5
    });

    const compilation = tsProgram.compile([
      path.resolve(
        path.join(
          __dirname,
          '..',
          'fixture',
          'function-implicit-parameters-right-side.ts'
        )
      )
    ]);

    compilation.program
      .getSourceFiles()
      .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
      .forEach((rootSourceFile) => {
        const root = rootSourceFile as Node;

        root.forEachChild((child) => {
          if (child.kind === SyntaxKind.FunctionDeclaration) {
            const parser = new FunctionParser(new TsDocExtractor());

            try {
              parser.parse(child as FunctionDeclaration);
              fail('should give error');
            } catch (err) {
              expect(err).toBeDefined();
              expect(err.message).toBe(
                'Not Implemented: function parameter type must be explicit'
              );
            }
          }
        });
      });
  });
});
