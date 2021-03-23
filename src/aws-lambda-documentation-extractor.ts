import { DocumentationExtractor } from './parser/NodeParsingStrategy';
import { getLeadingCommentRanges, Node } from 'typescript';
import {
  TextRange,
  TSDocConfiguration,
  TSDocParser,
  TSDocTagDefinition,
  TSDocTagSyntaxKind
} from '@microsoft/tsdoc';
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

export default class AwsLambdaDocumentationExtractor extends DocumentationExtractor {
  private readonly tsDocParser;

  private static lambdaModifier: TSDocTagDefinition = new TSDocTagDefinition({
    tagName: '@LambdaFunction',
    syntaxKind: TSDocTagSyntaxKind.ModifierTag
  });

  constructor() {
    super();

    const configuration = new TSDocConfiguration();
    configuration.addTagDefinitions([
      AwsLambdaDocumentationExtractor.lambdaModifier
    ]);

    this.tsDocParser = new TSDocParser(configuration);
  }

  extract(node: Node): DocumentationSkeleton | undefined {
    const text = node.getSourceFile().getFullText();

    const tsComments = getLeadingCommentRanges(text, node.pos) || [];

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

        if (
          parserContext.docComment.modifierTagSet.hasTag(
            AwsLambdaDocumentationExtractor.lambdaModifier
          )
        ) {
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

          return tsDocComment;
        }
      }
    }
  }
}
