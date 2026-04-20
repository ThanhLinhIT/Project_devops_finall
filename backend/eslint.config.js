import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/__tests__/**'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: true,
        it: true,
        test: true,
        expect: true,
        vi: true,
        beforeEach: true,
        afterEach: true,
      },
    },
  },
];
