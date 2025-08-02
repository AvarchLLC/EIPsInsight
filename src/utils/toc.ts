// This example uses simple regex. For robust parsing, use `remark` or `markdown-to-ast`.
export function extractHeadingsFromMarkdown(markdown: string) {
  const headingLines = markdown.split('\n').filter(line => /^#{1,4}\s/.test(line));
  return headingLines.map(line => {
    const depth = line.match(/^#+/)![0].length;
    const text = line.replace(/^#+\s?/, '').trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-'); // Simple slugify
    return { depth, text, id };
  });
}
