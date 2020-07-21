document.addEventListener('click', (event) => {
  const target = <HTMLElement>event.target
  if      (target.matches('.iw-carousel-mul__control--prev')) shiftCarouselMul(target.closest('.iw-carousel-mul'), -1)
  else if (target.matches('.iw-carousel-mul__control--next')) shiftCarouselMul(target.closest('.iw-carousel-mul'), +1)
})

/* Shifts the given iw-carousel-mul to the left (if dir == -1) or to the right (if dir == 1). */
function shiftCarouselMul(carousel: HTMLElement, dir: number) {
  const imagesList         = carousel.querySelector<HTMLElement>('.iw-carousel-mul__inner ul')
  const imageWidth         = carousel.querySelector             ('.iw-carousel-mul__inner ul li img').clientWidth     // image width
  const imagesCountAll     = carousel.querySelectorAll          ('.iw-carousel-mul__inner ul li').length              // number of all images
  const imagesCountVisible = carousel.querySelector             ('.iw-carousel-mul__inner').clientWidth / imageWidth  // number of visible images

  let position = Number(carousel.dataset.position) || 0  // ribbon scroll position is stored in 'data-position' HTML attribute (0 by default)
  position -= dir * imagesCountVisible * imageWidth      // shift ribbon to the left or right
  position = Math.min(position, 0)                       // not too much, because of end of images
  position = Math.max(position, -imageWidth * (imagesCountAll - imagesCountVisible))
  imagesList.style.transform = `translateX(${position}px)`
  carousel.dataset.position = String(position)
}
