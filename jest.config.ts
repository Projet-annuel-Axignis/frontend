import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Chemin vers votre application Next.js
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Gestion des alias de chemin
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  // Désactiver watchman car il peut causer des problèmes avec --watch
  watchman: false
}

// createJestConfig est exporté de cette façon pour garantir que next/jest
// peut charger la configuration Next.js
export default createJestConfig(config); 