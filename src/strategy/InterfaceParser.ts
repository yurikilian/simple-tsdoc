import { TypescriptNodeParsingStrategy } from './TypescriptNodeParsingStrategy';
import { InterfaceDeclaration } from 'typescript';

export default class InterfaceParser implements TypescriptNodeParsingStrategy {
  parse(node: InterfaceDeclaration): void {
    console.log('Interface found: ', node.name.escapedText);

    node.members.forEach((member) => {
      console.log('\tMember: ', member.getText());
    });
  }
}
