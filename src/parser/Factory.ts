import { SyntaxKind } from 'typescript';
import FunctionParser from './FunctionParser';
import { NodeParsingStrategy } from './NodeParsingStrategy';
import TsDocExtractor from '../tsdoc-extractor';

export default class Factory {
  private static strategies: Map<
    SyntaxKind,
    NodeParsingStrategy
  > = new Map().set(
    SyntaxKind.FunctionDeclaration,
    new FunctionParser(new TsDocExtractor())
  );

  //  .set(SyntaxKind.InterfaceDeclaration, new InterfaceParser())

  public static get(kind: SyntaxKind): NodeParsingStrategy | undefined {
    return this.strategies.get(kind);
  }
}
