
class Ram {
  constructor(scope) {
    this.scope = scope;
  }

  dispatch(e, el) {
    let target = e.target;
    if (this.element) {
      while (target !== this.s) {
        if (target === this.element) {
          if (typeof this.callback === 'function') this.callback(e, this.element);
          break;
        }
        target = target.parentNode;
      }
    } else {
      if (typeof this.callback === 'function') this.callback(e, el);
    }
  }

  removeEvent(scope) {
    this.s = scope;
    let _this = this;
    scope.removeEventListener(this.event, function(e) {
      _this.dispatch(e);
    }, false);
  }

  setEvent(scope) {
    this.s = scope;
    let _this = this;
    scope.addEventListener(this.event, function(e) {
      _this.dispatch(e, this);
    }, false);
  }

  prepare(type, event, callback, element) {
    this.event = event;
    this.callback = callback;
    if (element) this.element = element;
    // Set listeners on all child items. Ex. for ul li
    if (this.scope.length > 1 && this.scope.tagName !== 'FORM') {
      for (let x = 0; x < this.scope.length; x++) {
        if (type === 'on') this.setEvent(this.scope[x]);
        if (type === 'off') this.removeEvent(this.scope[x]);
      }
    } else {
      if (type === 'on') this.setEvent(this.scope);
      if (type === 'off') this.removeEvent(this.scope);
    }
  }

  on(event, callback, element) {
    this.prepare('on', event, callback, element);
  }

  off(event, callback) {
    this.prepare('off', event, callback);
  }
}

let mod = (arg) => {
  return new Ram(arg);
};

module.exports = mod;
