import { Node } from 'typescript';
import { Skeleton } from './Skeleton';

export abstract class DocumentationExtractor {
  abstract extract(node: Node): any;
}

export abstract class NodeParsingStrategy {
  protected readonly documentationExtractor: DocumentationExtractor;

  constructor(documentationExtractor: DocumentationExtractor) {
    this.documentationExtractor = documentationExtractor;
  }

  abstract parse(node: Node): Skeleton;
}
