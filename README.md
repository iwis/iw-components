The code was created while writing solutions to some tasks available at https://eloquentjavascript.net/ and https://javascript.info/.

Components features
-------------------
 - written as BEM components, so that I could use them easily in the future
 - responsive (todo: except of iw-table and iw-carousel-mul)
 - conformant with WCAG level AA
 - written in SCSS and TypeScript
 - all TypeScript code is in ES modules, so web pages need to run on a web server (local or remote), they will
   not work if simply open from an HDD/SSD
 - work well with and without: `*, *::before, *::after { box-sizing: border-box; }`
 - the coding style is checked with ESLint and stylelint

See Rules.xlsx file for rules that were obeyed.

Some code was copied from Bootstrap - every time I copied the code from Bootstrap I tried to mention it in a comment.

For a general description of components see https://ui-patterns.com/patterns and https://boagworld.com/design/pattern-library/.

CSS coding style
================

Multi-line and single-line
--------------------------
I use [multi-line format] with the following modifications:
 - the first [declaration] of each selector is in the same line as the selector and the opening curly brace `{`,
 - the last declaration of each selector is in the same line as the closing curly brace `}`,
 - all declarations for all rules (or for a group of rules) are aligned horizontally (equally indented),
 - parts of [combinator selectors] (i.e. selectors connected for example with: `> + ~`) and parts of declarations (i.e. properties and values)
   can be aligned horizontally (equally indented), if the separate lines of code are related and thus the alignment makes them easier to understand.
   The alignment of values is described in [CSS Guidelines: Alignment].

So I use a combination of _multi-line_ and _single-line_ coding style. I find it more readable for me, because the code has fewer lines,
and both selectors and declarations are in separate columns.

Sometimes, if several CSS rules are related, I use single-line formatting, for example:

    .iw-btn--primary        { background-color: $value;               color: iw-color-yiq($value); border-color: $value;              }
    .iw-btn--primary:hover  { background-color: darken($value, 7.5%); color: iw-color-yiq($value); border-color: darken($value, 10%); }

See https://css-tricks.com/different-ways-to-format-css/ for different CSS coding styles.

Order of declarations within an individual rule
-----------------------------------------------
I order CSS properties by their position in the box model - from outer properties to inner properties. More precisely I use a modified version of [Concentric CSS]. See [Sass Guidelines: Declaration Sorting], and page 247 of [Beginning HTML5 and CSS3] book by Christopher Murphy, for different types of ordering declarations.

[multi-line format]:                    https://css-tricks.com/different-ways-to-format-css/#article-header-id-0
[declaration]:                          https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#CSS_declarations
[combinator selectors]:                 https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Combinators
[CSS Guidelines: Alignment]:            https://cssguidelin.es/#alignment
[Concentric CSS]:                       https://rhodesmill.org/brandon/2011/concentric-css/
[Beginning HTML5 and CSS3]:             https://books.google.com/books?id=wlzvYt-A5M8C&lpg=PP1&hl=en&pg=PA247#v=onepage&q&f=false
[Sass Guidelines: Declaration Sorting]: https://sass-guidelin.es/#declaration-sorting
