/* Type Effect
 * tutorial: https://www.youtube.com/watch?v=POX3dT-pB4E
 */

class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement
    this.words = words
    this.txt = ''
    this.wordIndex = 0
    this.wait = parseInt(wait, 10)
    this.type()
    this.isDeleting = false
  }

  type() {
    const current = this.wordIndex % this.words.length  // Current index of word
    const fullTxt = this.words[current]                 // Get full text of current word

    // Check if deleting
    if (this.isDeleting) this.txt = fullTxt.substring(0, this.txt.length - 1)  // Remove char
    else                 this.txt = fullTxt.substring(0, this.txt.length + 1)  // Add char

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`  // Insert txt into element

    let typeSpeed = 300                                                 // Initial Type Speed

    if (this.isDeleting)
      typeSpeed /= 2

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait    // Make pause at end
      this.isDeleting = true   // Set delete to true
    }
    else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false
      this.wordIndex++         // Move to next word
      typeSpeed = 500          // Pause before start typing
    }

    setTimeout(() => this.type(), typeSpeed)
  }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', () => {
  const txtElement = document.querySelector('.txt-type')
  const words = JSON.parse(txtElement.getAttribute('data-words'))
  const wait  = txtElement.getAttribute('data-wait')
  new TypeWriter(txtElement, words, wait)  // init TypeWriter
})
