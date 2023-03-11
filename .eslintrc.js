module.exports = {
   env: {
      browser: true,
      es2021: true,
      jest: true
   },
   extends: ['plugin:react/recommended', 'airbnb', 'plugin:react/jsx-runtime', 'prettier'],
   overrides: [],
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
   },
   plugins: ['react', 'prettier'],
   rules: {
      'indent': 'off',
      'import/order': 'off',
      'react/jsx-filename-extension': 'off',
      'camelcase': 'off',
      'no-console': 'off',
      'react/prop-types': 'off',
      'no-nested-ternary': 'off',
      'import/no-named-as-default': 'off'
   },
};
