const path = require("path");

module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(expo|@expo|expo-router|expo-modules-core|expo-asset|expo-constants|expo-linking|react-native|@react-native|react-navigation|@react-navigation)/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  rootDir: ".",
  moduleDirectories: ["node_modules", path.join(__dirname, ".")],
};
