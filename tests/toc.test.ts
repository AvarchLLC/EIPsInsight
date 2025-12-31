import test from 'node:test';
import assert from 'node:assert/strict';
import { extractHeadingsFromMarkdown } from '../src/utils/toc';

test('extracts headings depth 1–4', () => {
  const markdown = [
    '# Heading 1',
    '## Heading 2',
    '### Heading 3',
    '#### Heading 4',
  ].join('\n');

  const headings = extractHeadingsFromMarkdown(markdown);

  assert.deepEqual(headings.map(heading => heading.depth), [1, 2, 3, 4]);
  assert.deepEqual(headings.map(heading => heading.text), [
    'Heading 1',
    'Heading 2',
    'Heading 3',
    'Heading 4',
  ]);
});

test('ignores headings deeper than 4', () => {
  const markdown = [
    '# Heading 1',
    '##### Heading 5',
    '###### Heading 6',
    '#### Heading 4',
  ].join('\n');

  const headings = extractHeadingsFromMarkdown(markdown);

  assert.deepEqual(headings.map(heading => heading.text), ['Heading 1', 'Heading 4']);
});

test('generates a slug id from heading text', () => {
  const markdown = '# My Heading!';

  const headings = extractHeadingsFromMarkdown(markdown);

  assert.equal(headings[0].id, 'my-heading');
});
