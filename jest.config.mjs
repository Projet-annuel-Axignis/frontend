import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Chemin vers votre application Next.js
  dir: './',
});

// Configuration Jest personnalisée
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Gestion des alias de chemin
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};

// createJestConfig est exporté de cette façon pour garantir que next/jest
// peut charger la configuration Next.js
export default createJestConfig(customJestConfig); 