module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'mocha': true,
    'es2020': true
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2020,
    'sourceType': "script",
  },
  'rules': {
    "semi": "error"
  },
};
