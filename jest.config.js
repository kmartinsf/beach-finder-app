const path = require("path");

module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(expo|@expo|expo-router|expo-modules-core|expo-asset|expo-constants|expo-linking|react-native|@react-native|react-navigation|@react-navigation)/)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": path.resolve(__dirname, "./$1")
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  }
};