/**
 * Micro jQuery — drop-in replacement for jQuery 3.x covering only the methods
 * used by the XBWorld codebase (~43 methods). 87 KB → ~8 KB.
 *
 * NOT a general-purpose jQuery replacement — only implements what we need.
 */
(function (window) {
  "use strict";

  // ── Collection wrapper ──────────────────────────────────────────────
  function MQ(els) {
    this.length = els.length;
    for (var i = 0; i < els.length; i++) this[i] = els[i];
  }

  var proto = MQ.prototype;

  // ── Core factory ────────────────────────────────────────────────────
  function $(selectorOrElOrFn, context) {
    if (typeof selectorOrElOrFn === "function") {
      // $(fn) = document ready
      if (document.readyState !== "loading") selectorOrElOrFn($);
      else document.addEventListener("DOMContentLoaded", function () { selectorOrElOrFn($); });
      return;
    }
    if (selectorOrElOrFn instanceof MQ) return selectorOrElOrFn;
    if (!selectorOrElOrFn) return new MQ([]);
    if (selectorOrElOrFn === window || selectorOrElOrFn === document) return new MQ([selectorOrElOrFn]);
    if (selectorOrElOrFn.nodeType) return new MQ([selectorOrElOrFn]);
    if (typeof selectorOrElOrFn === "string") {
      var s = selectorOrElOrFn.trim();
      if (s.charAt(0) === "<") {
        // Create element from HTML string
        var tmp = document.createElement("div");
        tmp.innerHTML = s;
        var nodes = [];
        while (tmp.firstChild) nodes.push(tmp.removeChild(tmp.firstChild));
        return new MQ(nodes);
      }
      var root = context ? (context.nodeType ? context : (context[0] || document)) : document;
      try {
        return new MQ(Array.from(root.querySelectorAll(s)));
      } catch (e) {
        return new MQ([]);
      }
    }
    if (selectorOrElOrFn.length !== undefined) return new MQ(Array.from(selectorOrElOrFn));
    return new MQ([]);
  }

  $.fn = proto;
  $.prototype = proto;

  // ── Iteration ───────────────────────────────────────────────────────
  proto.each = function (fn) {
    for (var i = 0; i < this.length; i++) {
      if (fn.call(this[i], i, this[i]) === false) break;
    }
    return this;
  };

  proto.get = function (idx) {
    if (idx === undefined) {
      var arr = [];
      for (var i = 0; i < this.length; i++) arr.push(this[i]);
      return arr;
    }
    return idx < 0 ? this[this.length + idx] : this[idx];
  };

  proto.toArray = function () { return this.get(); };

  // ── DOM Manipulation ────────────────────────────────────────────────
  proto.html = function (v) {
    if (v === undefined) return this[0] ? this[0].innerHTML : "";
    return this.each(function () { this.innerHTML = v; });
  };

  proto.text = function (v) {
    if (v === undefined) return this[0] ? this[0].textContent : "";
    return this.each(function () { this.textContent = v; });
  };

  proto.val = function (v) {
    if (v === undefined) return this[0] ? this[0].value : "";
    return this.each(function () { this.value = v; });
  };

  proto.attr = function (k, v) {
    if (typeof k === "object") {
      var self = this;
      for (var key in k) self.attr(key, k[key]);
      return self;
    }
    if (v === undefined) return this[0] ? this[0].getAttribute(k) : undefined;
    return this.each(function () { this.setAttribute(k, v); });
  };

  proto.removeAttr = function (k) {
    return this.each(function () { this.removeAttribute(k); });
  };

  proto.prop = function (k, v) {
    if (v === undefined) return this[0] ? this[0][k] : undefined;
    return this.each(function () { this[k] = v; });
  };

  proto.data = function (k, v) {
    if (v === undefined) {
      if (!this[0]) return undefined;
      if (k === undefined) return this[0].dataset;
      var el = this[0];
      if (!el._mqData) el._mqData = {};
      return k in el._mqData ? el._mqData[k] : el.dataset[k];
    }
    return this.each(function () {
      if (!this._mqData) this._mqData = {};
      this._mqData[k] = v;
    });
  };

  proto.remove = function () {
    return this.each(function () { if (this.parentNode) this.parentNode.removeChild(this); });
  };

  proto.detach = proto.remove;

  proto.empty = function () {
    return this.each(function () { this.innerHTML = ""; });
  };

  proto.append = function (content) {
    if (!this[0]) return this;
    var target = this[0];
    if (typeof content === "string") {
      target.insertAdjacentHTML("beforeend", content);
    } else if (content instanceof MQ) {
      for (var i = 0; i < content.length; i++) target.appendChild(content[i]);
    } else if (content && content.nodeType) {
      target.appendChild(content);
    }
    return this;
  };

  proto.prepend = function (content) {
    if (!this[0]) return this;
    var target = this[0];
    if (typeof content === "string") {
      target.insertAdjacentHTML("afterbegin", content);
    } else if (content instanceof MQ) {
      var ref = target.firstChild;
      for (var i = 0; i < content.length; i++) target.insertBefore(content[i], ref);
    } else if (content && content.nodeType) {
      target.insertBefore(content, target.firstChild);
    }
    return this;
  };

  proto.appendTo = function (target) {
    var t = $(target);
    if (t[0]) {
      for (var i = 0; i < this.length; i++) t[0].appendChild(this[i]);
    }
    return this;
  };

  proto.after = function (content) {
    if (!this[0] || !this[0].parentNode) return this;
    if (typeof content === "string") {
      this[0].insertAdjacentHTML("afterend", content);
    }
    return this;
  };

  proto.before = function (content) {
    if (!this[0] || !this[0].parentNode) return this;
    if (typeof content === "string") {
      this[0].insertAdjacentHTML("beforebegin", content);
    }
    return this;
  };

  proto.replaceWith = function (content) {
    return this.each(function () {
      if (this.parentNode) {
        if (typeof content === "string") {
          this.insertAdjacentHTML("afterend", content);
          this.parentNode.removeChild(this);
        }
      }
    });
  };

  // ── CSS & Dimensions ────────────────────────────────────────────────
  proto.css = function (k, v) {
    if (typeof k === "object") {
      var self = this;
      for (var key in k) self.css(key, k[key]);
      return self;
    }
    if (v === undefined) {
      if (!this[0]) return undefined;
      return getComputedStyle(this[0])[k];
    }
    var val = typeof v === "number" ? v + "px" : v;
    return this.each(function () { this.style[k] = val; });
  };

  proto.addClass = function (cls) {
    var classes = cls.split(/\s+/);
    return this.each(function () {
      for (var i = 0; i < classes.length; i++) if (classes[i]) this.classList.add(classes[i]);
    });
  };

  proto.removeClass = function (cls) {
    if (!cls) return this.each(function () { this.className = ""; });
    var classes = cls.split(/\s+/);
    return this.each(function () {
      for (var i = 0; i < classes.length; i++) if (classes[i]) this.classList.remove(classes[i]);
    });
  };

  proto.toggleClass = function (cls) {
    return this.each(function () { this.classList.toggle(cls); });
  };

  proto.hasClass = function (cls) {
    return this[0] ? this[0].classList.contains(cls) : false;
  };

  function _dim(el, prop) {
    if (el === window) return prop === "height" ? window.innerHeight : window.innerWidth;
    if (el === document) {
      var de = document.documentElement;
      return prop === "height" ? de.scrollHeight : de.scrollWidth;
    }
    return el.getBoundingClientRect()[prop === "height" ? "height" : "width"];
  }

  proto.height = function (v) {
    if (v === undefined) return this[0] ? _dim(this[0], "height") : 0;
    var val = typeof v === "number" ? v + "px" : v;
    return this.each(function () { this.style.height = val; });
  };

  proto.width = function (v) {
    if (v === undefined) return this[0] ? _dim(this[0], "width") : 0;
    var val = typeof v === "number" ? v + "px" : v;
    return this.each(function () { this.style.width = val; });
  };

  proto.outerWidth = function () { return this[0] ? this[0].offsetWidth : 0; };
  proto.outerHeight = function () { return this[0] ? this[0].offsetHeight : 0; };
  proto.innerWidth = function () { return this[0] ? this[0].clientWidth : 0; };
  proto.innerHeight = function () { return this[0] ? this[0].clientHeight : 0; };

  proto.offset = function () {
    if (!this[0]) return { top: 0, left: 0 };
    if (this[0] === window || this[0] === document) return { top: 0, left: 0 };
    var r = this[0].getBoundingClientRect();
    return { top: r.top + window.scrollY, left: r.left + window.scrollX };
  };

  proto.position = function () {
    if (!this[0]) return { top: 0, left: 0 };
    return { top: this[0].offsetTop, left: this[0].offsetLeft };
  };

  proto.scrollTop = function (v) {
    if (v === undefined) return this[0] ? this[0].scrollTop : 0;
    return this.each(function () { this.scrollTop = v; });
  };

  proto.scrollLeft = function (v) {
    if (v === undefined) return this[0] ? this[0].scrollLeft : 0;
    return this.each(function () { this.scrollLeft = v; });
  };

  // ── Display ─────────────────────────────────────────────────────────
  proto.show = function () {
    return this.each(function () { this.style.display = ""; });
  };

  proto.hide = function () {
    return this.each(function () { this.style.display = "none"; });
  };

  proto.toggle = function () {
    return this.each(function () {
      this.style.display = (this.style.display === "none") ? "" : "none";
    });
  };

  proto.is = function (sel) {
    if (!this[0]) return false;
    if (sel === ":visible") return this[0].offsetParent !== null || this[0].style.display !== "none";
    if (sel === ":hidden") return !proto.is.call(this, ":visible");
    return this[0].matches ? this[0].matches(sel) : false;
  };

  // ── Events ──────────────────────────────────────────────────────────
  proto.on = function (evt, selectorOrFn, fn) {
    var handler = fn || selectorOrFn;
    var events = evt.split(/\s+/);
    return this.each(function () {
      var el = this;
      for (var i = 0; i < events.length; i++) {
        el.addEventListener(events[i], handler);
      }
    });
  };

  proto.off = function (evt, fn) {
    if (!evt) return this; // .off() with no args: not fully supported, but safe no-op
    var events = evt.split(/\s+/);
    return this.each(function () {
      var el = this;
      for (var i = 0; i < events.length; i++) {
        el.removeEventListener(events[i], fn);
      }
    });
  };

  proto.trigger = function (evt) {
    return this.each(function () {
      this.dispatchEvent(new Event(evt, { bubbles: true }));
    });
  };

  // Shorthand event methods
  var evtMethods = ["click", "dblclick", "keydown", "keyup", "keypress",
    "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave",
    "focus", "blur", "change", "submit", "contextmenu", "select"];
  evtMethods.forEach(function (name) {
    proto[name] = function (fn) {
      if (fn) return this.on(name, fn);
      return this.trigger(name);
    };
  });

  proto.hover = function (over, out) {
    return this.on("mouseenter", over).on("mouseleave", out || over);
  };

  proto.one = function (evt, fn) {
    return this.each(function () {
      var el = this;
      el.addEventListener(evt, function handler(e) {
        el.removeEventListener(evt, handler);
        fn.call(el, e);
      });
    });
  };

  proto.ready = function (fn) { $(fn); return this; };

  // ── Traversal ───────────────────────────────────────────────────────
  proto.find = function (sel) {
    var result = [];
    this.each(function () {
      var els = this.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) result.push(els[i]);
    });
    return new MQ(result);
  };

  proto.children = function (sel) {
    var result = [];
    this.each(function () {
      var ch = this.children;
      for (var i = 0; i < ch.length; i++) {
        if (!sel || ch[i].matches(sel)) result.push(ch[i]);
      }
    });
    return new MQ(result);
  };

  proto.parent = function () {
    var result = [];
    this.each(function () { if (this.parentNode) result.push(this.parentNode); });
    return new MQ(result);
  };

  proto.parents = function (sel) {
    var result = [];
    this.each(function () {
      var p = this.parentNode;
      while (p && p !== document) {
        if (!sel || p.matches(sel)) result.push(p);
        p = p.parentNode;
      }
    });
    return new MQ(result);
  };

  proto.closest = function (sel) {
    if (!this[0]) return new MQ([]);
    var el = this[0].closest(sel);
    return el ? new MQ([el]) : new MQ([]);
  };

  proto.siblings = function (sel) {
    if (!this[0] || !this[0].parentNode) return new MQ([]);
    var result = [];
    var me = this[0];
    var ch = me.parentNode.children;
    for (var i = 0; i < ch.length; i++) {
      if (ch[i] !== me && (!sel || ch[i].matches(sel))) result.push(ch[i]);
    }
    return new MQ(result);
  };

  proto.next = function () {
    if (!this[0]) return new MQ([]);
    var n = this[0].nextElementSibling;
    return n ? new MQ([n]) : new MQ([]);
  };

  proto.prev = function () {
    if (!this[0]) return new MQ([]);
    var p = this[0].previousElementSibling;
    return p ? new MQ([p]) : new MQ([]);
  };

  proto.eq = function (idx) {
    if (idx < 0) idx = this.length + idx;
    return (idx >= 0 && idx < this.length) ? new MQ([this[idx]]) : new MQ([]);
  };

  proto.first = function () { return this.eq(0); };
  proto.last = function () { return this.eq(-1); };

  proto.filter = function (sel) {
    var result = [];
    if (typeof sel === "function") {
      this.each(function (i) { if (sel.call(this, i, this)) result.push(this); });
    } else {
      this.each(function () { if (this.matches && this.matches(sel)) result.push(this); });
    }
    return new MQ(result);
  };

  proto.not = function (sel) {
    var result = [];
    this.each(function () { if (!this.matches || !this.matches(sel)) result.push(this); });
    return new MQ(result);
  };

  proto.has = function (sel) {
    var result = [];
    this.each(function () { if (this.querySelector(sel)) result.push(this); });
    return new MQ(result);
  };

  proto.index = function (el) {
    if (!this[0]) return -1;
    if (!el) {
      var node = this[0], idx = 0;
      while ((node = node.previousElementSibling)) idx++;
      return idx;
    }
    var target = el.nodeType ? el : $(el)[0];
    for (var i = 0; i < this.length; i++) if (this[i] === target) return i;
    return -1;
  };

  // ── AJAX (minimal) ──────────────────────────────────────────────────
  proto.load = function (url, callback) {
    var self = this;
    // Support "url #selector" syntax
    var parts = url.split(/\s+/);
    var fetchUrl = parts[0];
    var selector = parts.length > 1 ? parts.slice(1).join(" ") : null;
    fetch(fetchUrl).then(function (r) { return r.text(); }).then(function (html) {
      if (selector) {
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        var found = tmp.querySelector(selector);
        self.html(found ? found.innerHTML : "");
      } else {
        self.html(html);
      }
      if (callback) callback.call(self[0], html);
    }).catch(function () {});
    return this;
  };

  // ── Static methods ──────────────────────────────────────────────────
  $.extend = function () {
    var target = arguments[0] || {};
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (src) for (var key in src) if (src.hasOwnProperty(key)) target[key] = src[key];
    }
    return target;
  };

  $.each = function (obj, fn) {
    if (Array.isArray(obj) || obj.length !== undefined) {
      for (var i = 0; i < obj.length; i++) if (fn.call(obj[i], i, obj[i]) === false) break;
    } else {
      for (var k in obj) if (obj.hasOwnProperty(k)) if (fn.call(obj[k], k, obj[k]) === false) break;
    }
    return obj;
  };

  $.isArray = Array.isArray;
  $.isFunction = function (f) { return typeof f === "function"; };
  $.isPlainObject = function (o) { return o && typeof o === "object" && o.constructor === Object; };
  $.noop = function () {};
  $.trim = function (s) { return s ? s.trim() : ""; };
  $.type = function (o) { return typeof o; };
  $.makeArray = function (a) { return Array.from(a); };
  $.inArray = function (v, arr) { return arr.indexOf(v); };
  $.map = function (arr, fn) { return Array.from(arr).map(fn); };
  $.grep = function (arr, fn) { return Array.from(arr).filter(fn); };

  // ── Expose globally ─────────────────────────────────────────────────
  window.jQuery = window.$ = $;

})(window);
