import { SyntaxKind } from 'typescript';
import TypescriptFunctionParsingStrategy from './TypescriptFunctionParsingStrategy';
import TypescriptInterfaceParsingStrategy from './TypescriptInterfaceParsingStrategy';
import { TypescriptNodeParsingStrategy } from './TypescriptNodeParsingStrategy';

export default class TypescriptParsingStrategyFactory {
  private static strategies: Map<
    SyntaxKind,
    TypescriptNodeParsingStrategy
  > = new Map()
    .set(
      SyntaxKind.FunctionDeclaration,
      new TypescriptFunctionParsingStrategy()
    )
    .set(
      SyntaxKind.InterfaceDeclaration,
      new TypescriptInterfaceParsingStrategy()
    );

  public static get(
    kind: SyntaxKind
  ): TypescriptNodeParsingStrategy | undefined {
    return this.strategies.get(kind);
  }
}
