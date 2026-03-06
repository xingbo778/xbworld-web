let currentLevel = 2;
function log(level, message, ...args) {
  if (level > currentLevel) return;
  if (level <= 1) {
    console.error(message, ...args);
  } else if (level === 2) {
    console.log(message, ...args);
  } else {
    console.debug(message, ...args);
  }
}
function logError(message, ...args) {
  log(1, message, ...args);
}
function logNormal(message, ...args) {
  log(2, message, ...args);
}
function freelog(_level, message) {
  console.log(message);
}
var n$1, l$3, u$3, t$2, i$2, r$2, o$2, e$2, f$2, c$2, s$2, a$2, p$3 = {}, v$2 = [], y$3 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, d$2 = Array.isArray;
function w$4(n2, l2) {
  for (var u2 in l2) n2[u2] = l2[u2];
  return n2;
}
function g$2(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _$2(l2, u2, t2) {
  var i2, r2, o2, e2 = {};
  for (o2 in u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : e2[o2] = u2[o2];
  if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n$1.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
  return m$2(l2, e2, i2, r2, null);
}
function m$2(n2, t2, i2, r2, o2) {
  var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u$3 : o2, __i: -1, __u: 0 };
  return null == o2 && null != l$3.vnode && l$3.vnode(e2), e2;
}
function k$1(n2) {
  return n2.children;
}
function x$1(n2, l2) {
  this.props = n2, this.context = l2;
}
function S$1(n2, l2) {
  if (null == l2) return n2.__ ? S$1(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
  return "function" == typeof n2.type ? S$1(n2) : null;
}
function C$1(n2) {
  if (n2.__P && n2.__d) {
    var u2 = n2.__v, t2 = u2.__e, i2 = [], r2 = [], o2 = w$4({}, u2);
    o2.__v = u2.__v + 1, l$3.vnode && l$3.vnode(o2), z$1(n2.__P, o2, u2, n2.__n, n2.__P.namespaceURI, 32 & u2.__u ? [t2] : null, i2, null == t2 ? S$1(u2) : t2, !!(32 & u2.__u), r2), o2.__v = u2.__v, o2.__.__k[o2.__i] = o2, V(i2, o2, r2), u2.__e = u2.__ = null, o2.__e != t2 && M(o2);
  }
}
function M(n2) {
  if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l2) {
    if (null != l2 && null != l2.__e) return n2.__e = n2.__c.base = l2.__e;
  }), M(n2);
}
function $$1(n2) {
  (!n2.__d && (n2.__d = true) && i$2.push(n2) && !I.__r++ || r$2 != l$3.debounceRendering) && ((r$2 = l$3.debounceRendering) || o$2)(I);
}
function I() {
  for (var n2, l2 = 1; i$2.length; ) i$2.length > l2 && i$2.sort(e$2), n2 = i$2.shift(), l2 = i$2.length, C$1(n2);
  I.__r = 0;
}
function P(n2, l2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, y2, d2, w2, g2, _2, m2 = t2 && t2.__k || v$2, b2 = l2.length;
  for (f2 = A$1(u2, l2, m2, f2, b2), a2 = 0; a2 < b2; a2++) null != (y2 = u2.__k[a2]) && (h2 = -1 != y2.__i && m2[y2.__i] || p$3, y2.__i = a2, g2 = z$1(n2, y2, h2, i2, r2, o2, e2, f2, c2, s2), d2 = y2.__e, y2.ref && h2.ref != y2.ref && (h2.ref && D$1(h2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), null == w2 && null != d2 && (w2 = d2), (_2 = !!(4 & y2.__u)) || h2.__k === y2.__k ? f2 = H(y2, f2, n2, _2) : "function" == typeof y2.type && void 0 !== g2 ? f2 = g2 : d2 && (f2 = d2.nextSibling), y2.__u &= -7);
  return u2.__e = w2, f2;
}
function A$1(n2, l2, u2, t2, i2) {
  var r2, o2, e2, f2, c2, s2 = u2.length, a2 = s2, h2 = 0;
  for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2 ? ("string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? o2 = n2.__k[r2] = m$2(null, o2, null, null, null) : d$2(o2) ? o2 = n2.__k[r2] = m$2(k$1, { children: o2 }, null, null, null) : void 0 === o2.constructor && o2.__b > 0 ? o2 = n2.__k[r2] = m$2(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : n2.__k[r2] = o2, f2 = r2 + h2, o2.__ = n2, o2.__b = n2.__b + 1, e2 = null, -1 != (c2 = o2.__i = T$1(o2, u2, f2, a2)) && (a2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > s2 ? h2-- : i2 < s2 && h2++), "function" != typeof o2.type && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
  if (a2) for (r2 = 0; r2 < s2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = S$1(e2)), E(e2, e2));
  return t2;
}
function H(n2, l2, u2, t2) {
  var i2, r2;
  if ("function" == typeof n2.type) {
    for (i2 = n2.__k, r2 = 0; i2 && r2 < i2.length; r2++) i2[r2] && (i2[r2].__ = n2, l2 = H(i2[r2], l2, u2, t2));
    return l2;
  }
  n2.__e != l2 && (t2 && (l2 && n2.type && !l2.parentNode && (l2 = S$1(n2)), u2.insertBefore(n2.__e, l2 || null)), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 == l2.nodeType);
  return l2;
}
function T$1(n2, l2, u2, t2) {
  var i2, r2, o2, e2 = n2.key, f2 = n2.type, c2 = l2[u2], s2 = null != c2 && 0 == (2 & c2.__u);
  if (null === c2 && null == e2 || s2 && e2 == c2.key && f2 == c2.type) return u2;
  if (t2 > (s2 ? 1 : 0)) {
    for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) if (null != (c2 = l2[o2 = i2 >= 0 ? i2-- : r2++]) && 0 == (2 & c2.__u) && e2 == c2.key && f2 == c2.type) return o2;
  }
  return -1;
}
function j$1(n2, l2, u2) {
  "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || y$3.test(l2) ? u2 : u2 + "px";
}
function F$1(n2, l2, u2, t2, i2) {
  var r2, o2;
  n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || j$1(n2.style, l2, "");
    if (u2) for (l2 in u2) t2 && u2[l2] == t2[l2] || j$1(n2.style, l2, u2[l2]);
  }
  else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(f$2, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = c$2, n2.addEventListener(l2, r2 ? a$2 : s$2, r2)) : n2.removeEventListener(l2, r2 ? a$2 : s$2, r2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u2 ? "" : u2;
      break n;
    } catch (n3) {
    }
    "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
  }
}
function O(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (null == u2.t) u2.t = c$2++;
      else if (u2.t < t2.u) return;
      return t2(l$3.event ? l$3.event(u2) : u2);
    }
  };
}
function z$1(n2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, p2, y2, _2, m2, b2, S2, C2, M2, $2, I2, A2, H2, L, T2 = u2.type;
  if (void 0 !== u2.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), o2 = [f2 = u2.__e = t2.__e]), (a2 = l$3.__b) && a2(u2);
  n: if ("function" == typeof T2) try {
    if (S2 = u2.props, C2 = "prototype" in T2 && T2.prototype.render, M2 = (a2 = T2.contextType) && i2[a2.__c], $2 = a2 ? M2 ? M2.props.value : a2.__ : i2, t2.__c ? b2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (C2 ? u2.__c = h2 = new T2(S2, $2) : (u2.__c = h2 = new x$1(S2, $2), h2.constructor = T2, h2.render = G), M2 && M2.sub(h2), h2.state || (h2.state = {}), h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), C2 && null == h2.__s && (h2.__s = h2.state), C2 && null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = w$4({}, h2.__s)), w$4(h2.__s, T2.getDerivedStateFromProps(S2, h2.__s))), y2 = h2.props, _2 = h2.state, h2.__v = u2, p2) C2 && null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), C2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
    else {
      if (C2 && null == T2.getDerivedStateFromProps && S2 !== y2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(S2, $2), u2.__v == t2.__v || !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(S2, h2.__s, $2)) {
        u2.__v != t2.__v && (h2.props = S2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
          n3 && (n3.__ = u2);
        }), v$2.push.apply(h2.__h, h2._sb), h2._sb = [], h2.__h.length && e2.push(h2);
        break n;
      }
      null != h2.componentWillUpdate && h2.componentWillUpdate(S2, h2.__s, $2), C2 && null != h2.componentDidUpdate && h2.__h.push(function() {
        h2.componentDidUpdate(y2, _2, m2);
      });
    }
    if (h2.context = $2, h2.props = S2, h2.__P = n2, h2.__e = false, I2 = l$3.__r, A2 = 0, C2) h2.state = h2.__s, h2.__d = false, I2 && I2(u2), a2 = h2.render(h2.props, h2.state, h2.context), v$2.push.apply(h2.__h, h2._sb), h2._sb = [];
    else do {
      h2.__d = false, I2 && I2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
    } while (h2.__d && ++A2 < 25);
    h2.state = h2.__s, null != h2.getChildContext && (i2 = w$4(w$4({}, i2), h2.getChildContext())), C2 && !p2 && null != h2.getSnapshotBeforeUpdate && (m2 = h2.getSnapshotBeforeUpdate(y2, _2)), H2 = null != a2 && a2.type === k$1 && null == a2.key ? q$2(a2.props.children) : a2, f2 = P(n2, d$2(H2) ? H2 : [H2], u2, t2, i2, r2, o2, e2, f2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && e2.push(h2), b2 && (h2.__E = h2.__ = null);
  } catch (n3) {
    if (u2.__v = null, c2 || null != o2) if (n3.then) {
      for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; ) f2 = f2.nextSibling;
      o2[o2.indexOf(f2)] = null, u2.__e = f2;
    } else {
      for (L = o2.length; L--; ) g$2(o2[L]);
      N(u2);
    }
    else u2.__e = t2.__e, u2.__k = t2.__k, n3.then || N(u2);
    l$3.__e(n3, u2, t2);
  }
  else null == o2 && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = B$1(t2.__e, u2, t2, i2, r2, o2, e2, c2, s2);
  return (a2 = l$3.diffed) && a2(u2), 128 & u2.__u ? void 0 : f2;
}
function N(n2) {
  n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(N));
}
function V(n2, u2, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) D$1(t2[i2], t2[++i2], t2[++i2]);
  l$3.__c && l$3.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$3.__e(n3, u3.__v);
    }
  });
}
function q$2(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : d$2(n2) ? n2.map(q$2) : w$4({}, n2);
}
function B$1(u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, v2, y2, w2, _2, m2, b2 = i2.props || p$3, k2 = t2.props, x2 = t2.type;
  if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e2) {
    for (a2 = 0; a2 < e2.length; a2++) if ((w2 = e2[a2]) && "setAttribute" in w2 == !!x2 && (x2 ? w2.localName == x2 : 3 == w2.nodeType)) {
      u2 = w2, e2[a2] = null;
      break;
    }
  }
  if (null == u2) {
    if (null == x2) return document.createTextNode(k2);
    u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l$3.__m && l$3.__m(t2, e2), c2 = false), e2 = null;
  }
  if (null == x2) b2 === k2 || c2 && u2.data == k2 || (u2.data = k2);
  else {
    if (e2 = e2 && n$1.call(u2.childNodes), !c2 && null != e2) for (b2 = {}, a2 = 0; a2 < u2.attributes.length; a2++) b2[(w2 = u2.attributes[a2]).name] = w2.value;
    for (a2 in b2) w2 = b2[a2], "dangerouslySetInnerHTML" == a2 ? v2 = w2 : "children" == a2 || a2 in k2 || "value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2 || F$1(u2, a2, null, w2, o2);
    for (a2 in k2) w2 = k2[a2], "children" == a2 ? y2 = w2 : "dangerouslySetInnerHTML" == a2 ? h2 = w2 : "value" == a2 ? _2 = w2 : "checked" == a2 ? m2 = w2 : c2 && "function" != typeof w2 || b2[a2] === w2 || F$1(u2, a2, w2, b2[a2], o2);
    if (h2) c2 || v2 && (h2.__html == v2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
    else if (v2 && (u2.innerHTML = ""), P("template" == t2.type ? u2.content : u2, d$2(y2) ? y2 : [y2], t2, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && S$1(i2, 0), c2, s2), null != e2) for (a2 = e2.length; a2--; ) g$2(e2[a2]);
    c2 || (a2 = "value", "progress" == x2 && null == _2 ? u2.removeAttribute("value") : null != _2 && (_2 !== u2[a2] || "progress" == x2 && !_2 || "option" == x2 && _2 != b2[a2]) && F$1(u2, a2, _2, b2[a2], o2), a2 = "checked", null != m2 && m2 != u2[a2] && F$1(u2, a2, m2, b2[a2], o2));
  }
  return u2;
}
function D$1(n2, u2, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u;
      i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
    } else n2.current = u2;
  } catch (n3) {
    l$3.__e(n3, t2);
  }
}
function E(n2, u2, t2) {
  var i2, r2;
  if (l$3.unmount && l$3.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || D$1(i2, null, u2)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (n3) {
      l$3.__e(n3, u2);
    }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && E(i2[r2], u2, t2 || "function" != typeof n2.type);
  t2 || g$2(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function G(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function J(u2, t2, i2) {
  var r2, o2, e2, f2;
  t2 == document && (t2 = document.documentElement), l$3.__ && l$3.__(u2, t2), o2 = (r2 = false) ? null : t2.__k, e2 = [], f2 = [], z$1(t2, u2 = t2.__k = _$2(k$1, null, [u2]), o2 || p$3, p$3, t2.namespaceURI, o2 ? null : t2.firstChild ? n$1.call(t2.childNodes) : null, e2, o2 ? o2.__e : t2.firstChild, r2, f2), V(e2, u2, f2);
}
n$1 = v$2.slice, l$3 = { __e: function(n2, l2, u2, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u$3 = 0, t$2 = function(n2) {
  return null != n2 && void 0 === n2.constructor;
}, x$1.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = w$4({}, this.state), "function" == typeof n2 && (n2 = n2(w$4({}, u2), this.props)), n2 && w$4(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), $$1(this));
}, x$1.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), $$1(this));
}, x$1.prototype.render = k$1, i$2 = [], o$2 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$2 = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, I.__r = 0, f$2 = /(PointerCapture)$|Capture$/i, c$2 = 0, s$2 = O(false), a$2 = O(true);
var t$1, r$1, u$2, i$1, o$1 = 0, f$1 = [], c$1 = l$3, e$1 = c$1.__b, a$1 = c$1.__r, v$1 = c$1.diffed, l$2 = c$1.__c, m$1 = c$1.unmount, s$1 = c$1.__;
function p$2(n2, t2) {
  c$1.__h && c$1.__h(r$1, n2, o$1 || t2), o$1 = 0;
  var u2 = r$1.__H || (r$1.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function d$1(n2) {
  return o$1 = 1, h$2(D, n2);
}
function h$2(n2, u2, i2) {
  var o2 = p$2(t$1++, 2);
  if (o2.t = n2, !o2.__c && (o2.__ = [D(void 0, u2), function(n3) {
    var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
    t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
  }], o2.__c = r$1, !r$1.__f)) {
    var f2 = function(n3, t2, r2) {
      if (!o2.__c.__H) return true;
      var u3 = o2.__c.__H.__.filter(function(n4) {
        return n4.__c;
      });
      if (u3.every(function(n4) {
        return !n4.__N;
      })) return !c2 || c2.call(this, n3, t2, r2);
      var i3 = o2.__c.props !== n3;
      return u3.some(function(n4) {
        if (n4.__N) {
          var t3 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
        }
      }), c2 && c2.call(this, n3, t2, r2) || i3;
    };
    r$1.__f = true;
    var c2 = r$1.shouldComponentUpdate, e2 = r$1.componentWillUpdate;
    r$1.componentWillUpdate = function(n3, t2, r2) {
      if (this.__e) {
        var u3 = c2;
        c2 = void 0, f2(n3, t2, r2), c2 = u3;
      }
      e2 && e2.call(this, n3, t2, r2);
    }, r$1.shouldComponentUpdate = f2;
  }
  return o2.__N || o2.__;
}
function y$2(n2, u2) {
  var i2 = p$2(t$1++, 3);
  !c$1.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r$1.__H.__h.push(i2));
}
function A(n2) {
  return o$1 = 5, T(function() {
    return { current: n2 };
  }, []);
}
function T(n2, r2) {
  var u2 = p$2(t$1++, 7);
  return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function q$1(n2, t2) {
  return o$1 = 8, T(function() {
    return n2;
  }, t2);
}
function j() {
  for (var n2; n2 = f$1.shift(); ) {
    var t2 = n2.__H;
    if (n2.__P && t2) try {
      t2.__h.some(z), t2.__h.some(B), t2.__h = [];
    } catch (r2) {
      t2.__h = [], c$1.__e(r2, n2.__v);
    }
  }
}
c$1.__b = function(n2) {
  r$1 = null, e$1 && e$1(n2);
}, c$1.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s$1 && s$1(n2, t2);
}, c$1.__r = function(n2) {
  a$1 && a$1(n2), t$1 = 0;
  var i2 = (r$1 = n2.__c).__H;
  i2 && (u$2 === r$1 ? (i2.__h = [], r$1.__h = [], i2.__.some(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i2.__h.some(z), i2.__h.some(B), i2.__h = [], t$1 = 0)), u$2 = r$1;
}, c$1.diffed = function(n2) {
  v$1 && v$1(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i$1 === c$1.requestAnimationFrame || ((i$1 = c$1.requestAnimationFrame) || w$3)(j)), t2.__H.__.some(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u$2 = r$1 = null;
}, c$1.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.some(z), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], c$1.__e(r2, n3.__v);
    }
  }), l$2 && l$2(n2, t2);
}, c$1.unmount = function(n2) {
  m$1 && m$1(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.some(function(n3) {
    try {
      z(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && c$1.__e(t2, r2.__v));
};
var k = "function" == typeof requestAnimationFrame;
function w$3(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 35);
  k && (t2 = requestAnimationFrame(r2));
}
function z(n2) {
  var t2 = r$1, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r$1 = t2;
}
function B(n2) {
  var t2 = r$1;
  n2.__c = n2.__(), r$1 = t2;
}
function C(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
function D(n2, t2) {
  return "function" == typeof t2 ? t2(n2) : t2;
}
var i = Symbol.for("preact-signals");
function t() {
  if (!(s > 1)) {
    var i2, t2 = false;
    while (void 0 !== h$1) {
      var n2 = h$1;
      h$1 = void 0;
      v++;
      while (void 0 !== n2) {
        var r2 = n2.o;
        n2.o = void 0;
        n2.f &= -3;
        if (!(8 & n2.f) && a(n2)) try {
          n2.c();
        } catch (n3) {
          if (!t2) {
            i2 = n3;
            t2 = true;
          }
        }
        n2 = r2;
      }
    }
    v = 0;
    s--;
    if (t2) throw i2;
  } else s--;
}
function n(i2) {
  if (s > 0) return i2();
  s++;
  try {
    return i2();
  } finally {
    t();
  }
}
var r = void 0;
function o(i2) {
  var t2 = r;
  r = void 0;
  try {
    return i2();
  } finally {
    r = t2;
  }
}
var h$1 = void 0, s = 0, v = 0, u$1 = 0;
function e(i2) {
  if (void 0 !== r) {
    var t2 = i2.n;
    if (void 0 === t2 || t2.t !== r) {
      t2 = { i: 0, S: i2, p: r.s, n: void 0, t: r, e: void 0, x: void 0, r: t2 };
      if (void 0 !== r.s) r.s.n = t2;
      r.s = t2;
      i2.n = t2;
      if (32 & r.f) i2.S(t2);
      return t2;
    } else if (-1 === t2.i) {
      t2.i = 0;
      if (void 0 !== t2.n) {
        t2.n.p = t2.p;
        if (void 0 !== t2.p) t2.p.n = t2.n;
        t2.p = r.s;
        t2.n = void 0;
        r.s.n = t2;
        r.s = t2;
      }
      return t2;
    }
  }
}
function d(i2, t2) {
  this.v = i2;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
d.prototype.brand = i;
d.prototype.h = function() {
  return true;
};
d.prototype.S = function(i2) {
  var t2 = this, n2 = this.t;
  if (n2 !== i2 && void 0 === i2.e) {
    i2.x = n2;
    this.t = i2;
    if (void 0 !== n2) n2.e = i2;
    else o(function() {
      var i3;
      null == (i3 = t2.W) || i3.call(t2);
    });
  }
};
d.prototype.U = function(i2) {
  var t2 = this;
  if (void 0 !== this.t) {
    var n2 = i2.e, r2 = i2.x;
    if (void 0 !== n2) {
      n2.x = r2;
      i2.e = void 0;
    }
    if (void 0 !== r2) {
      r2.e = n2;
      i2.x = void 0;
    }
    if (i2 === this.t) {
      this.t = r2;
      if (void 0 === r2) o(function() {
        var i3;
        null == (i3 = t2.Z) || i3.call(t2);
      });
    }
  }
};
d.prototype.subscribe = function(i2) {
  var t2 = this;
  return m(function() {
    var n2 = t2.value, o2 = r;
    r = void 0;
    try {
      i2(n2);
    } finally {
      r = o2;
    }
  }, { name: "sub" });
};
d.prototype.valueOf = function() {
  return this.value;
};
d.prototype.toString = function() {
  return this.value + "";
};
d.prototype.toJSON = function() {
  return this.value;
};
d.prototype.peek = function() {
  var i2 = r;
  r = void 0;
  try {
    return this.value;
  } finally {
    r = i2;
  }
};
Object.defineProperty(d.prototype, "value", { get: function() {
  var i2 = e(this);
  if (void 0 !== i2) i2.i = this.i;
  return this.v;
}, set: function(i2) {
  if (i2 !== this.v) {
    if (v > 100) throw new Error("Cycle detected");
    this.v = i2;
    this.i++;
    u$1++;
    s++;
    try {
      for (var n2 = this.t; void 0 !== n2; n2 = n2.x) n2.t.N();
    } finally {
      t();
    }
  }
} });
function c(i2, t2) {
  return new d(i2, t2);
}
function a(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
  return false;
}
function l$1(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
    var n2 = t2.S.n;
    if (void 0 !== n2) t2.r = n2;
    t2.S.n = t2;
    t2.i = -1;
    if (void 0 === t2.n) {
      i2.s = t2;
      break;
    }
  }
}
function y$1(i2) {
  var t2 = i2.s, n2 = void 0;
  while (void 0 !== t2) {
    var r2 = t2.p;
    if (-1 === t2.i) {
      t2.S.U(t2);
      if (void 0 !== r2) r2.n = t2.n;
      if (void 0 !== t2.n) t2.n.p = r2;
    } else n2 = t2;
    t2.S.n = t2.r;
    if (void 0 !== t2.r) t2.r = void 0;
    t2 = r2;
  }
  i2.s = n2;
}
function w$2(i2, t2) {
  d.call(this, void 0);
  this.x = i2;
  this.s = void 0;
  this.g = u$1 - 1;
  this.f = 4;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
w$2.prototype = new d();
w$2.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === u$1) return true;
  this.g = u$1;
  this.f |= 1;
  if (this.i > 0 && !a(this)) {
    this.f &= -2;
    return true;
  }
  var i2 = r;
  try {
    l$1(this);
    r = this;
    var t2 = this.x();
    if (16 & this.f || this.v !== t2 || 0 === this.i) {
      this.v = t2;
      this.f &= -17;
      this.i++;
    }
  } catch (i3) {
    this.v = i3;
    this.f |= 16;
    this.i++;
  }
  r = i2;
  y$1(this);
  this.f &= -2;
  return true;
};
w$2.prototype.S = function(i2) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
  }
  d.prototype.S.call(this, i2);
};
w$2.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    d.prototype.U.call(this, i2);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    }
  }
};
w$2.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
  }
};
Object.defineProperty(w$2.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var i2 = e(this);
  this.h();
  if (void 0 !== i2) i2.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function b$1(i2, t2) {
  return new w$2(i2, t2);
}
function _$1(i2) {
  var n2 = i2.u;
  i2.u = void 0;
  if ("function" == typeof n2) {
    s++;
    var o2 = r;
    r = void 0;
    try {
      n2();
    } catch (t2) {
      i2.f &= -2;
      i2.f |= 8;
      p$1(i2);
      throw t2;
    } finally {
      r = o2;
      t();
    }
  }
}
function p$1(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
  i2.x = void 0;
  i2.s = void 0;
  _$1(i2);
}
function g$1(i2) {
  if (r !== this) throw new Error("Out-of-order effect");
  y$1(this);
  r = i2;
  this.f &= -2;
  if (8 & this.f) p$1(this);
  t();
}
function S(i2, t2) {
  this.x = i2;
  this.u = void 0;
  this.s = void 0;
  this.o = void 0;
  this.f = 32;
  this.name = null == t2 ? void 0 : t2.name;
}
S.prototype.c = function() {
  var i2 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    var t2 = this.x();
    if ("function" == typeof t2) this.u = t2;
  } finally {
    i2();
  }
};
S.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _$1(this);
  l$1(this);
  s++;
  var i2 = r;
  r = this;
  return g$1.bind(this, i2);
};
S.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h$1;
    h$1 = this;
  }
};
S.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) p$1(this);
};
S.prototype.dispose = function() {
  this.d();
};
function m(i2, t2) {
  var n2 = new S(i2, t2);
  try {
    n2.c();
  } catch (i3) {
    n2.d();
    throw i3;
  }
  var r2 = n2.d.bind(n2);
  r2[Symbol.dispose] = r2;
  return r2;
}
var l, h, p = "undefined" != typeof window && !!window.__PREACT_SIGNALS_DEVTOOLS__, _ = [];
m(function() {
  l = this.N;
})();
function g(i2, r2) {
  l$3[i2] = r2.bind(null, l$3[i2] || function() {
  });
}
function b(i2) {
  if (h) {
    var n2 = h;
    h = void 0;
    n2();
  }
  h = i2 && i2.S();
}
function y(i2) {
  var n2 = this, t2 = i2.data, f2 = useSignal(t2);
  f2.value = t2;
  var e2 = T(function() {
    var i3 = n2, t3 = n2.__v;
    while (t3 = t3.__) if (t3.__c) {
      t3.__c.__$f |= 4;
      break;
    }
    var o2 = b$1(function() {
      var i4 = f2.value.value;
      return 0 === i4 ? 0 : true === i4 ? "" : i4 || "";
    }), e3 = b$1(function() {
      return !Array.isArray(o2.value) && !t$2(o2.value);
    }), a3 = m(function() {
      this.N = F;
      if (e3.value) {
        var n3 = o2.value;
        if (i3.__v && i3.__v.__e && 3 === i3.__v.__e.nodeType) i3.__v.__e.data = n3;
      }
    }), v3 = n2.__$u.d;
    n2.__$u.d = function() {
      a3();
      v3.call(this);
    };
    return [e3, o2];
  }, []), a2 = e2[0], v2 = e2[1];
  return a2.value ? v2.peek() : v2.value;
}
y.displayName = "ReactiveTextNode";
Object.defineProperties(d.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: y }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
g("__b", function(i2, n2) {
  if ("string" == typeof n2.type) {
    var r2, t2 = n2.props;
    for (var o2 in t2) if ("children" !== o2) {
      var f2 = t2[o2];
      if (f2 instanceof d) {
        if (!r2) n2.__np = r2 = {};
        r2[o2] = f2;
        t2[o2] = f2.peek();
      }
    }
  }
  i2(n2);
});
g("__r", function(i2, n2) {
  i2(n2);
  if (n2.type !== k$1) {
    b();
    var r2, o2 = n2.__c;
    if (o2) {
      o2.__$f &= -2;
      if (void 0 === (r2 = o2.__$u)) o2.__$u = r2 = (function(i3, n3) {
        var r3;
        m(function() {
          r3 = this;
        }, { name: n3 });
        r3.c = i3;
        return r3;
      })(function() {
        var i3;
        if (p) null == (i3 = r2.y) || i3.call(r2);
        o2.__$f |= 1;
        o2.setState({});
      }, "function" == typeof n2.type ? n2.type.displayName || n2.type.name : "");
    }
    b(r2);
  }
});
g("__e", function(i2, n2, r2, t2) {
  b();
  i2(n2, r2, t2);
});
g("diffed", function(i2, n2) {
  b();
  var r2;
  if ("string" == typeof n2.type && (r2 = n2.__e)) {
    var t2 = n2.__np, o2 = n2.props;
    if (t2) {
      var f2 = r2.U;
      if (f2) for (var e2 in f2) {
        var u2 = f2[e2];
        if (void 0 !== u2 && !(e2 in t2)) {
          u2.d();
          f2[e2] = void 0;
        }
      }
      else {
        f2 = {};
        r2.U = f2;
      }
      for (var a2 in t2) {
        var c2 = f2[a2], v2 = t2[a2];
        if (void 0 === c2) {
          c2 = w$1(r2, a2, v2);
          f2[a2] = c2;
        } else c2.o(v2, o2);
      }
      for (var s2 in t2) o2[s2] = t2[s2];
    }
  }
  i2(n2);
});
function w$1(i2, n2, r2, t2) {
  var o2 = n2 in i2 && void 0 === i2.ownerSVGElement, f2 = c(r2), e2 = r2.peek();
  return { o: function(i3, n3) {
    f2.value = i3;
    e2 = i3.peek();
  }, d: m(function() {
    this.N = F;
    var r3 = f2.value.value;
    if (e2 !== r3) {
      e2 = void 0;
      if (o2) i2[n2] = r3;
      else if (null != r3 && (false !== r3 || "-" === n2[4])) i2.setAttribute(n2, r3);
      else i2.removeAttribute(n2);
    } else e2 = void 0;
  }) };
}
g("unmount", function(i2, n2) {
  if ("string" == typeof n2.type) {
    var r2 = n2.__e;
    if (r2) {
      var t2 = r2.U;
      if (t2) {
        r2.U = void 0;
        for (var o2 in t2) {
          var f2 = t2[o2];
          if (f2) f2.d();
        }
      }
    }
    n2.__np = void 0;
  } else {
    var e2 = n2.__c;
    if (e2) {
      var u2 = e2.__$u;
      if (u2) {
        e2.__$u = void 0;
        u2.d();
      }
    }
  }
  i2(n2);
});
g("__h", function(i2, n2, r2, t2) {
  if (t2 < 3 || 9 === t2) n2.__$f |= 2;
  i2(n2, r2, t2);
});
x$1.prototype.shouldComponentUpdate = function(i2, n2) {
  if (this.__R) return true;
  var r2 = this.__$u, t2 = r2 && void 0 !== r2.s;
  for (var o2 in n2) return true;
  if (this.__f || "boolean" == typeof this.u && true === this.u) {
    var f2 = 2 & this.__$f;
    if (!(t2 || f2 || 4 & this.__$f)) return true;
    if (1 & this.__$f) return true;
  } else {
    if (!(t2 || 4 & this.__$f)) return true;
    if (3 & this.__$f) return true;
  }
  for (var e2 in i2) if ("__source" !== e2 && i2[e2] !== this.props[e2]) return true;
  for (var u2 in this.props) if (!(u2 in i2)) return true;
  return false;
};
function useSignal(i2, n2) {
  return T(function() {
    return c(i2, n2);
  }, []);
}
var q = function(i2) {
  queueMicrotask(function() {
    queueMicrotask(i2);
  });
};
function x() {
  n(function() {
    var i2;
    while (i2 = _.shift()) l.call(i2);
  });
}
function F() {
  if (1 === _.push(this)) (l$3.requestAnimationFrame || q)(x);
}
class EventBus {
  handlers = /* @__PURE__ */ new Map();
  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, /* @__PURE__ */ new Set());
    }
    this.handlers.get(event).add(handler);
    return () => this.off(event, handler);
  }
  off(event, handler) {
    this.handlers.get(event)?.delete(handler);
  }
  emit(event, data) {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const h2 of set) {
      try {
        h2(data);
      } catch (e2) {
        console.error(`Event handler error [${event}]:`, e2);
      }
    }
  }
  once(event, handler) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      handler(data);
    };
    return this.on(event, wrapper);
  }
  clear() {
    this.handlers.clear();
  }
}
const globalEvents = new EventBus();
class GameStore {
  gameInfo = null;
  calendarInfo = null;
  mapInfo = null;
  rulesControl = null;
  rulesSummary = null;
  rulesDescription = null;
  tiles = {};
  terrains = {};
  unitTypes = {};
  units = {};
  cities = {};
  players = {};
  techs = {};
  connections = {};
  nations = {};
  governments = {};
  improvements = {};
  extras = {};
  serverSettings = {};
  client = {
    conn: { id: 0, playing: null }
  };
  // Client-side state
  username = null;
  gameType = "";
  observing = false;
  frozen = false;
  phaseStartTime = 0;
  debugActive = false;
  autostart = false;
  reset() {
    this.tiles = {};
    this.terrains = {};
    this.unitTypes = {};
    this.units = {};
    this.cities = {};
    this.players = {};
    this.techs = {};
    this.connections = {};
    this.client.conn = { id: 0, playing: null };
    globalEvents.emit("store:reset");
  }
  findCityById(id) {
    return this.cities[id];
  }
  findUnitById(id) {
    return this.units[id];
  }
  findPlayerById(id) {
    return this.players[id];
  }
  getTile(index) {
    return this.tiles[index];
  }
}
const store = new GameStore();
const IDENTITY_NUMBER_ZERO = 0;
const ACTION_COUNT$1 = 139;
var ClientState = /* @__PURE__ */ ((ClientState2) => {
  ClientState2[ClientState2["INITIAL"] = 0] = "INITIAL";
  ClientState2[ClientState2["PREPARING"] = 1] = "PREPARING";
  ClientState2[ClientState2["RUNNING"] = 2] = "RUNNING";
  ClientState2[ClientState2["OVER"] = 3] = "OVER";
  return ClientState2;
})(ClientState || {});
const RENDERER_2DCANVAS$1 = 1;
const DIR8_NORTHWEST$1 = 0;
const DIR8_NORTH$2 = 1;
const DIR8_NORTHEAST$1 = 2;
const DIR8_WEST$2 = 3;
const DIR8_EAST$2 = 4;
const DIR8_SOUTHWEST$1 = 5;
const DIR8_SOUTH$2 = 6;
const DIR8_SOUTHEAST$1 = 7;
function clientState() {
  return window.civclient_state ?? ClientState.INITIAL;
}
function canClientChangeView() {
  const playing2 = store.client?.conn?.playing;
  const observer = clientIsObserver();
  return (playing2 != null || observer) && (clientState() === ClientState.RUNNING || clientState() === ClientState.OVER);
}
function canClientControl() {
  return !clientIsObserver();
}
function canClientIssueOrders() {
  return canClientControl() && clientState() === ClientState.RUNNING;
}
function clientIsObserver() {
  const c2 = store.client;
  const obs = store.observing;
  if (c2 == null || c2.conn == null) {
    return false;
  }
  return c2.conn.playing == null || c2.conn.observer || obs;
}
function clientPlaying() {
  return store.client?.conn?.playing ?? null;
}
const C_S_INITIAL = ClientState.INITIAL;
const C_S_PREPARING = ClientState.PREPARING;
const C_S_RUNNING = ClientState.RUNNING;
const C_S_OVER = ClientState.OVER;
const gameInfo = c(store.gameInfo);
const calendarInfo = c(store.calendarInfo);
const mapInfo = c(store.mapInfo);
b$1(() => gameInfo.value?.turn ?? 0);
b$1(() => {
  const gi = gameInfo.value;
  if (!gi) return "";
  const cal = calendarInfo.value;
  const year = gi.year ?? 0;
  if (year < 0) return `${-year} ${cal?.negative_year_label ?? "BC"}`;
  return `${year} ${cal?.positive_year_label ?? "AD"}`;
});
const playerCount = c(0);
const cityCount = c(0);
const unitCount = c(0);
const isObserver = c(false);
const connectedPlayer = c(null);
function syncFromStore() {
  gameInfo.value = store.gameInfo;
  calendarInfo.value = store.calendarInfo;
  mapInfo.value = store.mapInfo;
  playerCount.value = Object.keys(store.players).length;
  cityCount.value = Object.keys(store.cities).length;
  unitCount.value = Object.keys(store.units).length;
  isObserver.value = store.observing;
  connectedPlayer.value = clientPlaying()?.playerno ?? null;
}
globalEvents.on("game:info", syncFromStore);
globalEvents.on("game:beginturn", syncFromStore);
globalEvents.on("map:allocated", syncFromStore);
globalEvents.on("store:reset", syncFromStore);
globalEvents.on("tile:updated", () => {
  mapInfo.value = store.mapInfo;
});
globalEvents.on("city:updated", () => {
  cityCount.value = Object.keys(store.cities).length;
});
globalEvents.on("unit:updated", () => {
  unitCount.value = Object.keys(store.units).length;
});
const MAX_LEN_NAME = 48;
const MAX_LEN_CITYNAME = 50;
const FC_INFINITY = 1e3 * 1e3 * 1e3;
const ACTIVITY_IDLE = 0;
const ACTIVITY_CULTIVATE = 1;
const ACTIVITY_MINE = 2;
const ACTIVITY_IRRIGATE = 3;
const ACTIVITY_FORTIFIED = 4;
const ACTIVITY_SENTRY = 5;
const ACTIVITY_PILLAGE$1 = 6;
const ACTIVITY_GOTO = 7;
const ACTIVITY_TRANSFORM = 9;
const ACTIVITY_FORTIFYING = 10;
const ACTIVITY_CLEAN = 11;
const ACTIVITY_BASE = 12;
const ACTIVITY_GEN_ROAD = 13;
const ACTIVITY_CONVERT = 14;
const ACTIVITY_PLANT = 15;
const ACTIVITY_LAST = 16;
const ACTRES_PARADROP = 29;
const ACTRES_PARADROP_CONQUER = 59;
const ATK_CITY = 0;
const ATK_UNIT = 1;
const ATK_UNITS = 2;
const ATK_TILE = 3;
const ATK_EXTRAS = 4;
const ATK_SELF = 5;
const ATK_COUNT = 6;
const ACTION_SPY_TARGETED_SABOTAGE_CITY = 10;
const ACTION_SPY_TARGETED_SABOTAGE_CITY_ESC = 11;
const ACTION_SPY_STEAL_TECH = 14;
const ACTION_SPY_STEAL_TECH_ESC = 15;
const ACTION_SPY_TARGETED_STEAL_TECH = 16;
const ACTION_SPY_TARGETED_STEAL_TECH_ESC = 17;
const ACTION_SPY_INCITE_CITY = 18;
const ACTION_SPY_INCITE_CITY_ESC = 19;
const ACTION_SPY_BRIBE_UNIT = 23;
const ACTION_FOUND_CITY = 27;
const ACTION_JOIN_CITY = 28;
const ACTION_NUKE = 33;
const ACTION_NUKE_CITY = 34;
const ACTION_NUKE_UNITS = 35;
const ACTION_DISBAND_UNIT_RECOVER = 38;
const ACTION_DISBAND_UNIT = 39;
const ACTION_HOME_CITY = 40;
const ACTION_UPGRADE_UNIT = 42;
const ACTION_AIRLIFT = 44;
const ACTION_ATTACK = 45;
const ACTION_SUICIDE_ATTACK = 47;
const ACTION_ROAD = 61;
const ACTION_IRRIGATE = 63;
const ACTION_MINE = 65;
const ACTION_BASE = 67;
const ACTION_PILLAGE$1 = 69;
const ACTION_TRANSPORT_BOARD = 71;
const ACTION_TRANSPORT_DEBOARD = 74;
const ACTION_TRANSPORT_UNLOAD = 86;
const ACTION_CLEAN = 122;
const ACTION_TRANSFORM_TERRAIN = 131;
const ACTION_COUNT = 139;
const ACT_DEC_NOTHING = 0;
const ACT_DEC_PASSIVE = 1;
const ACT_DEC_ACTIVE = 2;
const VUT_ADVANCE = 4;
const VUT_IMPROVEMENT = 20;
const VUT_UTYPE = 61;
const O_FOOD$1 = 0;
const O_SHIELD$1 = 1;
const O_TRADE = 2;
const O_GOLD$1 = 3;
const O_LUXURY = 4;
const O_SCIENCE = 5;
const EC_IRRIGATION = 0;
const EC_MINE = 1;
const EC_ROAD = 2;
const EC_BASE = 3;
const ERM_PILLAGE$1 = 0;
const ERM_CLEAN = 1;
const REQ_RANGE_PLAYER = 7;
const TECH_UNKNOWN$1 = 0;
const TECH_PREREQS_KNOWN$1 = 1;
const TECH_KNOWN$2 = 2;
var f = 0;
function u(e2, t2, n2, o2, i2, u2) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f, __i: -1, __u: 0, __source: i2, __self: u2 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l$3.vnode && l$3.vnode(l2), l2;
}
function Dialog({
  title,
  open,
  onClose,
  width = "auto",
  height = "auto",
  modal = true,
  draggable = true,
  className = "",
  children
}) {
  const dialogRef = A(null);
  const [pos, setPos] = d$1({ x: -1, y: -1 });
  const dragging = A(false);
  const dragOffset = A({ x: 0, y: 0 });
  y$2(() => {
    if (open && pos.x === -1 && dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setPos({
        x: Math.max(0, (window.innerWidth - rect.width) / 2),
        y: Math.max(0, (window.innerHeight - rect.height) / 3)
      });
    }
  }, [open]);
  const onPointerDown = q$1((e2) => {
    if (!draggable) return;
    dragging.current = true;
    dragOffset.current = {
      x: e2.clientX - pos.x,
      y: e2.clientY - pos.y
    };
    e2.target.setPointerCapture(e2.pointerId);
  }, [draggable, pos]);
  const onPointerMove = q$1((e2) => {
    if (!dragging.current) return;
    setPos({
      x: e2.clientX - dragOffset.current.x,
      y: e2.clientY - dragOffset.current.y
    });
  }, []);
  const onPointerUp = q$1(() => {
    dragging.current = false;
  }, []);
  if (!open) return null;
  const style = {
    position: "fixed",
    zIndex: 1e4,
    width,
    height,
    ...pos.x >= 0 ? { left: pos.x, top: pos.y } : {}
  };
  return /* @__PURE__ */ u(k$1, { children: [
    modal && /* @__PURE__ */ u(
      "div",
      {
        class: "xb-dialog-overlay",
        onClick: onClose,
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 9999
        }
      }
    ),
    /* @__PURE__ */ u(
      "div",
      {
        ref: dialogRef,
        class: `xb-dialog ${className}`,
        style,
        children: [
          /* @__PURE__ */ u(
            "div",
            {
              class: "xb-dialog-titlebar",
              onPointerDown,
              onPointerMove,
              onPointerUp,
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 10px",
                background: "linear-gradient(to bottom, #4a4a4a, #333)",
                color: "#fff",
                cursor: draggable ? "move" : "default",
                userSelect: "none",
                borderRadius: "4px 4px 0 0"
              },
              children: [
                /* @__PURE__ */ u("span", { style: { fontWeight: "bold", fontSize: "14px" }, children: title }),
                onClose && /* @__PURE__ */ u(
                  "button",
                  {
                    onClick: onClose,
                    style: {
                      background: "none",
                      border: "none",
                      color: "#ccc",
                      fontSize: "18px",
                      cursor: "pointer",
                      padding: "0 4px",
                      lineHeight: 1
                    },
                    "aria-label": "Close",
                    children: "×"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ u(
            "div",
            {
              class: "xb-dialog-content",
              style: {
                background: "#1a1a2e",
                color: "#e0e0e0",
                padding: "12px",
                borderRadius: "0 0 4px 4px",
                border: "1px solid #444",
                borderTop: "none",
                maxHeight: "80vh",
                overflow: "auto"
              },
              children
            }
          )
        ]
      }
    )
  ] });
}
const VARIANT_STYLES = {
  primary: {
    background: "linear-gradient(to bottom, #5b9bd5, #3a7cc0)",
    color: "#fff",
    border: "1px solid #2a6ca0"
  },
  secondary: {
    background: "linear-gradient(to bottom, #555, #444)",
    color: "#ddd",
    border: "1px solid #666"
  },
  danger: {
    background: "linear-gradient(to bottom, #d55b5b, #c03a3a)",
    color: "#fff",
    border: "1px solid #a02a2a"
  }
};
function Button({
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  children
}) {
  const styles = VARIANT_STYLES[variant];
  return /* @__PURE__ */ u(
    "button",
    {
      onClick,
      disabled,
      class: `xb-btn ${className}`,
      style: {
        ...styles,
        padding: "6px 16px",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: "13px",
        fontWeight: "bold",
        transition: "opacity 0.15s"
      },
      children
    }
  );
}
const state$5 = c({
  open: false,
  title: "",
  text: "",
  type: "",
  showCancelButton: false,
  confirmButtonText: "OK",
  onConfirm: null
});
function closeSwal() {
  state$5.value = { ...state$5.value, open: false };
}
function confirm$1() {
  const cb = state$5.value.onConfirm;
  closeSwal();
  if (cb) cb();
}
const TYPE_ICONS = {
  warning: "⚠️",
  error: "❌",
  success: "✅",
  info: "ℹ️"
};
function swal(titleOrOpts, textOrCb, type) {
  if (typeof titleOrOpts === "object") {
    const opts = titleOrOpts;
    const cb = typeof textOrCb === "function" ? textOrCb : null;
    state$5.value = {
      open: true,
      title: opts.title || "",
      text: opts.text || "",
      type: opts.type || "",
      showCancelButton: !!opts.showCancelButton,
      confirmButtonText: opts.confirmButtonText || "OK",
      onConfirm: cb
    };
  } else {
    state$5.value = {
      open: true,
      title: titleOrOpts,
      text: typeof textOrCb === "string" ? textOrCb : "",
      type: type || "",
      showCancelButton: false,
      confirmButtonText: "OK",
      onConfirm: null
    };
  }
}
function SwalDialog() {
  const { open, title, text, type, showCancelButton, confirmButtonText } = state$5.value;
  const icon = TYPE_ICONS[type] || "";
  return /* @__PURE__ */ u(
    Dialog,
    {
      title: icon ? `${icon} ${title}` : title,
      open,
      onClose: closeSwal,
      width: 360,
      modal: true,
      children: [
        text && /* @__PURE__ */ u("div", { style: { marginBottom: "12px", lineHeight: 1.5 }, children: text }),
        /* @__PURE__ */ u("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px" }, children: [
          showCancelButton && /* @__PURE__ */ u(Button, { onClick: closeSwal, children: "Cancel" }),
          /* @__PURE__ */ u(Button, { onClick: confirm$1, children: confirmButtonText })
        ] })
      ]
    }
  );
}
let mouse_x = 0;
let mouse_y = 0;
let prev_mouse_x = 0;
let prev_mouse_y = 0;
let keyboard_input = true;
let unitpanel_active = false;
let allow_right_click = false;
let mapview_mouse_movement = false;
function setMouseX(v2) {
  mouse_x = v2;
}
function setMouseY(v2) {
  mouse_y = v2;
}
function setPrevMouseX(v2) {
  prev_mouse_x = v2;
}
function setPrevMouseY(v2) {
  prev_mouse_y = v2;
}
function setKeyboardInput(v2) {
  keyboard_input = v2;
}
function setUnitpanelActive(v2) {
  unitpanel_active = v2;
}
function setAllowRightClick(v2) {
  allow_right_click = v2;
}
function setMapviewMouseMovement(v2) {
  mapview_mouse_movement = v2;
}
let roads$1 = [];
let bases$1 = [];
let current_focus$1 = [];
let urgent_focus_queue = [];
let waiting_units_list = [];
function setCurrentFocus(v2) {
  current_focus$1 = v2;
}
function setUrgentFocusQueue(v2) {
  urgent_focus_queue = v2;
}
function setWaitingUnitsList(v2) {
  waiting_units_list = v2;
}
let goto_active = false;
let paradrop_active = false;
let airlift_active = false;
let action_tgt_sel_active = false;
let goto_last_order = -1;
let goto_last_action = -1;
let goto_request_map = {};
let goto_turns_request_map = {};
let current_goto_turns = 0;
function setGotoActive(v2) {
  goto_active = v2;
}
function setParadropActive(v2) {
  paradrop_active = v2;
}
function setAirliftActive(v2) {
  airlift_active = v2;
}
function setActionTgtSelActive(v2) {
  action_tgt_sel_active = v2;
}
function setGotoLastOrder(v2) {
  goto_last_order = v2;
}
function setGotoLastAction(v2) {
  goto_last_action = v2;
}
function setGotoRequestMap(v2) {
  goto_request_map = v2;
}
function setGotoTurnsRequestMap(v2) {
  goto_turns_request_map = v2;
}
function setCurrentGotoTurns(v2) {
  current_goto_turns = v2;
}
const SELECT_POPUP = 0;
let intro_click_description = true;
let resize_enabled = true;
let show_citybar = true;
let context_menu_active = true;
let has_movesleft_warning_been_shown = false;
let game_unit_panel_state = null;
let end_turn_info_message_shown = false;
function setIntroClickDescription(v2) {
  intro_click_description = v2;
}
function setResizeEnabled(v2) {
  resize_enabled = v2;
}
function setShowCitybar(v2) {
  show_citybar = v2;
}
function setContextMenuActive(v2) {
  context_menu_active = v2;
}
function setHasMovesleftWarningBeenShown(v2) {
  has_movesleft_warning_been_shown = v2;
}
function setGameUnitPanelState(v2) {
  game_unit_panel_state = v2;
}
function setEndTurnInfoMessageShown(v2) {
  end_turn_info_message_shown = v2;
}
let chat_send_to = -1;
const CHAT_ICON_EVERYBODY = String.fromCharCode(62075);
const CHAT_ICON_ALLIES = String.fromCharCode(61746);
function setChatSendTo(v2) {
  chat_send_to = v2;
}
let action_selection_in_progress_for = IDENTITY_NUMBER_ZERO;
let is_more_user_input_needed = false;
function setActionSelectionInProgressFor(v2) {
  action_selection_in_progress_for = v2;
}
function setIsMoreUserInputNeeded(v2) {
  is_more_user_input_needed = v2;
}
function set_is_more_user_input_needed(val) {
  is_more_user_input_needed = val;
}
let mouse_touch_started_on_unit = false;
function setMouseTouchStartedOnUnit(v2) {
  mouse_touch_started_on_unit = v2;
}
const EXTRA_NONE$1 = -1;
const BASE_GUI_FORTRESS = 0;
const BASE_GUI_AIRBASE = 1;
function extraByNumber(id) {
  if (id === EXTRA_NONE$1) {
    return null;
  }
  const extras2 = window.extras;
  const rc = window.ruleset_control;
  if (id >= 0 && rc && id < rc["num_extra_types"]) {
    return extras2[id];
  } else {
    console.log("extra_by_number(): Invalid extra id: " + id);
    return null;
  }
}
function isExtraCausedBy(pextra, cause) {
  return pextra.causes.isSet(cause);
}
function isExtraRemovedBy(pextra, rmcause) {
  return pextra.rmcauses.isSet(rmcause);
}
const MAX_NUM_PLAYERS = 30;
const MAX_AI_LOVE$1 = 1e3;
var DiplState = /* @__PURE__ */ ((DiplState2) => {
  DiplState2[DiplState2["DS_ARMISTICE"] = 0] = "DS_ARMISTICE";
  DiplState2[DiplState2["DS_WAR"] = 1] = "DS_WAR";
  DiplState2[DiplState2["DS_CEASEFIRE"] = 2] = "DS_CEASEFIRE";
  DiplState2[DiplState2["DS_PEACE"] = 3] = "DS_PEACE";
  DiplState2[DiplState2["DS_ALLIANCE"] = 4] = "DS_ALLIANCE";
  DiplState2[DiplState2["DS_NO_CONTACT"] = 5] = "DS_NO_CONTACT";
  DiplState2[DiplState2["DS_TEAM"] = 6] = "DS_TEAM";
  DiplState2[DiplState2["DS_LAST"] = 7] = "DS_LAST";
  return DiplState2;
})(DiplState || {});
var PlayerFlag = /* @__PURE__ */ ((PlayerFlag2) => {
  PlayerFlag2[PlayerFlag2["PLRF_AI"] = 0] = "PLRF_AI";
  PlayerFlag2[PlayerFlag2["PLRF_SCENARIO_RESERVED"] = 1] = "PLRF_SCENARIO_RESERVED";
  PlayerFlag2[PlayerFlag2["PLRF_COUNT"] = 2] = "PLRF_COUNT";
  return PlayerFlag2;
})(PlayerFlag || {});
const research_data = {};
function valid_player_by_number(playerno) {
  if (players[playerno] == null) return null;
  return players[playerno];
}
function player_by_number(playerno) {
  if (players[playerno] == null) return null;
  return players[playerno];
}
function player_by_full_username(pname) {
  for (const player_id in players) {
    const pplayer = players[player_id];
    if (pplayer.username === pname) return pplayer;
    if ("AI " + pplayer.name === pname) return pplayer;
  }
  return null;
}
function player_find_unit_by_id(pplayer, unit_id) {
  for (const id in units) {
    const punit = units[id];
    if (punit.owner === pplayer.playerno && punit.id === unit_id) {
      return punit;
    }
  }
  return null;
}
function get_diplstate_text(state_id) {
  switch (state_id) {
    case 0:
      return "Armistice";
    case 1:
      return "War";
    case 2:
      return "Ceasefire";
    case 3:
      return "Peace";
    case 4:
      return "Alliance";
    case 5:
      return "No contact";
    case 6:
      return "Team";
    default:
      return "Unknown";
  }
}
function get_embassy_text(player_id) {
  const pplayer = players[player_id];
  if (pplayer == null) return "";
  if (pplayer.embassy_txt != null) return pplayer.embassy_txt;
  return "";
}
function get_ai_level_text(player) {
  if (player.ai_skill_level === 0) return "Away";
  if (player.ai_skill_level === 1) return "Handicapped";
  if (player.ai_skill_level === 2) return "Novice";
  if (player.ai_skill_level === 3) return "Easy";
  if (player.ai_skill_level === 4) return "Normal";
  if (player.ai_skill_level === 5) return "Hard";
  if (player.ai_skill_level === 6) return "Cheating";
  if (player.ai_skill_level === 7) return "Experimental";
  return "";
}
function get_player_connection_status(pplayer) {
  if (pplayer == null) return "";
  for (const cid in connections) {
    const pconn = connections[cid];
    if (pconn.playing != null && pconn.playing.playerno === pplayer.playerno) {
      return "connected";
    }
  }
  if (pplayer.ai_skill_level > 0) return "AI";
  return "disconnected";
}
function research_get(pplayer) {
  if (pplayer == null) return null;
  return research_data[pplayer.playerno] ?? null;
}
function player_capital(player) {
  if (player == null) return null;
  for (const city_id in cities) {
    const pcity = cities[city_id];
    if (pcity.owner === player.playerno && is_capital(pcity)) {
      return pcity;
    }
  }
  return null;
}
function is_capital(pcity) {
  if (pcity.improvements == null) return false;
  for (const imp_id in improvements) {
    const imp = improvements[imp_id];
    if (imp != null && imp.genus === 0 && pcity.improvements[imp.id] === true) {
      return true;
    }
  }
  return false;
}
const _w$6 = window;
_w$6["MAX_NUM_PLAYERS"] = MAX_NUM_PLAYERS;
_w$6["MAX_AI_LOVE"] = MAX_AI_LOVE$1;
_w$6["DS_ARMISTICE"] = 0;
_w$6["DS_WAR"] = 1;
_w$6["DS_CEASEFIRE"] = 2;
_w$6["DS_PEACE"] = 3;
_w$6["DS_ALLIANCE"] = 4;
_w$6["DS_NO_CONTACT"] = 5;
_w$6["DS_TEAM"] = 6;
_w$6["DS_LAST"] = 7;
_w$6["PLRF_AI"] = 0;
_w$6["PLRF_SCENARIO_RESERVED"] = 1;
_w$6["PLRF_COUNT"] = 2;
var Order = /* @__PURE__ */ ((Order2) => {
  Order2[Order2["MOVE"] = 0] = "MOVE";
  Order2[Order2["ACTIVITY"] = 1] = "ACTIVITY";
  Order2[Order2["FULL_MP"] = 2] = "FULL_MP";
  Order2[Order2["ACTION_MOVE"] = 3] = "ACTION_MOVE";
  Order2[Order2["PERFORM_ACTION"] = 4] = "PERFORM_ACTION";
  Order2[Order2["LAST"] = 5] = "LAST";
  return Order2;
})(Order || {});
var UnitSSDataType = /* @__PURE__ */ ((UnitSSDataType2) => {
  UnitSSDataType2[UnitSSDataType2["QUEUE"] = 0] = "QUEUE";
  UnitSSDataType2[UnitSSDataType2["UNQUEUE"] = 1] = "UNQUEUE";
  UnitSSDataType2[UnitSSDataType2["BATTLE_GROUP"] = 2] = "BATTLE_GROUP";
  UnitSSDataType2[UnitSSDataType2["SENTRY"] = 3] = "SENTRY";
  return UnitSSDataType2;
})(UnitSSDataType || {});
var ServerSideAgent = /* @__PURE__ */ ((ServerSideAgent2) => {
  ServerSideAgent2[ServerSideAgent2["NONE"] = 0] = "NONE";
  ServerSideAgent2[ServerSideAgent2["AUTOWORKER"] = 1] = "AUTOWORKER";
  ServerSideAgent2[ServerSideAgent2["AUTOEXPLORE"] = 2] = "AUTOEXPLORE";
  ServerSideAgent2[ServerSideAgent2["COUNT"] = 3] = "COUNT";
  return ServerSideAgent2;
})(ServerSideAgent || {});
const ANIM_STEPS = 8;
const anim_units_max = 30;
let anim_units_count = 0;
function unit_owner(punit) {
  return player_by_number(punit.owner);
}
function client_remove_unit(punit) {
  control_unit_killed(punit);
  if (unit_is_in_focus(punit)) {
    current_focus = [];
  }
  delete units[punit.id];
}
function tile_units(ptile) {
  if (ptile == null) return null;
  return ptile["units"];
}
function get_supported_units(pcity) {
  if (pcity == null) return null;
  const result = [];
  for (const unit_id in units) {
    const punit = units[unit_id];
    if (punit.homecity === pcity.id) {
      result.push(punit);
    }
  }
  return result;
}
function update_tile_unit(punit) {
  if (punit == null) return;
  const ptile = indexToTile(punit.tile);
  if (ptile == null || ptile["units"] == null) return;
  let found = false;
  for (let i2 = 0; i2 < ptile["units"].length; i2++) {
    if (ptile["units"][i2].id === punit.id) {
      found = true;
    }
  }
  if (!found) {
    ptile["units"].push(punit);
  }
}
function clear_tile_unit(punit) {
  if (punit == null) return;
  const ptile = indexToTile(punit.tile);
  if (ptile == null || ptile["units"] == null) return;
  const idx = ptile["units"].indexOf(punit);
  if (idx >= 0) {
    ptile["units"].splice(idx, 1);
  }
}
function unit_list_size(unit_list) {
  if (unit_list == null) return 0;
  return unit_list.length;
}
function unit_list_without(unit_list, punit) {
  return unit_list.filter((funit) => funit.id !== punit.id);
}
function unit_type(punit) {
  return unit_types[punit.type];
}
function unit_can_do_action(punit, act_id) {
  return utype_can_do_action(unit_type(punit), act_id);
}
function get_unit_moves_left(punit) {
  if (punit == null) {
    return 0;
  }
  return "Moves:" + move_points_text(punit.movesleft);
}
function move_points_text(moves) {
  const sm = window.SINGLE_MOVE;
  let result;
  if (moves % sm !== 0) {
    if (Math.floor(moves / sm) > 0) {
      result = Math.floor(moves / sm) + " " + Math.floor(moves % sm) + "/" + sm;
    } else {
      result = Math.floor(moves % sm) + "/" + sm;
    }
  } else {
    result = String(Math.floor(moves / sm));
  }
  return result;
}
function unit_has_goto(punit) {
  const _client = window.client;
  if (_client?.conn?.playing == null || punit.owner !== _client.conn.playing.playerno) {
    return false;
  }
  return punit.goto_tile !== -1;
}
function update_unit_anim_list(old_unit, new_unit) {
  if (old_unit == null || new_unit == null) return;
  if (new_unit.tile === old_unit.tile) return;
  if (anim_units_count > anim_units_max) return;
  if (renderer === RENDERER_2DCANVAS && !is_unit_visible(new_unit)) return;
  if (old_unit["anim_list"] == null) old_unit["anim_list"] = [];
  if (new_unit["transported"] === true) {
    old_unit["anim_list"] = [];
    return;
  }
  anim_units_count += 1;
  const animList = old_unit["anim_list"];
  let has_old_pos = false;
  let has_new_pos = false;
  for (let i2 = 0; i2 < animList.length; i2++) {
    const anim_tuple = animList[i2];
    if (anim_tuple.tile === old_unit.tile) {
      has_old_pos = true;
    }
    if (anim_tuple.tile === new_unit.tile) {
      has_new_pos = true;
    }
  }
  if (!has_old_pos) {
    animList.push({ tile: old_unit.tile, i: ANIM_STEPS });
  }
  if (!has_new_pos) {
    animList.push({ tile: new_unit.tile, i: ANIM_STEPS });
  }
}
function get_unit_anim_offset(punit) {
  const offset = { x: 0, y: 0 };
  const animList = punit["anim_list"];
  if (animList != null && animList.length >= 2) {
    const anim_tuple_src = animList[0];
    const anim_tuple_dst = animList[1];
    const src_tile = indexToTile(anim_tuple_src.tile);
    const dst_tile = indexToTile(anim_tuple_dst.tile);
    const u_tile = indexToTile(punit.tile);
    anim_tuple_dst.i = anim_tuple_dst.i - 1;
    const i2 = Math.floor((anim_tuple_dst.i + 2) / 3);
    const r2 = map_to_gui_pos(src_tile["x"], src_tile["y"]);
    const src_gx = r2["gui_dx"];
    const src_gy = r2["gui_dy"];
    const s2 = map_to_gui_pos(dst_tile["x"], dst_tile["y"]);
    const dst_gx = s2["gui_dx"];
    const dst_gy = s2["gui_dy"];
    const t2 = map_to_gui_pos(u_tile["x"], u_tile["y"]);
    const punit_gx = t2["gui_dx"];
    const punit_gy = t2["gui_dy"];
    const gui_dx = Math.floor((dst_gx - src_gx) * (i2 / ANIM_STEPS)) + (punit_gx - dst_gx);
    const gui_dy = Math.floor((dst_gy - src_gy) * (i2 / ANIM_STEPS)) + (punit_gy - dst_gy);
    if (i2 === 0) {
      animList.splice(0, 1);
      if (animList.length === 1) {
        animList.splice(0, 1);
      }
    }
    offset.x = -gui_dx;
    offset.y = -gui_dy;
  } else {
    anim_units_count -= 1;
  }
  return offset;
}
function get_unit_homecity_name(punit) {
  if (punit.homecity !== 0 && cities[punit.homecity] != null) {
    return decodeURIComponent(cities[punit.homecity]["name"]);
  }
  return null;
}
function is_unit_visible(punit) {
  if (punit == null || punit.tile == null) return false;
  const u_tile = indexToTile(punit.tile);
  const r2 = map_to_gui_pos(u_tile["x"], u_tile["y"]);
  const unit_gui_x = r2["gui_dx"];
  const unit_gui_y = r2["gui_dy"];
  if (unit_gui_x < mapview["gui_x0"] || unit_gui_y < mapview["gui_y0"] || unit_gui_x > mapview["gui_x0"] + mapview["width"] || unit_gui_y > mapview["gui_y0"] + mapview["height"]) {
    return false;
  }
  return true;
}
function unittype_ids_alphabetic() {
  const unittype_names = [];
  for (const unit_id in unit_types) {
    const punit_type = unit_types[unit_id];
    unittype_names.push(punit_type["name"]);
  }
  unittype_names.sort();
  const unittype_id_list = [];
  for (const unit_name of unittype_names) {
    for (const unit_id in unit_types) {
      const punit_type = unit_types[unit_id];
      if (unit_name === punit_type["name"]) {
        unittype_id_list.push(unit_id);
      }
    }
  }
  return unittype_id_list;
}
function get_unit_city_info(punit) {
  let result = "";
  const ptype = unit_type(punit);
  result += ptype["name"] + "\nFood/Shield/Gold: ";
  if (punit["upkeep"] != null) {
    result += punit["upkeep"][O_FOOD] + "/" + punit["upkeep"][O_SHIELD] + "/" + punit["upkeep"][O_GOLD];
  }
  result += "\n" + get_unit_moves_left(punit) + "\n";
  const homecity = get_unit_homecity_name(punit);
  if (homecity != null) {
    result += homecity;
  }
  return result;
}
function get_what_can_unit_pillage_from(punit, ptile) {
  const targets = [];
  if (punit == null) return targets;
  if (ptile == null) {
    ptile = indexToTile(punit.tile);
  }
  if (terrains[ptile.terrain].pillage_time === 0) return targets;
  if (!utype_can_do_action(unit_type(punit), ACTION_PILLAGE)) return targets;
  const cannot_pillage = new BitVector([]);
  for (const unit_idx in Object.keys(ptile.units)) {
    const u2 = ptile.units[unit_idx];
    if (u2.activity === ACTIVITY_PILLAGE) {
      cannot_pillage.set(u2.activity_tgt);
    }
  }
  for (let i2 = 0; i2 < ruleset_control["num_extra_types"]; i2++) {
    if (tile_has_extra(ptile, i2)) {
      const extra = extras[i2];
      for (let j2 = 0; j2 < extra.reqs.length; j2++) {
        const req = extra.reqs[j2];
        if (req.kind === VUT_EXTRA && req.present === true) {
          cannot_pillage.set(req.value);
        }
      }
    } else {
      cannot_pillage.set(i2);
    }
  }
  for (let i2 = 0; i2 < ruleset_control["num_extra_types"]; i2++) {
    if (is_extra_removed_by(extras[i2], ERM_PILLAGE) && !cannot_pillage.isSet(i2)) {
      if (game_info.pillage_select) {
        targets.push(i2);
      } else {
        targets.push(EXTRA_NONE);
        break;
      }
    }
  }
  return targets;
}
const E_SCRIPT = 45;
const E_BAD_COMMAND = 93;
const E_CHAT_MSG = 95;
const E_LOG_ERROR = 100;
const E_BEGINNER_HELP = 127;
const E_CHAT_PRIVATE = 139;
const E_CHAT_ALLIES = 140;
const E_CHAT_OBSERVER = 141;
const E_UNDEFINED = 142;
const fc_e_events = [
  "e_city_cantbuild",
  "e_city_lost",
  "e_city_love",
  "e_city_disorder",
  "e_city_famine",
  "e_city_famine_feared",
  "e_city_growth",
  "e_city_may_soon_grow",
  "e_city_aqueduct",
  "e_city_aq_building",
  "e_city_normal",
  "e_city_nuked",
  "e_city_cma_release",
  "e_city_gran_throttle",
  "e_city_transfer",
  "e_city_build",
  "e_city_production_changed",
  "e_worklist",
  "e_uprising",
  "e_civil_war",
  "e_anarchy",
  "e_first_contact",
  "e_new_government",
  "e_low_on_funds",
  "e_pollution",
  "e_revolt_done",
  "e_revolt_start",
  "e_spaceship",
  "e_my_diplomat_bribe",
  "e_diplomatic_incident",
  "e_my_diplomat_escape",
  "e_my_diplomat_embassy",
  "e_my_diplomat_failed",
  "e_my_diplomat_incite",
  "e_my_diplomat_poison",
  "e_my_diplomat_sabotage",
  "e_my_diplomat_theft",
  "e_enemy_diplomat_bribe",
  "e_enemy_diplomat_embassy",
  "e_enemy_diplomat_failed",
  "e_enemy_diplomat_incite",
  "e_enemy_diplomat_poison",
  "e_enemy_diplomat_sabotage",
  "e_enemy_diplomat_theft",
  "e_caravan_action",
  "e_script",
  "e_broadcast_report",
  "e_game_end",
  "e_game_start",
  "e_nation_selected",
  "e_destroyed",
  "e_report",
  "e_turn_bell",
  "e_next_year",
  "e_global_eco",
  "e_nuke",
  "e_hut_barb",
  "e_hut_city",
  "e_hut_gold",
  "e_hut_barb_killed",
  "e_hut_merc",
  "e_hut_settler",
  "e_hut_tech",
  "e_hut_barb_city_near",
  "e_imp_buy",
  "e_imp_build",
  "e_imp_auctioned",
  "e_imp_auto",
  "e_imp_sold",
  "e_tech_gain",
  "e_tech_learned",
  "e_treaty_alliance",
  "e_treaty_broken",
  "e_treaty_ceasefire",
  "e_treaty_peace",
  "e_treaty_shared_vision",
  "e_unit_lost_att",
  "e_unit_win_att",
  "e_unit_buy",
  "e_unit_built",
  "e_unit_lost_def",
  "e_unit_win_def",
  "e_unit_became_vet",
  "e_unit_upgraded",
  "e_unit_relocated",
  "e_unit_orders",
  "e_wonder_build",
  "e_wonder_obsolete",
  "e_wonder_started",
  "e_wonder_stopped",
  "e_wonder_will_be_built",
  "e_diplomacy",
  "e_treaty_embassy",
  "e_bad_command",
  "e_setting",
  "e_chat_msg",
  "e_message_wall",
  "e_chat_error",
  "e_connection",
  "e_ai_debug",
  "e_log_error",
  "e_log_fatal",
  "e_tech_goal",
  "e_unit_lost_misc",
  "e_city_plague",
  "e_vote_new",
  "e_vote_resolved",
  "e_vote_aborted",
  "e_city_radius_sq",
  "e_unit_built_pop_cost",
  "e_disaster",
  "e_achievement",
  "e_tech_lost",
  "e_tech_embassy",
  "e_my_spy_steal_gold",
  "e_enemy_spy_steal_gold",
  "e_spontaneous_extra",
  "e_unit_illegal_action",
  "e_my_spy_steal_map",
  "e_enemy_spy_steal_map",
  "e_my_spy_nuke",
  "e_enemy_spy_nuke",
  "e_unit_was_expelled",
  "e_unit_did_expel",
  "e_unit_action_failed",
  "e_unit_escaped",
  "e_deprecation_warning",
  "e_beginner_help",
  "e_my_unit_did_heal",
  "e_my_unit_was_healed",
  "e_multiplier",
  "e_unit_action_actor_success",
  "e_unit_action_actor_failure",
  "e_unit_action_target_other",
  "e_unit_action_target_hostile",
  "e_infrapoints",
  "e_hut_map",
  "e_treaty_shared_tiles",
  "e_city_conquered",
  "e_chat_private",
  "e_chat_allies",
  "e_chat_observer",
  "e_undefined"
];
function hashString(s2) {
  let h2 = 0;
  for (let i2 = 0; i2 < s2.length; i2++) {
    h2 = (h2 << 5) - h2 + s2.charCodeAt(i2) | 0;
  }
  return h2 >>> 0;
}
function seedrandom(_seed) {
  let state2 = hashString(_seed);
  const rng = function() {
    state2 |= 0;
    state2 = state2 + 1831565813 | 0;
    let t2 = Math.imul(state2 ^ state2 >>> 15, 1 | state2);
    t2 = t2 + Math.imul(t2 ^ t2 >>> 7, 61 | t2) ^ t2;
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
  return rng;
}
Math.seedrandom = seedrandom;
window.seedrandom = seedrandom;
const instances = /* @__PURE__ */ new Map();
function initTabs(selector, options) {
  const container = document.querySelector(selector);
  if (!container) return;
  const ul = container.querySelector("ul");
  if (!ul) return;
  const tabs = [];
  const panels = [];
  ul.querySelectorAll('li > a[href^="#"]').forEach((a2) => {
    const anchor = a2;
    const panelId = anchor.getAttribute("href").substring(1);
    const panel = document.getElementById(panelId);
    if (panel) {
      tabs.push(anchor);
      panels.push(panel);
    }
  });
  const state2 = {
    container,
    tabs,
    panels,
    active: options?.active ?? 0
  };
  tabs.forEach((tab, i2) => {
    tab.addEventListener("click", (e2) => {
      e2.preventDefault();
      setActiveTab(selector, i2);
    });
  });
  instances.set(selector, state2);
  container.classList.add("ui-tabs", "ui-widget", "ui-widget-content", "ui-corner-all");
  ul.classList.add("ui-tabs-nav", "ui-helper-reset", "ui-helper-clearfix", "ui-widget-header", "ui-corner-all");
  ul.setAttribute("role", "tablist");
  tabs.forEach((tab) => {
    const li = tab.parentElement;
    if (li) {
      li.classList.add("ui-state-default", "ui-corner-top");
      li.setAttribute("role", "tab");
    }
    tab.classList.add("ui-tabs-anchor");
  });
  panels.forEach((panel) => {
    panel.classList.add("ui-tabs-panel", "ui-widget-content", "ui-corner-bottom");
    panel.setAttribute("role", "tabpanel");
  });
  setActiveTab(selector, state2.active);
  if (options?.heightStyle === "fill") {
    container.style.height = window.innerHeight + "px";
  }
}
function setActiveTab(selector, index) {
  const state2 = instances.get(selector);
  if (!state2) return;
  state2.active = index;
  state2.tabs.forEach((tab, i2) => {
    const li = tab.parentElement;
    if (i2 === index) {
      li?.classList.add("ui-tabs-active", "ui-state-active");
      tab.setAttribute("aria-selected", "true");
      tab.setAttribute("tabindex", "0");
    } else {
      li?.classList.remove("ui-tabs-active", "ui-state-active");
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    }
  });
  state2.panels.forEach((panel, i2) => {
    panel.style.display = i2 === index ? "" : "none";
  });
}
function getActiveTab(selector) {
  return instances.get(selector)?.active ?? 0;
}
const TILE_UNKNOWN = 0;
const TILE_KNOWN_UNSEEN = 1;
const TILE_KNOWN_SEEN = 2;
function tileGetKnown(ptile) {
  if (ptile.known == null || ptile.known === TILE_UNKNOWN) return TILE_UNKNOWN;
  if (ptile.known === TILE_KNOWN_UNSEEN) return TILE_KNOWN_UNSEEN;
  return TILE_KNOWN_SEEN;
}
function tileHasExtra(ptile, extra) {
  const extras2 = ptile.extras;
  if (!extras2) return false;
  if (typeof extras2.isSet === "function") {
    return extras2.isSet(extra);
  }
  return false;
}
function tileResource(ptile) {
  return ptile?.resource ?? null;
}
function tileHasTerritoryClaimingExtra(ptile) {
  const win2 = window;
  const rulesetControl = win2.ruleset_control;
  if (!rulesetControl) return false;
  const numExtras = rulesetControl["num_extra_types"] ?? 0;
  for (let extra = 0; extra < numExtras; extra++) {
    if (tileHasExtra(ptile, extra) && typeof win2.territory_claiming_extra === "function" && typeof win2.extra_by_number === "function" && win2.territory_claiming_extra(win2.extra_by_number(extra))) {
      return true;
    }
  }
  return false;
}
function tileOwner(tile) {
  return tile.owner;
}
function tileCity(ptile) {
  if (!ptile) return null;
  const cityId = ptile.worked;
  const cities2 = window.cities;
  if (!cities2) return null;
  const pcity = cities2[cityId];
  if (pcity && pcity.tile === ptile.index) {
    return pcity;
  }
  return null;
}
function tileTerrain(ptile) {
  const terrains2 = window.terrains;
  if (!terrains2) return void 0;
  return terrains2[ptile.terrain];
}
function tileTerrainNear(ptile) {
  const near = [];
  for (let dir = 0; dir < 8; dir++) {
    const tile1 = mapstep(ptile, dir);
    if (tile1 && tileGetKnown(tile1) !== TILE_UNKNOWN) {
      const terrain1 = tileTerrain(tile1);
      if (terrain1) {
        near[dir] = terrain1;
        continue;
      }
      logError(`build_tile_data() tile (${ptile.x},${ptile.y}) has no terrain!`);
    }
    near[dir] = tileTerrain(ptile);
  }
  return near;
}
function isOceanTile(ptile) {
  const t2 = tileTerrain(ptile);
  if (!t2) return false;
  return t2.graphic_str === "floor" || t2.graphic_str === "coast";
}
const _w$5 = window;
if (!_w$5["terrains"]) _w$5["terrains"] = {};
if (!_w$5["resources"]) _w$5["resources"] = {};
if (!_w$5["terrain_control"]) _w$5["terrain_control"] = {};
const UTYF_FLAGLESS = 29;
const U_NOT_OBSOLETED = null;
function utype_can_do_action$1(putype, action_id) {
  if (putype == null || putype["utype_actions"] == null) return false;
  return putype["utype_actions"].isSet(action_id);
}
function utype_can_do_action_result(putype, result) {
  for (let action_id = 0; action_id < ACTION_COUNT$1; action_id++) {
    if (utype_can_do_action$1(putype, action_id)) {
      const paction = action_by_number(action_id);
      if (paction != null && action_has_result(paction, result)) {
        return true;
      }
    }
  }
  return false;
}
function can_player_build_unit_direct(p2, punittype) {
  if (punittype == null || p2 == null) return false;
  if (punittype["tech_requirement"] != null && punittype["tech_requirement"] >= 0) {
    if (player_invention_state(p2, punittype["tech_requirement"]) !== TECH_KNOWN) {
      return false;
    }
  }
  if (punittype["obsoleted_by"] != null && punittype["obsoleted_by"] >= 0) {
    const obs_type = unit_types[punittype["obsoleted_by"]];
    if (obs_type != null) {
      if (obs_type["tech_requirement"] == null || obs_type["tech_requirement"] < 0) {
        return false;
      }
      if (player_invention_state(p2, obs_type["tech_requirement"]) === TECH_KNOWN) {
        return false;
      }
    }
  }
  return true;
}
function get_units_from_tech(tech_id) {
  const result = [];
  for (const unit_type_id in unit_types) {
    const punit_type = unit_types[unit_type_id];
    if (punit_type == null) continue;
    if (punit_type.tech_requirement === tech_id) {
      result.push(punit_type);
    }
  }
  return result;
}
const MATCH_NONE$1 = 0;
const MATCH_SAME$1 = 1;
const MATCH_PAIR$1 = 2;
const MATCH_FULL$1 = 3;
const CELL_WHOLE$1 = 0;
const CELL_CORNER$1 = 1;
const _w$4 = window;
_w$4.MATCH_NONE = MATCH_NONE$1;
_w$4.MATCH_SAME = MATCH_SAME$1;
_w$4.MATCH_PAIR = MATCH_PAIR$1;
_w$4.MATCH_FULL = MATCH_FULL$1;
_w$4.CELL_WHOLE = CELL_WHOLE$1;
_w$4.CELL_CORNER = CELL_CORNER$1;
const tileset_tile_width = 96;
const tileset_tile_height = 48;
const tileset_name = "amplio2";
const tileset_image_count = 3;
const normal_tile_width = 96;
const normal_tile_height = 48;
const unit_flag_offset_x = 25;
const city_flag_offset_x = 2;
const unit_activity_offset_x = 55;
const unit_offset_x = 19;
const unit_offset_y = 14;
const citybar_offset_y = 55;
const citybar_offset_x = 45;
const tilelabel_offset_y = 15;
const tilelabel_offset_x = 0;
const dither_offset_x = [normal_tile_width / 2, 0, normal_tile_width / 2, 0];
const dither_offset_y = [0, normal_tile_height / 2, normal_tile_height / 2, 0];
const ts_layer = [];
ts_layer[0] = {};
ts_layer[0]["match_types"] = ["shallow", "deep", "land"];
ts_layer[1] = {};
ts_layer[1]["match_types"] = ["forest", "hills", "mountains", "water", "ice", "jungle"];
ts_layer[2] = {};
ts_layer[2]["match_types"] = ["water", "ice"];
const ts_tiles = {};
ts_tiles["lake"] = {};
ts_tiles["lake"]["is_blended"] = 0;
ts_tiles["lake"]["num_layers"] = 1;
ts_tiles["lake"]["layer0_match_type"] = "shallow";
ts_tiles["lake"]["layer0_match_with"] = ["land"];
ts_tiles["lake"]["layer0_sprite_type"] = "corner";
ts_tiles["coast"] = {};
ts_tiles["coast"]["is_blended"] = 1;
ts_tiles["coast"]["num_layers"] = 2;
ts_tiles["coast"]["layer0_match_type"] = "shallow";
ts_tiles["coast"]["layer0_match_with"] = ["deep", "land"];
ts_tiles["coast"]["layer0_sprite_type"] = "corner";
ts_tiles["coast"]["layer1_match_type"] = "water";
ts_tiles["coast"]["layer1_match_with"] = ["ice"];
ts_tiles["coast"]["layer1_sprite_type"] = "corner";
ts_tiles["floor"] = {};
ts_tiles["floor"]["is_blended"] = 0;
ts_tiles["floor"]["num_layers"] = 2;
ts_tiles["floor"]["layer0_match_type"] = "deep";
ts_tiles["floor"]["layer0_match_with"] = ["shallow", "land"];
ts_tiles["floor"]["layer0_sprite_type"] = "corner";
ts_tiles["floor"]["layer1_match_type"] = "water";
ts_tiles["floor"]["layer1_match_with"] = ["ice"];
ts_tiles["floor"]["layer1_sprite_type"] = "corner";
ts_tiles["arctic"] = {};
ts_tiles["arctic"]["is_blended"] = 0;
ts_tiles["arctic"]["num_layers"] = 3;
ts_tiles["arctic"]["layer0_match_type"] = "shallow";
ts_tiles["arctic"]["layer1_match_type"] = "ice";
ts_tiles["arctic"]["layer2_match_type"] = "ice";
ts_tiles["arctic"]["mine_sprite"] = "tx.oil_mine";
ts_tiles["desert"] = {};
ts_tiles["desert"]["is_blended"] = 1;
ts_tiles["desert"]["num_layers"] = 1;
ts_tiles["desert"]["layer0_match_type"] = "land";
ts_tiles["desert"]["mine_sprite"] = "tx.oil_mine";
ts_tiles["forest"] = {};
ts_tiles["forest"]["is_blended"] = 1;
ts_tiles["forest"]["num_layers"] = 2;
ts_tiles["forest"]["layer0_match_type"] = "land";
ts_tiles["forest"]["layer1_match_type"] = "forest";
ts_tiles["forest"]["layer1_match_with"] = ["forest"];
ts_tiles["grassland"] = {};
ts_tiles["grassland"]["is_blended"] = 1;
ts_tiles["grassland"]["num_layers"] = 1;
ts_tiles["grassland"]["layer0_match_type"] = "land";
ts_tiles["hills"] = {};
ts_tiles["hills"]["is_blended"] = 1;
ts_tiles["hills"]["num_layers"] = 2;
ts_tiles["hills"]["layer0_match_type"] = "land";
ts_tiles["hills"]["layer1_match_type"] = "hills";
ts_tiles["hills"]["layer1_match_with"] = ["hills"];
ts_tiles["hills"]["mine_sprite"] = "tx.mine";
ts_tiles["jungle"] = {};
ts_tiles["jungle"]["is_blended"] = 1;
ts_tiles["jungle"]["num_layers"] = 2;
ts_tiles["jungle"]["layer0_match_type"] = "land";
ts_tiles["jungle"]["layer1_match_type"] = "jungle";
ts_tiles["jungle"]["layer1_match_with"] = ["jungle"];
ts_tiles["mountains"] = {};
ts_tiles["mountains"]["is_blended"] = 1;
ts_tiles["mountains"]["num_layers"] = 2;
ts_tiles["mountains"]["layer0_match_type"] = "land";
ts_tiles["mountains"]["layer1_match_type"] = "mountains";
ts_tiles["mountains"]["layer1_match_with"] = ["mountains"];
ts_tiles["mountains"]["mine_sprite"] = "tx.mine";
ts_tiles["plains"] = {};
ts_tiles["plains"]["is_blended"] = 1;
ts_tiles["plains"]["num_layers"] = 1;
ts_tiles["plains"]["layer0_match_type"] = "land";
ts_tiles["swamp"] = {};
ts_tiles["swamp"]["is_blended"] = 1;
ts_tiles["swamp"]["num_layers"] = 1;
ts_tiles["swamp"]["layer0_match_type"] = "land";
ts_tiles["tundra"] = {};
ts_tiles["tundra"]["is_blended"] = 1;
ts_tiles["tundra"]["num_layers"] = 1;
ts_tiles["tundra"]["layer0_match_type"] = "land";
ts_tiles["inaccessible"] = {};
ts_tiles["inaccessible"]["is_blended"] = 0;
ts_tiles["inaccessible"]["num_layers"] = 1;
ts_tiles["inaccessible"]["layer0_match_type"] = "land";
const tile_types_setup = {
  "l0.lake": { "match_style": MATCH_PAIR$1, "sprite_type": CELL_CORNER$1, "mine_tag": "(null)", "match_indices": 2, "match_index": [0, 2], "dither": false },
  "l0.coast": { "match_style": MATCH_FULL$1, "sprite_type": CELL_CORNER$1, "mine_tag": "(null)", "match_indices": 3, "match_index": [0, 1, 2], "dither": false },
  "l1.coast": { "match_style": MATCH_PAIR$1, "sprite_type": CELL_CORNER$1, "mine_tag": "(null)", "match_indices": 2, "match_index": [3, 4], "dither": false },
  "l0.floor": { "match_style": MATCH_FULL$1, "sprite_type": CELL_CORNER$1, "mine_tag": "(null)", "match_indices": 3, "match_index": [1, 0, 2], "dither": false },
  "l1.floor": { "match_style": MATCH_PAIR$1, "sprite_type": CELL_CORNER$1, "mine_tag": "(null)", "match_indices": 2, "match_index": [3, 4], "dither": false },
  "l0.arctic": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "tx.oil_mine", "match_indices": 1, "match_index": [0], "dither": false },
  "l0.desert": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "tx.oil_mine", "match_indices": 1, "match_index": [2], "dither": true },
  "l0.forest": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 1, "match_index": [2], "dither": true },
  "l1.forest": { "match_style": MATCH_SAME$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 2, "match_index": [0, 0], "dither": false },
  "l0.grassland": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 1, "match_index": [2], "dither": true },
  "l0.hills": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "tx.mine", "match_indices": 1, "match_index": [2], "dither": true },
  "l1.hills": { "match_style": MATCH_SAME$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "tx.mine", "match_indices": 2, "match_index": [1, 1], "dither": false },
  "l0.jungle": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 1, "match_index": [5], "dither": true },
  "l1.jungle": { "match_style": MATCH_SAME$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 2, "match_index": [5, 5], "dither": false },
  "l0.mountains": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "tx.mine", "match_indices": 1, "match_index": [2], "dither": true },
  "l1.mountains": { "match_style": MATCH_SAME$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "tx.mine", "match_indices": 2, "match_index": [2, 2], "dither": false },
  "l0.plains": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 1, "match_index": [2], "dither": true },
  "l0.swamp": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 1, "match_index": [2], "dither": true },
  "l0.tundra": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 1, "match_index": [2], "dither": true },
  "l0.inaccessible": { "match_style": MATCH_NONE$1, "sprite_type": CELL_WHOLE$1, "mine_tag": "(null)", "match_indices": 1, "match_index": [2], "dither": false }
};
const cellgroup_map = {
  "coast.0": "t.l0.cellgroup_s_s_s_s",
  "coast.1": "t.l0.cellgroup_s_s_s_s",
  "coast.2": "t.l0.cellgroup_s_s_s_s",
  "coast.3": "t.l0.cellgroup_s_s_s_s",
  "coast.4": "t.l0.cellgroup_s_s_s_d",
  "coast.5": "t.l0.cellgroup_s_d_s_s",
  "coast.6": "t.l0.cellgroup_d_s_s_s",
  "coast.7": "t.l0.cellgroup_s_s_d_s",
  "coast.8": "t.l0.cellgroup_s_s_s_l",
  "coast.9": "t.l0.cellgroup_s_l_s_s",
  "coast.10": "t.l0.cellgroup_l_s_s_s",
  "coast.11": "t.l0.cellgroup_s_s_l_s",
  "coast.12": "t.l0.cellgroup_d_s_s_s",
  "coast.13": "t.l0.cellgroup_s_s_d_s",
  "coast.14": "t.l0.cellgroup_s_d_s_s",
  "coast.15": "t.l0.cellgroup_s_s_s_d",
  "coast.16": "t.l0.cellgroup_d_s_s_d",
  "coast.17": "t.l0.cellgroup_s_d_d_s",
  "coast.18": "t.l0.cellgroup_d_d_s_s",
  "coast.19": "t.l0.cellgroup_s_s_d_d",
  "coast.20": "t.l0.cellgroup_d_s_s_l",
  "coast.21": "t.l0.cellgroup_s_l_d_s",
  "coast.22": "t.l0.cellgroup_l_d_s_s",
  "coast.23": "t.l0.cellgroup_s_s_l_d",
  "coast.24": "t.l0.cellgroup_l_s_s_s",
  "coast.25": "t.l0.cellgroup_s_s_l_s",
  "coast.26": "t.l0.cellgroup_s_l_s_s",
  "coast.27": "t.l0.cellgroup_s_s_s_l",
  "coast.28": "t.l0.cellgroup_l_s_s_d",
  "coast.29": "t.l0.cellgroup_s_d_l_s",
  "coast.30": "t.l0.cellgroup_d_l_s_s",
  "coast.31": "t.l0.cellgroup_s_s_d_l",
  "coast.32": "t.l0.cellgroup_l_s_s_l",
  "coast.33": "t.l0.cellgroup_s_l_l_s",
  "coast.34": "t.l0.cellgroup_l_l_s_s",
  "coast.35": "t.l0.cellgroup_s_s_l_l",
  "coast.36": "t.l0.cellgroup_s_d_s_s",
  "coast.37": "t.l0.cellgroup_s_s_s_d",
  "coast.38": "t.l0.cellgroup_s_s_d_s",
  "coast.39": "t.l0.cellgroup_d_s_s_s",
  "coast.40": "t.l0.cellgroup_s_d_s_d",
  "coast.41": "t.l0.cellgroup_s_d_s_d",
  "coast.42": "t.l0.cellgroup_d_s_d_s",
  "coast.43": "t.l0.cellgroup_d_s_d_s",
  "coast.44": "t.l0.cellgroup_s_d_s_l",
  "coast.45": "t.l0.cellgroup_s_l_s_d",
  "coast.46": "t.l0.cellgroup_l_s_d_s",
  "coast.47": "t.l0.cellgroup_d_s_l_s",
  "coast.48": "t.l0.cellgroup_d_d_s_s",
  "coast.49": "t.l0.cellgroup_s_s_d_d",
  "coast.50": "t.l0.cellgroup_s_d_d_s",
  "coast.51": "t.l0.cellgroup_d_s_s_d",
  "coast.52": "t.l0.cellgroup_d_d_s_d",
  "coast.53": "t.l0.cellgroup_s_d_d_d",
  "coast.54": "t.l0.cellgroup_d_d_d_s",
  "coast.55": "t.l0.cellgroup_d_s_d_d",
  "coast.56": "t.l0.cellgroup_d_d_s_l",
  "coast.57": "t.l0.cellgroup_s_l_d_d",
  "coast.58": "t.l0.cellgroup_l_d_d_s",
  "coast.59": "t.l0.cellgroup_d_s_l_d",
  "coast.60": "t.l0.cellgroup_l_d_s_s",
  "coast.61": "t.l0.cellgroup_s_s_l_d",
  "coast.62": "t.l0.cellgroup_s_l_d_s",
  "coast.63": "t.l0.cellgroup_d_s_s_l",
  "coast.64": "t.l0.cellgroup_l_d_s_d",
  "coast.65": "t.l0.cellgroup_s_d_l_d",
  "coast.66": "t.l0.cellgroup_d_l_d_s",
  "coast.67": "t.l0.cellgroup_d_s_d_l",
  "coast.68": "t.l0.cellgroup_l_d_s_l",
  "coast.69": "t.l0.cellgroup_s_l_l_d",
  "coast.70": "t.l0.cellgroup_l_l_d_s",
  "coast.71": "t.l0.cellgroup_d_s_l_l",
  "coast.72": "t.l0.cellgroup_s_l_s_s",
  "coast.73": "t.l0.cellgroup_s_s_s_l",
  "coast.74": "t.l0.cellgroup_s_s_l_s",
  "coast.75": "t.l0.cellgroup_l_s_s_s",
  "coast.76": "t.l0.cellgroup_s_l_s_d",
  "coast.77": "t.l0.cellgroup_s_d_s_l",
  "coast.78": "t.l0.cellgroup_d_s_l_s",
  "coast.79": "t.l0.cellgroup_l_s_d_s",
  "coast.80": "t.l0.cellgroup_s_l_s_l",
  "coast.81": "t.l0.cellgroup_s_l_s_l",
  "coast.82": "t.l0.cellgroup_l_s_l_s",
  "coast.83": "t.l0.cellgroup_l_s_l_s",
  "coast.84": "t.l0.cellgroup_d_l_s_s",
  "coast.85": "t.l0.cellgroup_s_s_d_l",
  "coast.86": "t.l0.cellgroup_s_d_l_s",
  "coast.87": "t.l0.cellgroup_l_s_s_d",
  "coast.88": "t.l0.cellgroup_d_l_s_d",
  "coast.89": "t.l0.cellgroup_s_d_d_l",
  "coast.90": "t.l0.cellgroup_d_d_l_s",
  "coast.91": "t.l0.cellgroup_l_s_d_d",
  "coast.92": "t.l0.cellgroup_d_l_s_l",
  "coast.93": "t.l0.cellgroup_s_l_d_l",
  "coast.94": "t.l0.cellgroup_l_d_l_s",
  "coast.95": "t.l0.cellgroup_l_s_l_d",
  "coast.96": "t.l0.cellgroup_l_l_s_s",
  "coast.97": "t.l0.cellgroup_s_s_l_l",
  "coast.98": "t.l0.cellgroup_s_l_l_s",
  "coast.99": "t.l0.cellgroup_l_s_s_l",
  "coast.100": "t.l0.cellgroup_l_l_s_d",
  "coast.101": "t.l0.cellgroup_s_d_l_l",
  "coast.102": "t.l0.cellgroup_d_l_l_s",
  "coast.103": "t.l0.cellgroup_l_s_d_l",
  "coast.104": "t.l0.cellgroup_l_l_s_l",
  "coast.105": "t.l0.cellgroup_s_l_l_l",
  "coast.106": "t.l0.cellgroup_l_l_l_s",
  "coast.107": "t.l0.cellgroup_l_s_l_l",
  "floor.0": "t.l0.cellgroup_d_d_d_d",
  "floor.1": "t.l0.cellgroup_d_d_d_d",
  "floor.2": "t.l0.cellgroup_d_d_d_d",
  "floor.3": "t.l0.cellgroup_d_d_d_d",
  "floor.4": "t.l0.cellgroup_d_d_d_s",
  "floor.5": "t.l0.cellgroup_d_s_d_d",
  "floor.6": "t.l0.cellgroup_s_d_d_d",
  "floor.7": "t.l0.cellgroup_d_d_s_d",
  "floor.8": "t.l0.cellgroup_d_d_d_l",
  "floor.9": "t.l0.cellgroup_d_l_d_d",
  "floor.10": "t.l0.cellgroup_l_d_d_d",
  "floor.11": "t.l0.cellgroup_d_d_l_d",
  "floor.12": "t.l0.cellgroup_s_d_d_d",
  "floor.13": "t.l0.cellgroup_d_d_s_d",
  "floor.14": "t.l0.cellgroup_d_s_d_d",
  "floor.15": "t.l0.cellgroup_d_d_d_s",
  "floor.16": "t.l0.cellgroup_s_d_d_s",
  "floor.17": "t.l0.cellgroup_d_s_s_d",
  "floor.18": "t.l0.cellgroup_s_s_d_d",
  "floor.19": "t.l0.cellgroup_d_d_s_s",
  "floor.20": "t.l0.cellgroup_s_d_d_l",
  "floor.21": "t.l0.cellgroup_d_l_s_d",
  "floor.22": "t.l0.cellgroup_l_s_d_d",
  "floor.23": "t.l0.cellgroup_d_d_l_s",
  "floor.24": "t.l0.cellgroup_l_d_d_d",
  "floor.25": "t.l0.cellgroup_d_d_l_d",
  "floor.26": "t.l0.cellgroup_d_l_d_d",
  "floor.27": "t.l0.cellgroup_d_d_d_l",
  "floor.28": "t.l0.cellgroup_l_d_d_s",
  "floor.29": "t.l0.cellgroup_d_s_l_d",
  "floor.30": "t.l0.cellgroup_s_l_d_d",
  "floor.31": "t.l0.cellgroup_d_d_s_l",
  "floor.32": "t.l0.cellgroup_l_d_d_l",
  "floor.33": "t.l0.cellgroup_d_l_l_d",
  "floor.34": "t.l0.cellgroup_l_l_d_d",
  "floor.35": "t.l0.cellgroup_d_d_l_l",
  "floor.36": "t.l0.cellgroup_d_s_d_d",
  "floor.37": "t.l0.cellgroup_d_d_d_s",
  "floor.38": "t.l0.cellgroup_d_d_s_d",
  "floor.39": "t.l0.cellgroup_s_d_d_d",
  "floor.40": "t.l0.cellgroup_d_s_d_s",
  "floor.41": "t.l0.cellgroup_d_s_d_s",
  "floor.42": "t.l0.cellgroup_s_d_s_d",
  "floor.43": "t.l0.cellgroup_s_d_s_d",
  "floor.44": "t.l0.cellgroup_d_s_d_l",
  "floor.45": "t.l0.cellgroup_d_l_d_s",
  "floor.46": "t.l0.cellgroup_l_d_s_d",
  "floor.47": "t.l0.cellgroup_s_d_l_d",
  "floor.48": "t.l0.cellgroup_s_s_d_d",
  "floor.49": "t.l0.cellgroup_d_d_s_s",
  "floor.50": "t.l0.cellgroup_d_s_s_d",
  "floor.51": "t.l0.cellgroup_s_d_d_s",
  "floor.52": "t.l0.cellgroup_s_s_d_s",
  "floor.53": "t.l0.cellgroup_d_s_s_s",
  "floor.54": "t.l0.cellgroup_s_s_s_d",
  "floor.55": "t.l0.cellgroup_s_d_s_s",
  "floor.56": "t.l0.cellgroup_s_s_d_l",
  "floor.57": "t.l0.cellgroup_d_l_s_s",
  "floor.58": "t.l0.cellgroup_l_s_s_d",
  "floor.59": "t.l0.cellgroup_s_d_l_s",
  "floor.60": "t.l0.cellgroup_l_s_d_d",
  "floor.61": "t.l0.cellgroup_d_d_l_s",
  "floor.62": "t.l0.cellgroup_d_l_s_d",
  "floor.63": "t.l0.cellgroup_s_d_d_l",
  "floor.64": "t.l0.cellgroup_l_s_d_s",
  "floor.65": "t.l0.cellgroup_d_s_l_s",
  "floor.66": "t.l0.cellgroup_s_l_s_d",
  "floor.67": "t.l0.cellgroup_s_d_s_l",
  "floor.68": "t.l0.cellgroup_l_s_d_l",
  "floor.69": "t.l0.cellgroup_d_l_l_s",
  "floor.70": "t.l0.cellgroup_l_l_s_d",
  "floor.71": "t.l0.cellgroup_s_d_l_l",
  "floor.72": "t.l0.cellgroup_d_l_d_d",
  "floor.73": "t.l0.cellgroup_d_d_d_l",
  "floor.74": "t.l0.cellgroup_d_d_l_d",
  "floor.75": "t.l0.cellgroup_l_d_d_d",
  "floor.76": "t.l0.cellgroup_d_l_d_s",
  "floor.77": "t.l0.cellgroup_d_s_d_l",
  "floor.78": "t.l0.cellgroup_s_d_l_d",
  "floor.79": "t.l0.cellgroup_l_d_s_d",
  "floor.80": "t.l0.cellgroup_d_l_d_l",
  "floor.81": "t.l0.cellgroup_d_l_d_l",
  "floor.82": "t.l0.cellgroup_l_d_l_d",
  "floor.83": "t.l0.cellgroup_l_d_l_d",
  "floor.84": "t.l0.cellgroup_s_l_d_d",
  "floor.85": "t.l0.cellgroup_d_d_s_l",
  "floor.86": "t.l0.cellgroup_d_s_l_d",
  "floor.87": "t.l0.cellgroup_l_d_d_s",
  "floor.88": "t.l0.cellgroup_s_l_d_s",
  "floor.89": "t.l0.cellgroup_d_s_s_l",
  "floor.90": "t.l0.cellgroup_s_s_l_d",
  "floor.91": "t.l0.cellgroup_l_d_s_s",
  "floor.92": "t.l0.cellgroup_s_l_d_l",
  "floor.93": "t.l0.cellgroup_d_l_s_l",
  "floor.94": "t.l0.cellgroup_l_s_l_d",
  "floor.95": "t.l0.cellgroup_l_d_l_s",
  "floor.96": "t.l0.cellgroup_l_l_d_d",
  "floor.97": "t.l0.cellgroup_d_d_l_l",
  "floor.98": "t.l0.cellgroup_d_l_l_d",
  "floor.99": "t.l0.cellgroup_l_d_d_l",
  "floor.100": "t.l0.cellgroup_l_l_d_s",
  "floor.101": "t.l0.cellgroup_d_s_l_l",
  "floor.102": "t.l0.cellgroup_s_l_l_d",
  "floor.103": "t.l0.cellgroup_l_d_s_l",
  "floor.104": "t.l0.cellgroup_l_l_d_l",
  "floor.105": "t.l0.cellgroup_d_l_l_l",
  "floor.106": "t.l0.cellgroup_l_l_l_d",
  "floor.107": "t.l0.cellgroup_l_d_l_l"
};
const audio = window.audio;
const music_list = window.music_list || [];
const supports_mp3 = () => window.supports_mp3?.() ?? false;
const TRUE = true;
let sounds_enabled = true;
let auto_center_on_unit = TRUE;
let popup_actor_arrival = true;
let draw_units = TRUE;
let draw_fog_of_war = TRUE;
function init_options_dialog() {
  if (audio != null && !audio.source.src) {
    if (!supports_mp3()) {
      audio.load("/music/" + music_list[Math.floor(Math.random() * music_list.length)] + ".ogg");
    } else {
      audio.load("/music/" + music_list[Math.floor(Math.random() * music_list.length)] + ".mp3");
    }
  }
  const soundsCheckbox = document.getElementById("play_sounds_setting");
  if (soundsCheckbox) {
    soundsCheckbox.checked = sounds_enabled;
    soundsCheckbox.addEventListener("change", function() {
      sounds_enabled = this.checked;
      localStorage.setItem("sndFX", JSON.stringify(sounds_enabled));
    });
  }
}
function initTableSort(selector, options) {
  const table = document.querySelector(selector);
  if (!table) return;
  const thead = table.tHead;
  if (!thead) return;
  const headers = thead.querySelectorAll("th");
  headers.forEach((th, colIdx) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const currentDir = th.dataset.sortDir === "asc" ? "desc" : "asc";
      headers.forEach((h2) => {
        h2.dataset.sortDir = "";
        h2.classList.remove("tablesorter-headerAsc", "tablesorter-headerDesc");
      });
      th.dataset.sortDir = currentDir;
      th.classList.add(currentDir === "asc" ? "tablesorter-headerAsc" : "tablesorter-headerDesc");
      sortTable(table, colIdx, currentDir === "asc" ? 0 : 1);
    });
  });
  if (options?.sortList) {
    for (const [col, dir] of options.sortList) {
      if (col < headers.length) {
        const dirStr = dir === 0 ? "asc" : "desc";
        headers[col].dataset.sortDir = dirStr;
        headers[col].classList.add(dirStr === "asc" ? "tablesorter-headerAsc" : "tablesorter-headerDesc");
        sortTable(table, col, dir);
      }
    }
  }
}
function sortTable(table, colIdx, direction) {
  const tbody = table.tBodies[0];
  if (!tbody) return;
  const rows = Array.from(tbody.rows);
  rows.sort((a2, b2) => {
    const aText = a2.cells[colIdx]?.textContent?.trim() ?? "";
    const bText = b2.cells[colIdx]?.textContent?.trim() ?? "";
    const aNum = parseFloat(aText);
    const bNum = parseFloat(bText);
    let cmp;
    if (!isNaN(aNum) && !isNaN(bNum)) {
      cmp = aNum - bNum;
    } else {
      cmp = aText.localeCompare(bText);
    }
    return direction === 0 ? cmp : -cmp;
  });
  for (const row of rows) {
    tbody.appendChild(row);
  }
}
const packet_authentication_reply = 7;
const packet_chat_msg_req = 26;
const packet_city_sell = 33;
const packet_city_buy = 34;
const packet_city_change = 35;
const packet_city_worklist = 36;
const packet_city_change_specialist = 39;
const packet_city_rename = 40;
const packet_city_options_req = 41;
const packet_city_name_suggestion_req = 43;
const packet_player_phase_done = 52;
const packet_player_research = 55;
const packet_player_tech_goal = 56;
const packet_player_rates = 53;
const packet_unit_sscs_set = 71;
const packet_unit_orders = 73;
const packet_unit_server_side_agent_set = 74;
const packet_unit_action_query = 82;
const packet_unit_do_action = 84;
const packet_unit_get_actions = 87;
const packet_unit_change_activity = 222;
const packet_diplomacy_init_meeting_req = 95;
const packet_diplomacy_cancel_meeting_req = 97;
const packet_diplomacy_create_clause_req = 99;
const packet_diplomacy_remove_clause_req = 101;
const packet_diplomacy_accept_treaty_req = 103;
const packet_diplomacy_cancel_pact = 105;
const packet_conn_pong = 89;
const packet_client_info = 119;
const packet_web_cma_clear = 258;
const packet_web_goto_path_req = 287;
const packet_web_info_text_req = 289;
let banned_users = [];
function check_text_with_banlist(text) {
  if (text == null || text.length === 0) return false;
  for (let i2 = 0; i2 < banned_users.length; i2++) {
    if (text.toLowerCase().indexOf(banned_users[i2].toLowerCase()) !== -1) return false;
  }
  return true;
}
const win$4 = window;
function isLongturn() {
  return win$4.game_type === "longturn";
}
function setPhaseStart() {
  win$4.phase_start_time = Date.now();
}
function requestObserveGame() {
  send_message("/observe ");
}
const DP_NONE = 0;
const DP_FIRST = 1;
const DP_LAST = 2;
const DP_COUNT = 3;
const DP_ALL = 4;
class EventAggregator {
  static DP_NONE = DP_NONE;
  static DP_FIRST = DP_FIRST;
  static DP_LAST = DP_LAST;
  static DP_COUNT = DP_COUNT;
  static DP_ALL = DP_ALL;
  handler;
  timeout;
  latency;
  maxDelays;
  delayTimeout;
  dataPolicy;
  timer = null;
  data;
  burst = false;
  delays = 0;
  count = 0;
  constructor(handler, timeout, dataPolicy, latency, maxDelays, delayTimeout) {
    this.handler = handler;
    this.timeout = timeout || 1e3;
    this.latency = latency === 0 ? 0 : latency || this.timeout;
    this.maxDelays = maxDelays || 0;
    this.delayTimeout = delayTimeout === 0 ? 0 : delayTimeout || this.timeout / 2;
    this.dataPolicy = dataPolicy || DP_NONE;
    this.clear();
  }
  _setTimeout(delay) {
    return setTimeout(() => this.fired(), delay);
  }
  fireNow() {
    if (this.count > 0) {
      const count = this.count;
      const data = this.data;
      this.cancel();
      this.clear();
      switch (this.dataPolicy) {
        case DP_FIRST:
        case DP_LAST:
        case DP_ALL:
          this.handler(data);
          break;
        case DP_COUNT:
          this.handler(count);
          break;
        default:
          this.handler();
      }
      if (this.latency > 0) {
        this.timer = this._setTimeout(this.latency);
      }
    }
  }
  update(data) {
    switch (this.dataPolicy) {
      case DP_FIRST:
        if (this.count === 0) this.data = data;
        break;
      case DP_LAST:
        this.data = data;
        break;
      case DP_ALL:
        this.data.push(data);
        break;
    }
    this.count++;
    if (this.timer === null) {
      this.timer = this._setTimeout(this.timeout);
    } else if (this.count > 1) {
      this.burst = true;
    }
  }
  fired() {
    if (this.burst && this.delays < this.maxDelays) {
      this.burst = false;
      this.delays++;
      this.timer = this._setTimeout(this.delayTimeout);
    } else {
      this.timer = null;
      this.fireNow();
    }
  }
  cancel() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  clear() {
    if (this.dataPolicy === DP_ALL) {
      this.data = [];
    } else {
      this.data = void 0;
    }
    this.burst = false;
    this.delays = 0;
    this.count = 0;
  }
}
window.EventAggregator = EventAggregator;
const is_longturn = isLongturn;
const civclient_state = clientState();
let chatbox_active = true;
const message_log = new EventAggregator(
  update_chatbox,
  125,
  EventAggregator.DP_ALL,
  1e3,
  0
);
const max_chat_message_length = 350;
function init_chatbox() {
  chatbox_active = true;
  const panel = document.getElementById("game_chatbox_panel");
  if (panel) {
    panel.title = "Messages";
    panel.style.display = "block";
  }
}
function reclassify_chat_message(text) {
  if (text == null || text.length < 29) {
    return E_CHAT_MSG;
  }
  text = text.replace(/^<b>[^<]*:<\/b>/, "");
  text = text.replace(/^\([^)]*\) /, "");
  const color = text.substring(14, 20);
  if (color == "A020F0") {
    return E_CHAT_PRIVATE;
  } else if (color == "551166") {
    return E_CHAT_ALLIES;
  } else if (text.charAt(23) == "(") {
    return E_CHAT_OBSERVER;
  }
  return E_CHAT_MSG;
}
function add_chatbox_text(packet) {
  let text = packet["message"];
  if (text == null) return;
  if (!check_text_with_banlist(text)) return;
  if (is_longturn()) {
    if (text.indexOf("waiting on") != -1 || text.indexOf("Lost connection") != -1 || text.indexOf("Not enough") != -1 || text.indexOf("has been removed") != -1 || text.indexOf("has connected") != -1) return;
  }
  if (text.length >= max_chat_message_length) return;
  if (packet["event"] === E_CHAT_MSG) {
    packet["event"] = reclassify_chat_message(text);
  }
  if (civclient_state <= C_S_PREPARING) {
    text = text.replace(/#FFFFFF/g, "#000000");
  } else {
    text = text.replace(/#0000FF/g, "#5555FF").replace(/#006400/g, "#00AA00").replace(/#551166/g, "#AA88FF").replace(/#A020F0/g, "#F020FF");
  }
  packet["message"] = text;
  message_log.update(packet);
}
function get_chatbox_text() {
  const chatbox_msg_list = get_chatbox_msg_list();
  if (chatbox_msg_list != null) {
    return chatbox_msg_list.textContent;
  } else {
    return null;
  }
}
function get_chatbox_msg_list() {
  return document.getElementById(civclient_state <= C_S_PREPARING ? "pregame_message_area" : "game_message_area");
}
function clear_chatbox() {
  message_log.clear();
  chatbox_clip_messages(0);
}
function update_chatbox(messages) {
  const scrollDiv = get_chatbox_msg_list();
  if (scrollDiv != null) {
    for (let i2 = 0; i2 < messages.length; i2++) {
      const item = document.createElement("li");
      item.className = fc_e_events[messages[i2].event] || "";
      item.innerHTML = messages[i2].message;
      scrollDiv.appendChild(item);
    }
  } else {
    for (let i2 = 0; i2 < messages.length; i2++) {
      message_log.update(messages[i2]);
    }
  }
  setTimeout(() => {
    const el = document.getElementById("freeciv_custom_scrollbar_div");
    if (el) el.scrollTop = el.scrollHeight;
  }, 100);
}
function chatbox_clip_messages(lines) {
  if (lines === void 0 || lines < 0) {
    lines = 24;
  }
  message_log.fireNow();
  const msglist = get_chatbox_msg_list();
  if (!msglist) return;
  let remove = msglist.children.length - lines;
  while (remove-- > 0) {
    if (msglist.firstChild) {
      msglist.removeChild(msglist.firstChild);
    }
  }
  update_chatbox([]);
}
function wait_for_text(text, runnable) {
  const chatbox_text = get_chatbox_text();
  if (chatbox_text != null && chatbox_text.indexOf(text) != -1) {
    runnable();
  } else {
    setTimeout(function() {
      wait_for_text(text, runnable);
    }, 100);
  }
}
function orientation_changed() {
}
function $id(id) {
  return document.getElementById(id);
}
function on(el, event, handler, options) {
  el?.addEventListener(event, handler, options);
}
function create(tag, attrs, parent) {
  const el = document.createElement(tag);
  return el;
}
let blockOverlay = null;
function blockUI(message) {
  unblockUI();
  blockOverlay = create("div");
  blockOverlay.className = "xb-block-overlay";
  blockOverlay.innerHTML = `<div class="xb-block-message">${message}</div>`;
  document.body.appendChild(blockOverlay);
}
function unblockUI() {
  if (blockOverlay) {
    blockOverlay.remove();
    blockOverlay = null;
  }
}
const _win = window;
const DIR8_NORTH$1 = 1;
const DIR8_EAST$1 = 4;
const DIR8_SOUTH$1 = 6;
const DIR8_WEST$1 = 3;
let mapview_canvas_ctx = null;
let mapview_canvas = null;
let buffer_canvas_ctx = null;
let buffer_canvas = null;
let city_canvas_ctx = null;
let city_canvas = null;
let tileset_images = [];
let sprites = {};
let loaded_images = 0;
let sprites_init = false;
let canvas_text_font = "16px Georgia, serif";
let fullfog = [];
const GOTO_DIR_DX = [0, 1, 2, -1, 1, -2, -1, 0];
const GOTO_DIR_DY = [-2, -1, 0, -1, 1, 0, 1, 2];
let dashedSupport = false;
function init_mapview() {
  const canvasDiv = document.getElementById("canvas_div");
  if (canvasDiv) {
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvasDiv.appendChild(canvas);
  }
  function loadScriptSync(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status === 200) {
      (0, eval)(xhr.responseText);
    } else {
      console.error("Unable to load " + url);
    }
  }
  loadScriptSync("/javascript/2dcanvas/tileset_config_amplio2.js");
  loadScriptSync("/javascript/2dcanvas/tileset_spec_amplio2.js");
  mapview_canvas = document.getElementById("canvas");
  mapview_canvas_ctx = mapview_canvas.getContext("2d");
  buffer_canvas = document.createElement("canvas");
  buffer_canvas_ctx = buffer_canvas.getContext("2d");
  window.mapview_canvas_ctx = mapview_canvas_ctx;
  window.buffer_canvas = buffer_canvas;
  window.mapview_canvas = mapview_canvas;
  if (mapview_canvas_ctx && "imageSmoothingEnabled" in mapview_canvas_ctx) {
    mapview_canvas_ctx.imageSmoothingEnabled = false;
  }
  if (mapview_canvas_ctx) {
    dashedSupport = "setLineDash" in mapview_canvas_ctx;
    window.dashedSupport = dashedSupport;
  }
  setupWindowSize();
  mapview$1["gui_x0"] = 0;
  mapview$1["gui_y0"] = 0;
  let i2;
  for (i2 = 0; i2 < 81; i2++) {
    const ids = ["u", "f", "k"];
    let buf = "t.fog";
    const values = [];
    let j2, k2 = i2;
    for (j2 = 0; j2 < 4; j2++) {
      values[j2] = k2 % 3;
      k2 = Math.floor(k2 / 3);
      buf += "_" + ids[values[j2]];
    }
    fullfog[i2] = buf;
  }
  window.fullfog = fullfog;
  if (is_small_screen()) _win.MAPVIEW_REFRESH_INTERVAL = 12;
  init_sprites();
  if (mapview_canvas) {
    requestAnimationFrame(update_map_canvas_check);
  }
}
function is_small_screen() {
  return window.innerWidth <= 640 || window.innerHeight <= 590;
}
function init_sprites() {
  blockUI("<h1>Freeciv-web is loading. Please wait...<br><center><img src='/images/loading.gif'></center></h1>");
  if (loaded_images != tileset_image_count) {
    for (let i2 = 0; i2 < tileset_image_count; i2++) {
      const tileset_image = new Image();
      tileset_image.onload = preload_check;
      tileset_image.src = "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + _win.ts;
      tileset_images[i2] = tileset_image;
    }
  } else {
    unblockUI();
  }
}
function preload_check() {
  loaded_images += 1;
  if (loaded_images == tileset_image_count) {
    init_cache_sprites();
    unblockUI();
  }
}
function init_cache_sprites() {
  try {
    if (typeof _win.tileset === "undefined") {
      window.alert?.("Tileset not generated correctly. Run sync.sh in freeciv-img-extract and recompile.");
      return;
    }
    for (const tile_tag in _win.tileset) {
      const x2 = _win.tileset[tile_tag][0];
      const y2 = _win.tileset[tile_tag][1];
      const w2 = _win.tileset[tile_tag][2];
      const h2 = _win.tileset[tile_tag][3];
      const i2 = _win.tileset[tile_tag][4];
      const newCanvas = document.createElement("canvas");
      newCanvas.height = h2;
      newCanvas.width = w2;
      const newCtx = newCanvas.getContext("2d");
      if (newCtx) {
        newCtx.drawImage(
          tileset_images[i2],
          x2,
          y2,
          w2,
          h2,
          0,
          0,
          w2,
          h2
        );
        sprites[tile_tag] = newCanvas;
      }
    }
    sprites_init = true;
    window.sprites = sprites;
    tileset_images[0] = null;
    tileset_images[1] = null;
    tileset_images = null;
  } catch (e2) {
    console.log("Problem caching sprite: " + (e2.message || e2));
  }
}
function mapview_window_resized() {
  if (active_city != null || !resize_enabled) return;
  setupWindowSize();
  if (_win.renderer == RENDERER_2DCANVAS$1) {
    if (typeof mark_all_dirty === "function") mark_all_dirty();
    update_map_canvas_full();
  }
}
function mapview_put_tile(pcanvas, tag, canvas_x, canvas_y) {
  if (sprites[tag] == null) {
    return;
  }
  pcanvas.drawImage(sprites[tag], canvas_x, canvas_y);
}
function canvas_put_rectangle(canvas_context, pcolor, canvas_x, canvas_y, width, height) {
  canvas_context.fillStyle = pcolor;
  canvas_context.fillRect(canvas_x, canvas_y, width, height);
}
function canvas_put_select_rectangle(canvas_context, canvas_x, canvas_y, width, height) {
  canvas_context.beginPath();
  canvas_context.strokeStyle = "rgb(255,0,0)";
  canvas_context.rect(canvas_x, canvas_y, width, height);
  canvas_context.stroke();
}
function mapview_put_city_bar(pcanvas, city, canvas_x, canvas_y) {
  const text = decodeURIComponent(city["name"]).toUpperCase();
  const size = city["size"];
  const color = store.nations[cityOwner(city)["nation"]]["color"];
  const prod_type = getCityProductionType(city);
  const txt_measure = pcanvas.measureText(text);
  const size_measure = pcanvas.measureText(size.toString());
  pcanvas.globalAlpha = 0.7;
  pcanvas.fillStyle = "rgba(0, 0, 0, 0.5)";
  pcanvas.fillRect(
    canvas_x - Math.floor(txt_measure.width / 2) - 14,
    canvas_y - 17,
    txt_measure.width + 20,
    20
  );
  pcanvas.fillStyle = color;
  pcanvas.fillRect(
    canvas_x + Math.floor(txt_measure.width / 2) + 5,
    canvas_y - 19,
    prod_type != null ? size_measure.width + 35 : size_measure.width + 8,
    24
  );
  const city_flag = get_city_flag_sprite(city);
  pcanvas.drawImage(
    sprites[city_flag["key"]],
    canvas_x - Math.floor(txt_measure.width / 2) - 45,
    canvas_y - 17
  );
  pcanvas.drawImage(
    sprites[get_city_occupied_sprite(city)],
    canvas_x - Math.floor(txt_measure.width / 2) - 12,
    canvas_y - 16
  );
  pcanvas.strokeStyle = color;
  pcanvas.lineWidth = 1.5;
  pcanvas.beginPath();
  pcanvas.moveTo(canvas_x - Math.floor(txt_measure.width / 2) - 46, canvas_y - 18);
  pcanvas.lineTo(
    canvas_x + Math.floor(txt_measure.width / 2) + size_measure.width + 13,
    canvas_y - 18
  );
  pcanvas.moveTo(
    canvas_x + Math.floor(txt_measure.width / 2) + size_measure.width + 13,
    canvas_y + 4
  );
  pcanvas.lineTo(canvas_x - Math.floor(txt_measure.width / 2) - 46, canvas_y + 4);
  pcanvas.lineTo(canvas_x - Math.floor(txt_measure.width / 2) - 46, canvas_y - 18);
  pcanvas.moveTo(canvas_x - Math.floor(txt_measure.width / 2) - 15, canvas_y - 17);
  pcanvas.lineTo(canvas_x - Math.floor(txt_measure.width / 2) - 15, canvas_y + 3);
  pcanvas.stroke();
  pcanvas.globalAlpha = 1;
  if (prod_type != null) {
    let tag;
    if (city["production_kind"] == VUT_UTYPE) {
      tag = tileset_unit_type_graphic_tag(prod_type);
    } else {
      tag = tileset_ruleset_entity_tag_str_or_alt(prod_type, "building");
    }
    if (tag == null) {
      return;
    }
    pcanvas.drawImage(
      sprites[tag],
      canvas_x + Math.floor(txt_measure.width / 2) + size_measure.width + 13,
      canvas_y - 19,
      28,
      24
    );
  }
  pcanvas.fillStyle = "rgba(0, 0, 0, 1)";
  pcanvas.fillText(size.toString(), canvas_x + Math.floor(txt_measure.width / 2) + 10, canvas_y + 1);
  pcanvas.fillStyle = "rgba(255, 255, 255, 1)";
  pcanvas.fillText(text, canvas_x - Math.floor(txt_measure.width / 2) - 2, canvas_y - 1);
  pcanvas.fillText(size.toString(), canvas_x + Math.floor(txt_measure.width / 2) + 8, canvas_y - 1);
}
function mapview_put_tile_label(pcanvas, tile, canvas_x, canvas_y) {
  const text = tile["label"];
  if (text != null && text.length > 0) {
    const txt_measure = pcanvas.measureText(text);
    pcanvas.fillStyle = "rgba(255, 255, 255, 1)";
    pcanvas.fillText(text, canvas_x + normal_tile_width / 2 - Math.floor(txt_measure.width / 2), canvas_y - 1);
  }
}
function mapview_put_border_line(pcanvas, dir, color, canvas_x, canvas_y) {
  const x2 = canvas_x + 47;
  const y2 = canvas_y + 3;
  pcanvas.strokeStyle = color;
  pcanvas.beginPath();
  if (dir == DIR8_NORTH$1) {
    pcanvas.moveTo(x2, y2 - 2);
    pcanvas.lineTo(x2 + tileset_tile_width / 2, y2 + tileset_tile_height / 2 - 2);
  } else if (dir == DIR8_EAST$1) {
    pcanvas.moveTo(x2 - 3, y2 + tileset_tile_height - 3);
    pcanvas.lineTo(x2 + tileset_tile_width / 2 - 3, y2 + tileset_tile_height / 2 - 3);
  } else if (dir == DIR8_SOUTH$1) {
    pcanvas.moveTo(x2 - tileset_tile_width / 2 + 3, y2 + tileset_tile_height / 2 - 3);
    pcanvas.lineTo(x2 + 3, y2 + tileset_tile_height - 3);
  } else if (dir == DIR8_WEST$1) {
    pcanvas.moveTo(x2 - tileset_tile_width / 2 + 3, y2 + tileset_tile_height / 2 - 3);
    pcanvas.lineTo(x2 + 3, y2 - 3);
  }
  pcanvas.closePath();
  pcanvas.stroke();
}
function mapview_put_goto_line(pcanvas, dir, canvas_x, canvas_y) {
  const x0 = canvas_x + tileset_tile_width / 2;
  const y0 = canvas_y + tileset_tile_height / 2;
  const x1 = x0 + GOTO_DIR_DX[dir] * (tileset_tile_width / 2);
  const y1 = y0 + GOTO_DIR_DY[dir] * (tileset_tile_height / 2);
  pcanvas.strokeStyle = "rgba(0,168,255,0.9)";
  pcanvas.lineWidth = 10;
  pcanvas.lineCap = "round";
  pcanvas.beginPath();
  pcanvas.moveTo(x0, y0);
  pcanvas.lineTo(x1, y1);
  pcanvas.stroke();
}
function set_city_mapview_active() {
  city_canvas = document.getElementById("city_canvas");
  if (city_canvas == null) return;
  city_canvas_ctx = city_canvas.getContext("2d");
  if (city_canvas_ctx) {
    city_canvas_ctx.font = canvas_text_font;
  }
  mapview_canvas_ctx = city_canvas.getContext("2d");
  window.mapview_canvas_ctx = mapview_canvas_ctx;
  mapview$1["width"] = citydlg_map_width;
  mapview$1["height"] = citydlg_map_height;
  mapview$1["store_width"] = citydlg_map_width;
  mapview$1["store_height"] = citydlg_map_height;
  set_default_mapview_inactive$1();
}
function set_default_mapview_inactive$1() {
  if (overview_active) {
    const op = document.getElementById("game_overview_panel");
    if (op?.parentElement) op.parentElement.style.display = "none";
  }
  const up = document.getElementById("game_unit_panel");
  if (up?.parentElement) up.parentElement.style.display = "none";
  if (chatbox_active) {
    const cp = document.getElementById("game_chatbox_panel");
    if (cp?.parentElement) cp.parentElement.style.display = "none";
  }
}
function enable_mapview_slide(ptile) {
  const r2 = map_to_gui_pos$1(ptile["x"], ptile["y"]);
  let gui_x = r2["gui_dx"];
  let gui_y = r2["gui_dy"];
  gui_x -= mapview$1["width"] - tileset_tile_width >> 1;
  gui_y -= mapview$1["height"] - tileset_tile_height >> 1;
  const dx = gui_x - mapview$1["gui_x0"];
  const dy = gui_y - mapview$1["gui_y0"];
  mapview_slide["dx"] = dx;
  mapview_slide["dy"] = dy;
  mapview_slide["i"] = mapview_slide["max"];
  mapview_slide["start"] = (/* @__PURE__ */ new Date()).getTime();
  if (dx == 0 && dy == 0 || mapview_slide["active"] || Math.abs(dx) > mapview$1["width"] || Math.abs(dy) > mapview$1["height"]) {
    mapview_slide["active"] = false;
    update_map_canvas_full();
    return;
  }
  mapview_slide["active"] = true;
  const new_width = mapview$1["width"] + Math.abs(dx);
  const new_height = mapview$1["height"] + Math.abs(dy);
  const old_width = mapview$1["store_width"];
  const old_height = mapview$1["store_height"];
  mapview_canvas = buffer_canvas;
  mapview_canvas_ctx = buffer_canvas_ctx;
  window.mapview_canvas_ctx = mapview_canvas_ctx;
  if (dx >= 0 && dy <= 0) {
    mapview$1["gui_y0"] -= Math.abs(dy);
  } else if (dx <= 0 && dy >= 0) {
    mapview$1["gui_x0"] -= Math.abs(dx);
  } else if (dx <= 0 && dy <= 0) {
    mapview$1["gui_x0"] -= Math.abs(dx);
    mapview$1["gui_y0"] -= Math.abs(dy);
  }
  mapview$1["store_width"] = new_width;
  mapview$1["store_height"] = new_height;
  mapview$1["width"] = new_width;
  mapview$1["height"] = new_height;
  if (dx >= 0 && dy >= 0) {
    update_map_canvas(old_width, 0, dx, new_height);
    update_map_canvas(0, old_height, old_width, dy);
  } else if (dx <= 0 && dy <= 0) {
    update_map_canvas(0, 0, Math.abs(dx), new_height);
    update_map_canvas(Math.abs(dx), 0, old_width, Math.abs(dy));
  } else if (dx <= 0 && dy >= 0) {
    update_map_canvas(0, 0, Math.abs(dx), new_height);
    update_map_canvas(Math.abs(dx), old_height, old_width, Math.abs(dy));
  } else if (dx >= 0 && dy <= 0) {
    update_map_canvas(0, 0, new_width, Math.abs(dy));
    update_map_canvas(old_width, Math.abs(dy), Math.abs(dx), old_height);
  }
  mapview_canvas = document.getElementById("canvas");
  mapview_canvas_ctx = mapview_canvas.getContext("2d");
  window.mapview_canvas_ctx = mapview_canvas_ctx;
  if (buffer_canvas_ctx && mapview_canvas) {
    if (dx >= 0 && dy >= 0) {
      buffer_canvas_ctx.drawImage(mapview_canvas, 0, 0, old_width, old_height, 0, 0, old_width, old_height);
    } else if (dx <= 0 && dy <= 0) {
      buffer_canvas_ctx.drawImage(mapview_canvas, 0, 0, old_width, old_height, Math.abs(dx), Math.abs(dy), old_width, old_height);
    } else if (dx <= 0 && dy >= 0) {
      buffer_canvas_ctx.drawImage(mapview_canvas, 0, 0, old_width, old_height, Math.abs(dx), 0, old_width, old_height);
    } else if (dx >= 0 && dy <= 0) {
      buffer_canvas_ctx.drawImage(mapview_canvas, 0, 0, old_width, old_height, 0, Math.abs(dy), old_width, old_height);
    }
  }
  mapview$1["store_width"] = old_width;
  mapview$1["store_height"] = old_height;
  mapview$1["width"] = old_width;
  mapview$1["height"] = old_height;
}
function actionByNumber(actId) {
  const actions = window.actions;
  if (actions[actId] == void 0) {
    console.log("Asked for non existing action numbered %d", actId);
    return null;
  }
  return actions[actId];
}
function actionHasResult(paction, result) {
  if (paction == null || paction["result"] == null) {
    console.log("action_has_result(): bad action");
    console.log(paction);
    return null;
  }
  return paction["result"] == result;
}
function actionProbPossible(aprob) {
  const notImpl = window.action_prob_not_impl;
  return 0 < aprob["max"] || notImpl != null && notImpl(aprob);
}
const sounds_enabled_get = () => window.sounds_enabled ?? false;
const soundset_get = () => window.soundset ?? {};
let sound_path = "/sounds/";
function unit_move_sound_play(unit) {
  if (!sounds_enabled_get()) return;
  if (unit == null) return;
  if (soundset_get() == null) {
    console.error("soundset not found.");
    return;
  }
  const ptype = unit_type(unit);
  if (soundset_get()[ptype["sound_move"]] != null) {
    play_sound(soundset_get()[ptype["sound_move"]]);
  } else if (soundset_get()[ptype["sound_move_alt"]] != null) {
    play_sound(soundset_get()[ptype["sound_move_alt"]]);
  }
}
function play_sound(sound_file) {
  try {
    if (!sounds_enabled_get() || !document.createElement("audio").canPlayType || Audio == null) return;
    const audio2 = new Audio(sound_path + sound_file);
    const promise = audio2.play();
    if (promise != null) {
      promise.catch(sound_error_handler);
    }
  } catch (err) {
    sound_error_handler(err);
  }
}
function sound_error_handler(err) {
  window.sounds_enabled = false;
  const trackJs = window.trackJs;
  if (trackJs) {
    trackJs.console.log(err);
    trackJs.track("Sound problem");
  } else {
    console.error(err);
  }
}
const TECH_UNKNOWN = 0;
const TECH_PREREQS_KNOWN = 1;
const TECH_KNOWN$1 = 2;
const A_NONE = 0;
function playerInventionState(pplayer, techId) {
  if (pplayer == null) {
    return TECH_UNKNOWN;
  } else {
    if (pplayer["inventions"] != null && pplayer["inventions"][techId] != null) {
      return pplayer["inventions"][techId];
    } else {
      return TECH_UNKNOWN;
    }
  }
}
function isTechReqForGoal(checkTechId, goalTechId) {
  if (checkTechId === goalTechId) return true;
  if (goalTechId === 0 || checkTechId === 0) return false;
  const goalTech = store.techs[goalTechId];
  if (goalTech == null) return false;
  for (let i2 = 0; i2 < goalTech["research_reqs"].length; i2++) {
    const rid = goalTech["research_reqs"][i2]["value"];
    if (checkTechId === rid) {
      return true;
    } else if (isTechReqForGoal(checkTechId, rid)) {
      return true;
    }
  }
  return false;
}
function isTechReqForTech(checkTechId, nextTechId) {
  if (checkTechId === nextTechId) return false;
  if (nextTechId === 0 || checkTechId === 0) return false;
  const nextTech = store.techs[nextTechId];
  if (nextTech == null) return false;
  for (let i2 = 0; i2 < nextTech["research_reqs"].length; i2++) {
    const rid = nextTech["research_reqs"][i2]["value"];
    if (checkTechId === rid) {
      return true;
    }
  }
  return false;
}
function getCurrentBulbsOutput() {
  let selfBulbs = 0;
  let selfUpkeep = 0;
  let pooled = false;
  let teamBulbs = 0;
  let teamUpkeep = 0;
  if (!clientIsObserver() && clientPlaying() != null) {
    const cplayer = clientPlaying().playerno;
    for (const cityId in store.cities) {
      const city = store.cities[cityId];
      if (city.owner === cplayer) {
        selfBulbs += city.prod[O_SCIENCE];
      }
    }
    selfUpkeep = clientPlaying()?.tech_upkeep ?? 0;
    if (store.gameInfo?.["team_pooled_research"]) {
      const team = clientPlaying()?.team;
      for (const playerId in store.players) {
        const player = store.players[playerId];
        if (player.team === team && player.is_alive) {
          teamUpkeep += player.tech_upkeep ?? 0;
          if (player.playerno !== cplayer) {
            pooled = true;
          }
        }
      }
      if (pooled) {
        teamBulbs = research_data?.[team]?.total_bulbs_prod ?? 0;
      }
    }
    if (!pooled) {
      teamBulbs = selfBulbs;
      teamUpkeep = selfUpkeep;
    }
  }
  return {
    self_bulbs: selfBulbs,
    self_upkeep: selfUpkeep,
    pooled,
    team_bulbs: teamBulbs,
    team_upkeep: teamUpkeep
  };
}
function getCurrentBulbsOutputText(cbo) {
  if (cbo === void 0) {
    cbo = getCurrentBulbsOutput();
  }
  let text;
  if (cbo.self_bulbs === 0 && cbo.self_upkeep === 0) {
    text = "No bulbs researched";
  } else {
    text = String(cbo.self_bulbs);
    const net = cbo.self_bulbs - cbo.self_upkeep;
    if (cbo.self_upkeep !== 0) {
      text = text + " - " + cbo.self_upkeep + " = " + net;
    }
    if (1 === Math.abs(net)) {
      text = text + " bulb/turn";
    } else {
      text = text + " bulbs/turn";
    }
  }
  if (cbo.pooled) {
    text = text + " (" + (cbo.team_bulbs - cbo.team_upkeep) + " team total)";
  }
  return text;
}
function techIdByName(tname) {
  for (const techId in store.techs) {
    if (tname === store.techs[techId]["name"]) return techId;
  }
  return null;
}
const B_AIRPORT_NAME = "Airport";
const improvements_name_index = {};
function improvements_init() {
  const improvements2 = store.improvements;
  Object.keys(improvements2).forEach((k2) => delete improvements2[k2]);
  Object.keys(improvements_name_index).forEach(
    (k2) => delete improvements_name_index[k2]
  );
}
function get_improvements_from_tech(techId) {
  const improvements2 = store.improvements;
  const result = [];
  for (const improvementId in improvements2) {
    const pimprovement = improvements2[improvementId];
    const reqs = get_improvement_requirements(parseInt(improvementId, 10));
    for (let i2 = 0; i2 < reqs.length; i2++) {
      if (reqs[i2] == techId) {
        result.push(pimprovement);
      }
    }
  }
  return result;
}
function is_wonder(improvement) {
  return improvement["soundtag"][0] === "w";
}
function get_improvement_requirements(improvementId) {
  const improvements2 = store.improvements;
  const result = [];
  const improvement = improvements2[improvementId];
  if (improvement != null && improvement["reqs"] != null) {
    for (let i2 = 0; i2 < improvement["reqs"].length; i2++) {
      if (improvement["reqs"][i2]["kind"] == 1 && improvement["reqs"][i2]["present"]) {
        result.push(improvement["reqs"][i2]["value"]);
      }
    }
  }
  return result;
}
function improvement_id_by_name(name) {
  return improvements_name_index.hasOwnProperty(name) ? improvements_name_index[name] : -1;
}
store.client;
let update_player_info_pregame_queued = false;
function update_player_info_pregame() {
  if (update_player_info_pregame_queued) return;
  setTimeout(update_player_info_pregame_real, 1e3);
  update_player_info_pregame_queued = true;
}
function update_player_info_pregame_real() {
  if (C_S_PREPARING != clientState()) {
    update_player_info_pregame_queued = false;
    return;
  }
  let player_html = "";
  for (const id in store.players) {
    const player = store.players[id];
    if (player != null) {
      const isAI = player["name"].indexOf("AI") !== -1;
      const iconId = isAI ? "pregame_ai_icon" : "pregame_player_icon";
      player_html += "<div id='pregame_plr_" + id + "' class='pregame_player_name'><div id='" + iconId + "'></div><b>" + player["name"] + "</b></div>";
    }
  }
  const pregamePlayerList = document.getElementById("pregame_player_list");
  if (pregamePlayerList) pregamePlayerList.innerHTML = player_html;
  for (const id in store.players) {
    const player = store.players[id];
    let nation_text = "";
    const plrEl = document.getElementById("pregame_plr_" + id);
    if (player["nation"] in store.nations) {
      nation_text = " - " + store.nations[player["nation"]]["adjective"];
      const flag_canvas = document.createElement("canvas");
      flag_canvas.id = "pregame_nation_flags_" + id;
      flag_canvas.width = 29;
      flag_canvas.height = 20;
      flag_canvas.className = "pregame_flags";
      if (plrEl) plrEl.prepend(flag_canvas);
      const flag_canvas_ctx = flag_canvas.getContext("2d");
      const tag = "f." + store.nations[player["nation"]]["graphic_str"];
      if (window.sprites[tag] != null && flag_canvas_ctx != null) {
        flag_canvas_ctx.drawImage(window.sprites[tag], 0, 0);
      }
    }
    if (!plrEl) continue;
    if (player["is_ready"] === true) {
      plrEl.classList.add("pregame_player_ready");
      plrEl.title = "Player ready" + nation_text;
    } else if (player["name"].indexOf("AI") === -1) {
      plrEl.title = "Player not ready" + nation_text;
    } else {
      plrEl.title = "AI Player (random nation)";
    }
    plrEl.setAttribute("name", player["name"]);
    plrEl.setAttribute("playerid", String(player["playerno"]));
  }
  update_player_info_pregame_queued = false;
}
function ruledir_from_ruleset_name(ruleset_name, fall_back_dir) {
  switch (ruleset_name) {
    case "Classic ruleset":
      return "classic";
    case "Civ2Civ3 ruleset":
      return "civ2civ3";
    case "Multiplayer ruleset":
      return "multiplayer";
    case "Webperimental":
      return "webperimental";
    default:
      console.log(`Don't know the ruleset dir of "` + ruleset_name + '". Guessing "' + fall_back_dir + '".');
      return fall_back_dir;
  }
}
function popup_pillage_selection_dialog(punit, tgt) {
  if (punit == null || typeof clientIsObserver === "function" && clientIsObserver()) return;
  if (tgt.length === 0) return;
  const dlgId = "pillage_sel_dialog_" + punit["id"];
  document.getElementById(dlgId)?.remove();
  const dlg = document.createElement("div");
  dlg.id = dlgId;
  dlg.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:30%;left:50%;transform:translateX(-50%);width:390px;";
  dlg.appendChild(document.createTextNode("Your " + store.unitTypes[punit["type"]]["name"] + " is waiting for you to select what to pillage."));
  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = "margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;";
  for (let i2 = 0; i2 < tgt.length; i2++) {
    const extra_id = tgt[i2];
    if (extra_id === EXTRA_NONE$1) continue;
    const btn = document.createElement("button");
    btn.id = "pillage_sel_" + punit["id"] + "_" + extra_id;
    btn.className = "act_sel_button";
    btn.textContent = store.extras[extra_id]["name"];
    btn.addEventListener("click", function(ev) {
      pillage_target_selected(ev);
    });
    btnContainer.appendChild(btn);
  }
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "act_sel_button";
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", function() {
    dlg.remove();
  });
  btnContainer.appendChild(cancelBtn);
  dlg.appendChild(btnContainer);
  document.getElementById("game_page")?.appendChild(dlg);
}
function pillage_target_selected(ev) {
  const id = ev.target.id;
  const params = id.match(/pillage_sel_(\d*)_([^_]*)/);
  if (!params) return;
  const extra_id = parseInt(params[2], 10);
  const punit_id = parseInt(params[1], 10);
  request_unit_do_action(
    ACTION_PILLAGE$1,
    punit_id,
    store.units[punit_id].tile,
    extra_id
  );
  const dlg = ev.target.closest('[id^="pillage_sel_dialog_"]');
  if (dlg) dlg.remove();
}
const SSA_AUTOEXPLORE$1 = ServerSideAgent.AUTOEXPLORE;
const SSA_AUTOWORKER$1 = ServerSideAgent.AUTOWORKER;
const SSA_NONE$1 = ServerSideAgent.NONE;
const ORDER_MOVE$1 = Order.MOVE;
const ORDER_ACTION_MOVE$1 = Order.ACTION_MOVE;
const ORDER_PERFORM_ACTION = Order.PERFORM_ACTION;
const EXTRA_HUT = window.EXTRA_HUT;
function observerGuard() {
  return clientIsObserver();
}
function key_unit_auto_explore() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    request_unit_ssa_set(funits[i2], SSA_AUTOEXPLORE$1);
  }
  setTimeout(update_unit_focus, 700);
}
function key_unit_load() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    const ptile = indexToTile(punit["tile"]);
    let transporter_unit_id = 0;
    let has_transport_unit = false;
    const units_on_tile = tile_units(ptile) || [];
    for (let r2 = 0; r2 < units_on_tile.length; r2++) {
      const tunit = units_on_tile[r2];
      if (tunit["id"] == punit["id"]) continue;
      const ntype = unit_type(tunit);
      if (ntype != null && ntype["transport_capacity"] > 0) {
        has_transport_unit = true;
        transporter_unit_id = tunit["id"];
      }
    }
    if (has_transport_unit && transporter_unit_id > 0 && punit["tile"] > 0) {
      request_unit_do_action(
        ACTION_TRANSPORT_BOARD,
        punit["id"],
        transporter_unit_id
      );
    }
  }
  setTimeout(advance_unit_focus, 700);
}
function key_unit_unload() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  if (funits.length === 0) return;
  const last_unit = funits[funits.length - 1];
  const units_on_tile = tile_units(indexToTile(last_unit["tile"])) || [];
  for (let i2 = 0; i2 < units_on_tile.length; i2++) {
    const punit = units_on_tile[i2];
    if (punit["transported"] && punit["transported_by"] > 0 && clientPlaying() != null && punit["owner"] == clientPlaying().playerno) {
      request_new_unit_activity(punit, ACTIVITY_IDLE, EXTRA_NONE$1);
      request_unit_do_action(
        ACTION_TRANSPORT_DEBOARD,
        punit["id"],
        punit["transported_by"]
      );
    } else {
      request_new_unit_activity(punit, ACTIVITY_IDLE, EXTRA_NONE$1);
      request_unit_do_action(
        ACTION_TRANSPORT_UNLOAD,
        punit["transported_by"],
        punit["id"]
      );
    }
  }
  setTimeout(advance_unit_focus, 700);
}
function key_unit_show_cargo() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  if (funits.length === 0) return;
  const last_unit = funits[funits.length - 1];
  const units_on_tile = tile_units(indexToTile(last_unit["tile"])) || [];
  setCurrentFocus([]);
  for (let i2 = 0; i2 < units_on_tile.length; i2++) {
    const punit = units_on_tile[i2];
    if (punit["transported"] && punit["transported_by"] > 0) {
      current_focus$1.push(punit);
    }
  }
  update_active_units_dialog();
  update_unit_order_commands();
}
function key_unit_wait() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    waiting_units_list.push(punit["id"]);
  }
  advance_unit_focus();
}
function key_unit_noorders() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    punit["done_moving"] = true;
  }
  advance_unit_focus();
}
function set_focus_units_activity(activity, target = EXTRA_NONE$1) {
  if (observerGuard()) return;
  for (const punit of get_units_in_focus()) {
    request_new_unit_activity(punit, activity, target);
  }
  setTimeout(update_unit_focus, 700);
}
function key_unit_idle() {
  set_focus_units_activity(ACTIVITY_IDLE);
}
function key_unit_sentry() {
  set_focus_units_activity(ACTIVITY_SENTRY);
}
function key_unit_fortify() {
  set_focus_units_activity(ACTIVITY_FORTIFYING);
}
function key_unit_fortress() {
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    const ptile = indexToTile(punit["tile"]);
    for (let b2 = 0; b2 < bases$1.length; b2++) {
      if (bases$1[b2]["base"]["gui_type"] == BASE_GUI_FORTRESS && !tileHasExtra(ptile, bases$1[b2])) {
        request_new_unit_activity(punit, ACTIVITY_BASE, bases$1[b2]["id"]);
      }
    }
  }
  setTimeout(update_unit_focus, 700);
}
function key_unit_airbase() {
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    const ptile = indexToTile(punit["tile"]);
    for (let b2 = 0; b2 < bases$1.length; b2++) {
      if (bases$1[b2]["base"]["gui_type"] == BASE_GUI_AIRBASE && !tileHasExtra(ptile, bases$1[b2])) {
        request_new_unit_activity(punit, ACTIVITY_BASE, bases$1[b2]["id"]);
      }
    }
  }
  setTimeout(update_unit_focus, 700);
}
function key_unit_irrigate() {
  set_focus_units_activity(ACTIVITY_IRRIGATE);
}
function key_unit_cultivate() {
  set_focus_units_activity(ACTIVITY_CULTIVATE);
}
function key_unit_clean() {
  set_focus_units_activity(ACTIVITY_CLEAN);
}
function key_unit_nuke() {
  if (observerGuard()) return;
  activate_goto_last(ORDER_PERFORM_ACTION, ACTION_NUKE);
}
function key_unit_upgrade() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    const pcity = tileCity(indexToTile(punit["tile"]));
    const target_id = pcity != null ? pcity["id"] : 0;
    request_unit_do_action(ACTION_UPGRADE_UNIT, punit["id"], target_id);
  }
  update_unit_focus();
}
function key_unit_paradrop() {
  if (observerGuard()) return;
  setParadropActive(true);
  message_log.update({
    event: E_BEGINNER_HELP,
    message: "Click on the tile to send this paratrooper to."
  });
}
function key_unit_airlift() {
  if (observerGuard()) return;
  setAirliftActive(true);
  message_log.update({
    event: E_BEGINNER_HELP,
    message: "Click on the city to airlift this unit to."
  });
}
function key_unit_transform() {
  set_focus_units_activity(ACTIVITY_TRANSFORM);
}
function key_unit_pillage() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    const tgt = get_what_can_unit_pillage_from(punit, null);
    if (tgt.length > 0) {
      if (tgt.length == 1) {
        request_unit_do_action(
          ACTION_PILLAGE$1,
          punit["id"],
          punit.tile,
          tgt[0]
        );
      } else {
        popup_pillage_selection_dialog(punit, tgt);
      }
    }
  }
  setTimeout(update_unit_focus, 700);
}
function key_unit_mine() {
  set_focus_units_activity(ACTIVITY_MINE);
}
function key_unit_plant() {
  set_focus_units_activity(ACTIVITY_PLANT);
}
function key_unit_road() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    const ptile = indexToTile(punit["tile"]);
    for (let r2 = 0; r2 < roads$1.length; r2++) {
      if (!tileHasExtra(ptile, roads$1[r2])) {
        request_new_unit_activity(punit, ACTIVITY_GEN_ROAD, roads$1[r2]["id"]);
      }
    }
  }
  setTimeout(update_unit_focus, 700);
}
function key_unit_homecity() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    const ptile = indexToTile(punit["tile"]);
    const pcity = tileCity(ptile);
    if (pcity != null) {
      request_unit_do_action(ACTION_HOME_CITY, punit["id"], pcity["id"]);
      const el = document.getElementById("order_change_homecity");
      if (el) el.style.display = "none";
    }
  }
}
function key_unit_action_select() {
  if (observerGuard()) return;
  if (action_tgt_sel_active) {
    setActionTgtSelActive(false);
    request_unit_act_sel_vs_own_tile();
  } else {
    setActionTgtSelActive(true);
    message_log.update({
      event: E_BEGINNER_HELP,
      message: "Click on a tile to act against it. Press 'd' again to act against own tile."
    });
  }
}
function request_unit_act_sel_vs(ptile) {
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    sendUnitSscsSet(punit["id"], UnitSSDataType.QUEUE, ptile["index"]);
  }
}
function request_unit_act_sel_vs_own_tile() {
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    sendUnitSscsSet(punit["id"], 0, punit["tile"]);
  }
}
function key_unit_auto_work() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    request_unit_autoworkers(punit);
  }
  setTimeout(update_unit_focus, 700);
}
function request_unit_cancel_orders(punit) {
  if (punit != null && (punit.ssa_controller != SSA_NONE$1 || punit.has_orders)) {
    punit.ssa_controller = SSA_NONE$1;
    punit.has_orders = false;
    sendUnitOrders({
      unit_id: punit.id,
      src_tile: punit.tile,
      length: 0,
      repeat: false,
      vigilant: false,
      dest_tile: punit.tile,
      orders: []
    });
  }
}
function request_new_unit_activity(punit, activity, target) {
  request_unit_cancel_orders(punit);
  action_decision_clear_want(punit["id"]);
  sendUnitChangeActivity(punit["id"], activity, target);
}
function request_unit_ssa_set(punit, agent) {
  if (punit != null) {
    sendUnitServerSideAgentSet(punit["id"], agent);
  }
}
function request_unit_autoworkers(punit) {
  if (punit != null) {
    request_unit_cancel_orders(punit);
    action_decision_clear_want(punit["id"]);
    request_unit_ssa_set(punit, SSA_AUTOWORKER$1);
  }
}
function request_unit_build_city() {
  if (observerGuard()) return;
  if (current_focus$1.length > 0) {
    const punit = current_focus$1[0];
    if (punit != null) {
      if (punit["movesleft"] == 0) {
        message_log.update({
          event: E_BAD_COMMAND,
          message: "Unit has no moves left to build city"
        });
        return;
      }
      const ptype = unit_type(punit);
      if (ptype != null && (ptype["name"] == "Settlers" || ptype["name"] == "Engineers")) {
        const target_city = tileCity(indexToTile(punit["tile"]));
        if (target_city == null) {
          sendCityNameSuggestionReq(punit["id"]);
        } else {
          request_unit_do_action(ACTION_JOIN_CITY, punit.id, target_city.id);
        }
      }
    }
  }
}
function request_unit_do_action(action_id, actor_id, target_id, sub_tgt_id = 0, name = "") {
  sendUnitDoAction(action_id, actor_id, target_id, sub_tgt_id || 0, name || "");
  action_decision_clear_want(actor_id);
}
function key_unit_disband() {
  if (observerGuard()) return;
  swal(
    {
      title: "Disband unit?",
      text: "Do you want to destroy this unit?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, disband unit.",
      closeOnConfirm: true
    },
    function() {
      const funits = get_units_in_focus();
      for (let i2 = 0; i2 < funits.length; i2++) {
        const punit = funits[i2];
        const target_city = tileCity(indexToTile(punit["tile"]));
        const action_id = target_city ? ACTION_DISBAND_UNIT_RECOVER : ACTION_DISBAND_UNIT;
        const target_id = target_city ? target_city["id"] : punit["id"];
        request_unit_do_action(action_id, punit["id"], target_id);
      }
      setTimeout(update_unit_focus, 700);
      setTimeout(update_active_units_dialog, 800);
    }
  );
}
function key_unit_move(dir) {
  if (observerGuard()) return;
  if (current_focus$1.length > 0) {
    const punit = current_focus$1[0];
    if (punit == null) {
      return;
    }
    const ptile = indexToTile(punit["tile"]);
    if (ptile == null) {
      return;
    }
    const newtile = mapstep(ptile, dir);
    if (newtile == null) {
      return;
    }
    const order = {
      "order": ORDER_ACTION_MOVE$1,
      "dir": dir,
      "activity": ACTIVITY_LAST,
      "target": 0,
      "sub_target": 0,
      "action": ACTION_COUNT$1
    };
    if (punit["transported"] && clientPlaying() != null && newtile["units"].every(function(ounit) {
      return ounit["owner"] == clientPlaying()?.playerno;
    }) && (tileCity(newtile) == null || tileCity(newtile)["owner"] == clientPlaying()?.playerno) && !tileHasExtra(newtile, EXTRA_HUT) && (newtile["extras_owner"] == clientPlaying().playerno || !tileHasTerritoryClaimingExtra(newtile))) {
      order["order"] = ORDER_MOVE$1;
    }
    sendUnitOrders({
      unit_id: punit["id"],
      src_tile: ptile["index"],
      length: 1,
      repeat: false,
      vigilant: false,
      orders: [order],
      dest_tile: newtile["index"]
    });
    unit_move_sound_play(punit);
  }
  deactivate_goto(true);
}
function governmentMaxRate(govtId) {
  switch (govtId) {
    case 0:
      return 100;
    case 1:
      return 60;
    case 2:
      return 70;
    case 3:
      return 80;
    case 4:
      return 80;
    case 5:
      return 100;
    default:
      return 100;
  }
}
function canPlayerGetGov(govtId) {
  const client = store.client;
  const governments2 = store.governments;
  const playerHasWonder = window.player_has_wonder;
  const areReqsActive = window.are_reqs_active;
  const RPT_CERTAIN = window.RPT_CERTAIN;
  return playerHasWonder(client.conn.playing.playerno, 63) || // hack for Statue of Liberty
  areReqsActive(
    client.conn.playing,
    null,
    null,
    null,
    null,
    null,
    null,
    governments2[govtId]["reqs"],
    RPT_CERTAIN
  );
}
function playing() {
  return store.client?.conn?.playing;
}
function ratesForm() {
  return document.rates;
}
const Slider = window.Slider;
function setInnerHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = String(html);
}
let s_tax = null;
let s_lux = null;
let s_sci = null;
let tax;
let sci;
let lux;
let maxrate = 80;
let freeze = false;
function show_tax_rates_dialog() {
  document.getElementById("rates_dialog")?.remove();
  const dlg = document.createElement("div");
  dlg.id = "rates_dialog";
  dlg.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:20%;left:50%;transform:translateX(-50%);width:" + (isSmallScreen() ? "90%" : "40%") + ";color:#fff;";
  dlg.innerHTML = "<h2>Select tax, luxury and science rates</h2><form name='rates'><table border='0' style='color: #ffffff;'><tr> <td><span>Tax:</td> <td> <div class='slider' id='slider-tax' tabIndex='1'></div></td><td><div id='tax_result' style='float:left;'></div></td><td> <INPUT TYPE='CHECKBOX' NAME='lock'>Lock</td></tr><tr><td>Luxury:</td><td><div class='slider' id='slider-lux' tabIndex='1'></div></td><td> <div id='lux_result' style='float:left;'></div></td><td><INPUT TYPE='CHECKBOX' NAME='lock'>Lock</td></tr><tr><td>Science:</td><td><div class='slider' id='slider-sci' tabIndex='1'></div></td><td><div id='sci_result' style='float:left;'></div></td><td><INPUT TYPE='CHECKBOX' NAME='lock'>Lock</td></tr></table></form><div id='max_tax_rate' style='margin:10px;'></div><div style='margin:10px;'>Net income: <span id='income_info'></span><br>Research: <span id='bulbs_info'></span></div>";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.cssText = "margin-top:8px;";
  closeBtn.addEventListener("click", function() {
    dlg.remove();
  });
  dlg.appendChild(closeBtn);
  document.getElementById("game_page")?.appendChild(dlg);
  update_rates_dialog();
}
function update_rates_dialog() {
  if (clientIsObserver()) return;
  maxrate = governmentMaxRate(playing()["government"]);
  const setHtml2 = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  setHtml2("slider-tax", "<input class='slider-input' id='slider-tax-input' name='slider-tax-input'/>");
  setHtml2("slider-lux", "<input class='slider-input' id='slider-lux-input' name='slider-lux-input'/>");
  setHtml2("slider-sci", "<input class='slider-input' id='slider-sci-input' name='slider-sci-input'/>");
  create_rates_dialog(
    playing()["tax"],
    playing()["luxury"],
    playing()["science"],
    maxrate
  );
  const govt = store.governments[playing()["government"]];
  const maxRateEl = document.getElementById("max_tax_rate");
  if (maxRateEl) maxRateEl.innerHTML = "<i>" + govt["name"] + " max rate: " + maxrate + "</i>";
  update_net_income();
  update_net_bulbs();
}
function update_net_income() {
  let net_income = playing()["expected_income"];
  if (playing()["expected_income"] > 0) {
    net_income = "+" + playing()["expected_income"];
  }
  setInnerHtml("income_info", net_income);
}
function update_net_bulbs(bulbs) {
  if (bulbs === void 0) {
    const cbo = getCurrentBulbsOutput();
    bulbs = cbo.self_bulbs - cbo.self_upkeep;
  }
  const bulbsStr = bulbs > 0 ? "+" + bulbs : String(bulbs);
  setInnerHtml("bulbs_info", bulbsStr);
}
function create_rates_dialog(taxVal, luxVal, sciVal, max) {
  s_tax = new Slider(
    document.getElementById("slider-tax"),
    document.getElementById("slider-tax-input")
  );
  s_tax.setValue(taxVal);
  s_tax.setMaximum(max);
  s_tax.setMinimum(0);
  s_tax.setBlockIncrement(10);
  s_tax.setUnitIncrement(10);
  s_tax.onchange = update_tax_rates;
  s_lux = new Slider(
    document.getElementById("slider-lux"),
    document.getElementById("slider-lux-input")
  );
  s_lux.setValue(luxVal);
  s_lux.setMaximum(max);
  s_lux.setMinimum(0);
  s_lux.setBlockIncrement(10);
  s_lux.setUnitIncrement(10);
  s_lux.onchange = update_lux_rates;
  s_sci = new Slider(
    document.getElementById("slider-sci"),
    document.getElementById("slider-sci-input")
  );
  s_sci.setValue(sciVal);
  s_sci.setMaximum(max);
  s_sci.setMinimum(0);
  s_sci.setBlockIncrement(10);
  s_sci.setUnitIncrement(10);
  s_sci.onchange = update_sci_rates;
  maxrate = max;
  update_rates_labels();
}
function update_rates_labels() {
  tax = s_tax.getValue();
  lux = s_lux.getValue();
  sci = s_sci.getValue();
  setInnerHtml("tax_result", tax + "%");
  setInnerHtml("lux_result", lux + "%");
  setInnerHtml("sci_result", sci + "%");
}
function update_tax_rates() {
  if (freeze) return;
  freeze = true;
  if (s_tax.getValue() % 10 !== 0) s_tax.setValue(s_tax.getValue() - s_tax.getValue() % 10);
  if (s_lux.getValue() % 10 !== 0) s_lux.setValue(s_lux.getValue() - s_lux.getValue() % 10);
  if (s_sci.getValue() % 10 !== 0) s_sci.setValue(s_sci.getValue() - s_sci.getValue() % 10);
  const lock_lux = ratesForm().lock[1].checked;
  const lock_sci = ratesForm().lock[2].checked;
  tax = s_tax.getValue();
  lux = s_lux.getValue();
  sci = s_sci.getValue();
  if (tax + lux + sci !== 100 && lock_lux === false) {
    lux = Math.min(Math.max(100 - tax - sci, 0), maxrate);
  }
  if (tax + lux + sci !== 100 && lock_sci === false) {
    sci = Math.min(Math.max(100 - lux - tax, 0), maxrate);
  }
  if (tax + lux + sci !== 100) {
    s_tax.setValue(100 - lux - sci);
    freeze = false;
    return;
  }
  s_tax.setValue(tax);
  s_lux.setValue(lux);
  s_sci.setValue(sci);
  setInnerHtml("tax_result", tax + "%");
  setInnerHtml("lux_result", lux + "%");
  setInnerHtml("sci_result", sci + "%");
  freeze = false;
  submit_player_rates();
}
function update_lux_rates() {
  if (freeze) return;
  freeze = true;
  if (s_tax.getValue() % 10 !== 0) s_tax.setValue(s_tax.getValue() - s_tax.getValue() % 10);
  if (s_lux.getValue() % 10 !== 0) s_lux.setValue(s_lux.getValue() - s_lux.getValue() % 10);
  if (s_sci.getValue() % 10 !== 0) s_sci.setValue(s_sci.getValue() - s_sci.getValue() % 10);
  const lock_tax = ratesForm().lock[0].checked;
  const lock_sci = ratesForm().lock[2].checked;
  tax = s_tax.getValue();
  lux = s_lux.getValue();
  sci = s_sci.getValue();
  if (tax + lux + sci !== 100 && lock_tax === false) {
    tax = Math.min(Math.max(100 - lux - sci, 0), maxrate);
  }
  if (tax + lux + sci !== 100 && lock_sci === false) {
    sci = Math.min(Math.max(100 - lux - tax, 0), maxrate);
  }
  if (tax + lux + sci !== 100) {
    s_lux.setValue(100 - tax - sci);
    freeze = false;
    return;
  }
  s_tax.setValue(tax);
  s_lux.setValue(lux);
  s_sci.setValue(sci);
  setInnerHtml("tax_result", tax + "%");
  setInnerHtml("lux_result", lux + "%");
  setInnerHtml("sci_result", sci + "%");
  freeze = false;
  submit_player_rates();
}
function update_sci_rates() {
  if (freeze) return;
  freeze = true;
  if (s_tax.getValue() % 10 !== 0) s_tax.setValue(s_tax.getValue() - s_tax.getValue() % 10);
  if (s_lux.getValue() % 10 !== 0) s_lux.setValue(s_lux.getValue() - s_lux.getValue() % 10);
  if (s_sci.getValue() % 10 !== 0) s_sci.setValue(s_sci.getValue() - s_sci.getValue() % 10);
  const lock_tax = ratesForm().lock[0].checked;
  const lock_lux = ratesForm().lock[1].checked;
  tax = s_tax.getValue();
  lux = s_lux.getValue();
  sci = s_sci.getValue();
  if (tax + lux + sci !== 100 && lock_lux === false) {
    lux = Math.min(Math.max(100 - tax - sci, 0), maxrate);
  }
  if (tax + lux + sci !== 100 && lock_tax === false) {
    tax = Math.min(Math.max(100 - sci - lux, 0), maxrate);
  }
  if (tax + lux + sci !== 100) {
    s_sci.setValue(100 - lux - tax);
    freeze = false;
    return;
  }
  s_tax.setValue(tax);
  s_lux.setValue(lux);
  s_sci.setValue(sci);
  setInnerHtml("tax_result", tax + "%");
  setInnerHtml("lux_result", lux + "%");
  setInnerHtml("sci_result", sci + "%");
  freeze = false;
  submit_player_rates();
}
function submit_player_rates() {
  if (tax >= 0 && tax <= 100 && lux >= 0 && lux <= 100 && sci >= 0 && sci <= 100) {
    sendPlayerRates(tax, lux, sci);
  } else {
    swal("Invalid tax rate values");
  }
}
const reqtree = {
  "2": { "x": 0, "y": 0 },
  // Alphabet
  "10": { "x": 0, "y": 69 },
  // Ceremonial Burial
  "63": { "x": 0, "y": 183 },
  // Pottery
  "46": { "x": 0, "y": 300 },
  // Masonry
  "35": { "x": 0, "y": 417 },
  // Horseback Riding
  "9": { "x": 0, "y": 534 },
  // Bronze Working
  "86": { "x": 0, "y": 651 },
  // Warrior Code
  "87": { "x": 416, "y": 0 },
  // Writing
  "13": { "x": 416, "y": 79 },
  // Code of Laws
  "55": { "x": 416, "y": 167 },
  // Mysticism
  "48": { "x": 416, "y": 246 },
  // Mathematics
  "45": { "x": 416, "y": 322 },
  // Map Making
  "62": { "x": 416, "y": 395 },
  // Polytheism   (changed manually)
  "81": { "x": 416, "y": 456 },
  // The Wheel
  "20": { "x": 416, "y": 532 },
  // Currency
  "38": { "x": 416, "y": 635 },
  // Iron Working
  "42": { "x": 667, "y": 38 },
  // Literacy
  "84": { "x": 667, "y": 126 },
  // Trade
  "53": { "x": 667, "y": 202 },
  // Monarchy
  "4": { "x": 667, "y": 290 },
  // Astronomy
  "72": { "x": 667, "y": 369 },
  // Seafaring
  "19": { "x": 667, "y": 500 },
  // Construction
  "80": { "x": 918, "y": 29 },
  // The Republic
  "59": { "x": 918, "y": 152 },
  // Philosophy
  "56": { "x": 918, "y": 329 },
  // Navigation
  "25": { "x": 918, "y": 425 },
  // Engineering
  "29": { "x": 918, "y": 504 },
  // Feudalism
  "8": { "x": 918, "y": 658 },
  // Bridge Building  (changed manually)
  "7": { "x": 1169, "y": 6 },
  // Banking
  "49": { "x": 1169, "y": 85 },
  // Medicine
  "85": { "x": 1169, "y": 173 },
  // University
  "60": { "x": 1169, "y": 249 },
  // Physics (fixed manually)
  "54": { "x": 1169, "y": 310 },
  // Monotheism
  "37": { "x": 1169, "y": 386 },
  // Invention
  "12": { "x": 1169, "y": 605 },
  // Chivalry
  "22": { "x": 1420, "y": 20 },
  // Economics
  "11": { "x": 1420, "y": 104 },
  // Chemistry
  "21": { "x": 1420, "y": 133 },
  // Democracy
  "83": { "x": 1420, "y": 210 },
  // Theory of Gravity
  "75": { "x": 1420, "y": 307 },
  // Steam Engine
  "71": { "x": 1420, "y": 384 },
  // Sanitation
  "44": { "x": 1420, "y": 458 },
  // Magnetism
  "82": { "x": 1420, "y": 535 },
  // Theology
  "34": { "x": 1420, "y": 612 },
  // Gunpowder
  "5": { "x": 1753, "y": 100 },
  // Atomic Theory (fixed manually)
  "28": { "x": 1753, "y": 238 },
  // Explosives
  "65": { "x": 1753, "y": 383 },
  // Railroad
  "50": { "x": 1753, "y": 471 },
  // Metallurgy
  "41": { "x": 1753, "y": 620 },
  // Leadership
  "36": { "x": 1938, "y": 170 },
  // Industrialization
  "23": { "x": 1938, "y": 429 },
  // Electricity
  "18": { "x": 1938, "y": 508 },
  // Conscription
  "79": { "x": 2271, "y": 42 },
  // The Corporation
  "16": { "x": 2271, "y": 133 },
  // Communism
  "76": { "x": 2271, "y": 300 },
  // Steel
  "68": { "x": 2271, "y": 491 },
  // Refrigeration
  "78": { "x": 2271, "y": 570 },
  // Tactics
  "32": { "x": 2543, "y": 2 },
  // Genetic Engineering
  "67": { "x": 2543, "y": 93 },
  // Refining
  "27": { "x": 2543, "y": 172 },
  // Espionage
  "24": { "x": 2543, "y": 352 },
  // Electronics
  "33": { "x": 2543, "y": 428 },
  // Guerilla Warfare
  "43": { "x": 2543, "y": 504 },
  // Machine Tools
  "3": { "x": 2543, "y": 616 },
  // Amphibious Warfare
  "15": { "x": 2794, "y": 185 },
  // Combustion
  "51": { "x": 2794, "y": 472 },
  // Miniaturization
  "6": { "x": 2977, "y": 233 },
  // Automobile
  "30": { "x": 2977, "y": 309 },
  // Flight
  "47": { "x": 3228, "y": 170 },
  // Mass Production
  "52": { "x": 3228, "y": 420 },
  // Mobile Warfare
  "64": { "x": 3228, "y": 496 },
  // Radio
  "66": { "x": 3479, "y": 101 },
  // Recycling
  "57": { "x": 3479, "y": 193 },
  // Nuclear Fission
  "39": { "x": 3479, "y": 270 },
  // Labor Union
  "17": { "x": 3479, "y": 346 },
  // Computers
  "1": { "x": 3479, "y": 516 },
  // Advanced Flight
  "58": { "x": 3812, "y": 298 },
  // Nuclear Power
  "69": { "x": 3812, "y": 384 },
  // Robotics
  "70": { "x": 3812, "y": 460 },
  // Rocketry
  "14": { "x": 3812, "y": 539 },
  // Combined Arms
  "73": { "x": 4228, "y": 287 },
  // Space Flight
  "40": { "x": 4228, "y": 378 },
  // Laser
  "61": { "x": 4479, "y": 120 },
  // Plastics
  "26": { "x": 4479, "y": 196 },
  // Environmentalism
  "77": { "x": 4479, "y": 378 },
  // Superconductors
  "31": { "x": 4680, "y": 381 },
  // Fusion Power
  "74": { "x": 4680, "y": 481 }
  // Stealth
};
let _wikiDocsLoaded = false;
function loadWikiDocs() {
  if (_wikiDocsLoaded) return;
  _wikiDocsLoaded = true;
  fetch("/javascript/wiki-docs.json").then((r2) => r2.json()).then((data) => {
    window.freeciv_wiki_docs = data;
  }).catch(() => {
  });
}
const freeciv_wiki_docs = new Proxy({}, {
  get: (_target, prop) => (window.freeciv_wiki_docs || {})[prop]
});
function byId$3(id) {
  return document.getElementById(id);
}
function setHtml$3(id, html) {
  const el = byId$3(id);
  if (el) el.innerHTML = html;
}
const techs = {};
let tech_canvas_text_font = "18px Arial";
let is_tech_tree_init = false;
let tech_dialog_active = false;
function setTechDialogActive(v2) {
  tech_dialog_active = v2;
}
const tech_xscale = 1.2;
const wikipedia_url = "http://en.wikipedia.org/wiki/";
let tech_canvas = null;
let tech_canvas_ctx = null;
const tech_item_width = 208;
const tech_item_height = 52;
let maxleft = 0;
let clicked_tech_id = null;
const bulbs_output_updater = new EventAggregator(
  update_bulbs_output_info,
  250,
  EventAggregator.DP_NONE,
  250,
  3,
  250
);
function init_tech_screen() {
  if (isSmallScreen()) tech_canvas_text_font = "20px Arial";
  const techEl = byId$3("technologies");
  if (techEl) {
    techEl.style.width = window.innerWidth - 20 + "px";
    techEl.style.height = window.innerHeight - techEl.getBoundingClientRect().top - 15 + "px";
  }
  if (is_tech_tree_init) return;
  tech_canvas = document.getElementById("tech_canvas");
  if (tech_canvas == null) {
    console.log("unable to find tech canvas.");
    return;
  }
  tech_canvas_ctx = tech_canvas.getContext("2d");
  if (tech_canvas_ctx && "imageSmoothingEnabled" in tech_canvas_ctx) {
    tech_canvas_ctx.imageSmoothingEnabled = false;
  }
  let max_width = 0;
  let max_height = 0;
  for (let tech_id in techs) {
    if (!(tech_id + "" in reqtree) || reqtree[tech_id + ""] == null) {
      continue;
    }
    let x2 = reqtree[tech_id + ""]["x"];
    let y2 = reqtree[tech_id + ""]["y"];
    if (x2 > max_width) max_width = x2;
    if (y2 > max_height) max_height = y2;
  }
  tech_canvas.width = (max_width + tech_item_width) * tech_xscale;
  tech_canvas.height = max_height + tech_item_height;
  if (isSmallScreen()) {
    tech_canvas.width = Math.floor(tech_canvas.width * 0.6);
    tech_canvas.height = Math.floor(tech_canvas.height * 0.6);
    if (tech_canvas_ctx) {
      tech_canvas_ctx.scale(0.6, 0.6);
    }
    const trt = byId$3("tech_result_text");
    if (trt) trt.style.fontSize = "85%";
    const tch = byId$3("tech_color_help");
    if (tch) tch.style.fontSize = "65%";
    const tpb = byId$3("tech_progress_box");
    if (tpb) tpb.style.paddingLeft = "10px";
  }
  is_tech_tree_init = true;
  clicked_tech_id = null;
}
function update_tech_tree() {
  if (!tech_canvas_ctx) return;
  const hy = 24;
  const hx = 48 + 160;
  tech_canvas_ctx.clearRect(0, 0, 5824, 726);
  for (let tech_id in techs) {
    const ptech = techs[tech_id];
    if (!(tech_id + "" in reqtree) || reqtree[tech_id + ""] == null) {
      continue;
    }
    const sx = Math.floor(reqtree[tech_id + ""]["x"] * tech_xscale);
    const sy = reqtree[tech_id + ""]["y"];
    for (let i2 = 0; i2 < ptech["research_reqs"].length; i2++) {
      const rid = ptech["research_reqs"][i2]["value"];
      if (rid == 0 || reqtree[rid + ""] == null) continue;
      const dx = Math.floor(reqtree[rid + ""]["x"] * tech_xscale);
      const dy = reqtree[rid + ""]["y"];
      tech_canvas_ctx.strokeStyle = "rgba(70, 70, 70, 0.8)";
      tech_canvas_ctx.lineWidth = 3;
      tech_canvas_ctx.beginPath();
      tech_canvas_ctx.moveTo(sx, sy + hy);
      tech_canvas_ctx.lineTo(dx + hx, dy + hy);
      tech_canvas_ctx.stroke();
    }
  }
  tech_canvas_ctx.lineWidth = 1;
  for (let tech_id in techs) {
    const ptech = techs[tech_id];
    if (!(tech_id + "" in reqtree) || reqtree[tech_id + ""] == null) {
      console.log("tech not found");
      continue;
    }
    const x2 = Math.floor(reqtree[tech_id + ""]["x"] * tech_xscale) + 2;
    const y2 = reqtree[tech_id + ""]["y"] + 2;
    if (playerInventionState(clientPlaying(), ptech["id"]) == TECH_KNOWN$1) {
      const tag = tileset_tech_graphic_tag(ptech);
      tech_canvas_ctx.fillStyle = "rgb(255, 255, 255)";
      tech_canvas_ctx.fillRect(x2 - 2, y2 - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.strokeStyle = "rgb(225, 225, 225)";
      tech_canvas_ctx.strokeRect(x2 - 2, y2 - 2, tech_item_width, tech_item_height);
      mapview_put_tile(tech_canvas_ctx, tag ?? "", x2 + 1, y2);
      tech_canvas_ctx.font = tech_canvas_text_font;
      tech_canvas_ctx.fillStyle = "rgba(0, 0, 0, 1)";
      tech_canvas_ctx.fillText(ptech["name"], x2 + 50, y2 + 15);
      if (x2 > maxleft) maxleft = x2;
    } else if (playerInventionState(clientPlaying(), ptech["id"]) == TECH_PREREQS_KNOWN) {
      let bgcolor = clientPlaying() != null && isTechReqForGoal(ptech["id"], clientPlaying()["tech_goal"]) ? "rgb(131, 170, 101)" : "rgb(91, 130, 61)";
      if (clientPlaying()["researching"] == ptech["id"]) {
        bgcolor = "rgb(161, 200, 131)";
        tech_canvas_ctx.lineWidth = 6;
      }
      const tag = tileset_tech_graphic_tag(ptech);
      tech_canvas_ctx.lineWidth = 4;
      tech_canvas_ctx.fillStyle = bgcolor;
      tech_canvas_ctx.fillRect(x2 - 2, y2 - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.strokeStyle = "rgb(255, 255, 255)";
      tech_canvas_ctx.strokeRect(x2 - 2, y2 - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.lineWidth = 2;
      mapview_put_tile(tech_canvas_ctx, tag ?? "", x2 + 1, y2);
      if (clientPlaying()["researching"] == ptech["id"]) {
        tech_canvas_ctx.fillStyle = "rgb(0, 0, 0)";
        tech_canvas_ctx.font = "Bold " + tech_canvas_text_font;
      } else {
        tech_canvas_ctx.font = tech_canvas_text_font;
        tech_canvas_ctx.fillStyle = "rgb(255, 255, 255)";
      }
      tech_canvas_ctx.fillText(ptech["name"], x2 + 51, y2 + 16);
    } else if (playerInventionState(clientPlaying(), ptech["id"]) == TECH_UNKNOWN) {
      let bgcolor = clientPlaying() != null && isTechReqForGoal(ptech["id"], clientPlaying()["tech_goal"]) ? "rgb(111, 141, 180)" : "rgb(61, 95, 130)";
      if (clientPlaying()["tech_goal"] == ptech["id"]) {
        tech_canvas_ctx.lineWidth = 6;
      }
      const tag = tileset_tech_graphic_tag(ptech);
      tech_canvas_ctx.fillStyle = bgcolor;
      tech_canvas_ctx.fillRect(x2 - 2, y2 - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.strokeStyle = "rgb(255, 255, 255)";
      tech_canvas_ctx.strokeRect(x2 - 2, y2 - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.lineWidth = 2;
      mapview_put_tile(tech_canvas_ctx, tag ?? "", x2 + 1, y2);
      if (clientPlaying()["tech_goal"] == ptech["id"]) {
        tech_canvas_ctx.fillStyle = "rgb(0, 0, 0)";
        tech_canvas_ctx.font = "Bold " + tech_canvas_text_font;
      } else {
        tech_canvas_ctx.fillStyle = "rgb(255, 255, 255)";
        tech_canvas_ctx.font = tech_canvas_text_font;
      }
      tech_canvas_ctx.fillText(ptech["name"], x2 + 51, y2 + 16);
    }
    let tech_things = 0;
    const prunits = get_units_from_tech(Number(tech_id));
    for (let i2 = 0; i2 < prunits.length; i2++) {
      const utype = prunits[i2];
      const tag2 = tileset_unit_type_graphic_tag(utype);
      const sprite = tag2 != null ? window.sprites[tag2] : null;
      if (sprite != null) {
        tech_canvas_ctx.drawImage(sprite, x2 + 50 + tech_things++ * 30, y2 + 23, 28, 24);
      }
    }
    const primprovements = get_improvements_from_tech(Number(tech_id));
    for (let i2 = 0; i2 < primprovements.length; i2++) {
      const pimpr = primprovements[i2];
      const tag3 = tileset_building_graphic_tag(pimpr);
      const sprite = tag3 != null ? window.sprites[tag3] : null;
      if (sprite != null) {
        tech_canvas_ctx.drawImage(sprite, x2 + 50 + tech_things++ * 30, y2 + 23, 28, 24);
      }
    }
  }
}
function update_tech_screen() {
  if (clientIsObserver() || clientPlaying() == null) {
    show_observer_tech_dialog();
    return;
  }
  init_tech_screen();
  update_tech_tree();
  let research_goal_text = "No research target selected.<br>Please select a technology now";
  if (techs[clientPlaying()["researching"]] != null) {
    research_goal_text = "Researching: " + techs[clientPlaying()["researching"]]["name"];
  }
  if (techs[clientPlaying()["tech_goal"]] != null) {
    research_goal_text = research_goal_text + "<br>Research Goal: " + techs[clientPlaying()["tech_goal"]]["name"];
  }
  setHtml$3("tech_goal_box", research_goal_text);
  setHtml$3("tech_progress_text", "Research progress: " + clientPlaying()["bulbs_researched"] + " / " + clientPlaying()["researching_cost"]);
  const pct_progress = 100 * (clientPlaying()["bulbs_researched"] / clientPlaying()["researching_cost"]);
  const progressFg = byId$3("progress_fg");
  if (progressFg) progressFg.style.width = pct_progress + "%";
  if (clicked_tech_id != null) {
    setHtml$3("tech_result_text", "<span id='tech_advance_helptext'>" + get_advances_text(clicked_tech_id) + "</span>");
  } else if (techs[clientPlaying()["researching"]] != null) {
    setHtml$3("tech_result_text", "<span id='tech_advance_helptext'>" + get_advances_text(clientPlaying()["researching"]) + "</span>");
  }
  const techTabItem = byId$3("tech_tab_item");
  if (techTabItem) techTabItem.style.color = "#000000";
  maxleft = maxleft - 280;
  if (maxleft < 0) maxleft = 0;
  if (!tech_dialog_active) {
    setTimeout(scroll_tech_tree, 10);
  }
  tech_dialog_active = true;
}
function get_advances_text(tech_id) {
  const num = (value) => value === null ? "null" : value;
  const tech_span = (name, unit_id, impr_id, title) => `<span ${title ? `title='${title}'` : ""} onclick='show_tech_info_dialog("${name}", ${num(unit_id)}, ${num(impr_id)})'>${name}</span>`;
  const is_valid_and_required = (next_tech_id) => reqtree.hasOwnProperty(next_tech_id) && isTechReqForTech(tech_id, parseInt(next_tech_id));
  const format_list_with_intro = (intro, list) => (list = list.filter(Boolean)).length ? intro + " " + list.join(", ") : "";
  const ptech = techs[tech_id];
  return tech_span(ptech.name, null, null) + " (" + Math.floor(ptech.cost) + ")" + format_list_with_intro(
    " allows",
    [
      format_list_with_intro("building unit", get_units_from_tech(tech_id).map((unit) => tech_span(unit.name, unit.id, null, unit.helptext))),
      format_list_with_intro("building", get_improvements_from_tech(tech_id).map((impr) => tech_span(impr.name, null, impr.id, impr.helptext))),
      format_list_with_intro("researching", Object.keys(techs).filter(is_valid_and_required).map((tid) => techs[tid]).map((tech) => tech_span(tech.name, null, null)))
    ]
  ) + ".";
}
function scroll_tech_tree() {
  const el = byId$3("technologies");
  if (el) el.scrollLeft = maxleft;
}
function send_player_research(tech_id) {
  sendPlayerResearch(tech_id);
  byId$3("tech_dialog")?.remove();
}
function send_player_tech_goal(tech_id) {
  sendPlayerTechGoal(tech_id);
}
function tech_mapview_mouse_click(e2) {
  let rightclick;
  if (!e2) {
    e2 = window.event;
  }
  if (e2.which) {
    rightclick = e2.which == 3;
  } else if (e2.button) {
    rightclick = e2.button == 2;
  } else {
    rightclick = false;
  }
  if (rightclick) {
    const techEl = byId$3("technologies");
    if (techEl) {
      if (mouse_x > window.innerWidth / 2) {
        techEl.scrollLeft += 150;
      } else {
        techEl.scrollLeft -= 150;
      }
    }
    return;
  }
  if (tech_canvas != null) {
    const techEl = byId$3("technologies");
    const rect = techEl.getBoundingClientRect();
    const tech_mouse_x = mouse_x - rect.left + techEl.scrollLeft;
    const tech_mouse_y = mouse_y - rect.top + techEl.scrollTop;
    for (let tech_id in techs) {
      const ptech = techs[tech_id];
      if (!(tech_id + "" in reqtree)) continue;
      let x2 = Math.floor(reqtree[tech_id + ""]["x"] * tech_xscale) + 2;
      let y2 = reqtree[tech_id + ""]["y"] + 2;
      if (isSmallScreen()) {
        x2 = x2 * 0.6;
        y2 = y2 * 0.6;
      }
      if (tech_mouse_x > x2 && tech_mouse_x < x2 + tech_item_width && tech_mouse_y > y2 && tech_mouse_y < y2 + tech_item_height) {
        if (playerInventionState(clientPlaying(), ptech["id"]) == TECH_PREREQS_KNOWN) {
          send_player_research(ptech["id"]);
        } else if (playerInventionState(clientPlaying(), ptech["id"]) == TECH_UNKNOWN) {
          send_player_tech_goal(ptech["id"]);
        }
        clicked_tech_id = ptech["id"];
      }
    }
  }
  update_tech_screen();
}
function get_tech_infobox_html(tech_id) {
  let infobox_html = "";
  const ptech = techs[tech_id];
  const tag = tileset_tech_graphic_tag(ptech);
  if (tag == null) return null;
  const tileset_x = window.tileset[tag][0];
  const tileset_y = window.tileset[tag][1];
  const width = window.tileset[tag][2];
  const height = window.tileset[tag][3];
  const i2 = window.tileset[tag][4];
  const image_src = "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + window.ts;
  if (isSmallScreen()) {
    infobox_html += "<div class='specific_tech' onclick='send_player_research(" + tech_id + ");' title='" + get_advances_text(tech_id).replace(/(<([^>]+)>)/ig, "") + "'>" + ptech["name"] + "</div>";
  } else {
    infobox_html += "<div class='specific_tech' onclick='send_player_research(" + tech_id + ");' title='" + get_advances_text(tech_id).replace(/(<([^>]+)>)/ig, "") + "'><div class='tech_infobox_image' style='background: transparent url(" + image_src + ");background-position:-" + tileset_x + "px -" + tileset_y + "px;  width: " + width + "px;height: " + height + "px;'></div>" + ptech["name"] + "</div>";
  }
  return infobox_html;
}
function queue_tech_gained_dialog(tech_gained_id) {
  if (clientIsObserver() || C_S_RUNNING != clientState()) return;
  show_tech_gained_dialog(tech_gained_id);
}
function show_tech_gained_dialog(tech_gained_id) {
  if (clientIsObserver() || C_S_RUNNING != clientState()) return;
  const tti = byId$3("tech_tab_item");
  if (tti) tti.style.color = "#aa0000";
  const pplayer = clientPlaying();
  const tech = techs[tech_gained_id];
  if (tech == null) return;
  const title = tech["name"] + " discovered!";
  let message = "The " + store.nations[pplayer["nation"]]["adjective"] + " have discovered " + tech["name"] + ".<br>";
  message += "<span id='tech_advance_helptext'>" + get_advances_text(tech_gained_id) + "</span>";
  const tech_choices = [];
  for (let next_tech_id in techs) {
    const ntech = techs[next_tech_id];
    if (!(next_tech_id + "" in reqtree)) continue;
    if (playerInventionState(clientPlaying(), ntech["id"]) == TECH_PREREQS_KNOWN) {
      tech_choices.push(ntech);
    }
  }
  message += "<br>You can now research:<br><div id='tech_gained_choice'>";
  for (let i2 = 0; i2 < tech_choices.length; i2++) {
    const html = get_tech_infobox_html(tech_choices[i2]["id"]);
    if (html) message += html;
  }
  message += "</div>";
  byId$3("tech_dialog")?.remove();
  const dlg = document.createElement("div");
  dlg.id = "tech_dialog";
  dlg.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:10%;left:50%;transform:translateX(-50%);width:" + (isSmallScreen() ? "90%" : "60%") + ";max-height:80vh;overflow-y:auto;color:#fff;";
  const titleEl = document.createElement("h3");
  titleEl.textContent = title;
  titleEl.style.margin = "0 0 8px";
  dlg.appendChild(titleEl);
  const body = document.createElement("div");
  body.innerHTML = message;
  dlg.appendChild(body);
  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = "margin-top:8px;display:flex;gap:8px;";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", function() {
    dlg.remove();
    byId$3("game_text_input")?.blur();
  });
  const treeBtn = document.createElement("button");
  treeBtn.textContent = "Show Technology Tree";
  treeBtn.addEventListener("click", function() {
    setActiveTab("#tabs", 2);
    update_tech_screen();
    dlg.remove();
  });
  btnContainer.appendChild(closeBtn);
  btnContainer.appendChild(treeBtn);
  dlg.appendChild(btnContainer);
  byId$3("game_page")?.appendChild(dlg);
  byId$3("game_text_input")?.blur();
}
function show_tech_info_dialog(tech_name, unit_type_id, improvement_id) {
  loadWikiDocs();
  const tti = byId$3("tech_tab_item");
  if (tti) tti.style.color = "#aa0000";
  let message = "";
  if (unit_type_id != null) {
    const punit_type = store.unitTypes[unit_type_id];
    message += "<b>Unit info</b>: " + punit_type["helptext"] + "<br><br>Cost: " + punit_type["build_cost"] + "<br>Attack: " + punit_type["attack_strength"] + "<br>Defense: " + punit_type["defense_strength"] + "<br>Firepower: " + punit_type["firepower"] + "<br>Hitpoints: " + punit_type["hp"] + "<br>Moves: " + move_points_text(punit_type["move_rate"]) + "<br>Vision: " + punit_type["vision_radius_sq"] + "<br><br>";
  }
  if (improvement_id != null) message += "<b>Improvement info</b>: " + store.improvements[improvement_id]["helptext"] + "<br><br>";
  if (freeciv_wiki_docs[tech_name] != null) {
    message += "<b>Wikipedia on <a href='" + wikipedia_url + freeciv_wiki_docs[tech_name]["title"] + "' target='_new' style='color: black;'>" + freeciv_wiki_docs[tech_name]["title"] + "</a>:</b><br>";
    if (freeciv_wiki_docs[tech_name]["image"] != null) {
      message += "<img id='wiki_image' src='/images/wiki/" + freeciv_wiki_docs[tech_name]["image"] + "'><br>";
    }
    message += freeciv_wiki_docs[tech_name]["summary"];
  }
  byId$3("wiki_dialog")?.remove();
  const dlg = document.createElement("div");
  dlg.id = "wiki_dialog";
  dlg.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:10%;left:50%;transform:translateX(-50%);width:" + (isSmallScreen() ? "95%" : "70%") + ";height:" + (window.innerHeight - 60) + "px;overflow-y:auto;color:#fff;";
  const titleEl = document.createElement("h3");
  titleEl.textContent = tech_name;
  titleEl.style.margin = "0 0 8px";
  dlg.appendChild(titleEl);
  const body = document.createElement("div");
  body.innerHTML = message;
  dlg.appendChild(body);
  const okBtn = document.createElement("button");
  okBtn.textContent = "Ok";
  okBtn.style.marginTop = "8px";
  okBtn.addEventListener("click", function() {
    dlg.remove();
  });
  dlg.appendChild(okBtn);
  byId$3("game_page")?.appendChild(dlg);
  byId$3("game_text_input")?.blur();
}
function update_tech_dialog_cursor() {
  if (!tech_canvas) return;
  tech_canvas.style.cursor = "default";
  const techEl = byId$3("technologies");
  const rect = techEl.getBoundingClientRect();
  const tech_mouse_x = mouse_x - rect.left + techEl.scrollLeft;
  const tech_mouse_y = mouse_y - rect.top + techEl.scrollTop;
  for (let tech_id in techs) {
    const ptech = techs[tech_id];
    if (!(tech_id + "" in reqtree)) continue;
    let x2 = Math.floor(reqtree[tech_id + ""]["x"] * tech_xscale) + 2;
    let y2 = reqtree[tech_id + ""]["y"] + 2;
    if (isSmallScreen()) {
      x2 = x2 * 0.6;
      y2 = y2 * 0.6;
    }
    if (tech_mouse_x > x2 && tech_mouse_x < x2 + tech_item_width && tech_mouse_y > y2 && tech_mouse_y < y2 + tech_item_height) {
      if (playerInventionState(clientPlaying(), ptech["id"]) == TECH_PREREQS_KNOWN) {
        tech_canvas.style.cursor = "pointer";
      } else if (playerInventionState(clientPlaying(), ptech["id"]) == TECH_UNKNOWN) {
        tech_canvas.style.cursor = "pointer";
      } else {
        tech_canvas.style.cursor = "not-allowed";
      }
      setHtml$3("tech_result_text", "<span id='tech_advance_helptext'>" + get_advances_text(ptech["id"]) + "</span>");
    }
  }
}
function show_observer_tech_dialog() {
  const techInfoBox = document.getElementById("tech_info_box");
  const techCanvas = document.getElementById("tech_canvas");
  const technologies = document.getElementById("technologies");
  if (techInfoBox) techInfoBox.style.display = "none";
  if (techCanvas) techCanvas.style.display = "none";
  let msg = '<h2 style="margin:0 0 12px 0;color:#e6edf3">Research Progress</h2>';
  msg += '<div style="display:flex;flex-direction:column;gap:8px">';
  for (let player_id in store.players) {
    const pplayer = store.players[player_id];
    const pname = pplayer["name"];
    const pr = research_get(pplayer);
    if (pr == null) continue;
    const researching = pr["researching"];
    const techData = store.techs[researching];
    const bulbs = pr["bulbs_researched"] ?? 0;
    const cost = pr["researching_cost"] ?? 1;
    const pct = Math.min(100, Math.round(bulbs / cost * 100));
    const nation = store.nations[pplayer["nation"]];
    const color = nation?.["color"] ?? "#888";
    msg += '<div style="background:rgba(30,35,45,0.8);border:1px solid #30363d;border-radius:6px;padding:8px 12px">';
    msg += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">';
    msg += '<span style="font-weight:600;color:' + color + '">' + pname + "</span>";
    if (techData != null) {
      msg += '<span style="color:#8b949e;font-size:12px">' + techData["name"] + " (" + bulbs + "/" + cost + ")</span>";
    } else {
      msg += '<span style="color:#8b949e;font-size:12px">None</span>';
    }
    msg += "</div>";
    msg += '<div style="background:#21262d;border-radius:3px;height:8px;overflow:hidden">';
    msg += '<div style="background:' + color + ";height:100%;width:" + pct + '%;border-radius:3px;transition:width 0.3s"></div>';
    msg += "</div>";
    msg += "</div>";
  }
  msg += "</div>";
  if (technologies) {
    technologies.innerHTML = msg;
    technologies.style.color = "#e6edf3";
  }
}
function update_bulbs_output_info() {
  const cbo = getCurrentBulbsOutput();
  const el = document.getElementById("bulbs_output");
  if (el) el.innerHTML = getCurrentBulbsOutputText(cbo);
  update_net_bulbs(cbo.self_bulbs - cbo.self_upkeep);
}
function mouse_moved_cb(e2) {
  if (mapview_slide != null && mapview_slide["active"]) return;
  setMouseX(0);
  setMouseY(0);
  if (!e2) {
    e2 = window.event;
  }
  if (e2.pageX || e2.pageY) {
    setMouseX(e2.pageX);
    setMouseY(e2.pageY);
  } else {
    if (e2.clientX || e2.clientY) {
      setMouseX(e2.clientX);
      setMouseY(e2.clientY);
    }
  }
  const canvasEl = document.getElementById("canvas");
  if (active_city == null && window.mapview_canvas != null && canvasEl) {
    const canvasRect = canvasEl.getBoundingClientRect();
    setMouseX(mouse_x - canvasRect.left);
    setMouseY(mouse_y - canvasRect.top);
    if (mapview_mouse_movement && !goto_active) {
      const diff_x = (touch_start_x - mouse_x) * 2;
      const diff_y = (touch_start_y - mouse_y) * 2;
      mapview$1["gui_x0"] += diff_x;
      mapview$1["gui_y0"] += diff_y;
      mark_all_dirty();
      redraw_overview();
      setTouchStart(mouse_x, mouse_y);
      update_mouse_cursor();
    }
  } else {
    const cityCanvasEl = document.getElementById("city_canvas");
    if (active_city != null && window.city_canvas != null && cityCanvasEl) {
      const cityCanvasRect = cityCanvasEl.getBoundingClientRect();
      setMouseX(mouse_x - cityCanvasRect.left);
      setMouseY(mouse_y - cityCanvasRect.top);
    }
  }
  if (clientPlaying() == null) return;
  if (C_S_RUNNING == clientState()) {
    update_mouse_cursor();
  }
  if (map_select_check && Math.abs(mouse_x - map_select_x) > 45 && Math.abs(mouse_y - map_select_y) > 45 && (/* @__PURE__ */ new Date()).getTime() - map_select_check_started > 200) {
    setMapSelectActive(true);
  }
}
function update_mouse_cursor() {
  if (tech_dialog_active && !isTouchDevice()) {
    update_tech_dialog_cursor();
    return;
  }
  const ptile = canvas_pos_to_tile(mouse_x, mouse_y);
  if (ptile == null) return;
  const punit = find_visible_unit(ptile);
  const pcity = tileCity(ptile);
  const canvasDiv = document.getElementById("canvas_div");
  if (!canvasDiv) return;
  if (mapview_mouse_movement && !goto_active) {
    canvasDiv.style.cursor = "move";
  } else if (goto_active && current_goto_turns != null) {
    canvasDiv.style.cursor = "crosshair";
  } else if (goto_active && current_goto_turns == null) {
    canvasDiv.style.cursor = "not-allowed";
  } else if (pcity != null && clientPlaying() != null && cityOwnerPlayerId(pcity) == clientPlaying().playerno) {
    canvasDiv.style.cursor = "pointer";
  } else if (punit != null && clientPlaying() != null && punit["owner"] == clientPlaying().playerno) {
    canvasDiv.style.cursor = "pointer";
  } else {
    canvasDiv.style.cursor = "default";
  }
}
function set_mouse_touch_started_on_unit(ptile) {
  if (ptile == null) return;
  const sunit = find_visible_unit(ptile);
  if (sunit != null && clientPlaying() != null && sunit["owner"] == clientPlaying().playerno) {
    setMouseTouchStartedOnUnit(true);
  } else {
    setMouseTouchStartedOnUnit(false);
  }
}
function check_mouse_drag_unit(ptile) {
  if (ptile == null || !mouse_touch_started_on_unit) return;
  const sunit = find_visible_unit(ptile);
  if (sunit != null) {
    if (clientPlaying() != null && sunit["owner"] == clientPlaying().playerno) {
      set_unit_focus(sunit);
      activate_goto();
    }
  }
  const ptile_units = tile_units(ptile) || [];
  if (ptile_units.length > 1) {
    update_active_units_dialog();
  }
}
const map_pos_to_tile$1 = mapPosToTile;
let touch_start_x;
let touch_start_y;
let map_select_setting_enabled = true;
let map_select_check = false;
let map_select_check_started = 0;
let map_select_active = false;
let map_select_x;
let map_select_y;
function setMapSelectActive(v2) {
  map_select_active = v2;
}
function setMapSelectCheck(v2) {
  map_select_check = v2;
}
function setTouchStart(x2, y2) {
  touch_start_x = x2;
  touch_start_y = y2;
}
function mapctrl_init_2d() {
  const canvas = document.getElementById("canvas");
  canvas.addEventListener("mouseup", mapview_mouse_click);
  canvas.addEventListener("mousedown", mapview_mouse_down);
  window.addEventListener("mousemove", mouse_moved_cb);
  if (isTouchDevice()) {
    canvas.addEventListener("touchstart", mapview_touch_start);
    canvas.addEventListener("touchend", mapview_touch_end);
    canvas.addEventListener("touchmove", mapview_touch_move);
  }
}
function mapview_mouse_click(e2) {
  let rightclick = false;
  let middleclick = false;
  if (!e2) e2 = window.event;
  if (e2.which) {
    rightclick = e2.which == 3;
    middleclick = e2.which == 2;
  } else if (e2.button) {
    rightclick = e2.button == 2;
    middleclick = e2.button == 1 || e2.button == 4;
  }
  if (rightclick) {
    if (!map_select_active || !map_select_setting_enabled) {
      setContextMenuActive(true);
      window.context_menu_active = true;
      recenter_button_pressed(mouse_x, mouse_y);
    } else {
      setContextMenuActive(false);
      window.context_menu_active = false;
      map_select_units(mouse_x, mouse_y);
    }
    map_select_active = false;
    map_select_check = false;
  } else if (!middleclick) {
    action_button_pressed(mouse_x, mouse_y, SELECT_POPUP);
    setMapviewMouseMovement(false);
    window.mapview_mouse_movement = false;
    update_mouse_cursor();
  }
  setKeyboardInput(true);
  window.keyboard_input = true;
}
function mapview_mouse_down(e2) {
  let rightclick = false;
  let middleclick = false;
  if (!e2) e2 = window.event;
  if (e2.which) {
    rightclick = e2.which == 3;
    middleclick = e2.which == 2;
  } else if (e2.button) {
    rightclick = e2.button == 2;
    middleclick = e2.button == 1 || e2.button == 4;
  }
  if (!rightclick && !middleclick) {
    if (goto_active) return;
    set_mouse_touch_started_on_unit(canvas_pos_to_tile(mouse_x, mouse_y));
    check_mouse_drag_unit(canvas_pos_to_tile(mouse_x, mouse_y));
    setMapviewMouseMovement(true);
    touch_start_x = mouse_x;
    touch_start_y = mouse_y;
  } else if (middleclick || e2["altKey"]) {
    popit();
    return false;
  } else if (rightclick && !map_select_active && isRightMouseSelectionSupported()) {
    map_select_check = true;
    map_select_x = mouse_x;
    map_select_y = mouse_y;
    map_select_check_started = (/* @__PURE__ */ new Date()).getTime();
    setContextMenuActive(false);
    window.context_menu_active = false;
  }
}
function mapview_touch_start(e2) {
  e2.preventDefault();
  const canvasEl = document.getElementById("canvas");
  const rect = canvasEl.getBoundingClientRect();
  touch_start_x = e2.touches[0].pageX - (rect.left + window.scrollX);
  touch_start_y = e2.touches[0].pageY - (rect.top + window.scrollY);
  const ptile = canvas_pos_to_tile(touch_start_x, touch_start_y);
  set_mouse_touch_started_on_unit(ptile);
}
function mapview_touch_end(e2) {
  action_button_pressed(touch_start_x, touch_start_y, SELECT_POPUP);
}
function mapview_touch_move(e2) {
  const canvasEl = document.getElementById("canvas");
  const rect = canvasEl.getBoundingClientRect();
  setMouseX(e2.touches[0].pageX - (rect.left + window.scrollX));
  setMouseY(e2.touches[0].pageY - (rect.top + window.scrollY));
  const diff_x = (touch_start_x - mouse_x) * 2;
  const diff_y = (touch_start_y - mouse_y) * 2;
  touch_start_x = mouse_x;
  touch_start_y = mouse_y;
  if (!goto_active) {
    check_mouse_drag_unit(canvas_pos_to_tile(mouse_x, mouse_y));
    mapview$1["gui_x0"] = (mapview$1["gui_x0"] ?? 0) + diff_x;
    mapview$1["gui_y0"] = (mapview$1["gui_y0"] ?? 0) + diff_y;
    mark_all_dirty();
  }
  if (clientPlaying() == null) return;
  if (goto_active && current_focus$1.length > 0) {
    const ptile = canvas_pos_to_tile(mouse_x, mouse_y);
    if (ptile != null) {
      for (let i2 = 0; i2 < current_focus$1.length; i2++) {
        if (i2 >= 20) return;
        if (goto_request_map[current_focus$1[i2]["id"] + "," + ptile["x"] + "," + ptile["y"]] == null) {
          request_goto_path(current_focus$1[i2]["id"], ptile["x"], ptile["y"]);
        }
      }
    }
  }
}
function action_button_pressed(canvas_x, canvas_y, qtype) {
  const ptile = canvas_pos_to_tile(canvas_x, canvas_y);
  if (canClientChangeView() && ptile != null) {
    do_map_click(ptile, qtype, true);
  }
}
function map_select_units(canvas_x, canvas_y) {
  const selected_tiles = {};
  const selected_units = [];
  if (clientIsObserver()) return;
  const start_x = map_select_x < canvas_x ? map_select_x : canvas_x;
  const start_y = map_select_y < canvas_y ? map_select_y : canvas_y;
  const end_x = map_select_x < canvas_x ? canvas_x : map_select_x;
  const end_y = map_select_y < canvas_y ? canvas_y : map_select_y;
  for (let x2 = start_x; x2 < end_x; x2 += 15) {
    for (let y2 = start_y; y2 < end_y; y2 += 15) {
      const ptile = canvas_pos_to_tile(x2, y2);
      if (ptile != null) {
        selected_tiles[ptile["tile"]] = ptile;
      }
    }
  }
  for (const tile_id in selected_tiles) {
    const ptile = selected_tiles[tile_id];
    const cunits = tile_units(ptile);
    if (cunits == null) continue;
    for (let i2 = 0; i2 < cunits.length; i2++) {
      const aunit = cunits[i2];
      if (aunit["owner"] == clientPlaying().playerno) {
        selected_units.push(aunit);
      }
    }
  }
  setCurrentFocus(selected_units);
  window.current_focus = selected_units;
  action_selection_next_in_focus(IDENTITY_NUMBER_ZERO);
  update_active_units_dialog();
}
function recenter_button_pressed(canvas_x, canvas_y) {
  const map_scroll_border = 8;
  const big_map_size = 24;
  let ptile = canvas_pos_to_tile(canvas_x, canvas_y);
  const orig_tile = ptile;
  if (ptile != null && ptile["y"] > store.mapInfo["ysize"] - map_scroll_border && store.mapInfo["xsize"] > big_map_size && store.mapInfo["ysize"] > big_map_size) {
    ptile = map_pos_to_tile$1(ptile["x"], store.mapInfo["ysize"] - map_scroll_border);
  }
  if (ptile != null && ptile["y"] < map_scroll_border && store.mapInfo["xsize"] > big_map_size && store.mapInfo["ysize"] > big_map_size) {
    ptile = map_pos_to_tile$1(ptile["x"], map_scroll_border);
  }
  if (canClientChangeView() && ptile != null && orig_tile != null) {
    const sunit = find_visible_unit(orig_tile);
    if (!clientIsObserver() && sunit != null && sunit["owner"] == clientPlaying().playerno) {
      if (current_focus$1.length <= 1) set_unit_focus(sunit);
      const canvasEl = document.getElementById("canvas");
      canvasEl.contextMenu?.(true);
      canvasEl.dispatchEvent(new Event("contextmenu"));
    } else {
      const canvasEl = document.getElementById("canvas");
      canvasEl.contextMenu?.(false);
      enable_mapview_slide(ptile);
      center_tile_mapcanvas(ptile);
    }
  }
}
function handle_web_info_text_message(packet) {
  let message = decodeURIComponent(packet["message"]);
  const lines = message.split("\n");
  const matcher = {
    "Terri": /^(Territory of )([^(]*)(\s+\([^,]*)(.*)/,
    "City:": /^(City:[^|]*\|\s+)([^(]*)(\s+\([^,]*)(.*)/,
    "Unit:": /^(Unit:[^|]*\|\s+)([^(]*)(\s+\([^,]*)(.*)/
  };
  for (let i2 = 0; i2 < lines.length; i2++) {
    const re = matcher[lines[i2].substr(0, 5)];
    if (re !== void 0) {
      let pplayer = null;
      const split_txt = lines[i2].match(re);
      if (split_txt != null && split_txt.length > 4) {
        pplayer = player_by_full_username(split_txt[2]);
      }
      if (pplayer != null && split_txt != null && (clientPlaying() == null || pplayer != clientPlaying())) {
        lines[i2] = split_txt[1] + "<a href='#' onclick='javascript:nation_table_select_player(" + pplayer["playerno"] + ");' style='color: black;'>" + split_txt[2] + "</a>" + split_txt[3] + ", " + get_player_connection_status(pplayer) + split_txt[4];
      }
    }
  }
  message = lines.join("<br>\n");
  showDialogMessage("Tile Information", message);
}
function handle_processing_started(_packet) {
  store.frozen = true;
}
function handle_processing_finished(_packet) {
  store.frozen = false;
}
function handle_investigate_started(_packet) {
}
function handle_investigate_finished(_packet) {
}
function handle_freeze_client(_packet) {
  store.frozen = true;
}
function handle_thaw_client(_packet) {
  store.frozen = false;
}
let BitVector$1 = class BitVector2 {
  data;
  constructor(raw) {
    this.data = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  }
  isSet(bit) {
    return (this.data[bit >>> 3] & 1 << (bit & 7)) !== 0;
  }
  set(bit) {
    this.data[bit >>> 3] |= 1 << (bit & 7);
  }
  unset(bit) {
    this.data[bit >>> 3] &= ~(1 << (bit & 7));
  }
  toBitSet() {
    const out = [];
    const len = this.data.length << 3;
    for (let i2 = 0; i2 < len; i2++) {
      if (this.isSet(i2)) out.push(i2);
    }
    return out;
  }
  toString() {
    let out = "";
    const len = this.data.length << 3;
    for (let i2 = 0; i2 < len; i2++) {
      out += this.isSet(i2) ? "1" : "0";
    }
    return out;
  }
};
let terrain_control = {};
let roads = [];
let bases = [];
function handle_ruleset_terrain(packet) {
  if (packet["name"] === "Lake") packet["graphic_str"] = packet["graphic_alt"];
  if (packet["name"] === "Glacier") packet["graphic_str"] = "tundra";
  store.terrains[packet["id"]] = packet;
}
function handle_ruleset_resource(packet) {
  window.resources[packet["id"]] = packet;
}
function handle_ruleset_game(packet) {
  window.game_rules = packet;
}
function handle_ruleset_specialist(packet) {
  window.specialists[packet["id"]] = packet;
}
function handle_ruleset_nation_groups(packet) {
  window.nation_groups = packet["groups"];
}
function handle_ruleset_nation(packet) {
  store.nations[packet["id"]] = packet;
}
function handle_ruleset_city(packet) {
  window.city_rules[packet["style_id"]] = packet;
}
function handle_ruleset_government(packet) {
  store.governments[packet["id"]] = packet;
}
function handle_ruleset_summary(packet) {
  store.rulesSummary = packet["text"];
}
function handle_ruleset_description_part(packet) {
  if (store.rulesDescription == null) {
    store.rulesDescription = packet["text"];
  } else {
    store.rulesDescription += packet["text"];
  }
}
function handle_ruleset_action(packet) {
  window.actions[packet["id"]] = packet;
  packet["enablers"] = [];
}
function handle_ruleset_goods(packet) {
  window.goods[packet["id"]] = packet;
}
function handle_ruleset_clause(packet) {
  window.clause_infos[packet["type"]] = packet;
}
function handle_ruleset_effect(packet) {
  if (window.effects[packet["effect_type"]] == null) {
    window.effects[packet["effect_type"]] = [];
  }
  window.effects[packet["effect_type"]].push(packet);
}
function handle_ruleset_unit(packet) {
  if (packet["name"] != null && packet["name"].indexOf("?unit:") === 0) {
    packet["name"] = packet["name"].replace("?unit:", "");
  }
  packet["flags"] = new BitVector$1(packet["flags"]);
  store.unitTypes[packet["id"]] = packet;
}
function handle_web_ruleset_unit_addition(packet) {
  if (packet["utype_actions"] != null) {
    packet["utype_actions"] = new BitVector$1(packet["utype_actions"]);
  }
  if (store.unitTypes[packet["id"]] != null) {
    Object.assign(store.unitTypes[packet["id"]], packet);
  }
}
function recreate_old_tech_req(packet) {
  packet["req"] = [];
  if (packet["research_reqs"]) {
    for (let i2 = 0; i2 < packet["research_reqs"].length; i2++) {
      const requirement = packet["research_reqs"][i2];
      if (requirement.kind === VUT_ADVANCE && requirement.range === REQ_RANGE_PLAYER && requirement.present) {
        packet["req"].push(requirement.value);
      }
    }
  }
  while (packet["req"].length < 2) {
    packet["req"].push(A_NONE);
  }
}
function handle_ruleset_tech(packet) {
  if (packet["name"] != null && packet["name"].indexOf("?tech:") === 0) {
    packet["name"] = packet["name"].replace("?tech:", "");
  }
  store.techs[packet["id"]] = packet;
  recreate_old_tech_req(packet);
}
function handle_ruleset_tech_class(_packet) {
}
function handle_ruleset_tech_flag(_packet) {
}
function handle_ruleset_terrain_control(packet) {
  terrain_control = packet;
  window.terrain_control = packet;
  window.SINGLE_MOVE = packet["move_fragments"];
}
function handle_ruleset_building(packet) {
  store.improvements[packet["id"]] = packet;
}
function handle_ruleset_unit_class(packet) {
  packet["flags"] = new BitVector$1(packet["flags"]);
  window.unit_classes[packet["id"]] = packet;
}
function handle_ruleset_disaster(_packet) {
}
function handle_ruleset_trade(_packet) {
}
function handle_rulesets_ready(_packet) {
}
function handle_ruleset_choices(_packet) {
}
function handle_game_load(_packet) {
}
function handle_ruleset_unit_flag(_packet) {
}
function handle_ruleset_unit_class_flag(_packet) {
}
function handle_ruleset_unit_bonus(_packet) {
}
function handle_ruleset_terrain_flag(_packet) {
}
function handle_ruleset_impr_flag(_packet) {
}
function handle_ruleset_government_ruler_title(_packet) {
}
function handle_ruleset_base(packet) {
  if (!store.rulesControl) return;
  for (let i2 = 0; i2 < store.rulesControl["num_extra_types"]; i2++) {
    if (isExtraCausedBy(store.extras[i2], EC_BASE) && store.extras[i2]["base"] == null) {
      store.extras[i2]["base"] = packet;
      store.extras[store.extras[i2]["rule_name"]]["base"] = packet;
      return;
    }
  }
  console.log("Didn't find Extra to put Base on");
  console.log(packet);
}
function handle_ruleset_road(packet) {
  if (!store.rulesControl) return;
  for (let i2 = 0; i2 < store.rulesControl["num_extra_types"]; i2++) {
    if (isExtraCausedBy(store.extras[i2], EC_ROAD) && store.extras[i2]["road"] == null) {
      store.extras[i2]["road"] = packet;
      store.extras[store.extras[i2]["rule_name"]]["road"] = packet;
      return;
    }
  }
  console.log("Didn't find Extra to put Road on");
  console.log(packet);
}
function handle_ruleset_action_enabler(packet) {
  const paction = window.actions[packet.enabled_action];
  if (paction === void 0) {
    console.log("Unknown action " + packet.action + " for enabler ");
    console.log(packet);
    return;
  }
  paction.enablers.push(packet);
}
function handle_ruleset_extra(packet) {
  packet["causes"] = new BitVector$1(packet["causes"]);
  packet["rmcauses"] = new BitVector$1(packet["rmcauses"]);
  packet["name"] = stringUnqualify(packet["name"]);
  store.extras[packet["id"]] = packet;
  store.extras[packet["rule_name"]] = packet;
  if (isExtraCausedBy(packet, EC_ROAD) && packet["buildable"]) {
    roads.push(packet);
  }
  if (isExtraCausedBy(packet, EC_BASE) && packet["buildable"]) {
    bases.push(packet);
  }
  if (packet["rule_name"] === "Railroad") window["EXTRA_RAIL"] = packet["id"];
  else if (packet["rule_name"] === "Oil Well") window["EXTRA_OIL_WELL"] = packet["id"];
  else window["EXTRA_" + packet["rule_name"].toUpperCase()] = packet["id"];
}
function handle_ruleset_counter(_packet) {
}
function handle_ruleset_extra_flag(_packet) {
}
function handle_ruleset_nation_sets(_packet) {
}
function handle_ruleset_style(_packet) {
}
function handle_nation_availability(_packet) {
}
function handle_ruleset_music(_packet) {
}
function handle_ruleset_multiplier(_packet) {
}
function handle_ruleset_action_auto(_packet) {
}
function handle_ruleset_achievement(_packet) {
}
function handle_achievement_info(_packet) {
}
function handle_team_name_info(_packet) {
}
function handle_popup_image(_packet) {
}
function handle_worker_task(_packet) {
}
function handle_play_music(_packet) {
}
function handle_ruleset_control(packet) {
  store.rulesControl = packet;
  setClientState(C_S_PREPARING);
  window.effects = {};
  store.rulesSummary = null;
  store.rulesDescription = null;
  window.game_rules = null;
  window.nation_groups = [];
  store.nations = {};
  window.specialists = {};
  store.techs = {};
  store.governments = {};
  terrain_control = {};
  window.terrain_control = {};
  window.SINGLE_MOVE = void 0;
  store.unitTypes = {};
  window.unit_classes = {};
  window.city_rules = {};
  store.terrains = {};
  window.resources = {};
  window.goods = {};
  window.actions = {};
  improvements_init();
  for (const extra in store.extras) {
    const ename = store.extras[extra]["rule_name"];
    if (ename === "Railroad") delete window["EXTRA_RAIL"];
    else if (ename === "Oil Well") delete window["EXTRA_OIL_WELL"];
    else delete window["EXTRA_" + ename.toUpperCase()];
  }
  store.extras = {};
  roads = [];
  bases = [];
  window.clause_infos = {};
}
function handle_game_info(packet) {
  store.gameInfo = packet;
  if (packet.turn > 0 && typeof clientState === "function" && clientState() !== C_S_RUNNING) {
    setTimeout(() => {
      if (clientState() !== C_S_RUNNING) {
        store.observing = true;
        setClientState(C_S_RUNNING);
      }
    }, 2e3);
  }
}
function handle_calendar_info(packet) {
  store.calendarInfo = packet;
}
function handle_spaceship_info(_packet) {
}
function handle_new_year(packet) {
  if (!store.gameInfo) return;
  store.gameInfo["year"] = packet["year"];
  store.gameInfo["fragments"] = packet["fragments"];
  store.gameInfo["turn"] = packet["turn"];
}
function handle_timeout_info(packet) {
  window.last_turn_change_time = Math.ceil(packet["last_turn_change_time"]);
  window.seconds_to_phasedone = Math.floor(packet["seconds_to_phasedone"]);
  window.seconds_to_phasedone_sync = (/* @__PURE__ */ new Date()).getTime();
}
function handle_trade_route_info(packet) {
  if (city_trade_routes[packet["city"]] == null) {
    city_trade_routes[packet["city"]] = {};
  }
  city_trade_routes[packet["city"]][packet["index"]] = packet;
}
function handle_endgame_player(packet) {
  window.endgame_player_info.push(packet);
}
function handle_unknown_research(packet) {
  delete research_data[packet["id"]];
}
function handle_end_phase(_packet) {
  chatbox_clip_messages();
}
function handle_start_phase(_packet) {
  setClientState(C_S_RUNNING);
  setPhaseStart();
  window.saved_this_turn = false;
}
function handle_endgame_report(_packet) {
  setClientState(C_S_OVER);
}
function handle_scenario_info(packet) {
  window.scenario_info = packet;
}
function handle_scenario_description(packet) {
  window.scenario_info["description"] = packet["description"];
  const { update_game_info_pregame } = require("../../core/pregame");
  update_game_info_pregame();
}
function handle_research_info(packet) {
  let old_inventions = null;
  if (research_data[packet["id"]] != null) {
    old_inventions = research_data[packet["id"]]["inventions"];
  }
  research_data[packet["id"]] = packet;
  if (store.gameInfo?.["team_pooled_research"]) {
    for (const player_id in store.players) {
      const pplayer = store.players[player_id];
      if (pplayer["team"] === packet["id"]) {
        Object.assign(pplayer, packet);
        delete pplayer["id"];
      }
    }
  } else {
    const pplayer = store.players[packet["id"]];
    Object.assign(pplayer, packet);
    delete pplayer["id"];
  }
  if (!clientIsObserver() && old_inventions != null && clientPlaying() != null && clientPlaying()["playerno"] === packet["id"]) {
    for (let i2 = 0; i2 < packet["inventions"].length; i2++) {
      if (packet["inventions"][i2] !== old_inventions[i2] && packet["inventions"][i2] === TECH_KNOWN$1) {
        queue_tech_gained_dialog(i2);
        break;
      }
    }
  }
  if (is_tech_tree_init && tech_dialog_active) update_tech_screen();
  bulbs_output_updater.update();
}
function handle_begin_turn(_packet) {
  if (typeof mark_all_dirty === "function") mark_all_dirty();
  if (!store.observing) {
    const btn = document.getElementById("turn_done_button");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Turn Done";
    }
  }
  setWaitingUnitsList([]);
  update_unit_focus();
  update_active_units_dialog();
  update_game_status_panel();
  const funits = get_units_in_focus();
  if (funits != null && funits.length === 0) {
    auto_center_on_focus_unit();
  }
  if (is_tech_tree_init && tech_dialog_active) update_tech_screen();
}
function handle_end_turn(_packet) {
  const { reset_unit_anim_list } = require("../../data/unit");
  reset_unit_anim_list();
  if (!store.observing) {
    const btn = document.getElementById("turn_done_button");
    if (btn) btn.disabled = true;
  }
}
const _$$1 = window.$;
const CLAUSE_ADVANCE = 0;
const CLAUSE_GOLD = 1;
const CLAUSE_MAP = 2;
const CLAUSE_SEAMAP = 3;
const CLAUSE_CITY = 4;
const CLAUSE_CEASEFIRE = 5;
const CLAUSE_PEACE = 6;
const CLAUSE_ALLIANCE = 7;
const CLAUSE_VISION = 8;
const CLAUSE_EMBASSY = 9;
const CLAUSE_SHARED_TILES = 10;
let clause_infos = {};
let diplomacy_clause_map = {};
function show_diplomacy_dialog(counterpart) {
  const pplayer = store.players[counterpart];
  create_diplomacy_dialog(pplayer, window.Handlebars.templates["diplomacy_meeting"]);
}
function accept_treaty_req(counterpart_id) {
  if (clientIsObserver()) return;
  const packet = { "pid": packet_diplomacy_accept_treaty_req, "counterpart": counterpart_id };
  send_request(JSON.stringify(packet));
}
function accept_treaty(counterpart, I_accepted, other_accepted) {
  if (I_accepted === true && other_accepted === true) {
    diplomacy_clause_map[counterpart] = [];
    cleanup_diplomacy_dialog(counterpart);
  } else {
    const agree_sprite = get_treaty_agree_thumb_up();
    const disagree_sprite = get_treaty_disagree_thumb_down();
    const agree_html = "<div style='float:left; background: transparent url(" + agree_sprite["image-src"] + "); background-position:-" + agree_sprite["tileset-x"] + "px -" + agree_sprite["tileset-y"] + "px;  width: " + agree_sprite["width"] + "px;height: " + agree_sprite["height"] + "px; margin: 5px; '></div>";
    const disagree_html = "<div style='float:left; background: transparent url(" + disagree_sprite["image-src"] + "); background-position:-" + disagree_sprite["tileset-x"] + "px -" + disagree_sprite["tileset-y"] + "px;  width: " + disagree_sprite["width"] + "px;height: " + disagree_sprite["height"] + "px; margin: 5px; '></div>";
    const selfEl = document.getElementById("agree_self_" + counterpart);
    if (selfEl) selfEl.innerHTML = I_accepted ? agree_html : disagree_html;
    const otherEl = document.getElementById("agree_counterpart_" + counterpart);
    if (otherEl) otherEl.innerHTML = other_accepted ? agree_html : disagree_html;
  }
}
function cancel_meeting_req(counterpart_id) {
  const packet = { "pid": packet_diplomacy_cancel_meeting_req, "counterpart": counterpart_id };
  send_request(JSON.stringify(packet));
}
function create_clause_req(counterpart_id, giver, type, value) {
  if (type === CLAUSE_CEASEFIRE || type === CLAUSE_PEACE || type === CLAUSE_ALLIANCE) {
    const clauses = diplomacy_clause_map[counterpart_id];
    for (let i2 = 0; i2 < clauses.length; i2++) {
      const clause = clauses[i2];
      if (clause["type"] === CLAUSE_CEASEFIRE || clause["type"] === CLAUSE_PEACE || clause["type"] === CLAUSE_ALLIANCE) {
        remove_clause_req(counterpart_id, i2);
      }
    }
  }
  const packet = {
    "pid": packet_diplomacy_create_clause_req,
    "counterpart": counterpart_id,
    "giver": giver,
    "type": type,
    "value": value
  };
  send_request(JSON.stringify(packet));
}
function cancel_meeting(counterpart) {
  diplomacy_clause_map[counterpart] = [];
  cleanup_diplomacy_dialog(counterpart);
}
function cleanup_diplomacy_dialog(counterpart_id) {
  document.getElementById("diplomacy_dialog_" + counterpart_id)?.remove();
}
function discard_diplomacy_dialogs() {
  for (const counterpart in diplomacy_clause_map) {
    cleanup_diplomacy_dialog(counterpart);
  }
  diplomacy_clause_map = {};
}
function show_diplomacy_clauses(counterpart_id) {
  const clauses = diplomacy_clause_map[counterpart_id];
  let diplo_html = "";
  for (let i2 = 0; i2 < clauses.length; i2++) {
    const clause = clauses[i2];
    const diplo_str = client_diplomacy_clause_string(
      clause["counterpart"],
      clause["giver"],
      clause["type"],
      clause["value"]
    );
    diplo_html += "<a href='#' onclick='remove_clause_req(" + counterpart_id + ", " + i2 + ");'>" + diplo_str + "</a><br>";
  }
  const msgEl = document.getElementById("diplomacy_messages_" + counterpart_id);
  if (msgEl) msgEl.innerHTML = diplo_html;
}
function remove_clause_req(counterpart_id, clause_no) {
  const clauses = diplomacy_clause_map[counterpart_id];
  const clause = clauses[clause_no];
  const packet = {
    "pid": packet_diplomacy_remove_clause_req,
    "counterpart": clause["counterpart"],
    "giver": clause["giver"],
    "type": clause["type"],
    "value": clause["value"]
  };
  send_request(JSON.stringify(packet));
}
function remove_clause(remove_clause_obj) {
  const counterpart_id = remove_clause_obj["counterpart"];
  const clause_list = diplomacy_clause_map[counterpart_id];
  for (let i2 = 0; i2 < clause_list.length; i2++) {
    const check_clause = clause_list[i2];
    if (counterpart_id === check_clause["counterpart"] && remove_clause_obj["giver"] === check_clause["giver"] && remove_clause_obj["type"] === check_clause["type"]) {
      clause_list.splice(i2, 1);
      break;
    }
  }
  show_diplomacy_clauses(counterpart_id);
}
function client_diplomacy_clause_string(counterpart, giver, type, value) {
  const pplayer = store.players[giver];
  const nation = store.nations[pplayer["nation"]]["adjective"];
  switch (type) {
    case CLAUSE_ADVANCE:
      const ptech = store.techs[value];
      return "The " + nation + " give " + ptech["name"];
    case CLAUSE_CITY:
      const pcity = store.cities[value];
      if (pcity != null) {
        return "The " + nation + " give " + decodeURIComponent(pcity["name"]);
      } else {
        return "The " + nation + " give unknown city.";
      }
    case CLAUSE_GOLD:
      if (giver === clientPlaying()["playerno"]) {
        const el = document.getElementById("self_gold_" + counterpart);
        if (el) el.value = String(value);
      } else {
        const el = document.getElementById("counterpart_gold_" + counterpart);
        if (el) el.value = String(value);
      }
      return "The " + nation + " give " + value + " gold";
    case CLAUSE_MAP:
      return "The " + nation + " give their worldmap";
    case CLAUSE_SEAMAP:
      return "The " + nation + " give their seamap";
    case CLAUSE_CEASEFIRE:
      return "The parties agree on a cease-fire";
    case CLAUSE_PEACE:
      return "The parties agree on a peace";
    case CLAUSE_ALLIANCE:
      return "The parties create an alliance";
    case CLAUSE_VISION:
      return "The " + nation + " give shared vision";
    case CLAUSE_EMBASSY:
      return "The " + nation + " give an embassy";
    case CLAUSE_SHARED_TILES:
      return "The " + nation + " share their tiles";
  }
  return "";
}
function diplomacy_cancel_treaty(player_id) {
  const packet = {
    "pid": packet_diplomacy_cancel_pact,
    "other_player_id": player_id,
    "clause": DiplState.DS_CEASEFIRE
  };
  send_request(JSON.stringify(packet));
  updateNationScreen();
  setTimeout(updateNationScreen, 500);
  setTimeout(updateNationScreen, 1500);
}
function create_diplomacy_dialog(counterpart, template) {
  const pplayer = clientPlaying();
  const counterpart_id = counterpart["playerno"];
  cleanup_diplomacy_dialog(counterpart_id);
  _$$1("#game_page").append(template({
    self: meeting_template_data(pplayer, counterpart),
    counterpart: meeting_template_data(counterpart, pplayer)
  }));
  const title = "Diplomacy: " + counterpart["name"] + " of the " + store.nations[counterpart["nation"]]["adjective"];
  const diplomacy_dialog = _$$1("#diplomacy_dialog_" + counterpart_id);
  diplomacy_dialog.attr("title", title);
  diplomacy_dialog.dialog({
    bgiframe: true,
    modal: false,
    width: isSmallScreen() ? "90%" : "50%",
    height: 500,
    buttons: {
      "Accept treaty": function() {
        accept_treaty_req(counterpart_id);
      },
      "Cancel meeting": function() {
        cancel_meeting_req(counterpart_id);
      }
    },
    close: function() {
      cancel_meeting_req(counterpart_id);
    }
  }).dialogExtend({
    "minimizable": true,
    "closable": true,
    "icons": {
      "minimize": "ui-icon-circle-minus",
      "restore": "ui-icon-bullet"
    }
  });
  diplomacy_dialog.dialog("open");
  let nation = store.nations[pplayer["nation"]];
  if (nation["customized"]) {
    meeting_paint_custom_flag(nation, document.getElementById("flag_self_" + counterpart_id));
  }
  nation = store.nations[counterpart["nation"]];
  if (nation["customized"]) {
    meeting_paint_custom_flag(nation, document.getElementById("flag_counterpart_" + counterpart_id));
  }
  create_clauses_menu(_$$1("#hierarchy_self_" + counterpart_id));
  create_clauses_menu(_$$1("#hierarchy_counterpart_" + counterpart_id));
  if (store.gameInfo.trading_gold && clause_infos[CLAUSE_GOLD]["enabled"]) {
    const selfGold = document.getElementById("self_gold_" + counterpart_id);
    const counterGold = document.getElementById("counterpart_gold_" + counterpart_id);
    if (selfGold) {
      selfGold.max = String(pplayer["gold"]);
      selfGold.min = "0";
    }
    if (counterGold) {
      counterGold.max = String(counterpart["gold"]);
      counterGold.min = "0";
    }
    let wto;
    counterGold?.addEventListener("change", function() {
      clearTimeout(wto);
      wto = window.setTimeout(function() {
        meeting_gold_change_req(
          counterpart_id,
          counterpart_id,
          parseFloat(counterGold.value)
        );
      }, 500);
    });
    selfGold?.addEventListener("change", function() {
      clearTimeout(wto);
      wto = window.setTimeout(function() {
        meeting_gold_change_req(
          counterpart_id,
          pplayer["playerno"],
          parseFloat(selfGold.value)
        );
      }, 500);
    });
  } else {
    const selfGold = document.getElementById("self_gold_" + counterpart_id);
    const counterGold = document.getElementById("counterpart_gold_" + counterpart_id);
    if (selfGold) {
      selfGold.disabled = true;
      if (selfGold.parentElement) selfGold.parentElement.style.display = "none";
    }
    if (counterGold) {
      counterGold.disabled = true;
      if (counterGold.parentElement) counterGold.parentElement.style.display = "none";
    }
  }
  diplomacy_dialog.css("overflow", "visible");
  diplomacy_dialog.parent().css("z-index", 1e3);
}
function meeting_paint_custom_flag(nation, flag_canvas) {
  const tag = "f." + nation["graphic_str"];
  const flag_canvas_ctx = flag_canvas.getContext("2d");
  if (flag_canvas_ctx) {
    flag_canvas_ctx.scale(1.5, 1.5);
    flag_canvas_ctx.drawImage(window.sprites[tag], 0, 0);
  }
}
function create_clauses_menu(content) {
  content.css("position", "relative");
  const children = content.children();
  const button = children.eq(0);
  const menu = children.eq(1);
  menu.menu();
  menu.hide();
  menu.css({
    position: "absolute",
    top: button.height() + parseFloat(button.css("paddingTop")) + parseFloat(button.css("paddingBottom")) + parseFloat(button.css("borderTopWidth")),
    left: parseFloat(button.css("marginLeft"))
  });
  const menu_open = function() {
    menu.show();
    menu.data("diplAdd", "open");
  };
  const menu_close = function() {
    menu.hide();
    menu.data("diplAdd", "closed");
  };
  button.click(function() {
    if (menu.data("diplAdd") === "open") {
      menu_close();
    } else {
      menu_open();
    }
  });
  menu.click(function(e2) {
    if (e2 && e2.target && e2.target.tagName === "A") {
      menu_close();
    }
  });
  content.hover(menu_open, menu_close);
}
function meeting_gold_change_req(counterpart_id, giver, gold) {
  const clauses = diplomacy_clause_map[counterpart_id];
  if (clauses != null) {
    for (let i2 = 0; i2 < clauses.length; i2++) {
      const clause = clauses[i2];
      if (clause["giver"] === giver && clause["type"] === CLAUSE_GOLD) {
        if (clause["value"] === gold) return;
        remove_clause_req(counterpart_id, i2);
      }
    }
  }
  if (gold !== 0) {
    const packet = {
      "pid": packet_diplomacy_create_clause_req,
      "counterpart": counterpart_id,
      "giver": giver,
      "type": CLAUSE_GOLD,
      "value": gold
    };
    send_request(JSON.stringify(packet));
  }
}
function meeting_template_data(giver, taker) {
  const data = {};
  const nation = store.nations[giver["nation"]];
  if (!nation["customized"]) {
    data.flag = nation["graphic_str"] + "-web" + getTilesetFileExtension();
  }
  data.adjective = nation["adjective"];
  data.name = giver["name"];
  data.pid = giver["playerno"];
  const all_clauses = [];
  let clauses = [];
  if (clause_infos[CLAUSE_MAP]["enabled"]) {
    clauses.push({ type: CLAUSE_MAP, value: 1, name: "World-map" });
  }
  if (clause_infos[CLAUSE_SEAMAP]["enabled"]) {
    clauses.push({ type: CLAUSE_SEAMAP, value: 1, name: "Sea-map" });
  }
  if (clauses.length > 0) {
    all_clauses.push({ title: "Maps...", clauses });
  }
  if (store.gameInfo.trading_tech && clause_infos[CLAUSE_ADVANCE]["enabled"]) {
    clauses = [];
    for (const tech_id in store.techs) {
      if (playerInventionState(giver, Number(tech_id)) === TECH_KNOWN$1 && (playerInventionState(taker, Number(tech_id)) === TECH_UNKNOWN || playerInventionState(taker, Number(tech_id)) === TECH_PREREQS_KNOWN)) {
        clauses.push({
          type: CLAUSE_ADVANCE,
          value: tech_id,
          name: store.techs[tech_id]["name"]
        });
      }
    }
    if (clauses.length > 0) {
      all_clauses.push({ title: "Advances...", clauses });
    }
  }
  if (store.gameInfo.trading_city && !isLongturn() && clause_infos[CLAUSE_CITY]["enabled"]) {
    clauses = [];
    for (const city_id in store.cities) {
      const pcity = store.cities[city_id];
      if (cityOwnerPlayerId(pcity) === giver && !doesCityHaveImprovement(pcity, "Palace")) {
        clauses.push({
          type: CLAUSE_CITY,
          value: city_id,
          name: decodeURIComponent(pcity["name"])
        });
      }
    }
    if (clauses.length > 0) {
      all_clauses.push({ title: "Cities...", clauses });
    }
  }
  if (clause_infos[CLAUSE_VISION]["enabled"]) {
    all_clauses.push({ type: CLAUSE_VISION, value: 1, name: "Give shared vision" });
  }
  if (clause_infos[CLAUSE_EMBASSY]["enabled"]) {
    all_clauses.push({ type: CLAUSE_EMBASSY, value: 1, name: "Give embassy" });
  }
  if (clause_infos[CLAUSE_SHARED_TILES]["enabled"]) {
    all_clauses.push({ type: CLAUSE_SHARED_TILES, value: 1, name: "Share tiles" });
  }
  if (giver === clientPlaying()) {
    clauses = [];
    if (clause_infos[CLAUSE_CEASEFIRE]["enabled"]) {
      clauses.push({ type: CLAUSE_CEASEFIRE, value: 1, name: "Cease-fire" });
    }
    if (clause_infos[CLAUSE_PEACE]["enabled"]) {
      clauses.push({ type: CLAUSE_PEACE, value: 1, name: "Peace" });
    }
    if (clause_infos[CLAUSE_ALLIANCE]["enabled"]) {
      clauses.push({ type: CLAUSE_ALLIANCE, value: 1, name: "Alliance" });
    }
    if (clauses.length > 0) {
      all_clauses.push({ title: "Pacts...", clauses });
    }
  }
  data.clauses = all_clauses;
  return data;
}
function find_conn_by_id(id) {
  return store.connections[id];
}
function client_remove_cli_conn(connection2) {
  delete store.connections[connection2["id"]];
}
function conn_list_append(connection2) {
  store.connections[connection2["id"]] = connection2;
}
function handle_server_join_reply(packet) {
  if (packet["you_can_join"]) {
    store.client.conn.established = true;
    store.client.conn.id = packet["conn_id"];
    if (get_client_page() === PAGE_MAIN || get_client_page() === PAGE_NETWORK) {
      set_client_page(PAGE_START);
    }
    sendClientInfo();
    setClientState(C_S_PREPARING);
    const urlParams = new URLSearchParams(window.location.search);
    const urlAction = urlParams.get("action");
    const urlRuleset = urlParams.get("ruleset");
    if ((urlAction === "new" || urlAction === "hack") && urlRuleset != null) {
      window.change_ruleset(urlRuleset);
    }
    if (store.autostart) {
      if (window.loadTimerId === -1) {
        wait_for_text("You are logged in as", window.pregame_start_game);
      } else {
        wait_for_text("Load complete", window.pregame_start_game);
      }
    } else if (store.observing) {
      wait_for_text("You are logged in as", requestObserveGame);
    }
  } else {
    swal("You were rejected from the game.", packet["message"] || "", "error");
    store.client.conn.id = -1;
    set_client_page(PAGE_MAIN);
  }
}
function handle_conn_info(packet) {
  let pconn = find_conn_by_id(packet["id"]);
  if (packet["used"] === false) {
    if (pconn == null) {
      freelog(window.LOG_VERBOSE, "Server removed unknown connection " + packet["id"]);
      return;
    }
    client_remove_cli_conn(pconn);
    pconn = null;
  } else {
    const pplayer = valid_player_by_number(packet["player_num"]);
    packet["playing"] = pplayer;
    if (packet["id"] === store.client.conn.id) {
      if (store.client.conn.player_num == null || store.client.conn.player_num !== packet["player_num"]) {
        discard_diplomacy_dialogs();
      }
      store.client.conn = packet;
    }
    conn_list_append(packet);
  }
  if (packet["id"] === store.client.conn.id) {
    if (clientPlaying() !== packet["playing"]) {
      setClientState(C_S_PREPARING);
    }
  }
}
function handle_conn_ping(packet) {
  window.ping_last = (/* @__PURE__ */ new Date()).getTime();
  sendConnPong();
}
function handle_authentication_req(packet) {
  showAuthDialog(packet);
}
function handle_server_shutdown(_packet) {
}
function handle_connect_msg(packet) {
  const { add_chatbox_text: add_chatbox_text2 } = require("../../core/messages");
  add_chatbox_text2(packet);
}
function handle_server_info(packet) {
  if (packet["emerg_version"] > 0) {
    console.log(
      "Server has version %d.%d.%d.%d%s",
      packet.major_version,
      packet.minor_version,
      packet.patch_version,
      packet.emerg_version,
      packet.version_label
    );
  } else {
    console.log(
      "Server has version %d.%d.%d%s",
      packet.major_version,
      packet.minor_version,
      packet.patch_version,
      packet.version_label
    );
  }
}
function handle_set_topology(_packet) {
}
function handle_conn_ping_info(packet) {
  if (store.debugActive) {
    window.conn_ping_info = packet;
    window.debug_ping_list.push(packet["ping_time"][0] * 1e3);
  }
}
function handle_single_want_hack_reply(packet) {
  if (typeof window.handle_single_want_hack_reply_orig === "function") {
    window.handle_single_want_hack_reply_orig(packet);
  }
}
function handle_vote_new(_packet) {
}
function handle_vote_update(_packet) {
}
function handle_vote_remove(_packet) {
}
function handle_vote_resolve(_packet) {
}
function handle_edit_startpos(_packet) {
}
function handle_edit_startpos_full(_packet) {
}
function handle_edit_object_created(_packet) {
}
function handle_server_setting_const(packet) {
  store.serverSettings[packet["id"]] = packet;
  store.serverSettings[packet["name"]] = packet;
}
function handle_server_setting_int(packet) {
  Object.assign(store.serverSettings[packet["id"]], packet);
}
function handle_server_setting_enum(packet) {
  Object.assign(store.serverSettings[packet["id"]], packet);
}
function handle_server_setting_bitwise(packet) {
  Object.assign(store.serverSettings[packet["id"]], packet);
}
function handle_server_setting_bool(packet) {
  Object.assign(store.serverSettings[packet["id"]], packet);
}
function handle_server_setting_str(packet) {
  Object.assign(store.serverSettings[packet["id"]], packet);
}
function handle_server_setting_control(_packet) {
}
function handle_tile_info(packet) {
  if (store.tiles != null) {
    packet["extras"] = new BitVector$1(packet["extras"]);
    Object.assign(store.tiles[packet["tile"]], packet);
    if (typeof mark_tile_dirty === "function") {
      mark_tile_dirty(packet["tile"]);
    }
  }
}
function handle_map_info(packet) {
  store.mapInfo = packet;
  mapInitTopology();
  mapAllocate();
  mapdeco_init();
}
function handle_nuke_tile_info(packet) {
  const ptile = indexToTile(packet["tile"]);
  ptile["nuke"] = 60;
  play_sound("LrgExpl.ogg");
}
const TILE_INDEX_NONE$1 = -1;
let action_selection_restart = false;
let did_not_decide = false;
function _set_action_selection_restart(val) {
  action_selection_restart = val;
}
function _set_did_not_decide(val) {
  did_not_decide = val;
}
function act_sel_queue_may_be_done(actor_unit_id) {
  if (!is_more_user_input_needed) {
    if (action_selection_restart) {
      action_selection_restart = false;
    } else {
      action_selection_no_longer_in_progress(actor_unit_id);
    }
    if (did_not_decide) {
      did_not_decide = false;
    } else {
      action_decision_clear_want(actor_unit_id);
      action_selection_next_in_focus(actor_unit_id);
    }
  }
}
function act_sel_queue_done(actor_unit_id) {
  set_is_more_user_input_needed(false);
  act_sel_queue_may_be_done(actor_unit_id);
  action_selection_restart = false;
  did_not_decide = false;
}
function action_selection_actor_unit() {
  return action_selection_in_progress_for;
}
function action_selection_target_city() {
  if (action_selection_in_progress_for == IDENTITY_NUMBER_ZERO) {
    return IDENTITY_NUMBER_ZERO;
  }
  const el = document.getElementById("act_sel_dialog_" + action_selection_in_progress_for);
  return el ? Number(el.getAttribute("target_city")) : IDENTITY_NUMBER_ZERO;
}
function action_selection_target_unit() {
  if (action_selection_in_progress_for == IDENTITY_NUMBER_ZERO) {
    return IDENTITY_NUMBER_ZERO;
  }
  const el = document.getElementById("act_sel_dialog_" + action_selection_in_progress_for);
  return el ? Number(el.getAttribute("target_unit")) : IDENTITY_NUMBER_ZERO;
}
function action_selection_target_tile() {
  if (action_selection_in_progress_for == IDENTITY_NUMBER_ZERO) {
    return TILE_INDEX_NONE$1;
  }
  const el = document.getElementById("act_sel_dialog_" + action_selection_in_progress_for);
  return el ? Number(el.getAttribute("target_tile")) : TILE_INDEX_NONE$1;
}
function action_selection_target_extra() {
  if (action_selection_in_progress_for == IDENTITY_NUMBER_ZERO) {
    return EXTRA_NONE$1;
  }
  const el = document.getElementById("act_sel_dialog_" + action_selection_in_progress_for);
  return el ? Number(el.getAttribute("target_extra")) : EXTRA_NONE$1;
}
function action_selection_refresh(actor_unit, target_city, target_unit, target_tile, target_extra, act_probs) {
  document.getElementById("act_sel_dialog_" + actor_unit["id"])?.remove();
  popup_action_selection(
    actor_unit,
    act_probs,
    target_tile,
    target_extra,
    target_unit,
    target_city
  );
}
function action_selection_close() {
  const actor_unit_id = action_selection_in_progress_for;
  const ids = [
    "act_sel_dialog_" + actor_unit_id,
    "bribe_unit_dialog_" + actor_unit_id,
    "incite_city_dialog_" + actor_unit_id,
    "upgrade_unit_dialog_" + actor_unit_id,
    "stealtech_dialog_" + actor_unit_id,
    "sabotage_impr_dialog_" + actor_unit_id,
    "sel_tgt_unit_dialog_" + actor_unit_id,
    "sel_tgt_extra_dialog_" + actor_unit_id,
    "city_name_dialog"
  ];
  for (const id of ids) {
    document.getElementById(id)?.remove();
  }
  act_sel_queue_done(actor_unit_id);
}
function list_potential_target_extras(act_unit, target_tile) {
  const potential_targets = [];
  for (let i2 = 0; i2 < (store.rulesControl?.num_extra_types ?? 0); i2++) {
    const pextra = store.extras[i2];
    if (tileHasExtra(target_tile, pextra.id)) {
      if (isExtraRemovedBy(pextra, ERM_PILLAGE$1) && unit_can_do_action(act_unit, ACTION_PILLAGE$1) || isExtraRemovedBy(pextra, ERM_CLEAN) && unit_can_do_action(act_unit, ACTION_CLEAN)) {
        potential_targets.push(pextra);
      }
    } else {
      if (pextra.buildable && (isExtraCausedBy(pextra, EC_IRRIGATION) && unit_can_do_action(act_unit, ACTION_IRRIGATE) || isExtraCausedBy(pextra, EC_MINE) && unit_can_do_action(act_unit, ACTION_MINE) || isExtraCausedBy(pextra, EC_BASE) && unit_can_do_action(act_unit, ACTION_BASE) || isExtraCausedBy(pextra, EC_ROAD) && unit_can_do_action(act_unit, ACTION_ROAD))) {
        potential_targets.push(pextra);
      }
    }
  }
  return potential_targets;
}
function select_tgt_unit(actor_unit, target_tile, potential_tgt_units) {
}
function select_tgt_extra(actor_unit, target_unit, target_tile, potential_tgt_extras) {
}
const TILE_INDEX_NONE = -1;
let auto_attack = false;
function createNativeDialog(dlgId, title, content, buttons, opts) {
  document.getElementById(dlgId)?.remove();
  const dlg = document.createElement("div");
  dlg.id = dlgId;
  dlg.className = "act_sel_dialog";
  const w2 = opts?.width || "390px";
  dlg.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:20%;left:50%;transform:translateX(-50%);width:" + w2 + ";max-height:70vh;overflow-y:auto;color:#fff;";
  if (title) {
    const h2 = document.createElement("h3");
    h2.textContent = title;
    h2.style.cssText = "margin:0 0 8px;";
    dlg.appendChild(h2);
  }
  if (content) {
    const body = document.createElement("div");
    body.innerHTML = content;
    dlg.appendChild(body);
  }
  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = "margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;";
  for (const b2 of buttons) {
    const btn = document.createElement("button");
    if (b2.id) btn.id = b2.id;
    if (b2.class) btn.className = b2.class;
    btn.textContent = b2.text;
    if (b2.title) btn.title = b2.title;
    btn.addEventListener("click", b2.click);
    btnContainer.appendChild(btn);
  }
  dlg.appendChild(btnContainer);
  document.getElementById("game_page")?.appendChild(dlg);
  return dlg;
}
function removeDialog(dlgId) {
  document.getElementById(dlgId)?.remove();
}
function popup_action_selection(actor_unit, action_probabilities, target_tile, target_extra, target_unit, target_city) {
  if (clientIsObserver()) return;
  const dlgId = "act_sel_dialog_" + actor_unit["id"];
  if (action_selection_in_progress_for != IDENTITY_NUMBER_ZERO && action_selection_in_progress_for != actor_unit["id"]) {
    logNormal(
      "Looks like unit %d has an action selection dialog open but a dialog for unit %d is about to be opened.",
      action_selection_in_progress_for,
      actor_unit["id"]
    );
    logNormal(
      "Closing the action selection dialog for unit %d",
      action_selection_in_progress_for
    );
    action_selection_close();
  }
  const actor_homecity = store.cities[actor_unit["homecity"]];
  let dhtml = "";
  if (target_city != null) {
    dhtml += "Your " + store.unitTypes[actor_unit["type"]]["name"];
    if (actor_homecity != null) {
      dhtml += " from " + decodeURIComponent(actor_homecity["name"]);
    }
    dhtml += " has arrived at " + decodeURIComponent(target_city["name"]) + ". What is your command?";
  } else if (target_unit != null) {
    dhtml += "Your " + store.unitTypes[actor_unit["type"]]["name"] + " is ready to act against " + store.nations[unit_owner(target_unit)["nation"]]["adjective"] + " " + store.unitTypes[target_unit["type"]]["name"] + ".";
  } else {
    dhtml += "Your " + store.unitTypes[actor_unit["type"]]["name"] + " is waiting for your command.";
  }
  const buttons = [];
  for (let tgt_kind = ATK_CITY; tgt_kind < ATK_COUNT; tgt_kind++) {
    let tgt_id = -1;
    let sub_tgt_id = -1;
    switch (tgt_kind) {
      case ATK_CITY:
        if (target_city != null) tgt_id = target_city["id"];
        break;
      case ATK_UNIT:
        if (target_unit != null) tgt_id = target_unit["id"];
        break;
      case ATK_UNITS:
        if (target_tile != null) tgt_id = target_tile["index"];
        break;
      case ATK_TILE:
      case ATK_EXTRAS:
        if (target_tile != null) tgt_id = target_tile["index"];
        if (target_extra != null) sub_tgt_id = target_extra["id"];
        break;
      case ATK_SELF:
        if (actor_unit != null) tgt_id = actor_unit["id"];
        break;
      default:
        logError("Unsupported action target kind " + tgt_kind);
        break;
    }
    for (let action_id = 0; action_id < ACTION_COUNT$1; action_id++) {
      if (window.actions[action_id]["tgt_kind"] == tgt_kind && actionProbPossible(action_probabilities[action_id])) {
        const b2 = create_act_sel_button(
          "#" + dlgId,
          actor_unit["id"],
          tgt_id,
          sub_tgt_id,
          action_id,
          action_probabilities
        );
        buttons.push({ text: b2.text, id: b2.id, class: b2["class"], title: b2.title, click: b2.click });
      }
    }
  }
  if (target_unit != null && tile_units(target_tile).length > 1) {
    buttons.push({
      id: "act_sel_tgt_unit_switch" + actor_unit["id"],
      class: "act_sel_button",
      text: "Change unit target",
      click: function() {
        select_tgt_unit(actor_unit, target_tile, tile_units(target_tile) ?? []);
        _set_action_selection_restart(true);
        removeDialog(dlgId);
      }
    });
  }
  if (target_extra != null) {
    buttons.push({
      id: "act_sel_tgt_extra_switch" + actor_unit["id"],
      class: "act_sel_button",
      text: "Change extra target",
      click: function() {
        select_tgt_extra(
          actor_unit,
          target_unit,
          target_tile,
          list_potential_target_extras(actor_unit, target_tile)
        );
        _set_action_selection_restart(true);
        removeDialog(dlgId);
      }
    });
  }
  if (actionProbPossible(action_probabilities[ACTION_ATTACK])) {
    if (!auto_attack) {
      buttons.push({
        id: "act_sel_" + ACTION_ATTACK + "_" + actor_unit["id"],
        class: "act_sel_button",
        text: "Auto attack from now on!",
        title: "Attack without showing this attack dialog in the future",
        click: function() {
          request_unit_do_action(ACTION_ATTACK, actor_unit["id"], target_tile["index"]);
          auto_attack = true;
          removeDialog(dlgId);
          act_sel_queue_may_be_done(actor_unit["id"]);
        }
      });
    }
  }
  buttons.push({
    id: "act_sel_wait" + actor_unit["id"],
    class: "act_sel_button",
    text: "Wait",
    click: function() {
      _set_did_not_decide(true);
      removeDialog(dlgId);
      act_sel_queue_may_be_done(actor_unit["id"]);
    }
  });
  buttons.push({
    id: "act_sel_cancel" + actor_unit["id"],
    class: "act_sel_button",
    text: "Cancel",
    click: function() {
      removeDialog(dlgId);
      act_sel_queue_may_be_done(actor_unit["id"]);
    }
  });
  const dlg = createNativeDialog(
    dlgId,
    "Choose Your " + store.unitTypes[actor_unit["type"]]["name"] + "'s Strategy",
    dhtml,
    buttons
  );
  dlg.setAttribute("actor_unit", String(actor_unit != null ? actor_unit["id"] : IDENTITY_NUMBER_ZERO));
  dlg.setAttribute("target_city", String(target_city != null ? target_city["id"] : IDENTITY_NUMBER_ZERO));
  dlg.setAttribute("target_unit", String(target_unit != null ? target_unit["id"] : IDENTITY_NUMBER_ZERO));
  dlg.setAttribute("target_tile", String(target_tile != null ? target_tile["index"] : TILE_INDEX_NONE));
  dlg.setAttribute("target_extra", String(target_extra != null ? target_extra["id"] : EXTRA_NONE$1));
  set_is_more_user_input_needed(false);
}
function popup_bribe_dialog(actor_unit, target_unit, cost, act_id) {
  const dlgId = "bribe_unit_dialog_" + actor_unit["id"];
  let dhtml = "";
  dhtml += "Treasury contains " + unit_owner(actor_unit)["gold"] + " gold. ";
  dhtml += "The price of bribing " + store.nations[unit_owner(target_unit)["nation"]]["adjective"] + " " + store.unitTypes[target_unit["type"]]["name"] + " is " + cost + ". ";
  const bribe_possible = cost <= unit_owner(actor_unit)["gold"];
  if (!bribe_possible) {
    dhtml += "Traitors Demand Too Much!<br>";
  }
  const buttons = [];
  if (bribe_possible) {
    buttons.push({
      text: "Do it!",
      click: function() {
        request_unit_do_action(act_id, actor_unit["id"], target_unit["id"]);
        removeDialog(dlgId);
        act_sel_queue_done(actor_unit["id"]);
      }
    });
  }
  buttons.push({
    text: bribe_possible ? "Cancel" : "Close",
    click: function() {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit["id"]);
    }
  });
  createNativeDialog(dlgId, "About that bribery you requested...", dhtml, buttons);
}
function popup_incite_dialog(actor_unit, target_city, cost, act_id) {
  const dlgId = "incite_city_dialog_" + actor_unit["id"];
  let dhtml = "";
  dhtml += "Treasury contains " + unit_owner(actor_unit)["gold"] + " gold. ";
  dhtml += "The price of inciting " + decodeURIComponent(target_city["name"]) + " is " + cost + ".";
  const incite_possible = cost != INCITE_IMPOSSIBLE_COST && cost <= unit_owner(actor_unit)["gold"];
  if (!incite_possible) {
    dhtml += " Traitors Demand Too Much!<br>";
  }
  const buttons = [];
  if (incite_possible) {
    buttons.push({
      text: "Do it!",
      click: function() {
        request_unit_do_action(act_id, actor_unit["id"], target_city["id"]);
        removeDialog(dlgId);
        act_sel_queue_done(actor_unit["id"]);
      }
    });
  }
  buttons.push({
    text: incite_possible ? "Cancel" : "Close",
    click: function() {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit["id"]);
    }
  });
  createNativeDialog(dlgId, "About that incite you requested...", dhtml, buttons);
}
function popup_unit_upgrade_dlg(actor_unit, target_city, cost, act_id) {
  const dlgId = "upgrade_unit_dialog_" + actor_unit["id"];
  let dhtml = "";
  dhtml += "Treasury contains " + unit_owner(actor_unit)["gold"] + " gold. ";
  dhtml += "The price of upgrading our " + store.unitTypes[actor_unit["type"]]["name"] + " is " + cost + ".";
  const upgrade_possible = cost <= unit_owner(actor_unit)["gold"];
  const buttons = [];
  if (upgrade_possible) {
    buttons.push({
      text: "Do it!",
      click: function() {
        request_unit_do_action(act_id, actor_unit["id"], target_city["id"]);
        removeDialog(dlgId);
        act_sel_queue_done(actor_unit["id"]);
      }
    });
  }
  buttons.push({
    text: upgrade_possible ? "Cancel" : "Close",
    click: function() {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit["id"]);
    }
  });
  createNativeDialog(dlgId, "Unit upgrade", dhtml, buttons);
}
function create_steal_tech_button(parent_id, tech, actor_id, city_id, action_id) {
  return {
    text: tech["name"],
    click: function() {
      request_unit_do_action(action_id, actor_id, city_id, tech["id"]);
      removeDialog(parent_id);
      act_sel_queue_done(actor_id);
    }
  };
}
function popup_steal_tech_selection_dialog(actor_unit, target_city, act_probs, action_id) {
  const dlgId = "stealtech_dialog_" + actor_unit["id"];
  const buttons = [];
  let untargeted_action_id = ACTION_COUNT$1;
  for (const tech_id in store.techs) {
    const tech = store.techs[tech_id];
    const act_kn = playerInventionState(clientPlaying(), tech["id"]);
    const tgt_kn = playerInventionState(target_city["owner"], tech["id"]);
    if (tgt_kn == TECH_KNOWN$2 && (act_kn == TECH_PREREQS_KNOWN$1 || store.gameInfo["tech_steal_allow_holes"] && act_kn == TECH_UNKNOWN$1)) {
      buttons.push(create_steal_tech_button(
        dlgId,
        tech,
        actor_unit["id"],
        target_city["id"],
        action_id
      ));
    }
  }
  if (action_id == ACTION_SPY_TARGETED_STEAL_TECH_ESC) {
    untargeted_action_id = ACTION_SPY_STEAL_TECH_ESC;
  } else if (action_id == ACTION_SPY_TARGETED_STEAL_TECH) {
    untargeted_action_id = ACTION_SPY_STEAL_TECH;
  }
  if (untargeted_action_id != ACTION_COUNT$1 && actionProbPossible(act_probs[untargeted_action_id])) {
    buttons.push({
      text: "At " + store.unitTypes[actor_unit["type"]]["name"] + "'s Discretion",
      click: function() {
        request_unit_do_action(
          untargeted_action_id,
          actor_unit["id"],
          target_city["id"]
        );
        removeDialog(dlgId);
        act_sel_queue_done(actor_unit["id"]);
      }
    });
  }
  buttons.push({
    text: "Cancel",
    click: function() {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit["id"]);
    }
  });
  createNativeDialog(dlgId, "Select Advance to Steal", "", buttons, { width: "90%" });
}
function create_sabotage_impr_button(improvement, parent_id, actor_unit_id, target_city_id, act_id) {
  return {
    text: improvement["name"],
    click: function() {
      request_unit_do_action(
        act_id,
        actor_unit_id,
        target_city_id,
        improvement["id"]
      );
      removeDialog(parent_id);
      act_sel_queue_done(actor_unit_id);
    }
  };
}
function popup_sabotage_dialog(actor_unit, target_city, city_imprs, act_id) {
  const dlgId = "sabotage_impr_dialog_" + actor_unit["id"];
  const buttons = [];
  for (let i2 = 0; i2 < (store.rulesControl?.["num_impr_types"] ?? 0); i2++) {
    const improvement = store.improvements[i2];
    if (city_imprs.isSet(i2) && improvement["sabotage"] > 0) {
      buttons.push(create_sabotage_impr_button(
        improvement,
        dlgId,
        actor_unit["id"],
        target_city["id"],
        act_id
      ));
    }
  }
  buttons.push({
    text: "Cancel",
    click: function() {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit["id"]);
    }
  });
  createNativeDialog(dlgId, "Select Improvement to Sabotage", "", buttons, { width: "90%" });
}
const REQEST_PLAYER_INITIATED$3 = 0;
function format_act_prob_part(prob) {
  return prob / 2 + "%";
}
function format_action_probability(probability) {
  if (probability["min"] == probability["max"]) {
    return " (" + format_act_prob_part(probability["max"]) + ")";
  } else if (probability["min"] < probability["max"]) {
    return " ([" + format_act_prob_part(probability["min"]) + ", " + format_act_prob_part(probability["max"]) + "])";
  } else {
    return "";
  }
}
function format_action_label(action_id, action_probabilities) {
  return window.actions[action_id]["ui_name"].replace("%s", "").replace(
    "%s",
    format_action_probability(action_probabilities[action_id])
  );
}
function format_action_tooltip(act_id, act_probs) {
  let out = "";
  if (act_probs[act_id]["min"] == act_probs[act_id]["max"]) {
    out = "The probability of success is ";
    out += format_act_prob_part(act_probs[act_id]["max"]) + ".";
  } else if (act_probs[act_id]["min"] < act_probs[act_id]["max"]) {
    out = "The probability of success is ";
    out += format_act_prob_part(act_probs[act_id]["min"]);
    out += ", ";
    out += format_act_prob_part(act_probs[act_id]["max"]);
    out += " or somewhere in between.";
    if (act_probs[act_id]["max"] - act_probs[act_id]["min"] > 1) {
      out += " (This is the most precise interval I can calculate ";
      out += "given the information our nation has access to.)";
    }
  }
  return out;
}
function act_sel_click_function(parent_id, actor_unit_id, tgt_id, sub_tgt_id, action_id, action_probabilities) {
  switch (action_id) {
    case ACTION_SPY_TARGETED_STEAL_TECH:
    case ACTION_SPY_TARGETED_STEAL_TECH_ESC:
      return function() {
        popup_steal_tech_selection_dialog(
          store.units[actor_unit_id],
          store.cities[tgt_id],
          action_probabilities,
          action_id
        );
        set_is_more_user_input_needed(true);
        document.querySelector(parent_id)?.remove();
      };
    case ACTION_SPY_TARGETED_SABOTAGE_CITY:
    case ACTION_SPY_TARGETED_SABOTAGE_CITY_ESC:
    case ACTION_SPY_INCITE_CITY:
    case ACTION_SPY_INCITE_CITY_ESC:
    case ACTION_SPY_BRIBE_UNIT:
    case ACTION_UPGRADE_UNIT:
      return function() {
        const packet = {
          "pid": packet_unit_action_query,
          "actor_id": actor_unit_id,
          "target_id": tgt_id,
          "action_type": action_id,
          "request_kind": REQEST_PLAYER_INITIATED$3
        };
        send_request(JSON.stringify(packet));
        set_is_more_user_input_needed(true);
        document.querySelector(parent_id)?.remove();
      };
    case ACTION_FOUND_CITY:
      return function() {
        const packet = {
          "pid": packet_city_name_suggestion_req,
          "unit_id": actor_unit_id
        };
        send_request(JSON.stringify(packet));
        set_is_more_user_input_needed(true);
        document.querySelector(parent_id)?.remove();
      };
    default:
      return function() {
        request_unit_do_action(action_id, actor_unit_id, tgt_id, sub_tgt_id);
        document.querySelector(parent_id)?.remove();
        act_sel_queue_may_be_done(actor_unit_id);
      };
  }
}
function create_act_sel_button(parent_id, actor_unit_id, tgt_id, sub_tgt_id, action_id, action_probabilities) {
  const button = {
    id: "act_sel_" + action_id + "_" + actor_unit_id,
    "class": "act_sel_button",
    text: format_action_label(
      action_id,
      action_probabilities
    ),
    title: format_action_tooltip(
      action_id,
      action_probabilities
    ),
    click: act_sel_click_function(
      parent_id,
      actor_unit_id,
      tgt_id,
      sub_tgt_id,
      action_id,
      action_probabilities
    )
  };
  return button;
}
const REQEST_PLAYER_INITIATED$2 = 0;
function handle_city_info(packet) {
  if (typeof mark_tile_dirty === "function" && packet["tile"] != null) {
    mark_tile_dirty(packet["tile"]);
  }
  packet["name"] = decodeURIComponent(packet["name"]);
  packet["improvements"] = new BitVector$1(packet["improvements"]);
  packet["city_options"] = new BitVector$1(packet["city_options"]);
  packet["unhappy"] = cityUnhappy(packet);
  if (store.cities[packet["id"]] == null) {
    store.cities[packet["id"]] = packet;
    if (C_S_RUNNING === clientState() && !store.observing && window.benchmark_start === 0 && !clientIsObserver() && packet["owner"] === clientPlaying()?.playerno) {
      show_city_dialog_by_id(packet["id"]);
    }
  } else {
    Object.assign(store.cities[packet["id"]], packet);
  }
  const pcity = store.cities[packet["id"]];
  pcity["shield_stock_changed"] = false;
  pcity["production_changed"] = false;
}
function handle_city_nationalities(packet) {
  if (store.cities[packet["id"]] != null) {
    Object.assign(store.cities[packet["id"]], packet);
  }
}
function handle_city_rally_point(packet) {
  if (store.cities[packet["id"]] != null) {
    Object.assign(store.cities[packet["id"]], packet);
  }
}
function handle_web_city_info_addition(packet) {
  if (store.cities[packet["id"]] != null) {
    Object.assign(store.cities[packet["id"]], packet);
  }
  if (typeof window.update_city_info_dialog === "function") {
    window.update_city_info_dialog();
  }
}
function handle_city_short_info(packet) {
  if (typeof mark_tile_dirty === "function" && packet["tile"] != null) {
    mark_tile_dirty(packet["tile"]);
  }
  packet["name"] = decodeURIComponent(packet["name"]);
  packet["improvements"] = new BitVector$1(packet["improvements"]);
  if (store.cities[packet["id"]] == null) {
    store.cities[packet["id"]] = packet;
  } else {
    Object.assign(store.cities[packet["id"]], packet);
  }
}
function handle_city_update_counters(packet) {
  if (store.cities[packet["id"]] != null) {
    store.cities[packet["id"]]["counters"] = packet["counters"];
  }
}
function handle_city_remove(packet) {
  removeCity(packet["city_id"]);
}
function handle_city_name_suggestion_info(packet) {
  packet["name"] = decodeURIComponent(packet["name"]);
  city_name_dialog(packet["name"], packet["unit_id"]);
}
function handle_city_sabotage_list(packet) {
  if (packet["request_kind"] !== REQEST_PLAYER_INITIATED$2) {
    console.log("handle_city_sabotage_list(): was asked to not disturb the player. Unimplemented.");
  }
  popup_sabotage_dialog(
    game_find_unit_by_number(packet["actor_id"]),
    game_find_city_by_number(packet["city_id"]),
    new BitVector$1(packet["improvements"]),
    packet["act_id"]
  );
}
const _w$3 = window;
function assign_nation_color(nation_id) {
  const nation = store.nations[nation_id];
  if (nation == null || nation["color"] != null) return;
  const flag_key = "f." + nation["graphic_str"];
  const flag_sprite = _w$3.sprites[flag_key];
  if (flag_sprite == null) return;
  const c2 = flag_sprite.getContext("2d");
  const width = _w$3.tileset[flag_key][2];
  const height = _w$3.tileset[flag_key][3];
  const color_counts = {};
  if (c2 == null) return;
  const img_data = c2.getImageData(1, 1, width - 2, height - 2).data;
  for (let i2 = 0; i2 < img_data.length; i2 += 4) {
    const current_color = "rgb(" + img_data[i2] + "," + img_data[i2 + 1] + "," + img_data[i2 + 2] + ")";
    if (current_color in color_counts) {
      color_counts[current_color] = color_counts[current_color] + 1;
    } else {
      color_counts[current_color] = 1;
    }
  }
  let max = -1;
  let max_color = null;
  for (const current_color in color_counts) {
    if (color_counts[current_color] > max) {
      max = color_counts[current_color];
      max_color = current_color;
    }
  }
  nation["color"] = max_color;
}
function color_rbg_to_list(pcolor) {
  if (pcolor == null) return null;
  const color_rgb = pcolor.match(/\d+/g);
  if (!color_rgb) return null;
  return [parseFloat(color_rgb[0]), parseFloat(color_rgb[1]), parseFloat(color_rgb[2])];
}
const REQEST_BACKGROUND_REFRESH$1 = 1;
function handle_player_info(packet) {
  if (packet["name"] != null) {
    packet["name"] = decodeURIComponent(packet["name"]);
  }
  store.players[packet["playerno"]] = Object.assign(
    store.players[packet["playerno"]] || {},
    packet
  );
  const p2 = store.players[packet["playerno"]];
  if (p2["flags"] != null && !(p2["flags"] instanceof BitVector$1)) {
    p2["flags"] = new BitVector$1(p2["flags"]);
  }
  if (p2["gives_shared_vision"] != null && !(p2["gives_shared_vision"] instanceof BitVector$1)) {
    p2["gives_shared_vision"] = new BitVector$1(p2["gives_shared_vision"]);
  }
  if (clientPlaying() != null && packet["playerno"] === clientPlaying()["playerno"]) {
    store.client.conn.playing = store.players[packet["playerno"]];
  }
}
function handle_web_player_info_addition(packet) {
  Object.assign(store.players[packet["playerno"]], packet);
  if (clientPlaying() != null) {
    if (packet["playerno"] === clientPlaying()["playerno"]) {
      store.client.conn.playing = store.players[packet["playerno"]];
      update_game_status_panel();
      update_net_income();
    }
  }
  update_player_info_pregame();
  if (is_tech_tree_init && tech_dialog_active) update_tech_screen();
  assign_nation_color(store.players[packet["playerno"]]["nation"]);
}
function handle_player_remove(packet) {
  delete store.players[packet["playerno"]];
  update_player_info_pregame();
}
function handle_player_attribute_chunk(_packet) {
}
function handle_player_diplstate(packet) {
  let need_players_dialog_update = false;
  if (store.client == null || clientPlaying() == null) return;
  if (packet["plr2"] === clientPlaying()["playerno"]) {
    const ds = store.players[packet["plr1"]].diplstates;
    if (ds != void 0 && ds[packet["plr2"]] != void 0 && ds[packet["plr2"]]["state"] !== packet["type"]) {
      need_players_dialog_update = true;
    }
  }
  if (packet["type"] === DiplState.DS_WAR && packet["plr2"] === clientPlaying()["playerno"] && window.diplstates[packet["plr1"]] !== DiplState.DS_WAR && window.diplstates[packet["plr1"]] !== DiplState.DS_NO_CONTACT) {
    window.alert_war(packet["plr1"]);
  } else if (packet["type"] === DiplState.DS_WAR && packet["plr1"] === clientPlaying()["playerno"] && window.diplstates[packet["plr2"]] !== DiplState.DS_WAR && window.diplstates[packet["plr2"]] !== DiplState.DS_NO_CONTACT) {
    window.alert_war(packet["plr2"]);
  }
  if (packet["plr1"] === clientPlaying()["playerno"]) {
    window.diplstates[packet["plr2"]] = packet["type"];
  } else if (packet["plr2"] === clientPlaying()["playerno"]) {
    window.diplstates[packet["plr1"]] = packet["type"];
  }
  if (store.players[packet["plr1"]].diplstates === void 0) {
    store.players[packet["plr1"]].diplstates = [];
  }
  store.players[packet["plr1"]].diplstates[packet["plr2"]] = {
    state: packet["type"],
    turns_left: packet["turns_left"],
    contact_turns_left: packet["contact_turns_left"]
  };
  if (need_players_dialog_update && action_selection_actor_unit() !== IDENTITY_NUMBER_ZERO) {
    let tgt_tile;
    let tgt_unit;
    let tgt_city;
    if (action_selection_target_unit() !== IDENTITY_NUMBER_ZERO && (tgt_unit = game_find_unit_by_number(action_selection_target_unit())) && tgt_unit["owner"] === packet["plr1"] || action_selection_target_city() !== IDENTITY_NUMBER_ZERO && (tgt_city = game_find_city_by_number(action_selection_target_city())) && tgt_city["owner"] === packet["plr1"] || (tgt_tile = indexToTile(action_selection_target_tile())) && tileOwner(tgt_tile) === packet["plr1"]) {
      sendUnitGetActions(
        action_selection_actor_unit(),
        action_selection_target_unit(),
        action_selection_target_tile(),
        action_selection_target_extra(),
        REQEST_BACKGROUND_REFRESH$1
      );
    }
  }
}
const auto_attack_actions = [
  ACTION_ATTACK,
  ACTION_SUICIDE_ATTACK,
  ACTION_NUKE_UNITS,
  ACTION_NUKE_CITY,
  ACTION_NUKE
];
const REQEST_PLAYER_INITIATED$1 = 0;
const REQEST_BACKGROUND_REFRESH = 1;
const REQEST_BACKGROUND_FAST_AUTO_ATTACK = 2;
function handle_unit_remove(packet) {
  const punit = game_find_unit_by_number(packet["unit_id"]);
  if (punit == null) return;
  if (typeof mark_tile_dirty === "function" && punit["tile"] != null) {
    mark_tile_dirty(punit["tile"]);
  }
  if (action_selection_in_progress_for === punit.id) {
    action_selection_close();
    action_selection_next_in_focus(punit.id);
  }
  clear_tile_unit(punit);
  client_remove_unit(punit);
}
function handle_unit_info(packet) {
  if (typeof mark_tile_dirty === "function" && packet["tile"] != null) {
    mark_tile_dirty(packet["tile"]);
    const old_unit = store.units[packet["id"]];
    if (old_unit != null && old_unit["tile"] !== packet["tile"]) {
      mark_tile_dirty(old_unit["tile"]);
    }
  }
  handle_unit_packet_common(packet);
}
function handle_unit_short_info(packet) {
  if (typeof mark_tile_dirty === "function" && packet["tile"] != null) {
    mark_tile_dirty(packet["tile"]);
    const old_unit = store.units[packet["id"]];
    if (old_unit != null && old_unit["tile"] !== packet["tile"]) {
      mark_tile_dirty(old_unit["tile"]);
    }
  }
  handle_unit_packet_common(packet);
}
function action_decision_handle(punit) {
  for (let a2 = 0; a2 < auto_attack_actions.length; a2++) {
    const action = auto_attack_actions[a2];
    if (utype_can_do_action$1(unit_type(punit), action) && window.auto_attack) {
      sendUnitGetActions(
        punit["id"],
        IDENTITY_NUMBER_ZERO,
        punit["action_decision_tile"],
        EXTRA_NONE$1,
        REQEST_BACKGROUND_FAST_AUTO_ATTACK
      );
      return;
    }
  }
  action_decision_request(punit);
}
function action_decision_maybe_auto(actor_unit, action_probabilities, target_tile, target_extra, target_unit, _target_city) {
  for (let a2 = 0; a2 < auto_attack_actions.length; a2++) {
    const action = auto_attack_actions[a2];
    if (actionProbPossible(action_probabilities[action]) && window.auto_attack) {
      let target = target_tile["index"];
      if (action === ACTION_NUKE_CITY) {
        const tc = tileCity(target_tile);
        if (!tc) continue;
        target = tc["id"];
      }
      request_unit_do_action(action, actor_unit["id"], target);
      return;
    }
  }
  action_decision_request(actor_unit);
}
function handle_unit_packet_common(packet_unit) {
  const punit = player_find_unit_by_id(
    unit_owner(packet_unit),
    packet_unit["id"]
  );
  if (typeof clear_tile_unit === "function") {
    clear_tile_unit(punit);
  }
  if (punit == null && game_find_unit_by_number(packet_unit["id"]) != null) {
    handle_unit_remove(packet_unit["id"]);
  }
  if (punit != null) indexToTile(punit["tile"]);
  if (store.units[packet_unit["id"]] == null) {
    if (should_ask_server_for_actions(packet_unit)) {
      action_decision_handle(packet_unit);
    }
    packet_unit["anim_list"] = [];
    store.units[packet_unit["id"]] = packet_unit;
    store.units[packet_unit["id"]]["facing"] = 6;
  } else {
    if ((punit["action_decision_want"] !== packet_unit["action_decision_want"] || punit["action_decision_tile"] !== packet_unit["action_decision_tile"]) && should_ask_server_for_actions(packet_unit)) {
      action_decision_handle(packet_unit);
    }
    if (typeof update_unit_anim_list === "function") {
      update_unit_anim_list(store.units[packet_unit["id"]], packet_unit);
    }
    Object.assign(store.units[packet_unit["id"]], packet_unit);
    if (current_focus$1 != null) {
      for (let i2 = 0; i2 < current_focus$1.length; i2++) {
        if (current_focus$1[i2]["id"] === packet_unit["id"]) {
          Object.assign(current_focus$1[i2], packet_unit);
        }
      }
    }
  }
  update_tile_unit(store.units[packet_unit["id"]]);
  if (current_focus$1 != null && current_focus$1.length > 0 && current_focus$1[0]["id"] === packet_unit["id"]) {
    update_active_units_dialog();
    update_unit_order_commands();
    if (current_focus$1[0]["done_moving"] !== packet_unit["done_moving"]) {
      update_unit_focus();
    }
  }
}
function handle_unit_combat_info(packet) {
  const attacker = store.units[packet["attacker_unit_id"]];
  const defender = store.units[packet["defender_unit_id"]];
  const attacker_hp = packet["attacker_hp"];
  const defender_hp = packet["defender_hp"];
  if (attacker_hp === 0 && is_unit_visible(attacker)) {
    explosion_anim_map[attacker["tile"]] = 25;
  }
  if (defender_hp === 0 && is_unit_visible(defender)) {
    explosion_anim_map[defender["tile"]] = 25;
  }
}
function handle_unit_action_answer(packet) {
  const diplomat_id = packet["actor_id"];
  const target_id = packet["target_id"];
  const cost = packet["cost"];
  const action_type = packet["action_type"];
  const target_city = game_find_city_by_number(target_id);
  const target_unit = game_find_unit_by_number(target_id);
  const actor_unit = game_find_unit_by_number(diplomat_id);
  if (actor_unit == null) {
    console.log("Bad actor unit (" + diplomat_id + ") in unit action answer.");
    act_sel_queue_done(diplomat_id);
    return;
  }
  if (packet["request_kind"] !== REQEST_PLAYER_INITIATED$1) {
    console.log("handle_unit_action_answer(): was asked to not disturb the player. Unimplemented.");
  }
  if (action_type === ACTION_SPY_BRIBE_UNIT) {
    if (target_unit == null) {
      console.log("Bad target unit (" + target_id + ") in unit action answer.");
      act_sel_queue_done(diplomat_id);
    } else {
      popup_bribe_dialog(actor_unit, target_unit, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_SPY_INCITE_CITY || action_type === ACTION_SPY_INCITE_CITY_ESC) {
    if (target_city == null) {
      console.log("Bad target city (" + target_id + ") in unit action answer.");
      act_sel_queue_done(diplomat_id);
    } else {
      popup_incite_dialog(actor_unit, target_city, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_UPGRADE_UNIT) {
    if (target_city == null) {
      console.log("Bad target city (" + target_id + ") in unit action answer.");
      act_sel_queue_done(diplomat_id);
    } else {
      popup_unit_upgrade_dlg(actor_unit, target_city, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_COUNT) {
    console.log("unit_action_answer: Server refused to respond.");
  } else {
    console.log("unit_action_answer: Invalid answer.");
  }
  act_sel_queue_done(diplomat_id);
}
function handle_unit_actions(packet) {
  const actor_unit_id = packet["actor_unit_id"];
  const target_unit_id = packet["target_unit_id"];
  const target_city_id = packet["target_city_id"];
  const target_tile_id = packet["target_tile_id"];
  const target_extra_id = packet["target_extra_id"];
  const action_probabilities = packet["action_probabilities"];
  const pdiplomat = game_find_unit_by_number(actor_unit_id);
  const target_unit = game_find_unit_by_number(target_unit_id);
  const target_city = game_find_city_by_number(target_city_id);
  const ptile = indexToTile(target_tile_id);
  const target_extra = extraByNumber(target_extra_id);
  let hasActions = false;
  if (pdiplomat != null && ptile != null) {
    action_probabilities.forEach(function(prob) {
      if (actionProbPossible(prob)) {
        hasActions = true;
      }
    });
  }
  switch (packet["request_kind"]) {
    case REQEST_PLAYER_INITIATED$1:
      if (hasActions) {
        popup_action_selection(
          pdiplomat,
          action_probabilities,
          ptile,
          target_extra,
          target_unit,
          target_city
        );
      } else {
        action_selection_no_longer_in_progress(actor_unit_id);
        action_decision_clear_want(actor_unit_id);
        action_selection_next_in_focus(actor_unit_id);
      }
      break;
    case REQEST_BACKGROUND_REFRESH:
      action_selection_refresh(
        pdiplomat,
        target_city,
        target_unit,
        ptile,
        target_extra,
        action_probabilities
      );
      break;
    case REQEST_BACKGROUND_FAST_AUTO_ATTACK:
      action_decision_maybe_auto(
        pdiplomat,
        action_probabilities,
        ptile
      );
      break;
    default:
      console.log(
        "handle_unit_actions(): unrecognized request_kind %d",
        packet["request_kind"]
      );
      break;
  }
}
function handle_diplomacy_init_meeting(packet) {
  diplomacy_clause_map[packet["counterpart"]] = [];
  show_diplomacy_dialog(packet["counterpart"]);
  show_diplomacy_clauses(packet["counterpart"]);
}
function handle_diplomacy_cancel_meeting(packet) {
  cancel_meeting(packet["counterpart"]);
}
function handle_diplomacy_create_clause(packet) {
  const counterpart_id = packet["counterpart"];
  if (diplomacy_clause_map[counterpart_id] == null) {
    diplomacy_clause_map[counterpart_id] = [];
  }
  diplomacy_clause_map[counterpart_id].push(packet);
  show_diplomacy_clauses(counterpart_id);
}
function handle_diplomacy_remove_clause(packet) {
  remove_clause(packet);
}
function handle_diplomacy_accept_treaty(packet) {
  accept_treaty(
    packet["counterpart"],
    packet["I_accepted"],
    packet["other_accepted"]
  );
}
let page_msg = {};
function handle_chat_msg(packet) {
  let message = packet["message"];
  const conn_id = packet["conn_id"];
  const event = packet["event"];
  const ptile = packet["tile"];
  if (message == null) return;
  if (event == null || event < 0 || event >= E_UNDEFINED) {
    console.log("Undefined message event type");
    console.log(packet);
    packet["event"] = E_UNDEFINED;
  }
  if (store.connections[conn_id] != null) {
    if (!isLongturn()) {
      message = "<b>" + store.connections[conn_id]["username"] + ":</b>" + message;
    }
  } else if (packet["event"] === E_SCRIPT) {
    const regxp = /\n/gi;
    message = message.replace(regxp, "<br>\n");
    showDialogMessage("Message for you:", message);
    return;
  } else {
    if (message.indexOf("/metamessage") !== -1) return;
    if (message.indexOf("Metaserver message string") !== -1) return;
    if (ptile != null && ptile > 0) {
      message = "<span class='chatbox_text_tileinfo' onclick='center_tile_id(" + ptile + ");'>" + message + "</span>";
    }
  }
  packet["message"] = message;
  add_chatbox_text(packet);
}
function handle_early_chat_msg(packet) {
  handle_chat_msg(packet);
}
function handle_page_msg(packet) {
  page_msg["headline"] = packet["headline"];
  page_msg["caption"] = packet["caption"];
  page_msg["event"] = packet["event"];
  page_msg["missing_parts"] = packet["parts"];
  page_msg["message"] = "";
}
function handle_page_msg_part(packet) {
  page_msg["message"] = page_msg["message"] + packet["lines"];
  page_msg["missing_parts"]--;
  if (page_msg["missing_parts"] === 0) {
    const regxp = /\n/gi;
    page_msg["message"] = page_msg["message"].replace(regxp, "<br>\n");
    showDialogMessage(page_msg["headline"], page_msg["message"]);
    page_msg = {};
  }
}
function handle_web_goto_path(packet) {
  if (goto_active) {
    update_goto_path(packet);
  }
}
const packet_hand_table = {
  0: handle_processing_started,
  1: handle_processing_finished,
  21: handle_investigate_started,
  22: handle_investigate_finished,
  5: handle_server_join_reply,
  6: handle_authentication_req,
  8: handle_server_shutdown,
  12: handle_endgame_report,
  223: handle_endgame_player,
  15: handle_tile_info,
  16: handle_game_info,
  255: handle_calendar_info,
  244: handle_timeout_info,
  17: handle_map_info,
  18: handle_nuke_tile_info,
  19: handle_team_name_info,
  238: handle_achievement_info,
  25: handle_chat_msg,
  28: handle_early_chat_msg,
  27: handle_connect_msg,
  29: handle_server_info,
  30: handle_city_remove,
  31: handle_city_info,
  46: handle_city_nationalities,
  514: handle_city_update_counters,
  32: handle_city_short_info,
  249: handle_trade_route_info,
  44: handle_city_name_suggestion_info,
  45: handle_city_sabotage_list,
  138: handle_city_rally_point,
  241: handle_worker_task,
  50: handle_player_remove,
  51: handle_player_info,
  58: handle_player_attribute_chunk,
  59: handle_player_diplstate,
  60: handle_research_info,
  66: handle_unknown_research,
  62: handle_unit_remove,
  63: handle_unit_info,
  64: handle_unit_short_info,
  65: handle_unit_combat_info,
  85: handle_unit_action_answer,
  90: handle_unit_actions,
  96: handle_diplomacy_init_meeting,
  98: handle_diplomacy_cancel_meeting,
  100: handle_diplomacy_create_clause,
  102: handle_diplomacy_remove_clause,
  104: handle_diplomacy_accept_treaty,
  110: handle_page_msg,
  250: handle_page_msg_part,
  115: handle_conn_info,
  116: handle_conn_ping_info,
  88: handle_conn_ping,
  125: handle_end_phase,
  126: handle_start_phase,
  127: handle_new_year,
  128: handle_begin_turn,
  129: handle_end_turn,
  130: handle_freeze_client,
  131: handle_thaw_client,
  137: handle_spaceship_info,
  140: handle_ruleset_unit,
  228: handle_ruleset_unit_bonus,
  229: handle_ruleset_unit_flag,
  230: handle_ruleset_unit_class_flag,
  141: handle_ruleset_game,
  142: handle_ruleset_specialist,
  143: handle_ruleset_government_ruler_title,
  144: handle_ruleset_tech,
  9: handle_ruleset_tech_class,
  234: handle_ruleset_tech_flag,
  145: handle_ruleset_government,
  146: handle_ruleset_terrain_control,
  225: handle_rulesets_ready,
  236: handle_ruleset_nation_sets,
  147: handle_ruleset_nation_groups,
  148: handle_ruleset_nation,
  237: handle_nation_availability,
  239: handle_ruleset_style,
  149: handle_ruleset_city,
  150: handle_ruleset_building,
  20: handle_ruleset_impr_flag,
  151: handle_ruleset_terrain,
  231: handle_ruleset_terrain_flag,
  152: handle_ruleset_unit_class,
  232: handle_ruleset_extra,
  226: handle_ruleset_extra_flag,
  153: handle_ruleset_base,
  220: handle_ruleset_road,
  248: handle_ruleset_goods,
  224: handle_ruleset_disaster,
  233: handle_ruleset_achievement,
  227: handle_ruleset_trade,
  246: handle_ruleset_action,
  235: handle_ruleset_action_enabler,
  252: handle_ruleset_action_auto,
  513: handle_ruleset_counter,
  240: handle_ruleset_music,
  243: handle_ruleset_multiplier,
  512: handle_ruleset_clause,
  155: handle_ruleset_control,
  251: handle_ruleset_summary,
  247: handle_ruleset_description_part,
  161: handle_single_want_hack_reply,
  162: handle_ruleset_choices,
  163: handle_game_load,
  164: handle_server_setting_control,
  165: handle_server_setting_const,
  166: handle_server_setting_bool,
  167: handle_server_setting_int,
  168: handle_server_setting_str,
  169: handle_server_setting_enum,
  170: handle_server_setting_bitwise,
  253: handle_set_topology,
  175: handle_ruleset_effect,
  177: handle_ruleset_resource,
  180: handle_scenario_info,
  13: handle_scenario_description,
  185: handle_vote_new,
  186: handle_vote_update,
  187: handle_vote_remove,
  188: handle_vote_resolve,
  204: handle_edit_startpos,
  205: handle_edit_startpos_full,
  219: handle_edit_object_created,
  245: handle_play_music,
  515: handle_popup_image,
  256: handle_web_city_info_addition,
  259: handle_web_player_info_addition,
  260: handle_web_ruleset_unit_addition,
  288: handle_web_goto_path
};
packet_hand_table[290] = handle_web_info_text_message;
function client_handle_packet(packets) {
  if (packets == null) return;
  try {
    for (let i2 = 0; i2 < packets.length; i2++) {
      if (packets[i2] != null) {
        const handler = packet_hand_table[packets[i2].pid];
        if (handler) {
          handler(packets[i2]);
        } else {
          console.warn("No handler for packet pid=" + packets[i2].pid);
        }
      }
    }
    if (packets.length > 0) {
      if (store.debugActive) clinet_debug_collect();
      if (window.renderer === RENDERER_2DCANVAS$1) update_map_canvas_check();
    }
  } catch (e2) {
    console.error(e2);
  }
}
const FC_ACTIVITY_IDLE = ACTIVITY_IDLE;
const FC_SSA_NONE = ServerSideAgent.NONE;
const FC_IDENTITY_NUMBER_ZERO$1 = IDENTITY_NUMBER_ZERO;
const FC_EXTRA_NONE$1 = EXTRA_NONE$1;
const FC_B_AIRPORT_NAME = B_AIRPORT_NAME;
const FC_TECH_UNKNOWN = TECH_UNKNOWN;
const FC_TECH_KNOWN = TECH_KNOWN$1;
function showEl(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "";
}
function hideEl(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}
const tile_units_func = tile_units;
const map_city_tile = cityTile;
function FC_EXTRA_ROAD() {
  return window.EXTRA_ROAD ?? 0;
}
function FC_EXTRA_RIVER() {
  return window.EXTRA_RIVER ?? 1;
}
function FC_EXTRA_RAIL() {
  return window.EXTRA_RAIL ?? 2;
}
function FC_EXTRA_MAGLEV() {
  return window.EXTRA_MAGLEV ?? 3;
}
function FC_EXTRA_MINE() {
  return window.EXTRA_MINE ?? 4;
}
function FC_EXTRA_POLLUTION() {
  return window.EXTRA_POLLUTION ?? 5;
}
function FC_EXTRA_FALLOUT() {
  return window.EXTRA_FALLOUT ?? 6;
}
function FC_EXTRA_IRRIGATION() {
  return window.EXTRA_IRRIGATION ?? 7;
}
function FC_EXTRA_FARMLAND() {
  return window.EXTRA_FARMLAND ?? 8;
}
function get_focus_unit_on_tile(ptile) {
  const funits = get_units_in_focus();
  if (funits == null) return null;
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    if (punit["tile"] == ptile["index"]) {
      return punit;
    }
  }
  return null;
}
function unit_is_in_focus$1(cunit) {
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    if (punit["id"] == cunit["id"]) {
      return true;
    }
  }
  return false;
}
function get_units_in_focus() {
  return current_focus$1;
}
function unit_focus_urgent(punit) {
  if (punit == null || punit["activity"] == null) {
    console.log("unit_focus_urgent(): not a unit");
    console.log(punit);
    return;
  }
  urgent_focus_queue.push(punit);
}
function update_unit_focus() {
  if (active_city != null) return;
  if (C_S_RUNNING != clientState()) return;
  if (!can_ask_server_for_actions()) {
    if (get_units_in_focus().length < 1) {
      console.log(
        "update_unit_focus(): action selection dialog open for unit %d but unit not in focus?",
        action_selection_in_progress_for
      );
    } else {
      return;
    }
  }
  const funits = get_units_in_focus();
  for (let i2 = 0; i2 < funits.length; i2++) {
    const punit = funits[i2];
    if (punit["movesleft"] > 0 && !punit["done_moving"] && punit["ssa_controller"] == FC_SSA_NONE && punit["activity"] == FC_ACTIVITY_IDLE) {
      return;
    }
  }
  advance_unit_focus();
}
function advance_unit_focus() {
  let candidate = null;
  let i2;
  if (clientIsObserver()) return;
  if (urgent_focus_queue.length > 0) {
    const focus_tile = current_focus$1 != null && current_focus$1.length > 0 ? current_focus$1[0]["tile"] : -1;
    for (i2 = 0; i2 < urgent_focus_queue.length; i2++) {
      const punit = store.units[urgent_focus_queue[i2]["id"]];
      if ((FC_ACTIVITY_IDLE != punit.activity || punit.has_orders) && !should_ask_server_for_actions(punit)) {
        setUrgentFocusQueue(unit_list_without(urgent_focus_queue, punit));
        i2--;
      } else if (-1 == focus_tile || focus_tile == punit["tile"]) {
        candidate = punit;
        break;
      } else if (null == candidate) {
        candidate = punit;
      }
    }
    if (null != candidate) {
      setUrgentFocusQueue(unit_list_without(urgent_focus_queue, candidate));
    }
  }
  if (candidate == null) {
    candidate = find_best_focus_candidate(false);
  }
  if (candidate == null) {
    candidate = find_best_focus_candidate(true);
  }
  if (candidate != null) {
    set_unit_focus_and_redraw(candidate);
  } else {
    setCurrentFocus([]);
    update_active_units_dialog();
    const gameUnitOrdersDefault = document.getElementById("game_unit_orders_default");
    if (gameUnitOrdersDefault) gameUnitOrdersDefault.style.display = "none";
    if (store.gameInfo && store.gameInfo["turn"] <= 1) {
      for (const city_id_str in store.cities) {
        const city_id = parseInt(city_id_str);
        const pcity = store.cities[city_id];
        if (cityOwnerPlayerId(pcity) == clientPlaying().playerno) {
          center_tile_mapcanvas(map_city_tile(pcity));
          break;
        }
      }
    }
    const turnDoneBtn = document.getElementById("turn_done_button");
    if (turnDoneBtn) turnDoneBtn.innerHTML = "<span style='color: green;'>✅</span> Turn Done";
    if (!end_turn_info_message_shown) {
      setEndTurnInfoMessageShown(true);
      message_log.update({ event: E_BEGINNER_HELP, message: 'All units have moved, click the "Turn Done" button to end your turn.' });
    }
  }
}
function update_unit_order_commands() {
  let i2;
  let punit;
  let ptype;
  let pcity;
  let ptile;
  let unit_actions = {};
  const funits = get_units_in_focus();
  for (i2 = 0; i2 < funits.length; i2++) {
    punit = funits[i2];
    ptile = indexToTile(punit["tile"]);
    if (ptile == null) continue;
    pcity = tileCity(ptile);
    if (pcity != null) {
      unit_actions["show_city"] = { name: "Show city" };
    }
  }
  for (i2 = 0; i2 < funits.length; i2++) {
    punit = funits[i2];
    ptype = unit_type(punit);
    ptile = indexToTile(punit["tile"]);
    if (ptile == null) continue;
    pcity = tileCity(ptile);
    if (utype_can_do_action$1(ptype, ACTION_FOUND_CITY) && pcity == null) {
      showEl("order_build_city");
      unit_actions["build"] = { name: "Build city (B)" };
    } else if (utype_can_do_action$1(ptype, ACTION_JOIN_CITY) && pcity != null) {
      showEl("order_build_city");
      unit_actions["build"] = { name: "Join city (B)" };
    } else {
      hideEl("order_build_city");
    }
    if (ptype["name"] == "Explorer") {
      unit_actions["explore"] = { name: "Auto explore (X)" };
    }
  }
  Object.assign(unit_actions, {
    "goto": { name: "Unit goto (G)" },
    "tile_info": { name: "Tile info" }
  });
  for (i2 = 0; i2 < funits.length; i2++) {
    punit = funits[i2];
    ptype = unit_type(punit);
    ptile = indexToTile(punit["tile"]);
    if (ptile == null) continue;
    pcity = tileCity(ptile);
    if (ptype["name"] == "Settlers" || ptype["name"] == "Workers" || ptype["name"] == "Engineers") {
      if (ptype["name"] == "Settlers") unit_actions["autoworkers"] = { name: "Auto settler (A)" };
      if (ptype["name"] == "Workers") unit_actions["autoworkers"] = { name: "Auto workers (A)" };
      if (ptype["name"] == "Engineers") unit_actions["autoworkers"] = { name: "Auto engineers (A)" };
      if (!tileHasExtra(ptile, FC_EXTRA_ROAD())) {
        hideEl("order_railroad");
        hideEl("order_maglev");
        if (!(tileHasExtra(ptile, FC_EXTRA_RIVER()) && playerInventionState(clientPlaying(), techIdByName("Bridge Building")) == FC_TECH_UNKNOWN)) {
          unit_actions["road"] = { name: "Build road (R)" };
          showEl("order_road");
        } else {
          hideEl("order_road");
        }
      } else if (!tileHasExtra(ptile, FC_EXTRA_RAIL()) && playerInventionState(
        clientPlaying(),
        techIdByName("Railroad")
      ) == FC_TECH_KNOWN && tileHasExtra(ptile, FC_EXTRA_ROAD())) {
        hideEl("order_road");
        hideEl("order_maglev");
        showEl("order_railroad");
        unit_actions["railroad"] = { name: "Build railroad (R)" };
      } else if (typeof window.EXTRA_MAGLEV !== "undefined" && !tileHasExtra(ptile, FC_EXTRA_MAGLEV()) && playerInventionState(
        clientPlaying(),
        techIdByName("Superconductors")
      ) == FC_TECH_KNOWN && tileHasExtra(ptile, FC_EXTRA_RAIL())) {
        hideEl("order_road");
        hideEl("order_railroad");
        showEl("order_maglev");
        unit_actions["maglev"] = { name: "Build maglev (R)" };
      } else {
        hideEl("order_road");
        hideEl("order_railroad");
        hideEl("order_maglev");
      }
      hideEl("order_fortify");
      hideEl("order_sentry");
      hideEl("order_explore");
      showEl("order_auto_workers");
      showEl("order_clean");
      if (!tileHasExtra(ptile, FC_EXTRA_MINE()) && tileTerrain(ptile)["mining_time"] > 0) {
        showEl("order_mine");
        unit_actions["mine"] = { name: "Mine (M)" };
      } else {
        hideEl("order_mine");
      }
      if (tileHasExtra(ptile, FC_EXTRA_POLLUTION()) || tileHasExtra(ptile, FC_EXTRA_FALLOUT())) {
        showEl("order_clean");
        unit_actions["clean"] = { name: "Remove pollution (P)" };
      } else {
        hideEl("order_clean");
      }
      if (tileTerrain(ptile)["cultivate_time"] > 0) {
        showEl("order_forest_remove");
        unit_actions["cultivate"] = { name: "Cultivate (I)" };
      } else {
        hideEl("order_forest_remove");
      }
      if (tileTerrain(ptile)["irrigation_time"] > 0) {
        if (!tileHasExtra(ptile, FC_EXTRA_IRRIGATION())) {
          showEl("order_irrigate");
          hideEl("order_build_farmland");
          unit_actions["irrigation"] = { name: "Irrigation (I)" };
        } else if (!tileHasExtra(ptile, FC_EXTRA_FARMLAND()) && playerInventionState(clientPlaying(), techIdByName("Refrigeration")) == FC_TECH_KNOWN) {
          showEl("order_build_farmland");
          hideEl("order_irrigate");
          unit_actions["irrigation"] = { name: "Build farmland (I)" };
        } else {
          hideEl("order_irrigate");
          hideEl("order_build_farmland");
        }
      } else {
        hideEl("order_irrigate");
        hideEl("order_build_farmland");
      }
      if (tileTerrain(ptile)["plant_time"] > 0) {
        showEl("order_forest_add");
        unit_actions["plant"] = { name: "Plant (M)" };
      } else {
        hideEl("order_forest_add");
      }
      if (playerInventionState(clientPlaying(), techIdByName("Construction")) == FC_TECH_KNOWN) {
        unit_actions["fortress"] = { name: stringUnqualify(terrain_control["gui_type_base0"]) + " (Shift-F)" };
      }
      if (playerInventionState(clientPlaying(), techIdByName("Radio")) == FC_TECH_KNOWN) {
        unit_actions["airbase"] = { name: stringUnqualify(terrain_control["gui_type_base1"]) + " (E)" };
      }
    } else {
      hideEl("order_road");
      hideEl("order_railroad");
      hideEl("order_mine");
      hideEl("order_irrigate");
      hideEl("order_build_farmland");
      showEl("order_fortify");
      hideEl("order_auto_workers");
      showEl("order_sentry");
      showEl("order_explore");
      hideEl("order_clean");
      unit_actions["fortify"] = { name: "Fortify (F)" };
    }
    unit_actions["action_selection"] = { name: "Do... (D)" };
    if (utype_can_do_action$1(ptype, ACTION_TRANSFORM_TERRAIN)) {
      showEl("order_transform");
      unit_actions["transform"] = { name: "Transform terrain (O)" };
    } else {
      hideEl("order_transform");
    }
    if (utype_can_do_action$1(ptype, ACTION_NUKE)) {
      showEl("order_nuke");
      unit_actions["nuke"] = { name: "Detonate Nuke At (Shift-N)" };
    } else {
      hideEl("order_nuke");
    }
    if (utype_can_do_action_result(ptype, ACTRES_PARADROP) || utype_can_do_action_result(ptype, ACTRES_PARADROP_CONQUER)) {
      showEl("order_paradrop");
      unit_actions["paradrop"] = { name: "Paradrop" };
    } else {
      hideEl("order_paradrop");
    }
    if (!clientIsObserver() && clientPlaying() != null && get_what_can_unit_pillage_from(punit, ptile).length > 0 && (pcity == null || cityOwnerPlayerId(pcity) !== clientPlaying().playerno)) {
      showEl("order_pillage");
      unit_actions["pillage"] = { name: "Pillage (Shift-P)" };
    } else {
      hideEl("order_pillage");
    }
    if (pcity == null || punit["homecity"] === 0 || punit["homecity"] === pcity["id"]) {
      hideEl("order_change_homecity");
    } else if (punit["homecity"] != pcity["id"]) {
      showEl("order_change_homecity");
      unit_actions["homecity"] = { name: "Change homecity of unit (H)" };
    }
    if (pcity != null && cityHasBuilding(pcity, improvement_id_by_name(FC_B_AIRPORT_NAME))) {
      unit_actions["airlift"] = { name: "Airlift (Shift-L)" };
    }
    if (pcity != null && ptype != null && store.unitTypes[ptype["obsoleted_by"]] != null && can_player_build_unit_direct(clientPlaying(), store.unitTypes[ptype["obsoleted_by"]])) {
      unit_actions["upgrade"] = { name: "Upgrade unit (U)" };
    }
    if (ptype != null && ptype["name"] != "Explorer") {
      unit_actions["explore"] = { name: "Auto explore (X)" };
    }
    if (pcity != null) {
      const units_on_tile2 = tile_units_func(ptile) || [];
      for (let r2 = 0; r2 < units_on_tile2.length; r2++) {
        const tunit = units_on_tile2[r2];
        if (tunit["id"] == punit["id"]) continue;
        const ntype = unit_type(tunit);
        if (ntype != null && ntype["transport_capacity"] > 0) unit_actions["unit_load"] = { name: "Load on transport (L)" };
      }
    }
    const units_on_tile = tile_units_func(ptile) || [];
    if (ptype["transport_capacity"] > 0 && units_on_tile.length >= 2) {
      for (let r2 = 0; r2 < units_on_tile.length; r2++) {
        const tunit = units_on_tile[r2];
        if (tunit["transported"]) {
          unit_actions["unit_show_cargo"] = { name: "Activate cargo units" };
          if (pcity != null) unit_actions["unit_unload"] = { name: "Unload units from transport (T)" };
        }
      }
    }
    if (punit.activity != FC_ACTIVITY_IDLE || punit.ssa_controller != FC_SSA_NONE || punit.has_orders) {
      unit_actions["idle"] = { name: "Cancel orders (Shift-J)" };
    } else {
      unit_actions["noorders"] = { name: "No orders (J)" };
    }
  }
  Object.assign(unit_actions, {
    "sentry": { name: "Sentry (S)" },
    "wait": { name: "Wait (W)" },
    "disband": { name: "Disband (Shift-D)" }
  });
  if (isTouchDevice()) {
    document.querySelectorAll(".context-menu-list").forEach((el) => el.style.width = "600px");
    document.querySelectorAll(".context-menu-item").forEach((el) => el.style.fontSize = "220%");
  }
  document.querySelectorAll(".context-menu-list").forEach((el) => el.style.zIndex = "5000");
  return unit_actions;
}
function init_game_unit_panel() {
  setUnitpanelActive(true);
  const jq = window.$;
  const $panel = jq("#game_unit_panel");
  $panel.attr("title", "Units");
  $panel.dialog({
    bgiframe: true,
    modal: false,
    width: "370px",
    height: "auto",
    resizable: false,
    closeOnEscape: false,
    dialogClass: "unit_dialog  no-close",
    position: { my: "right bottom", at: "right bottom", of: window, within: jq("#tabs-map") },
    appendTo: "#tabs-map",
    close: function(event, ui) {
      setUnitpanelActive(false);
    }
  }).dialogExtend({
    "minimizable": true,
    "closable": false,
    "minimize": function(evt, dlg) {
      setGameUnitPanelState($panel.dialogExtend("state"));
    },
    "restore": function(evt, dlg) {
      setGameUnitPanelState($panel.dialogExtend("state"));
    },
    "icons": {
      "minimize": "ui-icon-circle-minus",
      "restore": "ui-icon-bullet"
    }
  });
  $panel.dialog("open");
  $panel.parent().css("overflow", "hidden");
  if (game_unit_panel_state == "minimized") $panel.dialogExtend("minimize");
}
function find_best_focus_candidate(accept_current) {
  let punit;
  let i2;
  if (clientIsObserver()) return null;
  const sorted_units = [];
  for (const unit_id_str in store.units) {
    const unit_id = parseInt(unit_id_str);
    punit = store.units[unit_id];
    if (clientPlaying() != null && punit["owner"] == clientPlaying().playerno) {
      sorted_units.push(punit);
    }
  }
  sorted_units.sort(unit_distance_compare);
  for (i2 = 0; i2 < sorted_units.length; i2++) {
    punit = sorted_units[i2];
    if ((!unit_is_in_focus$1(punit) || accept_current) && clientPlaying() != null && punit["owner"] == clientPlaying().playerno && (punit["activity"] == FC_ACTIVITY_IDLE && !punit["done_moving"] && punit["movesleft"] > 0 || should_ask_server_for_actions(punit)) && punit["ssa_controller"] == FC_SSA_NONE && waiting_units_list.indexOf(punit["id"]) < 0 && !punit["transported"]) {
      return punit;
    }
  }
  for (i2 = 0; i2 < waiting_units_list.length; i2++) {
    punit = game_find_unit_by_number(waiting_units_list[i2]);
    if (punit != null && punit["movesleft"] > 0) {
      waiting_units_list.splice(i2, 1);
      return punit;
    }
  }
  return null;
}
function unit_distance_compare(unit_a, unit_b) {
  if (unit_a == null || unit_b == null) return 0;
  const ptile_a = indexToTile(unit_a["tile"]);
  const ptile_b = indexToTile(unit_b["tile"]);
  if (ptile_a == null || ptile_b == null) return 0;
  if (ptile_a["x"] == ptile_b["x"] && ptile_a["y"] == ptile_b["y"]) {
    return 0;
  } else if (ptile_a["x"] > ptile_b["x"] || ptile_a["y"] > ptile_b["y"]) {
    return 1;
  } else {
    return -1;
  }
}
function set_unit_focus(punit) {
  setCurrentFocus([]);
  if (punit == null) {
    setCurrentFocus([]);
  } else {
    current_focus$1[0] = punit;
    action_selection_next_in_focus(FC_IDENTITY_NUMBER_ZERO$1);
  }
  update_active_units_dialog();
  update_unit_order_commands();
}
function set_unit_focus_and_redraw(punit) {
  setCurrentFocus([]);
  if (punit == null) {
    setCurrentFocus([]);
  } else {
    current_focus$1[0] = punit;
    action_selection_next_in_focus(FC_IDENTITY_NUMBER_ZERO$1);
  }
  auto_center_on_focus_unit();
  update_active_units_dialog();
  update_unit_order_commands();
  const ordersDefault = document.getElementById("game_unit_orders_default");
  if (current_focus$1.length > 0 && ordersDefault) ordersDefault.style.display = "";
}
function set_unit_focus_and_activate(punit) {
  set_unit_focus_and_redraw(punit);
  request_new_unit_activity(punit, FC_ACTIVITY_IDLE, FC_EXTRA_NONE$1);
}
function city_dialog_activate_unit(punit) {
  request_new_unit_activity(punit, FC_ACTIVITY_IDLE, FC_EXTRA_NONE$1);
  close_city_dialog();
  set_unit_focus_and_redraw(punit);
}
function auto_center_on_focus_unit() {
  if (active_city != null) return;
  const ptile = find_a_focus_unit_tile_to_center_on();
  if (ptile != null && auto_center_on_unit) {
    center_tile_mapcanvas(ptile);
    window.update_unit_position?.(ptile);
  }
}
function find_a_focus_unit_tile_to_center_on() {
  const funit = current_focus$1[0];
  if (funit == null) return null;
  return indexToTile(funit["tile"]);
}
function find_visible_unit(ptile) {
  let i2;
  if (ptile == null || unit_list_size(tile_units_func(ptile)) == 0) {
    return null;
  }
  const pfocus = get_focus_unit_on_tile(ptile);
  if (pfocus != null) {
    return pfocus;
  }
  if (tileCity(ptile) != null) {
    return null;
  }
  const vunits = tile_units_func(ptile) || [];
  for (i2 = 0; i2 < vunits.length; i2++) {
    const aunit = vunits[i2];
    if (aunit["anim_list"] != null && aunit["anim_list"].length > 0) {
      return aunit;
    }
  }
  for (i2 = 0; i2 < vunits.length; i2++) {
    const tunit = vunits[i2];
    if (!tunit["transported"]) {
      return tunit;
    }
  }
  return (tile_units_func(ptile) || [])[0];
}
function get_drawable_unit(ptile, citymode) {
  const punit = find_visible_unit(ptile);
  if (punit == null) return null;
  if (!unit_is_in_focus$1(punit) || current_focus$1.length > 0) {
    return punit;
  } else {
    return null;
  }
}
function update_active_units_dialog() {
  let unit_info_html = "";
  let ptile = null;
  let punits = [];
  let width = 0;
  if (clientIsObserver() || !unitpanel_active) return;
  if (current_focus$1.length == 1) {
    ptile = indexToTile(current_focus$1[0]["tile"]);
    punits.push(current_focus$1[0]);
    const tmpunits = tile_units(ptile) || [];
    for (let i2 = 0; i2 < tmpunits.length; i2++) {
      const kunit = tmpunits[i2];
      if (kunit["id"] == current_focus$1[0]["id"]) continue;
      punits.push(kunit);
    }
  } else if (current_focus$1.length > 1) {
    punits = current_focus$1;
  }
  for (let i2 = 0; i2 < punits.length; i2++) {
    const punit = punits[i2];
    const sprite = get_unit_image_sprite(punit);
    const active = current_focus$1.length > 1 || current_focus$1[0]["id"] == punit["id"];
    unit_info_html += "<div id='unit_info_div' class='" + (active ? "current_focus_unit" : "") + "'><div id='unit_info_image' onclick='set_unit_focus_and_redraw(units[" + punit["id"] + "])'  style='background: transparent url(" + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;'></div></div>";
    width = sprite["width"];
  }
  if (current_focus$1.length == 1) {
    const aunit = current_focus$1[0];
    const ptype = unit_type(aunit);
    unit_info_html += "<div id='active_unit_info' title='" + (ptype ? ptype["helptext"] : "") + "'>";
    if (clientPlaying() != null && current_focus$1[0]["owner"] != clientPlaying().playerno) {
      unit_info_html += "<b>" + store.nations[store.players[current_focus$1[0]["owner"]]["nation"]]["adjective"] + "</b> ";
    }
    unit_info_html += "<b>" + (ptype ? ptype["name"] : "") + "</b>: ";
    if (get_unit_homecity_name(aunit) != null) {
      unit_info_html += " " + get_unit_homecity_name(aunit) + " ";
    }
    if (clientPlaying() != null && current_focus$1[0]["owner"] == clientPlaying().playerno) {
      unit_info_html += "<span>" + get_unit_moves_left(aunit) + "</span> ";
    }
    unit_info_html += "<br><span title='Attack strength'>A:" + (ptype ? ptype["attack_strength"] : 0) + "</span> <span title='Defense strength'>D:" + (ptype ? ptype["defense_strength"] : 0) + "</span> <span title='Firepower'>F:" + (ptype ? ptype["firepower"] : 0) + "</span> <span title='Health points'>H:" + aunit["hp"] + "/" + (ptype ? ptype["hp"] : 0) + "</span>";
    if (aunit["veteran"] > 0) {
      unit_info_html += " <span>Veteran: " + aunit["veteran"] + "</span>";
    }
    if (ptype && ptype["transport_capacity"] > 0) {
      unit_info_html += " <span>Transport: " + ptype["transport_capacity"] + "</span>";
    }
    unit_info_html += "</div>";
  } else if (current_focus$1.length >= 1 && clientPlaying() != null && current_focus$1[0]["owner"] != clientPlaying().playerno) {
    unit_info_html += "<div id='active_unit_info'>" + current_focus$1.length + " foreign units  (" + store.nations[store.players[current_focus$1[0]["owner"]]["nation"]]["adjective"] + ")</div> ";
  } else if (current_focus$1.length > 1) {
    unit_info_html += "<div id='active_unit_info'>" + current_focus$1.length + " units selected.</div> ";
  }
  const gameUnitInfo = document.getElementById("game_unit_info");
  if (gameUnitInfo) gameUnitInfo.innerHTML = unit_info_html;
  const panelEl = document.getElementById("game_unit_panel");
  const panelParent = panelEl?.parentElement;
  if (current_focus$1.length > 0) {
    let newwidth = 32 + punits.length * (width + 10);
    if (newwidth < 140) newwidth = 140;
    const newheight = 75 + normal_tile_height;
    if (panelParent) {
      panelParent.style.display = "";
      panelParent.style.width = newwidth + "px";
      panelParent.style.height = newheight + "px";
      panelParent.style.left = window.innerWidth - newwidth + "px";
      panelParent.style.top = window.innerHeight - newheight - 30 + "px";
      panelParent.style.background = "rgba(50,50,40,0.5)";
    }
    if (game_unit_panel_state == "minimized") {
      const jq = window.$;
      if (jq) jq("#game_unit_panel").dialogExtend("minimize");
    }
  } else {
    if (panelParent) panelParent.style.display = "none";
  }
  const activeUnitInfo = document.getElementById("active_unit_info");
  if (activeUnitInfo) {
    const jq = window.$;
    if (jq) jq(activeUnitInfo).tooltip();
  }
}
const USSDT_QUEUE = UnitSSDataType.QUEUE;
const ORDER_LAST = Order.LAST;
const ORDER_MOVE = Order.MOVE;
const ORDER_ACTION_MOVE = Order.ACTION_MOVE;
const ORDER_FULL_MP = Order.FULL_MP;
function order_wants_direction(order, act_id, ptile) {
  const action = window.actions[act_id];
  if (order == goto_last_order && action == null) {
    console.log("Asked to put invalid action " + act_id + " in an order.");
    return false;
  }
  switch (order) {
    case ORDER_MOVE:
    case ORDER_ACTION_MOVE:
      return true;
    case Order.PERFORM_ACTION:
      if (action["min_distance"] > 0) {
        return true;
      }
      if (action["max_distance"] < 1) {
        return false;
      }
      if (tileCity(ptile) != null || tile_units(ptile).length != 0) {
        return true;
      }
      return false;
    default:
      return false;
  }
}
function do_unit_paradrop_to(punit, ptile) {
  let act_id;
  let paradrop_action = null;
  const FC_ACTION_COUNT = ACTION_COUNT$1;
  for (act_id = 0; act_id < FC_ACTION_COUNT; act_id++) {
    const paction = actionByNumber(act_id);
    if (!(actionHasResult(paction, ACTRES_PARADROP_CONQUER) || actionHasResult(paction, ACTRES_PARADROP))) {
      continue;
    }
    if (utype_can_do_action$1(unit_type(punit), act_id)) {
      if (paradrop_action == null) {
        paradrop_action = paction;
      } else {
        sendUnitSscsSet(punit["id"], USSDT_QUEUE, ptile["index"]);
        return;
      }
    }
  }
  if (paradrop_action != null) {
    request_unit_do_action(
      paradrop_action["id"],
      punit["id"],
      ptile["index"]
    );
  }
}
function do_map_click(ptile, qtype, first_time_called) {
  let punit;
  let packet;
  let pcity;
  if (ptile == null || clientIsObserver()) return;
  if (current_focus$1.length > 0 && current_focus$1[0]["tile"] == ptile["index"]) {
    if (goto_active && !isTouchDevice()) {
      deactivate_goto(false);
    }
    if (window.renderer == RENDERER_2DCANVAS$1) {
      document.getElementById("canvas")?.dispatchEvent(new Event("contextmenu"));
    } else {
      document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
    }
    return;
  }
  const sunits = tile_units(ptile);
  pcity = tileCity(ptile);
  if (goto_active) {
    if (current_focus$1.length > 0) {
      for (let s2 = 0; s2 < current_focus$1.length; s2++) {
        punit = current_focus$1[s2];
        const goto_path = goto_request_map[punit["id"] + "," + ptile["x"] + "," + ptile["y"]];
        if (goto_path == null) {
          continue;
        }
        const old_tile = indexToTile(punit["tile"]);
        packet = {
          "unit_id": punit["id"],
          "src_tile": old_tile["index"],
          "length": goto_path["length"],
          "repeat": false,
          "vigilant": false,
          "dest_tile": ptile["index"]
        };
        const order = {
          "order": ORDER_LAST,
          "activity": ACTIVITY_LAST,
          "target": 0,
          "sub_target": 0,
          "action": ACTION_COUNT$1,
          "dir": -1
        };
        packet["orders"] = [];
        for (let i2 = 0; i2 < goto_path["length"]; i2++) {
          if (goto_path["dir"][i2] == -1) {
            order["order"] = ORDER_FULL_MP;
          } else if (i2 + 1 != goto_path["length"]) {
            order["order"] = ORDER_MOVE;
          } else {
            order["order"] = ORDER_ACTION_MOVE;
          }
          order["dir"] = goto_path["dir"][i2];
          order["activity"] = ACTIVITY_LAST;
          order["target"] = 0;
          order["sub_target"] = 0;
          order["action"] = ACTION_COUNT$1;
          packet["orders"][i2] = Object.assign({}, order);
        }
        if (goto_last_order != ORDER_LAST) {
          let pos;
          if (!order_wants_direction(
            goto_last_order,
            goto_last_action,
            ptile
          )) {
            pos = packet["length"];
            packet["length"] = packet["length"] + 1;
            order["order"] = ORDER_LAST;
            order["dir"] = -1;
            order["activity"] = ACTIVITY_LAST;
            order["target"] = 0;
            order["sub_target"] = 0;
            order["action"] = ACTION_COUNT$1;
          } else {
            pos = packet["length"] - 1;
          }
          order["order"] = goto_last_order;
          order["action"] = goto_last_action;
          order["target"] = ptile["index"];
          packet["orders"][pos] = Object.assign({}, order);
        }
        setGotoLastOrder(ORDER_LAST);
        setGotoLastAction(ACTION_COUNT$1);
        if (punit["id"] != goto_path["unit_id"]) {
          console.log("Error: Tried to order unit " + punit["id"] + " to move along a path made for unit " + goto_path["unit_id"]);
          return;
        }
        sendUnitOrders(packet);
        if (punit["movesleft"] > 0) {
          unit_move_sound_play(punit);
        } else if (!has_movesleft_warning_been_shown) {
          setHasMovesleftWarningBeenShown(true);
          const ptype = unit_type(punit);
          message_log.update({
            event: E_BAD_COMMAND,
            message: (ptype ? ptype["name"] : "Unit") + " has no moves left. Press turn done for the next turn."
          });
        }
      }
      clearGotoTiles();
    } else if (isTouchDevice()) {
      if (current_focus$1.length > 0) {
        request_goto_path(current_focus$1[0]["id"], ptile["x"], ptile["y"]);
        if (first_time_called) {
          setTimeout(function() {
            do_map_click(ptile, qtype, false);
          }, 250);
        }
        return;
      }
    }
    deactivate_goto(true);
    update_unit_focus();
  } else if (paradrop_active && current_focus$1.length > 0) {
    punit = current_focus$1[0];
    do_unit_paradrop_to(punit, ptile);
    setParadropActive(false);
  } else if (airlift_active && current_focus$1.length > 0) {
    punit = current_focus$1[0];
    pcity = tileCity(ptile);
    if (pcity != null) {
      request_unit_do_action(ACTION_AIRLIFT, punit["id"], pcity["id"]);
    }
    setAirliftActive(false);
  } else if (action_tgt_sel_active && current_focus$1.length > 0) {
    request_unit_act_sel_vs(ptile);
    setActionTgtSelActive(false);
  } else {
    if (pcity != null) {
      if (clientPlaying() != null && pcity["owner"] == clientPlaying().playerno) {
        if (sunits != null && sunits.length > 0 && sunits[0]["activity"] == ACTIVITY_IDLE) {
          set_unit_focus_and_redraw(sunits[0]);
          if (window.renderer == RENDERER_2DCANVAS$1) {
            document.getElementById("canvas")?.dispatchEvent(new Event("contextmenu"));
          } else {
            document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
          }
        } else if (!goto_active) {
          show_city_dialog(pcity);
        }
      }
      return;
    }
    if (sunits != null && sunits.length == 0) {
      set_unit_focus_and_redraw(null);
    } else if (sunits != null && sunits.length > 0) {
      if (clientPlaying() != null && sunits[0]["owner"] == clientPlaying().playerno) {
        if (sunits.length == 1) {
          const unit = sunits[0];
          set_unit_focus_and_activate(unit);
        } else {
          set_unit_focus_and_redraw(sunits[0]);
          update_active_units_dialog();
        }
        if (isTouchDevice()) {
          if (window.renderer == RENDERER_2DCANVAS$1) {
            document.getElementById("canvas")?.dispatchEvent(new Event("contextmenu"));
          } else {
            document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
          }
        }
      } else if (pcity == null) {
        setCurrentFocus(sunits);
        const guod = document.getElementById("game_unit_orders_default");
        if (guod) guod.style.display = "none";
        update_active_units_dialog();
      }
    }
  }
  setParadropActive(false);
  setAirliftActive(false);
  setActionTgtSelActive(false);
}
function find_active_dialog() {
  const permanent_widgets = ["game_overview_panel", "game_unit_panel", "game_chatbox_panel"];
  const dialogs = document.querySelectorAll(".ui-dialog");
  for (let i2 = 0; i2 < dialogs.length; i2++) {
    const dialog = dialogs[i2];
    if (dialog.style.display == "none") {
      continue;
    }
    const children = dialog.children;
    if (children.length >= 2 && permanent_widgets.indexOf(children[1].id) < 0) {
      return dialog;
    }
  }
  return null;
}
function activate_goto() {
  clearGotoTiles();
  activate_goto_last(ORDER_LAST, ACTION_COUNT$1);
}
function activate_goto_last(last_order, last_action) {
  setGotoActive(true);
  const canvasDiv = document.getElementById("canvas_div");
  if (canvasDiv) canvasDiv.style.cursor = "crosshair";
  setGotoLastOrder(last_order);
  setGotoLastAction(last_action);
  if (current_focus$1.length > 0) {
    if (intro_click_description) {
      if (isTouchDevice()) {
        message_log.update({
          event: E_BEGINNER_HELP,
          message: "Carefully drag unit to the tile you want it to go to."
        });
      } else {
        message_log.update({
          event: E_BEGINNER_HELP,
          message: "Click on the tile to send this unit to."
        });
      }
      setIntroClickDescription(false);
    }
  } else {
    message_log.update({
      event: E_BEGINNER_HELP,
      message: "First select a unit to move by clicking on it, then click on the goto button or the 'G' key, then click on the position to move to."
    });
    deactivate_goto(false);
  }
}
function deactivate_goto(will_advance_unit_focus) {
  setGotoActive(false);
  const canvasDivEl = document.getElementById("canvas_div");
  if (canvasDivEl) canvasDivEl.style.cursor = "default";
  setGotoRequestMap({});
  setGotoTurnsRequestMap({});
  clearGotoTiles();
  setGotoLastOrder(ORDER_LAST);
  setGotoLastAction(ACTION_COUNT$1);
  if (will_advance_unit_focus) setTimeout(update_unit_focus, 600);
}
function send_end_turn() {
  if (store.gameInfo == null) return;
  const turnDoneBtn = document.getElementById("turn_done_button");
  if (turnDoneBtn) turnDoneBtn.disabled = true;
  sendPlayerPhaseDone(store.gameInfo["turn"]);
  const update_turn_change_timer = window.update_turn_change_timer;
  if (update_turn_change_timer) update_turn_change_timer();
  const is_longturn2 = window.is_longturn;
  if (is_longturn2 && is_longturn2()) {
    showDialogMessage(
      "Turn done!",
      "Your turn in this Freeciv-web: One Turn per Day game is now over. In this game one turn is played every day. To play your next turn in this game, go to " + window.location.host + " and click <b>Games</b> in the menu, then <b>Multiplayer</b> and there you will find this Freeciv-web: One Turn per Day game in the list. You can also bookmark this page.<br>See you again soon!"
    );
  }
}
function request_goto_path(unit_id, dst_x, dst_y) {
  if (goto_request_map[unit_id + "," + dst_x + "," + dst_y] == null) {
    goto_request_map[unit_id + "," + dst_x + "," + dst_y] = true;
    sendGotoPathReq(unit_id, mapPosToTile(dst_x, dst_y)["index"]);
    setCurrentGotoTurns(null);
    const unitTextDetails = document.getElementById("unit_text_details");
    if (unitTextDetails) unitTextDetails.innerHTML = "Choose unit goto";
    setTimeout(update_mouse_cursor, 700);
  } else {
    update_goto_path(goto_request_map[unit_id + "," + dst_x + "," + dst_y]);
  }
}
function check_request_goto_path() {
  if (goto_active && current_focus$1.length > 0 && prev_mouse_x == mouse_x && prev_mouse_y == mouse_y) {
    let ptile;
    clearGotoTiles();
    ptile = canvas_pos_to_tile(mouse_x, mouse_y);
    if (ptile != null) {
      for (let i2 = 0; i2 < current_focus$1.length; i2++) {
        request_goto_path(current_focus$1[i2]["id"], ptile["x"], ptile["y"]);
      }
    }
  }
  setPrevMouseX(mouse_x);
  setPrevMouseY(mouse_y);
}
function update_goto_path(goto_packet) {
  const punit = store.units[goto_packet["unit_id"]];
  if (punit == null) return;
  const t0 = indexToTile(punit["tile"]);
  let ptile = t0;
  const goaltile = indexToTile(goto_packet["dest"]);
  for (let i2 = 0; i2 < goto_packet["dir"].length; i2++) {
    if (ptile == null) break;
    const dir = goto_packet["dir"][i2];
    if (dir == -1) {
      continue;
    }
    ptile["goto_dir"] = dir;
    ptile = mapstep(ptile, dir);
  }
  setCurrentGotoTurns(goto_packet["turns"]);
  goto_request_map[goto_packet["unit_id"] + "," + goaltile["x"] + "," + goaltile["y"]] = goto_packet;
  goto_turns_request_map[goto_packet["unit_id"] + "," + goaltile["x"] + "," + goaltile["y"]] = current_goto_turns;
  if (current_goto_turns != void 0) {
    const activeUnitInfo = document.getElementById("active_unit_info");
    if (activeUnitInfo) activeUnitInfo.innerHTML = "Turns for goto: " + current_goto_turns;
  }
  update_mouse_cursor();
}
function center_tile_mapcanvas(ptile) {
  if (ptile == null) return;
  center_tile_mapcanvas_2d(ptile);
}
function popit() {
  let ptile;
  ptile = canvas_pos_to_tile(mouse_x, mouse_y);
  if (ptile == null) return;
  popit_req(ptile);
}
function popit_req(ptile) {
  if (ptile == null) return;
  if (tileGetKnown(ptile) == TILE_UNKNOWN) {
    showDialogMessage("Tile info", "Location: x:" + ptile["x"] + " y:" + ptile["y"]);
    return;
  }
  let punit_id = 0;
  const punit = find_visible_unit(ptile);
  if (punit != null) punit_id = punit["id"];
  let focus_unit_id = 0;
  if (current_focus$1.length > 0) {
    focus_unit_id = current_focus$1[0]["id"];
  }
  sendInfoTextReq(punit_id, ptile["index"], focus_unit_id);
}
function center_on_any_city() {
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    center_tile_mapcanvas(cityTile(pcity));
    return;
  }
}
if (!window["nation_groups"]) window["nation_groups"] = [];
if (!window["diplstates"]) window["diplstates"] = {};
if (window["selected_player"] === void 0) window["selected_player"] = -1;
function getDiplstates() {
  return window.diplstates;
}
function getSelectedPlayer() {
  return window.selected_player;
}
function setSelectedPlayer(v2) {
  window.selected_player = v2;
}
function jqButtonEnable(id) {
  const el = document.getElementById(id);
  if (el) el.disabled = false;
}
function jqButtonDisable(id) {
  const el = document.getElementById(id);
  if (el) el.disabled = true;
}
function jqButtonLabel(id, label) {
  const el = document.getElementById(id);
  if (el) {
    const inner = el.querySelector(".ui-button-text");
    if (inner) inner.textContent = label;
    else el.textContent = label;
  }
}
const MAX_AI_LOVE = 1e3;
function loveText(love) {
  if (love <= -MAX_AI_LOVE * 90 / 100) {
    return "Genocidal";
  } else if (love <= -MAX_AI_LOVE * 70 / 100) {
    return "Belligerent";
  } else if (love <= -MAX_AI_LOVE * 50 / 100) {
    return "Hostile";
  } else if (love <= -MAX_AI_LOVE * 25 / 100) {
    return "Uncooperative";
  } else if (love <= -MAX_AI_LOVE * 10 / 100) {
    return "Uneasy";
  } else if (love <= MAX_AI_LOVE * 10 / 100) {
    return "Neutral";
  } else if (love <= MAX_AI_LOVE * 25 / 100) {
    return "Respectful";
  } else if (love <= MAX_AI_LOVE * 50 / 100) {
    return "Helpful";
  } else if (love <= MAX_AI_LOVE * 70 / 100) {
    return "Enthusiastic";
  } else if (love <= MAX_AI_LOVE * 90 / 100) {
    return "Admiring";
  } else {
    return "Worshipful";
  }
}
function getScoreText(player) {
  if (player["score"] >= 0) {
    return player["score"];
  } else {
    return "?";
  }
}
function colLove(pplayer) {
  if (clientIsObserver() || store.client?.conn?.playing == null || pplayer["playerno"] === clientPlaying()["playerno"] || pplayer["flags"].isSet(PlayerFlag.PLRF_AI) === false) {
    return "-";
  } else {
    return loveText(pplayer["love"][clientPlaying()["playerno"]]);
  }
}
function updateNationScreen() {
  const diplstates = getDiplstates();
  let total_players = 0;
  let no_humans = 0;
  let no_ais = 0;
  let nation_list_html = "<table class='tablesorter' id='nation_table' width='95%' border=0 cellspacing=0 ><thead><tr><th>Flag</th><th>Color</th><th>Player Name:</th><th>Nation:</th><th class='nation_attitude'>Attitude</th><th>Score</th><th>AI/Human</th><th>Alive?</th><th>Diplomatic state</th><th>Embassy</th><th>Shared vision</th><th class='nation_team'>Team</th><th>State</th></tr></thead><tbody class='nation_table_body'>";
  for (const player_id in store.players) {
    const pplayer = store.players[player_id];
    if (pplayer["nation"] === -1) continue;
    if (isLongturn() && pplayer["name"].indexOf("New Available Player") !== -1) continue;
    total_players++;
    const flag_html = "<canvas id='nation_dlg_flags_" + player_id + "' width='29' height='20' class='nation_flags'></canvas>";
    let plr_class = "";
    if (!clientIsObserver() && clientPlaying() != null && Number(player_id) === clientPlaying()["playerno"]) {
      plr_class = "nation_row_self";
    }
    if (!pplayer["is_alive"]) plr_class = "nation_row_dead";
    if (!clientIsObserver() && diplstates[player_id] != null && diplstates[player_id] === DiplState.DS_WAR) {
      plr_class = "nation_row_war";
    }
    nation_list_html += "<tr data-plrid='" + player_id + "' class='" + plr_class + "'><td>" + flag_html + "</td>";
    nation_list_html += "<td><div style='background-color: " + store.nations[pplayer["nation"]]["color"] + "; margin: 5px; width: 25px; height: 25px;'></div></td>";
    nation_list_html += "<td>" + pplayer["name"] + '</td><td title="' + store.nations[pplayer["nation"]]["legend"] + '">' + store.nations[pplayer["nation"]]["adjective"] + "</td><td class='nation_attitude'>" + colLove(pplayer) + "</td><td>" + getScoreText(pplayer) + "</td><td>" + (pplayer["flags"].isSet(PlayerFlag.PLRF_AI) ? get_ai_level_text(pplayer) + " AI" : "Human") + "</td><td>" + (pplayer["is_alive"] ? "Alive" : "Dead") + "</td>";
    if (!clientIsObserver() && clientPlaying() != null && diplstates[player_id] != null && Number(player_id) !== clientPlaying()["playerno"]) {
      nation_list_html += "<td>" + get_diplstate_text(diplstates[player_id]) + "</td>";
    } else {
      nation_list_html += "<td>-</td>";
    }
    nation_list_html += "<td>" + get_embassy_text(player_id) + "</td>";
    nation_list_html += "<td>";
    if (!clientIsObserver() && clientPlaying() != null) {
      if (pplayer["gives_shared_vision"].isSet(clientPlaying()["playerno"]) && clientPlaying()["gives_shared_vision"].isSet(Number(player_id))) {
        nation_list_html += "Both ways";
      } else if (pplayer["gives_shared_vision"].isSet(clientPlaying()["playerno"])) {
        nation_list_html += "To you";
      } else if (clientPlaying()["gives_shared_vision"].isSet(Number(player_id))) {
        nation_list_html += "To them";
      } else {
        nation_list_html += "None";
      }
    }
    nation_list_html += "</td>";
    nation_list_html += "<td class='nation_team'>" + (pplayer["team"] + 1) + "</td>";
    let pstate = " ";
    if (pplayer["phase_done"] && !pplayer["flags"].isSet(PlayerFlag.PLRF_AI)) {
      pstate = "Done";
    } else if (!pplayer["flags"].isSet(PlayerFlag.PLRF_AI) && pplayer["nturns_idle"] > 1) {
      pstate += "Idle for " + pplayer["nturns_idle"] + " turns";
    } else if (!pplayer["phase_done"] && !pplayer["flags"].isSet(PlayerFlag.PLRF_AI)) {
      pstate = "Moving";
    }
    nation_list_html += "<td id='player_state_" + player_id + "'>" + pstate + "</td>";
    nation_list_html += "</tr>";
    if (!pplayer["flags"].isSet(PlayerFlag.PLRF_AI) && pplayer["is_alive"] && pplayer["nturns_idle"] <= 4) {
      no_humans++;
    }
    if (pplayer["flags"].isSet(PlayerFlag.PLRF_AI) && pplayer["is_alive"]) no_ais++;
  }
  nation_list_html += "</tbody></table>";
  const nationsListEl = document.getElementById("nations_list");
  if (nationsListEl) nationsListEl.innerHTML = nation_list_html;
  const nationsTitleEl = document.getElementById("nations_title");
  if (nationsTitleEl) nationsTitleEl.innerHTML = "Nations of the World";
  const nationsLabelEl = document.getElementById("nations_label");
  if (nationsLabelEl) {
    nationsLabelEl.innerHTML = "Human players: " + no_humans + ". AIs: " + no_ais + ". Inactive/dead: " + (total_players - no_humans - no_ais) + ".";
  }
  selectNoNation();
  if (isLongturn()) {
    const takeBtn = document.getElementById("take_player_button");
    if (takeBtn) takeBtn.style.display = "none";
    const toggleBtn = document.getElementById("toggle_ai_button");
    if (toggleBtn) toggleBtn.style.display = "none";
    const scoresBtn = document.getElementById("game_scores_button");
    if (scoresBtn) scoresBtn.style.display = "none";
  }
  if (is_small_screen()) {
    const takeBtn = document.getElementById("take_player_button");
    if (takeBtn) takeBtn.style.display = "none";
  }
  for (const player_id in store.players) {
    const pplayer = store.players[player_id];
    const flag_canvas = document.getElementById("nation_dlg_flags_" + player_id);
    if (flag_canvas) {
      const flag_canvas_ctx = flag_canvas.getContext("2d");
      const tag = "f." + store.nations[pplayer["nation"]]["graphic_str"];
      if (flag_canvas_ctx != null && window.sprites[tag] != null) {
        flag_canvas_ctx.drawImage(window.sprites[tag], 0, 0);
      }
    }
  }
  initTableSort("#nation_table", { sortList: [[2, 0]] });
  if (is_small_screen()) {
    const nationsEl = document.getElementById("nations");
    if (nationsEl) {
      nationsEl.style.height = (mapview$1["height"] ?? 600) - 150 + "px";
      nationsEl.style.width = (mapview$1["width"] ?? 800) + "px";
    }
  }
  const statusUrl = "/civsocket/" + (parseInt(window.civserverport) + 1e3) + "/status";
  fetch(statusUrl, { cache: "no-store" }).then(function(response) {
    return response.text();
  }).then(function(data) {
    const online_players = {};
    const players_re = /username: <b>([^<]*)/g;
    let found;
    while ((found = players_re.exec(data)) !== null) {
      if (found[1].length > 0) {
        online_players[found[1].toLowerCase()] = true;
      }
    }
    for (const player_id in store.players) {
      const pplayer = store.players[player_id];
      if (online_players[pplayer["username"].toLowerCase()]) {
        const stateEl = document.getElementById("player_state_" + player_id);
        if (stateEl) {
          stateEl.innerHTML = "<span style='color: #00EE00;'><b>Online</b></span>";
        }
      }
    }
    const nationTable = document.getElementById("nation_table");
    if (nationTable) nationTable.dispatchEvent(new Event("update"));
  }).catch(function() {
  });
  if (isLongturn()) {
    document.querySelectorAll(".nation_attitude").forEach(function(el) {
      el.style.display = "none";
    });
    document.querySelectorAll(".nation_team").forEach(function(el) {
      el.style.display = "none";
    });
  }
}
function handleNationTableSelect(ev) {
  ev.stopPropagation();
  const new_element = ev.currentTarget;
  const new_player = parseFloat(new_element.dataset.plrid || "");
  if (new_player === getSelectedPlayer()) {
    new_element.classList.remove("ui-selected");
    selectNoNation();
  } else {
    const parent = new_element.parentElement;
    if (parent) {
      Array.from(parent.children).forEach(function(sibling) {
        if (sibling !== new_element) sibling.classList.remove("ui-selected");
      });
    }
    new_element.classList.add("ui-selected");
    setSelectedPlayer(new_player);
    selectANation();
  }
}
function selectANation() {
  const diplstates = getDiplstates();
  const player_id = getSelectedPlayer();
  const pplayer = store.players[getSelectedPlayer()];
  if (pplayer == null) return;
  const selected_myself = clientPlaying() != null && player_id === clientPlaying()["playerno"];
  const both_alive_and_different = clientPlaying() != null && player_id !== clientPlaying()["playerno"] && pplayer["is_alive"] && clientPlaying()["is_alive"];
  if (pplayer["is_alive"] && (clientIsObserver() || selected_myself || diplstates[player_id] != null && diplstates[player_id] !== DiplState.DS_NO_CONTACT || clientState() === C_S_OVER)) {
    jqButtonEnable("view_player_button");
  } else {
    jqButtonDisable("view_player_button");
  }
  if (!clientIsObserver() && both_alive_and_different && diplstates[player_id] != null && diplstates[player_id] !== DiplState.DS_NO_CONTACT) {
    jqButtonEnable("meet_player_button");
  } else {
    jqButtonDisable("meet_player_button");
  }
  if (!pplayer["flags"].isSet(PlayerFlag.PLRF_AI) && diplstates[player_id] != null && diplstates[player_id] === DiplState.DS_NO_CONTACT) {
    jqButtonDisable("meet_player_button");
  }
  if (pplayer["flags"].isSet(PlayerFlag.PLRF_AI) || selected_myself) {
    jqButtonDisable("send_message_button");
  } else {
    jqButtonEnable("send_message_button");
  }
  if (!clientIsObserver() && both_alive_and_different && pplayer["team"] !== clientPlaying()["team"] && diplstates[player_id] != null && diplstates[player_id] !== DiplState.DS_WAR && diplstates[player_id] !== DiplState.DS_NO_CONTACT) {
    jqButtonEnable("cancel_treaty_button");
  } else {
    jqButtonDisable("cancel_treaty_button");
  }
  if (canClientControl() && !selected_myself) {
    if (diplstates[player_id] === DiplState.DS_CEASEFIRE || diplstates[player_id] === DiplState.DS_ARMISTICE || diplstates[player_id] === DiplState.DS_PEACE) {
      jqButtonLabel("cancel_treaty_button", "Declare war");
    } else {
      jqButtonLabel("cancel_treaty_button", "Cancel treaty");
    }
  }
  if (canClientControl() && both_alive_and_different && pplayer["team"] !== clientPlaying()["team"] && clientPlaying()["gives_shared_vision"].isSet(player_id)) {
    jqButtonEnable("withdraw_vision_button");
  } else {
    jqButtonDisable("withdraw_vision_button");
  }
  if (clientIsObserver() || both_alive_and_different && diplstates[player_id] !== DiplState.DS_NO_CONTACT) {
    jqButtonEnable("intelligence_report_button");
  } else {
    jqButtonDisable("intelligence_report_button");
  }
  if (clientIsObserver() && pplayer["flags"].isSet(PlayerFlag.PLRF_AI) && store.nations[pplayer["nation"]]["is_playable"] && getUrlVar("multi") === "true") {
    jqButtonEnable("take_player_button");
  } else {
    jqButtonDisable("take_player_button");
  }
  jqButtonEnable("toggle_ai_button");
}
function selectNoNation() {
  setSelectedPlayer(-1);
  try {
    const container = document.getElementById("nations_button_div");
    if (container) {
      const buttons = container.querySelectorAll("button");
      buttons.forEach(function(btn) {
        if (btn.id !== "game_scores_button") {
          btn.disabled = true;
        }
      });
    }
  } catch (_e) {
  }
}
function nationTableSelectPlayer(player_no) {
  const playersTabLink = document.querySelector("#players_tab a");
  if (playersTabLink) playersTabLink.click();
  const row = document.querySelector('#nation_table tr[data-plrid="' + player_no + '"]');
  if (row) {
    row.click();
    row.scrollIntoView();
  }
}
function cancelTreatyClicked() {
  if (getSelectedPlayer() === -1) return;
  diplomacy_cancel_treaty(getSelectedPlayer());
  setDefaultMapviewActive();
}
function withdrawVisionClicked() {
  if (getSelectedPlayer() === -1) return;
  sendDiplomacyCancelPact(getSelectedPlayer(), CLAUSE_VISION);
  setDefaultMapviewActive();
}
function nationMeetClicked() {
  if (getSelectedPlayer() === -1) return;
  const pplayer = store.players[getSelectedPlayer()];
  if (pplayer == null) return;
  sendDiplomacyInitMeeting(pplayer["playerno"]);
  setDefaultMapviewActive();
}
function takePlayerClicked() {
  if (getSelectedPlayer() === -1) return;
  const pplayer = store.players[getSelectedPlayer()];
  takePlayer(pplayer["name"]);
  setDefaultMapviewActive();
}
function toggleAiClicked() {
  if (getSelectedPlayer() === -1) return;
  const pplayer = store.players[getSelectedPlayer()];
  aitogglePlayer(pplayer["name"]);
  setDefaultMapviewActive();
}
function takePlayer(player_name) {
  send_message("/take " + player_name);
  store.observing = false;
}
function aitogglePlayer(player_name) {
  send_message("/aitoggle " + player_name);
  store.observing = false;
}
function centerOnPlayer() {
  if (getSelectedPlayer() === -1) return;
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    if (cityOwnerPlayerId(pcity) === getSelectedPlayer()) {
      center_tile_mapcanvas(cityTile(pcity));
      setDefaultMapviewActive();
      return;
    }
  }
}
function sendPrivateMessage(other_player_name) {
  const inputEl = document.getElementById("private_message_text");
  const message = other_player_name + ": " + encode_message_text(inputEl ? inputEl.value : "");
  sendChatMessage(message);
  setKeyboardInput(true);
  const dlg = document.getElementById("dialog");
  if (dlg) dlg.remove();
}
function showSendPrivateMessageDialog() {
  if (getSelectedPlayer() === -1) return;
  const pplayer = store.players[getSelectedPlayer()];
  if (pplayer == null) {
    swal("Please select a player to send a private message to first.");
    return;
  }
  const name = pplayer["name"];
  setKeyboardInput(false);
  const oldDialog = document.getElementById("dialog");
  if (oldDialog) oldDialog.remove();
  const gamePage = document.querySelector("div#game_page");
  const dialogEl = document.createElement("div");
  dialogEl.id = "dialog";
  if (gamePage) gamePage.appendChild(dialogEl);
  const intro_html = "Message: <input id='private_message_text' type='text' size='50' maxlength='80'>";
  dialogEl.innerHTML = intro_html;
  dialogEl.setAttribute("title", "Send private message to " + name);
  dialogEl.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:30%;left:50%;transform:translateX(-50%);width:" + (is_small_screen() ? "80%" : "40%") + ";";
  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  sendBtn.style.cssText = "margin-top:8px;margin-right:8px;";
  sendBtn.addEventListener("click", function() {
    sendPrivateMessage(name);
  });
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.cssText = "margin-top:8px;";
  cancelBtn.addEventListener("click", function() {
    dialogEl.remove();
  });
  dialogEl.appendChild(document.createElement("br"));
  dialogEl.appendChild(sendBtn);
  dialogEl.appendChild(cancelBtn);
  dialogEl.addEventListener("keyup", function(e2) {
    if (e2.keyCode === 13) {
      sendPrivateMessage(name);
    }
  });
}
const FC_DS_ALLIANCE = DiplState.DS_ALLIANCE;
const FC_PLRF_AI = PlayerFlag.PLRF_AI;
function chat_context_change() {
  const recipients = chat_context_get_recipients();
  if (recipients.length < 4) {
    chat_context_set_next(recipients);
  } else {
    chat_context_dialog_show(recipients);
  }
}
function chat_context_get_recipients() {
  let allies = false;
  const pm = [];
  pm.push({ id: null, flag: null, description: "Everybody" });
  let self = -1;
  if (clientPlaying() != null) {
    self = clientPlaying()["playerno"];
  }
  for (const player_id_str in store.players) {
    const player_id = parseInt(player_id_str);
    if (player_id == self) continue;
    const pplayer = store.players[player_id];
    if (pplayer["flags"].isSet(FC_PLRF_AI)) continue;
    if (!pplayer["is_alive"]) continue;
    if (isLongturn() && pplayer["name"].indexOf("New Available Player") != -1) continue;
    const nation = store.nations[pplayer["nation"]];
    if (nation == null) continue;
    pm.push({
      id: player_id,
      description: pplayer["name"] + " of the " + nation["adjective"],
      flag: window.sprites["f." + nation["graphic_str"]]
    });
    if (getDiplstates()[player_id] == FC_DS_ALLIANCE) {
      allies = true;
    }
  }
  if (allies && self >= 0) {
    pm.push({ id: self, flag: null, description: "Allies" });
  }
  pm.sort(function(a2, b2) {
    if (a2.id == null) return -1;
    if (b2.id == null) return 1;
    if (a2.id == self) return -1;
    if (b2.id == self) return 1;
    if (a2.description < b2.description) return -1;
    if (a2.description > b2.description) return 1;
    return 0;
  });
  return pm;
}
function chat_context_set_next(recipients) {
  let next = 0;
  while (next < recipients.length && recipients[next].id != chat_send_to) {
    next++;
  }
  next++;
  if (next >= recipients.length) {
    next = 0;
  }
  set_chat_direction(recipients[next].id);
}
function chat_context_dialog_show(recipients) {
  const existingDlg = document.getElementById("chat_context_dialog");
  if (existingDlg) existingDlg.remove();
  const dlgDiv = document.createElement("div");
  dlgDiv.id = "chat_context_dialog";
  dlgDiv.title = "Choose chat recipient";
  document.querySelector("div#game_page").appendChild(dlgDiv);
  let self = -1;
  if (clientPlaying() != null) {
    self = clientPlaying()["playerno"];
  }
  const tbody_el = document.createElement("tbody");
  const add_row = function(id, flag, description) {
    let flag_canvas, ctx, row, cell;
    row = document.createElement("tr");
    cell = document.createElement("td");
    flag_canvas = document.createElement("canvas");
    flag_canvas.width = 29;
    flag_canvas.height = 20;
    ctx = flag_canvas.getContext("2d");
    if (flag != null) {
      ctx.drawImage(flag, 0, 0);
    }
    cell.appendChild(flag_canvas);
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.appendChild(document.createTextNode(description));
    row.appendChild(cell);
    if (id != null) {
      row.dataset.chatSendTo = id;
    }
    tbody_el.appendChild(row);
    return ctx;
  };
  for (let i2 = 0; i2 < recipients.length; i2++) {
    if (recipients[i2].id != chat_send_to) {
      const ctx = add_row(
        recipients[i2].id,
        recipients[i2].flag,
        recipients[i2].description
      );
      if (recipients[i2].id == null || recipients[i2].id == self) {
        ctx.font = "18px FontAwesome";
        ctx.fillStyle = "rgba(32, 32, 32, 1)";
        if (recipients[i2].id == null) {
          ctx.fillText(CHAT_ICON_EVERYBODY, 5, 15);
        } else {
          ctx.fillText(CHAT_ICON_ALLIES, 8, 16);
        }
      }
    }
  }
  const table = document.createElement("table");
  table.appendChild(tbody_el);
  table.addEventListener("click", function(ev) {
    const row = ev.target.closest("tbody tr");
    if (row) {
      handle_chat_direction_chosen.call(row, ev);
    }
  });
  document.getElementById("chat_context_dialog").appendChild(table);
  const chatDlg = document.getElementById("chat_context_dialog");
  chatDlg.style.cssText = "position:absolute;z-index:5000;background:#222;border:1px solid #555;padding:8px;max-height:" + Math.floor(0.9 * window.innerHeight) + "px;overflow-y:auto;";
  chatDlg.style.display = "block";
}
function handle_chat_direction_chosen(ev) {
  const new_send_to = this.dataset.chatSendTo;
  const chatDlg = document.getElementById("chat_context_dialog");
  if (chatDlg) chatDlg.remove();
  if (new_send_to == null) {
    set_chat_direction(null);
  } else {
    set_chat_direction(parseFloat(new_send_to));
  }
}
function set_chat_direction(player_id) {
  if (player_id == chat_send_to) return;
  let player_name;
  const iconEl = document.getElementById("chat_direction");
  if (!iconEl) return;
  const ctx = iconEl.getContext("2d");
  if (!ctx) return;
  if (player_id == null || player_id < 0) {
    player_id = null;
    ctx.clearRect(0, 0, 29, 20);
    ctx.font = "18px FontAwesome";
    ctx.fillStyle = "rgba(192, 192, 192, 1)";
    ctx.fillText(CHAT_ICON_EVERYBODY, 7, 15);
    player_name = "everybody";
  } else if (clientPlaying() != null && player_id == clientPlaying()["playerno"]) {
    ctx.clearRect(0, 0, 29, 20);
    ctx.font = "18px FontAwesome";
    ctx.fillStyle = "rgba(192, 192, 192, 1)";
    ctx.fillText(CHAT_ICON_ALLIES, 10, 16);
    player_name = "allies";
  } else {
    const pplayer = store.players[player_id];
    if (pplayer == null) return;
    player_name = pplayer["name"] + " of the " + store.nations[pplayer["nation"]]["adjective"];
    ctx.clearRect(0, 0, 29, 20);
    const flag = window.sprites["f." + store.nations[pplayer["nation"]]["graphic_str"]];
    if (flag != null) {
      ctx.drawImage(flag, 0, 0);
    }
  }
  iconEl.title = "Sending messages to " + player_name;
  setChatSendTo(player_id);
  const textInput = document.getElementById("game_text_input");
  if (textInput) textInput.focus();
}
function encode_message_text(message) {
  message = message.replace(/^\s+|\s+$/g, "");
  message = message.replace(/&/g, "&amp;");
  message = message.replace(/'/g, "&apos;");
  message = message.replace(/"/g, "&quot;");
  message = message.replace(/</g, "&lt;");
  message = message.replace(/>/g, "&gt;");
  return encodeURIComponent(message);
}
function is_unprefixed_message(message) {
  if (message === null) return false;
  if (message.length === 0) return true;
  const first = message.charAt(0);
  if (first === "/" || first === "." || first === ":") return false;
  let quoted_pos = -1;
  if (first === '"' || first === "'") {
    quoted_pos = message.indexOf(first, 1);
  }
  const private_mark = message.indexOf(":", quoted_pos);
  if (private_mark < 0) return true;
  const space_pos = message.indexOf(" ", quoted_pos);
  return space_pos !== -1 && space_pos < private_mark;
}
function check_text_input(event, chatboxtextarea) {
  if (event.keyCode == 13 && event.shiftKey == 0) {
    let message = chatboxtextarea.value;
    if (chat_send_to != null && chat_send_to >= 0 && is_unprefixed_message(message)) {
      if (clientPlaying() != null && chat_send_to == clientPlaying()["playerno"]) {
        message = ". " + encode_message_text(message);
      } else {
        const pplayer = store.players[chat_send_to];
        if (pplayer == null) {
          set_chat_direction(null);
          return;
        }
        let player_name = pplayer["name"];
        const badchars = [" ", '"', "'"];
        for (const c2 of badchars) {
          const i2 = player_name.indexOf(c2);
          if (i2 > 0) {
            player_name = player_name.substring(0, i2);
          }
        }
        message = player_name + encode_message_text(": " + message);
      }
    } else {
      message = encode_message_text(message);
    }
    chatboxtextarea.value = "";
    if (!isTouchDevice()) chatboxtextarea.focus();
    setKeyboardInput(true);
    if (message.length >= 4 && message === message.toUpperCase()) {
      return;
    }
    if (isLongturn() && C_S_RUNNING == clientState() && message != null && message.indexOf(encode_message_text("/set")) != -1) {
      return;
    }
    if (message.length >= max_chat_message_length) {
      message_log.update({
        event: E_LOG_ERROR,
        message: "Error! The message is too long. Limit: " + max_chat_message_length
      });
      return;
    }
    send_message(message);
    return false;
  }
}
const PAGE_MAIN = 0;
const PAGE_START = 1;
const PAGE_NETWORK = 4;
const PAGE_GAME = 6;
let old_page = -1;
function set_client_page(page) {
  if (old_page === page) return;
  if (old_page === -1) {
    document.getElementById("pregame_page")?.remove();
  }
  if (page === PAGE_GAME) {
    const gamePage = document.getElementById("game_page");
    if (gamePage) gamePage.style.display = "";
    set_chat_direction(null);
  }
  old_page = page;
}
function get_client_page() {
  return old_page;
}
const state$4 = c({
  open: false,
  title: "",
  message: ""
});
let autoCloseTimer = null;
function showMessageDialog(title, message) {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
  state$4.value = { open: true, title, message };
  autoCloseTimer = setTimeout(() => {
    closeMessageDialog();
  }, 24e3);
}
function closeMessageDialog() {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
  state$4.value = { ...state$4.value, open: false };
  const input = document.getElementById("game_text_input");
  if (input) input.blur();
}
function MessageDialog() {
  const { open, title, message } = state$4.value;
  return /* @__PURE__ */ u(
    Dialog,
    {
      title,
      open,
      onClose: closeMessageDialog,
      width: window.innerWidth <= 600 ? "90%" : "50%",
      modal: false,
      children: [
        /* @__PURE__ */ u(
          "div",
          {
            style: { maxHeight: "450px", overflow: "auto" },
            dangerouslySetInnerHTML: { __html: message }
          }
        ),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px", textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: closeMessageDialog, children: "Ok" }) })
      ]
    }
  );
}
const _w$2 = window;
if (_w$2.C_S_INITIAL === void 0) _w$2.C_S_INITIAL = 0;
if (_w$2.C_S_PREPARING === void 0) _w$2.C_S_PREPARING = 1;
if (_w$2.C_S_RUNNING === void 0) _w$2.C_S_RUNNING = 2;
if (_w$2.C_S_OVER === void 0) _w$2.C_S_OVER = 3;
if (_w$2.civclient_state === void 0) _w$2.civclient_state = C_S_INITIAL;
if (_w$2.endgame_player_info === void 0) _w$2.endgame_player_info = [];
if (_w$2.height_offset === void 0) _w$2.height_offset = 52;
if (_w$2.width_offset === void 0) _w$2.width_offset = 10;
function setClientState(newstate) {
  if (_w$2.civclient_state === newstate) return;
  _w$2.civclient_state = newstate;
  switch (newstate) {
    case C_S_RUNNING:
      try {
        clear_chatbox();
        unblockUI();
        showNewGameMessage();
      } catch (e2) {
        console.error("[set_client_state] Error in pre-page setup:", e2);
      }
      set_client_page(PAGE_GAME);
      setupWindowSize();
      if (typeof _w$2.update_metamessage_on_gamestart === "function") _w$2.update_metamessage_on_gamestart();
      document.querySelectorAll(".context-menu-root").forEach((el) => el.remove());
      center_on_any_city();
      advance_unit_focus();
      break;
    case C_S_OVER:
      setTimeout(function() {
        showEndgameDialog();
      }, 500);
      break;
  }
}
function setupWindowSize() {
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  const new_mapview_width = winWidth - _w$2.width_offset;
  const new_mapview_height = winHeight - _w$2.height_offset;
  if (_w$2.renderer === RENDERER_2DCANVAS$1 && _w$2.mapview_canvas) {
    _w$2.mapview_canvas.width = new_mapview_width;
    _w$2.mapview_canvas.height = new_mapview_height;
    if (_w$2.buffer_canvas) {
      _w$2.buffer_canvas.width = Math.floor(new_mapview_width * 1.5);
      _w$2.buffer_canvas.height = Math.floor(new_mapview_height * 1.5);
    }
    mapview$1["width"] = new_mapview_width;
    mapview$1["height"] = new_mapview_height;
    mapview$1["store_width"] = new_mapview_width;
    mapview$1["store_height"] = new_mapview_height;
    if (_w$2.mapview_canvas_ctx) _w$2.mapview_canvas_ctx.font = _w$2.canvas_text_font;
    if (_w$2.buffer_canvas_ctx) _w$2.buffer_canvas_ctx.font = _w$2.canvas_text_font;
  }
  const _el = (id) => document.getElementById(id);
  const _setH = (id, h2) => {
    const el = _el(id);
    if (el) el.style.height = typeof h2 === "number" ? h2 + "px" : h2;
  };
  const _setW = (id, w2) => {
    const el = _el(id);
    if (el) el.style.width = typeof w2 === "number" ? w2 + "px" : w2;
  };
  const _show = (id) => {
    const el = _el(id);
    if (el) el.style.display = "";
  };
  const _hide = (id) => {
    const el = _el(id);
    if (el) el.style.display = "none";
  };
  _setH("nations", new_mapview_height - 100);
  _setW("nations", new_mapview_width);
  const tabs = _el("tabs");
  if (tabs) tabs.style.height = winHeight + "px";
  _setH("tabs-map", "auto");
  _setH("city_viewport", new_mapview_height - 20);
  _show("opt_tab");
  _show("players_tab");
  _show("freeciv_logo");
  _hide("tabs-hel");
  if (is_small_screen()) {
    const setTabIcon = (id, emoji) => {
      const el = _el(id);
      if (el) {
        const a2 = el.querySelector("a");
        if (a2) a2.textContent = emoji;
      }
    };
    setTabIcon("map_tab", "🌍");
    setTabIcon("opt_tab", "⚙️");
    setTabIcon("players_tab", "🏴");
    setTabIcon("tech_tab", "🧪");
    setTabIcon("hel_tab", "❓");
    document.querySelectorAll(".ui-tabs-anchor").forEach((el) => el.style.padding = "7px");
    document.querySelectorAll(".overview_dialog").forEach((el) => el.style.display = "none");
    document.querySelectorAll(".ui-dialog-titlebar").forEach((el) => el.style.display = "none");
    _hide("freeciv_logo");
    setOverviewActive(false);
    _w$2.overview_active = false;
    _el("game_unit_orders_default")?.remove();
    _el("game_unit_orders_settlers")?.remove();
    const statusBottom = _el("game_status_panel_bottom");
    if (statusBottom) statusBottom.style.fontSize = "0.8em";
  }
  if (overview_active) init_overview();
  if (unitpanel_active) init_game_unit_panel();
}
function showNewGameMessage() {
  clear_chatbox();
}
function showEndgameDialog() {
  const title = "Final Report: The Greatest Civilizations in the world!";
  let message = "";
  for (let i2 = 0; i2 < _w$2.endgame_player_info.length; i2++) {
    const pplayer = store.players[_w$2.endgame_player_info[i2]["player_id"]];
    const nation_adj = store.nations[pplayer["nation"]]?.["adjective"] ?? "Unknown";
    message += i2 + 1 + ": The " + nation_adj + " ruler " + pplayer["name"] + " scored " + _w$2.endgame_player_info[i2]["score"] + " points<br>";
  }
  showMessageDialog(title, message);
}
function setDefaultMapviewActive() {
  if (_w$2.renderer === RENDERER_2DCANVAS$1 && _w$2.mapview_canvas) {
    _w$2.mapview_canvas_ctx = _w$2.mapview_canvas.getContext("2d");
    if (_w$2.mapview_canvas_ctx) _w$2.mapview_canvas_ctx.font = _w$2.canvas_text_font;
  }
  const active_tab = getActiveTab("#tabs");
  if (active_tab === 4) return;
  if (unitpanel_active) {
    update_active_units_dialog();
  }
  if (chatbox_active) {
    const chatPanel = document.getElementById("game_chatbox_panel");
    if (chatPanel?.parentElement) chatPanel.parentElement.style.display = "";
  }
  setActiveTab("#tabs", 0);
  const tabsMap = document.getElementById("tabs-map");
  if (tabsMap) tabsMap.style.height = "auto";
  setTechDialogActive(false);
  _w$2.tech_dialog_active = false;
  setAllowRightClick(false);
  setKeyboardInput(true);
  const scrollDiv = document.getElementById("freeciv_custom_scrollbar_div");
  if (scrollDiv) scrollDiv.scrollTop = scrollDiv.scrollHeight;
  if (!is_small_screen()) {
    const overviewPanel = document.getElementById("game_overview_panel");
    if (overviewPanel?.parentElement) overviewPanel.parentElement.style.display = "";
  }
  mark_all_dirty();
}
let citydlg_map_width = 384;
let citydlg_map_height = 192;
const tileset_width = 96;
const tileset_height = 48;
let cities$1 = {};
let city_rules = {};
let city_trade_routes = {};
let active_city = null;
let production_selection = [];
let worklist_selection = [];
const CITYO_DISBAND = 0;
const FEELING_FINAL$1 = 5;
const MAX_LEN_WORKLIST = 64;
let city_tab_index = 0;
let city_prod_clicks = 0;
let _update_city_screen_fn = null;
function set_city_screen_updater_fn(fn) {
  _update_city_screen_fn = fn;
}
function _update_city_screen_proxy() {
  if (_update_city_screen_fn) _update_city_screen_fn();
}
const city_screen_updater = new EventAggregator(
  _update_city_screen_proxy,
  250,
  EventAggregator.DP_NONE,
  250,
  3,
  250
);
let opt_show_unreachable_items = false;
function set_citydlg_map_width(v2) {
  citydlg_map_width = v2;
}
function set_citydlg_map_height(v2) {
  citydlg_map_height = v2;
}
function set_active_city(v2) {
  active_city = v2;
}
function set_production_selection(v2) {
  production_selection = v2;
}
function set_worklist_selection(v2) {
  worklist_selection = v2;
}
function set_city_prod_clicks(v2) {
  city_prod_clicks = v2;
}
function set_opt_show_unreachable_items(v2) {
  opt_show_unreachable_items = v2;
}
function byId$2(id) {
  return document.getElementById(id);
}
function setHtml$2(id, html) {
  const el = byId$2(id);
  if (el) el.innerHTML = html;
}
function setHeight(id, px) {
  const el = byId$2(id);
  if (el) el.style.height = px + "px";
}
function setBtnEnabled(id, enabled) {
  const el = byId$2(id);
  if (el) el.disabled = !enabled;
}
function get_unit_type_image_sprite$1(unit_type2) {
}
function city_worklist_dialog(pcity) {
  if (pcity == null) return;
  const universals_list = [];
  let kind;
  let value;
  if (pcity["worklist"] != null && pcity["worklist"].length != 0) {
    const work_list = pcity["worklist"];
    for (let i2 = 0; i2 < work_list.length; i2++) {
      const work_item = work_list[i2];
      kind = work_item["kind"];
      value = work_item["value"];
      if (kind == null || value == null || work_item.length == 0) continue;
      if (kind == VUT_IMPROVEMENT) {
        const pimpr = store.improvements[value];
        let build_cost = pimpr["build_cost"];
        if (pimpr["name"] == "Coinage") build_cost = "-";
        universals_list.push({
          "name": pimpr["name"],
          "kind": kind,
          "value": value,
          "helptext": pimpr["helptext"],
          "build_cost": build_cost,
          "sprite": get_improvement_image_sprite(pimpr)
        });
      } else if (kind == VUT_UTYPE) {
        const putype = store.unitTypes[value];
        universals_list.push({
          "name": putype["name"],
          "kind": kind,
          "value": value,
          "helptext": putype["helptext"],
          "build_cost": putype["build_cost"],
          "sprite": get_unit_type_image_sprite$1()
        });
      } else {
        console.log("unknown kind: " + kind);
      }
    }
  }
  let worklist_html = "<table class='worklist_table'><tr><td>Type</td><td>Name</td><td>Cost</td></tr>";
  for (let j2 = 0; j2 < universals_list.length; j2++) {
    const universal = universals_list[j2];
    const sprite = universal["sprite"];
    if (sprite == null) {
      console.log("Missing sprite for " + universal["name"]);
      continue;
    }
    worklist_html += "<tr class='prod_choice_list_item" + (canCityBuildNow(pcity, universal["kind"], universal["value"]) ? "" : " cannot_build_item") + "' data-wlitem='" + j2 + `'  title="` + universal["helptext"] + `"><td><div class='production_list_item_sub' style=' background: transparent url(` + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;'></div></td><td class='prod_choice_name'>" + universal["name"] + "</td><td class='prod_choice_cost'>" + universal["build_cost"] + "</td></tr>";
  }
  worklist_html += "</table>";
  setHtml$2("city_current_worklist", worklist_html);
  populate_worklist_production_choices(pcity);
  const showUnreachable = byId$2("show_unreachable_items");
  if (showUnreachable) {
    const newEl = showUnreachable.cloneNode(true);
    showUnreachable.parentNode?.replaceChild(newEl, showUnreachable);
    newEl.addEventListener("click", function() {
      set_opt_show_unreachable_items(!opt_show_unreachable_items);
      newEl.checked = opt_show_unreachable_items;
      if (production_selection.length !== 0) {
        set_production_selection([]);
        update_worklist_actions();
      }
      populate_worklist_production_choices(pcity);
    });
    newEl.checked = opt_show_unreachable_items;
  }
  const turns_to_complete = getCityProductionTime(pcity);
  const prod_type = getCityProductionTypeSprite(pcity);
  let prod_img_html = "";
  if (prod_type != null) {
    const sprite = prod_type["sprite"];
    prod_img_html = "<div style='background: transparent url(" + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;float: left; '></div>";
  }
  let headline = prod_img_html + "<div id='prod_descr'>" + (isSmallScreen() ? " " : " Production: ") + (prod_type != null ? prod_type["type"]["name"] : "None");
  if (turns_to_complete != FC_INFINITY) {
    headline += ", turns: " + turns_to_complete;
  }
  setHtml$2("worklist_dialog_headline", headline + "</div>");
  if (isTouchDevice()) {
    setHtml$2("prod_buttons", "<x-small>Click to change production, next clicks will add to worklist on mobile.</x-small>");
  }
  const tabEl = byId$2("city_production_tab");
  const tab_h = tabEl ? tabEl.offsetHeight : 400;
  setHeight("city_current_worklist", tab_h - 150);
  setHeight("worklist_production_choices", tab_h - 121);
  const wlControl = byId$2("worklist_control");
  if (wlControl) {
    if (tab_h > 250) {
      wlControl.style.height = tab_h - 148 + "px";
      wlControl.style.paddingTop = "73px";
    } else {
      wlControl.style.height = tab_h - 77 + "px";
    }
  }
  const worklistContainer = byId$2("city_current_worklist");
  const worklist_items = worklistContainer ? Array.from(worklistContainer.querySelectorAll(".prod_choice_list_item")) : [];
  const max_selection = Math.min(MAX_LEN_WORKLIST, worklist_items.length);
  for (let k2 = 0; k2 < worklist_selection.length; k2++) {
    if (worklist_selection[k2] >= max_selection) {
      worklist_selection.splice(k2, worklist_selection.length - k2);
      break;
    }
    worklist_items[worklist_selection[k2]]?.classList.add("ui-selected");
  }
  if (!isTouchDevice()) {
    worklist_items.forEach((item) => {
      item.addEventListener("click", function(e2) {
        if (e2.ctrlKey || e2.metaKey) {
          if (item.classList.contains("ui-selected")) {
            item.classList.remove("ui-selected");
            handle_current_worklist_unselect(e2, { unselected: item });
          } else {
            item.classList.add("ui-selected");
            handle_current_worklist_select(e2, { selected: item });
          }
        } else {
          worklist_items.forEach((el) => el.classList.remove("ui-selected"));
          item.classList.add("ui-selected");
          set_worklist_selection([]);
          handle_current_worklist_select(e2, { selected: item });
        }
      });
    });
  } else {
    worklist_items.forEach((item) => {
      item.addEventListener("click", handle_current_worklist_click.bind(item));
    });
  }
  worklist_items.forEach((item) => {
    item.addEventListener("dblclick", handle_current_worklist_direct_remove.bind(item));
  });
  update_worklist_actions();
}
function populate_worklist_production_choices(pcity) {
  const production_list = generateProductionList();
  let production_html = "<table class='worklist_table'><tr><td>Type</td><td>Name</td><td title='Attack/Defense/Firepower'>Info</td><td>Cost</td></tr>";
  for (let a2 = 0; a2 < production_list.length; a2++) {
    const sprite = production_list[a2]["sprite"];
    if (sprite == null) {
      console.log("Missing sprite for " + production_list[a2]["value"]);
      continue;
    }
    const kind = production_list[a2]["kind"];
    const value = production_list[a2]["value"];
    const can_build = canCityBuildNow(pcity, kind, value);
    if (can_build || opt_show_unreachable_items) {
      production_html += "<tr class='prod_choice_list_item kindvalue_item" + (can_build ? "" : " cannot_build_item") + "' data-value='" + value + "' data-kind='" + kind + `'><td><div class='production_list_item_sub' title="` + production_list[a2]["helptext"] + `" style=' background: transparent url(` + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;'></div></td><td class='prod_choice_name'>" + production_list[a2]["text"] + "</td><td class='prod_choice_name'>" + production_list[a2]["unit_details"] + "</td><td class='prod_choice_cost'>" + production_list[a2]["build_cost"] + "</td></tr>";
    }
  }
  production_html += "</table>";
  setHtml$2("worklist_production_choices", production_html);
  const choicesContainer = byId$2("worklist_production_choices");
  const kindValueItems = choicesContainer ? Array.from(choicesContainer.querySelectorAll(".kindvalue_item")) : [];
  if (!isTouchDevice()) {
    kindValueItems.forEach((item) => {
      item.addEventListener("click", function(e2) {
        if (e2.ctrlKey || e2.metaKey) {
          if (item.classList.contains("ui-selected")) {
            item.classList.remove("ui-selected");
            handle_worklist_unselect(e2, { unselected: item });
          } else {
            item.classList.add("ui-selected");
            handle_worklist_select(e2, { selected: item });
          }
        } else {
          kindValueItems.forEach((el) => el.classList.remove("ui-selected"));
          item.classList.add("ui-selected");
          set_production_selection([]);
          handle_worklist_select(e2, { selected: item });
        }
      });
    });
    if (production_selection.length > 0) {
      production_selection.forEach(function(v2) {
        const match = choicesContainer?.querySelector(
          "[data-value='" + v2.value + "'][data-kind='" + v2.kind + "']"
        );
        match?.classList.add("ui-selected");
      });
    }
    kindValueItems.forEach((item) => {
      item.addEventListener("dblclick", function() {
        const value = parseFloat(item.dataset.value || "0");
        const kind = parseFloat(item.dataset.kind || "0");
        send_city_worklist_add(pcity["id"], kind, value);
      });
    });
  } else {
    kindValueItems.forEach((item) => {
      item.addEventListener("click", function() {
        const value = parseFloat(item.dataset.value || "0");
        const kind = parseFloat(item.dataset.kind || "0");
        if (city_prod_clicks == 0) {
          send_city_change(pcity["id"], kind, value);
        } else {
          send_city_worklist_add(pcity["id"], kind, value);
        }
        set_city_prod_clicks(city_prod_clicks + 1);
      });
    });
  }
}
function extract_universal(element) {
  const el = element;
  return {
    value: parseFloat(el.dataset.value || el.getAttribute("data-value") || "0"),
    kind: parseFloat(el.dataset.kind || el.getAttribute("data-kind") || "0")
  };
}
function find_universal_in_worklist(universal, worklist) {
  for (let i2 = 0; i2 < worklist.length; i2++) {
    if (worklist[i2].kind === universal.kind && worklist[i2].value === universal.value) {
      return i2;
    }
  }
  return -1;
}
function handle_worklist_select(event, ui) {
  const selected = extract_universal(ui.selected);
  const idx = find_universal_in_worklist(selected, production_selection);
  if (idx < 0) {
    production_selection.push(selected);
    update_worklist_actions();
  }
}
function handle_worklist_unselect(event, ui) {
  const selected = extract_universal(ui.unselected);
  const idx = find_universal_in_worklist(selected, production_selection);
  if (idx >= 0) {
    production_selection.splice(idx, 1);
    update_worklist_actions();
  }
}
function handle_current_worklist_select(event, ui) {
  const idx = parseInt(ui.selected.dataset.wlitem || "0", 10);
  let i2 = worklist_selection.length - 1;
  while (i2 >= 0 && worklist_selection[i2] > idx)
    i2--;
  if (i2 < 0 || worklist_selection[i2] < idx) {
    worklist_selection.splice(i2 + 1, 0, idx);
    update_worklist_actions();
  }
}
function handle_current_worklist_unselect(event, ui) {
  const idx = parseInt(ui.unselected.dataset.wlitem || "0", 10);
  let i2 = worklist_selection.length - 1;
  while (i2 >= 0 && worklist_selection[i2] > idx)
    i2--;
  if (i2 >= 0 && worklist_selection[i2] === idx) {
    worklist_selection.splice(i2, 1);
    update_worklist_actions();
  }
}
function handle_current_worklist_click(event) {
  event.stopPropagation();
  const element = this;
  const item = parseInt(element.dataset.wlitem || "0", 10);
  if (worklist_selection.length === 1 && worklist_selection[0] === item) {
    element.classList.remove("ui-selected");
    set_worklist_selection([]);
  } else {
    const parent = element.parentElement;
    if (parent) {
      parent.querySelectorAll(".ui-selected").forEach((el) => el.classList.remove("ui-selected"));
    }
    element.classList.add("ui-selected");
    set_worklist_selection([item]);
  }
  update_worklist_actions();
}
function update_worklist_actions() {
  if (worklist_selection.length > 0) {
    setBtnEnabled("city_worklist_up_btn", true);
    setBtnEnabled("city_worklist_remove_btn", true);
    if (worklist_selection[worklist_selection.length - 1] === active_city["worklist"].length - 1) {
      setBtnEnabled("city_worklist_down_btn", false);
    } else {
      setBtnEnabled("city_worklist_down_btn", true);
    }
  } else {
    setBtnEnabled("city_worklist_up_btn", false);
    setBtnEnabled("city_worklist_down_btn", false);
    setBtnEnabled("city_worklist_exchange_btn", false);
    setBtnEnabled("city_worklist_remove_btn", false);
  }
  if (production_selection.length > 0) {
    setBtnEnabled("city_add_to_worklist_btn", true);
    setBtnEnabled("city_worklist_insert_btn", true);
    if (production_selection.length == worklist_selection.length || worklist_selection.length == 1) {
      setBtnEnabled("city_worklist_exchange_btn", true);
    } else {
      setBtnEnabled("city_worklist_exchange_btn", false);
    }
  } else {
    setBtnEnabled("city_add_to_worklist_btn", false);
    setBtnEnabled("city_worklist_insert_btn", false);
    setBtnEnabled("city_worklist_exchange_btn", false);
  }
  if (production_selection.length === 1) {
    setBtnEnabled("city_change_production_btn", true);
  } else {
    setBtnEnabled("city_change_production_btn", false);
  }
}
function send_city_worklist(city_id) {
  const worklist = cities$1[city_id]["worklist"];
  const overflow = worklist.length - MAX_LEN_WORKLIST;
  if (overflow > 0) {
    worklist.splice(MAX_LEN_WORKLIST, overflow);
  }
  send_request(JSON.stringify({
    pid: packet_city_worklist,
    city_id,
    worklist
  }));
}
function send_city_worklist_add(city_id, kind, value) {
  const pcity = cities$1[city_id];
  if (pcity["worklist"].length >= MAX_LEN_WORKLIST) {
    return;
  }
  pcity["worklist"].push({ "kind": kind, "value": value });
  send_city_worklist(city_id);
}
function city_change_production() {
  if (clientIsObserver()) return;
  if (production_selection.length === 1) {
    send_city_change(
      active_city["id"],
      production_selection[0].kind,
      production_selection[0].value
    );
  }
}
function city_add_to_worklist() {
  if (production_selection.length > 0) {
    active_city["worklist"] = active_city["worklist"].concat(production_selection);
    send_city_worklist(active_city["id"]);
  }
}
function handle_current_worklist_direct_remove() {
  const idx = parseInt(this.dataset.wlitem || "0", 10);
  active_city["worklist"].splice(idx, 1);
  let i2 = worklist_selection.length - 1;
  while (i2 >= 0 && worklist_selection[i2] > idx) {
    worklist_selection[i2]--;
    i2--;
  }
  if (i2 >= 0 && worklist_selection[i2] === idx) {
    worklist_selection.splice(i2, 1);
  }
  send_city_worklist(active_city["id"]);
}
function city_insert_in_worklist() {
  const count = Math.min(production_selection.length, MAX_LEN_WORKLIST);
  if (count === 0) return;
  let i2;
  const wl = active_city["worklist"];
  if (worklist_selection.length === 0) {
    wl.splice(...[0, 0].concat(production_selection));
    for (i2 = 0; i2 < count; i2++) {
      worklist_selection.push(i2);
    }
  } else {
    wl.splice(...[worklist_selection[0], 0].concat(production_selection));
    for (i2 = 0; i2 < worklist_selection.length; i2++) {
      worklist_selection[i2] += count;
    }
  }
  send_city_worklist(active_city["id"]);
}
function city_worklist_task_up() {
  let count = worklist_selection.length;
  if (count === 0) return;
  let swap;
  const wl = active_city["worklist"];
  if (worklist_selection[0] === 0) {
    worklist_selection.shift();
    if (wl[0].kind !== active_city["production_kind"] || wl[0].value !== active_city["production_value"]) {
      swap = wl[0];
      wl[0] = {
        kind: active_city["production_kind"],
        value: active_city["production_value"]
      };
      send_city_change(active_city["id"], swap.kind, swap.value);
    }
    count--;
  }
  for (let i2 = 0; i2 < count; i2++) {
    const task_idx = worklist_selection[i2];
    swap = wl[task_idx - 1];
    wl[task_idx - 1] = wl[task_idx];
    wl[task_idx] = swap;
    worklist_selection[i2]--;
  }
  send_city_worklist(active_city["id"]);
}
function city_worklist_task_down() {
  let count = worklist_selection.length;
  if (count === 0) return;
  let swap;
  const wl = active_city["worklist"];
  if (worklist_selection[--count] === wl.length - 1) return;
  while (count >= 0) {
    const task_idx = worklist_selection[count];
    swap = wl[task_idx + 1];
    wl[task_idx + 1] = wl[task_idx];
    wl[task_idx] = swap;
    worklist_selection[count]++;
    count--;
  }
  send_city_worklist(active_city["id"]);
}
function city_exchange_worklist_task() {
  let prod_l = production_selection.length;
  if (prod_l === 0) return;
  let i2;
  let same = true;
  const wl = active_city["worklist"];
  const task_l = worklist_selection.length;
  if (prod_l === task_l) {
    for (i2 = 0; i2 < prod_l; i2++) {
      if (same && (wl[worklist_selection[i2]].kind !== production_selection[i2].kind || wl[worklist_selection[i2]].value !== production_selection[i2].value)) {
        same = false;
      }
      wl[worklist_selection[i2]] = production_selection[i2];
    }
  } else if (task_l === 1) {
    i2 = worklist_selection[0];
    wl.splice(...[i2, 1].concat(production_selection));
    same = false;
    while (--prod_l) {
      worklist_selection.push(++i2);
    }
  }
  if (!same) {
    send_city_worklist(active_city["id"]);
  }
}
function city_worklist_task_remove() {
  let count = worklist_selection.length;
  if (count === 0) return;
  const wl = active_city["worklist"];
  while (--count >= 0) {
    wl.splice(worklist_selection[count], 1);
  }
  set_worklist_selection([]);
  send_city_worklist(active_city["id"]);
}
function byId$1(id) {
  return document.getElementById(id);
}
function setHtml$1(id, html) {
  const el = byId$1(id);
  if (el) el.innerHTML = html;
}
set_city_screen_updater_fn(update_city_screen);
function show_city_dialog_by_id(pcity_id) {
  show_city_dialog(cities$1[pcity_id]);
}
function show_city_dialog(pcity) {
  let turns_to_complete;
  let sprite;
  let punit;
  if (active_city != pcity || active_city == null) {
    set_city_prod_clicks(0);
    set_production_selection([]);
    set_worklist_selection([]);
  }
  if (active_city != null) close_city_dialog();
  set_active_city(pcity);
  if (pcity == null) return;
  byId$1("city_dialog")?.remove();
  const dlg = document.createElement("div");
  dlg.id = "city_dialog";
  const dlgWidth = isSmallScreen() ? "98%" : "80%";
  const dlgHeight = isSmallScreen() ? window.innerHeight + 10 : window.innerHeight - 80;
  dlg.style.cssText = "position:fixed;z-index:4000;background:#222;border:1px solid #555;padding:0;left:50%;top:50%;transform:translate(-50%,-50%);width:" + dlgWidth + ";height:" + dlgHeight + "px;overflow:auto;color:#fff;";
  document.getElementById("game_page")?.appendChild(dlg);
  const city_data = {};
  const titleBar = document.createElement("div");
  titleBar.style.cssText = "background:#333;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #555;";
  titleBar.innerHTML = '<span style="font-weight:bold;">' + decodeURIComponent(pcity["name"]) + " (" + pcity["size"] + ")</span>";
  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:6px;";
  const buttonDefs = isSmallScreen() ? [["Next", next_city], ["Buy", request_city_buy], ["Close", close_city_dialog]] : [["Previous city", previous_city], ["Next city (N)", next_city], ["Buy (B)", request_city_buy], ["Rename", rename_city], ["Close", close_city_dialog]];
  buttonDefs.forEach(([label, fn]) => {
    const b2 = document.createElement("button");
    b2.textContent = label;
    b2.addEventListener("click", fn);
    btnRow.appendChild(b2);
  });
  titleBar.appendChild(btnRow);
  dlg.appendChild(titleBar);
  const contentArea = document.createElement("div");
  contentArea.style.cssText = "padding:8px;overflow:auto;height:calc(100% - 50px);";
  contentArea.innerHTML = window.Handlebars.templates["city"](city_data);
  dlg.appendChild(contentArea);
  const cityCanvas = byId$1("city_canvas");
  if (cityCanvas) cityCanvas.addEventListener("click", city_mapview_mouse_click);
  dlg.addEventListener("keydown", function(e2) {
    if (e2.key === "Escape") close_city_dialog();
    else city_keyboard_listener(e2);
  });
  byId$1("game_text_input")?.blur();
  if (!isSmallScreen()) {
    byId$1("city_tabs-6")?.remove();
    document.querySelectorAll(".extra_tabs_small").forEach((el) => el.remove());
    byId$1("mobile_cma_checkbox")?.remove();
  } else {
    byId$1("city_tabs-5")?.remove();
    document.querySelectorAll(".extra_tabs_big").forEach((el) => el.remove());
    const cityStats = byId$1("city_stats");
    if (cityStats) cityStats.style.display = "none";
    const unitsElement = byId$1("city_improvements_panel");
    const cityUnitsTab = byId$1("city_units_tab");
    if (unitsElement && cityUnitsTab) {
      cityUnitsTab.appendChild(unitsElement);
    }
  }
  initTabs("#city_tabs", { active: city_tab_index });
  const tabHeight = isSmallScreen() ? window.innerHeight - 110 : window.innerHeight - 225;
  document.querySelectorAll(".citydlg_tabs").forEach((el) => {
    el.style.height = tabHeight + "px";
  });
  city_worklist_dialog(pcity);
  set_citydlg_dimensions(pcity);
  set_city_mapview_active();
  center_tile_mapcanvas(cityTile(pcity));
  update_map_canvas(0, 0, mapview$1["store_width"] ?? 0, mapview$1["store_height"] ?? 0);
  let governor_text = "";
  if (typeof pcity["cma_enabled"] !== "undefined") {
    governor_text = "<br>" + (pcity["cma_enabled"] ? "Governor Enabled" : "Governor Disabled");
  }
  setHtml$1("city_size", "Population: " + numberWithCommas(cityPopulation(pcity) * 1e3) + "<br>Size: " + pcity["size"] + "<br>Granary: " + pcity["food_stock"] + "/" + pcity["granary_size"] + "<br>Change in: " + cityTurnsToGrowthText(pcity) + governor_text);
  const prod_type = getCityProductionTypeSprite(pcity);
  setHtml$1("city_production_overview", "Producing: " + (prod_type != null ? prod_type["type"]["name"] : "None"));
  turns_to_complete = getCityProductionTime(pcity);
  if (turns_to_complete != FC_INFINITY) {
    setHtml$1("city_production_turns_overview", turns_to_complete + " turns &nbsp;&nbsp;(" + getProductionProgress(pcity) + ")");
  } else {
    setHtml$1("city_production_turns_overview", "-");
  }
  let improvements_html = "";
  for (let z2 = 0; z2 < (store.rulesControl?.num_impr_types ?? 0); z2++) {
    if (pcity["improvements"] != null && pcity["improvements"].isSet(z2)) {
      sprite = get_improvement_image_sprite(store.improvements[z2]);
      if (sprite == null) {
        console.log("Missing sprite for improvement " + z2);
        continue;
      }
      improvements_html = improvements_html + "<div id='city_improvement_element'><div style='background: transparent url(" + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + `px;float:left; 'title="` + store.improvements[z2]["helptext"] + `" onclick='city_sell_improvement(` + z2 + ");'></div>" + store.improvements[z2]["name"] + "</div>";
    }
  }
  setHtml$1("city_improvements_list", improvements_html);
  const punits = tile_units(cityTile(pcity));
  if (punits != null) {
    let present_units_html = "";
    for (let r2 = 0; r2 < punits.length; r2++) {
      punit = punits[r2];
      sprite = get_unit_image_sprite(punit);
      if (sprite == null) {
        console.log("Missing sprite for " + punit);
        continue;
      }
      present_units_html = present_units_html + "<div class='game_unit_list_item' title='" + get_unit_city_info(punit) + "' style='cursor:pointer;cursor:hand; background: transparent url(" + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;float:left; ' onclick='city_dialog_activate_unit(units[" + punit["id"] + "]);'></div>";
    }
    setHtml$1("city_present_units_list", present_units_html);
  }
  const sunits = get_supported_units(pcity);
  if (sunits != null) {
    let supported_units_html = "";
    for (let t2 = 0; t2 < sunits.length; t2++) {
      punit = sunits[t2];
      sprite = get_unit_image_sprite(punit);
      if (sprite == null) {
        console.log("Missing sprite for " + punit);
        continue;
      }
      supported_units_html = supported_units_html + "<div class='game_unit_list_item' title='" + get_unit_city_info(punit) + "' style='cursor:pointer;cursor:hand; background: transparent url(" + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;float:left; ' onclick='city_dialog_activate_unit(units[" + punit["id"] + "]);'></div>";
    }
    setHtml$1("city_supported_units_list", supported_units_html);
  }
  if ("prod" in pcity && "surplus" in pcity) {
    let food_txt = pcity["prod"][O_FOOD$1] + " ( ";
    if (pcity["surplus"][O_FOOD$1] > 0) food_txt += "+";
    food_txt += pcity["surplus"][O_FOOD$1] + ")";
    let shield_txt = pcity["prod"][O_SHIELD$1] + " ( ";
    if (pcity["surplus"][O_SHIELD$1] > 0) shield_txt += "+";
    shield_txt += pcity["surplus"][O_SHIELD$1] + ")";
    let trade_txt = pcity["prod"][O_TRADE] + " ( ";
    if (pcity["surplus"][O_TRADE] > 0) trade_txt += "+";
    trade_txt += pcity["surplus"][O_TRADE] + ")";
    let gold_txt = pcity["prod"][O_GOLD$1] + " ( ";
    if (pcity["surplus"][O_GOLD$1] > 0) gold_txt += "+";
    gold_txt += pcity["surplus"][O_GOLD$1] + ")";
    const luxury_txt = pcity["prod"][O_LUXURY];
    const science_txt = pcity["prod"][O_SCIENCE];
    setHtml$1("city_food", food_txt);
    setHtml$1("city_prod", shield_txt);
    setHtml$1("city_trade", trade_txt);
    setHtml$1("city_gold", gold_txt);
    setHtml$1("city_luxury", luxury_txt);
    setHtml$1("city_science", science_txt);
    setHtml$1("city_corruption", pcity["waste"][O_TRADE]);
    setHtml$1("city_waste", pcity["waste"][O_SHIELD$1]);
    setHtml$1("city_pollution", pcity["pollution"]);
    setHtml$1("city_steal", pcity["steal"]);
    setHtml$1("city_culture", pcity["culture"]);
  }
  let specialist_html = "";
  const citizen_types = ["angry", "unhappy", "content", "happy"];
  for (let s2 = 0; s2 < citizen_types.length; s2++) {
    if (pcity["ppl_" + citizen_types[s2]] == null) continue;
    for (let i2 = 0; i2 < pcity["ppl_" + citizen_types[s2]][FEELING_FINAL$1]; i2++) {
      sprite = get_specialist_image_sprite();
      specialist_html = specialist_html + "<div class='specialist_item' style='background: transparent url(" + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;float:left; ' title='One " + citizen_types[s2] + " citizen'></div>";
    }
  }
  for (let u2 = 0; u2 < pcity["specialists_size"]; u2++) {
    const spec_type_name = window.specialists[u2]["plural_name"];
    "specialist." + window.specialists[u2]["rule_name"] + "_0";
    for (let j2 = 0; j2 < pcity["specialists"][u2]; j2++) {
      sprite = get_specialist_image_sprite();
      specialist_html = specialist_html + "<div class='specialist_item' style='cursor:pointer;cursor:hand; background: transparent url(" + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;float:left; ' onclick='city_change_specialist(" + pcity["id"] + "," + window.specialists[u2]["id"] + ");' title='" + spec_type_name + " (click to change)'></div>";
    }
  }
  specialist_html += "<div style='clear: both;'></div>";
  setHtml$1("specialist_panel", specialist_html);
  const disbandEl = byId$1("disbandable_city");
  if (disbandEl) {
    const newDisband = disbandEl.cloneNode(true);
    disbandEl.parentNode?.replaceChild(newDisband, disbandEl);
    newDisband.checked = pcity["city_options"] != null && pcity["city_options"].isSet(CITYO_DISBAND);
    newDisband.addEventListener("click", function() {
      const options = pcity["city_options"];
      const packet = {
        "pid": packet_city_options_req,
        "city_id": active_city["id"],
        "options": options.raw
      };
      if (newDisband.checked) {
        options.set(CITYO_DISBAND);
      } else {
        options.unset(CITYO_DISBAND);
      }
      send_request(JSON.stringify(packet));
    });
  }
  if (isSmallScreen()) {
    document.querySelectorAll(".ui-tabs-anchor").forEach((el) => {
      el.style.padding = "2px";
    });
  }
}
function request_city_buy() {
  if (clientIsObserver()) return;
  const pcity = active_city;
  const pplayer = clientPlaying();
  byId$1("dialog")?.remove();
  let buy_question_string = "";
  if (pcity["production_kind"] == VUT_UTYPE) {
    const punit_type = store.unitTypes[pcity["production_value"]];
    if (punit_type != null) {
      punit_type["name"] + " costs " + pcity["buy_cost"] + " gold.";
      buy_question_string = "Buy " + punit_type["name"] + " for " + pcity["buy_cost"] + " gold?";
    }
  } else {
    const improvement = store.improvements[pcity["production_value"]];
    if (improvement != null) {
      improvement["name"] + " costs " + pcity["buy_cost"] + " gold.";
      buy_question_string = "Buy " + improvement["name"] + " for " + pcity["buy_cost"] + " gold?";
    }
  }
  const treasury_text = "<br>Treasury contains " + pplayer["gold"] + " gold.";
  if (pcity["buy_cost"] > pplayer["gold"]) {
    return;
  }
  const buyDlg = document.createElement("div");
  buyDlg.id = "dialog";
  buyDlg.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:30%;left:50%;transform:translateX(-50%);width:" + (isSmallScreen() ? "95%" : "50%") + ";color:#fff;";
  buyDlg.innerHTML = '<div style="font-weight:bold;margin-bottom:8px;">Buy It!</div>' + buy_question_string + treasury_text + '<div style="margin-top:12px;display:flex;gap:8px;"><button id="buy_yes_btn">Yes</button><button id="buy_no_btn">No</button></div>';
  document.getElementById("game_page")?.appendChild(buyDlg);
  byId$1("buy_yes_btn")?.addEventListener("click", function() {
    send_city_buy();
    buyDlg.remove();
  });
  byId$1("buy_no_btn")?.addEventListener("click", function() {
    buyDlg.remove();
  });
}
function send_city_buy() {
  if (clientIsObserver()) return;
  if (active_city != null) {
    const packet = { "pid": packet_city_buy, "city_id": active_city["id"] };
    send_request(JSON.stringify(packet));
  }
}
function send_city_change(city_id, kind, value) {
  const packet = {
    "pid": packet_city_change,
    "city_id": city_id,
    "production_kind": kind,
    "production_value": value
  };
  send_request(JSON.stringify(packet));
}
function close_city_dialog() {
  byId$1("city_dialog")?.remove();
  city_dialog_close_handler();
}
function city_dialog_close_handler() {
  setDefaultMapviewActive();
  if (active_city != null) {
    setupWindowSize();
    center_tile_mapcanvas(cityTile(active_city));
    set_active_city(null);
    if (window.renderer == RENDERER_2DCANVAS$1) {
      update_map_canvas_full();
    }
  }
}
function city_name_dialog(suggested_name, unit_id) {
  byId$1("city_name_dialog")?.remove();
  const nameDlg = document.createElement("div");
  nameDlg.id = "city_name_dialog";
  nameDlg.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:30%;left:50%;transform:translateX(-50%);width:300px;color:#fff;";
  nameDlg.innerHTML = '<div style="font-weight:bold;margin-bottom:8px;">Build New City</div><div>What should we call our new city?</div><input id="city_name_req" type="text" style="width:100%;margin:8px 0;"><div style="display:flex;gap:8px;"><button id="city_name_ok">Ok</button><button id="city_name_cancel">Cancel</button></div>';
  document.getElementById("game_page")?.appendChild(nameDlg);
  const nameInput = byId$1("city_name_req");
  if (nameInput) {
    nameInput.value = suggested_name;
    nameInput.maxLength = MAX_LEN_NAME;
  }
  function submitName() {
    const name = nameInput?.value || "";
    if (name.length == 0 || name.length >= MAX_LEN_CITYNAME - 6 || encodeURIComponent(name).length >= MAX_LEN_CITYNAME - 6) {
      swal("City name is invalid. Please try a different shorter name.");
      return;
    }
    const actor_unit = game_find_unit_by_number(unit_id);
    request_unit_do_action(
      ACTION_FOUND_CITY,
      unit_id,
      actor_unit["tile"],
      0,
      encodeURIComponent(name)
    );
    nameDlg.remove();
    act_sel_queue_done(unit_id);
  }
  function cancelName() {
    nameDlg.remove();
    act_sel_queue_done(unit_id);
  }
  byId$1("city_name_ok")?.addEventListener("click", submitName);
  byId$1("city_name_cancel")?.addEventListener("click", cancelName);
  nameDlg.addEventListener("keyup", function(e2) {
    if (e2.key === "Enter") submitName();
  });
  blur_input_on_touchdevice();
}
function next_city() {
  if (!clientPlaying()) return;
  city_screen_updater.fireNow();
  const currentRow = byId$1("cities_list_" + active_city["id"]);
  let nextRow = currentRow?.nextElementSibling;
  if (!nextRow) {
    nextRow = document.querySelector("#city_table tbody tr");
  }
  if (nextRow?.id) {
    show_city_dialog(cities$1[nextRow.id.substr(12)]);
  }
}
function previous_city() {
  if (!clientPlaying()) return;
  city_screen_updater.fireNow();
  const currentRow = byId$1("cities_list_" + active_city["id"]);
  let prevRow = currentRow?.previousElementSibling;
  if (!prevRow) {
    const rows = document.querySelectorAll("#city_table tbody tr");
    prevRow = rows.length > 0 ? rows[rows.length - 1] : null;
  }
  if (prevRow?.id) {
    show_city_dialog(cities$1[prevRow.id.substr(12)]);
  }
}
function city_sell_improvement(improvement_id) {
  if (clientIsObserver()) return;
  if ("confirm" in window) {
    const agree = confirm("Are you sure you want to sell this building?");
    if (agree) {
      const packet = {
        "pid": packet_city_sell,
        "city_id": active_city["id"],
        "build_id": improvement_id
      };
      send_request(JSON.stringify(packet));
    }
  } else {
    const packet = {
      "pid": packet_city_sell,
      "city_id": active_city["id"],
      "build_id": improvement_id
    };
    send_request(JSON.stringify(packet));
  }
}
function city_change_specialist(city_id, from_specialist_id) {
  if (clientIsObserver()) return;
  const city_message = {
    "pid": packet_city_change_specialist,
    "city_id": city_id,
    "from": from_specialist_id,
    "to": (from_specialist_id + 1) % 3
  };
  send_request(JSON.stringify(city_message));
}
function rename_city() {
  if (clientIsObserver() || active_city == null) return;
  byId$1("city_name_dialog")?.remove();
  const renameDlg = document.createElement("div");
  renameDlg.id = "city_name_dialog";
  renameDlg.style.cssText = "position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:30%;left:50%;transform:translateX(-50%);width:300px;color:#fff;";
  renameDlg.innerHTML = '<div style="font-weight:bold;margin-bottom:8px;">Rename City</div><div>What should we call this city?</div><input id="city_name_req" type="text" style="width:100%;margin:8px 0;"><div style="display:flex;gap:8px;"><button id="rename_ok">Ok</button><button id="rename_cancel">Cancel</button></div>';
  document.getElementById("game_page")?.appendChild(renameDlg);
  const nameInput = byId$1("city_name_req");
  if (nameInput) {
    nameInput.value = active_city["name"];
    nameInput.maxLength = MAX_LEN_NAME;
  }
  function submitRename() {
    const name = nameInput?.value || "";
    if (name.length == 0 || name.length >= MAX_LEN_NAME - 4 || encodeURIComponent(name).length >= MAX_LEN_NAME - 4) {
      swal("City name is invalid");
      return;
    }
    const packet = { "pid": packet_city_rename, "name": encodeURIComponent(name), "city_id": active_city["id"] };
    send_request(JSON.stringify(packet));
    renameDlg.remove();
  }
  byId$1("rename_ok")?.addEventListener("click", submitRename);
  byId$1("rename_cancel")?.addEventListener("click", function() {
    renameDlg.remove();
  });
  renameDlg.addEventListener("keyup", function(e2) {
    if (e2.key === "Enter") submitRename();
  });
}
function update_city_screen() {
  if (store.observing) return;
  const sortList = [];
  document.querySelectorAll("#city_table thead th").forEach((th) => {
    const el = th;
    if (el.classList.contains("tablesorter-headerAsc")) sortList.push([el.cellIndex, 0]);
    else if (el.classList.contains("tablesorter-headerDesc")) sortList.push([el.cellIndex, 1]);
  });
  let city_list_html = "<table class='tablesorter' id='city_table' border=0 cellspacing=0><thead><tr><th>Name</th><th>Population</th><th>Size</th><th>State</th><th>Granary</th><th>Grows In</th><th>Producing</th><th>Surplus<br>Food/Prod/Trade</th><th>Economy<br>Gold/Luxury/Science</th></tr></thead><tbody>";
  let count = 0;
  for (const city_id in cities$1) {
    const pcity = cities$1[city_id];
    if (clientPlaying() != null && cityOwner(pcity) != null && cityOwner(pcity).playerno == clientPlaying().playerno) {
      count++;
      const prod_type = getCityProductionType(pcity);
      let turns_to_complete_str;
      if (getCityProductionTime(pcity) == FC_INFINITY) {
        turns_to_complete_str = "-";
      } else {
        turns_to_complete_str = getCityProductionTime(pcity) + " turns";
      }
      city_list_html += "<tr class='cities_row' id='cities_list_" + pcity["id"] + "' onclick='javascript:show_city_dialog_by_id(" + pcity["id"] + ");'><td>" + pcity["name"] + "</td><td>" + numberWithCommas(cityPopulation(pcity) * 1e3) + "</td><td>" + pcity["size"] + "</td><td>" + get_city_state(pcity) + "</td><td>" + pcity["food_stock"] + "/" + pcity["granary_size"] + "</td><td>" + cityTurnsToGrowthText(pcity) + "</td><td>" + prod_type["name"] + " (" + turns_to_complete_str + ")</td><td>" + pcity["surplus"][O_FOOD$1] + "/" + pcity["surplus"][O_SHIELD$1] + "/" + pcity["surplus"][O_TRADE] + "</td><td>" + pcity["prod"][O_GOLD$1] + "/" + pcity["prod"][O_LUXURY] + "/" + pcity["prod"][O_SCIENCE] + "<td>";
      city_list_html += "</tr>";
    }
  }
  city_list_html += "</tbody></table>";
  setHtml$1("cities_list", city_list_html);
  if (count == 0) {
    setHtml$1("city_table", "You have no cities. Build new cities with the Settlers unit.");
  }
  const citiesScroll = byId$1("cities_scroll");
  if (citiesScroll) citiesScroll.style.height = window.innerHeight - 200 + "px";
  initTableSort("#city_table", { sortList });
}
function get_city_state(pcity) {
  if (pcity == null) return;
  if (pcity["was_happy"] && pcity["size"] >= 3) {
    return "Celebrating";
  } else if (pcity["unhappy"]) {
    return "Disorder";
  } else {
    return "Peace";
  }
}
function city_keyboard_listener(ev) {
  if (document.querySelector("input:focus") || !keyboard_input) return;
  if (C_S_RUNNING != clientState()) return;
  if (!ev) ev = window.event;
  const keyboard_key = String.fromCharCode(ev.keyCode);
  if (active_city != null) {
    switch (keyboard_key) {
      case "N":
        next_city();
        ev.stopPropagation();
        break;
      case "B":
        request_city_buy();
        ev.stopPropagation();
        break;
    }
  }
}
function set_citydlg_dimensions(pcity) {
  const city_radius = pcity.city_radius_sq;
  const radius_tiles = Math.ceil(Math.sqrt(city_radius));
  set_citydlg_map_width(tileset_width + radius_tiles * tileset_width);
  set_citydlg_map_height(tileset_height + radius_tiles * tileset_height);
  const canvasDiv = byId$1("city_canvas_div");
  if (canvasDiv) {
    canvasDiv.style.width = citydlg_map_width + "px";
    canvasDiv.style.height = citydlg_map_height + "px";
  }
  const canvas = byId$1("city_canvas");
  if (canvas) {
    canvas.width = citydlg_map_width;
    canvas.height = citydlg_map_height;
  }
}
function get_specialist_image_sprite(key) {
}
function city_mapview_mouse_click() {
}
const _w$1 = window;
function get_unit_image_sprite(punit) {
  const from_type = get_unit_type_image_sprite(unit_type(punit));
  from_type["height"] = from_type["height"] - 2;
  return from_type;
}
function get_unit_type_image_sprite(punittype) {
  const tag = tileset_unit_type_graphic_tag(punittype);
  if (tag == null) return null;
  const tileset_x = _w$1.tileset[tag][0];
  const tileset_y = _w$1.tileset[tag][1];
  const width = _w$1.tileset[tag][2];
  const height = _w$1.tileset[tag][3];
  const i2 = _w$1.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + _w$1.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
function get_improvement_image_sprite(pimprovement) {
  const tag = tileset_building_graphic_tag(pimprovement);
  if (tag == null) return null;
  const tileset_x = _w$1.tileset[tag][0];
  const tileset_y = _w$1.tileset[tag][1];
  const width = _w$1.tileset[tag][2];
  const height = _w$1.tileset[tag][3];
  const i2 = _w$1.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + _w$1.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
function get_technology_image_sprite(ptech) {
  const tag = tileset_tech_graphic_tag(ptech);
  if (tag == null) return null;
  const tileset_x = _w$1.tileset[tag][0];
  const tileset_y = _w$1.tileset[tag][1];
  const width = _w$1.tileset[tag][2];
  const height = _w$1.tileset[tag][3];
  const i2 = _w$1.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + _w$1.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
function get_treaty_agree_thumb_up() {
  const tag = "treaty.agree_thumb_up";
  const tileset_x = _w$1.tileset[tag][0];
  const tileset_y = _w$1.tileset[tag][1];
  const width = _w$1.tileset[tag][2];
  const height = _w$1.tileset[tag][3];
  const i2 = _w$1.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + _w$1.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
function get_treaty_disagree_thumb_down() {
  const tag = "treaty.disagree_thumb_down";
  const tileset_x = _w$1.tileset[tag][0];
  const tileset_y = _w$1.tileset[tag][1];
  const width = _w$1.tileset[tag][2];
  const height = _w$1.tileset[tag][3];
  const i2 = _w$1.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + _w$1.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
const SSA_NONE = ServerSideAgent.NONE;
const SSA_AUTOWORKER = ServerSideAgent.AUTOWORKER;
const SSA_AUTOEXPLORE = ServerSideAgent.AUTOEXPLORE;
const DIR8_NORTHWEST = 0;
const DIR8_NORTH = 1;
const DIR8_NORTHEAST = 2;
const DIR8_WEST = 3;
const DIR8_EAST = 4;
const DIR8_SOUTHWEST = 5;
const DIR8_SOUTH = 6;
const DIR8_SOUTHEAST = 7;
const _w = window;
let num_cardinal_tileset_dirs = 4;
let cardinal_tileset_dirs = [DIR8_NORTH, DIR8_EAST, DIR8_SOUTH, DIR8_WEST];
let NUM_CORNER_DIRS = 4;
let DIR4_TO_DIR8 = [DIR8_NORTH, DIR8_SOUTH, DIR8_EAST, DIR8_WEST];
let current_select_sprite = 0;
let max_select_sprite = 4;
let explosion_anim_map = {};
const LAYER_TERRAIN1 = 0;
const LAYER_TERRAIN2 = 1;
const LAYER_TERRAIN3 = 2;
const LAYER_ROADS = 3;
const LAYER_SPECIAL1 = 4;
const LAYER_CITY1 = 5;
const LAYER_SPECIAL2 = 6;
const LAYER_UNIT = 7;
const LAYER_FOG = 8;
const LAYER_SPECIAL3 = 9;
const LAYER_TILELABEL = 10;
const LAYER_CITYBAR = 11;
const LAYER_GOTO = 12;
const LAYER_COUNT = 13;
const MATCH_NONE = 0;
const MATCH_SAME = 1;
const MATCH_PAIR = 2;
const MATCH_FULL = 3;
const CELL_WHOLE = 0;
const CELL_CORNER = 1;
function tileset_has_tag(tagname) {
  return _w.sprites[tagname] != null;
}
function tileset_ruleset_entity_tag_str_or_alt(entity, kind_name) {
  if (entity == null) {
    console.log("No " + kind_name + " to return tag for.");
    return null;
  }
  if (tileset_has_tag(entity["graphic_str"])) {
    return entity["graphic_str"];
  }
  if (tileset_has_tag(entity["graphic_alt"])) {
    return entity["graphic_alt"];
  }
  console.log("No graphic for " + kind_name + " " + entity["name"]);
  return null;
}
function tileset_extra_graphic_tag(extra) {
  return tileset_ruleset_entity_tag_str_or_alt(extra, "extra");
}
function tileset_unit_type_graphic_tag(utype) {
  if (tileset_has_tag(utype["graphic_str"] + "_Idle")) {
    return utype["graphic_str"] + "_Idle";
  }
  if (tileset_has_tag(utype["graphic_alt"] + "_Idle")) {
    return utype["graphic_alt"] + "_Idle";
  }
  console.log("No graphic for unit " + utype["name"]);
  return null;
}
function tileset_unit_graphic_tag(punit) {
  return tileset_unit_type_graphic_tag(unit_type(punit));
}
function tileset_building_graphic_tag(pimprovement) {
  return tileset_ruleset_entity_tag_str_or_alt(pimprovement, "building");
}
function tileset_tech_graphic_tag(ptech) {
  return tileset_ruleset_entity_tag_str_or_alt(ptech, "tech");
}
function tileset_extra_id_graphic_tag(extra_id) {
  return tileset_extra_graphic_tag(store.extras[extra_id]);
}
function tileset_extra_activity_graphic_tag(extra) {
  if (extra == null) {
    console.log("No extra to return tag for.");
    return null;
  }
  if (tileset_has_tag(extra["activity_gfx"])) {
    return extra["activity_gfx"];
  }
  if (tileset_has_tag(extra["act_gfx_alt"])) {
    return extra["act_gfx_alt"];
  }
  if (tileset_has_tag(extra["act_gfx_alt2"])) {
    return extra["act_gfx_alt2"];
  }
  console.log("No activity graphic for extra " + extra["name"]);
  return null;
}
function tileset_extra_id_activity_graphic_tag(extra_id) {
  return tileset_extra_activity_graphic_tag(store.extras[extra_id]);
}
function tileset_extra_rmactivity_graphic_tag(extra) {
  if (extra == null) {
    console.log("No extra to return tag for.");
    return null;
  }
  if (tileset_has_tag(extra["rmact_gfx"])) {
    return extra["rmact_gfx"];
  }
  if (tileset_has_tag(extra["rmact_gfx_alt"])) {
    return extra["rmact_gfx_alt"];
  }
  if (tileset_has_tag(extra["rmact_gfx_alt2"])) {
    return extra["rmact_gfx_alt2"];
  }
  console.log("No removal activity graphic for extra " + extra["name"]);
  return null;
}
function tileset_extra_id_rmactivity_graphic_tag(extra_id) {
  return tileset_extra_rmactivity_graphic_tag(store.extras[extra_id]);
}
function fill_sprite_array(layer, ptile, pedge, pcorner, punit, pcity, citymode) {
  let sprite_array = [];
  switch (layer) {
    case LAYER_TERRAIN1:
      if (ptile != null) {
        const tterrain_near = tileTerrainNear(ptile);
        const pterrain = tileTerrain(ptile);
        sprite_array = sprite_array.concat(fill_terrain_sprite_layer(0, ptile, pterrain, tterrain_near));
      }
      break;
    case LAYER_TERRAIN2:
      if (ptile != null) {
        const tterrain_near = tileTerrainNear(ptile);
        const pterrain = tileTerrain(ptile);
        sprite_array = sprite_array.concat(fill_terrain_sprite_layer(1, ptile, pterrain, tterrain_near));
      }
      break;
    case LAYER_TERRAIN3:
      if (ptile != null) {
        const tterrain_near = tileTerrainNear(ptile);
        const pterrain = tileTerrain(ptile);
        sprite_array = sprite_array.concat(fill_terrain_sprite_layer(2, ptile, pterrain, tterrain_near));
        if (typeof window.fill_irrigation_sprite_array === "function") {
          sprite_array = sprite_array.concat(window.fill_irrigation_sprite_array(ptile, pcity));
        }
      }
      break;
    case LAYER_ROADS:
      if (ptile != null) {
        sprite_array = sprite_array.concat(fill_path_sprite_array(ptile));
      }
      break;
    case LAYER_SPECIAL1:
      if (ptile != null) {
        const river_sprite = get_tile_river_sprite(ptile);
        if (river_sprite != null) sprite_array.push(river_sprite);
        const spec_sprite = get_tile_specials_sprite(ptile);
        if (spec_sprite != null) sprite_array.push(spec_sprite);
        if (tileHasExtra(ptile, _w.EXTRA_MINE)) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(_w.EXTRA_MINE)
          });
        }
        if (tileHasExtra(ptile, _w.EXTRA_OIL_WELL)) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(_w.EXTRA_OIL_WELL)
          });
        }
        sprite_array = sprite_array.concat(fill_layer1_sprite_array(ptile, pcity));
        if (tileHasExtra(ptile, _w.EXTRA_HUT)) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(_w.EXTRA_HUT)
          });
        }
        if (tileHasExtra(ptile, _w.EXTRA_POLLUTION)) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(_w.EXTRA_POLLUTION)
          });
        }
        if (tileHasExtra(ptile, _w.EXTRA_FALLOUT)) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(_w.EXTRA_FALLOUT)
          });
        }
        sprite_array = sprite_array.concat(get_border_line_sprites(ptile));
      }
      break;
    case LAYER_CITY1:
      if (pcity != null) {
        sprite_array.push(get_city_sprite(pcity));
        if (pcity["unhappy"]) {
          sprite_array.push({ "key": "city.disorder" });
        }
      }
      break;
    case LAYER_SPECIAL2:
      if (ptile != null) {
        sprite_array = sprite_array.concat(fill_layer2_sprite_array(ptile, pcity));
      }
      break;
    case LAYER_UNIT:
      const do_draw_unit = punit != null && draw_units;
      if (do_draw_unit && active_city == null) {
        const stacked = ptile["units"] != null && ptile["units"].length > 1;
        if (unit_is_in_focus$1(punit)) {
          sprite_array.push(get_select_sprite());
        }
        sprite_array = sprite_array.concat(fill_unit_sprite_array(punit, stacked));
      }
      if (ptile != null && explosion_anim_map[ptile["index"]] != null) {
        let explode_step = explosion_anim_map[ptile["index"]];
        explosion_anim_map[ptile["index"]] = explode_step - 1;
        if (explode_step > 20) {
          sprite_array.push({
            "key": "explode.unit_0",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else if (explode_step > 15) {
          sprite_array.push({
            "key": "explode.unit_1",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else if (explode_step > 10) {
          sprite_array.push({
            "key": "explode.unit_2",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else if (explode_step > 5) {
          sprite_array.push({
            "key": "explode.unit_3",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else if (explode_step > 0) {
          sprite_array.push({
            "key": "explode.unit_4",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else {
          delete explosion_anim_map[ptile["index"]];
        }
      }
      break;
    case LAYER_FOG:
      sprite_array = sprite_array.concat(fill_fog_sprite_array(ptile, pedge, pcorner));
      break;
    case LAYER_SPECIAL3:
      if (ptile != null) {
        sprite_array = sprite_array.concat(fill_layer3_sprite_array(ptile, pcity));
      }
      break;
    case LAYER_TILELABEL:
      if (ptile != null && ptile["label"] != null && ptile["label"].length > 0) {
        sprite_array.push(get_tile_label_text(ptile));
      }
      break;
    case LAYER_CITYBAR:
      if (pcity != null && show_citybar) {
        sprite_array.push(get_city_info_text(pcity));
      }
      if (active_city != null && ptile != null && ptile["worked"] != null && active_city["id"] == ptile["worked"] && active_city["output_food"] != null) {
        const ctile = cityTile(active_city);
        const d2 = mapDistanceVector(ctile, ptile);
        const idx = getCityDxyToIndex(d2[0], d2[1], active_city);
        let food_output = active_city["output_food"][idx];
        let shield_output = active_city["output_shield"][idx];
        let trade_output = active_city["output_trade"][idx];
        const gran = store.gameInfo?.granularity ?? 1;
        food_output = Math.floor(food_output / gran);
        shield_output = Math.floor(shield_output / gran);
        trade_output = Math.floor(trade_output / gran);
        sprite_array.push(get_city_food_output_sprite(food_output));
        sprite_array.push(get_city_shields_output_sprite(shield_output));
        sprite_array.push(get_city_trade_output_sprite(trade_output));
      } else if (active_city != null && ptile != null && ptile["worked"] != 0) {
        sprite_array.push(get_city_invalid_worked_sprite());
      }
      break;
    case LAYER_GOTO:
      if (ptile != null && ptile["goto_dir"] != null) {
        sprite_array = sprite_array.concat(fill_goto_line_sprite_array(ptile));
      }
      if (ptile != null && ptile["nuke"] > 0) {
        ptile["nuke"] = ptile["nuke"] - 1;
        sprite_array.push({
          "key": "explode.nuke",
          "offset_x": -45,
          "offset_y": -45
        });
      }
      break;
  }
  return sprite_array;
}
function fill_terrain_sprite_layer(layer_num, ptile, pterrain, tterrain_near) {
  return fill_terrain_sprite_array(layer_num, ptile, pterrain, tterrain_near);
}
function fill_terrain_sprite_array(l2, ptile, pterrain, tterrain_near) {
  if (pterrain == null) return [];
  if (tile_types_setup["l" + l2 + "." + pterrain["graphic_str"]] == null) {
    return [];
  }
  const dlp = tile_types_setup["l" + l2 + "." + pterrain["graphic_str"]];
  switch (dlp["sprite_type"]) {
    case CELL_WHOLE: {
      switch (dlp["match_style"]) {
        case MATCH_NONE: {
          const result_sprites = [];
          if (dlp["dither"] == true) {
            for (let i2 = 0; i2 < num_cardinal_tileset_dirs; i2++) {
              if (ts_tiles[tterrain_near[DIR4_TO_DIR8[i2]]["graphic_str"]] == null) continue;
              const near_dlp = tile_types_setup["l" + l2 + "." + tterrain_near[DIR4_TO_DIR8[i2]]["graphic_str"]];
              const terrain_near = near_dlp["dither"] == true ? tterrain_near[DIR4_TO_DIR8[i2]]["graphic_str"] : pterrain["graphic_str"];
              const dither_tile = i2 + pterrain["graphic_str"] + "_" + terrain_near;
              const x2 = dither_offset_x[i2];
              const y2 = dither_offset_y[i2];
              result_sprites.push({ "key": dither_tile, "offset_x": x2, "offset_y": y2 });
            }
            return result_sprites;
          } else {
            return [{ "key": "t.l" + l2 + "." + pterrain["graphic_str"] + 1 }];
          }
        }
        case MATCH_SAME: {
          let tileno = 0;
          const this_match_type = ts_tiles[pterrain["graphic_str"]]["layer" + l2 + "_match_type"];
          for (let i2 = 0; i2 < num_cardinal_tileset_dirs; i2++) {
            if (ts_tiles[tterrain_near[i2]["graphic_str"]] == null) continue;
            const that = ts_tiles[tterrain_near[i2]["graphic_str"]]["layer" + l2 + "_match_type"];
            if (that == this_match_type) {
              tileno |= 1 << i2;
            }
          }
          const gfx_key = "t.l" + l2 + "." + pterrain["graphic_str"] + "_" + cardinal_index_str(tileno);
          const y2 = tileset_tile_height - _w.tileset[gfx_key][3];
          return [{ "key": gfx_key, "offset_x": 0, "offset_y": y2 }];
        }
      }
      break;
    }
    case CELL_CORNER: {
      const W = normal_tile_width;
      const H2 = normal_tile_height;
      const iso_offsets = [[W / 4, 0], [W / 4, H2 / 2], [W / 2, H2 / 4], [0, H2 / 4]];
      const this_match_index = "l" + l2 + "." + pterrain["graphic_str"] in tile_types_setup ? tile_types_setup["l" + l2 + "." + pterrain["graphic_str"]]["match_index"][0] : -1;
      const result_sprites = [];
      for (let i2 = 0; i2 < NUM_CORNER_DIRS; i2++) {
        const count = dlp["match_indices"];
        let array_index = 0;
        const dir = dirCCW(DIR4_TO_DIR8[i2]);
        const x2 = iso_offsets[i2][0];
        const y2 = iso_offsets[i2][1];
        const m2 = [
          "l" + l2 + "." + tterrain_near[dirCCW(dir)]["graphic_str"] in tile_types_setup ? tile_types_setup["l" + l2 + "." + tterrain_near[dirCCW(dir)]["graphic_str"]]["match_index"][0] : -1,
          "l" + l2 + "." + tterrain_near[dir]["graphic_str"] in tile_types_setup ? tile_types_setup["l" + l2 + "." + tterrain_near[dir]["graphic_str"]]["match_index"][0] : -1,
          "l" + l2 + "." + tterrain_near[dirCW(dir)]["graphic_str"] in tile_types_setup ? tile_types_setup["l" + l2 + "." + tterrain_near[dirCW(dir)]["graphic_str"]]["match_index"][0] : -1
        ];
        switch (dlp["match_style"]) {
          case MATCH_NONE:
            break;
          case MATCH_SAME:
            const b1 = m2[2] != this_match_index ? 1 : 0;
            const b2 = m2[1] != this_match_index ? 1 : 0;
            const b3 = m2[0] != this_match_index ? 1 : 0;
            array_index = array_index * 2 + b1;
            array_index = array_index * 2 + b2;
            array_index = array_index * 2 + b3;
            break;
          case MATCH_PAIR:
            return [];
          case MATCH_FULL:
            {
              const n2 = [];
              let j2 = 0;
              for (; j2 < 3; j2++) {
                let k2 = 0;
                for (; k2 < count; k2++) {
                  n2[j2] = k2;
                  if (m2[j2] == dlp["match_index"][k2]) {
                    break;
                  }
                }
              }
              array_index = array_index * count + n2[2];
              array_index = array_index * count + n2[1];
              array_index = array_index * count + n2[0];
            }
            break;
        }
        array_index = array_index * NUM_CORNER_DIRS + i2;
        result_sprites.push({ "key": cellgroup_map[pterrain["graphic_str"] + "." + array_index] + "." + i2, "offset_x": x2, "offset_y": y2 });
      }
      return result_sprites;
    }
  }
  return [];
}
function fill_unit_sprite_array(punit, stacked, backdrop) {
  const unit_offset = get_unit_anim_offset(punit);
  const result = [
    get_unit_nation_flag_sprite(punit),
    {
      "key": tileset_unit_graphic_tag(punit),
      "offset_x": unit_offset["x"] + unit_offset_x,
      "offset_y": unit_offset["y"] - unit_offset_y
    }
  ];
  const activities = get_unit_activity_sprite(punit);
  if (activities != null) {
    activities["offset_x"] = activities["offset_x"] + unit_offset["x"];
    activities["offset_y"] = activities["offset_y"] + unit_offset["y"];
    result.push(activities);
  }
  const agent = get_unit_agent_sprite(punit);
  if (agent != null) {
    agent["offset_x"] = agent["offset_x"] + unit_offset["x"];
    agent["offset_y"] = agent["offset_y"] + unit_offset["y"];
    result.push(agent);
  }
  if (should_ask_server_for_actions(punit)) {
    result.push({
      "key": "unit.action_decision_want",
      "offset_x": unit_activity_offset_x + unit_offset["x"],
      "offset_y": -25 + unit_offset["y"]
    });
  }
  result.push(get_unit_hp_sprite(punit));
  if (stacked) result.push(get_unit_stack_sprite());
  if (punit["veteran"] > 0) result.push(get_unit_veteran_sprite(punit));
  return result;
}
function dir_get_tileset_name(dir) {
  switch (dir) {
    case DIR8_NORTH:
      return "n";
    case DIR8_NORTHEAST:
      return "ne";
    case DIR8_EAST:
      return "e";
    case DIR8_SOUTHEAST:
      return "se";
    case DIR8_SOUTH:
      return "s";
    case DIR8_SOUTHWEST:
      return "sw";
    case DIR8_WEST:
      return "w";
    case DIR8_NORTHWEST:
      return "nw";
  }
  return "";
}
function cardinal_index_str(idx) {
  let c2 = "";
  for (let i2 = 0; i2 < num_cardinal_tileset_dirs; i2++) {
    const value = idx >> i2 & 1;
    c2 += dir_get_tileset_name(cardinal_tileset_dirs[i2]) + value;
  }
  return c2;
}
function get_city_flag_sprite(pcity) {
  const owner_id = pcity["owner"];
  if (owner_id == null) return {};
  const owner = store.players[owner_id];
  if (owner == null) return {};
  const nation_id = owner["nation"];
  if (nation_id == null) return {};
  const nation = store.nations[nation_id];
  if (nation == null) return {};
  return {
    "key": "f." + nation["graphic_str"],
    "offset_x": city_flag_offset_x,
    "offset_y": -9
  };
}
function get_city_occupied_sprite(pcity) {
  const owner_id = pcity["owner"];
  const ptile = cityTile(pcity);
  const punits = tile_units(ptile);
  if (!store.observing && clientPlaying() != null && owner_id != clientPlaying().playerno && pcity["occupied"]) {
    return "citybar.occupied";
  } else if (punits != null && punits.length == 1) {
    return "citybar.occupancy_1";
  } else if (punits != null && punits.length == 2) {
    return "citybar.occupancy_2";
  } else if (punits != null && punits.length >= 3) {
    return "citybar.occupancy_3";
  } else {
    return "citybar.occupancy_0";
  }
}
function get_city_food_output_sprite(num) {
  return {
    "key": "city.t_food_" + num,
    "offset_x": normal_tile_width / 4,
    "offset_y": -normal_tile_height / 4
  };
}
function get_city_shields_output_sprite(num) {
  return {
    "key": "city.t_shields_" + num,
    "offset_x": normal_tile_width / 4,
    "offset_y": -normal_tile_height / 4
  };
}
function get_city_trade_output_sprite(num) {
  return {
    "key": "city.t_trade_" + num,
    "offset_x": normal_tile_width / 4,
    "offset_y": -normal_tile_height / 4
  };
}
function get_city_invalid_worked_sprite() {
  return {
    "key": "grid.unavailable",
    "offset_x": 0,
    "offset_y": 0
  };
}
function fill_goto_line_sprite_array(ptile) {
  return { "key": "goto_line", "goto_dir": ptile["goto_dir"] };
}
function get_border_line_sprites(ptile) {
  const result = [];
  for (let i2 = 0; i2 < num_cardinal_tileset_dirs; i2++) {
    const dir = cardinal_tileset_dirs[i2];
    const checktile = mapstep(ptile, dir);
    if (checktile != null && checktile["owner"] != null && ptile["owner"] != null && ptile["owner"] != checktile["owner"] && ptile["owner"] != 255 && store.players[ptile["owner"]] != null) {
      const pnation = store.nations[store.players[ptile["owner"]]["nation"]];
      result.push({
        "key": "border",
        "dir": dir,
        "color": pnation["color"]
      });
    }
  }
  return result;
}
function get_unit_nation_flag_sprite(punit) {
  const owner_id = punit["owner"];
  if (unit_type(punit)?.["flags"]?.isSet?.(UTYF_FLAGLESS) && clientPlaying() != null && owner_id != clientPlaying().playerno) {
    return [];
  } else {
    const owner = store.players[owner_id];
    const nation_id = owner["nation"];
    const nation = store.nations[nation_id];
    const unit_offset = get_unit_anim_offset(punit);
    return {
      "key": "f.shield." + nation["graphic_str"],
      "offset_x": unit_flag_offset_x + unit_offset["x"],
      "offset_y": -16 + unit_offset["y"]
    };
  }
}
function get_unit_stack_sprite(punit) {
  return {
    "key": "unit.stack",
    "offset_x": unit_flag_offset_x + -25,
    "offset_y": -16 - 15
  };
}
function get_unit_hp_sprite(punit) {
  const hp = punit["hp"];
  const utype = unit_type(punit);
  const max_hp = utype?.["hp"] ?? 1;
  const healthpercent = 10 * Math.floor(10 * hp / max_hp);
  const unit_offset = get_unit_anim_offset(punit);
  return {
    "key": "unit.hp_" + healthpercent,
    "offset_x": unit_flag_offset_x + -25 + unit_offset["x"],
    "offset_y": -16 - 15 + unit_offset["y"]
  };
}
function get_unit_veteran_sprite(punit) {
  return {
    "key": "unit.vet_" + punit["veteran"],
    "offset_x": unit_activity_offset_x - 20,
    "offset_y": -25 - 10
  };
}
function get_unit_activity_sprite(punit) {
  if (punit["ssa_controller"] == SSA_AUTOEXPLORE) {
    return null;
  }
  const activity = punit["activity"];
  const act_tgt = punit["activity_tgt"];
  switch (activity) {
    case ACTIVITY_CLEAN:
      return {
        "key": -1 == act_tgt ? "unit.pollution" : tileset_extra_id_rmactivity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_MINE:
      return {
        "key": -1 == act_tgt ? "unit.plant" : tileset_extra_id_activity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_PLANT:
      return {
        "key": "unit.plant",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_IRRIGATE:
      return {
        "key": -1 == act_tgt ? "unit.irrigate" : tileset_extra_id_activity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_CULTIVATE:
      return {
        "key": "unit.cultivate",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_FORTIFIED:
      return {
        "key": "unit.fortified",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_BASE:
      return {
        "key": tileset_extra_id_activity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_SENTRY:
      return {
        "key": "unit.sentry",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_PILLAGE$1:
      return {
        "key": "unit.pillage",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_GOTO:
      return {
        "key": "unit.goto",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_TRANSFORM:
      return {
        "key": "unit.transform",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_FORTIFYING:
      return {
        "key": "unit.fortifying",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_GEN_ROAD:
      return {
        "key": tileset_extra_id_activity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
    case ACTIVITY_CONVERT:
      return {
        "key": "unit.convert",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
  }
  if (unit_has_goto(punit)) {
    return {
      "key": "unit.goto",
      "offset_x": unit_activity_offset_x,
      "offset_y": -25
    };
  }
  return null;
}
function get_unit_agent_sprite(punit) {
  switch (punit["ssa_controller"]) {
    case SSA_NONE:
      break;
    case SSA_AUTOWORKER:
      return {
        "key": "unit.auto_worker",
        "offset_x": 0,
        "offset_y": 0
      };
    case SSA_AUTOEXPLORE:
      return {
        "key": "unit.auto_explore",
        "offset_x": unit_activity_offset_x,
        "offset_y": -25
      };
  }
  return null;
}
function get_city_sprite(pcity) {
  let style_id = pcity["style"];
  if (style_id == -1) style_id = 0;
  const city_rule = city_rules[style_id];
  let size = 0;
  if (pcity["size"] >= 4 && pcity["size"] <= 7) {
    size = 1;
  } else if (pcity["size"] >= 8 && pcity["size"] <= 11) {
    size = 2;
  } else if (pcity["size"] >= 12 && pcity["size"] <= 15) {
    size = 3;
  } else if (pcity["size"] >= 16) {
    size = 4;
  }
  const city_walls = pcity["walls"] ? "wall" : "city";
  let tag = city_rule["graphic"] + "_" + city_walls + "_" + size;
  if (_w.sprites[tag] == null) {
    tag = city_rule["graphic_alt"] + "_" + city_walls + "_" + size;
  }
  return { "key": tag, "offset_x": 0, "offset_y": -unit_offset_y };
}
function fill_fog_sprite_array(ptile, pedge, pcorner) {
  let i2, tileno = 0;
  if (pcorner == null) return [];
  for (i2 = 3; i2 >= 0; i2--) {
    const unknown = 0, fogged = 1, known = 2;
    let value = -1;
    if (pcorner["tile"][i2] == null) {
      value = unknown;
    } else {
      switch (tileGetKnown(pcorner["tile"][i2])) {
        case TILE_KNOWN_SEEN:
          value = known;
          break;
        case TILE_KNOWN_UNSEEN:
          value = fogged;
          break;
        case TILE_UNKNOWN:
          value = unknown;
          break;
      }
    }
    tileno = tileno * 3 + value;
  }
  if (tileno >= 80) return [];
  return [{ "key": _w.fullfog[tileno] }];
}
function get_select_sprite() {
  current_select_sprite = Math.floor((/* @__PURE__ */ new Date()).getTime() * 6 / 1e3) % max_select_sprite;
  return { "key": "unit.select" + current_select_sprite };
}
function get_city_info_text(pcity) {
  return {
    "key": "city_text",
    "city": pcity,
    "offset_x": citybar_offset_x,
    "offset_y": citybar_offset_y
  };
}
function get_tile_label_text(ptile) {
  return {
    "key": "tile_label",
    "tile": ptile,
    "offset_x": tilelabel_offset_x,
    "offset_y": tilelabel_offset_y
  };
}
function get_tile_specials_sprite(ptile) {
  const extra_id = tileResource(ptile);
  if (extra_id !== null) {
    const extra = store.extras[extra_id];
    if (extra != null) {
      return { "key": extra["graphic_str"] };
    }
  }
  return null;
}
function get_tile_river_sprite(ptile) {
  if (ptile == null) {
    return null;
  }
  if (tileHasExtra(ptile, _w.EXTRA_RIVER)) {
    let river_str = "";
    for (let i2 = 0; i2 < num_cardinal_tileset_dirs; i2++) {
      const dir = cardinal_tileset_dirs[i2];
      const checktile = mapstep(ptile, dir);
      if (checktile && (tileHasExtra(checktile, _w.EXTRA_RIVER) || isOceanTile(checktile))) {
        river_str = river_str + dir_get_tileset_name(dir) + "1";
      } else {
        river_str = river_str + dir_get_tileset_name(dir) + "0";
      }
    }
    return { "key": "road.river_s_" + river_str };
  }
  const pterrain = tileTerrain(ptile);
  if (pterrain != null && pterrain["graphic_str"] == "coast") {
    for (let i2 = 0; i2 < num_cardinal_tileset_dirs; i2++) {
      const dir = cardinal_tileset_dirs[i2];
      const checktile = mapstep(ptile, dir);
      if (checktile != null && tileHasExtra(checktile, _w.EXTRA_RIVER)) {
        return { "key": "road.river_outlet_" + dir_get_tileset_name(dir) };
      }
    }
  }
  return null;
}
function fill_path_sprite_array(ptile, pcity) {
  const rs_maglev = typeof _w.EXTRA_MAGLEV !== "undefined";
  tileHasExtra(ptile, _w.EXTRA_ROAD);
  tileHasExtra(ptile, _w.EXTRA_RAIL);
  rs_maglev && tileHasExtra(ptile, _w.EXTRA_MAGLEV);
  const result_sprites = [];
  for (let dir = 0; dir < 8; dir++) {
    const tile1 = mapstep(ptile, dir);
    if (tile1 != null && tileGetKnown(tile1) != TILE_UNKNOWN) {
      tileHasExtra(tile1, _w.EXTRA_ROAD);
      tileHasExtra(tile1, _w.EXTRA_RAIL);
      rs_maglev && tileHasExtra(tile1, _w.EXTRA_MAGLEV);
    }
  }
  return result_sprites;
}
function fill_layer1_sprite_array(ptile, pcity) {
  const result_sprites = [];
  if (pcity == null) {
    if (tileHasExtra(ptile, _w.EXTRA_FORTRESS)) {
      result_sprites.push({
        "key": "base.fortress_bg",
        "offset_y": -normal_tile_height / 2
      });
    }
  }
  return result_sprites;
}
function fill_layer2_sprite_array(ptile, pcity) {
  const result_sprites = [];
  if (pcity == null) {
    if (tileHasExtra(ptile, _w.EXTRA_AIRBASE)) {
      result_sprites.push({
        "key": "base.airbase_mg",
        "offset_y": -normal_tile_height / 2
      });
    }
    if (tileHasExtra(ptile, _w.EXTRA_BUOY)) {
      result_sprites.push(window.get_base_flag_sprite(ptile));
      result_sprites.push({
        "key": "base.buoy_mg",
        "offset_y": -normal_tile_height / 2
      });
    }
    if (tileHasExtra(ptile, _w.EXTRA_RUINS)) {
      result_sprites.push({
        "key": "extra.ruins_mg",
        "offset_y": -normal_tile_height / 2
      });
    }
  }
  return result_sprites;
}
function fill_layer3_sprite_array(ptile, pcity) {
  const result_sprites = [];
  if (pcity == null) {
    if (tileHasExtra(ptile, _w.EXTRA_FORTRESS)) {
      result_sprites.push({
        "key": "base.fortress_fg",
        "offset_y": -normal_tile_height / 2
      });
    }
  }
  return result_sprites;
}
const MAP_TO_NATIVE_POS = mapToNativePos;
const NATIVE_TO_MAP_POS = nativeToMapPos;
let mapview$1 = { width: 0, height: 0, gui_x0: 0, gui_y0: 0, store_width: 0, store_height: 0 };
let last_redraw_time = 0;
const MAPVIEW_REFRESH_INTERVAL = 10;
let dirty_tiles = {};
let dirty_all = true;
let dirty_count = 0;
const DIRTY_FULL_THRESHOLD = 64;
function mark_tile_dirty(tile_id) {
  if (dirty_all) return;
  dirty_tiles[tile_id] = true;
  dirty_count++;
  if (dirty_count > DIRTY_FULL_THRESHOLD) {
    dirty_all = true;
  }
}
function mark_all_dirty() {
  dirty_all = true;
}
function clear_dirty() {
  dirty_tiles = {};
  dirty_count = 0;
  dirty_all = false;
}
let mapview_slide = {
  active: false,
  dx: 0,
  dy: 0,
  i: 0,
  max: 100,
  slide_time: 700
};
function mapdeco_init() {
  init_game_unit_panel();
  init_chatbox();
  setKeyboardInput(true);
}
function center_tile_mapcanvas_2d(ptile) {
  const r2 = map_to_gui_pos$1(ptile["x"], ptile["y"]);
  let gui_x = r2["gui_dx"];
  let gui_y = r2["gui_dy"];
  gui_x -= mapview$1["width"] - tileset_tile_width >> 1;
  gui_y -= mapview$1["height"] - tileset_tile_height >> 1;
  set_mapview_origin(gui_x, gui_y);
}
function center_tile_id(ptile_id) {
  const ptile = store.tiles[ptile_id];
  center_tile_mapcanvas_2d(ptile);
}
function map_to_gui_vector(map_dx, map_dy) {
  const gui_dx = (map_dx - map_dy) * tileset_tile_width >> 1;
  const gui_dy = (map_dx + map_dy) * tileset_tile_height >> 1;
  return { "gui_dx": gui_dx, "gui_dy": gui_dy };
}
function set_mapview_origin(gui_x0, gui_y0) {
  const r2 = normalize_gui_pos(gui_x0, gui_y0);
  gui_x0 = r2["gui_x"];
  gui_y0 = r2["gui_y"];
  base_set_mapview_origin(gui_x0, gui_y0);
}
function base_set_mapview_origin(gui_x0, gui_y0) {
  const g2 = normalize_gui_pos(gui_x0, gui_y0);
  gui_x0 = g2["gui_x"];
  gui_y0 = g2["gui_y"];
  mapview$1["gui_x0"] = gui_x0;
  mapview$1["gui_y0"] = gui_y0;
  dirty_all = true;
}
function normalize_gui_pos(gui_x, gui_y) {
  let map_x, map_y, nat_x, nat_y, gui_x0_temp, gui_y0_temp, diff_x, diff_y;
  const r2 = gui_to_map_pos(gui_x, gui_y);
  map_x = r2["map_x"];
  map_y = r2["map_y"];
  const s2 = map_to_gui_pos$1(map_x, map_y);
  gui_x0_temp = s2["gui_dx"];
  gui_y0_temp = s2["gui_dy"];
  diff_x = gui_x - gui_x0_temp;
  diff_y = gui_y - gui_y0_temp;
  const t2 = MAP_TO_NATIVE_POS(map_x, map_y);
  nat_x = t2["nat_x"];
  nat_y = t2["nat_y"];
  if (wrapHasFlag(WRAP_X)) {
    nat_x = FC_WRAP(nat_x, store.mapInfo["xsize"]);
  }
  if (wrapHasFlag(WRAP_Y)) {
    nat_y = FC_WRAP(nat_y, store.mapInfo["ysize"]);
  }
  const u2 = NATIVE_TO_MAP_POS(nat_x, nat_y);
  map_x = u2["map_x"];
  map_y = u2["map_y"];
  const v2 = map_to_gui_pos$1(map_x, map_y);
  gui_x = v2["gui_dx"];
  gui_y = v2["gui_dy"];
  gui_x += diff_x;
  gui_y += diff_y;
  return { "gui_x": gui_x, "gui_y": gui_y };
}
function gui_to_map_pos(gui_x, gui_y) {
  const W = tileset_tile_width;
  const H2 = tileset_tile_height;
  gui_x -= W >> 1;
  const map_x = DIVIDE(gui_x * H2 + gui_y * W, W * H2);
  const map_y = DIVIDE(gui_y * W - gui_x * H2, W * H2);
  return { "map_x": map_x, "map_y": map_y };
}
function map_to_gui_pos$1(map_x, map_y) {
  return map_to_gui_vector(map_x, map_y);
}
function update_map_canvas(canvas_x, canvas_y, width, height) {
  let gui_x0, gui_y0;
  gui_x0 = mapview$1["gui_x0"] + canvas_x;
  gui_y0 = mapview$1["gui_y0"] + canvas_y;
  const r2 = base_canvas_to_map_pos(0, 0);
  const s2 = base_canvas_to_map_pos(mapview$1["width"], 0);
  const t2 = base_canvas_to_map_pos(0, mapview$1["height"]);
  const u2 = base_canvas_to_map_pos(mapview$1["width"], mapview$1["height"]);
  if (r2["map_x"] < 0 || r2["map_x"] > store.mapInfo["xsize"] || r2["map_y"] < 0 || r2["map_y"] > store.mapInfo["ysize"] || s2["map_x"] < 0 || s2["map_x"] > store.mapInfo["xsize"] || s2["map_y"] < 0 || s2["map_y"] > store.mapInfo["ysize"] || t2["map_x"] < 0 || t2["map_x"] > store.mapInfo["xsize"] || t2["map_y"] < 0 || t2["map_y"] > store.mapInfo["ysize"] || u2["map_x"] < 0 || u2["map_x"] > store.mapInfo["xsize"] || u2["map_y"] < 0 || u2["map_y"] > store.mapInfo["ysize"]) {
    canvas_put_rectangle(window.mapview_canvas_ctx, "rgb(0,0,0)", canvas_x, canvas_y, width, height);
  }
  for (let layer = 0; layer <= LAYER_COUNT; layer++) {
    if (layer == LAYER_SPECIAL1) {
      window.mapview_canvas_ctx.lineWidth = 2;
      window.mapview_canvas_ctx.lineCap = "butt";
      if (window.dashedSupport) window.mapview_canvas_ctx.setLineDash([4, 4]);
    } else if (layer == LAYER_CITY1) {
      if (window.dashedSupport) window.mapview_canvas_ctx.setLineDash([]);
    }
    let gui_x_0 = gui_x0;
    let gui_y_0 = gui_y0;
    let gui_x_w = width + (tileset_tile_width >> 1);
    let gui_y_h = height + (tileset_tile_height >> 1);
    if (gui_x_w < 0) {
      gui_x_0 += gui_x_w;
      gui_x_w = -gui_x_w;
    }
    if (gui_y_h < 0) {
      gui_y_0 += gui_y_h;
      gui_y_h = -gui_y_h;
    }
    if (gui_x_w > 0 && gui_y_h > 0) {
      const ptilepcorner = {};
      let ptile_xi, ptile_yi, ptile_si, ptile_di;
      let gui_x, gui_y;
      const ptile_r1 = 2;
      const ptile_r2 = ptile_r1 * 2;
      const ptile_w = tileset_tile_width;
      const ptile_h = tileset_tile_height;
      const ptile_x0 = Math.floor(gui_x_0 * ptile_r2 / ptile_w - (gui_x_0 * ptile_r2 < 0 && gui_x_0 * ptile_r2 % ptile_w < 0 ? 1 : 0) - ptile_r1 / 2);
      const ptile_y0 = Math.floor(gui_y_0 * ptile_r2 / ptile_h - (gui_y_0 * ptile_r2 < 0 && gui_y_0 * ptile_r2 % ptile_h < 0 ? 1 : 0) - ptile_r1 / 2);
      const ptile_x1 = Math.floor(((gui_x_0 + gui_x_w) * ptile_r2 + ptile_w - 1) / ptile_w - ((gui_x_0 + gui_x_w) * ptile_r2 + ptile_w - 1 < 0 && ((gui_x_0 + gui_x_w) * ptile_r2 + ptile_w - 1) % ptile_w < 0 ? 1 : 0) + ptile_r1);
      const ptile_y1 = Math.floor(((gui_y_0 + gui_y_h) * ptile_r2 + ptile_h - 1) / ptile_h - ((gui_y_0 + gui_y_h) * ptile_r2 + ptile_h - 1 < 0 && ((gui_y_0 + gui_y_h) * ptile_r2 + ptile_h - 1) % ptile_h < 0 ? 1 : 0) + ptile_r1);
      const ptile_count = (ptile_x1 - ptile_x0) * (ptile_y1 - ptile_y0);
      for (let ptile_index = 0; ptile_index < ptile_count; ptile_index++) {
        let ptile = null;
        let pcorner = null;
        ptile_xi = ptile_x0 + ptile_index % (ptile_x1 - ptile_x0);
        ptile_yi = Math.floor(ptile_y0 + ptile_index / (ptile_x1 - ptile_x0));
        ptile_si = ptile_xi + ptile_yi;
        ptile_di = ptile_yi - ptile_xi;
        if ((ptile_xi + ptile_yi) % 2 != 0) {
          continue;
        }
        if (store.mapInfo["wrap_id"] == 0 && (ptile_si <= 0 || ptile_si / 4 > store.mapInfo["xsize"])) {
          continue;
        }
        if (ptile_xi % 2 == 0 && ptile_yi % 2 == 0) {
          if ((ptile_xi + ptile_yi) % 4 == 0) {
            ptile = mapPosToTile(ptile_si / 4 - 1, ptile_di / 4);
          } else {
            pcorner = ptilepcorner;
            pcorner["tile"] = [];
            pcorner["tile"][0] = mapPosToTile((ptile_si - 6) / 4, (ptile_di - 2) / 4);
            pcorner["tile"][1] = mapPosToTile((ptile_si - 2) / 4, (ptile_di - 2) / 4);
            pcorner["tile"][2] = mapPosToTile((ptile_si - 2) / 4, (ptile_di + 2) / 4);
            pcorner["tile"][3] = mapPosToTile((ptile_si - 6) / 4, (ptile_di + 2) / 4);
          }
        }
        gui_x = Math.floor(ptile_xi * ptile_w / ptile_r2 - ptile_w / 2);
        gui_y = Math.floor(ptile_yi * ptile_h / ptile_r2 - ptile_h / 2);
        const cx = gui_x - mapview$1["gui_x0"];
        const cy = gui_y - mapview$1["gui_y0"];
        if (ptile != null) {
          put_one_tile(window.mapview_canvas_ctx, layer, ptile, cx, cy);
        } else if (pcorner != null) {
          put_one_element(
            window.mapview_canvas_ctx,
            layer,
            null,
            null,
            pcorner,
            null,
            null,
            cx,
            cy
          );
        }
      }
    }
  }
  if (map_select_active && map_select_setting_enabled) {
    canvas_put_select_rectangle(
      window.mapview_canvas_ctx,
      map_select_x,
      map_select_y,
      mouse_x - map_select_x,
      mouse_y - map_select_y
    );
  }
}
function put_one_tile(pcanvas, layer, ptile, canvas_x, canvas_y, citymode) {
  if (tileGetKnown(ptile) != TILE_UNKNOWN || layer == LAYER_GOTO) {
    put_one_element(
      pcanvas,
      layer,
      ptile,
      null,
      null,
      get_drawable_unit(ptile),
      tileCity(ptile),
      canvas_x,
      canvas_y
    );
  }
}
function put_one_element(pcanvas, layer, ptile, pedge, pcorner, punit, pcity, canvas_x, canvas_y, citymode) {
  const tile_sprs = fill_sprite_array(layer, ptile, pedge, pcorner, punit, pcity);
  ptile != null && draw_fog_of_war && TILE_KNOWN_UNSEEN == tileGetKnown(ptile);
  put_drawn_sprites(pcanvas, canvas_x, canvas_y, tile_sprs);
}
function put_drawn_sprites(pcanvas, canvas_x, canvas_y, pdrawn, fog) {
  for (let i2 = 0; i2 < pdrawn.length; i2++) {
    let offset_x = 0, offset_y = 0;
    if ("offset_x" in pdrawn[i2]) {
      offset_x += pdrawn[i2]["offset_x"];
    }
    if ("offset_y" in pdrawn[i2]) {
      offset_y += pdrawn[i2]["offset_y"];
    }
    if (pdrawn[i2]["key"] == "city_text") {
      mapview_put_city_bar(pcanvas, pdrawn[i2]["city"], canvas_x + offset_x, canvas_y + offset_y);
    } else if (pdrawn[i2]["key"] == "border") {
      mapview_put_border_line(pcanvas, pdrawn[i2]["dir"], pdrawn[i2]["color"], canvas_x, canvas_y);
    } else if (pdrawn[i2]["key"] == "goto_line") {
      mapview_put_goto_line(pcanvas, pdrawn[i2]["goto_dir"], canvas_x, canvas_y);
    } else if (pdrawn[i2]["key"] == "tile_label") {
      mapview_put_tile_label(pcanvas, pdrawn[i2]["tile"], canvas_x + offset_x, canvas_y + offset_y);
    } else {
      mapview_put_tile(pcanvas, pdrawn[i2]["key"], canvas_x + offset_x, canvas_y + offset_y);
    }
  }
}
function base_canvas_to_map_pos(canvas_x, canvas_y) {
  return gui_to_map_pos(
    canvas_x + mapview$1.gui_x0,
    canvas_y + mapview$1.gui_y0
  );
}
function canvas_pos_to_tile(canvas_x, canvas_y) {
  let map_x, map_y;
  const r2 = base_canvas_to_map_pos(canvas_x, canvas_y);
  map_x = r2["map_x"];
  map_y = r2["map_y"];
  return mapPosToTile(map_x, map_y);
}
function update_map_canvas_full() {
  if (store.tiles != null && clientState() >= C_S_RUNNING) {
    if (!sprites_init) init_cache_sprites();
    if (active_city != null) return;
    if (mapview_slide["active"]) {
      update_map_slide();
    } else {
      update_map_canvas(0, 0, mapview$1["store_width"], mapview$1["store_height"]);
      check_request_goto_path();
    }
    clear_dirty();
    last_redraw_time = (/* @__PURE__ */ new Date()).getTime();
  }
}
function update_map_canvas_dirty() {
  if (store.tiles == null || clientState() < C_S_RUNNING) return;
  if (!sprites_init) init_cache_sprites();
  if (active_city != null) return;
  if (mapview_slide["active"] || dirty_all) {
    update_map_canvas_full();
    return;
  }
  if (dirty_count === 0) {
    last_redraw_time = (/* @__PURE__ */ new Date()).getTime();
    return;
  }
  const tw = tileset_tile_width;
  const th = tileset_tile_height;
  for (const tid_str in dirty_tiles) {
    const tid = parseInt(tid_str, 10);
    const ptile = store.tiles[tid];
    if (ptile == null) continue;
    const r2 = map_to_gui_pos$1(ptile["x"], ptile["y"]);
    const cx = r2["gui_dx"] - mapview$1["gui_x0"];
    const cy = r2["gui_dy"] - mapview$1["gui_y0"];
    if (cx + tw < 0 || cy + th < 0 || cx > mapview$1["store_width"] || cy > mapview$1["store_height"]) {
      continue;
    }
    const pad = tw;
    const rx = cx - pad;
    const ry = cy - pad;
    const rw = tw + pad * 2;
    const rh = th + pad * 2;
    update_map_canvas(
      Math.max(0, rx),
      Math.max(0, ry),
      Math.min(rw, mapview$1["store_width"] - rx),
      Math.min(rh, mapview$1["store_height"] - ry)
    );
  }
  clear_dirty();
  last_redraw_time = (/* @__PURE__ */ new Date()).getTime();
}
function update_map_canvas_check() {
  const time = (/* @__PURE__ */ new Date()).getTime() - last_redraw_time;
  if (time > MAPVIEW_REFRESH_INTERVAL && window.renderer == RENDERER_2DCANVAS$1) {
    if (dirty_all || dirty_count > DIRTY_FULL_THRESHOLD) {
      update_map_canvas_full();
    } else if (dirty_count > 0) {
      update_map_canvas_dirty();
    } else {
      last_redraw_time = (/* @__PURE__ */ new Date()).getTime();
    }
  }
  try {
    if (window.renderer == RENDERER_2DCANVAS$1 && window.requestAnimationFrame != null) requestAnimationFrame(update_map_canvas_check);
  } catch (e2) {
    if (e2.name == "NS_ERROR_NOT_AVAILABLE") {
      setTimeout(update_map_canvas_check, 100);
    } else {
      throw e2;
    }
  }
}
function update_map_slide() {
  const elapsed = 1 + (/* @__PURE__ */ new Date()).getTime() - mapview_slide["start"];
  mapview_slide["i"] = Math.floor(mapview_slide["max"] * (mapview_slide["slide_time"] - elapsed) / mapview_slide["slide_time"]);
  if (mapview_slide["i"] <= 0) {
    mapview_slide["active"] = false;
    return;
  }
  const dx = mapview_slide["dx"];
  const dy = mapview_slide["dy"];
  let sx = 0;
  let sy = 0;
  if (dx >= 0 && dy <= 0) {
    sx = Math.floor(dx * ((mapview_slide["max"] - mapview_slide["i"]) / mapview_slide["max"]));
    sy = Math.floor(dy * (-1 * mapview_slide["i"] / mapview_slide["max"]));
  } else if (dx >= 0 && dy >= 0) {
    sx = Math.floor(dx * ((mapview_slide["max"] - mapview_slide["i"]) / mapview_slide["max"]));
    sy = Math.floor(dy * ((mapview_slide["max"] - mapview_slide["i"]) / mapview_slide["max"]));
  } else if (dx <= 0 && dy >= 0) {
    sx = Math.floor(dx * (-1 * mapview_slide["i"] / mapview_slide["max"]));
    sy = Math.floor(dy * ((mapview_slide["max"] - mapview_slide["i"]) / mapview_slide["max"]));
  } else if (dx <= 0 && dy <= 0) {
    sx = Math.floor(dx * (-1 * mapview_slide["i"] / mapview_slide["max"]));
    sy = Math.floor(dy * (-1 * mapview_slide["i"] / mapview_slide["max"]));
  }
  window.mapview_canvas_ctx.drawImage(
    window.buffer_canvas,
    sx,
    sy,
    mapview$1["width"],
    mapview$1["height"],
    0,
    0,
    mapview$1["width"],
    mapview$1["height"]
  );
}
const map_pos_to_tile = mapPosToTile;
const tile_city = tileCity;
const tile_get_known = tileGetKnown;
const tile_terrain = tileTerrain;
const city_owner_player_id = cityOwnerPlayerId;
const wrap_has_flag = wrapHasFlag;
let OVERVIEW_TILE_SIZE = 1;
let min_overview_width = 200;
let max_overview_width = 300;
let max_overview_height = 300;
let palette = [];
let palette_color_offset = 0;
let palette_terrain_offset = 0;
let overview_active = false;
function setOverviewActive(v2) {
  overview_active = v2;
}
const COLOR_OVERVIEW_UNKNOWN = 0;
const COLOR_OVERVIEW_MY_CITY = 1;
const COLOR_OVERVIEW_ALLIED_CITY = 2;
const COLOR_OVERVIEW_ENEMY_CITY = 3;
const COLOR_OVERVIEW_MY_UNIT = 4;
const COLOR_OVERVIEW_ALLIED_UNIT = 5;
const COLOR_OVERVIEW_ENEMY_UNIT = 6;
const COLOR_OVERVIEW_VIEWRECT = 7;
let overview_hash = -1;
function init_overview() {
  while (min_overview_width > OVERVIEW_TILE_SIZE * store.mapInfo["xsize"]) {
    OVERVIEW_TILE_SIZE++;
  }
  overview_active = true;
  const panel = document.getElementById("game_overview_panel");
  if (panel) {
    panel.title = "World map";
    panel.style.display = "block";
  }
  palette = generate_palette();
  redraw_overview();
  let new_width = OVERVIEW_TILE_SIZE * store.mapInfo["xsize"];
  if (new_width > max_overview_width) new_width = max_overview_width;
  let new_height = OVERVIEW_TILE_SIZE * store.mapInfo["ysize"];
  if (new_height > max_overview_height) new_height = max_overview_height;
  const overviewMap = document.getElementById("overview_map");
  if (overviewMap) {
    overviewMap.style.width = new_width + "px";
    overviewMap.style.height = new_height + "px";
    overviewMap.ondragstart = (e2) => e2.preventDefault();
  }
}
function redraw_overview() {
  if (!overview_active || mapview_slide["active"] || C_S_RUNNING > clientState() || store.mapInfo["xsize"] == null || store.mapInfo["ysize"] == null || !document.getElementById("overview_map")) return;
  const hash = generate_overview_hash(store.mapInfo["xsize"], store.mapInfo["ysize"]);
  if (hash != overview_hash) {
    renderOverviewToCanvas(
      generate_overview_grid(store.mapInfo["xsize"], store.mapInfo["ysize"]),
      palette
    );
    overview_hash = hash;
    render_viewrect();
  }
}
function renderOverviewToCanvas(grid, pal) {
  const canvas = document.getElementById("overview_img");
  if (!canvas || !grid.length || !grid[0].length || !pal.length) return;
  const rows = grid.length;
  const cols = grid[0].length;
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const imageData = ctx.createImageData(cols, rows);
  const data = imageData.data;
  for (let y2 = 0; y2 < rows; y2++) {
    const row = grid[y2];
    if (!row) continue;
    for (let x2 = 0; x2 < cols; x2++) {
      const idx = (y2 * cols + x2) * 4;
      const colorIdx = row[x2];
      if (colorIdx !== void 0 && pal[colorIdx]) {
        const color = pal[colorIdx];
        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
      }
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
function generate_overview_grid(cols, rows) {
  let row;
  if (cols & 1) cols -= 1;
  if (rows & 1) rows -= 1;
  const grid = Array(rows * OVERVIEW_TILE_SIZE);
  for (row = 0; row < rows * OVERVIEW_TILE_SIZE; row++) {
    grid[row] = Array(cols * OVERVIEW_TILE_SIZE);
  }
  for (let x2 = 0; x2 < rows; x2++) {
    for (let y2 = 0; y2 < cols; y2++) {
      const ocolor = overview_tile_color(y2, x2);
      render_multipixel(grid, x2, y2, ocolor);
    }
  }
  return grid;
}
function generate_overview_hash(cols, rows) {
  let hash = 0;
  for (let x2 = 0; x2 < rows; x2++) {
    for (let y2 = 0; y2 < cols; y2++) {
      hash += overview_tile_color(y2, x2);
    }
  }
  const r2 = base_canvas_to_map_pos(0, 0);
  if (r2 != null) {
    hash += r2["map_x"];
    hash += r2["map_y"];
  }
  return hash;
}
function render_viewrect() {
  if (C_S_RUNNING != clientState() && C_S_OVER != clientState()) return;
  const path = [];
  if (mapview$1["gui_x0"] != 0 && mapview$1["gui_y0"] != 0) {
    let point = base_canvas_to_map_pos(0, 0);
    path.push([point.map_x, point.map_y]);
    point = base_canvas_to_map_pos(mapview$1["width"] ?? 0, 0);
    path.push([point.map_x, point.map_y]);
    point = base_canvas_to_map_pos(mapview$1["width"] ?? 0, mapview$1["height"] ?? 0);
    path.push([point.map_x, point.map_y]);
    point = base_canvas_to_map_pos(0, mapview$1["height"] ?? 0);
    path.push([point.map_x, point.map_y]);
  }
  const viewrect_canvas = document.getElementById("overview_viewrect");
  if (viewrect_canvas == null) return;
  const overviewMap = document.getElementById("overview_map");
  const map_w = overviewMap?.offsetWidth ?? 200;
  const map_h = overviewMap?.offsetHeight ?? 200;
  viewrect_canvas.width = map_w;
  viewrect_canvas.height = map_h;
  const viewrect_ctx = viewrect_canvas.getContext("2d");
  if (viewrect_ctx == null) return;
  viewrect_ctx.clearRect(0, 0, map_w, map_h);
  viewrect_ctx.strokeStyle = "rgb(200,200,255)";
  viewrect_ctx.lineWidth = store.mapInfo.xsize / map_w;
  viewrect_ctx.scale(map_w / store.mapInfo.xsize, map_h / store.mapInfo.ysize);
  viewrect_ctx.beginPath();
  add_closed_path(viewrect_ctx, path);
  if (wrap_has_flag(WRAP_X)) {
    viewrect_ctx.save();
    viewrect_ctx.translate(store.mapInfo.xsize, 0);
    add_closed_path(viewrect_ctx, path);
    viewrect_ctx.translate(-2 * store.mapInfo.xsize, 0);
    add_closed_path(viewrect_ctx, path);
    viewrect_ctx.restore();
  }
  if (wrap_has_flag(WRAP_Y)) {
    viewrect_ctx.translate(0, store.mapInfo.ysize);
    add_closed_path(viewrect_ctx, path);
    viewrect_ctx.translate(0, -2 * store.mapInfo.ysize);
    add_closed_path(viewrect_ctx, path);
    if (wrap_has_flag(WRAP_X)) {
      viewrect_ctx.translate(-store.mapInfo.xsize, 0);
      add_closed_path(viewrect_ctx, path);
      viewrect_ctx.translate(0, 2 * store.mapInfo.ysize);
      add_closed_path(viewrect_ctx, path);
      viewrect_ctx.translate(2 * store.mapInfo.xsize, 0);
      add_closed_path(viewrect_ctx, path);
      viewrect_ctx.translate(0, -2 * store.mapInfo.ysize);
      add_closed_path(viewrect_ctx, path);
    }
  }
  viewrect_ctx.stroke();
}
function add_closed_path(ctx, path) {
  if (path.length === 0) return;
  ctx.moveTo(path[0][0], path[0][1]);
  for (let i2 = 1; i2 < path.length; i2++) {
    ctx.lineTo(path[i2][0], path[i2][1]);
  }
  ctx.lineTo(path[0][0], path[0][1]);
}
function render_multipixel(grid, x2, y2, ocolor) {
  if (x2 >= 0 && y2 >= 0 && x2 < store.mapInfo["ysize"] && y2 < store.mapInfo["xsize"]) {
    for (let px = 0; px < OVERVIEW_TILE_SIZE; px++) {
      for (let py = 0; py < OVERVIEW_TILE_SIZE; py++) {
        grid[OVERVIEW_TILE_SIZE * x2 + px][OVERVIEW_TILE_SIZE * y2 + py] = ocolor;
      }
    }
  }
}
function generate_palette() {
  const palette2 = [];
  palette2[COLOR_OVERVIEW_UNKNOWN] = [0, 0, 0];
  palette2[COLOR_OVERVIEW_MY_CITY] = [255, 255, 255];
  palette2[COLOR_OVERVIEW_ALLIED_CITY] = [0, 255, 255];
  palette2[COLOR_OVERVIEW_ENEMY_CITY] = [0, 255, 255];
  palette2[COLOR_OVERVIEW_MY_UNIT] = [255, 255, 0];
  palette2[COLOR_OVERVIEW_ALLIED_UNIT] = [255, 0, 0];
  palette2[COLOR_OVERVIEW_ENEMY_UNIT] = [255, 0, 0];
  palette2[COLOR_OVERVIEW_VIEWRECT] = [200, 200, 255];
  palette_terrain_offset = palette2.length;
  for (const terrain_id in store.terrains) {
    const terrain = store.terrains[terrain_id];
    palette2.push([terrain["color_red"], terrain["color_green"], terrain["color_blue"]]);
  }
  palette_color_offset = palette2.length;
  const player_count = Object.keys(store.players).length;
  for (const player_id_str in store.players) {
    const player_id = Number(player_id_str);
    const pplayer = store.players[player_id];
    if (pplayer["nation"] == -1) {
      palette2[palette_color_offset + player_id % player_count] = [0, 0, 0];
    } else {
      const pcolor = store.nations[pplayer["nation"]]["color"];
      if (pcolor != null) {
        palette2[palette_color_offset + player_id % player_count] = color_rbg_to_list(pcolor) ?? [];
      } else {
        palette2[palette_color_offset + player_id % player_count] = [0, 0, 0];
      }
    }
  }
  return palette2;
}
function overview_tile_color(map_x, map_y) {
  const ptile = map_pos_to_tile(map_x, map_y);
  const pcity = tile_city(ptile);
  if (pcity != null) {
    if (clientPlaying() == null) {
      return COLOR_OVERVIEW_ENEMY_CITY;
    } else if (city_owner_player_id(pcity) == clientPlaying()["id"]) {
      return COLOR_OVERVIEW_MY_CITY;
    } else {
      return COLOR_OVERVIEW_ENEMY_CITY;
    }
  }
  const punit = find_visible_unit(ptile);
  if (punit != null) {
    if (clientPlaying() == null) {
      return COLOR_OVERVIEW_ENEMY_UNIT;
    } else if (punit["owner"] == clientPlaying()["id"]) {
      return COLOR_OVERVIEW_MY_UNIT;
    } else if (punit["owner"] != null && punit["owner"] != 255) {
      return palette_color_offset + punit["owner"];
    } else {
      return COLOR_OVERVIEW_ENEMY_UNIT;
    }
  }
  if (tile_get_known(ptile) != TILE_UNKNOWN) {
    if (ptile["owner"] != null && ptile["owner"] != 255) {
      return palette_color_offset + ptile["owner"];
    } else {
      return palette_terrain_offset + tile_terrain(ptile)["id"];
    }
  }
  return COLOR_OVERVIEW_UNKNOWN;
}
function overview_clicked(x2, y2) {
  const overviewMap = document.getElementById("overview_map");
  const width = overviewMap?.offsetWidth ?? 200;
  const height = overviewMap?.offsetHeight ?? 200;
  const x1 = Math.floor(x2 * store.mapInfo["xsize"] / width);
  const y1 = Math.floor(y2 * store.mapInfo["ysize"] / height);
  const ptile = map_pos_to_tile(x1, y1);
  if (ptile != null) {
    center_tile_mapcanvas(ptile);
  }
  redraw_overview();
}
const state$3 = c({
  open: false,
  message: ""
});
function showAuthDialog$1(packet) {
  state$3.value = { open: true, message: packet["message"] || "" };
}
function closeAuthDialog() {
  state$3.value = { ...state$3.value, open: false };
}
function AuthDialog() {
  const { open, message } = state$3.value;
  const inputRef = A(null);
  const submit = () => {
    const pwd = inputRef.current?.value || "";
    const pwd_packet = {
      pid: packet_authentication_reply,
      password: pwd
    };
    send_request(JSON.stringify(pwd_packet));
    closeAuthDialog();
  };
  return /* @__PURE__ */ u(
    Dialog,
    {
      title: "Private server needs password to enter",
      open,
      width: window.innerWidth <= 600 ? "80%" : "60%",
      modal: true,
      children: [
        /* @__PURE__ */ u("div", { dangerouslySetInnerHTML: { __html: message } }),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px" }, children: /* @__PURE__ */ u("label", { children: [
          "Password:",
          " ",
          /* @__PURE__ */ u(
            "input",
            {
              ref: inputRef,
              type: "text",
              style: {
                padding: "4px 8px",
                fontSize: "14px",
                background: "#2a2a3e",
                color: "#e0e0e0",
                border: "1px solid #555",
                borderRadius: "3px",
                width: "200px"
              }
            }
          )
        ] }) }),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px", textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: submit, children: "Ok" }) })
      ]
    }
  );
}
const state$2 = c({
  open: false,
  title: "",
  message: "",
  error: ""
});
function showIntroDialog(title, message) {
  state$2.value = { open: true, title, message, error: "" };
}
function closeIntroDialog() {
  state$2.value = { ...state$2.value, open: false };
}
function IntroDialog() {
  const { open, title, message, error } = state$2.value;
  const inputRef = A(null);
  y$2(() => {
    if (open && inputRef.current) {
      const saved = localStorage.getItem("username");
      if (saved) inputRef.current.value = saved;
      inputRef.current.focus();
    }
  }, [open]);
  const submit = () => {
    const name = inputRef.current?.value.trim() || "";
    if (name.length < 3) {
      state$2.value = { ...state$2.value, error: "Username must be at least 3 characters." };
      return;
    }
    window.username = name;
    localStorage.setItem("username", name);
    closeIntroDialog();
  };
  const handleKeyDown2 = (e2) => {
    if (e2.key === "Enter") submit();
  };
  return /* @__PURE__ */ u(
    Dialog,
    {
      title,
      open,
      width: window.innerWidth <= 600 ? "90%" : "50%",
      modal: true,
      children: [
        /* @__PURE__ */ u("p", { children: message }),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px" }, children: [
          /* @__PURE__ */ u("label", { children: [
            "Username:",
            " ",
            /* @__PURE__ */ u(
              "input",
              {
                id: "username_req",
                ref: inputRef,
                type: "text",
                maxLength: 32,
                onKeyDown: handleKeyDown2,
                style: {
                  padding: "4px 8px",
                  fontSize: "14px",
                  background: "#2a2a3e",
                  color: "#e0e0e0",
                  border: "1px solid #555",
                  borderRadius: "3px",
                  width: "200px"
                }
              }
            )
          ] }),
          error && /* @__PURE__ */ u("div", { style: { color: "#ff6b6b", marginTop: "4px", fontSize: "13px" }, children: error })
        ] }),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px", textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: submit, children: "Observe Game" }) })
      ]
    }
  );
}
if (window.client === void 0 || Object.keys(window.client).length === 0) {
  if (window.client === void 0) window.client = {};
}
if (window.client_frozen === void 0) window.client_frozen = false;
if (window.phase_start_time === void 0) window.phase_start_time = 0;
if (window.debug_active === void 0) window.debug_active = false;
if (window.autostart === void 0) window.autostart = false;
if (window.username === void 0) window.username = null;
if (window.fc_seedrandom === void 0) window.fc_seedrandom = null;
if (window.game_type === void 0) window.game_type = "";
if (window.audio === void 0) window.audio = null;
if (window.audio_enabled === void 0) window.audio_enabled = false;
if (window.last_turn_change_time === void 0) window.last_turn_change_time = 0;
if (window.turn_change_elapsed === void 0) window.turn_change_elapsed = 0;
if (window.seconds_to_phasedone === void 0) window.seconds_to_phasedone = 0;
if (window.seconds_to_phasedone_sync === void 0) window.seconds_to_phasedone_sync = 0;
if (window.dialog_close_trigger === void 0) window.dialog_close_trigger = "";
if (window.dialog_message_close_task === void 0) window.dialog_message_close_task = void 0;
if (window.RENDERER_2DCANVAS === void 0) window.RENDERER_2DCANVAS = RENDERER_2DCANVAS$1;
if (window.renderer === void 0) window.renderer = RENDERER_2DCANVAS$1;
if (!window.music_list) {
  window.music_list = [
    "battle-epic",
    "battle2",
    "battle3",
    "battle4",
    "battle5",
    "battle6",
    "battle7",
    "battle8"
  ];
}
function civClientInit() {
  store.observing = true;
  window.observing = true;
  store.gameType = "observe";
  window.game_type = "observe";
  for (const id of ["civ_tab", "cities_tab", "opt_tab", "hel_tab", "pregame_buttons", "game_unit_orders_default", "civ_dialog", "game_unit_panel", "tabs-cities", "tabs-opt", "tabs-hel", "tabs-civ"]) {
    document.getElementById(id)?.remove();
  }
  window.fc_seedrandom = new (window.Math.seedrandom || window.seedrandom)("xbworld");
  if (window.requestAnimationFrame == null) {
    swal("Please upgrade your browser.");
    return;
  }
  init_mapview();
  game_init();
  initTabs("#tabs", { heightStyle: "fill" });
  control_init();
  window.timeoutTimerId = setInterval(function() {
    if (typeof window.update_timeout === "function") window.update_timeout();
  }, 1e3);
  update_game_status_panel();
  window.statusTimerId = setInterval(function() {
    update_game_status_panel();
  }, 6e3);
  if (window.overviewTimerId == null || window.overviewTimerId === -1) {
    window.OVERVIEW_REFRESH = 6e3;
    window.overviewTimerId = setInterval(function() {
      redraw_overview();
    }, window.OVERVIEW_REFRESH);
  }
  if (typeof window.motd_init === "function") window.motd_init();
  const tabs = document.getElementById("tabs");
  if (tabs) tabs.style.height = window.innerHeight + "px";
  for (const id of ["tabs-map", "tabs-civ", "tabs-tec", "tabs-nat", "tabs-cities", "tabs-opt", "tabs-hel"]) {
    const el = document.getElementById(id);
    if (el) el.style.height = "auto";
  }
  window.sounds_enabled = JSON.parse(localStorage.getItem("sndFX") ?? "null");
  if (window.sounds_enabled == null) {
    window.sounds_enabled = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome") ? false : true;
  }
  if (window.audiojs) {
    window.audiojs.events.ready(function() {
      const as = window.audiojs.createAll({
        trackEnded: function() {
          const list = window.music_list;
          const track = list[Math.floor(Math.random() * list.length)];
          const ext = typeof window.supports_mp3 === "function" && !window.supports_mp3() ? ".ogg" : ".mp3";
          if (window.audio) {
            window.audio.load("/music/" + track + ext);
            window.audio.play();
          }
        }
      });
      window.audio = as[0];
    });
  }
  initCommonIntroDialog();
  if (typeof window.setup_window_size === "function") window.setup_window_size();
}
function initCommonIntroDialog() {
  const saved = localStorage.getItem("username");
  store.username = saved || "Observer";
  window.username = store.username;
  showIntroDialog("Welcome to XBWorld", "You are joining the game as an observer. Please enter your name:");
  Promise.resolve().then(() => connection).then((m2) => m2.network_init());
}
function showDialogMessage(title, message) {
  showMessageDialog(title, message);
}
function showAuthDialog(packet) {
  showAuthDialog$1(packet);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.civclient_state || window.civclient_state === 0) {
      civClientInit();
    }
  });
} else {
  if (!window.civclient_state || window.civclient_state === 0) {
    civClientInit();
  }
}
function getMessageLog() {
  return window.message_log;
}
const jsSHA = window.jsSHA;
const load_game_check = window.load_game_check;
const debug_active = window.debug_active;
const win$3 = window;
let clinet_last_send = 0;
let debug_client_speed_list = [];
const freeciv_version = "+Freeciv.Web.Devel-3.3";
let ws = null;
let civserverport = null;
let ping_last = (/* @__PURE__ */ new Date()).getTime();
let _beforeUnloadHandler = null;
const pingtime_check = 24e4;
let ping_timer = null;
function network_init() {
  if (!("WebSocket" in window)) {
    swal("WebSockets not supported", "", "error");
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const urlPort = urlParams.get("civserverport");
  if (urlPort) {
    civserverport = urlPort;
    websocket_init();
    if (typeof load_game_check === "function") load_game_check();
    return;
  }
  fetch("/civclientlauncher?action=observe", { method: "POST" }).then((response) => {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json().then((data) => ({ data, response }));
  }).then(({ data, response }) => {
    let port = null;
    let result = null;
    if (data && data.port != null) {
      port = String(data.port);
      result = data.result || "success";
    }
    if (!port) {
      port = response.headers.get("port");
      result = response.headers.get("result");
    }
    if (port != null && result === "success") {
      civserverport = port;
      websocket_init();
      if (typeof load_game_check === "function") load_game_check();
    } else {
      showDialogMessage("Network error", "Invalid server port. Error: " + result);
    }
  }).catch((error) => {
    showDialogMessage(
      "Network error",
      "Unable to communicate with game launcher. Error: " + error.message
    );
  });
}
function websocket_init() {
  blockUI("<h2>Please wait while connecting to the server.</h2>");
  const proxyport = 1e3 + parseFloat(civserverport);
  const ws_protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  const port = window.location.port ? ":" + window.location.port : "";
  ws = new WebSocket(ws_protocol + window.location.hostname + port + "/civsocket/" + proxyport);
  ws.onopen = check_websocket_ready;
  ws.onmessage = function(event) {
    if (typeof client_handle_packet !== "undefined") {
      try {
        let parsed = JSON.parse(event.data);
        if (!Array.isArray(parsed)) {
          parsed = [parsed];
        }
        client_handle_packet(parsed);
      } catch (e2) {
        console.error("Failed to parse packet:", e2);
      }
    }
  };
  ws.onclose = function(event) {
    swal(
      "Network Error",
      "Connection to server is closed. Please reload the page to restart. Sorry!",
      "error"
    );
    const ml = getMessageLog();
    if (ml != null) {
      ml.update({
        event: E_LOG_ERROR,
        message: "Error: connection to server is closed. Please reload the page to restart. Sorry!"
      });
    }
    console.info("WebSocket connection closed, code+reason: " + event.code + ", " + event.reason);
    const turnBtn = document.getElementById("turn_done_button");
    if (turnBtn) turnBtn.disabled = true;
    const saveBtn = document.getElementById("save_button");
    if (saveBtn) saveBtn.disabled = true;
    if (_beforeUnloadHandler) {
      window.removeEventListener("beforeunload", _beforeUnloadHandler);
      _beforeUnloadHandler = null;
    }
    if (ping_timer) clearInterval(ping_timer);
  };
  ws.onerror = function(evt) {
    showDialogMessage(
      "Network error",
      "A problem occured with the " + document.location.protocol + " WebSocket connection to the server: " + (ws ? ws.url : "")
    );
    console.error("WebSocket error:", evt);
  };
}
function check_websocket_ready() {
  if (ws != null && ws.readyState === 1) {
    let sha_password = null;
    const stored_password = localStorage.getItem("password") ?? "";
    if (stored_password != null && stored_password !== "") {
      const shaObj = new jsSHA("SHA-512", "TEXT");
      shaObj.update(stored_password);
      sha_password = encodeURIComponent(shaObj.getHash("HEX"));
    }
    const login_message = {
      pid: 4,
      username: win$3.username,
      capability: freeciv_version,
      version_label: "-dev",
      major_version: 3,
      minor_version: 1,
      patch_version: 90,
      port: civserverport,
      password: sha_password
    };
    ws.send(JSON.stringify(login_message));
    _beforeUnloadHandler = function(e2) {
      e2.preventDefault();
      return "Do you really want to leave your nation behind now?";
    };
    window.addEventListener("beforeunload", _beforeUnloadHandler);
    ping_timer = setInterval(ping_check, pingtime_check);
    unblockUI();
  } else {
    setTimeout(check_websocket_ready, 500);
  }
}
function network_stop() {
  if (ws != null) ws.close();
  ws = null;
}
function send_request(packet_payload) {
  if (ws != null) {
    ws.send(packet_payload);
  }
  if (debug_active) {
    clinet_last_send = (/* @__PURE__ */ new Date()).getTime();
  }
}
function clinet_debug_collect() {
  const time_elapsed = (/* @__PURE__ */ new Date()).getTime() - clinet_last_send;
  debug_client_speed_list.push(time_elapsed);
  clinet_last_send = (/* @__PURE__ */ new Date()).getTime();
}
function ping_check() {
  const time_since_last_ping = (/* @__PURE__ */ new Date()).getTime() - ping_last;
  if (time_since_last_ping > pingtime_check) {
    console.log(
      "Error: Missing PING message from server, indicates server connection problem."
    );
  }
}
function send_message_delayed(message, delay) {
  setTimeout(function() {
    send_message(message);
  }, delay);
}
function send_message(message) {
  const { sendChatMessage: sendChatMessage2 } = require("./commands");
  sendChatMessage2(message);
}
Object.defineProperty(win$3, "ws", {
  get: () => ws,
  set: (v2) => {
    ws = v2;
  },
  configurable: true
});
Object.defineProperty(win$3, "civserverport", {
  get: () => civserverport,
  set: (v2) => {
    civserverport = v2;
  },
  configurable: true
});
Object.defineProperty(win$3, "ping_last", {
  get: () => ping_last,
  set: (v2) => {
    ping_last = v2;
  },
  configurable: true
});
const connection = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  check_websocket_ready,
  clinet_debug_collect,
  debug_client_speed_list,
  network_init,
  network_stop,
  ping_check,
  send_message,
  send_message_delayed,
  send_request,
  websocket_init
}, Symbol.toStringTag, { value: "Module" }));
function send(packet) {
  send_request(JSON.stringify(packet));
}
function sendChatMessage(message) {
  send({ pid: packet_chat_msg_req, message });
}
function sendCityNameSuggestionReq(unitId) {
  send({ pid: packet_city_name_suggestion_req, unit_id: unitId });
}
function sendPlayerPhaseDone(turn) {
  send({ pid: packet_player_phase_done, turn });
}
function sendPlayerResearch(techId) {
  send({ pid: packet_player_research, tech: techId });
}
function sendPlayerTechGoal(techId) {
  send({ pid: packet_player_tech_goal, tech: techId });
}
function sendPlayerRates(tax2, luxury, science) {
  send({ pid: packet_player_rates, tax: tax2, luxury, science });
}
function sendUnitSscsSet(unitId, type, value) {
  send({ pid: packet_unit_sscs_set, unit_id: unitId, type, value });
}
function sendUnitOrders(packet) {
  send({ pid: packet_unit_orders, ...packet });
}
function sendUnitServerSideAgentSet(unitId, agent) {
  send({ pid: packet_unit_server_side_agent_set, unit_id: unitId, agent });
}
function sendUnitDoAction(actionId, actorId, targetId, subTgtId = 0, name = "") {
  send({
    pid: packet_unit_do_action,
    action_type: actionId,
    actor_id: actorId,
    target_id: targetId,
    sub_tgt_id: subTgtId,
    name
  });
}
function sendUnitGetActions(actorUnitId, targetUnitId, targetTileId, targetExtraId, requestKind) {
  send({
    pid: packet_unit_get_actions,
    actor_unit_id: actorUnitId,
    target_unit_id: targetUnitId,
    target_tile_id: targetTileId,
    target_extra_id: targetExtraId,
    request_kind: requestKind
  });
}
function sendUnitChangeActivity(unitId, activity, target) {
  send({ pid: packet_unit_change_activity, unit_id: unitId, activity, target });
}
function sendDiplomacyInitMeeting(counterpart) {
  send({ pid: packet_diplomacy_init_meeting_req, counterpart });
}
function sendDiplomacyCancelPact(otherPlayerId, clause) {
  send({ pid: packet_diplomacy_cancel_pact, other_player_id: otherPlayerId, clause });
}
const packet_web_cma_set = 257;
function sendCmaSet(cityId, cmParameter) {
  send({ pid: packet_web_cma_set, id: cityId, cm_parameter: cmParameter });
}
function sendCmaClear(cityId) {
  send({ pid: packet_web_cma_clear, id: cityId });
}
function sendGotoPathReq(unitId, goalTileIndex) {
  send({ pid: packet_web_goto_path_req, unit_id: unitId, goal: goalTileIndex });
}
function sendInfoTextReq(visibleUnit, loc, focusUnit) {
  send({ pid: packet_web_info_text_req, visible_unit: visibleUnit, loc, focus_unit: focusUnit });
}
function sendConnPong() {
  send({ pid: packet_conn_pong });
}
function sendClientInfo() {
  send({
    pid: packet_client_info,
    gui: 2,
    // GUI_WEB
    emerg_version: 0,
    distribution: ""
  });
}
const FC_ACT_DEC_ACTIVE = ACT_DEC_ACTIVE;
const FC_ACT_DEC_PASSIVE = ACT_DEC_PASSIVE;
const FC_ACT_DEC_NOTHING = ACT_DEC_NOTHING;
const FC_IDENTITY_NUMBER_ZERO = IDENTITY_NUMBER_ZERO;
const FC_EXTRA_NONE = EXTRA_NONE$1;
const USSDT_UNQUEUE = UnitSSDataType.UNQUEUE;
const REQEST_PLAYER_INITIATED = 0;
function should_ask_server_for_actions(punit) {
  return punit["action_decision_want"] === FC_ACT_DEC_ACTIVE || punit["action_decision_want"] === FC_ACT_DEC_PASSIVE && popup_actor_arrival;
}
function can_ask_server_for_actions() {
  return action_selection_in_progress_for === FC_IDENTITY_NUMBER_ZERO;
}
function ask_server_for_actions(punit) {
  if (window.observing || punit == null) {
    return false;
  }
  if (action_selection_in_progress_for != FC_IDENTITY_NUMBER_ZERO && action_selection_in_progress_for != punit.id) {
    console.log(
      "Unit %d started action selection before unit %d was done",
      action_selection_in_progress_for,
      punit.id
    );
  }
  setActionSelectionInProgressFor(punit.id);
  const ptile = indexToTile(punit["action_decision_tile"]);
  if (ptile != null) {
    sendUnitGetActions(
      punit["id"],
      FC_IDENTITY_NUMBER_ZERO,
      punit["action_decision_tile"],
      FC_EXTRA_NONE,
      REQEST_PLAYER_INITIATED
    );
  }
  return true;
}
function action_selection_no_longer_in_progress(old_actor_id) {
  if (old_actor_id != action_selection_in_progress_for && old_actor_id != FC_IDENTITY_NUMBER_ZERO && action_selection_in_progress_for != FC_IDENTITY_NUMBER_ZERO) {
    console.log(
      "Decision taken for %d but selection is for %d.",
      old_actor_id,
      action_selection_in_progress_for
    );
  }
  setActionSelectionInProgressFor(FC_IDENTITY_NUMBER_ZERO);
  setIsMoreUserInputNeeded(false);
}
function action_decision_clear_want(old_actor_id) {
  const old = game_find_unit_by_number(old_actor_id);
  if (old != null && old["action_decision_want"] !== FC_ACT_DEC_NOTHING) {
    sendUnitSscsSet(old_actor_id, USSDT_UNQUEUE, FC_IDENTITY_NUMBER_ZERO);
  }
}
function action_selection_next_in_focus(old_actor_id) {
  for (let i2 = 0; i2 < current_focus$1.length; i2++) {
    const funit = current_focus$1[i2];
    if (old_actor_id != funit["id"] && should_ask_server_for_actions(funit)) {
      ask_server_for_actions(funit);
      return;
    }
  }
}
function action_decision_request(actor_unit) {
  if (actor_unit == null) {
    console.log("action_decision_request(): No actor unit");
    return;
  }
  if (!unit_is_in_focus$1(actor_unit)) {
    unit_focus_urgent(actor_unit);
  } else if (canClientIssueOrders() && can_ask_server_for_actions()) {
    ask_server_for_actions(actor_unit);
  }
}
const win$2 = window;
function showDebugInfo() {
  console.log("XBWorld version: " + (win$2.freeciv_version ?? "unknown"));
  console.log("Browser useragent: " + navigator.userAgent);
  console.log("jQuery version: " + $().jquery);
  console.log("jQuery UI version: " + $.ui?.version);
  console.log(
    "simpleStorage version: N/A (replaced with native localStorage)"
  );
  console.log(
    "Touch device: " + (typeof win$2.is_touch_device === "function" ? win$2.is_touch_device() : "unknown")
  );
  console.log("HTTP protocol: " + document.location.protocol);
  if (win$2.ws != null && win$2.ws.url != null) {
    console.log("WebSocket URL: " + win$2.ws.url);
  }
  win$2.debug_active = true;
  const pingList = win$2.debug_ping_list ?? [];
  if (pingList.length > 0) {
    let sum = 0;
    let max = 0;
    for (const v2 of pingList) {
      sum += v2;
      if (v2 > max) max = v2;
    }
    console.log(
      "Network PING average (server): " + sum / pingList.length + " ms. (Max: " + max + "ms.)"
    );
  }
  const clientSpeedList = win$2.debug_client_speed_list ?? [];
  if (clientSpeedList.length > 0) {
    let sum = 0;
    let max = 0;
    for (const v2 of clientSpeedList) {
      sum += v2;
      if (v2 > max) max = v2;
    }
    console.log(
      "Network PING average (client): " + sum / clientSpeedList.length + " ms.  (Max: " + max + "ms.)"
    );
  }
}
function global_keyboard_listener(ev) {
  if (document.querySelector("input:focus") != null || !keyboard_input) return;
  if (C_S_RUNNING != clientState()) return;
  if (!ev) ev = window.event;
  const keyboard_key = String.fromCharCode(ev.keyCode);
  if (0 === getActiveTab("#tabs")) {
    if (find_active_dialog() == null) {
      map_handle_key(keyboard_key, ev.keyCode, ev["ctrlKey"], ev["altKey"], ev["shiftKey"]);
    }
  }
  civclient_handle_key(keyboard_key, ev.keyCode, ev["ctrlKey"], ev["altKey"], ev["shiftKey"]);
  if (window.renderer == RENDERER_2DCANVAS$1) {
    const canvasEl = document.getElementById("canvas");
    canvasEl?.contextMenu?.("hide");
  }
}
function civclient_handle_key(keyboard_key, key_code, ctrl, alt, shift, the_event) {
  switch (keyboard_key) {
    case "Q":
      if (alt) civclient_benchmark(0);
      break;
    case "D":
      if (!shift && (alt || ctrl)) {
        showDebugInfo();
      }
      break;
    default:
      if (key_code == 13 && shift && C_S_RUNNING == clientState() && !clientIsObserver()) {
        send_end_turn();
      }
  }
}
function map_handle_key(keyboard_key, key_code, ctrl, alt, shift, the_event) {
  switch (keyboard_key) {
    case "B":
      request_unit_build_city();
      break;
    case "G":
      if (current_focus$1.length > 0) {
        activate_goto();
      }
      break;
    case "H":
      key_unit_homecity();
      break;
    case "X":
      key_unit_auto_explore();
      break;
    case "A":
      key_unit_auto_work();
      break;
    case "L":
      if (shift) {
        key_unit_airlift();
      } else {
        key_unit_load();
      }
      break;
    case "W":
      key_unit_wait();
      break;
    case "J":
      if (shift) {
        key_unit_idle();
      } else {
        key_unit_noorders();
      }
      break;
    case "R":
      key_unit_road();
      break;
    case "E":
      if (shift) {
        key_unit_airbase();
      }
      break;
    case "F":
      if (shift) {
        key_unit_fortress();
      } else {
        key_unit_fortify();
      }
      break;
    case "I":
      if (shift) {
        key_unit_cultivate();
      } else {
        key_unit_irrigate();
      }
      break;
    case "U":
      key_unit_upgrade();
      break;
    case "S":
      if (!ctrl) {
        key_unit_sentry();
      }
      break;
    case "P":
      if (shift) {
        key_unit_pillage();
      } else {
        key_unit_clean();
      }
      break;
    case "M":
      if (shift) {
        key_unit_plant();
      } else {
        key_unit_mine();
      }
      break;
    case "O":
      key_unit_transform();
      break;
    case "T":
      key_unit_unload();
      break;
    case "C":
      if (ctrl) {
        setShowCitybar(!show_citybar);
      } else if (current_focus$1.length > 0) {
        auto_center_on_focus_unit();
      }
      break;
    case "N":
      if (shift) {
        key_unit_nuke();
      }
      break;
    case "D":
      if (shift) {
        key_unit_disband();
      } else if (!(alt || ctrl)) {
        key_unit_action_select();
      }
      break;
  }
  switch (key_code) {
    case 35:
    //1
    case 97:
      key_unit_move(DIR8_SOUTH$2);
      break;
    case 40:
    // 2
    case 98:
      key_unit_move(DIR8_SOUTHEAST$1);
      break;
    case 34:
    // 3
    case 99:
      key_unit_move(DIR8_EAST$2);
      break;
    case 37:
    // 4
    case 100:
      key_unit_move(DIR8_SOUTHWEST$1);
      break;
    case 39:
    // 6
    case 102:
      key_unit_move(DIR8_NORTHEAST$1);
      break;
    case 36:
    // 7
    case 103:
      key_unit_move(DIR8_WEST$2);
      break;
    case 38:
    // 8
    case 104:
      key_unit_move(DIR8_NORTHWEST$1);
      break;
    case 33:
    // 9
    case 105:
      key_unit_move(DIR8_NORTH$2);
      break;
    case 27:
      deactivate_goto(false);
      setMapSelectActive(false);
      setMapSelectCheck(false);
      setMapviewMouseMovement(false);
      setContextMenuActive(true);
      if (window.renderer == RENDERER_2DCANVAS$1) {
        const canvasEl = document.getElementById("canvas");
        canvasEl?.contextMenu?.(true);
      } else {
        const canvasDivEl = document.getElementById("canvas_div");
        canvasDivEl?.contextMenu?.(true);
      }
      setParadropActive(false);
      setAirliftActive(false);
      setActionTgtSelActive(false);
      break;
    case 32:
      setCurrentFocus([]);
      setGotoActive(false);
      const canvasDiv = document.getElementById("canvas_div");
      if (canvasDiv) canvasDiv.style.cursor = "default";
      setGotoRequestMap({});
      setGotoTurnsRequestMap({});
      clearGotoTiles();
      update_active_units_dialog();
      break;
  }
}
function handle_context_menu_callback(key) {
  switch (key) {
    case "build":
      request_unit_build_city();
      break;
    case "tile_info":
      const ptile = find_a_focus_unit_tile_to_center_on();
      if (ptile != null) popit_req(ptile);
      break;
    case "goto":
      activate_goto();
      break;
    case "explore":
      key_unit_auto_explore();
      break;
    case "fortify":
      key_unit_fortify();
      break;
    case "road":
    case "railroad":
    case "maglev":
      key_unit_road();
      break;
    case "plant":
      key_unit_plant();
      break;
    case "mine":
      key_unit_mine();
      break;
    case "autoworkers":
      key_unit_auto_work();
      break;
    case "clean":
      key_unit_clean();
      break;
    case "cultivate":
      key_unit_cultivate();
      break;
    case "irrigation":
      key_unit_irrigate();
      break;
    case "fortress":
      key_unit_fortress();
      break;
    case "airbase":
      key_unit_airbase();
      break;
    case "transform":
      key_unit_transform();
      break;
    case "nuke":
      key_unit_nuke();
      break;
    case "paradrop":
      key_unit_paradrop();
      break;
    case "pillage":
      key_unit_pillage();
      break;
    case "homecity":
      key_unit_homecity();
      break;
    case "airlift":
      key_unit_airlift();
      break;
    case "sentry":
      key_unit_sentry();
      break;
    case "wait":
      key_unit_wait();
      break;
    case "noorders":
      key_unit_noorders();
      break;
    case "idle":
      key_unit_idle();
      break;
    case "upgrade":
      key_unit_upgrade();
      break;
    case "disband":
      key_unit_disband();
      break;
    case "unit_load":
      key_unit_load();
      break;
    case "unit_unload":
      key_unit_unload();
      break;
    case "unit_show_cargo":
      key_unit_show_cargo();
      break;
    case "action_selection":
      key_unit_action_select();
      break;
    case "show_city":
      const stile = find_a_focus_unit_tile_to_center_on();
      if (stile != null) {
        show_city_dialog(tileCity(stile));
      }
      break;
  }
  if (key != "goto" && isTouchDevice()) {
    deactivate_goto(false);
  }
}
let governments = {};
let requested_gov = -1;
function init_civ_dialog() {
  if (!clientIsObserver() && clientPlaying() != null) {
    const pplayer = clientPlaying();
    const pnation = store.nations[pplayer["nation"]];
    const tag = pnation["graphic_str"];
    let civ_description = "";
    if (!pnation["customized"]) {
      civ_description += "<img src='/images/flags/" + tag + "-web" + get_tileset_file_extention() + "' width='180'>";
    }
    civ_description += "<br><div>" + pplayer["name"] + " rules the " + store.nations[pplayer["nation"]]["adjective"] + " with the form of government: " + store.governments[clientPlaying()["government"]]["name"] + "</div><br>";
    const nationTitleEl = document.getElementById("nation_title");
    if (nationTitleEl) nationTitleEl.innerHTML = "The " + store.nations[pplayer["nation"]]["adjective"] + " nation";
    const civTextEl = document.getElementById("civ_dialog_text");
    if (civTextEl) civTextEl.innerHTML = civ_description;
  } else {
    const civTextEl = document.getElementById("civ_dialog_text");
    if (civTextEl) civTextEl.innerHTML = "This dialog isn't available as observer.";
  }
}
function update_govt_dialog() {
  let govt;
  let govt_id;
  if (clientIsObserver()) return;
  let governments_list_html = "";
  for (govt_id in governments) {
    govt = store.governments[govt_id];
    governments_list_html += "<button class='govt_button' id='govt_id_" + govt["id"] + "' onclick='set_req_government(" + govt["id"] + ");' title='" + govt["helptext"] + "'>" + govt["name"] + "</button>";
  }
  const govListEl = document.getElementById("governments_list");
  if (govListEl) govListEl.innerHTML = governments_list_html;
  for (govt_id in governments) {
    govt = store.governments[govt_id];
    const btn = document.getElementById("govt_id_" + govt["id"]);
    if (!btn) continue;
    btn.textContent = govt["name"];
    btn.title = govt["helptext"] || "";
    if (!canPlayerGetGov(Number(govt_id))) {
      btn.disabled = true;
    } else if (requested_gov == Number(govt_id)) {
      btn.style.background = "green";
    } else if (clientPlaying()?.["government"] == Number(govt_id)) {
      btn.style.background = "#BBBBFF";
      btn.style.fontWeight = "bolder";
    }
  }
}
function set_req_government(gov_id) {
  requested_gov = gov_id;
  update_govt_dialog();
}
function get_tileset_file_extention() {
  return "";
}
function get_helpdata_order() {
  return store.helpdata_order || [];
}
function get_helpdata() {
  return store.helpdata || {};
}
function get_freeciv_wiki_docs() {
  return store.freeciv_wiki_docs || {};
}
function byId(id) {
  return document.getElementById(id);
}
function setHtml(id, html) {
  const el = byId(id);
  if (el) el.innerHTML = html;
}
function appendLi(parentId, helptag, text) {
  const li = document.createElement("li");
  li.dataset.helptag = helptag;
  li.textContent = text;
  byId(parentId)?.appendChild(li);
}
const toplevel_menu_items = [
  "help_terrain",
  "help_economy",
  "help_cities",
  "help_city_improvements",
  "help_wonders_of_the_world",
  "help_units",
  "help_combat",
  "help_technology",
  "help_government"
];
const hidden_menu_items = [
  "help_connecting",
  "help_languages",
  "help_governor",
  "help_chatline",
  "help_about",
  "help_worklist_editor"
];
function show_help() {
  const tabsHel = byId("tabs-hel");
  if (tabsHel) tabsHel.style.display = "";
  byId("help_menu")?.remove();
  byId("help_info_page")?.remove();
  const menu = document.createElement("ul");
  menu.id = "help_menu";
  const infoPage = document.createElement("div");
  infoPage.id = "help_info_page";
  tabsHel?.appendChild(menu);
  tabsHel?.appendChild(infoPage);
  for (const sec_id in get_helpdata_order()) {
    const key = get_helpdata_order()[sec_id];
    if (hidden_menu_items.indexOf(key) > -1) {
      continue;
    } else if (key.indexOf("help_gen") !== -1) {
      generate_help_menu(key);
    } else if (toplevel_menu_items.indexOf(key) > -1) {
      generate_help_toplevel(key);
    } else {
      const parent_key = find_parent_help_key(key);
      const li = document.createElement("li");
      li.id = key;
      li.dataset.helptag = key;
      li.textContent = helpdata_tag_to_title(key);
      document.querySelector(parent_key)?.appendChild(li);
    }
  }
  menu.addEventListener("click", function(ev) {
    const li = ev.target.closest("li[data-helptag]");
    if (li) {
      handle_help_menu_select_native(li);
    }
  });
  show_help_intro();
  if (tabsHel) tabsHel.style.height = window.innerHeight - 60 + "px";
  const menuEl = byId("help_menu");
  const infoEl = byId("help_info_page");
  if (infoEl && menuEl) {
    infoEl.style.maxWidth = window.innerWidth - menuEl.offsetWidth - 60 + "px";
  }
}
function show_help_intro() {
  fetch("/docs/help_intro.txt").then((r2) => r2.text()).then((data) => {
    setHtml("help_info_page", data);
  });
}
function generate_help_menu(key) {
  let impr_id;
  let improvement;
  if (key === "help_gen_terrain") {
    for (const terrain_id in store.terrains) {
      const terrain = store.terrains[terrain_id];
      appendLi("help_terrain_ul", key + "_" + terrain["id"], terrain["name"]);
    }
  } else if (key === "help_gen_improvements") {
    for (impr_id in store.improvements) {
      improvement = store.improvements[impr_id];
      if (is_wonder(improvement)) continue;
      appendLi("help_city_improvements_ul", key + "_" + improvement["id"], improvement["name"]);
    }
  } else if (key === "help_gen_wonders") {
    for (impr_id in store.improvements) {
      improvement = store.improvements[impr_id];
      if (!is_wonder(improvement)) continue;
      appendLi("help_wonders_of_the_world_ul", key + "_" + improvement["id"], improvement["name"]);
    }
  } else if (key === "help_gen_units") {
    const unit_ids = unittype_ids_alphabetic();
    for (let i2 = 0; i2 < unit_ids.length; i2++) {
      const unit_id = unit_ids[i2];
      const punit_type = store.unitTypes[unit_id];
      appendLi("help_units_ul", key + "_" + punit_type["id"], punit_type["name"]);
    }
  } else if (key === "help_gen_techs") {
    for (const tech_id in store.techs) {
      if (tech_id === "0") continue;
      const tech = store.techs[tech_id];
      appendLi("help_technology_ul", key + "_" + tech["id"], tech["name"]);
    }
  } else if (key === "help_gen_governments") {
    for (const gov_id in store.governments) {
      const pgov = store.governments[gov_id];
      appendLi("help_government_ul", key + "_" + pgov["id"], pgov["name"]);
    }
  } else if (key === "help_gen_ruleset") {
    const parent_key = find_parent_help_key(key);
    const li = document.createElement("li");
    li.id = key;
    li.dataset.helptag = key;
    li.textContent = "About Current Ruleset";
    document.querySelector(parent_key)?.appendChild(li);
  }
}
function render_sprite(sprite) {
  return "<div class='help_unit_image' style=' background: transparent url(" + sprite["image-src"] + ");background-position:-" + sprite["tileset-x"] + "px -" + sprite["tileset-y"] + "px;  width: " + sprite["width"] + "px;height: " + sprite["height"] + "px;'></div>";
}
function generate_help_toplevel(key) {
  const parent_key = find_parent_help_key(key);
  const li = document.createElement("li");
  li.id = key;
  li.dataset.helptag = key;
  li.textContent = helpdata_tag_to_title(key);
  document.querySelector(parent_key)?.appendChild(li);
  const ul = document.createElement("ul");
  ul.id = key + "_ul";
  ul.className = "help_submenu";
  li.appendChild(ul);
}
function find_parent_help_key(key) {
  if (key === "help_terrain_alterations") {
    return "#help_terrain_ul";
  } else if (key === "help_villages" || key === "help_borders") {
    return "#help_terrain_ul";
  } else if (key === "help_food" || key === "help_production" || key === "help_trade") {
    return "#help_economy_ul";
  } else if (key === "help_specialists" || key === "help_happiness" || key === "help_pollution" || key === "help_plague" || key === "help_migration") {
    return "#help_cities_ul";
  } else if (key === "help_combat_example_1" || key === "help_combat_example_2") {
    return "#help_combat_ul";
  } else {
    return "#help_menu";
  }
}
function handle_help_menu_select_native(item) {
  const selected_tag = item.dataset.helptag || "";
  if (selected_tag.indexOf("help_gen") !== -1) {
    generate_help_text(selected_tag);
  } else if (selected_tag === "help_copying") {
    fetch("/docs/LICENSE.txt").then((r2) => r2.text()).then((data) => {
      setHtml("help_info_page", "<h1>Freeciv-Web License</h1>" + data.replace(/\n/g, "<br>"));
    });
  } else if (selected_tag === "help_controls") {
    fetch("/docs/controls.txt").then((r2) => r2.text()).then((data) => {
      setHtml("help_info_page", data.replace(/\n/g, "<br>"));
    });
  } else {
    const msg = "<h1>" + helpdata_tag_to_title(selected_tag) + "</h1>" + get_helpdata()[selected_tag]["text"];
    setHtml("help_info_page", msg);
  }
  byId("help_info_page")?.focus();
}
function wiki_on_item_button(item_name) {
  item_name = stringUnqualify(item_name);
  if (get_freeciv_wiki_docs()[item_name] == null) {
    console.log("No wiki data about " + item_name);
    return "";
  }
  return `<button class='help_button' onclick="show_wikipedia_dialog('` + item_name.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + `');">Wikipedia on ` + item_name + "</button>";
}
function helpdata_format_current_ruleset() {
  let msg = "";
  if (store.rulesControl != null) {
    msg += "<h1>" + store.rulesControl["name"] + "</h1>";
  }
  if (store.rulesSummary != null) {
    msg += "<p>" + store.rulesSummary.replace(/\n/g, "<br>") + "</p>";
  }
  if (store.rulesDescription != null) {
    msg += "<p>" + store.rulesDescription.replace(/\n/g, "<br>") + "</p>";
  }
  return msg;
}
function generate_help_text(key) {
  const rulesetdir = ruledir_from_ruleset_name(store.rulesControl?.["name"] ?? "", "");
  let msg = "";
  if (key.indexOf("help_gen_terrain") !== -1) {
    const terrain = store.terrains[parseInt(key.replace("help_gen_terrain_", ""))];
    msg = "<h1>" + terrain["name"] + "</h1>" + terrain["helptext"] + "<br><br>Movement cost: " + terrain["movement_cost"] + "<br>Defense bonus: " + terrain["defense_bonus"] + "<br>Food/Prod/Trade: " + terrain["output"][0] + "/" + terrain["output"][1] + "/" + terrain["output"][2];
  } else if (key.indexOf("help_gen_improvements") !== -1 || key.indexOf("help_gen_wonders") !== -1) {
    const improvement = store.improvements[parseInt(key.replace("help_gen_wonders_", "").replace("help_gen_improvements_", ""))];
    msg = "<h1>" + improvement["name"] + "</h1>" + render_sprite(get_improvement_image_sprite(improvement)) + "<br>" + improvement["helptext"] + "<br><br>Cost: " + improvement["build_cost"] + "<br>Upkeep: " + improvement["upkeep"];
    const reqs = get_improvement_requirements(improvement["id"]);
    if (reqs != null) {
      msg += "<br>Requirements: ";
      for (let n2 = 0; n2 < reqs.length; n2++) {
        msg += store.techs[reqs[n2]]["name"] + " ";
      }
    }
    msg += "<br><br>";
    msg += wiki_on_item_button(improvement["name"]);
  } else if (key.indexOf("help_gen_units") !== -1) {
    let obsolete_by;
    const punit_type = store.unitTypes[parseInt(key.replace("help_gen_units_", ""))];
    msg = "<h1>" + punit_type["name"] + "</h1>";
    msg += render_sprite(get_unit_type_image_sprite(punit_type));
    msg += "<br>";
    msg += "<div id='manual_non_helptext_facts'>";
    msg += "<div id='utype_fact_cost'>Cost: " + punit_type["build_cost"] + "</div>";
    msg += "<div id='utype_fact_upkeep'></div>";
    msg += "<div id='utype_fact_attack_str'>Attack: " + punit_type["attack_strength"] + "</div>";
    msg += "<div id='utype_fact_defense_str'>Defense: " + punit_type["defense_strength"] + "</div>";
    msg += "<div id='utype_fact_firepower'>Firepower: " + punit_type["firepower"] + "</div>";
    msg += "<div id='utype_fact_hp'>Hitpoints: " + punit_type["hp"] + "</div>";
    msg += "<div id='utype_fact_move_rate'>Moves: " + move_points_text(punit_type["move_rate"]) + "</div>";
    msg += "<div id='utype_fact_vision'>Vision: " + punit_type["vision_radius_sq"] + "</div>";
    const ireqs = get_improvement_requirements(punit_type["impr_requirement"]);
    if (ireqs != null && ireqs.length > 0) {
      msg += "<div id='utype_fact_req_building'>Building Requirements: ";
      for (let m2 = 0; m2 < ireqs.length; m2++) {
        msg += store.techs[ireqs[m2]]["name"] + " ";
      }
      msg += "</div>";
    }
    const treq = punit_type["tech_requirement"];
    if (treq != null && store.techs[treq] != null) {
      msg += "<div id='utype_fact_req_tech'>Tech Requirements: " + store.techs[treq]["name"] + "</div>";
    }
    obsolete_by = store.unitTypes[punit_type["obsoleted_by"]];
    msg += "<div id='utype_fact_obsolete'>Obsolete by: ";
    if (obsolete_by === U_NOT_OBSOLETED) {
      msg += "None";
    } else {
      msg += obsolete_by["name"];
    }
    msg += "</div>";
    msg += "</div>";
    msg += "<div id='helptext'><p>" + punit_type["helptext"] + "</p></div>";
    msg += wiki_on_item_button(punit_type["name"]);
    msg += "<div id='datastore' hidden='true'></div>";
  } else if (key.indexOf("help_gen_techs") !== -1) {
    const tech = store.techs[parseInt(key.replace("help_gen_techs_", ""))];
    msg = "<h1>" + tech["name"] + "</h1>" + render_sprite(get_technology_image_sprite(tech)) + "<br>" + get_advances_text(tech["id"]);
    msg += "<br><br>";
    msg += wiki_on_item_button(tech["name"]);
  } else if (key === "help_gen_ruleset") {
    msg = helpdata_format_current_ruleset();
  } else if (key.indexOf("help_gen_governments") !== -1) {
    const pgov = store.governments[parseInt(key.replace("help_gen_governments_", ""))];
    msg = "<h1>" + pgov["name"] + "</h1>";
    msg += "<div id='helptext'><p>" + pgov["helptext"] + "</p></div>";
    msg += wiki_on_item_button(pgov["name"]);
  }
  setHtml("help_info_page", msg);
  if (rulesetdir.length !== 0) {
    if (key.indexOf("help_gen_units") !== -1) {
      const utype_id = parseInt(key.replace("help_gen_units_", ""));
      fetch("../man/" + rulesetdir + "7.html").then((r2) => r2.text()).then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const helptext = doc.querySelector("#utype" + utype_id + " .helptext");
        if (helptext) {
          const el = byId("helptext");
          if (el) el.innerHTML = helptext.innerHTML;
        }
        const upkeep = doc.querySelector("#utype" + utype_id + " .upkeep");
        if (upkeep) {
          const el = byId("utype_fact_upkeep");
          if (el) el.innerHTML = upkeep.innerHTML;
        }
      }).catch(() => {
      });
    } else if (key.indexOf("help_gen_governments") !== -1) {
      const gov_id = parseInt(key.replace("help_gen_governments_", ""));
      fetch("../man/" + rulesetdir + "6.html").then((r2) => r2.text()).then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const helptext = doc.querySelector("#gov" + gov_id + " .helptext");
        if (helptext) {
          const el = byId("helptext");
          if (el) el.innerHTML = helptext.innerHTML;
        }
      }).catch(() => {
      });
    }
  }
}
function helpdata_tag_to_title(tag) {
  const result = tag.replace("_of_the_world", "").replace("help_", "").replace("gen_", "").replace("misc_", "").replace(/_/g, " ");
  return toTitleCase(result);
}
const state$1 = c({
  open: false,
  title: "",
  html: ""
});
function showIntelDialog(title, html) {
  state$1.value = { open: true, title, html };
}
function closeIntelDialog() {
  state$1.value = { ...state$1.value, open: false };
  const input = document.getElementById("game_text_input");
  if (input) input.blur();
}
function IntelDialog() {
  const { open, title, html } = state$1.value;
  return /* @__PURE__ */ u(
    Dialog,
    {
      title,
      open,
      onClose: closeIntelDialog,
      width: window.innerWidth <= 600 ? "90%" : "auto",
      modal: true,
      children: [
        /* @__PURE__ */ u(
          "div",
          {
            style: { maxHeight: "70vh", overflow: "auto" },
            dangerouslySetInnerHTML: { __html: html }
          }
        ),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px", textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: closeIntelDialog, children: "Ok" }) })
      ]
    }
  );
}
function show_intelligence_report_dialog() {
  const selected_player = window.selected_player;
  if (selected_player === -1) return;
  const pplayer = store.players[selected_player];
  if (clientIsObserver() || clientPlaying()?.["real_embassy"]?.isSet(selected_player)) {
    show_intelligence_report_embassy(pplayer);
  } else {
    show_intelligence_report_hearsay(pplayer);
  }
}
function show_intelligence_report_hearsay(pplayer) {
  let msg = "Ruler " + pplayer["name"] + "<br>";
  if (pplayer["government"] > 0) {
    msg += "Government: " + governments[pplayer["government"]]["name"] + "<br>";
  }
  if (pplayer["gold"] > 0) {
    msg += "Gold: " + pplayer["gold"] + "<br>";
  }
  if (pplayer["researching"] != null && pplayer["researching"] > 0 && store.techs[pplayer["researching"]] != null) {
    msg += "Researching: " + store.techs[pplayer["researching"]]["name"] + "<br>";
  }
  msg += "<br><br>Establishing an embassy will show a detailed intelligence report.";
  showDialogMessage(
    "Intelligence report for " + pplayer["name"],
    msg
  );
}
function show_intelligence_report_embassy(pplayer) {
  const capital = player_capital(pplayer);
  const gov = governments[pplayer["government"]];
  const govName = gov ? gov["name"] : "(Unknown)";
  const capitalName = capital ? capital.name : "(capital unknown)";
  let html = '<table style="width:100%;border-collapse:collapse;">';
  html += `<tr><td><b>Ruler:</b></td><td>${pplayer["name"]}</td></tr>`;
  html += `<tr><td><b>Government:</b></td><td>${govName}</td></tr>`;
  html += `<tr><td><b>Capital:</b></td><td>${capitalName}</td></tr>`;
  html += `<tr><td><b>Gold:</b></td><td>${pplayer["gold"]}</td></tr>`;
  html += `<tr><td><b>Tax:</b></td><td>${pplayer["tax"]}%</td></tr>`;
  html += `<tr><td><b>Science:</b></td><td>${pplayer["science"]}%</td></tr>`;
  html += `<tr><td><b>Luxury:</b></td><td>${pplayer["luxury"]}%</td></tr>`;
  html += `<tr><td><b>Culture:</b></td><td>${pplayer["culture"]}</td></tr>`;
  const research = research_get(pplayer);
  let researchText = "(Unknown)";
  const techNames = [];
  if (research !== void 0) {
    const researching = store.techs[research["researching"]];
    if (researching !== void 0) {
      researchText = `${researching["name"]} (${research["bulbs_researched"]}/${research["researching_cost"]})`;
    } else {
      researchText = "(Nothing)";
    }
    for (const tech_id in store.techs) {
      if (research["inventions"][tech_id] === TECH_KNOWN$1) {
        techNames.push(store.techs[tech_id]["name"]);
      }
    }
  }
  html += `<tr><td><b>Researching:</b></td><td>${researchText}</td></tr>`;
  html += "</table>";
  if (pplayer["diplstates"] !== void 0) {
    const diplEntries = [];
    pplayer["diplstates"].forEach(function(st, i2) {
      if (st["state"] !== DiplState.DS_NO_CONTACT && i2 !== pplayer["playerno"] && store.players[i2]) {
        const stateText = get_diplstate_text(st["state"]);
        const nationAdj2 = store.nations[store.players[i2]["nation"]]?.["adjective"] || "Unknown";
        diplEntries.push(`${nationAdj2}: ${stateText}`);
      }
    });
    if (diplEntries.length > 0) {
      html += '<h3 style="margin:8px 0 4px;">Diplomacy</h3><ul>';
      for (const entry of diplEntries) {
        html += `<li>${entry}</li>`;
      }
      html += "</ul>";
    }
  }
  if (techNames.length > 0) {
    html += `<h3 style="margin:8px 0 4px;">Known Techs (${techNames.length})</h3>`;
    html += `<p style="font-size:12px;">${techNames.join(", ")}</p>`;
  }
  const nationAdj = store.nations[pplayer["nation"]]?.["adjective"] || pplayer["name"];
  showIntelDialog(`Foreign Intelligence: ${nationAdj} Empire`, html);
}
function set_default_mapview_active() {
  setKeyboardInput(true);
}
function set_default_mapview_inactive() {
  setKeyboardInput(true);
}
function control_init() {
  setUrgentFocusQueue([]);
  mapctrl_init_2d();
  document.addEventListener("keydown", global_keyboard_listener);
  window.addEventListener("resize", mapview_window_resized);
  window.addEventListener("orientationchange", orientation_changed);
  window.addEventListener("resize", orientation_changed);
  document.getElementById("turn_done_button")?.addEventListener("click", send_end_turn);
  document.getElementById("freeciv_logo")?.addEventListener("click", function(event) {
    window.open("/", "_new");
  });
  const gameTextInput = document.getElementById("game_text_input");
  gameTextInput?.addEventListener("keydown", function(event) {
    return check_text_input(event, gameTextInput);
  });
  gameTextInput?.addEventListener("focus", function(event) {
    setKeyboardInput(false);
    setResizeEnabled(false);
  });
  gameTextInput?.addEventListener("blur", function(event) {
    setKeyboardInput(true);
    setResizeEnabled(true);
  });
  document.getElementById("chat_direction")?.addEventListener("click", function(event) {
    chat_context_change();
  });
  const pregameTextInput = document.getElementById("pregame_text_input");
  pregameTextInput?.addEventListener("keydown", function(event) {
    return check_text_input(event, pregameTextInput);
  });
  pregameTextInput?.addEventListener("blur", function(event) {
    setKeyboardInput(true);
    if (pregameTextInput.value == "") {
      pregameTextInput.value = ">";
    }
  });
  pregameTextInput?.addEventListener("focus", function(event) {
    setKeyboardInput(false);
    if (pregameTextInput.value == ">") pregameTextInput.value = "";
  });
  document.getElementById("tech_canvas")?.addEventListener("click", function(event) {
    tech_mapview_mouse_click(event);
  });
  document.onselectstart = function() {
    return false;
  };
  window.addEventListener("contextmenu", function(e2) {
    if (e2.target != null && (e2.target.id == "game_text_input" || e2.target.id == "overview_map" || e2.target.parentElement != null && e2.target.parentElement.id == "game_message_area")) return;
    if (!allow_right_click) e2.preventDefault();
  }, false);
  const context_options = {
    selector: "#canvas",
    zIndex: 5e3,
    autoHide: true,
    callback: function(key, options) {
      handle_context_menu_callback(key);
    },
    build: function($trigger, e2) {
      if (!context_menu_active) {
        setContextMenuActive(true);
        return false;
      }
      const unit_actions = update_unit_order_commands();
      return {
        callback: function(key, options) {
          handle_context_menu_callback(key);
        },
        items: unit_actions
      };
    }
  };
  if (!isTouchDevice()) {
    context_options["position"] = function(opt, x2, y2) {
      if (isTouchDevice()) return;
      const canvasDivEl = document.getElementById("canvas_div");
      const canvasEl = document.getElementById("canvas");
      let new_top = mouse_y + (canvasDivEl ? canvasDivEl.getBoundingClientRect().top + window.scrollY : 0);
      new_top = mouse_y + (canvasEl ? canvasEl.getBoundingClientRect().top + window.scrollY : 0);
      opt.$menu.css({ top: new_top, left: mouse_x });
    };
  }
  window.jQuery?.contextMenu?.(context_options);
  window.addEventListener("unload", function() {
    network_stop();
  });
  document.getElementById("map_tab")?.addEventListener("click", function(event) {
    setTimeout(set_default_mapview_active, 5);
  });
  document.getElementById("civ_tab")?.addEventListener("click", function(event) {
    set_default_mapview_inactive();
    init_civ_dialog();
  });
  document.getElementById("tech_tab")?.addEventListener("click", function(event) {
    set_default_mapview_inactive();
    update_tech_screen();
  });
  document.getElementById("players_tab")?.addEventListener("click", function(event) {
    set_default_mapview_inactive();
    updateNationScreen();
  });
  document.getElementById("cities_tab")?.addEventListener("click", function(event) {
    set_default_mapview_inactive();
    update_city_screen();
  });
  document.getElementById("opt_tab")?.addEventListener("click", function(event) {
    const tabsHel = document.getElementById("tabs-hel");
    if (tabsHel) tabsHel.style.display = "none";
    init_options_dialog();
    set_default_mapview_inactive();
  });
  document.getElementById("chat_tab")?.addEventListener("click", function(event) {
    set_default_mapview_inactive();
    const tabsChat = document.getElementById("tabs-chat");
    if (tabsChat) tabsChat.style.display = "";
  });
  document.getElementById("hel_tab")?.addEventListener("click", function(event) {
    set_default_mapview_inactive();
    show_help();
  });
  const overviewMap = document.getElementById("overview_map");
  overviewMap?.addEventListener("click", function(e2) {
    const rect = overviewMap.getBoundingClientRect();
    const x2 = e2.pageX - (rect.left + window.scrollX);
    const y2 = e2.pageY - (rect.top + window.scrollY);
    overview_clicked(x2, y2);
  });
  document.getElementById("send_message_button")?.addEventListener("click", function(e2) {
    showSendPrivateMessageDialog();
  });
  document.getElementById("intelligence_report_button")?.addEventListener("click", function(e2) {
    show_intelligence_report_dialog();
  });
  document.getElementById("meet_player_button")?.addEventListener("click", nationMeetClicked);
  document.getElementById("view_player_button")?.addEventListener("click", centerOnPlayer);
  document.getElementById("cancel_treaty_button")?.addEventListener("click", cancelTreatyClicked);
  document.getElementById("withdraw_vision_button")?.addEventListener("click", withdrawVisionClicked);
  document.getElementById("take_player_button")?.addEventListener("click", takePlayerClicked);
  document.getElementById("toggle_ai_button")?.addEventListener("click", toggleAiClicked);
  const nationsList = document.getElementById("nations_list");
  nationsList?.addEventListener("click", function(e2) {
    const row = e2.target.closest("tbody tr");
    if (row) handleNationTableSelect.call(row, e2);
  });
}
function DIVIDE(n2, d2) {
  return Math.floor(n2 / d2);
}
function FC_WRAP(value, range) {
  if (value < 0) {
    const mod = value % range;
    return mod !== 0 ? mod + range : 0;
  }
  return value >= range ? value % range : value;
}
function numberWithCommas(x2) {
  return x2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}
function stringUnqualify(str) {
  if (str.charAt(0) === "?" && str.includes(":")) {
    return str.slice(str.indexOf(":") + 1);
  }
  return str;
}
function getUrlVar(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) ?? void 0;
}
function isSmallScreen() {
  return window.innerWidth <= 600 || window.innerHeight <= 600;
}
function isTouchDevice() {
  return "ontouchstart" in window || "onmsgesturechange" in window || globalThis.DocumentTouch != null && document instanceof globalThis.DocumentTouch ? true : false;
}
function getTilesetFileExtension() {
  return ".png";
}
function isRightMouseSelectionSupported() {
  if (isTouchDevice()) return false;
  const ua = navigator.userAgent;
  if (ua.includes("Mac OS X") || ua.includes("CrOS")) {
    return false;
  }
  return true;
}
let benchmark_start = 0;
function civclient_benchmark(frame) {
  if (frame === 0) benchmark_start = Date.now();
  const ptile = mapPosToTile(frame + 5, frame + 5);
  center_tile_mapcanvas(ptile);
  if (frame < 30) {
    setTimeout(() => civclient_benchmark(frame + 1), 10);
  } else {
    const time = (Date.now() - benchmark_start) / 25;
    swal("Redraw time: " + time);
  }
}
Object.defineProperty(window, "benchmark_start", {
  get: () => benchmark_start,
  set: (v2) => {
    benchmark_start = v2;
  },
  configurable: true,
  enumerable: true
});
function blur_input_on_touchdevice() {
  if (document.activeElement?.blur) {
    document.activeElement.blur();
  }
}
const WRAP_X = 1;
const WRAP_Y = 2;
const TF_ISO = 1;
const TF_HEX = 2;
const T_UNKNOWN = 0;
const DIR_DX = [-1, 0, 1, -1, 1, -1, 0, 1];
const DIR_DY = [-1, -1, -1, 0, 0, 1, 1, 1];
const win$1 = window;
function getMapInfo() {
  const m2 = win$1.map;
  if (m2 && typeof m2.xsize === "number") return m2;
  return null;
}
function getTiles() {
  return win$1.tiles || {};
}
function topoHasFlag(flag) {
  return ((getMapInfo()?.topology_id ?? 0) & flag) !== 0;
}
function wrapHasFlag(flag) {
  return ((getMapInfo()?.wrap_id ?? 0) & flag) !== 0;
}
function tileInit(tile) {
  tile["known"] = null;
  tile["seen"] = {};
  tile["specials"] = [];
  tile["terrain"] = T_UNKNOWN;
  tile["units"] = [];
  tile["owner"] = null;
  tile["claimer"] = null;
  tile["worked"] = null;
  tile["spec_sprite"] = null;
  tile["goto_dir"] = null;
  tile["nuke"] = 0;
  return tile;
}
function mapAllocate() {
  const mi = getMapInfo();
  if (!mi) return;
  const newTiles = {};
  for (let x2 = 0; x2 < mi.xsize; x2++) {
    for (let y2 = 0; y2 < mi.ysize; y2++) {
      const index = x2 + y2 * mi.xsize;
      let tile = {
        index,
        x: x2,
        y: y2,
        height: 0
      };
      tile = tileInit(tile);
      newTiles[index] = tile;
    }
  }
  win$1.tiles = newTiles;
  store.tiles = newTiles;
  if (win$1.map) win$1.map["startpos_table"] = {};
  init_overview();
}
function mapInitTopology(_setSizes) {
  const m2 = win$1.map;
  if (!m2) return;
  m2.valid_dirs = {};
  m2.cardinal_dirs = {};
  m2.num_valid_dirs = 0;
  m2.num_cardinal_dirs = 0;
  for (let dir = 0; dir < 8; dir++) {
    if (isValidDir(dir)) {
      m2.valid_dirs[m2.num_valid_dirs] = dir;
      m2.num_valid_dirs++;
    }
    if (isCardinalDir(dir)) {
      m2.cardinal_dirs[m2.num_cardinal_dirs] = dir;
      m2.num_cardinal_dirs++;
    }
  }
}
function isValidDir(dir) {
  switch (dir) {
    case 7:
    case 0:
      return !(topoHasFlag(TF_HEX) && !topoHasFlag(TF_ISO));
    case 2:
    case 5:
      return !(topoHasFlag(TF_HEX) && topoHasFlag(TF_ISO));
    case 1:
    case 4:
    case 6:
    case 3:
      return true;
    default:
      return false;
  }
}
function isCardinalDir(dir) {
  switch (dir) {
    case 1:
    case 6:
    case 4:
    case 3:
      return true;
    case 7:
    case 0:
      return topoHasFlag(TF_HEX) && topoHasFlag(TF_ISO);
    case 2:
    case 5:
      return topoHasFlag(TF_HEX) && !topoHasFlag(TF_ISO);
    default:
      return false;
  }
}
function mapPosToTile(x2, y2) {
  const mi = getMapInfo();
  if (!mi) return void 0;
  const t2 = getTiles();
  if (x2 >= mi.xsize) y2 -= 1;
  else if (x2 < 0) y2 += 1;
  return t2[x2 + y2 * mi.xsize];
}
function indexToTile(index) {
  return getTiles()[index];
}
function mapstep(ptile, dir) {
  if (!isValidDir(dir)) return void 0;
  return mapPosToTile(DIR_DX[dir] + ptile.x, DIR_DY[dir] + ptile.y);
}
function nativeToMapPos(natX, natY) {
  const mi = getMapInfo();
  if (!mi) return { map_x: 0, map_y: 0 };
  const pmap_x = Math.floor((natY + (natY & 1)) / 2 + natX);
  const pmap_y = Math.floor(natY - pmap_x + mi.xsize);
  return { map_x: pmap_x, map_y: pmap_y };
}
function mapToNativePos(mapX, mapY) {
  const mi = getMapInfo();
  if (!mi) return { nat_x: 0, nat_y: 0 };
  const pnat_y = Math.floor(mapX + mapY - mi.xsize);
  const pnat_x = Math.floor((2 * mapX - pnat_y - (pnat_y & 1)) / 2);
  return { nat_x: pnat_x, nat_y: pnat_y };
}
function mapDistanceVector(tile0, tile1) {
  const mi = getMapInfo();
  if (!mi) return [0, 0];
  let dx = tile1.x - tile0.x;
  let dy = tile1.y - tile0.y;
  if (wrapHasFlag(WRAP_X)) {
    const half = Math.floor(mi.xsize / 2);
    dx = FC_WRAP(dx + half, mi.xsize) - half;
  }
  if (wrapHasFlag(WRAP_Y)) {
    const half = Math.floor(mi.ysize / 2);
    dy = FC_WRAP(dy + half, mi.ysize) - half;
  }
  return [dx, dy];
}
function mapVectorToSqDistance(dx, dy) {
  if (topoHasFlag(TF_HEX)) {
    const d2 = mapVectorToDistance(dx, dy);
    return d2 * d2;
  }
  return dx * dx + dy * dy;
}
function mapVectorToDistance(dx, dy) {
  if (topoHasFlag(TF_HEX)) {
    if (topoHasFlag(TF_ISO)) {
      if (dx < 0 && dy > 0 || dx > 0 && dy < 0) {
        return Math.abs(dx) + Math.abs(dy);
      }
      return Math.max(Math.abs(dx), Math.abs(dy));
    }
    if (dx > 0 && dy > 0 || dx < 0 && dy < 0) {
      return Math.abs(dx) + Math.abs(dy);
    }
    return Math.max(Math.abs(dx), Math.abs(dy));
  }
  return Math.max(Math.abs(dx), Math.abs(dy));
}
function dirCW(dir) {
  return (dir + 1) % 8;
}
function dirCCW(dir) {
  return (dir + 7) % 8;
}
function clearGotoTiles() {
  const mi = getMapInfo();
  if (!mi) return;
  const t2 = getTiles();
  for (let x2 = 0; x2 < mi.xsize; x2++) {
    for (let y2 = 0; y2 < mi.ysize; y2++) {
      const tile = t2[x2 + y2 * mi.xsize];
      if (tile) tile.goto_dir = null;
    }
  }
}
win$1["map_init_topology"] = mapInitTopology;
win$1["map_allocate"] = mapAllocate;
function universalBuildShieldCost(_pcity, target) {
  return target["build_cost"];
}
const FEELING_FINAL = 5;
const INCITE_IMPOSSIBLE_COST = 1e3 * 1e3 * 1e3;
let cityTileMap = null;
function cityTile(pcity) {
  if (pcity == null) return null;
  return indexToTile(pcity["tile"]);
}
function cityOwnerPlayerId(pcity) {
  if (pcity == null) return null;
  return pcity["owner"];
}
function cityOwner(pcity) {
  return store.players[cityOwnerPlayerId(pcity)];
}
function removeCity(pcityId) {
  if (pcityId == null || clientPlaying() == null) return;
  const pcity = store.cities[pcityId];
  if (pcity == null) return;
  const update = clientPlaying()?.playerno && cityOwner(pcity).playerno === clientPlaying()?.playerno;
  cityTile(store.cities[pcityId]);
  delete store.cities[pcityId];
  if (update) {
    city_screen_updater?.update();
    bulbs_output_updater?.update();
  }
}
function getCityProductionTypeSprite(pcity) {
  if (pcity == null) return null;
  if (pcity["production_kind"] === VUT_UTYPE) {
    const punitType = store.unitTypes[pcity["production_value"]];
    return {
      type: punitType,
      sprite: get_unit_type_image_sprite(punitType)
    };
  }
  if (pcity["production_kind"] === VUT_IMPROVEMENT) {
    const improvement = store.improvements[pcity["production_value"]];
    return {
      type: improvement,
      sprite: get_improvement_image_sprite(improvement)
    };
  }
  return null;
}
function getCityProductionType(pcity) {
  if (pcity == null) return null;
  if (pcity["production_kind"] === VUT_UTYPE) {
    return store.unitTypes[pcity["production_value"]];
  }
  if (pcity["production_kind"] === VUT_IMPROVEMENT) {
    return store.improvements[pcity["production_value"]];
  }
  return null;
}
function cityTurnsToBuild(pcity, target, includeShieldStock) {
  const citySurplus = pcity["surplus"][O_SHIELD$1];
  const cityStock = pcity["shield_stock"];
  const cost = universalBuildShieldCost(pcity, target);
  if (pcity["shield_stock"] >= cost) {
    return 1;
  } else if (pcity["surplus"][O_SHIELD$1] > 0) {
    return Math.floor((cost - cityStock - 1) / citySurplus + 1);
  } else {
    return FC_INFINITY;
  }
}
function getCityProductionTime(pcity) {
  if (pcity == null) return FC_INFINITY;
  if (pcity["production_kind"] === VUT_UTYPE) {
    const punitType = store.unitTypes[pcity["production_value"]];
    return cityTurnsToBuild(pcity, punitType);
  }
  if (pcity["production_kind"] === VUT_IMPROVEMENT) {
    const improvement = store.improvements[pcity["production_value"]];
    if (improvement["name"] === "Coinage") {
      return FC_INFINITY;
    }
    return cityTurnsToBuild(pcity, improvement);
  }
  return FC_INFINITY;
}
function getProductionProgress(pcity) {
  if (pcity == null) return " ";
  if (pcity["production_kind"] === VUT_UTYPE) {
    const punitType = store.unitTypes[pcity["production_value"]];
    return pcity["shield_stock"] + "/" + universalBuildShieldCost(pcity, punitType);
  }
  if (pcity["production_kind"] === VUT_IMPROVEMENT) {
    const improvement = store.improvements[pcity["production_value"]];
    if (improvement["name"] === "Coinage") {
      return " ";
    }
    return pcity["shield_stock"] + "/" + universalBuildShieldCost(pcity, improvement);
  }
  return " ";
}
function generateProductionList() {
  const productionList = [];
  for (const unitTypeId in store.unitTypes) {
    const punitType = store.unitTypes[unitTypeId];
    if (punitType["name"] === "Barbarian Leader" || punitType["name"] === "Leader")
      continue;
    productionList.push({
      kind: VUT_UTYPE,
      value: punitType["id"],
      text: punitType["name"],
      helptext: punitType["helptext"],
      rule_name: punitType["rule_name"],
      build_cost: punitType["build_cost"],
      unit_details: punitType["attack_strength"] + ", " + punitType["defense_strength"] + ", " + punitType["firepower"],
      sprite: get_unit_type_image_sprite(punitType)
    });
  }
  for (const improvementId in store.improvements) {
    const pimprovement = store.improvements[improvementId];
    let buildCost = pimprovement["build_cost"];
    if (pimprovement["name"] === "Coinage") buildCost = "-";
    productionList.push({
      kind: VUT_IMPROVEMENT,
      value: pimprovement["id"],
      text: pimprovement["name"],
      helptext: pimprovement["helptext"],
      rule_name: pimprovement["rule_name"],
      build_cost: buildCost,
      unit_details: "-",
      sprite: get_improvement_image_sprite(pimprovement)
    });
  }
  return productionList;
}
function canCityBuildUnitNow(pcity, punittypeId) {
  return pcity != null && typeof pcity["can_build_unit"] !== "undefined" && pcity["can_build_unit"].isSet(punittypeId);
}
function canCityBuildImprovementNow(pcity, pimproveId) {
  return pcity != null && typeof pcity["can_build_improvement"] !== "undefined" && pcity["can_build_improvement"].isSet(pimproveId);
}
function canCityBuildNow(pcity, kind, value) {
  return kind != null && value != null && (kind === VUT_UTYPE ? canCityBuildUnitNow(pcity, value) : canCityBuildImprovementNow(pcity, value));
}
function cityHasBuilding(pcity, improvementId) {
  return 0 <= improvementId && improvementId < store.rulesControl.num_impr_types && pcity["improvements"] && pcity["improvements"].isSet(improvementId);
}
function doesCityHaveImprovement(pcity, improvementName) {
  if (pcity == null || pcity["improvements"] == null) return false;
  for (let z2 = 0; z2 < store.rulesControl.num_impr_types; z2++) {
    if (pcity["improvements"] != null && pcity["improvements"].isSet(z2) && store.improvements[z2] != null && store.improvements[z2]["name"] === improvementName) {
      return true;
    }
  }
  return false;
}
function cityTurnsToGrowthText(pcity) {
  const turns = pcity["granary_turns"];
  if (turns === 0) {
    return "blocked";
  } else if (turns > 1e6) {
    return "never";
  } else if (turns < 0) {
    return "Starving in " + Math.abs(turns) + " turns";
  } else {
    return turns + " turns";
  }
}
function cityUnhappy(pcity) {
  return pcity["ppl_happy"][FEELING_FINAL] < pcity["ppl_unhappy"][FEELING_FINAL] + 2 * pcity["ppl_angry"][FEELING_FINAL];
}
function cityPopulation(pcity) {
  return pcity["size"] * (pcity["size"] + 1) * 5;
}
function dxyToCenterIndex(dx, dy, r2) {
  return (dx + r2) * (2 * r2 + 1) + dy + r2;
}
function getCityDxyToIndex(dx, dy, pcity) {
  buildCityTileMap(pcity.city_radius_sq);
  const cityTileMapIndex = dxyToCenterIndex(dx, dy, cityTileMap.radius);
  const ctile = cityTile(active_city);
  return getCityTileMapForPos(ctile.x, ctile.y)[cityTileMapIndex];
}
function buildCityTileMap(radiusSq) {
  if (cityTileMap == null || cityTileMap.radius_sq < radiusSq) {
    const r2 = Math.floor(Math.sqrt(radiusSq));
    const vectors = [];
    for (let dx = -r2; dx <= r2; dx++) {
      for (let dy = -r2; dy <= r2; dy++) {
        const dSq = mapVectorToSqDistance(dx, dy);
        if (dSq <= radiusSq) {
          vectors.push([dx, dy, dSq, dxyToCenterIndex(dx, dy, r2)]);
        }
      }
    }
    vectors.sort(function(a2, b2) {
      let d2 = a2[2] - b2[2];
      if (d2 !== 0) return d2;
      d2 = a2[0] - b2[0];
      if (d2 !== 0) return d2;
      return a2[1] - b2[1];
    });
    const baseMap = [];
    for (let i2 = 0; i2 < vectors.length; i2++) {
      baseMap[vectors[i2][3]] = i2;
    }
    cityTileMap = {
      radius_sq: radiusSq,
      radius: r2,
      base_sorted: vectors,
      maps: [baseMap]
    };
    window.city_tile_map = cityTileMap;
  }
}
function deltaTileHelper(pos, r2, size) {
  const dMin = -pos;
  const dMax = size - 1 - pos;
  let i2 = 0;
  if (dMin > -r2) {
    i2 = r2 + dMin;
  } else if (dMax < r2) {
    i2 = 2 * r2 - dMax;
  }
  return [dMin, dMax, i2];
}
function buildCityTileMapWithLimits(dxMin, dxMax, dyMin, dyMax) {
  const clippedMap = [];
  const v2 = cityTileMap.base_sorted;
  const vl = v2.length;
  let index = 0;
  for (let vi = 0; vi < vl; vi++) {
    const tileData = v2[vi];
    if (tileData[0] >= dxMin && tileData[0] <= dxMax && tileData[1] >= dyMin && tileData[1] <= dyMax) {
      clippedMap[tileData[3]] = index;
      index++;
    }
  }
  return clippedMap;
}
let getCityTileMapForPos = function(x2, y2) {
  if (wrapHasFlag(WRAP_X)) {
    if (wrapHasFlag(WRAP_Y)) {
      getCityTileMapForPos = function(_x, _y) {
        return cityTileMap.maps[0];
      };
    } else {
      getCityTileMapForPos = function(_x, y22) {
        const r2 = cityTileMap.radius;
        const d2 = deltaTileHelper(y22, r2, getMapInfo().ysize);
        if (cityTileMap.maps[d2[2]] == null) {
          const m2 = buildCityTileMapWithLimits(-r2, r2, d2[0], d2[1]);
          cityTileMap.maps[d2[2]] = m2;
        }
        return cityTileMap.maps[d2[2]];
      };
    }
  } else {
    if (wrapHasFlag(WRAP_Y)) {
      getCityTileMapForPos = function(x22, _y) {
        const r2 = cityTileMap.radius;
        const d2 = deltaTileHelper(x22, r2, getMapInfo().xsize);
        if (cityTileMap.maps[d2[2]] == null) {
          const m2 = buildCityTileMapWithLimits(d2[0], d2[1], -r2, r2);
          cityTileMap.maps[d2[2]] = m2;
        }
        return cityTileMap.maps[d2[2]];
      };
    } else {
      getCityTileMapForPos = function(x22, y22) {
        const r2 = cityTileMap.radius;
        const dx = deltaTileHelper(x22, r2, getMapInfo().xsize);
        const dy = deltaTileHelper(y22, r2, getMapInfo().ysize);
        const mapI = (2 * r2 + 1) * dx[2] + dy[2];
        if (cityTileMap.maps[mapI] == null) {
          const m2 = buildCityTileMapWithLimits(dx[0], dx[1], dy[0], dy[1]);
          cityTileMap.maps[mapI] = m2;
        }
        return cityTileMap.maps[mapI];
      };
    }
  }
  return getCityTileMapForPos(x2, y2);
};
function game_init() {
  store.mapInfo = {};
  store.terrains = {};
  window.resources = {};
  store.players = {};
  store.units = {};
  store.unitTypes = {};
  store.connections = {};
  store.client.conn = {};
}
function game_find_city_by_number(id) {
  return store.cities[id];
}
function game_find_unit_by_number(id) {
  return store.units[id];
}
function civ_population(playerno) {
  let population = 0;
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    if (playerno === pcity["owner"]) {
      population += cityPopulation(pcity);
    }
  }
  return numberWithCommas(population * 1e3);
}
function update_game_status_panel() {
  if (C_S_RUNNING !== clientState()) return;
  let status_html = "";
  if (clientPlaying() != null) {
    const pplayer = clientPlaying();
    const tax2 = clientPlaying()["tax"];
    const lux2 = clientPlaying()["luxury"];
    const sci2 = clientPlaying()["science"];
    let net_income = pplayer["expected_income"];
    if (pplayer["expected_income"] > 0) {
      net_income = "+" + pplayer["expected_income"];
    }
    if (!is_small_screen())
      status_html += "<b>" + store.nations[pplayer["nation"]]["adjective"] + "</b> &nbsp;&nbsp; <span title='Population'>👤</span>: ";
    if (!is_small_screen())
      status_html += "<b>" + civ_population(clientPlaying().playerno) + "</b>  &nbsp;&nbsp;";
    if (!is_small_screen())
      status_html += "<span title='Year (turn)'>🕐</span>: <b>" + get_year_string() + "</b> &nbsp;&nbsp;";
    status_html += "<span title='Gold (net income)'>💰</span>: ";
    if (pplayer["expected_income"] >= 0) {
      status_html += "<b title='Gold (net income)'>";
    } else {
      status_html += "<b class='negative_net_income' title='Gold (net income)'>";
    }
    status_html += pplayer["gold"] + " (" + net_income + ")</b>  &nbsp;&nbsp;";
    status_html += "<span style='cursor:pointer;' onclick='javascript:show_tax_rates_dialog();'><span title='Tax rate'>📊</span>: <b>" + tax2 + "</b>% ";
    status_html += "<span title='Luxury rate'>🎵</span>: <b>" + lux2 + "</b>% ";
    status_html += "<span title='Science rate'>🧪</span>: <b>" + sci2 + "</b>%</span> ";
  } else if (store.serverSettings != null && store.serverSettings["metamessage"] != null) {
    status_html += store.serverSettings["metamessage"]["val"] + " Observing - ";
    status_html += "Turn: <b>" + store.gameInfo["turn"] + "</b>  ";
  }
  const panelTop = document.getElementById("game_status_panel_top");
  const panelBottom = document.getElementById("game_status_panel_bottom");
  if (window.innerWidth - sum_width() > 800) {
    if (panelTop) {
      panelTop.style.display = "";
      panelTop.innerHTML = status_html;
    }
    if (panelBottom) {
      panelBottom.style.display = "none";
    }
  } else {
    if (panelTop) {
      panelTop.style.display = "none";
    }
    if (panelBottom) {
      panelBottom.style.display = "";
      panelBottom.style.width = window.innerWidth + "px";
      panelBottom.innerHTML = status_html;
    }
  }
  let page_title = "XBWorld - " + store.username + "  (turn:" + store.gameInfo["turn"] + ", port:" + window.civserverport + ") ";
  if (store.serverSettings["metamessage"] != null) {
    page_title += store.serverSettings["metamessage"]["val"];
  }
  document.title = page_title;
}
function get_year_string() {
  let year_string = "";
  if (store.gameInfo["year"] < 0) {
    year_string = Math.abs(store.gameInfo["year"]) + store.calendarInfo["negative_year_label"] + " ";
  } else if (store.gameInfo["year"] >= 0) {
    year_string = store.gameInfo["year"] + store.calendarInfo["positive_year_label"] + " ";
  }
  if (is_small_screen()) {
    year_string += "(T:" + store.gameInfo["turn"] + ")";
  } else {
    year_string += "(Turn:" + store.gameInfo["turn"] + ")";
  }
  return year_string;
}
function sum_width() {
  let sum = 0;
  const tabsMenu = document.getElementById("tabs_menu");
  if (tabsMenu) {
    for (const child of Array.from(tabsMenu.children)) {
      if (child.offsetParent !== null && child.id !== "game_status_panel_top") {
        sum += child.offsetWidth;
      }
    }
  }
  return sum;
}
if (window["game_info"] === void 0) window["game_info"] = null;
if (window["calendar_info"] === void 0) window["calendar_info"] = null;
if (window["game_rules"] === void 0) window["game_rules"] = null;
if (window["ruleset_control"] === void 0) window["ruleset_control"] = null;
if (window["ruleset_summary"] === void 0) window["ruleset_summary"] = null;
if (window["ruleset_description"] === void 0) window["ruleset_description"] = null;
const _$ = window.jQuery;
if (!_$) throw new Error("jqueryUiShim requires jQuery");
const dialogStore = /* @__PURE__ */ new WeakMap();
function createDialogWrapper(el, options) {
  const wrapper = document.createElement("div");
  wrapper.className = "ui-dialog ui-widget ui-widget-content ui-corner-all ui-front";
  wrapper.style.cssText = "position:fixed;z-index:10001;display:none;";
  const w2 = options.width || 300;
  wrapper.style.width = typeof w2 === "number" ? w2 + "px" : w2;
  if (options.height && options.height !== "auto") {
    wrapper.style.height = typeof options.height === "number" ? options.height + "px" : options.height;
  }
  if (options.maxHeight) {
    wrapper.style.maxHeight = options.maxHeight + "px";
  }
  const titleBar = document.createElement("div");
  titleBar.className = "ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
  titleBar.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:4px 8px;cursor:move;user-select:none;";
  const titleSpan = document.createElement("span");
  titleSpan.className = "ui-dialog-title";
  titleSpan.textContent = el.getAttribute("title") || el.title || "";
  titleBar.appendChild(titleSpan);
  const closeBtn = document.createElement("button");
  closeBtn.className = "ui-dialog-titlebar-close";
  closeBtn.textContent = "×";
  closeBtn.style.cssText = "background:none;border:none;color:#ccc;font-size:18px;cursor:pointer;padding:0 4px;";
  closeBtn.addEventListener("click", () => dialogAction(el, "close"));
  titleBar.appendChild(closeBtn);
  let dragging = false;
  let dragOff = { x: 0, y: 0 };
  titleBar.addEventListener("pointerdown", (e2) => {
    dragging = true;
    dragOff = { x: e2.clientX - wrapper.offsetLeft, y: e2.clientY - wrapper.offsetTop };
    titleBar.setPointerCapture(e2.pointerId);
  });
  titleBar.addEventListener("pointermove", (e2) => {
    if (!dragging) return;
    wrapper.style.left = e2.clientX - dragOff.x + "px";
    wrapper.style.top = e2.clientY - dragOff.y + "px";
  });
  titleBar.addEventListener("pointerup", () => {
    dragging = false;
  });
  const content = document.createElement("div");
  content.className = "ui-dialog-content ui-widget-content";
  content.style.cssText = "overflow:auto;padding:8px;";
  content.appendChild(el);
  const buttonPane = document.createElement("div");
  buttonPane.className = "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix";
  buttonPane.style.cssText = "padding:4px 8px;text-align:right;";
  if (options.buttons) {
    const btns = Array.isArray(options.buttons) ? options.buttons : Object.entries(options.buttons).map(([text, click]) => ({ text, click }));
    for (const btn of btns) {
      const b2 = document.createElement("button");
      b2.className = "ui-button ui-widget";
      b2.textContent = btn.text || "";
      b2.addEventListener("click", btn.click);
      b2.style.cssText = "margin-left:4px;padding:4px 12px;cursor:pointer;";
      buttonPane.appendChild(b2);
    }
  }
  wrapper.appendChild(titleBar);
  wrapper.appendChild(content);
  wrapper.appendChild(buttonPane);
  document.body.appendChild(wrapper);
  const data = { wrapper, titleBar, buttonPane, options };
  dialogStore.set(el, data);
  return data;
}
function dialogAction(el, action) {
  const data = dialogStore.get(el);
  if (!data) return;
  if (action === "open") {
    data.wrapper.style.display = "";
    const rect = data.wrapper.getBoundingClientRect();
    data.wrapper.style.left = Math.max(0, (window.innerWidth - rect.width) / 2) + "px";
    data.wrapper.style.top = Math.max(0, (window.innerHeight - rect.height) / 3) + "px";
    if (data.options.modal) {
      let overlay = document.getElementById("xb-ui-dialog-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "xb-ui-dialog-overlay";
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;";
        document.body.appendChild(overlay);
      }
      overlay.style.display = "";
    }
  } else if (action === "close") {
    data.wrapper.style.display = "none";
    const overlay = document.getElementById("xb-ui-dialog-overlay");
    if (overlay) overlay.style.display = "none";
    if (data.options.close) data.options.close();
  }
}
_$.fn.dialog = function(optionsOrAction, ...args) {
  return this.each(function() {
    if (typeof optionsOrAction === "string") {
      dialogAction(this, optionsOrAction);
    } else {
      let data = dialogStore.get(this);
      if (data) {
        data.wrapper.remove();
        dialogStore.delete(this);
      }
      data = createDialogWrapper(this, optionsOrAction || {});
      if (optionsOrAction?.autoOpen !== false) {
        dialogAction(this, "open");
      }
    }
  });
};
_$.fn.dialogExtend = function() {
  return this;
};
_$.fn.tooltip = function() {
  return this;
};
_$.fn.button = function(opts) {
  if (!opts || typeof opts !== "object") return this;
  return this.each(function() {
    if (opts.label) this.textContent = opts.label;
    if (opts.disabled === true) this.disabled = true;
    else if (opts.disabled === false) this.disabled = false;
  });
};
_$.fn.menu = function() {
  return this;
};
_$.fn.selectable = function() {
  return this;
};
_$.fn.tabs = function() {
  return this;
};
const DEFAULT_OPTIONS = {
  title: "",
  width: 300,
  height: "auto",
  modal: true,
  draggable: true,
  resizable: true,
  closable: true,
  closeOnEscape: true,
  minimizable: false,
  maximizable: false
};
const activeDialogs = /* @__PURE__ */ new Set();
let topZIndex = 1e3;
class GameDialog {
  el;
  wrapper;
  titleBar;
  titleText;
  buttonBar = null;
  contentEl;
  options;
  _state = "normal";
  savedRect = null;
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  constructor(selector, options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    if (typeof selector === "string") {
      const found = document.querySelector(selector);
      if (!found) throw new Error(`GameDialog: element not found: ${selector}`);
      this.el = found;
    } else {
      this.el = selector;
    }
    this.wrapper = document.createElement("dialog");
    this.wrapper.className = "game-dialog" + (this.options.dialogClass ? " " + this.options.dialogClass : "");
    this.wrapper.setAttribute("role", "dialog");
    this.titleBar = document.createElement("div");
    this.titleBar.className = "game-dialog-titlebar";
    this.titleText = document.createElement("span");
    this.titleText.className = "game-dialog-title";
    this.titleText.textContent = this.options.title || "";
    this.titleBar.appendChild(this.titleText);
    const titleButtons = document.createElement("div");
    titleButtons.className = "game-dialog-titlebar-buttons";
    if (this.options.minimizable) {
      const minBtn = this._createTitleButton("_", "game-dialog-btn-minimize", () => this.minimize());
      titleButtons.appendChild(minBtn);
    }
    if (this.options.maximizable) {
      const maxBtn = this._createTitleButton("□", "game-dialog-btn-maximize", () => this.toggleMaximize());
      titleButtons.appendChild(maxBtn);
    }
    if (this.options.closable !== false) {
      const closeBtn = this._createTitleButton("×", "game-dialog-btn-close", () => this.close());
      titleButtons.appendChild(closeBtn);
    }
    this.titleBar.appendChild(titleButtons);
    this.wrapper.appendChild(this.titleBar);
    this.contentEl = document.createElement("div");
    this.contentEl.className = "game-dialog-content";
    this.contentEl.appendChild(this.el);
    this.el.style.display = "";
    this.wrapper.appendChild(this.contentEl);
    if (this.options.buttons) {
      this.buttonBar = document.createElement("div");
      this.buttonBar.className = "game-dialog-buttonpane";
      this._renderButtons();
      this.wrapper.appendChild(this.buttonBar);
    }
    if (this.options.width) {
      this.wrapper.style.width = typeof this.options.width === "number" ? `${this.options.width}px` : this.options.width;
    }
    if (this.options.height && this.options.height !== "auto") {
      this.wrapper.style.height = typeof this.options.height === "number" ? `${this.options.height}px` : String(this.options.height);
    }
    if (this.options.resizable) {
      this.wrapper.style.resize = "both";
      this.wrapper.style.overflow = "auto";
    }
    if (this.options.draggable) {
      this._setupDrag();
    }
    if (this.options.closeOnEscape) {
      this.wrapper.addEventListener("keydown", (e2) => {
        if (e2.key === "Escape") {
          e2.preventDefault();
          this.close();
        }
      });
      this.wrapper.addEventListener("cancel", (e2) => {
        e2.preventDefault();
        this.close();
      });
    }
    this.wrapper.addEventListener("mousedown", () => this._bringToFront());
    document.body.appendChild(this.wrapper);
  }
  /** Current dialog state */
  get state() {
    return this._state;
  }
  /** The underlying <dialog> element */
  get widget() {
    return this.wrapper;
  }
  /** Open the dialog */
  open() {
    if (this.options.modal) {
      this.wrapper.showModal();
    } else {
      this.wrapper.show();
    }
    this._bringToFront();
    this._applyPosition();
    activeDialogs.add(this);
    this.options.onOpen?.();
  }
  /** Close the dialog */
  close() {
    if (this.options.onBeforeClose && this.options.onBeforeClose() === false) {
      return;
    }
    this.wrapper.close();
    activeDialogs.delete(this);
    this.options.onClose?.();
  }
  /** Minimize to title bar only */
  minimize() {
    if (this._state === "minimized") return;
    this.savedRect = {
      width: this.wrapper.style.width,
      height: this.wrapper.style.height,
      top: this.wrapper.style.top,
      left: this.wrapper.style.left
    };
    this.contentEl.style.display = "none";
    if (this.buttonBar) this.buttonBar.style.display = "none";
    this.wrapper.style.height = "auto";
    this.wrapper.style.resize = "none";
    this._state = "minimized";
    this.wrapper.classList.add("game-dialog-minimized");
    this.wrapper.classList.remove("game-dialog-maximized");
    this.options.onMinimize?.();
  }
  /** Restore from minimized or maximized state */
  restore() {
    if (this._state === "normal") return;
    this.contentEl.style.display = "";
    if (this.buttonBar) this.buttonBar.style.display = "";
    if (this.savedRect) {
      this.wrapper.style.width = this.savedRect.width;
      this.wrapper.style.height = this.savedRect.height;
      this.wrapper.style.top = this.savedRect.top;
      this.wrapper.style.left = this.savedRect.left;
    }
    if (this.options.resizable) {
      this.wrapper.style.resize = "both";
    }
    this._state = "normal";
    this.wrapper.classList.remove("game-dialog-minimized", "game-dialog-maximized");
    this.options.onRestore?.();
  }
  /** Maximize to fill the viewport */
  maximize() {
    if (this._state === "maximized") return;
    if (this._state !== "minimized") {
      this.savedRect = {
        width: this.wrapper.style.width,
        height: this.wrapper.style.height,
        top: this.wrapper.style.top,
        left: this.wrapper.style.left
      };
    }
    this.contentEl.style.display = "";
    if (this.buttonBar) this.buttonBar.style.display = "";
    this.wrapper.style.width = "100vw";
    this.wrapper.style.height = "100vh";
    this.wrapper.style.top = "0";
    this.wrapper.style.left = "0";
    this.wrapper.style.resize = "none";
    this._state = "maximized";
    this.wrapper.classList.add("game-dialog-maximized");
    this.wrapper.classList.remove("game-dialog-minimized");
    this.options.onMaximize?.();
  }
  /** Toggle between maximized and normal */
  toggleMaximize() {
    if (this._state === "maximized") {
      this.restore();
    } else {
      this.maximize();
    }
  }
  /** Update the title text */
  setTitle(title) {
    this.titleText.textContent = title;
  }
  /** Set a dialog option dynamically */
  setOption(key, value) {
    this.options[key] = value;
    if (key === "title") this.setTitle(value);
    if (key === "draggable") {
      if (value) this._setupDrag();
    }
    if (key === "width") {
      this.wrapper.style.width = typeof value === "number" ? `${value}px` : String(value);
    }
    if (key === "height") {
      this.wrapper.style.height = typeof value === "number" ? `${value}px` : String(value);
    }
  }
  /** Destroy the dialog and restore the original element */
  destroy() {
    activeDialogs.delete(this);
    if (this.wrapper.open) this.wrapper.close();
    this.wrapper.parentNode?.insertBefore(this.el, this.wrapper);
    this.wrapper.remove();
  }
  /** Check if dialog is open */
  isOpen() {
    return this.wrapper.open;
  }
  // --- Private helpers ---
  _createTitleButton(text, className, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `game-dialog-titlebar-btn ${className}`;
    btn.textContent = text;
    btn.addEventListener("click", (e2) => {
      e2.stopPropagation();
      onClick();
    });
    return btn;
  }
  _renderButtons() {
    if (!this.buttonBar || !this.options.buttons) return;
    this.buttonBar.innerHTML = "";
    if (Array.isArray(this.options.buttons)) {
      for (const btn of this.options.buttons) {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "game-dialog-btn";
        el.textContent = btn.text;
        el.addEventListener("click", btn.click);
        this.buttonBar.appendChild(el);
      }
    } else {
      for (const [text, click] of Object.entries(this.options.buttons)) {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "game-dialog-btn";
        el.textContent = text;
        el.addEventListener("click", click);
        this.buttonBar.appendChild(el);
      }
    }
  }
  _setupDrag() {
    this.titleBar.style.cursor = "move";
    this.titleBar.addEventListener("mousedown", (e2) => {
      if (e2.target.tagName === "BUTTON") return;
      this.isDragging = true;
      const rect = this.wrapper.getBoundingClientRect();
      this.dragOffset.x = e2.clientX - rect.left;
      this.dragOffset.y = e2.clientY - rect.top;
      e2.preventDefault();
    });
    document.addEventListener("mousemove", (e2) => {
      if (!this.isDragging) return;
      const x2 = e2.clientX - this.dragOffset.x;
      const y2 = e2.clientY - this.dragOffset.y;
      this.wrapper.style.left = `${x2}px`;
      this.wrapper.style.top = `${y2}px`;
      this.wrapper.style.margin = "0";
    });
    document.addEventListener("mouseup", () => {
      this.isDragging = false;
    });
  }
  _bringToFront() {
    topZIndex++;
    this.wrapper.style.zIndex = String(topZIndex);
  }
  _applyPosition() {
    const pos = this.options.position;
    if (!pos) return;
    const target = pos.of || window;
    pos.within || document.documentElement;
    let targetRect;
    if (target === window) {
      targetRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    } else {
      targetRect = target.getBoundingClientRect();
    }
    const dialogRect = this.wrapper.getBoundingClientRect();
    const myParts = (pos.my || "center").split(" ");
    const atParts = (pos.at || "center").split(" ");
    let atX = targetRect.left + targetRect.width / 2;
    let atY = targetRect.top + targetRect.height / 2;
    if (atParts[0] === "left") atX = targetRect.left;
    else if (atParts[0] === "right") atX = targetRect.right;
    if (atParts.length > 1) {
      if (atParts[1] === "top") atY = targetRect.top;
      else if (atParts[1] === "bottom") atY = targetRect.bottom;
    }
    let offsetX = -dialogRect.width / 2;
    let offsetY = -dialogRect.height / 2;
    if (myParts[0] === "left") offsetX = 0;
    else if (myParts[0] === "right") offsetX = -dialogRect.width;
    if (myParts.length > 1) {
      if (myParts[1] === "top") offsetY = 0;
      else if (myParts[1] === "bottom") offsetY = -dialogRect.height;
    }
    this.wrapper.style.left = `${atX + offsetX}px`;
    this.wrapper.style.top = `${atY + offsetY}px`;
    this.wrapper.style.margin = "0";
  }
}
function exposeGameDialog() {
  window.GameDialog = GameDialog;
}
let gotoActive = false;
let focusedUnitId = null;
const HOTKEYS = {
  g: activateGoto,
  x: () => sendUnitOrder("explore"),
  f: () => sendUnitOrder("fortify"),
  b: () => sendUnitOrder("build_city"),
  s: () => sendUnitOrder("sentry"),
  r: () => sendUnitOrder("road"),
  i: () => sendUnitOrder("irrigate"),
  m: () => sendUnitOrder("mine"),
  a: () => sendUnitOrder("auto_work"),
  w: () => sendUnitOrder("wait"),
  " ": advanceUnitFocus
};
function initControls() {
  on(document, "keydown", handleKeyDown);
  globalEvents.on("map:tileclick", (data) => {
    if (!data) return;
    if (gotoActive && focusedUnitId != null) {
      sendGoto(focusedUnitId, data.tile.index);
      gotoActive = false;
    } else {
      handleTileClick(data.tile.index);
    }
  });
  globalEvents.on("unit:focus", (unitId) => {
    if (unitId != null) focusedUnitId = unitId;
  });
  setupOrderButtons();
}
function handleKeyDown(e2) {
  if (e2.target instanceof HTMLInputElement || e2.target instanceof HTMLTextAreaElement) return;
  const key = e2.key.toLowerCase();
  if (e2.shiftKey && key === "enter" && !clientIsObserver()) {
    send_message("/turn done");
    return;
  }
  const handler = HOTKEYS[key];
  if (handler) {
    e2.preventDefault();
    handler();
  }
}
function activateGoto() {
  gotoActive = true;
  globalEvents.emit("ui:goto:active", true);
}
function sendUnitOrder(order) {
  if (clientIsObserver() || focusedUnitId == null) return;
  const unit = store.units[focusedUnitId];
  if (!unit) return;
  const packet = {
    pid: 62,
    unit_id: focusedUnitId,
    order
  };
  send_request(JSON.stringify(packet));
}
function sendGoto(unitId, tileIndex) {
  if (clientIsObserver()) return;
  const packet = {
    pid: 59,
    unit_id: unitId,
    dest_tile: tileIndex
  };
  send_request(JSON.stringify(packet));
}
function handleTileClick(tileIndex) {
  const tile = store.tiles[tileIndex];
  if (!tile) return;
  const unitsOnTile = Object.values(store.units).filter((u2) => u2.tile === tileIndex);
  const myUnits = unitsOnTile.filter((u2) => u2.owner === clientPlaying()?.playerno);
  if (myUnits.length > 0) {
    focusedUnitId = myUnits[0].id;
    globalEvents.emit("unit:focus", focusedUnitId);
  } else {
    globalEvents.emit("tile:selected", tileIndex);
  }
}
function advanceUnitFocus() {
  const myPlayerno = clientPlaying()?.playerno;
  if (myPlayerno == null) return;
  const myUnits = Object.values(store.units).filter(
    (u2) => u2.owner === myPlayerno && !u2.done_moving && u2.movesleft > 0
  );
  if (myUnits.length === 0) return;
  const currentIdx = myUnits.findIndex((u2) => u2.id === focusedUnitId);
  const next = myUnits[(currentIdx + 1) % myUnits.length];
  focusedUnitId = next.id;
  globalEvents.emit("unit:focus", focusedUnitId);
}
function setupOrderButtons() {
  const orders = {
    order_goto: activateGoto,
    order_explore: () => sendUnitOrder("explore"),
    order_fortify: () => sendUnitOrder("fortify"),
    order_sentry: () => sendUnitOrder("sentry"),
    order_build_city: () => sendUnitOrder("build_city"),
    order_road: () => sendUnitOrder("road"),
    order_irrigate: () => sendUnitOrder("irrigate"),
    order_mine: () => sendUnitOrder("mine"),
    order_auto_workers: () => sendUnitOrder("auto_work"),
    order_disband: () => sendUnitOrder("disband"),
    order_pillage: () => sendUnitOrder("pillage")
  };
  for (const [id, handler] of Object.entries(orders)) {
    const el = $id(id);
    if (el) on(el, "click", handler);
  }
}
function checkedById(id) {
  const el = document.getElementById(id);
  return el ? el.checked : false;
}
let _cma_val_sliders = [1, 0, 0, 0, 0, 0];
let _cma_min_sliders = [0, 0, 0, 0, 0, 0];
let _cma_happy_slider = 0;
let _cma_celebrate = false;
let _cma_allow_disorder = false;
let _cma_max_growth = false;
let _cma_allow_specialists = true;
function request_new_cma(city_id) {
  const cm_parameter = {};
  const cmaIds = ["cma_food", "cma_shield", "cma_trade", "cma_gold", "cma_luxury", "cma_science"];
  for (let i2 = 0; i2 < cmaIds.length; i2++) {
    _cma_val_sliders[i2] = checkedById(cmaIds[i2]) ? 6 : 0;
  }
  cm_parameter["minimal_surplus"] = [..._cma_min_sliders];
  cm_parameter["require_happy"] = _cma_celebrate;
  cm_parameter["allow_disorder"] = _cma_allow_disorder;
  cm_parameter["max_growth"] = _cma_max_growth;
  cm_parameter["allow_specialists"] = _cma_allow_specialists;
  cm_parameter["factor"] = [..._cma_val_sliders];
  cm_parameter["happy_factor"] = _cma_happy_slider;
  const cma_disabled = !cmaIds.some((id) => checkedById(id));
  if (!cma_disabled) {
    sendCmaSet(city_id, cm_parameter);
  } else {
    sendCmaClear(city_id);
  }
}
function button_pushed_toggle_cma() {
  request_new_cma(active_city["id"]);
}
const w = window;
w["button_pushed_toggle_cma"] = button_pushed_toggle_cma;
w["show_city_dialog_by_id"] = show_city_dialog_by_id;
w["city_change_specialist"] = city_change_specialist;
w["city_dialog_activate_unit"] = city_dialog_activate_unit;
w["city_sell_improvement"] = city_sell_improvement;
w["city_change_production"] = city_change_production;
w["city_add_to_worklist"] = city_add_to_worklist;
w["city_exchange_worklist_task"] = city_exchange_worklist_task;
w["city_insert_in_worklist"] = city_insert_in_worklist;
w["city_worklist_task_down"] = city_worklist_task_down;
w["city_worklist_task_remove"] = city_worklist_task_remove;
w["city_worklist_task_up"] = city_worklist_task_up;
w["create_clause_req"] = create_clause_req;
w["remove_clause_req"] = remove_clause_req;
w["nation_table_select_player"] = nationTableSelectPlayer;
w["show_tax_rates_dialog"] = show_tax_rates_dialog;
w["center_tile_id"] = center_tile_id;
w["set_req_government"] = set_req_government;
w["show_tech_info_dialog"] = show_tech_info_dialog;
w["send_player_research"] = send_player_research;
w["set_unit_focus_and_redraw"] = set_unit_focus_and_redraw;
w["network_init"] = network_init;
w["swal"] = swal;
const state = c({
  open: false,
  unitId: -1,
  unitTypeName: "",
  targets: []
});
function closePillageDialog() {
  state.value = { ...state.value, open: false };
}
function selectTarget(extraId) {
  const { unitId } = state.value;
  const punit = store.units?.[unitId];
  request_unit_do_action(ACTION_PILLAGE$1, unitId, punit?.tile, extraId);
  closePillageDialog();
}
function PillageDialog() {
  const { open, unitTypeName, targets } = state.value;
  return /* @__PURE__ */ u(
    Dialog,
    {
      title: "Choose Your Target",
      open,
      onClose: closePillageDialog,
      width: 390,
      modal: false,
      children: [
        /* @__PURE__ */ u("p", { style: { marginBottom: "12px" }, children: [
          "Your ",
          unitTypeName,
          " is waiting for you to select what to pillage."
        ] }),
        /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
          targets.map((t2) => /* @__PURE__ */ u(Button, { onClick: () => selectTarget(t2.id), children: t2.name }, t2.id)),
          /* @__PURE__ */ u(Button, { variant: "secondary", onClick: closePillageDialog, children: "Cancel" })
        ] })
      ]
    }
  );
}
function App() {
  return /* @__PURE__ */ u("div", { id: "xb-preact-root", children: [
    /* @__PURE__ */ u(PillageDialog, {}),
    /* @__PURE__ */ u(MessageDialog, {}),
    /* @__PURE__ */ u(AuthDialog, {}),
    /* @__PURE__ */ u(IntroDialog, {}),
    /* @__PURE__ */ u(IntelDialog, {}),
    /* @__PURE__ */ u(SwalDialog, {})
  ] });
}
let mounted = false;
function mountPreactApp() {
  if (mounted) return;
  let container = document.getElementById("xb-preact-dialogs");
  if (!container) {
    container = document.createElement("div");
    container.id = "xb-preact-dialogs";
    document.body.appendChild(container);
  }
  J(/* @__PURE__ */ u(App, {}), container);
  mounted = true;
}
const win = window;
if (!win["effects"]) win["effects"] = {};
if (!win["specialists"]) win["specialists"] = {};
if (!win["players"]) win["players"] = {};
if (!win["research_data"]) win["research_data"] = {};
if (win["game_info"] === void 0) win["game_info"] = null;
if (win["calendar_info"] === void 0) win["calendar_info"] = null;
if (win["game_rules"] === void 0) win["game_rules"] = null;
if (win["ruleset_control"] === void 0) win["ruleset_control"] = null;
if (win["ruleset_summary"] === void 0) win["ruleset_summary"] = null;
if (win["ruleset_description"] === void 0) win["ruleset_description"] = null;
if (!win["terrains"]) win["terrains"] = {};
if (!win["resources"]) win["resources"] = {};
if (!win["terrain_control"]) win["terrain_control"] = {};
if (!win["governments"]) win["governments"] = {};
if (win["requested_gov"] === void 0) win["requested_gov"] = -1;
if (!win["connections"]) win["connections"] = {};
if (!win["conn_ping_info"]) win["conn_ping_info"] = {};
if (!win["debug_ping_list"]) win["debug_ping_list"] = [];
if (!win["actions"]) win["actions"] = {};
if (!win["extras"]) win["extras"] = {};
if (!win["roads"]) win["roads"] = [];
if (!win["bases"]) win["bases"] = [];
if (!win["unit_types"]) win["unit_types"] = {};
if (!win["unit_classes"]) win["unit_classes"] = {};
if (!win["tiles"]) win["tiles"] = {};
if (!win["units"]) win["units"] = {};
if (!win["cities"]) win["cities"] = {};
if (!win["techs"]) win["techs"] = {};
if (!win["nations"]) win["nations"] = {};
if (!win["improvements"]) win["improvements"] = {};
if (!win["map"]) win["map"] = {};
if (!win["helpdata_order"]) win["helpdata_order"] = [];
if (!win["helpdata"]) win["helpdata"] = {};
if (!win["freeciv_wiki_docs"]) win["freeciv_wiki_docs"] = {};
function syncStoreWithWindow() {
  const storeAny = store;
  const syncProps = [
    ["tiles", "tiles"],
    ["units", "units"],
    ["cities", "cities"],
    ["players", "players"],
    ["terrains", "terrains"],
    ["techs", "techs"],
    ["nations", "nations"],
    ["governments", "governments"],
    ["improvements", "improvements"],
    ["extras", "extras"],
    ["connections", "connections"],
    ["map", "mapInfo"],
    ["unit_types", "unitTypes"],
    ["game_info", "gameInfo"],
    ["calendar_info", "calendarInfo"],
    ["server_settings", "serverSettings"],
    ["ruleset_control", "rulesControl"],
    ["ruleset_summary", "rulesSummary"],
    ["ruleset_description", "rulesDescription"]
  ];
  for (const [globalName, storeProp] of syncProps) {
    const existing = win[globalName];
    if (existing !== void 0 && existing !== null) {
      storeAny[storeProp] = existing;
    }
    try {
      Object.defineProperty(win, globalName, {
        get: () => storeAny[storeProp],
        set: (v2) => {
          storeAny[storeProp] = v2;
        },
        configurable: true,
        enumerable: true
      });
    } catch {
    }
  }
}
function init() {
  logNormal("[TS] XBWorld TypeScript modules loading...");
  syncStoreWithWindow();
  logNormal("[TS] Store ↔ window globals synced");
  exposeGameDialog();
  logNormal("[TS] GameDialog component exposed");
  initControls();
  logNormal("[TS] Controls initialized");
  mountPreactApp();
  logNormal("[TS] Preact UI mounted");
  logNormal("[TS] XBWorld TypeScript modules ready");
}
init();
//# sourceMappingURL=main.js.map
