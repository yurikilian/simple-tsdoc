import { TypescriptNodeParsingStrategy } from './TypescriptNodeParsingStrategy';
import {
  FunctionDeclaration,
  getLeadingCommentRanges,
  ParameterDeclaration,
  SyntaxKind,
  TypeReferenceType
} from 'typescript';

import { TextRange } from '@microsoft/tsdoc';

export interface FunctionSkeleton {
  name: string;
  parameters: Map<string, string>;
  output: FunctionSkeletonOutput;
  comments: TextRange[];
}

export interface FunctionSkeletonOutput {
  name: string;
  typeArgs: Set<string>;
}

export default class FunctionParser implements TypescriptNodeParsingStrategy {
  parse(node: FunctionDeclaration): FunctionSkeleton {
    const nodeText = node.getSourceFile().getText();

    const tsComments = getLeadingCommentRanges(nodeText, node.pos) || [];

    const comments = [];
    if (tsComments.length > 0) {
      for (const comment of tsComments) {
        comments.push(
          TextRange.fromStringRange(nodeText, comment.pos, comment.end)
        );
      }
    }

    const parameters = new Map<string, string>();
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

        parameters.set(paramLeftSide.getText(), paramRightSide.getText());
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
      comments: comments
    };
  }
}
