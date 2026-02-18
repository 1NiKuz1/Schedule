module.exports = {
    root: true,

    env: {
        browser: true,
        es6: true,
        node: true
    },

    parser: "@typescript-eslint/parser",

    parserOptions: {
        sourceType: "module"
    },

    plugins: ["eslint-plugin-jsdoc", "@typescript-eslint", "prettier", "unicorn"],

    ignorePatterns: ["package.json", "tsconfig.json"],

    rules: {
        "prettier/prettier": "error",
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "default",
                format: ["camelCase"]
            },
            {
                selector: "variable",
                format: ["camelCase", "UPPER_CASE"]
            },
            {
                selector: "typeLike",
                format: ["PascalCase"]
            },
            {
                selector: "classProperty",
                format: ["camelCase", "UPPER_CASE"]
            },
            {
                selector: "classProperty",
                modifiers: ["private"],
                filter: {
                    regex: "^[A-Z].",
                    match: false
                },
                format: ["camelCase"],
                trailingUnderscore: "allow"
            },
            {
                selector: "classProperty",
                modifiers: ["protected"],
                filter: {
                    regex: "^[A-Z].",
                    match: false
                },
                format: ["camelCase"],
                trailingUnderscore: "allow"
            },
            {
                selector: "enumMember",
                format: ["camelCase", "UPPER_CASE", "PascalCase"]
            },
            {
                selector: "objectLiteralProperty",
                format: null
            },
            {
                selector: "objectLiteralMethod",
                format: ["camelCase", "PascalCase"]
            },
            {
                selector: "typeProperty",
                format: ["camelCase", "PascalCase"]
            },
            {
                selector: ["enumMember", "objectLiteralProperty", "objectLiteralMethod"],
                format: null,
                modifiers: ["requiresQuotes"]
            }
        ],
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": ["error", { ignoreDeclarationMerge: true }],
        "capitalized-comments": ["error", "always", { ignorePattern: "prettier-ignore" }],
        "curly": "error",
        "dot-notation": "error",
        "eqeqeq": ["error", "always", { "null": "ignore" }],
        "guard-for-in": "error",
        "jsdoc/check-alignment": "off",
        "jsdoc/check-indentation": "error",
        "linebreak-style": ["error", "unix"],
        "max-len": ["error", { code: 140, ignoreUrls: true }],
        "no-bitwise": "off",
        "no-caller": "error",
        "no-console": ["error", { allow: ["log", "warn", "error"] }],
        "no-debugger": "error",
        "no-empty": "error",
        "no-empty-function": "error",
        "no-eval": "error",
        "no-new-wrappers": "error",
        "no-labels": "error",
        "quotes": ["error", "double", { avoidEscape: true }],
        "radix": "error",
        "spaced-comment": ["error", "always", { markers: ["/"] }],
        "unicorn/no-instanceof-array": "error",
        "no-var": "error",
        "prefer-const": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "^([a-z]|\\W)",
                "ignoreRestSiblings": true
            }
        ]
    },

    extends: ["plugin:storybook/recommended"]
};
