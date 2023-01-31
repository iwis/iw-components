module.exports = {
  customSyntax: "postcss-scss",
  plugins: [
    "stylelint-scss",  // not needed if extends: 'stylelint-config-sass-guidelines'/'stylelint-config-recommended-scss'
    "stylelint-order",
    "stylelint-declaration-block-no-ignored-properties",
  ],
  extends: [
  ],
  defaultSeverity: "warning",  // my change: all rules are reported as warnings except of some stylelint-config-recommended rules with the { severity: "error" } set
  rules: {
    /* This is the list of rules merged from popular configurations: stylelint-config-standard and stylelint-config-sass-guidelines. I removed duplicates and some rules describing whitespace.
     * Some other rules were disabled by commenting them      and giving the disable reason on the right side of them
     *                    or changed  by changing their value and giving the change  reason on the right side of them in a comment.
     */

    /****************** Possible errors - https://github.com/stylelint/stylelint-config-recommended (25 rules) ************************************/
    
  //"at-rule-no-unknown":                                  [true, { severity: "error" }],  // disabled in stylelint-config-sass-guidelines
    "block-no-empty":                                       true,
    "color-no-invalid-hex":                                [true, { severity: "error" }],
    "comment-no-empty":                                     true,
    "declaration-block-no-duplicate-properties":           [true, { severity: "error", ignore: ["consecutive-duplicates-with-different-values"] }],
    "declaration-block-no-shorthand-property-overrides":   [true, { severity: "error" }],
    "font-family-no-duplicate-names":                       true,
    "font-family-no-missing-generic-family-keyword":       [true, { "ignoreFontFamilies": ["Font Awesome 5 Free"] }],  // changed from "true", because "Font Awesome 5 Free" is a proper font family name
    "function-calc-no-unspaced-operator":                   true,
    "function-linear-gradient-no-nonstandard-direction":   [true, { severity: "error" }],
    "keyframe-declaration-no-important":                    true,
    "media-feature-name-no-unknown":                       [true, { severity: "error" }],
  //"no-descending-specificity":                            true,  // the rule leads to many false positives, because it raises the error even if the declarations doesn't contain common properties; disabled also in Bootstrap
    "no-duplicate-at-import-rules":                        [true, { severity: "error" }],
  //"no-duplicate-selectors":                               true,  // duplicate selectors within a stylesheet are possible - code with duplicated selectors is sometimes easier to understand
    "no-empty-source":                                     [true, { severity: "error" }],
    "no-extra-semicolons":                                 [true, { severity: "error" }],
    "no-invalid-double-slash-comments":                     true,
    "property-no-unknown":                                 [true, { severity: "error" }],
    "selector-pseudo-class-no-unknown":                    [true, { severity: "error" }],
    "selector-pseudo-element-no-unknown":                  [true, { severity: "error" }],
    "selector-type-no-unknown":                            [true, { severity: "error" }],
    "string-no-newline":                                    true,
    "unit-no-unknown":                                     [true, { severity: "error" }],

    /****************** additional rules added by https://github.com/stylelint/stylelint-config-standard *********************************************************/
    
    "at-rule-empty-line-before": ["always", { except: ["blockless-after-same-name-blockless", "first-nested"], ignore: ["after-comment", "inside-block"] }],  // added "inside-block" - ignores at-rules inside a block
    "at-rule-name-case": "lower",
    "at-rule-name-space-after": "always-single-line",
    "at-rule-semicolon-newline-after": "always",
    "block-opening-brace-space-after": "always-single-line",
    "block-closing-brace-empty-line-before": "never",
    "block-closing-brace-newline-after": "always",
    "color-hex-case": "lower",
    "color-hex-length": "short",
    "comment-empty-line-before": ["always", { except: ["first-nested"], ignore: ["stylelint-commands"] }],
    "comment-whitespace-inside": "always",
    "custom-property-empty-line-before": ["always", { except: ["after-custom-property", "first-nested"], ignore: ["after-comment", "inside-single-line-block"] }],
    "declaration-bang-space-after": "never",
    "declaration-block-semicolon-space-before": "never",
    "declaration-block-trailing-semicolon": "always",
    "declaration-colon-space-before": "never",
    "function-comma-newline-after": "always-multi-line",
    "function-comma-space-before": "never",
    "function-max-empty-lines": 0,
    "function-name-case": "lower",
    "function-parentheses-newline-inside": "always-multi-line",
    "function-parentheses-space-inside": "never-single-line",         // set to "never" by stylelint-config-sass-guidelines
    "function-whitespace-after": "always",
    "length-zero-no-unit": true,
    "max-empty-lines": 1,
    "media-feature-colon-space-before": "never",
    "media-feature-name-case": "lower",
    "media-feature-parentheses-space-inside": "never",
    "media-feature-range-operator-space-after": "always",
    "media-feature-range-operator-space-before": "always",
    "media-query-list-comma-newline-after": "always-multi-line",
    "media-query-list-comma-space-after": "always-single-line",
    "media-query-list-comma-space-before": "never",
    "no-eol-whitespace": true,
    "no-missing-end-of-source-newline": true,
  //"number-leading-zero": "always",                                  // a leading zero in fractional numbers < 1 is possible, because people use different styles
  //"number-no-trailing-zeros": true,                                 // trailing zeros in numbers are possible
    "property-case": "lower",
    "selector-attribute-brackets-space-inside": "never",
    "selector-attribute-operator-space-after": "never",
    "selector-attribute-operator-space-before": "never",
    "selector-combinator-space-after": "always",
    "selector-list-comma-newline-after": "always-multi-line",         // changed from "always"; require a newline after ',' of selector list only if it is multiline
    "selector-list-comma-space-before": "never",
    "selector-max-empty-lines": 0,
    "selector-pseudo-class-case": "lower",
    "selector-pseudo-class-parentheses-space-inside": "never",
    "selector-pseudo-element-case": "lower",
    "selector-pseudo-element-colon-notation": "double",
    "selector-type-case": "lower",
    "unit-case": "lower",
    "value-keyword-case": "lower",
    "value-list-comma-newline-after": "always-multi-line",
    "value-list-comma-space-after": "always-single-line",
    "value-list-comma-space-before": "never",
    "value-list-max-empty-lines": 0,
    
    /****************** additional rules included in https://github.com/bjankord/stylelint-config-sass-guidelines ; based on https://sass-guidelin.es/ *******************/
    /* see also https://github.com/stylelint/stylelint-config-standard#suggested-additions */

    // What quotes must be used
    "string-quotes": "double",  // changed from "single"; some people use double (Mozilla doc, Bootstrap, https://github.com/necolas/idiomatic-css), some use single (https://sass-guidelin.es/), and some mix them (https://sass-lang.com/)
    "function-url-quotes": "always",

    // Disallow vendor prefixes (autoprefixer has to be used)
    "at-rule-no-vendor-prefix": true,
    "media-feature-name-no-vendor-prefix": true,
    "selector-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,

    // Control specificity
    "max-nesting-depth": [1, { "ignoreAtRules": ["each", "media", "supports", "include"] }],  // Limit the allowed nesting depth to 1. Ignore: Nested @each, @media, @supports, and @include.
    "selector-max-compound-selectors": 3,

    // Specify acceptable selector, units, properties, functions and words in comments
    "at-rule-disallowed-list": ["debug"],                                 // disallow the use of @debug
  //"color-named": "never",                                               // I use white and black names - what could be wrong with them? https://sass-guidelin.es/#color-formats says nothing about white and black
  //"declaration-property-value-disallowed-list": { "border": ["none"], "border-top": ["none"], "border-right": ["none"], "border-bottom": ["none"], "border-left": ["none"] },  // use 0 instead of none, not so important
    "selector-max-id": 0,                                                 // don't disable it - using ID selectors is really dangerous because they have almost the greatest specificity
  //"selector-no-qualifying-type": true,                                  // I sometimes qualify selectors, e.g. input[type='checkbox'], li.active, in accordance with https://cssguidelin.es/#portability
  //"selector-class-pattern": ["^[a-z0-9\\-]+$", { "message": "Selector should be written in lowercase with hyphens (selector-class-pattern)" } ], // not conformant with BEM classes with underscores e.g. iw-carousel__item, todo: maybe use some plugin with conformant BEM classes?
    "shorthand-property-no-redundant-values": true,                       // Disallow redundant values in shorthand properties.

    // SCSS
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": [true, { severity: "error" }],
    "scss/at-extend-no-missing-placeholder": true,                        // Disallow @extend with missing placeholders.
    "scss/at-import-no-partial-leading-underscore": true,                 // disallow leading '_'            in partial SCSS file name in @import
    "scss/at-import-partial-extension-blacklist": ["scss"],               // disallow '.scss' file extension in partial SCSS file name in @import
    "scss/dollar-variable-colon-space-after": "at-least-one-space",       // changed from "always" - more than one space can be after ":" in "$var1:  ..." declaration => values can be aligned in columns
    "scss/dollar-variable-colon-space-before": "never",                   // disallow whitespace before the colon in "$var1: ..." declaration
    "scss/at-function-pattern":         "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$", // SCSS functions
    "scss/at-mixin-pattern":            "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$", // SCSS mixins
    "scss/percent-placeholder-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$", // SCSS %-placeholders
    "scss/dollar-variable-pattern": "^[_]?[a-z]+([a-z0-9-]+[a-z0-9]+)?$", // SCSS variables
    "scss/selector-no-redundant-nesting-selector": true,                  // Disallow redundant nesting selectors (&).

    // Order - see https://sass-guidelin.es/#css-ruleset
    // changed: commented mixin calls => mixin calls can appear anywhere - sometimes it is more logical to include them somewhere else than in the place specified by default
    "order/order": [[ "custom-properties",                                          // declaration of custom properties     e.g. .class1 { --var1: white;                    }
                      "dollar-variables",                                           // declaration of local variables       e.g. .class1 { $var1: white;                     }
                      { "type": "at-rule", "name": "extend"                     },  // nested @extend                       e.g. .class1 { @extend .class2                   }
                    //{ "type": "at-rule", "name": "include", "hasBlock": false },  // mixin calls without a content block  e.g. .class1 { @include mixin1(...);             }
                      "declarations",                                               //|CSS declarations                     e.g. .class1 { color: white;                     }
                    //{ "type": "at-rule", "name": "include", "hasBlock": true  },  // mixin calls with a content block     e.g. .class1 { @include mixin2 { color: white; } }
                      "rules" ]],                                                   //|nested rules                         e.g. .class1 { .class2 { ... }                   }

    "order/properties-order": [[
      /* Modified Concentric CSS order - https://rhodesmill.org/brandon/2011/concentric-css/
       * Changes:
       *  - removed 'font-smoothing' and 'osx-font-smoothing'
       *  - "page-break-..." changed to "break-..."
       *
       *  - "animation[-...]" moved near "transition[-...]", because they are similar
       *  - "border-radius" moved after "border-color"
       *  - "cursor" moved to the end because it isn't a part of a web page
       *
       *  - order of the elements in the following groups changed to more logical in my opinion:
       *      grid
       *      flex (was alphabetical)
       *      transform (was alphabetical)
       *      transition (was alphabetical)
       *      animation: only moved 'animation-name' to the end of the animation group, because it is the suggested
       *                 position if using shorthand property
       *      background (was alphabetical)
       *      "[...-]top, [...-]right, [...-]bottom, [...-]left" changed to: "[...-]left [...-]right, [...-]top, [...-]bottom"
       *
       *  - other changes
       *
       * Todo: missing 'filter' property
       *
       * This ordering is for the default "box-sizing: content-box". If you are using "box-model: border-box",
       * then you can move the "width" and "height" up above the "border" property.
       */

      'all',
      'box-sizing',

      // 1. Directions about where and how the box is placed

      // position
      'float', 'clear',
      // 'position' is before display - it seems to be more important, because:
      //   1) 'position' can move a whole grid container,
      //   2) 'position' can remove a grid child from a grid layout ("position: absolute/fixed", but not "position: relative")
      'position', 'left', 'right', 'top', 'bottom',

      // grid, flex and column layout - container item (properties describing the outside layout):
      'grid-area', 'grid-row', 'grid-row-start', 'grid-row-end', 'grid-column',  'grid-column-start', 'grid-column-end',
      'flex', 'flex-grow', 'flex-shrink', 'flex-basis',
      'order',
      'justify-self', 'align-self',

      'display',  // after properties of grid, flex and column layout item, because if both are present, then display describes the inside layout, e.g. { justify-self: end; display: flex; }

      // grid, flex and column layout - container (properties describing the inside layout):
      'grid', 'grid-template', 'grid-template-areas', 'grid-template-rows', 'grid-template-columns', 'grid-auto-rows', 'grid-auto-columns', 'grid-auto-flow',
      'gap', 'row-gap', 'column-gap', 'grid-gap', 'grid-row-gap', 'grid-column-gap',  // grid[-...]-gap are deprecated
      'flex-flow', 'flex-direction', 'flex-wrap',
      'justify-content', 'justify-items', 'align-content', 'align-items',

      'columns', 'column-gap', 'column-fill', 'column-rule', 'column-rule-width', 'column-rule-style', 'column-rule-color', 'column-span', 'column-count', 'column-width',  // todo: I didn't read about it

      'transform', 'transform-origin', 'transform-style', 'backface-visibility', 'perspective', 'perspective-origin',

      'transition', 'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay',

      'animation', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count',
      'animation-direction', 'animation-fill-mode', 'animation-play-state', 'animation-name',

      // 2. Visibility: can the box be seen?
      'visibility', 'opacity', 'z-index',

      // 3. Box model - layers from outside to inside
      'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom',

      'outline', 'outline-offset', 'outline-width', 'outline-style', 'outline-color',

      'border',        'border-left',       'border-right',       'border-top',       'border-bottom',
      'border-width',  'border-left-width', 'border-right-width', 'border-top-width', 'border-bottom-width',
      'border-style',  'border-left-style', 'border-right-style', 'border-top-style', 'border-bottom-style',
      'border-color',  'border-left-color', 'border-right-color', 'border-top-color', 'border-bottom-color',
      'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',

      'border-image', 'border-image-source', 'border-image-width', 'border-image-outset', 'border-image-repeat', 'border-image-slice',

      'box-shadow',

      'background', 'background-color', 'background-image', 'background-repeat', 'background-attachment',
      'background-position', 'background-size', 'background-origin', 'background-clip',

      'padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom',  // (padding and content BOTH get the background color)

      // 4. Content dimensions and scrollbars
      'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
      'overflow', 'overflow-x', 'overflow-y',
      'resize',

      // 5. Components - table, list
      'list-style', 'list-style-type', 'list-style-image', 'list-style-position',  // (done)

      'border-collapse', 'border-spacing', 'empty-cells', 'table-layout', 'caption-side',  // tables

      // 6. Textual content
      'color',

      'font', 'font-family', 'font-size', 'font-size-adjust', 'line-height', 'font-weight', 'font-style', 'font-variant', 'font-stretch',

      // content
      'content',  // it is below font-family because we often need to choose font-family for Font Awesome icons
      'counter-reset', 'counter-increment',
      'quotes',

      // text-alignment & decoration
      'direction',
      'tab-size',
      'text-align', 'text-align-last', 'text-justify',
      'text-indent',
      'text-decoration', 'text-decoration-line', 'text-decoration-style', 'text-decoration-color',
      'text-transform',
      'text-rendering',
      'text-shadow',
      'text-overflow',

      'vertical-align',

      // text-spacing
      'letter-spacing',
      'word-spacing',
      'white-space',
      'word-break',
      'word-wrap',

      'break-before', 'break-after', 'break-inside',

      // 7. Other
      'cursor',
    ]],

    /**********************************************/
    // https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties
    "plugin/declaration-block-no-ignored-properties": [true, { severity: "error" }],
  }
}
