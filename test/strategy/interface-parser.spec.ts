import path from 'path';
import {
  InterfaceDeclaration,
  Node,
  ScriptTarget,
  SyntaxKind
} from 'typescript';
import TsProgram from '../../src/ts-compiler';
import InterfaceParser from '../../src/parser/InterfaceParser';

describe('Interface Parser Test', () => {
  it('Should parse an interface correctly', () => {
    const tsProgram = new TsProgram({
      target: ScriptTarget.ES5
    });

    const compilation = tsProgram.compile([
      path.resolve(path.join(__dirname, '..', 'fixture', 'interface.ts'))
    ]);

    compilation.program
      .getSourceFiles()
      .filter((sourceFile) => !sourceFile.fileName.includes('node_modules'))
      .forEach((rootSourceFile) => {
        const root = rootSourceFile as Node;

        root.forEachChild((child) => {
          if (child.kind === SyntaxKind.InterfaceDeclaration) {
            const parser = new InterfaceParser();
            const interfaceSkeleton = parser.parse(
              child as InterfaceDeclaration
            );

            // console.log('interface skeleton', interfaceSkeleton);
          }
        });
      });
  });
});
