import { addClassAndRemoveInSiblings, setAttributeAndRemoveInSiblings } from '../iw-browser.js'

document.addEventListener('click', (event) => {
  const target = <HTMLElement>event.target
  if (target.matches('.iw-nav__item')) {
    event.preventDefault()      // don't scroll the page
    selectNavItem(target)       // selects clicked iw-nav__item and the panel associated with it (i.e. target.dataset.panelId)
  }
})

/* Selects the given iw-nav__item and the panel associated with it.
 * Nav items with 'iw-nav__item--disabled' class cannot be selected.
 */
function selectNavItem(navItem: HTMLElement) {
  if (navItem.classList.contains('iw-nav__item--disabled')) return

  // activate navItem nav item and deactivate other nav items
  addClassAndRemoveInSiblings(navItem, 'iw-nav__item--active')
  setAttributeAndRemoveInSiblings(navItem, 'aria-selected', 'true')  // ARIA

  // activate panel of the navItem nav item and deactivate other panels
  const panel = document.getElementById(navItem.dataset.panelId)
  addClassAndRemoveInSiblings(panel, 'iw-panels__panel--active')
}
