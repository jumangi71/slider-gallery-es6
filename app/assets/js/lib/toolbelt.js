
let tools = {
  forEach: (collection, callback, scope) => {
    let i = 0;
    let len = collection.length;
    for (; i < len; i++ ) callback.call( scope, collection[i], i, collection );
  },
  extend: (obj1, obj2) => {
    let extended = {};
    let merge = (obj, cb) => {
      let keys = Object.keys(obj);
      let keysLength = keys.length;
      let i = 0;
      for (; i < keysLength; i++) {
        let key = keys[i];
        extended[key] = obj[key];
      }
      if (typeof cb === 'function') cb();
    };
    merge(obj1);
    merge(obj2);
    return extended;
  },
  isEmpty(obj) {
    if (obj === null) return true;
    if (obj && obj.length > 0) return false;
    if (obj && obj.length === 0) return true;
    for (let key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  },
  isElement(obj) {
    try {
      return obj instanceof HTMLElement;
    } catch (e) {
      return (typeof obj === 'object') &&
        (obj.nodeType === 1) && (typeof obj.style === 'object') &&
        (typeof obj.ownerDocument === 'object');
    }
  },
  inArray(needle, haystack) {
    let length = haystack.length;
    for (let i = 0; i < length; i++) {
      if (haystack[i] === needle) return true;
    }
    return false;
  },
  updateQuery: (uri, key, value) => {
    let re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    let separator = uri.indexOf('?') !== -1 ? '&' : '?';
    let res = '';
    if (uri.match(re)) {
      res = uri.replace(re, '$1' + key + '=' + value + '$2');
    } else {
      res = uri + separator + key + '=' + value;
    }
    return res;
  },
  dirtyParser: (str) => {
    let tmp = document.implementation.createHTMLDocument('');
    tmp.body.innerHTML = str;
    return tmp;
  },
  Ajax: (url, success, failure) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      // TODO: check data type!
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = tools.dirtyParser(xhr.responseText);
        if (typeof success === 'function') success(response);
      } else if (xhr.readyState === 4) {
        if (typeof failure === 'function') failure();
      }
    };
    xhr.open('GET', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
  }
};

module.exports = tools;
