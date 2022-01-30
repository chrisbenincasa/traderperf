import { Platform } from '../model';
import BaseParser from './base';
import IbkrParser from './ibkrParser';

export default class ParserFactory {
  static getParser = (platform: Platform): BaseParser | undefined => {
    switch (platform) {
      case Platform.INTERACTIVE_BROKERS:
        return new IbkrParser();
    }
  };
}
