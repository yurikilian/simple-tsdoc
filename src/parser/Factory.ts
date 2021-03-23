import { SyntaxKind } from 'typescript';
import FunctionParser from './FunctionParser';
import { NodeParsingStrategy } from './NodeParsingStrategy';
import AwsLambdaDocumentationExtractor from '../aws-lambda-documentation-extractor';
import InterfaceParser from './InterfaceParser';

const extractor = new AwsLambdaDocumentationExtractor();
export default class Factory {
  private static strategies: Map<
    SyntaxKind,
    { name: string; strategy: NodeParsingStrategy }
  > = new Map()
    .set(SyntaxKind.FunctionDeclaration, {
      name: 'functions',
      strategy: new FunctionParser(extractor)
    })
    .set(SyntaxKind.InterfaceDeclaration, {
      name: 'interfaces',
      strategy: new InterfaceParser(extractor)
    });

  public static get(
    kind: SyntaxKind
  ): { name: string; strategy: NodeParsingStrategy } | undefined {
    return this.strategies.get(kind);
  }
}
