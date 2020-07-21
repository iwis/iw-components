import { onDOMNodeAdded } from '../iw-browser.js'

/* Add "was-validated" CSS class to a form, after clicking on a submit button in this form.
 * Thanks to this class we are able to not show valid/invalid (green and red) borders indicators until a user
 * press a submit button.
 * Works like "was-validated" CSS class in Bootstrap.
 */
document.addEventListener('click', (event) => {
  const target = <HTMLElement>event.target
  if (target.matches('.iw-form button:not([type="button"]):not([type="reset"])'))  // a button of submit type in a form
    target.closest('.iw-form').classList.add('was-validated')
})

/* -------------------- Required field label asterisk -------------------- */

/* Add a "required" CSS class to the <label>s of form fields with a "required" attribute. But for <input type="radio" required> fields
 * add a "required" CSS class to the <label> of the whole <fieldset> being a group of radios with the same name.
 * field - <input>, <textarea> or <select> field
 */
function addRelation_RequiredField_LabelAsterisk(field: Element) {  // eslint-disable-line @typescript-eslint/camelcase
  let label: Element
  if (field instanceof HTMLInputElement && field.type === 'radio') {  // for <input type="radio" required>
    if (!field.closest('.iw-form__check')) return  // only for fields from the iw-components library
    label = document.getElementById(field.closest('fieldset:not(.iw-form__fieldset)')
                                         .getAttribute('aria-labelledby'))
  }
  else {
    label = document.querySelector(`[for="${field.id}"]`)
  }
  label.classList.add('required')
}

// create relations whenever a new Node is added (so also at page load)
onDOMNodeAdded((node) => {
  if (node instanceof HTMLElement && node.matches('.iw-form :required')) addRelation_RequiredField_LabelAsterisk(node)  // <input>, <textarea> or <select> field
  if (node instanceof HTMLElement && node.matches('.iw-form fieldset') && node.dataset.min && node.dataset.min !== '0') {
    const label = document.getElementById(node.getAttribute('aria-labelledby'))
    label.classList.add('required')
  }
})

/* -------------------- Require to select number of checkboxes specified in the "data-min" and "data-max" attributes -------------------- */

// validate the <fieldset> of checkboxes if ...
document.addEventListener('change', (e) => { ifFieldsetCheckboxThenValidateFieldset(<HTMLElement>e.target) })  // a checkbox was checked or unchecked
onDOMNodeAdded((node) => { ifFieldsetCheckboxThenValidateFieldset(node) })                                     // a new checkbox was added (also at page load)

// If given node is a fieldset checkbox then validate the whole <fieldset> of checkboxes.
function ifFieldsetCheckboxThenValidateFieldset(node: Node) {
  if (node instanceof HTMLInputElement && node.matches('.iw-form fieldset[data-min] .iw-form__check input[type="checkbox"], ' +
                                                       '.iw-form fieldset[data-max] .iw-form__check input[type="checkbox"]'))
    validateFieldset(node.closest('.iw-form fieldset[data-min], .iw-form fieldset[data-max]'))
}

// Validates given <fieldset> of checkboxes
function validateFieldset(fieldset: HTMLFieldSetElement) {
  const min          = fieldset.dataset.min,  // not found => undefined
        max          = fieldset.dataset.max,  // not found => undefined
        checkboxes   = fieldset.querySelectorAll('.iw-form__check input[type="checkbox"]'),
        numOfChecked = fieldset.querySelectorAll('.iw-form__check input[type="checkbox"]:checked').length

  let validationMessage = ''  // todo: can be translated to other languages
  if (min && numOfChecked < Number(min))
    switch (navigator.language.substring(0, 2)) {
      case 'pl': validationMessage = `Wybierz przynajmniej       ${min}.`; break
      default:   validationMessage = `Please select at least     ${min} checkbox(es).`
    }
  if (max && numOfChecked > Number(max))
    switch (navigator.language.substring(0, 2)) {
      case 'pl': validationMessage = `Wybierz nie więcej niż     ${max}.`; break
      default:   validationMessage = `Please select no more than ${max} checkbox(es).`
    }
  checkboxes.forEach((checkbox: HTMLInputElement) => checkbox.setCustomValidity(validationMessage))
}
