type Block =
  | { type: 'heading'; level: number; content: string; startLine: number }
  | { type: 'paragraph'; lines: string[]; startLine: number }
  | { type: 'code'; lang?: string; lines: string[]; startLine: number; isFinished: boolean }

type LineType = 'heading' | 'fence' | 'text'

type ParseState = {
  blocks: Block[];
  currentBlock: Block | null;
}

function classifyLine(line: string): LineType {
  if (/^#{1,6} /.test(line)) return 'heading';
  if (/^```/.test(line)) return 'fence';
  return 'text'
}

function processLine(state: ParseState, line: string, lineNumber: number): ParseState {
  const lineType = classifyLine(line);

  switch (lineType) {
    case 'heading':
      const match = line.match(/^(#{1,6}) (.+)$/);
      const level = match![1].length;
      const content = match![2];
      return {
        blocks: [
          ...state.blocks,
          ...(state.currentBlock ? [state.currentBlock] : []),
          { type: 'heading', level, content, startLine: lineNumber },
        ],
        currentBlock: null,
      };
    case 'fence':
      const fenceMatch = line.match(/^``` ?(.+)?/);
      const lang = fenceMatch![1];

      // start code
      if (!state.currentBlock) {
        return {
          blocks: state.blocks,
          currentBlock: { type: 'code', lang: lang, lines: [], startLine: lineNumber, isFinished: false },
        };
      }
      // end paragraph and start code
      if (state.currentBlock.type === 'paragraph') {
        return {
          blocks: [...state.blocks, state.currentBlock],
          currentBlock: { type: 'code', lang: lang, lines: [], startLine: lineNumber, isFinished: false },
        };
      }

      // finish code
      if (state.currentBlock.type === 'code') {
        return {
          blocks: [...state.blocks, { ...state.currentBlock, isFinished: true }],
          currentBlock: null,
        };
      }

      throw new Error(`Unexpected currentBlock type: ${state.currentBlock.type}`);
    case 'text':
      if (!state.currentBlock) {
        return {
          blocks: state.blocks,
          currentBlock: { type: 'paragraph', lines: [line], startLine: lineNumber },
        };
      }

      if (state.currentBlock.type === 'paragraph' || state.currentBlock.type === 'code') {
        return {
          blocks: state.blocks,
          currentBlock: {
            ...state.currentBlock,
            lines: [...state.currentBlock.lines, line],
          },
        };
      }

      throw new Error(`Unexpected currentBlock type: ${state.currentBlock.type}`);
  }
}

export function parse(input: string): Block[] {
  const lines: string[] = input.split('\n');
  const initialState: ParseState = {
    blocks: [],
    currentBlock: null,
  };

  const finalState = lines.reduce(processLine, initialState);
  return [...finalState.blocks, ...(finalState.currentBlock ? [finalState.currentBlock] : [])];
}
