import { DocumentationExtractor } from './parser/NodeParsingStrategy';
import { getLeadingCommentRanges, Node } from 'typescript';
import { TextRange, TSDocParser } from '@microsoft/tsdoc';
import { Formatter } from './formatter';

export interface DocumentationSkeleton {
  summary: string;
  remarks?: string;
  parameters: Array<DocumentationSkeletonParameter>;
  returns: string;
}

export interface DocumentationSkeletonParameter {
  name: string;
  description: string;
}

export default class TsDocExtractor extends DocumentationExtractor {
  private tsDocParser = new TSDocParser();

  extract(node: Node): DocumentationSkeleton[] {
    const text = node.getSourceFile().getFullText();

    const tsComments = getLeadingCommentRanges(text, node.pos) || [];
    const comments: DocumentationSkeleton[] = [];
    if (tsComments.length > 0) {
      for (const comment of tsComments) {
        const tsDocComment: DocumentationSkeleton = {
          summary: '',
          parameters: [],
          returns: ''
        };

        const parserContext = this.tsDocParser.parseRange(
          TextRange.fromStringRange(text, comment.pos, comment.end)
        );

        tsDocComment.summary = Formatter.renderDocNode(
          parserContext.docComment.summarySection
        );

        if (parserContext.docComment.remarksBlock) {
          tsDocComment.remarks = Formatter.renderDocNode(
            parserContext.docComment.remarksBlock.content
          );
        }

        for (const paramBlock of parserContext.docComment.params.blocks) {
          tsDocComment.parameters.push({
            name: paramBlock.parameterName,
            description: Formatter.renderDocNode(paramBlock.content)
          });
        }

        if (parserContext.docComment.returnsBlock) {
          tsDocComment.returns = Formatter.renderDocNode(
            parserContext.docComment.returnsBlock.content
          );
        }

        comments.push(tsDocComment);
      }
    }

    return comments;
  }
}
