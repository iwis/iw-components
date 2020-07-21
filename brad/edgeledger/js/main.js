// Transparent menu background
window.addEventListener('scroll', () => { document.querySelector('#navbar').style.opacity = (window.scrollY < 150) ? 1 : 0.9 })

// Smooth scrolling
$('#navbar a').on('click', function (event) {
  if (this.hash !== '') {
    event.preventDefault()
    $('html, body').animate({ scrollTop: $(this.hash).offset().top - 100 }, 800)
  }
})
