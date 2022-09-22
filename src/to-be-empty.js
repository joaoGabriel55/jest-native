import { matcherHint } from 'jest-matcher-utils';
import { checkReactElement, isEmpty, printElement } from './utils';

/**
 * @deprecated This function is deprecated. You should use `toBeEmptyElement`
 *
 * */
export function toBeEmpty(element) {
  checkReactElement(element, toBeEmpty, this);

  return {
    pass: isEmpty(element?.props?.children),
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEmpty`, 'element', ''),
        '',
        'Received:',
        printElement(element),
      ].join('\n');
    },
  };
}
