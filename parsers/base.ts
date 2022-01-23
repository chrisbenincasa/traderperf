import { Execution } from '../model';

export default abstract class BaseParser {
  abstract parse(input: string): ParseResult;
}

export interface ParseResult {
  executions: Execution[];
}
