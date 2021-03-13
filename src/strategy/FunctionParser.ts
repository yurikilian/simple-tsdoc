import { TypescriptNodeParsingStrategy } from './TypescriptNodeParsingStrategy';
import {
  FunctionDeclaration,
  ParameterDeclaration,
  SyntaxKind,
  TypeReferenceType
} from 'typescript';

export interface FunctionSkeleton {
  name: string;
  parameters: Set<string>;
  output: FunctionSkeletonOutput;
}

export interface FunctionSkeletonOutput {
  name: string;
  typeArgs: Set<string>;
}

export default class FunctionParser implements TypescriptNodeParsingStrategy {
  parse(node: FunctionDeclaration): FunctionSkeleton {
    const parameters = new Set<string>();
    const outputTypeArgs = new Set<string>();

    let outputName = null;
    node.forEachChild((child) => {
      if (child.kind === SyntaxKind.Parameter) {
        const param = child as ParameterDeclaration;

        const paramLeftSide = param.getChildAt(0);
        const paramRightSide = param.getChildAt(2);
        console.log('Param Left side:', paramLeftSide.getText());
        console.log('Param Right side:', paramRightSide.getText());
        //TODO: handle left side and right side of the parameters
        // only accept explicit types
        parameters.add(paramLeftSide.getText());
      } else if (child.kind === SyntaxKind.TypeReference) {
        const output = child as TypeReferenceType;
        output.forEachChild((outChild) => {
          if (outChild.kind === SyntaxKind.Identifier) {
            outputName = outChild.getText();
          }

          if (outChild.kind === SyntaxKind.TypeReference) {
            outputTypeArgs.add(outChild.getText());
          }
        });
      }
    });

    if (!outputName) {
      throw new Error(
        'Not Implemented: function with anonymous return types are not yet supported'
      );
    }

    return {
      name: node?.name?.text || '',
      parameters: parameters,
      output: { name: outputName, typeArgs: outputTypeArgs }
    };
  }
}
