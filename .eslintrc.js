module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    "plugin:vue/vue3-recommended",
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "vue/html-self-closing": [
      "error",
      {
        html: { normal: "never", void: "always" },
        svg: "always",
        math: "always",
      },
    ],
    "vue/html-closing-bracket-newline": [2, { multiline: "never" }],
    // "vue/singleline-html-element-content-newline": [
    //   "error",
    //   {
    //     ignoreWhenNoAttributes: true,
    //     ignoreWhenEmpty: true,
    //     ignores: ["pre", "textarea", ...INLINE_ELEMENTS],
    //   },
    // ],
  },
};
