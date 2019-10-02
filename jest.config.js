module.exports = {
  preset: 'react-native',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['./src/colors.js', './src/components/Swiper'],
  transform: {
    '\\.(js|jsx)?$': 'babel-jest',
  },
  testMatch: ['<rootDir>__tests__/**/(*.)test.{js, jsx}'], // finds test
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/public/']
};
