export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/__tests__/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
