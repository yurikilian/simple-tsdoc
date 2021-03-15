import { Node } from 'typescript';

export interface NodeParsingStrategy {
  parse(node: Node): any;
}
