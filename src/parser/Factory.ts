import { SyntaxKind } from 'typescript';
import FunctionParser from './FunctionParser';
import InterfaceParser from './InterfaceParser';
import { NodeParsingStrategy } from './NodeParsingStrategy';

export default class Factory {
  private static strategies: Map<
    SyntaxKind,
    NodeParsingStrategy
  > = new Map().set(SyntaxKind.FunctionDeclaration, new FunctionParser());
  //  .set(SyntaxKind.InterfaceDeclaration, new InterfaceParser())

  public static get(kind: SyntaxKind): NodeParsingStrategy | undefined {
    return this.strategies.get(kind);
  }
}
