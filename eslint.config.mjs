import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["**/build/", "**/dist/", "**/node_modules/", "**/.snapshots/", "**/*.min.js"],
    },
    js.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
        plugins: {
            react,
            "@typescript-eslint": typescriptEslint,
            vitest,
        },

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...vitest.environments.env.globals,
                fetchMock: "readonly",
                NodeJS: "readonly",
            },
        },

        rules: {
            ...typescriptEslint.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                },
            ],

            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-var-requires": 0,
            "@typescript-eslint/ban-types": 0,
            "react/react-in-jsx-scope": 0,
            "react/prop-types": 0,
        },

        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
