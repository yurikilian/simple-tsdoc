import path from 'path';
import {
  CompilerOptions,
  FunctionDeclaration,
  Node,
  ScriptTarget,
  SyntaxKind
} from 'typescript';
import TsProgram from '../../src/ts-compiler';
import FunctionParser from '../../src/parser/FunctionParser';
import AwsLambdaDocumentationExtractor from '../../src/aws-lambda-documentation-extractor';

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
            const parser = new FunctionParser(
              new AwsLambdaDocumentationExtractor()
            );

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
            const parser = new FunctionParser(
              new AwsLambdaDocumentationExtractor()
            );

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
            const parser = new FunctionParser(
              new AwsLambdaDocumentationExtractor()
            );

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
            const parser = new FunctionParser(
              new AwsLambdaDocumentationExtractor()
            );
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
            const parser = new FunctionParser(
              new AwsLambdaDocumentationExtractor()
            );

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
            const parser = new FunctionParser(
              new AwsLambdaDocumentationExtractor()
            );

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

  it('Should parse function text from the project', () => {
    const fileInput: string = path.resolve(
      path.join(__dirname, '../fixture', 'project/src/index.ts')
    );

    const compilerOptions: CompilerOptions = {
      target: ScriptTarget.ES5
    };
    const tsProgram = new TsProgram(compilerOptions);
    const info = tsProgram.compile([fileInput]);

    const rootSourceFile = info.program.getSourceFile(fileInput);

    if (rootSourceFile) {
      info.program
        .getSourceFiles()
        .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
        .forEach((rootSourceFile) => {
          const root = rootSourceFile as Node;

          root.forEachChild((child) => {
            if (child.kind === SyntaxKind.FunctionDeclaration) {
              const artifact = new FunctionParser(
                new AwsLambdaDocumentationExtractor()
              ).parse(child as FunctionDeclaration);
              if (artifact) {
                for (const comment of artifact.documentation) {
                  expect(comment.summary).toBe('My lambda handler\n\n');
                  expect(comment.remarks).toBe(
                    '\nThis method handles the AWS lambda event received from a SQS\n\n'
                  );
                  expect(comment.parameters.length).toBe(2);
                  expect(comment.returns).toBe(
                    ' The lambda response having all events\n'
                  );
                  console.info('Artifact:', artifact);
                }
              }
            }
          });
        });
    }
  });
});
