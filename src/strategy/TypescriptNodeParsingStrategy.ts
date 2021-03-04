import { Node } from 'typescript';

export interface TypescriptNodeParsingStrategy {
  parse(node: Node): void;
}
