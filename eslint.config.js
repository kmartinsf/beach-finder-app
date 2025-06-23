import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactNative from 'eslint-plugin-react-native';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      import: eslintPluginImport,
      'react-hooks': eslintPluginReactHooks,
      'react-native': eslintPluginReactNative,
    },
    rules: {
      'import/no-unresolved': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
];
