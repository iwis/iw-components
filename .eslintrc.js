module.exports = {
  root: true,
  // -------------------------------------------
  parser: '@typescript-eslint/parser',  // use the previously installed parser; allows ESLint to understand TypeScript syntax (required!)
  parserOptions: {
    project: ['./tsconfig.json'],       // required for "type-aware linting"
  },
  // -------------------------------------------
  plugins: [
    '@typescript-eslint',               // load the previously installed plugin; allows to use the rules within the codebase
    'only-warn',                        // all errors and warnings will be reported as warnings (eslint-plugin-only-warn), a useful hack because Airbnb style rules reports only errors
  ],
  extends: [
    'airbnb-typescript/base',           // use Airbnb config
  //'standard-with-typescript',         // use https://standardjs.com config - if I use it, then comment Airbnb config
  ],
  rules: {
    // "Airbnb" means that it is like in Airbnb config
    // "STD"    means that it is like in https://standardjs.com config

    // ========================================================================================================================
    // === change Airbnb rules that I don't like; rules are grouped in the same way like on: https://eslint.org/docs/rules/ ===
    // ========================================================================================================================

    // ====== Possible Errors ==================================================================================================
    // These rules relate to possible syntax or logic errors in JavaScript code

    // (no changed rules)

    // ====== Best Practices ===================================================================================================
    // These rules relate to better ways of doing things to help you avoid problems

    // curly braces can be omited when a block contains only one statement
    //   if (condition1)
    //     num = num + 1
    // => less code
    "curly": "off",

    // allow multiple spaces in a row (applies to spaces that aren't used for indentation)
    // => elements of code lines can be aligned into columns
    "no-multi-spaces": "off",

    // it isn't a problem in TypeScript, because such function should define a return type; => increased readablity
    "no-return-assign": "off",

    // In the body of f1(param1, param2) { ... } function:
    //  - don't allow to reassign parameters              i.e. param1      = 10 (like in Airbnb); because it can cause optimization issues, especially in V8, according to Airbnb,
    //  - allow to mutate objects passed in as parameters i.e. param1.key1 = 10 (like in STD);    it is OK in my opinion, see also: https://stackoverflow.com/questions/35637770/.
    //    Maybe in React/Vue/Angular there should be no need to mutate DOM objects at all.
    "no-param-reassign": ["error", { "props": false }],

    // ====== Variables =========================================================================================================
    // These rules relate to variable and function declarations

    // STD; a function can be declared after its usage (will be hoisted, sometimes easier to understand code flow), and I don't use var
    // => increased readability
    "@typescript-eslint/no-use-before-define": "off",
    
    // ====== Stylistic Issues ==================================================================================================
    // These rules relate to style guidelines, and are therefore quite subjective

    // ------ elements of code lines can be aligned into columns - I find such code more readable --------------

    "no-spaced-func":                       "off",  // deprecated, replaced by "func-call-spacing", but still in Airbnb
    "@typescript-eslint/func-call-spacing": "off",  // writing "fun1   ()" is valid
    
    // indentation - like in Airbnb, but with the changes described below
    // todo: offsetTernaryExpressions introduced in ESLint 7 - maybe it will be helpful in iw-browser.ts in function positionAt(...)
    "@typescript-eslint/indent": ["error", 2, { "SwitchCase":          1,
                                                "VariableDeclarator":  "first",                   // all variables/constant of one let/const declaration should be aligned with the 1st variable/constant; changed
                                                "outerIIFEBody":       1,
                                                "MemberExpression":    "off",                     // disable checking for indentation in method chaning; changed
                                                "FunctionDeclaration": { "parameters": 1, "body": 1 },
                                                "FunctionExpression":  { "parameters": 1, "body": 1 },
                                                "CallExpression":      { "arguments": "first" },  // all arguments of the function call should be aligned with the 1st argument; changed
                                                "ArrayExpression":     1,
                                                "ObjectExpression":    "first",                   // all properties in the object should be aligned with the 1st property; changed
                                                "ImportDeclaration":   1,
                                                "flatTernaryExpressions": false,
                                                "ignoreComments": false,
                                                "ignoredNodes":   ["JSXElement", "JSXElement > *", "JSXAttribute", "JSXIdentifier", "JSXNamespacedName", "JSXMemberExpression", "JSXSpreadAttribute", "JSXExpressionContainer",
                                                                   "JSXOpeningElement", "JSXClosingElement", "JSXFragment", "JSXOpeningFragment", "JSXClosingFragment", "JSXText", "JSXEmptyExpression", "JSXSpreadChild"] }],

    //spacing around the colon in object literal properties: like Airbnb and Standard, but the values of multiline object literals are aligned horizontally
    "key-spacing": ["error", { "singleLine": { "beforeColon": false, "afterColon": true                   },
                               "multiLine":  { "beforeColon": false, "afterColon": true, "align": "value" } }],

    // ---------- less code or fewer lines of code ------------------------------------------

    "nonblock-statement-body-position": "off",  // STD; an "if (condition1) num = num + 1" can be in one line or can be splitted into two lines
    
    "object-curly-newline": ["error", { "consistent": true }],  // ESLint default; consistent line breaks inside braces of object literals

    "@typescript-eslint/semi": ["error", "never"],  // STD; statements don't end with semicolons; the problems described in https://eslint.org/docs/rules/semi and
                                                    // https://standardjs.com/rules.html#semicolons are catched by TypeScript - I hope that TS catches all such issues

    // ------------- other changes to increase readablity -------------------------------------------------

    // max length of a code line; like in Airbnb but: a) longer, b) doesn't ignore lines containing a string literal (I don't
    // want it because otherwise a line won't be checked even if it contains a very short string literal)
    // or disable like in STD
    "max-len": ["error", 170, 2, { "ignoreComments": false, "ignoreRegExpLiterals": true }],

    /* I find "stroustrup" style more readable than "1tbs" style. Using 2 spaces for identation in JavaScript also contributes to this in my opinion.
        "1tbs":
          if (main === 't' || main === 'b') {
            if      (main === 't') top  = anchorCoords.top    - elem.offsetHeight
            else if (main === 'b') top  = anchorCoords.bottom
            ...
          } else if (main === 'l' || main === 'r') {
            if      (main === 'l') left = anchorCoords.left   - elem.offsetWidth
            else if (main === 'r') left = anchorCoords.right
            ...
          }
        
        "stroustrup":
          if (main === 't' || main === 'b') {
            if      (main === 't') top  = anchorCoords.top    - elem.offsetHeight
            else if (main === 'b') top  = anchorCoords.bottom
            ...
          }
          else if (main === 'l' || main === 'r') {
            if      (main === 'l') left = anchorCoords.left   - elem.offsetWidth
            else if (main === 'r') left = anchorCoords.right
            ...
          }
     */
    "@typescript-eslint/brace-style": ["error", "stroustrup", { "allowSingleLine": true }],

    "one-var": "off",  // variables can be declared in one declaration or in a few declarations

    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],  // there is no reason to disallow i++ in for expressions: "for (let i = 0; i < 10; i++) ..."

    // like in Airbnb, but "for..of" loops are allowed because:
    //  - Mozilla says "for..of" can be used: https://developer.mozilla.org/en-US/docs/MDN/Contribute/Guidelines/Code_guidelines/JavaScript#General_purpose_loopin
    //  - "The primary reason it ["for..of"] is disabled in this [Airbnb] guide is that Symbols can not be polyfilled, thus we forbid Symbols, thus Symbol.iterator is unavailable,
    //     thus for..of is useless in a generic sense." However, I don't support IE anymore. See https://github.com/airbnb/javascript/issues/1271#issuecomment-635007744
    //  - see https://stackoverflow.com/questions/49420891/why-should-foreach-be-preferred-over-regular-iterators (it shouldn't be preferred)
    //  - many people think "for..of" should be allowed
    // original description in Airbnb documentation: https://airbnb.io/javascript/#iterators--nope
    "no-restricted-syntax": ["error", { "selector": "ForInStatement",   "message": "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array." },
                                      { "selector": "LabeledStatement", "message": "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand." },
                                      { "selector": "WithStatement",    "message": "`with` is disallowed in strict mode because it makes code impossible to predict and optimize." }],

    // an operator in a multiline expression can be at the end or at the beginning of a line
    // (sometimes it looks better at the beginning, and sometimes it looks better at the end)
    "operator-linebreak": "off",

    // ------ other --------------------------------------------------------------------------

    "linebreak-style": "off",  // STD; a code line can end with '\r\n' or '\n'

    // ====== ECMAScript 6 ====================================================================
    // These rules relate to ES6, also known as ES2015
    
    "no-confusing-arrow": "off",  //STD, it isn't confusing in TypeScript, if I declare a variable to have a function type

    // Airbnb and STD uses: "arrow-parens": ["error", "always"], but I prefer using parenthesis in an arrow function only if it has a block body
    // (used previously by Airbnb, it is still in Airbnb doc: see https://airbnb.io/javascript/#arrows--one-arg-parens on 2020-05-27 )
    // It isn't problematic in Typescript.
    "arrow-parens": ["error", "as-needed", { "requireForBlockBody": true }],

    // STD; destructuring seems to be an overkill for a single variable, so I don't want it to be always required, at least now
    // see https://www.reddit.com/r/javascript/comments/9w7jcl/what_is_the_point_of_always_destructuring/
    "prefer-destructuring": "off",

    // ====== Plugins ==========================================================================

    // In "import { ... } from '../iw-browser.js'" the .js extension is required.
    // Comment it if a bundle is used for example Webpack.
    "import/extensions": ["error", "ignorePackages"],

    // by default if a module exports only one function or constant it has to be "default"; now it can be exported without marking as "default"
    // todo: optionally comment it
    "import/prefer-default-export": "off",

    // ========================================================================================================================
    // === change some https://standardjs.com rules that I don't like  ========================================================
    // ========================================================================================================================
    
    // Airbnb; no space between the name of function and its paren in definition of a named function
    "@typescript-eslint/space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],

    // Airbnb; comma after the last element of a multiline array or object literal => git diff is easier
    "comma-dangle": ["error", { "arrays": "always-multiline", "objects": "always-multiline", "imports": "always-multiline", "exports": "always-multiline", "functions": "always-multiline" }],
  }
};
