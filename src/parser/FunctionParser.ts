import { NodeParsingStrategy } from './NodeParsingStrategy';
import {
  FunctionDeclaration,
  ParameterDeclaration,
  SyntaxKind,
  TypeReferenceType
} from 'typescript';
import { DocumentationSkeleton } from '../aws-lambda-documentation-extractor';
import { Skeleton } from './Skeleton';

export interface FunctionSkeleton extends Skeleton {
  parameters: Map<string, { type: string; typeArgs?: string }>;
  output: FunctionSkeletonOutput;
  documentation: DocumentationSkeleton;
}

export interface FunctionSkeletonOutput {
  name: string;
  typeArgs: Set<string>;
}

export default class FunctionParser extends NodeParsingStrategy {
  parse(node: FunctionDeclaration): FunctionSkeleton {
    const parameters = new Map<string, { type: string; typeArgs?: string }>();
    const outputTypeArgs = new Set<string>();

    let outputName = null;
    node.forEachChild((child) => {
      if (child.kind === SyntaxKind.Parameter) {
        const param = child as ParameterDeclaration;

        const paramLeftSide = param.getChildAt(0);
        const paramRightSide = param.getChildAt(2);

        if (paramLeftSide.kind !== SyntaxKind.Identifier) {
          throw new Error(
            'Not Implemented: parser does not support parameter destructuring yet'
          );
        }

        if (paramRightSide.kind !== SyntaxKind.TypeReference) {
          throw new Error(
            'Not Implemented: function parameter type must be explicit'
          );
        }

        const rightSide = paramRightSide as TypeReferenceType;
        const typeArgs: Array<string> = [];
        rightSide.typeArguments?.forEach((arg) => {
          typeArgs.push(arg.getText());
        });

        parameters.set(paramLeftSide.getText(), {
          type: paramRightSide.getText(),
          typeArgs: typeArgs.join(',')
        });
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
        'Not Implemented: function with implicit return types are not yet supported'
      );
    }

    return {
      name: node?.name?.text || '',
      parameters: parameters,
      output: { name: outputName, typeArgs: outputTypeArgs },
      documentation: this.documentationExtractor.extract(node)
    };
  }
}
