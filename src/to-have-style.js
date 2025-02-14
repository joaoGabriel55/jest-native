import { StyleSheet } from 'react-native';
import { matcherHint } from 'jest-matcher-utils';
import { diff } from 'jest-diff';
import chalk from 'chalk';
import { checkReactElement } from './utils';

function printoutStyles(styles) {
  return Object.keys(styles)
    .sort()
    .map((prop) =>
      Array.isArray(styles[prop])
        ? `${prop}: ${JSON.stringify(styles[prop], null, 2)};`
        : `${prop}: ${styles[prop]};`,
    )
    .join('\n');
}

/**
 * Narrows down the properties in received to those with counterparts in expected
 */
function narrow(expected, received) {
  return Object.keys(received)
    .filter((prop) => expected[prop])
    .reduce(
      (obj, prop) =>
        Object.assign(obj, {
          [prop]: received[prop],
        }),
      {},
    );
}

// Highlights only style rules that were expected but were not found in the
// received computed styles
function expectedDiff(expected, elementStyles) {
  const received = narrow(expected, elementStyles);

  const diffOutput = diff(printoutStyles(expected), printoutStyles(received));
  // Remove the "+ Received" annotation because this is a one-way diff
  return diffOutput.replace(`${chalk.red('+ Received')}\n`, '');
}

export function toHaveStyle(element, style) {
  checkReactElement(element, toHaveStyle, this);

  const elementStyle = element.props.style ?? {};

  const expected = Array.isArray(style) ? StyleSheet.flatten(style) : style;
  const received = Array.isArray(elementStyle) ? StyleSheet.flatten(elementStyle) : elementStyle;

  return {
    pass: Object.entries(expected).every(([prop, value]) => this.equals(received?.[prop], value)),
    message: () => {
      const matcher = `${this.isNot ? '.not' : ''}.toHaveStyle`;
      return [matcherHint(matcher, 'element', ''), expectedDiff(expected, received)].join('\n\n');
    },
  };
}
