module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@firebase/(.*)$': '<rootDir>/node_modules/@firebase/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-safe-area-context|@firebase)/)',
  ],
  setupFiles: [
    './jest.setup.js'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};