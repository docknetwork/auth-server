const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  moduleNameMapper: {
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],

    // Handle module aliases (this will be automatically configured for you soon)
    '^@/components/(.*)$': '<rootDir>/components/$1',

    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

const jestConfig = async () => {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  return {
    ...nextJestConfig,
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      }
    },
    transformIgnorePatterns: [
      "/node_modules/(?!@polkadot|@babel|@docknetwork)"
    ],
    globals: {
      Uint8Array: Uint8Array,
      ArrayBuffer: ArrayBuffer
    },
  };
};

module.exports = jestConfig;
