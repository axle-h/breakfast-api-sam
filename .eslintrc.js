module.exports = {
  extends: [
    'standard-with-typescript',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  overrides: [{
    files: ['*.ts'],
    rules: {
      "semi": "off",
      "@typescript-eslint/semi": ["error"],
      "no-extra-semi": "off",
      "@typescript-eslint/no-extra-semi": ["error"],
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/member-delimiter-style": ["error", {
        "multiline": {
            "delimiter": "semi",
            "requireLast": true
        },
        "singleline": {
            "delimiter": "semi",
            "requireLast": false
        }
      }]
    }
  }, {
    files: ['*.spec.ts'],
    rules: {
      "@typescript-eslint/no-unused-vars": ["off"],
      "@typescript-eslint/camelcase": ["off"],
      "@typescript-eslint/explicit-function-return-type": ["off"]
    }
  }],
  rules: {
    semi: ["error", "always"],
    "space-before-function-paren": ["error", "never"],
  }
};
