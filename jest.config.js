module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
        '!src/server.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@schemas/(.*)$': '<rootDir>/src/schemas/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1'
    }
};
