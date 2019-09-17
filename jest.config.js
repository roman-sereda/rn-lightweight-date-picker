module.exports = {
  preset: 'react-native',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['./src/colors.js'],
  transform: {
    '\\.(js|jsx)?$': 'babel-jest',
  },
  testMatch: ['<rootDir>__tests__/**/(*.)test.{js, jsx}'], // finds test
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/public/']
};
