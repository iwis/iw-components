document.addEventListener('click', (event) => {
  const target = <HTMLElement>event.target
  if (target.matches('.iw-navbar__toggler') || target.matches('.iw-navbar__toggler > span')) {
    const navbarToggler = target.closest('.iw-navbar__toggler')
    const navbarNav     = target.closest('.iw-navbar').querySelector('.iw-navbar__nav')
    const isNavVisible = navbarNav.classList.toggle('iw-navbar__nav--visible')
    navbarToggler.setAttribute('aria-expanded', isNavVisible ? 'true' : 'false')
  }
})
