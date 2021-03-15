import { DocExcerpt, DocNode } from '@microsoft/tsdoc';

export class Formatter {
  public static renderDocNode(docNode: DocNode): string {
    let result = '';
    if (docNode) {
      if (docNode instanceof DocExcerpt) {
        result += docNode.content.toString();
      }
      for (const childNode of docNode.getChildNodes()) {
        result += Formatter.renderDocNode(childNode);
      }
    }
    return result;
  }
}
