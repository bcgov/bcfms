import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier/recommended';
import vueConfigPrettier from '@vue/eslint-config-prettier';
import html from '@html-eslint/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    // js
    pluginJs.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'warn',
        },
    },
    // ts
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    // vue
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    // html
    {
        ...html.configs['flat/recommended'],
        files: ['**/*.html', '**/*.htm'],
        plugins: {
            '@html-eslint': html,
        },
        rules: {
            '@html-eslint/no-duplicate-attrs': 'off',
            '@html-eslint/require-closing-tags': 'off',
            '@html-eslint/no-extra-spacing-attrs': 'off',
            '@html-eslint/require-li-container': 'off',
            '@html-eslint/no-obsolete-tags': 'off',
            '@html-eslint/no-inline-styles': 'warn',
            '@html-eslint/require-button-type': 'warn',
            // Removed non-existent rule: '@html-eslint/attr-hyphen-case'
        },
    },
    {
        rules: {
            ...vueConfigPrettier.rules,
            'prettier/prettier': [
                'warn',
                {
                    singleQuote: true,
                },
            ],
            'vue/valid-attribute-name': 'off',
            'vue/valid-model-definition': 'off',
            'vue/no-v-model-argument': 'off',
            'vue/no-v-for-template-key': 'off',
            'vue/no-v-for-template-key-on-child': 'error',
            'vue/multi-word-component-names': 'off',
            'vue/attribute-hyphenation': 'off',
            'vue/no-v-html': 'off',
            'vue/v-on-event-hyphenation': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        ignores: ['node_modules', '.nuxt', '.output', 'dist'],
    },
    // prettier
    prettier,
    {
        rules: {
            'prettier/prettier': ['warn', { singleQuote: true }],
        },
    },
];
