import type { JestConfigWithTsJest } from 'ts-jest/dist/types';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  coveragePathIgnorePatterns: ['<rootDir>/src/controllers/base_controller.ts']
};

export default config;