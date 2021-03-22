import { NodeParsingStrategy } from './NodeParsingStrategy';
import {
  InterfaceDeclaration,
  SyntaxKind,
  TypeReferenceType
} from 'typescript';

interface InterfaceSkeleton {
  name: string;

  members: InterfaceSkeletonMember[];
}

interface InterfaceSkeletonMember {
  name: string;
  type: string;
  typeArguments?: string;
}

export default class InterfaceParser extends NodeParsingStrategy {
  parse(node: InterfaceDeclaration): any {
    const members: Array<InterfaceSkeletonMember> = [];
    node.members.forEach((member) => {
      const paramLeftSide = member.getChildAt(0);
      const paramRightSide = member.getChildAt(2);

      if (paramRightSide.kind === SyntaxKind.TypeReference) {
        const typeReference = paramRightSide as TypeReferenceType;
        if (
          typeReference.typeArguments &&
          typeReference.typeArguments.length > 0
        ) {
          const typeArguments: Array<string> = [];
          typeReference.typeArguments.forEach((value) => {
            typeArguments.push(value.getFullText());
          });

          members.push({
            name: paramLeftSide.getText(),
            type: paramRightSide.getFirstToken()?.getText() || '',
            typeArguments: typeArguments.join(',')
          });
        }
      } else {
        members.push({
          name: paramLeftSide.getText(),
          type: paramRightSide.getText()
        });
      }
    });

    return members;
  }
}
