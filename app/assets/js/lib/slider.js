
const toolbelt = require('../lib/toolbelt');
const ram = require('../lib/ram');

class Slider {
  // TODO: add events on images loading
  // TODO: add preloader

  constructor(node, options) {
    if (toolbelt.isElement(node)) {
      this.containerNode = node;
    } else if (!toolbelt.isEmpty(node)) {
      this.containerNode = document.querySelector(node);
      if (!this.containerNode) return;
    } else {
      return;
    }

    this.navigator = this.containerNode.querySelector('.slider-navigator');
    this.navigatorList = this.containerNode.querySelector('.slider-navigator-wrapper');
    this.navigatorItems = this.containerNode.querySelectorAll('.slider-navigator-dot');
    this.navigatorItemWidth = 0;
    this.navigatorItemsOnPage = 0;

    this.containerWrap = this.containerNode.querySelector('.slider-container');
    this.listNode = this.containerNode.querySelector('.slider-wrapper');
    this.items = this.listNode.querySelectorAll('.slider-item');
    this.itemWidth = 0;
    this.itemOffsetWidth = 0;
    this.wrapperWidth = 0;
    this.slideWidth = 0;
    this.lastPage = false;
    this.page = 1;
    this.hidden = 'hidden';

    this.options = {
      animation: 'slide',
      navigator: true,
      navigatorSlide: true,
      arrows: true,
      touch: true,
      margin: 20,
      items: 4,
      pauseOnHover: true,
      autoStart: 1000,
      responsive: false
    };
    this.options = toolbelt.extend(this.options, options);

    ram(this.containerNode).on('slider:initialized', () => {
      if (this.options.autoStart) {
        this.interval = false;
        this.pause = false;
        this.initAutoPaging();
      }
      if (this.options.arrows) {
        this.arrows = {
          left: this.containerNode.querySelector('.slider-nav-left'),
          right: this.containerNode.querySelector('.slider-nav-right')
        };
        this.initArrows();
      }
      if (this.options.navigator) {
        this.initNav();
      }
      if (this.options.touch) {
        this.touch = {
          start: 0,
          move: 0
        };
        this.initTouch();
      }
    });

    this.init();
  }

  initNav() {
    [].forEach.call(this.navigatorItems, (k, v) => {
      ram(k).on('click', (e) => {
        e.preventDefault();
        this.goTo(v + 1);
      });
    });
    this.goTo(this.page);

    if (this.options.navigatorSlide) {
      ram(this.containerNode).on('slider:next', (e) => {
        this.slideNavigator(e.detail.page);
      });
      ram(this.containerNode).on('slider:prev', (e) => {
        this.slideNavigator(e.detail.page);
      });
    }
  }

  initTouch() {
    // TODO: refact it and add touch events
    // TODO: use event delegation
    // TODO: add sticky to next page on middle moved touch. Auto bringing

    this.touch = {};
    this.touch.direction = true;
    this.touch.move = 0;
    this.touch.maxWidth = -(this.listNode.offsetWidth - this.pageWith);

    this.listNode.addEventListener('touchstart', (e) => {
      this.pause = true;
      this.touch.start = parseInt(e.changedTouches[0].clientX, 10);
      this.listNode.style.transition = 'none';
    });

    this.listNode.addEventListener('touchend', () => {
      this.listNode.style.transition = 'transform .5s ease';
      if (Math.abs(this.touch.move) > (this.itemWidth / 4)) {
        if (this.touch.direction) {
          this.slideToPage((this.page === this.pages) ? this.pages : this.page + 1);
        } else {
          this.slideToPage((this.page === 1) ? this.page : this.page - 1);
        }
      } else {
        this.slideToPage((this.page === 0) ? this.page + 1 : this.page);
      }
    });

    this.listNode.addEventListener('touchmove', (e) => {
      let x = parseInt(e.changedTouches[0].clientX, 10);
      let move = -(this.touch.start - x);
      this.touch.direction = (move < 0);
      this.touch.move = move;
      let n = this.slideWidth + move;
      this.listNode.style.transform = 'translate3d(' + n + 'px, 0px, 0px)';

      e.preventDefault();
    }, false);
  }

  init() {
    this.listNode.classList.add('invisible');

    this.update();

    if (this.options.animation === 'fade') {
      [].forEach.call(this.items, (k, v) => {
        k.style.opacity = '0';
        k.style.position = 'absolute';
        if (v === 0) k.style.opacity = '1';
      });
    }

    setTimeout(() => {
      this.listNode.classList.remove('invisible');
      this.containerNode.classList.add('slider-anim');
    }, 0);

    // TODO: check how this event work
    this.containerNode.dispatchEvent(new CustomEvent('slider:initialized', {
      detail: {
        page: this.page,
        pages: this.pages
      }
    }));

    ram(window).on('resize', () => {
      this.update();
    });
  }

  update() {
    // TODO: check navigation on resize
    this.checkResponsive();
    this.calcPages();
    if (this.options.animation === 'slide') {
      this.listNode.style.width = (this.wrapperWidth + (this.options.margin * 2)) + 'px';
    }
    if (this.options.navigator) {
      if (this.options.navigatorSlide) {
        let elem = this.navigatorItems[0];
        let style = window.getComputedStyle(elem);
        this.navigatorItemWidth = elem.offsetWidth + (parseFloat(style.marginLeft) + parseFloat(style.marginRight));
        this.navigatorList.style.width = (this.navigatorItemWidth * this.navigatorItems.length) + 'px';
        this.navigatorItemsOnPage = Math.ceil(this.pageWith / this.navigatorItemWidth);
        this.slideNavigator(this.page);
      }
    }
    [].forEach.call(this.items, (k) => {
      k.style.width = this.itemWidth + 'px';
      k.style.marginRight = this.options.margin + 'px';
    });
    this.goTo(this.page);
  }

  checkResponsive() {
    if (this.options.responsive) {
      for (let k in this.options.responsive) {
        if (k <= window.innerWidth) {
          this.options.items = this.options.responsive[k].items;
        }
      }
    }
  }

  calcPages() {
    this.itemWidth = ((this.containerWrap.offsetWidth + 1) / this.options.items) - this.options.margin;
    this.itemOffsetWidth = this.itemWidth + this.options.margin;
    this.wrapperWidth = this.items.length * this.itemOffsetWidth;

    this.pageWith = this.options.items * this.itemOffsetWidth;
    this.lastPage = (this.items.length % this.options.items) !== 0;
    this.pages = Math.ceil(this.items.length / this.options.items);
  }

  initAutoPaging() {
    this.interval = window.setInterval(() => {
      if (!this.pause) {
        let i = this.page + 1;
        this.slideToPage(i);
      }
    }, this.options.autoStart);

    ram(this.containerNode).on('mouseenter', () => {
      this.pause = true;
    });
    ram(this.containerNode).on('mouseleave', () => {
      this.pause = false;
    });
  }

  getPageByNum(num) {
    return Math.ceil(num / this.options.items);
  }

  getElementsOnPage(page) {
    let lastPage = page === this.pages;
    let maxNum = (!lastPage) ? page * this.options.items : this.items.length;
    let minNum = (page > 1) ? (page - 1) * this.options.items : 0;
    let arr = [];
    for (let i = minNum + 1; i <= maxNum; i++) {
      arr.push(i);
    }
    return arr;
  }

  goTo(i) {
    this.slideToPage(this.getPageByNum(i));
  }

  setNavigatorActive(i) {
    [].forEach.call(this.navigatorItems, (k, v) => {
      if (v === i) {
        k.classList.add('slider-select');
      } else {
        k.classList.remove('slider-select');
      }
    });
  }

  slideNavigator(page) {
    // TODO: refact it
    let maxEl = (this.navigatorItemsOnPage / 2);
    let navWidth = (this.navigatorItemWidth * this.navigatorItems.length) - this.pageWith;
    let width = this.navigatorItemWidth * (page - maxEl);
    if (navWidth > 0) {
      if (page >= maxEl) {
        if (width < 0) width = 0;
        if (width >= navWidth) width = navWidth;
      } else {
        width = 0;
      }
      this.slideOnWidth(this.navigatorList, -(width));
    }
  }

  slideOnWidth(elem, width) {
    // TODO: check elem
    elem.style.transform = 'translate3d(' + width + 'px, 0px, 0px)';
  }

  next() {
    this.slideToPage(this.page + 1);
  }

  prev() {
    this.slideToPage(this.page - 1);
  }

  slideToPage(n) {
    let dir = 'next';
    if (this.page > n) dir = 'prev';
    this.page = n;
    if (this.page >= 1 && this.page <= this.pages) {
      let pageElems = this.getElementsOnPage(this.page);
      if (this.options.navigator) {
        this.setNavigatorActive(this.page - 1);
      }
      switch (this.options.animation) {
        case 'fade':
          let elemsOnPage = pageElems;
          [].forEach.call(this.items, (k, v) => {
            let i = v + 1;
            if (toolbelt.inArray(i, elemsOnPage)) {
              k.style.opacity = '1';
              k.style.position = 'relative';
            } else {
              k.style.opacity = '0';
              k.style.position = 'absolute';
            }
          });
          break;
        default:
          let width = (this.pageWith * (this.page - 1));
          if (this.options.items > 1 && this.pages > 1 && this.lastPage && this.page === this.pages) {
            width -= (this.options.items - pageElems.length) * this.itemOffsetWidth;
          }
          this.slideWidth = width * -1;
          this.slideOnWidth(this.listNode, width * -1);
          break;
      }
      this.containerNode.dispatchEvent(new CustomEvent('slider:' + dir, {
        detail: {
          page: this.page,
          pages: this.pages
        }
      }));
    } else {
      this.page = 0;
    }
  }

  initArrows() {
    // TODO: remove hidden arrow on resize if pages will be recalc
    if (this.pages > 1 && this.options.arrows) {
      ram(document).on('click', () => {
        if (this.page < this.pages) {
          this.slideToPage(++this.page);
        }
      }, this.arrows.right);
      ram(document).on('click', () => {
        if (this.page <= this.pages && this.page > 1) {
          this.slideToPage(--this.page);
        }
      }, this.arrows.left);
    } else {
      this.arrows.right.classList.add(this.hidden);
      this.arrows.left.classList.add(this.hidden);
    }
    this.checkArrows({detail: {page: this.page, pages: this.pages}});

    ram(this.containerNode).on('slider:next', (e) => {
      this.checkArrows(e);
    });
    ram(this.containerNode).on('slider:prev', (e) => {
      this.checkArrows(e);
    });
  }

  checkArrows(e) {
    this.arrows.right.classList.remove('slider-nav-inactive');
    this.arrows.left.classList.remove('slider-nav-inactive');
    if (e.detail.page === e.detail.pages) {
      this.arrows.right.classList.add('slider-nav-inactive');
    } else if (e.detail.page === 1) {
      this.arrows.left.classList.add('slider-nav-inactive');
    }
  }
}

module.exports = {
  init: (node, options) => {
    return new Slider(node, options);
  }
};
