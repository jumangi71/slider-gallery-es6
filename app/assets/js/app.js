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
  });
}