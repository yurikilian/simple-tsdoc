import { SyntaxKind } from 'typescript';
import FunctionParser from './FunctionParser';
import InterfaceParser from './InterfaceParser';
import { TypescriptNodeParsingStrategy } from './TypescriptNodeParsingStrategy';

export default class Factory {
  private static strategies: Map<
    SyntaxKind,
    TypescriptNodeParsingStrategy
  > = new Map()
    .set(SyntaxKind.FunctionDeclaration, new FunctionParser())
    .set(SyntaxKind.InterfaceDeclaration, new InterfaceParser());

  public static get(
    kind: SyntaxKind
  ): TypescriptNodeParsingStrategy | undefined {
    return this.strategies.get(kind);
  }
}
