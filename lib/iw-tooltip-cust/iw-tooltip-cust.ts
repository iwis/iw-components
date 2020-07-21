import { positionAt } from '../iw-browser.js'

let iwTooltip: HTMLElement
let iwTooltipTodoHandle: number

document.addEventListener('mouseover', (event) => {
  const target = <HTMLElement>event.target
  if (target.dataset.tooltip)                          // mouse comes over an element with data-tooltip
    showTooltip2(target, target.dataset.tooltip, 600)  // show the tooltip after 600 ms
})

document.addEventListener('mouseout', (event) => {
  const target = <HTMLElement>event.target
  if (target.dataset.tooltip) removeTooltip2()         // mouse leaves an element with data-tooltip
})

document.addEventListener('focusin', (event) => {
  const target = <HTMLElement>event.target
  if (target.dataset.tooltip)                          // element with data-tooltip receives focus
    showTooltip2(target, target.dataset.tooltip, 0)    // show the tooltip immediately
})

document.addEventListener('focusout', (event) => {
  const target = <HTMLElement>event.target
  if (target.dataset.tooltip) removeTooltip2()         // element with data-tooltip looses focus
})

/* Shows a tooltip with the given HTML content on the top of the given element, after an optional delay (in ms). */
function showTooltip2(element: HTMLElement, html: string, delay: number = 0) {
  removeTooltip2()
  if (delay === 0)
    iwTooltip = showTooltip(element, html, 'top-start', 'iw-tooltip-cust')
  else
    iwTooltipTodoHandle = setTimeout(() => { iwTooltip = showTooltip(element, html, 'top-start', 'iw-tooltip-cust') }, delay)
}

/* Removes the tooltip if it is shown or triggered to be shown. */
function removeTooltip2() {
  clearTimeout(iwTooltipTodoHandle)
  if (iwTooltip)
    removeTooltip(iwTooltip)
}

// ------------------------------------------------------------------------------------------------------------------------------

/* Creates and returns a tooltip with the given HTML code, positioned relative to anchor element as said in placement argument.
 * placement     - one of: '{top|bottom|left|right}[-{start|end}]' – position elem at the start/center/end of
 *                 top/bottom/left/right border of anchor
 * cssClasses    - the CSS classes that the tooltip will have
 * removeTime    - number of ms after which the note will be deleted (0 - permanent)
 * Based on: https://javascript.info/coordinates
 * Usage: showTooltip(document.getElementById('elem1'), 'Hello, world!', 'top-start')
 */
function showTooltip(anchor: HTMLElement, html: string, placement: string, cssClasses = '', removeTime = 0): HTMLElement {
  const tooltip = document.createElement('div')
  tooltip.className = cssClasses
  tooltip.innerHTML = html
  document.body.append(tooltip)

  positionAt(anchor, tooltip, placement)

  // add accessibility info
  tooltip.setAttribute('role', 'tooltip')
  tooltip.id = 'iw-tooltip-1'
  anchor.setAttribute('aria-describedby', 'iw-tooltip-1')

  if (removeTime !== 0) setTimeout(() => removeTooltip(tooltip), removeTime)
  return tooltip
}

/* Removes given tooltip. */
function removeTooltip(tooltip: HTMLElement) {
  tooltip.remove()

  // remove accessibility info
  const anchor = document.querySelector('[aria-describedby="iw-tooltip-1"]')
  if (anchor)
    anchor.removeAttribute('aria-describedby')
}
