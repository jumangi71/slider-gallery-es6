require('./../style/app.styl');

let sliderNode = document.querySelector('.slider-index');

if (sliderNode) {
  require.ensure([], function (require) {
    const slider = require('./lib/slider');

    slider.init('.slider-hover-container', {
      animation: 'fade',
      navigator: true,
      navigatorSlide: false,
      touch: false,
      arrows: false,
      margin: 0,
      items: 1,
      pauseOnHover: true,
      autoStart: 4000
    });


    slider.init('#main-slider-news', {
      animation: 'slide',
      navigator: false,
      touch: true,
      arrows: true,
      items: 4,
      pauseOnHover: true,
      autoStart: 3500,
      responsive: {
        0: {
          items: 1
        },
        640: {
          items: 2
        },
        970: {
          items: 2
        },
        1280: {
          items: 4
        }
      }
    });

  });
}