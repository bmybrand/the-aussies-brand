document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.testimonials_slider').forEach(function (el) {

    if (typeof Splide === 'undefined') {
      console.warn('Splide not loaded');
      return;
    }

    // prevent double init
    if (el.classList.contains('is-initialized')) return;
    el.classList.add('is-initialized');

    var slider = new Splide(el, {
      type: 'slide',
      perPage: 2,
      perMove: 1,
      gap: '9px',
      pagination: false,
      arrows: false,
      speed: 800,
      // padding: {
      //   right: '400px'
      // },
      breakpoints: {
        1599: {
          padding: {
            right: '300px'
          },
        },
        1400: {
          padding: {
            right: '300px'
          },
        },
        1200: {
          padding: {
            right: '150px'
          },
        },
        1024: {
          padding: {
            right: '60px'
          },
        },
        767: {
          perPage: 1,
          padding: {
            right: '30px'
          },
        }
      }
    });

    slider.mount();

    // custom arrows (scoped)
    var wrapper = el.closest('section');
    if (!wrapper) return;

    var prev = wrapper.querySelector('.splide__arrow--prev');
    var next = wrapper.querySelector('.splide__arrow--next');

    prev && prev.addEventListener('click', () => slider.go('<'));
    next && next.addEventListener('click', () => slider.go('>'));

  });
});
