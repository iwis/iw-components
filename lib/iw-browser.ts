// ======================================= LIBRARY =========================================
/* Functions for:
 *  - tags:          creating, adding/removing CSS class and attribute, notify about added/removed Nodes, visibility
 *  - tables:        creating and sorting
 *  - trees:         creating
 *  - calendars:     creating
 *  - positioning an element relative to another one
 *  - focus next/previous focusable element
 *
 * based on: https://eloquentjavascript.net (3rd edition) and https://javascript.info
 */

// Returns given string with its first letter capitalized.
function title(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// --- Tag --------------------------------------------------------------------------------

/* Creates and returns HTML tag (DOM Element) of the given name that optionally contains children Nodes specified
 * as rest arguments. If some of arguments are not of Node type then they will be converted to Text nodes.
 *
 * Example usage:
 *   <blockquote id="quote">No book can ever be finished. While working on it we learn just enough to find it immature the moment we turn away from it.</blockquote>
 *
 *   document.getElementById('quote').append(
 *     tag('footer', '—',
 *                   tag('strong', 'Karl Popper'),
 *                   ', preface to the second edition of ',
 *                   tag('em', 'The Open Society and Its Enemies'),
 *                   ', 1950'));
 *
 * TypeScript info:
 *   Function is overloaded using string literal types analogously to Document.createElement (see: TypeScript source > src\lib\dom.generated.d.ts).
 *   Thanks to it, it can return a proper subclass of HTMLElement. HTMLElementTagNameMap is a mapping from HTML element tag name to HTMLElement subclass.
 */
function tag<K extends keyof HTMLElementTagNameMap>(tagName: K,      ...children): HTMLElementTagNameMap[K]
function tag                                       (tagName: string, ...children): HTMLElement {  // eslint-disable-line @typescript-eslint/space-before-function-paren
  const node = document.createElement(tagName)
  for (let child of children) {
    if (!(child instanceof Node))
      child = document.createTextNode(child.toString())
    node.append(child)
  }
  return node
}

/* Adds given CSS class to given element and remove this class in element's siblings.
   Equal to jQuery: $(element1).addClass(CSSClass).siblings().removeClass(CSSClass) */
export function addClassAndRemoveInSiblings(element: Element, CSSClass: string): void {
  for (const sibling of element.parentNode.children)
    sibling.classList.remove(CSSClass)
  element.classList.add(CSSClass)
}

/* Adds given attribute with given value to given element and remove this attribute in element's siblings.
   Equal to jQuery: $(element1).attr(name, value).siblings().removeAttr(name) */
export function setAttributeAndRemoveInSiblings(element: Element, name: string, value: string): void {
  for (const sibling of element.parentNode.children)
    sibling.removeAttribute(name)
  element.setAttribute(name, value)
}

/**
 * Calls callback every time a new Node has been added to the DOM (also during load of HTML page). Can be used to implement
 * missing HTML/CSS features, for example add asterisk to labels of required form fields - see iw-form component.
 * @todo Add a similar function for notifying about removed Nodes, if needed.
 * @todo Do MutationObserver notify also about Text nodes? If yes then also notify about adding them at page load if it is needed.
 */
export function onDOMNodeAdded(callback: (addedNode: Node) => void) {
  // call the callback on the currently existing nodes
  document.querySelectorAll('*').forEach(node => callback(node))

  // call the callback on nodes that will be added in the future
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations)
      for (const node of mutation.addedNodes)
        callback(node)
  })
  observer.observe(document, { childList: true, subtree: true })
}

/**
 * Calls callback every time a DOM changes (also after load of HTML page). Can be used to implement
 * missing HTML/CSS features, for example alter the layout of the page - see iw-timeline component.
 *
 * Probably it doesn't make any performance problems. Why? ES module JavaScript runs not earlier than just before
 * DOMContentLoaded event. So the MutationObserver starts observing DOM, when the whole DOM is already loaded.
 * Normally there shouldn't be too many heavy changes in the DOM after the initial loading of a page.
 * See also: https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom
 *
 * Of course it is always better to use CSS for describing page layout, if it is possible and easy to implement.
 */
export function onDOMChange(callback: () => void) {
  // call the callback on execution of onDOMChange() function (probably during page loading)
  callback()

  // call the callback on any future DOM changes (reported as a bunch of mutations so it is CPU efficient)
  const observer = new MutationObserver(callback)
  observer.observe(document, { attributes: true, characterData: true, childList: true, subtree: true })  // all DOM mutations
}

/* Is the given element completely contained in the browser viewport?
 *
 * Can be used to animate the appearing of HTML elements in this way:
 * ------------ JavaScript ------------------------------------------------------------------------------------
 *   import { isFullyInViewport } from '../iw-browser.js'
 *
 *   // -------------------- Animate the appearing of timeline boxes --------------------------
 *   // Code source: https://www.udemy.com/course/modern-html-css-from-the-beginning/learn/lecture/13285592

 *   const timelineItems = document.querySelectorAll('.iw-timeline__item')
 *
 *   // Add "show" CSS class to every timeline item that is completely contained in the browser viewport.
 *   // CSS should display all timeline items with the "show" CSS class.
 *   function showVisibleTimelineItems() {
 *     for (const timelineItem of timelineItems)
 *       if (isFullyInViewport(timelineItem))
 *         timelineItem.classList.add('show')
 *   }
 *
 *   window.addEventListener('load',   showVisibleTimelineItems)
 *   window.addEventListener('resize', showVisibleTimelineItems)
 *   window.addEventListener('scroll', showVisibleTimelineItems)
 *
 * ------------ CSS ------------------------------------------------------------------------------------
 *   .iw-timeline__item      { visibility: hidden;   // box is hidden if it doesn't have "show" class
 *                             opacity: 0;
 *                             transform: translate( 200px, 0); }
 *
 *   // animate the appearing of the boxes
 *   .iw-timeline__item.show { visibility: visible;  // show the box
 *                             opacity: 1;
 *                             transform: none; }    // move the box
 */
export function isFullyInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect()  // window-relative position
  return (rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= document.documentElement.clientHeight &&
          rect.right  <= document.documentElement.clientWidth)
}

// --- Table --------------------------------------------------------------------------------

export const TEST_OBJECTS_FOR_TABLE_1 = [
  { name: 'John',   age: 5,  city: 'London'  },
  { name: 'Pete',   age: 2,  city: 'Paris'   },
  { name: 'Ann',    age: 12, city: 'Berlin'  },
  { name: 'Eugene', age: 9,  city: 'Paris'   },
  { name: 'Ilya',   age: 1,  city: 'Moscow'  },
]

export const TEST_OBJECTS_FOR_TABLE_2 = [
  { firstName: 'Piotr',   nameDay: 'June 29th' },
  { firstName: 'Zofia',   nameDay: 'May 15th' },
  { firstName: 'Adam',    nameDay: 'December 24th' },
  { firstName: 'Andrzej', nameDay: 'November 30th' },
]

/* Creates and returns HTML table (DOM Element) from given table of objects.
 * HTML table has: one <thead> with column names derived from names of first object properties,
 *                 one <tbody> with values of objects properties.
 *                 CSS class given in cssClass parameter (single class or a space-separated list of classes; no class => '')
 * If cssClass contains 'iw-table--sortable', then <th> cells texts are in <a href="#">...</a> tags.
 * If all values in a column are numerical, then <th> will have data-type="number"
 * otherwise                                     <th> will have data-type="string".
 * If <th> has data-type="number", then column is aligned to the right.
 * todo: doesn't work if an objects doesn't have some property - also consider sorting of empty cells
 */
export function objectTableToHTMLTable(objects: object[], cssClass = ''): HTMLTableElement {
  // table
  const table = tag('table')
  if (cssClass !== '') table.className = cssClass
  const thead = tag('thead')
  const tbody = tag('tbody')
  table.append(thead)
  table.append(tbody)

  // table header
  const fields = Object.keys(objects[0])
  const header = tag('tr')
  for (let col = 0; col < fields.length; col++) {
    const field = fields[col]

    let content: any = title(field)
    if (table.classList.contains('iw-table--sortable')) {
      content = tag('a', content)
      content.href = '#'
      content.draggable = false                // links for sorting table are not draggable

      // Table columns should be iterated using keyboard arrows, not using tab key. But if I uncomment this line
      // the outline will be displayed after clicking on <a> element, so maybe better replace <a> with <span> ??
      // content.tabIndex = (col === 0) ? 0 : -1
    }
    const th = tag('th', content)
    th.draggable = true        // used by iw-table--draggable-cols
    th.dataset.type = 'number' // default type (for sorting and aligning numerical columns to the right)
    header.append(th)
  }
  thead.append(header)

  // table rows
  for (const object of objects) {
    const row = tag('tr')
    for (let col = 0; col < fields.length; col++) {
      const field = fields[col]
      const td = tag('td', object[field])
      if (typeof object[field] !== 'number')
        thead.rows[0].cells[col].dataset.type = 'string'  // change column type to string
      row.append(td)
    }
    tbody.append(row)
  }

  // align numerical columns to the right
  for (let col = 0; col < fields.length; col++) {
    const th = thead.rows[0].cells[col]
    if (th.dataset.type === 'number')
      for (const row of tbody.rows) {
        const td = row.cells[col]
        td.style.textAlign = 'right'
      }
  }

  return table
}

/* In the given HTML table, move column with the given index (0-based):
 *  - after  column with toColumn index if column < toColumn,
 *  - before column with toColumn index if toColumn < column.
 * If column === toColumn then no action is performed.
 * column and toColumn must belong to <0, number_of_columns)
 */
export function moveHTMLTableColumn(table: HTMLTableElement, column: number, toColumn: number) {
  const columnsNumber = table.rows[0].cells.length
  if (column   < 0 || column   >= columnsNumber) throw new RangeError('column argument must belong to <0, number_of_columns)')
  if (toColumn < 0 || toColumn >= columnsNumber) throw new RangeError('toColumn argument must belong to <0, number_of_columns)')

  for (const row of table.rows) {
    if      (column < toColumn) row.cells[toColumn].after(row.cells[column])
    else if (toColumn < column) row.cells[toColumn].before(row.cells[column])
  }
}

/* Sorts <tbody> of given HTML table by column with given index (0-based) and in given direction.
 * If <th> of the column has data-type="string", then the table is sorted alphabetically,
 * if <th> of the column has data-type="number", then the table is sorted numerically.
 * After sorting, information about sort column and direction is stored as <th class="is-sorted-{asc|desc} aria-sort="ascending|descending">
 *
 * The first skipTopRows rows of the <tbody> (possibly its header) aren't sorted.
 * Example: sortHTMLTable(document.getElementById('table'), 0, false)
 * Based on: https://javascript.info/modifying-document#sort-the-table
 */
export function sortHTMLTable(table: HTMLTableElement, column: number, ascending = true, skipTopRows = 0) {
  const th = table.tHead.rows[0].cells[column]

  // function comparing 2 rows of the table
  let compare: (rowA: HTMLTableRowElement, rowB: HTMLTableRowElement) => number  // type of function in TypeScript
  if (th.dataset.type === 'number')  // numerical sorting; todo: empty cells, maybe better parseFloat(...)?
    compare = (rowA, rowB) => Number(rowA.cells[column].innerHTML) - Number(rowB.cells[column].innerHTML)
  else  // alphabetical sorting
    compare = (rowA, rowB) => rowA.cells[column].innerHTML > rowB.cells[column].innerHTML ? 1 : -1

  const sortedRows = Array.from(table.tBodies[0].rows)   // get all <tr> from <tbody> (table always has <tbody>)
                          .slice(skipTopRows)            // skip the header
                          .sort(compare)                 // sort rows by content of proper <td>
  if (!ascending) sortedRows.reverse()
  table.tBodies[0].append(...sortedRows)  // insert nodes in the right order (and remove from the previous position)

  // store information about sort column and direction as <th class="is-sorted-{asc|desc} aria-sort="ascending|descending">
  for (const thCell of table.tHead.rows[0].cells) {  // clear sorting info from all <th> of <thead>
    thCell.classList.remove('is-sorted-asc')
    thCell.classList.remove('is-sorted-desc')
    thCell.removeAttribute('aria-sort')
  }
  th.classList.add(ascending ? 'is-sorted-asc' : 'is-sorted-desc')    // add sorting info to current <th>
  th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending')
}

// --- Tree --------------------------------------------------------------------------------

/* Creates and returns tree represented as <ul> HTML lists from given JavaScript object. Two equivalent implementations:
 *   createTreeDOM (obj) => HTMLUListElement or ''
 *   createTreeHTML(obj) => string
 * obj === {} => ''
 *
 * usage:
 *   let tree = document.querySelector('.tree')
 *   tree.append(createTreeDOM(obj))           // or: tree.innerHTML = createTreeHTML(obj)
 *   addControlsCSSClassesAndARIAToTree(tree)  // optional
 *
 *   obj - JavaScript object of the following format ({} or freely nested,
 *         see https://javascript.info/modifying-document > Create a tree from the object):
 */

/* eslint-disable quote-props */
export const TEST_OBJECTS_FOR_TREE_1 = {
  'Fish': {
    'trout':  {},
    'salmon': {},
  },
  'Tree': {
    'oak':       {},
    'Flowering': {
      'apple tree': {},
      'magnolia':   {},
    },
  },
}

export const TEST_OBJECTS_FOR_TREE_2 = {
  'Animals': {
    'Mammals': {
      'Cows':    {},
      'Donkeys': {},
      'Dogs':    {},
      'Tigers':  {},
    },
    'Other': {
      'Snakes':  {},
      'Birds':   {},
      'Lizards': {},
    },
  },
  'Fishes': {
    'Aquarium': {
      'Guppy':     {},
      'Angelfish': {},
    },
    'Sea': {
      'Sea trout': {},
    },
  },
}
/* eslint-enable quote-props */

/* HTML result:
    <ul>
      <li>Fish
        <ul>
          <li>trout</li>
          <li>salmon</li>
        </ul>
      </li>
      <li>Tree
        <ul>
          <li>oak</li>
          <li>Flowering
            <ul>
              <li>apple tree</li>
              <li>magnolia</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
*/

export function createTreeHTML(obj: object): string {
  let result = ''
  for (const key of Object.keys(obj))
    result += '<li>' + key + createTreeHTML(obj[key]) + '</li>'  // eslint-disable-line prefer-template
  if (result !== '') result = `<ul>${result}</ul>`
  return result
}

export function createTreeDOM(obj: object): HTMLUListElement | '' {
  if (Object.keys(obj).length === 0) return ''
  const ul = document.createElement('ul')
  for (const key of Object.keys(obj)) {
    const li = document.createElement('li')
    li.textContent = key
    li.append(createTreeDOM(obj[key]))
    ul.append(li)
  }
  return ul
}

/* Marks HTML tree with HTML tags, CSS classes and ARIA. The tree can be created for example by createTreeHTML/createTreeDOM functions.
 *  1. For all li tags adds:
 *     - role="treeitem"
 *     - aria-expanded="false"        - if node has          any tree children (tree node can be expanded/collapsed)
 *     - class="iw-tree__node--inner" - if node has          any tree children (tree node can be expanded/collapsed)
 *     - class="iw-tree__node--leaf"  - if node doesn't have any tree children
 *  2. Moves all texts in the given tree into: <span class="iw-tree__title">
 *  3. For all li tags with iw-tree__node--inner class adds <div class="iw-tree__button"></div> as the first child.
 *  4. For the top <ul> tag adds role="tree", and for other <ul> tags adds role="group".
 *
 * Final HTML result:
    <ul role="tree">
      <li class="iw-tree__node--inner" role="treeitem" aria-expanded="false">
        <div  class="iw-tree__button"></div>
        <span class="iw-tree__title">Fish</span>
        <ul role="group">
          <li class="iw-tree__node--leaf" role="treeitem">  <span class="iw-tree__title">trout</span>  </li>
          <li class="iw-tree__node--leaf" role="treeitem">  <span class="iw-tree__title">salmon</span>  </li>
        </ul>
      </li>
      <li class="iw-tree__node--inner" role="treeitem" aria-expanded="false">
        <div  class="iw-tree__button"></div>
        <span class="iw-tree__title">Tree</span>
        <ul role="group">
          <li class="iw-tree__node--leaf" role="treeitem">  <span class="iw-tree__title">oak</span>  </li>
          <li class="iw-tree__node--inner" role="treeitem" aria-expanded="false">
            <div  class="iw-tree__button"></div>
            <span class="iw-tree__title">Flowering</span>
            <ul role="group">
              <li class="iw-tree__node--leaf" role="treeitem">  <span class="iw-tree__title">apple tree</span>  </li>
              <li class="iw-tree__node--leaf" role="treeitem">  <span class="iw-tree__title">magnolia</span>  </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
 *
 * Additionally adds tabindex="0" - see the code.
 */
export function addControlsCSSClassesAndARIAToTree(tree: HTMLElement) {
  for (const li of tree.querySelectorAll('li')) {
    const hasChildren = li.children.length !== 0  // does node have any tree children?

    // add "iw-tree__node--inner/leaf" class
    li.className = (hasChildren) ? 'iw-tree__node--inner' : 'iw-tree__node--leaf'

    li.setAttribute('tabindex', '0')              // NVDA reads tree nodes only if they are focused
    li.setAttribute('role', 'treeitem')           // add role="treeitem" (ARIA)
    if (hasChildren)                              // add aria-expanded="false" (ARIA)
      li.setAttribute('aria-expanded', 'false')

    // add <span class="iw-tree__title">
    const span = document.createElement('span')
    span.className = 'iw-tree__title'
    li.prepend(span)
    span.append(span.nextSibling)  // move the text node into span

    // add <div class="iw-tree__button"> control
    if (hasChildren) {
      const button = document.createElement('div')
      button.className = 'iw-tree__button'
      li.prepend(button)
    }
  }

  for (const ul of tree.querySelectorAll('ul'))
    ul.setAttribute('role', 'group')                     // add role="group" (ARIA)
  tree.querySelector('ul').setAttribute('role', 'tree')  // add role="tree"  (ARIA)
}

// --- Calendar --------------------------------------------------------------------------------

/* Returns table with calendar for given month (1-12) of given year.
 * Example usage: document.getElementById('calendar').innerHTML = createCalendar(2019, 12)
 */
export function createCalendar(year: number, month: number): string {
  let table = '<table><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr>'

  const d = new Date(year, month - 1, 1)  // the first day of the month
  d.setDate(-getDayOfWeek(d) + 1)         // go back getDayOfWeek(d) days to Monday

  while (d.getMonth() === month - 2 || d.getMonth() === month - 1) {
    if (getDayOfWeek(d) === 0) table += '<tr>'  // Monday
    if (d.getMonth() === month - 2) table += '<td></td>'
    else                            table += `<td>${d.getDate()}</td>`
    if (getDayOfWeek(d) === 6) table += '</tr>'  // Sunday
    d.setDate(d.getDate() + 1)  // next day
  }

  return table + '</table>' // eslint-disable-line prefer-template
}

// Returns day number from 0 (Monday) to 6 (Sunday) of the given date.
function getDayOfWeek(date: Date): number {
  let day = date.getDay()
  if (day === 0) day = 7  // make Sunday (0) the last day
  return day - 1
}

// --- Positioning element relative to another one -------------------------------------------------

// Returns document coordinates of given element.
// Based on: https://javascript.info/coordinates
function getCoords(elem: Element) {
  const box = elem.getBoundingClientRect()           // window coordinates of the given element
  return { left:   box.left   + window.pageXOffset,  // add the current scroll
           right:  box.right  + window.pageXOffset,
           top:    box.top    + window.pageYOffset,
           bottom: box.bottom + window.pageYOffset }
}

/* Positions elem element relative to anchor element as said in placement argument.
 * placement     - one of: '{top|bottom|left|right}[-{start|end}]' – position elem at the start/center/end of
 *                 top/bottom/left/right border of anchor
 * stickToWindow - whether elem should stick to the window or to the document
 * space         - space between elem and the anchor (in pixels)
 * If stickToWindow==false and there is no place for a tooltip at the top or at the bottom of anchor, then shows it on the opposite side of anchor.
 * Both elem and anchor already must be in DOM.
 * Used in iw-tooltip-cust.
 */
export function positionAt(anchor: HTMLElement, elem: HTMLElement, placement: string, stickToWindow = false, space = 2) {
  elem.style.position = stickToWindow ? 'fixed' : 'absolute'                               // stick to window or to document
  const anchorCoords = stickToWindow ? anchor.getBoundingClientRect() : getCoords(anchor)  // window- OR document- relative coordinates of anchor

  // assign coordinates
  const [main, aux] = placement.split('-')
  let left: number; let top: number

  if (main === 'top' || main === 'bottom') {
    if      (main === 'top')    top  = anchorCoords.top    - elem.offsetHeight - space
    else if (main === 'bottom') top  = anchorCoords.bottom + space

    if      (aux === 'start')   left = anchorCoords.left
    else if (aux === undefined) left = anchorCoords.left   + (anchor.offsetWidth - elem.offsetWidth) / 2
    else if (aux === 'end')     left = anchorCoords.right  - elem.offsetWidth
    else throw new Error('Incorrect value of "placement" parameter')

    // flip: no place at the bottom? => place at the top
    //       no place at the top?    => place at the bottom
    //       todo: fix for multi-row tooltips
    if (!stickToWindow && main === 'top' && top < window.pageYOffset)
      top = anchorCoords.bottom + space
    else if (!stickToWindow && main === 'bottom' && top + elem.offsetHeight > window.pageYOffset + document.documentElement.clientHeight)
      top = anchorCoords.top    - elem.offsetHeight - space
  }
  else if (main === 'left' || main === 'right') {
    if      (main === 'left')   left = anchorCoords.left   - elem.offsetWidth - space
    else if (main === 'right')  left = anchorCoords.right  + space

    if      (aux === 'start')   top  = anchorCoords.top
    else if (aux === undefined) top  = anchorCoords.top    + (anchor.offsetHeight - elem.offsetHeight) / 2
    else if (aux === 'end')     top  = anchorCoords.bottom - elem.offsetHeight
    else throw new Error('Incorrect value of "placement" parameter')
  }
  else throw new Error('Incorrect value of "placement" parameter')

  elem.style.left = `${left}px`
  elem.style.top  = `${top}px`
}

// ----------------------- Focus next/previous element --------------------------------------

/* Focuses next focusable subelement of the given mainElement. If direction == -1, then focuses previous focusable subelement.
 * If currently focused element is outside of mainElement then nothing happens.
 * If there is no next/previous focusable subelement in mainElement then nothing happens.
 * Note: Function doesn't omit <a>, <button>, <input>, <select>, and <textarea> elements with tabindex="-1", but omits other elements
 * with tabindex="-1".
 * Based on: https://stackoverflow.com/questions/7208161/focus-next-element-in-tab-index
 * Used in: iw-tree
 * Possible problem in Chrome and Firefox: https://stackoverflow.com/questions/34223580/focus-outline-not-shown-when-set-on-anchor-programmatically
 */
export function focusNextElementOf(mainElement: HTMLElement, direction: 1 | -1 = 1) {
  const focusableElements = 'a:not([disabled]), button:not([disabled]), '
                          + 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), '
                          + '[tabindex]:not([disabled]):not([tabindex="-1"])'

  if (document.activeElement) {
    // todo (TypeScript): what type has focusable?
    const focusable = Array.prototype.filter.call(mainElement.querySelectorAll(focusableElements),
                                                  // check for visibility while always include the current activeElement
                                                  element => element.offsetWidth > 0 || element.offsetHeight > 0 ||
                                                             element === document.activeElement)

    const activeElementIndex = focusable.indexOf(document.activeElement)
    if (activeElementIndex === -1) return

    const nextElement = focusable[activeElementIndex + direction]
    if (nextElement)
      nextElement.focus()
  }
}

/* Focuses next sibling of the given element. If direction == -1, then focuses previous sibling.
 * If there is no currently focused element then nothing happens.
 * If the given element has no next/previous sibling then nothing happens.
 * Focus can be gained only by focusable elements: <a>, <iframe>; <input>, <select> and <textarea>
 * fields; <button> (not disabled); any element with tabIndex attribute (even with -1 value!).
 */
export function focusNextSiblingOf(element: HTMLElement, direction: 1 | -1 = 1) {
  if (document.activeElement) {
    const nextElement = (direction === 1) ? element.nextElementSibling : element.previousElementSibling
    if (nextElement && nextElement instanceof HTMLElement)
      nextElement.focus()
  }
}

// --- For educational purposes ------------------------------------------------------------------

/* (For educational purposes)
 * Reimplementation of Document/Element.getElementsByTagName(tagName) method.
 * Difference: Returns array of elements.
 */
export function eduGetElementsByTagName(node: Document | Element, tagName: string): Element[] {
  let found: Element[] = []
  const tagName2 = tagName.toUpperCase()

  for (const childNode of node.childNodes)
    if (childNode instanceof Element) {
      if (childNode.nodeName === tagName2)
        found.push(childNode)
      found = found.concat(eduGetElementsByTagName(childNode, tagName2))
    }
  return found
}
