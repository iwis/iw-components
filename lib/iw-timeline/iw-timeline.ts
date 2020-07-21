// /* eslint-disable */

import { onDOMChange } from '../iw-browser.js'

/* ------------------------------ Make the timeline layout more compact on large screens ------------------------------
 * The layout on larger screens can be made more compact by setting the margin-top of each item to such lowest negative value that:
 *  - its dot is still below the dot of the previous item in the other column, and
 *  - the item is still below the previous item in the same column.
 *
 * 1. The first solution - by using JavaScript (implemented), worse because:
 *     a) It uses more CPU power because layout needs to be recalculated every time the window is resized. On the other hand, resizing
 *        any window uses CPU heavily on my computer, so maybe it is not a problem?
 *     b) it is a hack, so possibly there could be other problems in specific situations
 * 2. The second, better solution - without JavaScript using floats like here (not implemented):
 *     - comment by u/bronkula on https://www.reddit.com/r/css/comments/6puvpm/building_a_responsive_timeline_in_css_with_sass/ - I checked it
 *     - https://github.com/christian-fei/Timeline.css - I didn't check it
 */

const timelines = document.getElementsByClassName('iw-timeline--compact')  // live list (always up-to-date)

// if changed, change them also in _iw-timeline.scss
const dotSize          = 28    // 28px
const marginTopDefault = 16    // default vertical margin of item 1em = 16px
const mediaThreshold   = 1000  // 1000px

/* Updates margin-top of each .iw-timeline__item, if the screen is large. */
function recalculateTopMargins() {
  // console.log('recalculate layout')
  for (const timeline of timelines) {
    const items = timeline.getElementsByClassName('iw-timeline__item')
    const marginTop = []

    for (let i = 0; i < items.length; i++) {
      if (window.innerWidth < mediaThreshold || i === 0)   // small screens or the first item
        marginTop[i] = marginTopDefault
      else                                                 // big screens
        marginTop[i] = -items[i - 1].clientHeight          // clientHeight - the height of the previous item without its margins
                     + Math.max(dotSize, (i === 1) ? -Infinity : -marginTop[i - 1])
                     + marginTopDefault;
      (items[i] as HTMLElement).style.marginTop = `${marginTop[i]}px`
    }
  }
}

window.addEventListener('load',   recalculateTopMargins)  // on the initial page load (loading an image can change a timeline box height)
window.addEventListener('resize', recalculateTopMargins)  // on window resize

// on changes in the DOM (for example: adding a whole timeline, adding/removing a timeline box, changing the content of a timeline box etc.)
onDOMChange(recalculateTopMargins)
