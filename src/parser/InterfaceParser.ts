import { NodeParsingStrategy } from './NodeParsingStrategy';
import {
  InterfaceDeclaration,
  SyntaxKind,
  TypeReference,
  TypeReferenceType
} from 'typescript';

interface InterfaceSkeleton {
  name: string;

  members: InterfaceSkeletonMember[];
}

interface InterfaceSkeletonMember {
  name: string;
  type: string;
  collection: boolean;
}

function isCollection(kind: SyntaxKind) {
  return (
    kind === SyntaxKind.ArrayLiteralExpression ||
    kind === SyntaxKind.ArrayType ||
    kind === SyntaxKind.TupleType ||
    kind === SyntaxKind.SetKeyword
  );
}

export default class InterfaceParser implements NodeParsingStrategy {
  parse(node: InterfaceDeclaration): void {
    console.log('Interface found: ', node.name.escapedText);

    const members: Array<InterfaceSkeletonMember> = [];
    node.members.forEach((member) => {
      const paramLeftSide = member.getChildAt(0);
      const paramRightSide = member.getChildAt(2);

      members.push({
        name: paramLeftSide.getText(),
        type: '',
        collection: false
      });

      if (isCollection(paramRightSide.kind)) {
        console.log('is collection');
      }

      console.log('\tMember: ', paramLeftSide.getText());
      console.log('\tparamRightSide: ', paramRightSide.getText());
    });
  }
}
