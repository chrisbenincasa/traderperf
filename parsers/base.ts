import { Execution, Platform } from '../model';

export default abstract class BaseParser {
  abstract platform(): Platform;
  abstract parse(input: string): ParseResult;
}

export interface ParseResult {
  executions: Execution[];
}
