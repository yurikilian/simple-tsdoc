import { TextRange, TSDocConfiguration, TSDocParser } from '@microsoft/tsdoc';
import { Formatter } from './formatter';

export interface ParsedComment {
  summary: string;
  remarks?: string;
  parameters: string[];
  output: string;
}

export function parse(comment: TextRange): ParsedComment {
  const tsDocConfiguration = new TSDocConfiguration();
  const parser = new TSDocParser(tsDocConfiguration);
  const context = parser.parseRange(comment);
  const tsDocComment = context.docComment;

  return {
    summary: Formatter.renderDocNode(tsDocComment.summarySection),
    remarks: tsDocComment.remarksBlock
      ? Formatter.renderDocNode(tsDocComment.remarksBlock.content)
      : '',
    parameters: (tsDocComment.params.blocks || []).map((param) =>
      Formatter.renderDocNode(param.content)
    ),
    output: tsDocComment.returnsBlock
      ? Formatter.renderDocNode(tsDocComment.returnsBlock.content)
      : ''
  };
}
