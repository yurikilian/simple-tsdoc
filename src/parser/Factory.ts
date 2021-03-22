import { SyntaxKind } from 'typescript';
import FunctionParser from './FunctionParser';
import { NodeParsingStrategy } from './NodeParsingStrategy';
import TsDocExtractor from '../tsdoc-extractor';
import InterfaceParser from './InterfaceParser';

const extractor = new TsDocExtractor();
export default class Factory {
  private static strategies: Map<
    SyntaxKind,
    { name: string; strategy: NodeParsingStrategy }
  > = new Map()
    .set(SyntaxKind.FunctionDeclaration, {
      name: 'function',
      strategy: new FunctionParser(extractor)
    })
    .set(SyntaxKind.InterfaceDeclaration, {
      name: 'interface',
      strategy: new InterfaceParser(extractor)
    });

  public static get(
    kind: SyntaxKind
  ): { name: string; strategy: NodeParsingStrategy } | undefined {
    return this.strategies.get(kind);
  }
}
