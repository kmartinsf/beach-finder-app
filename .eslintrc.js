module.exports = {
  root: true,
  extends: ['expo', 'plugin:import/recommended', 'plugin:import/typescript'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'import/no-unresolved': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
