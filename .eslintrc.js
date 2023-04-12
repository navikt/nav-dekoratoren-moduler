module.exports = {
    plugins: ["react", "@typescript-eslint", "jest"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    root: true,
    rules: {
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_$",
            },
        ],
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-var-requires": 0,
    },
    env: {
        "jest/globals": true,
    },
    globals: {
        fetch: false,
        require: false,
    },
};
