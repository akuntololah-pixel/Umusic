const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', '.expo/**', 'assets/**'],
  },
  ...require('eslint-config-expo/flat'),
  {
    files: ['jest.setup.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: { jest: 'readonly', Buffer: 'readonly', console: 'readonly', process: 'readonly', require: 'readonly', module: 'writable' },
    },
  },
  {
    rules: {
      'import/no-named-as-default': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
