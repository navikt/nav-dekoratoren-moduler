import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jest from "eslint-plugin-jest";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: [
            "**/build/",
            "**/dist/",
            "**/node_modules/",
            "**/.snapshots/",
            "**/*.min.js",
        ],
    },
    ...compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ),
    {
        plugins: {
            react,
            "@typescript-eslint": typescriptEslint,
            jest,
        },

        languageOptions: {
            parser: tsParser,

            globals: {
                ...jest.environments.globals.globals,
                fetch: false,
                require: false,
            },
        },

        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_$",
                },
            ],

            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-var-requires": 0,
            "@typescript-eslint/ban-types": 0,
        },

        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
