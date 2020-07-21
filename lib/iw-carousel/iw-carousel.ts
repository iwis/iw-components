import { addClassAndRemoveInSiblings } from '../iw-browser.js'

document.addEventListener('click', (event) => {
  const target = <HTMLElement>event.target
  if      (target.matches('.iw-carousel__control--prev')) shiftCarousel    (target.closest('.iw-carousel'), -1)
  else if (target.matches('.iw-carousel__control--next')) shiftCarousel    (target.closest('.iw-carousel'), +1)
  else if (target.matches('.iw-carousel__indicators li')) showCarouselSlide(target.closest('.iw-carousel'), Number(target.dataset.slideTo))
})

/* Shifts the given iw-carousel to the left (if direction == -1) or to the right (if direction == 1). */
function shiftCarousel(carousel: HTMLElement, direction: number) {
  const numberOfSlides    = carousel.querySelectorAll('.iw-carousel__inner img').length
  const currentSlideIndex = Number(carousel.querySelector<HTMLElement>('.iw-carousel__indicators .active').dataset.slideTo)
  let newSlideIndex = currentSlideIndex + direction
  if (newSlideIndex >= numberOfSlides) newSlideIndex = 0
  if (newSlideIndex < 0)               newSlideIndex = numberOfSlides - 1
  showCarouselSlide(carousel, newSlideIndex)
}

/* Shows i-th slide of the given iw-carousel. */
function showCarouselSlide(carousel: HTMLElement, slideIndex: number) {
  const slides     = carousel.querySelectorAll('.iw-carousel__item')
  const indicators = carousel.querySelectorAll('.iw-carousel__indicators li')

  addClassAndRemoveInSiblings(slides[slideIndex], 'active')
  addClassAndRemoveInSiblings(indicators[slideIndex], 'active')
}
