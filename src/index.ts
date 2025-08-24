import { parse } from './parser';

// Test 1: Simple heading
console.log('Test 1: Simple heading');
console.log(JSON.stringify(parse('# Hello World'), null, 2));
console.log('---');

// Test 2: Multiple headings
console.log('Test 2: Multiple headings');
console.log(JSON.stringify(parse('# H1\n## H2\n### H3'), null, 2));
console.log('---');

// Test 3: Simple paragraph
console.log('Test 3: Simple paragraph');
console.log(JSON.stringify(parse('This is a paragraph\nwith two lines'), null, 2));
console.log('---');

// Test 4: Paragraph ending with empty line
console.log('Test 4: Paragraph with empty line');
console.log(JSON.stringify(parse('First paragraph\n\nSecond paragraph'), null, 2));
console.log('---');

// Test 5: Code block
console.log('Test 5: Code block');
console.log(JSON.stringify(parse('```\nconst x = 1;\n```'), null, 2));
console.log('---');

// Test 6: Code block with language
console.log('Test 6: Code block with language');
console.log(JSON.stringify(parse('```javascript\nconst x = 1;\n```'), null, 2));
console.log('---');

// Test 7: Unclosed code block
console.log('Test 7: Unclosed code block');
console.log(JSON.stringify(parse('```\nconst x = 1;'), null, 2));
console.log('---');

// Test 8: Mixed content
console.log('Test 8: Mixed content');
const mixed = `# Title

First paragraph
with multiple lines

## Subtitle

\`\`\`javascript
const x = 1;
console.log(x);
\`\`\`

Final paragraph`;
console.log(JSON.stringify(parse(mixed), null, 2));
