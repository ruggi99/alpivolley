import { fixupConfigRules } from "@eslint/compat";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/.next", "**/out"],
}, ...fixupConfigRules(compat.extends(
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
)), {
    plugins: {
        "simple-import-sort": simpleImportSort,
        "sort-destructure-keys": sortDestructureKeys,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
            ...globals.node,
        },

        ecmaVersion: 13,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        "prefer-const": "error",
        "react/prop-types": "off",
        "react/self-closing-comp": "error",
        "react/jsx-no-useless-fragment": "error",
        "react/jsx-curly-brace-presence": ["error", "never"],
        "react/jsx-fragments": "error",

        "react/jsx-no-target-blank": ["error", {
            allowReferrer: true,
            warnOnSpreadAttributes: true,
            forms: true,
        }],

        "react/function-component-definition": [2, {
            namedComponents: "function-declaration",
        }],

        "react/display-name": ["error"],
        "react-hooks/exhaustive-deps": "error",

        "simple-import-sort/imports": ["error", {
            groups: [
                ["^\\u0000"],
                ["^node:"],
                ["^react$"],
                ["^next/"],
                ["^@?\\w"],
                ["components", "hooks", "lib", "pages", "public", "styles"],
                ["^"],
                ["^\\."],
            ],
        }],

        "simple-import-sort/exports": "error",
        "sort-destructure-keys/sort-destructure-keys": "error",
    },
}, {
    files: ["**/*.js", "**/*.jsx"],
}];