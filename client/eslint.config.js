import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist'], // Ignore the dist folder
  },
  {
    files: ['**/*.{js,jsx}'], // Match JavaScript and JSX files
    languageOptions: {
      ecmaVersion: 2020, // ECMAScript version
      globals: {
        ...globals.browser, // Browser global variables
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
        sourceType: 'module', // Enable ES modules
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    plugins: {
      react, // React plugin
      'react-hooks': reactHooks, // React Hooks plugin
    },
    rules: {
      ...js.configs.recommended.rules, // Recommended JS rules
      ...react.configs.recommended.rules, // Recommended React rules
      ...react.configs['jsx-runtime'].rules, // React JSX runtime rules
      ...reactHooks.configs.recommended.rules, // Recommended React Hooks rules

      // Custom rules
      'react/jsx-no-target-blank': 'off',
      'react/react-in-jsx-scope': 'off', // React 17+ does not require React in scope
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }], // Warn for JSX in non-JSX files
      'react/prop-types': 'off', // Disable prop-types validation
      'react/no-children-prop': 'off',
      indent: ['error', 2], // Enforce 2 spaces for indentation
      'no-restricted-imports': 'off',
      'no-mixed-spaces-and-tabs': 'off',
    },
  },
];
