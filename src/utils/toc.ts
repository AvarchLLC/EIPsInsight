// This example uses simple regex. For robust parsing, use `remark` or `markdown-to-ast`.
export function extractHeadingsFromMarkdown(markdown: string) {
  const lines = markdown.split('\n');
  let inFence = false;
  let fenceMarker = '';
  const headingLines = lines.filter(line => {
    const fenceMatch = line.match(/^(```|~~~)/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (marker === fenceMarker) {
        inFence = false;
        fenceMarker = '';
      }
      return false;
    }

    if (inFence) return false;

    return /^\s{0,3}#{1,4}\s/.test(line);
  });

  return headingLines.map(line => {
    const depth = line.match(/#{1,4}/)![0].length;
    const text = line.replace(/^\s{0,3}#+\s?/, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w]+/g, '-')
      .replace(/^-+|-+$/g, ''); // Simple slugify
    return { depth, text, id };
  });
}
