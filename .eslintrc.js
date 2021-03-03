'use strict';

module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'jest': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': "script",
  },
  'rules': {
    "semi": "error"
  },
};
