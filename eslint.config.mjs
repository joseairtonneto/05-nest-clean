import { defineConfig } from 'eslint/config'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    extends: compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'no-new': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      'prettier/prettier': [
        'error',
        {
          printWidth: 95,
          tabWidth: 2,
          useTabs: false,
          trailingComma: 'all',
          singleQuote: true,
          arrowParens: 'avoid',
          semi: false,
        },
      ],
    },
  },
])
