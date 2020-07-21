/* Adds the following code:
 *   <div class="iw-alert ${cssClass}">
 *     ${html}
 *   </div>
 * as the last child of the where element.
 * If cssClass contains 'iw-alert--dismissible' then the iw-alert has a close button.
 */
export default function showAlert(html: string, cssClass: string, where: HTMLElement) {
  let alert = `<div class="iw-alert ${cssClass}" role="alert">${html}`
  if (cssClass.includes('iw-alert--dismissible'))
    alert += '<button class="iw-alert__dismiss-button" aria-label="Close" onclick="this.closest(\'.iw-alert\').remove()">&times;</button>'
  alert += '</div>'

  where.insertAdjacentHTML('beforeend', alert)
}
