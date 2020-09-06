/* eslint-disable no-undef */
module.exports = {
    root          : true,
    parser        : "@typescript-eslint/parser",
    plugins       : [
        "@typescript-eslint",
    ],
    extends       : [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    rules         : {
        "@typescript-eslint/triple-slash-reference": "off",
        "@typescript-eslint/no-namespace"          : "off",
        "@typescript-eslint/no-explicit-any"       : "off",
        "no-unused-vars"                           : "off",
        "@typescript-eslint/no-unused-vars"        : "off",
        "no-unused-labels"                         : "off"
    }
};
