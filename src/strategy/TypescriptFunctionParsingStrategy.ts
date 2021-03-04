import { TypescriptNodeParsingStrategy } from './TypescriptNodeParsingStrategy';
import {
  SyntaxKind,
  ParameterDeclaration,
  FunctionDeclaration
} from 'typescript';

export default class TypescriptFunctionParsingStrategy
  implements TypescriptNodeParsingStrategy {
  parse(node: FunctionDeclaration): void {
    console.log('Found function: ', node?.name?.text);

    node.forEachChild((child) => {
      if (child.kind === SyntaxKind.Parameter) {
        const param = child as ParameterDeclaration;
        console.log('PARAM NAME: ', param.name.getText());
      }
    });
  }
}
