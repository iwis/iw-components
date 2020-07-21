import { moveHTMLTableColumn, sortHTMLTable, focusNextElementOf } from '../iw-browser.js'

document.addEventListener('click', (event) => {
  const target = <HTMLElement>event.target
  if (target.matches('.iw-table--sortable th a')) {  // sort table by the clicked column
    event.preventDefault()  // don't scroll the page; todo: remove if it needs to download new data from a server
    const th    = <HTMLTableCellElement>target.parentNode
    const table = th.closest('table')                                              // if the column is already sorted ASC
    sortHTMLTable(table, th.cellIndex, !th.classList.contains('is-sorted-asc'))  // then sort it DESC; otherwise sort it ASC
  }
})

// ================================= REORDERING COLUMNS (BY DRAGGING) =========================================
// tested on Chrome, Firefox, Edge and mobile Chrome (Drag & Drop doesn't work on mobile browsers other than mobile Chrome)

/* Are given arguments the elements of one HTML table? */
function areInOneTable(element1: HTMLElement, element2: HTMLElement): boolean {
  if (!element1 || !element2) return false
  const table1 = element1.closest('table')
  const table2 = element2.closest('table')
  return table1 !== null && table1 === table2
}

// <th> cell being dragged; undefined if none <th> cell is currently dragged
// I use it instead of DataTransfer because the latter can be read only in "drop" event
let iwTableGrabbedColumn: HTMLTableCellElement

// ------------------------- Events fired on the drag target --------------------------------
document.addEventListener('dragstart', (e) => {
  if (e.target instanceof HTMLTableCellElement && e.target.matches('.iw-table--draggable-cols thead th')) {
    iwTableGrabbedColumn = e.target
    e.dataTransfer.setData('text', 'table column')  // need to be set, otherwise drag & drop won't work in mobile Google Chrome
    e.target.style.opacity = '0.4'  // change drag target opacity (optional)
  }
})

document.addEventListener('dragend', (e) => {
  if (e.target instanceof HTMLElement && e.target.matches('.iw-table--draggable-cols thead th')) {
    iwTableGrabbedColumn = undefined
    e.target.style.opacity = '1'  // change drag target opacity (optional)
  }
})

// ------------------------- Events fired on the drop target --------------------------------
document.addEventListener('dragover', (e) => {
  if (e.target instanceof HTMLElement && e.target.closest('.iw-table--draggable-cols thead th') !== null) {
    const column = e.target.closest('th')
    if (areInOneTable(iwTableGrabbedColumn, column))  // only column of the same table can be dropped
      e.preventDefault()  // allow a drop
  }
})

document.addEventListener('drop', (e) => {
  if (e.target instanceof HTMLElement && e.target.closest('.iw-table--draggable-cols thead th') !== null) {
    e.preventDefault()  // prevent the browser default handling of the data (default is open as link on drop)
    const column = e.target.closest('th')
    const table = column.closest('table')
    if (areInOneTable(iwTableGrabbedColumn, column))  // only column of the same table can be dropped
      moveHTMLTableColumn(table, iwTableGrabbedColumn.cellIndex, column.cellIndex)
  }
})

// ---- change drop target border (optional) ----
document.addEventListener('dragenter', (e) => {
  if (e.target instanceof HTMLTableCellElement && e.target.matches('.iw-table--draggable-cols thead th')) {
    const column = e.target
    if (areInOneTable(iwTableGrabbedColumn, column)) {  // only column of the same table can be dropped
      if      (iwTableGrabbedColumn.cellIndex < column.cellIndex) column.style.borderRight = '2px solid gray'
      else if (column.cellIndex < iwTableGrabbedColumn.cellIndex) column.style.borderLeft  = '2px solid gray'
      else ;  // no border
    }
  }
})

document.addEventListener('dragleave', (e) => {
  if (e.target instanceof HTMLTableCellElement && e.target.matches('.iw-table--draggable-cols thead th')) {
    const th = e.target
    // const thRect = th.getBoundingClientRect()

    // if mouse is outside of the <th> element - 2 implementation options (each works in more than 95% cases, tested in Chrome, Firefox,
    // Edge, mobile Chrome; see also: https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element):
    // if (e.x <= thRect.left || e.x >= thRect.right || e.y <= thRect.top || e.y >= thRect.bottom)
    if (!th.contains(document.elementFromPoint(e.x, e.y)))  // uses experimental method
      th.style.border = ''
  }
})

document.addEventListener('drop', (e) => {
  if (e.target instanceof HTMLElement && e.target.closest('.iw-table--draggable-cols thead th') !== null) {
    const th = e.target.closest('th')
    th.style.border = ''
  }
})

// ================================= REORDERING COLUMNS (USING KEYBOARD) =========================================

let iwTableKeyboardDragging = false

document.addEventListener('keydown', (e) => {
  const target = <HTMLElement>e.target
  if (target.closest('.iw-table--draggable-cols thead th') !== null) {
    let currentColumn = target.closest('th')
    const table = currentColumn.closest('table')
    const columnsNumber = table.rows[0].cells.length

    // eslint-disable-next-line prefer-const
    let UI_MODE = 'IMMEDIATE'  // it isn't const because for "const UI_MODE = 'DRAG_SIMULATION'" TypeScript warns that "UI_MODE === 'IMMEDIATE'" is always false
    if (UI_MODE === 'IMMEDIATE') {  // ------------------------------
      if (e.key === ' ') {
        e.preventDefault()
        iwTableKeyboardDragging = !iwTableKeyboardDragging  // start or finish dragging columns using keyboard
      }
      else if (iwTableKeyboardDragging && e.key === 'Escape') {
        e.preventDefault()
        iwTableKeyboardDragging = false  // finish dragging columns using keyboard
      }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const direction = (e.key === 'ArrowLeft') ? -1 : 1
        if (currentColumn.cellIndex + direction < 0 || currentColumn.cellIndex + direction >= columnsNumber) return
        focusNextElementOf(table, direction)
        if (iwTableKeyboardDragging) {
          moveHTMLTableColumn(table, currentColumn.cellIndex, currentColumn.cellIndex + direction)
          focusNextElementOf(table, direction)
        }
      }
    }
    else if (UI_MODE === 'DRAG_SIMULATION') {  // ------------------------------
      if (iwTableGrabbedColumn === undefined && e.key === ' ') {  // 1. GRAB current column (i.e. select for dragging)
        e.preventDefault()
        iwTableGrabbedColumn = currentColumn
        currentColumn.style.opacity = '0.4'  // change drag target opacity (optional)
      }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {  // 2. DRAG the grabbed column (or only navigate)
        e.preventDefault()
        const direction = (e.key === 'ArrowLeft') ? -1 : 1
        if (currentColumn.cellIndex + direction < 0 || currentColumn.cellIndex + direction >= columnsNumber) return
        focusNextElementOf(table, direction)
        if (iwTableGrabbedColumn) {
          if (areInOneTable(iwTableGrabbedColumn, currentColumn)) {  // only column of the same table can be dropped
            currentColumn.style.border = ''
            currentColumn = table.rows[0].cells[currentColumn.cellIndex + direction]
            if      (iwTableGrabbedColumn.cellIndex < currentColumn.cellIndex) currentColumn.style.borderRight = '2px solid gray'
            else if (currentColumn.cellIndex < iwTableGrabbedColumn.cellIndex) currentColumn.style.borderLeft  = '2px solid gray'
            else ;  // no border
            currentColumn.querySelector('a').style.outline = 'none'
          }
        }
      }
      else if (iwTableGrabbedColumn && (e.key === ' ' || e.key === 'Escape' || e.key === 'Tab')) {
        if (e.key === ' ') {  // 3. DROP the grabbed column
          const cellIndex = currentColumn.cellIndex
          moveHTMLTableColumn(table, iwTableGrabbedColumn.cellIndex, currentColumn.cellIndex)
          table.rows[0].cells[cellIndex].querySelector('a').focus()
        }
        else if (e.key === 'Escape' || e.key === 'Tab')    // 3. or cancel the drag
          iwTableGrabbedColumn.querySelector('a').focus()  // focus the grabbed column (tab does the same since we cannot drag column to another table)
        e.preventDefault()
        iwTableGrabbedColumn.style.opacity = '1'  // change drag target opacity (optional)
        iwTableGrabbedColumn = undefined
        currentColumn.style.border = ''
        table.tHead.querySelectorAll('a').forEach(anchor => anchor.style.outline = '')
      }
    }
    // ------------------------------
  }
})
