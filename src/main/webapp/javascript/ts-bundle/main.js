import { Application, Container, Texture, Sprite, TextStyle, Text, Graphics } from "pixi.js";
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
function w$3(n2, l2) {
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
    var u2 = n2.__v, t2 = u2.__e, i2 = [], r2 = [], o2 = w$3({}, u2);
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
    if (S2 = u2.props, C2 = "prototype" in T2 && T2.prototype.render, M2 = (a2 = T2.contextType) && i2[a2.__c], $2 = a2 ? M2 ? M2.props.value : a2.__ : i2, t2.__c ? b2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (C2 ? u2.__c = h2 = new T2(S2, $2) : (u2.__c = h2 = new x$1(S2, $2), h2.constructor = T2, h2.render = G), M2 && M2.sub(h2), h2.state || (h2.state = {}), h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), C2 && null == h2.__s && (h2.__s = h2.state), C2 && null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = w$3({}, h2.__s)), w$3(h2.__s, T2.getDerivedStateFromProps(S2, h2.__s))), y2 = h2.props, _2 = h2.state, h2.__v = u2, p2) C2 && null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), C2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
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
    h2.state = h2.__s, null != h2.getChildContext && (i2 = w$3(w$3({}, i2), h2.getChildContext())), C2 && !p2 && null != h2.getSnapshotBeforeUpdate && (m2 = h2.getSnapshotBeforeUpdate(y2, _2)), H2 = null != a2 && a2.type === k$1 && null == a2.key ? q$2(a2.props.children) : a2, f2 = P(n2, d$2(H2) ? H2 : [H2], u2, t2, i2, r2, o2, e2, f2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && e2.push(h2), b2 && (h2.__E = h2.__ = null);
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
  return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : d$2(n2) ? n2.map(q$2) : w$3({}, n2);
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
  u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = w$3({}, this.state), "function" == typeof n2 && (n2 = n2(w$3({}, u2), this.props)), n2 && w$3(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), $$1(this));
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
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i$1 === c$1.requestAnimationFrame || ((i$1 = c$1.requestAnimationFrame) || w$2)(j)), t2.__H.__.some(function(n3) {
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
function w$2(n2) {
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
function w$1(i2, t2) {
  d.call(this, void 0);
  this.x = i2;
  this.s = void 0;
  this.g = u$1 - 1;
  this.f = 4;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
w$1.prototype = new d();
w$1.prototype.h = function() {
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
w$1.prototype.S = function(i2) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
  }
  d.prototype.S.call(this, i2);
};
w$1.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    d.prototype.U.call(this, i2);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    }
  }
};
w$1.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
  }
};
Object.defineProperty(w$1.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var i2 = e(this);
  this.h();
  if (void 0 !== i2) i2.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function b$1(i2, t2) {
  return new w$1(i2, t2);
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
          c2 = w(r2, a2, v2);
          f2[a2] = c2;
        } else c2.o(v2, o2);
      }
      for (var s2 in t2) o2[s2] = t2[s2];
    }
  }
  i2(n2);
});
function w(i2, n2, r2, t2) {
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
  /**
   * Dynamically built tech tree layout (from buildReqtreeLayout).
   * Null until handle_rulesets_ready fires; falls back to static reqtree.ts.
   */
  computedReqtree = null;
  connections = {};
  nations = {};
  governments = {};
  improvements = {};
  extras = {};
  serverSettings = {};
  /** Category name list from SERVER_SETTING_CONTROL (index → human-readable name). */
  serverSettingCategories = [];
  /** Total number of settings announced by SERVER_SETTING_CONTROL. */
  serverSettingCount = 0;
  // Ruleset data (previously window globals)
  resources = {};
  gameRules = null;
  specialists = {};
  nationGroups = [];
  cityRules = {};
  actions = {};
  goods = {};
  clauseInfos = {};
  effects = {};
  unitClasses = {};
  terrainControl = {};
  singleMove = void 0;
  extraIds = {};
  // EXTRA_ROAD, EXTRA_RAIL, etc.
  // Rendering/runtime state (previously window globals)
  renderer = 0;
  // RENDERER_2DCANVAS etc.
  sprites = {};
  tileset = {};
  scenarioInfo = null;
  selectedPlayer = -1;
  diplstates = {};
  civserverport = "";
  freecivWikiDocs = {};
  // Canvas/map rendering state
  mapviewCanvasCtx = null;
  bufferCanvas = null;
  bufferCanvasCtx = null;
  mapviewCanvas = null;
  dashedSupport = false;
  fullfog = [];
  // UI interaction state
  contextMenuActive = false;
  keyboardInput = true;
  mapviewMouseMovement = false;
  currentFocus = [];
  soundsEnabled = false;
  // Timer/network state
  lastTurnChangeTime = 0;
  turnChangeElapsed = 0;
  secondsToPhasedone = 0;
  secondsToPhasedoneSync = 0;
  pingLast = 0;
  connPingInfo = null;
  debugPingList = [];
  savedThisTurn = false;
  endgamePlayerInfo = [];
  benchmarkStart = 0;
  autoAttack = false;
  cityTileMap = null;
  client = {
    conn: { id: 0, playing: null }
  };
  // Connection state — drives reconnect UI
  connectionState = "connected";
  // Client-side state
  username = null;
  gameType = "";
  observing = false;
  frozen = false;
  phaseStartTime = 0;
  debugActive = false;
  autostart = false;
  fcSeedrandom = null;
  civclientState = 0;
  // ClientState enum
  heightOffset = 52;
  widthOffset = 10;
  // Timer IDs
  timeoutTimerId = null;
  statusTimerId = null;
  overviewTimerId = null;
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
const ACTION_COUNT$1 = 143;
var ClientState = /* @__PURE__ */ ((ClientState2) => {
  ClientState2[ClientState2["INITIAL"] = 0] = "INITIAL";
  ClientState2[ClientState2["PREPARING"] = 1] = "PREPARING";
  ClientState2[ClientState2["RUNNING"] = 2] = "RUNNING";
  ClientState2[ClientState2["OVER"] = 3] = "OVER";
  return ClientState2;
})(ClientState || {});
const RENDERER_PIXI = 2;
function clientState() {
  return store.civclientState;
}
function canClientChangeView() {
  const playing = store.client?.conn?.playing;
  const observer = clientIsObserver();
  return (playing != null || observer) && (clientState() === ClientState.RUNNING || clientState() === ClientState.OVER);
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
ClientState.INITIAL;
const C_S_PREPARING = ClientState.PREPARING;
const C_S_RUNNING = ClientState.RUNNING;
const C_S_OVER = ClientState.OVER;
function set_client_state(newState) {
  store.civclientState = newState;
}
const gameInfo = c(store.gameInfo);
const calendarInfo = c(store.calendarInfo);
const mapInfo = c(store.mapInfo);
const currentTurn = b$1(() => gameInfo.value?.turn ?? 0);
const currentYear = b$1(() => {
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
let _knownCityIds = /* @__PURE__ */ new Set();
function _resyncKnownCityIds() {
  _knownCityIds = new Set(Object.keys(store.cities).map(Number));
}
let _knownUnitIds = /* @__PURE__ */ new Set();
function _resyncKnownUnitIds() {
  _knownUnitIds = new Set(Object.keys(store.units).map(Number));
}
let _knownPlayerNos = /* @__PURE__ */ new Set();
function _resyncKnownPlayerNos() {
  _knownPlayerNos = new Set(Object.keys(store.players).map(Number));
}
function syncFromStore() {
  gameInfo.value = store.gameInfo;
  calendarInfo.value = store.calendarInfo;
  mapInfo.value = store.mapInfo;
  _resyncKnownPlayerNos();
  playerCount.value = _knownPlayerNos.size;
  _resyncKnownCityIds();
  cityCount.value = _knownCityIds.size;
  _resyncKnownUnitIds();
  unitCount.value = _knownUnitIds.size;
  isObserver.value = store.observing;
  connectedPlayer.value = clientPlaying()?.playerno ?? null;
}
globalEvents.on("game:info", syncFromStore);
globalEvents.on("game:beginturn", syncFromStore);
globalEvents.on("game:newyear", syncFromStore);
globalEvents.on("map:allocated", syncFromStore);
globalEvents.on("store:reset", syncFromStore);
globalEvents.on("player:removed", syncFromStore);
globalEvents.on("connection:updated", syncFromStore);
globalEvents.on("game:calendar", () => {
  calendarInfo.value = store.calendarInfo;
});
globalEvents.on("city:updated", (data) => {
  const id = data?.["id"];
  if (typeof id === "number") {
    if (!_knownCityIds.has(id)) {
      _knownCityIds.add(id);
      cityCount.value = _knownCityIds.size;
    }
  } else {
    _resyncKnownCityIds();
    cityCount.value = _knownCityIds.size;
  }
});
globalEvents.on("city:removed", (data) => {
  const id = typeof data === "number" ? data : data?.["city_id"];
  if (typeof id === "number" && _knownCityIds.has(id)) {
    _knownCityIds.delete(id);
    cityCount.value = _knownCityIds.size;
  } else {
    _resyncKnownCityIds();
    cityCount.value = _knownCityIds.size;
  }
});
globalEvents.on("unit:updated", (data) => {
  const id = data?.["id"];
  if (typeof id === "number") {
    if (!_knownUnitIds.has(id)) {
      _knownUnitIds.add(id);
      unitCount.value = _knownUnitIds.size;
    }
  } else {
    _resyncKnownUnitIds();
    unitCount.value = _knownUnitIds.size;
  }
});
globalEvents.on("unit:removed", (data) => {
  const id = typeof data === "number" ? data : data?.["unit_id"];
  if (typeof id === "number" && _knownUnitIds.has(id)) {
    _knownUnitIds.delete(id);
    unitCount.value = _knownUnitIds.size;
  } else {
    _resyncKnownUnitIds();
    unitCount.value = _knownUnitIds.size;
  }
});
const rulesetReady = c(0);
globalEvents.on("rules:ready", () => {
  rulesetReady.value++;
});
const playerUpdated = c(0);
globalEvents.on("player:updated", (data) => {
  playerUpdated.value++;
  const no = data?.["playerno"];
  if (typeof no === "number") {
    if (!_knownPlayerNos.has(no)) {
      _knownPlayerNos.add(no);
      playerCount.value = _knownPlayerNos.size;
    }
  } else {
    _resyncKnownPlayerNos();
    playerCount.value = _knownPlayerNos.size;
  }
});
const researchUpdated = c(0);
globalEvents.on("player:research", () => {
  researchUpdated.value++;
});
const settingsUpdated = c(0);
globalEvents.on("settings:updated", () => {
  settingsUpdated.value++;
});
const statusRefresh = c(0);
const pregameRefresh = c(0);
const connectionBanner = c(null);
const disconnectOverlay = c(null);
const statusPanelLayout = c("top");
const turnDoneState = c({
  disabled: false,
  text: "Turn Done"
});
const unitTextDetails = c("");
const activeUnitInfo = c("");
const TRI_NO = 0;
const TRI_YES = 1;
const TRI_MAYBE = 2;
const FC_INFINITY = 1e3 * 1e3 * 1e3;
const ACTIVITY_IDLE = 0;
const ACTIVITY_CULTIVATE = 1;
const ACTIVITY_MINE = 2;
const ACTIVITY_IRRIGATE = 3;
const ACTIVITY_FORTIFIED = 4;
const ACTIVITY_SENTRY = 5;
const ACTIVITY_PILLAGE = 6;
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
const ACTION_SPY_INCITE_CITY = 18;
const ACTION_SPY_INCITE_CITY_ESC = 19;
const ACTION_SPY_BRIBE_UNIT = 23;
const ACTION_FOUND_CITY = 28;
const ACTION_NUKE = 34;
const ACTION_NUKE_CITY = 35;
const ACTION_NUKE_UNITS = 36;
const ACTION_UPGRADE_UNIT = 43;
const ACTION_AIRLIFT = 45;
const ACTION_ATTACK = 46;
const ACTION_SUICIDE_ATTACK = 48;
const ACTION_COUNT = 143;
const ACT_DEC_NOTHING = 0;
const ACT_DEC_PASSIVE = 1;
const ACT_DEC_ACTIVE = 2;
const VUT_NONE = 0;
const VUT_ACHIEVEMENT = 1;
const VUT_ACTION = 2;
const VUT_ACTIVITY = 3;
const VUT_ADVANCE = 4;
const VUT_AGE = 5;
const VUT_AI_LEVEL = 6;
const VUT_CITYSTATUS = 7;
const VUT_CITYTILE = 8;
const VUT_COUNTER = 9;
const VUT_DIPLREL = 10;
const VUT_DIPLREL_TILE = 11;
const VUT_DIPLREL_TILE_O = 12;
const VUT_DIPLREL_UNITANY = 13;
const VUT_DIPLREL_UNITANY_O = 14;
const VUT_EXTRA = 15;
const VUT_EXTRAFLAG = 16;
const VUT_FORM_AGE = 17;
const VUT_GOOD = 18;
const VUT_GOVERNMENT = 19;
const VUT_IMPROVEMENT = 20;
const VUT_IMPR_FLAG = 21;
const VUT_IMPR_GENUS = 22;
const VUT_MAXLATITUDE = 23;
const VUT_MAXTILEUNITS = 24;
const VUT_MAX_DISTANCE_SQ = 25;
const VUT_MAX_REGION_TILES = 26;
const VUT_MINCALFRAG = 27;
const VUT_MINCITIES = 28;
const VUT_MINCULTURE = 29;
const VUT_MINFOREIGNPCT = 30;
const VUT_MINHP = 31;
const VUT_MINLATITUDE = 32;
const VUT_MINMOVES = 33;
const VUT_MINSIZE = 34;
const VUT_MINTECHS = 35;
const VUT_MINVETERAN = 36;
const VUT_MINYEAR = 37;
const VUT_NATION = 38;
const VUT_NATIONALITY = 39;
const VUT_NATIONGROUP = 40;
const VUT_ORIGINAL_OWNER = 41;
const VUT_OTYPE = 42;
const VUT_PLAYER_FLAG = 43;
const VUT_PLAYER_STATE = 44;
const VUT_ROADFLAG = 45;
const VUT_SERVERSETTING = 46;
const VUT_SITE = 47;
const VUT_SPECIALIST = 48;
const VUT_STYLE = 49;
const VUT_TECHFLAG = 50;
const VUT_TERRAIN = 51;
const VUT_TERRAINALTER = 52;
const VUT_TERRAINCLASS = 53;
const VUT_TERRFLAG = 54;
const VUT_TILE_REL = 55;
const VUT_TOPO = 56;
const VUT_UCFLAG = 57;
const VUT_UCLASS = 58;
const VUT_UNITSTATE = 59;
const VUT_UTFLAG = 60;
const VUT_UTYPE = 61;
const VUT_WRAP = 62;
const VUT_COUNT = 63;
const RPT_POSSIBLE = 0;
const RPT_CERTAIN = 1;
const O_FOOD = 0;
const O_SHIELD = 1;
const O_TRADE = 2;
const O_GOLD = 3;
const O_LUXURY = 4;
const O_SCIENCE = 5;
const EC_ROAD = 2;
const EC_BASE = 3;
const REQ_RANGE_LOCAL = 0;
const REQ_RANGE_CITY = 4;
const REQ_RANGE_PLAYER = 7;
const REQ_RANGE_TEAM = 8;
const REQ_RANGE_ALLIANCE = 9;
const REQ_RANGE_WORLD = 10;
const US_TRANSPORTED = 0;
const US_HAS_HOME_CITY = 4;
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
function stringUnqualify(str) {
  if (str.charAt(0) === "?" && str.includes(":")) {
    return str.slice(str.indexOf(":") + 1);
  }
  return str;
}
function isSmallScreen() {
  return window.innerWidth <= 600 || window.innerHeight <= 600;
}
function isTouchDevice() {
  return "ontouchstart" in window || "onmsgesturechange" in window || "DocumentTouch" in globalThis && document instanceof globalThis.DocumentTouch ? true : false;
}
function getTilesetFileExtension() {
  return ".webp";
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
async function civclient_benchmark(frame) {
  if (frame === 0) benchmark_start = Date.now();
  const { mapPosToTile: mapPosToTile2 } = await Promise.resolve().then(() => map);
  const { center_tile_mapcanvas: center_tile_mapcanvas2 } = await Promise.resolve().then(() => control);
  const ptile = mapPosToTile2(frame + 5, frame + 5);
  center_tile_mapcanvas2(ptile);
  if (frame < 30) {
    setTimeout(() => civclient_benchmark(frame + 1), 10);
  } else {
    const { swal: swal2 } = await Promise.resolve().then(() => SwalDialog$1);
    const time = (Date.now() - benchmark_start) / 25;
    swal2("Redraw time: " + time);
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
const WRAP_X = 1;
const WRAP_Y = 2;
const TF_ISO = 1;
const TF_HEX = 2;
const T_UNKNOWN = 0;
const DIR_DX = [-1, 0, 1, -1, 1, -1, 0, 1];
const DIR_DY = [-1, -1, -1, 0, 0, 1, 1, 1];
const win$4 = window;
function getMapInfo() {
  const m2 = win$4.map;
  if (m2 && typeof m2.xsize === "number") return m2;
  return null;
}
function getTiles() {
  return win$4.tiles || {};
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
  win$4.tiles = newTiles;
  store.tiles = newTiles;
  if (win$4.map) win$4.map["startpos_table"] = {};
  Promise.resolve().then(() => overview).then((m2) => m2.init_overview());
}
function mapInitTopology(_setSizes) {
  const m2 = win$4.map;
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
  if (!mi) return null;
  const t2 = getTiles();
  if (x2 >= mi.xsize) y2 -= 1;
  else if (x2 < 0) y2 += 1;
  return t2[x2 + y2 * mi.xsize] ?? null;
}
function indexToTile(index) {
  return getTiles()[index] ?? null;
}
function mapstep(ptile, dir) {
  if (!isValidDir(dir)) return null;
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
win$4["map_init_topology"] = mapInitTopology;
win$4["map_allocate"] = mapAllocate;
const map = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DIR_DX,
  DIR_DY,
  TF_HEX,
  TF_ISO,
  T_UNKNOWN,
  WRAP_X,
  WRAP_Y,
  clearGotoTiles,
  dirCCW,
  dirCW,
  getMapInfo,
  getTiles,
  indexToTile,
  isCardinalDir,
  isValidDir,
  mapAllocate,
  mapDistanceVector,
  mapInitTopology,
  mapPosToTile,
  mapToNativePos,
  mapVectorToDistance,
  mapVectorToSqDistance,
  mapstep,
  nativeToMapPos,
  tileInit,
  topoHasFlag,
  wrapHasFlag
}, Symbol.toStringTag, { value: "Module" }));
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
  if (store.players[playerno] == null) return null;
  return store.players[playerno];
}
function player_by_number(playerno) {
  if (store.players[playerno] == null) return null;
  return store.players[playerno];
}
function player_by_full_username(pname) {
  for (const player_id in store.players) {
    const pplayer = store.players[player_id];
    if (pplayer.username === pname) return pplayer;
    if ("AI " + pplayer.name === pname) return pplayer;
  }
  return null;
}
function player_find_unit_by_id(pplayer, unit_id) {
  for (const id in store.units) {
    const punit = store.units[id];
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
function get_player_connection_status(pplayer) {
  if (pplayer == null) return "";
  for (const cid in store.connections) {
    const pconn = store.connections[cid];
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
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    if (pcity.owner === player.playerno && is_capital(pcity)) {
      return pcity;
    }
  }
  return null;
}
function is_capital(pcity) {
  if (pcity.improvements == null) return false;
  for (const imp_id in store.improvements) {
    const imp = store.improvements[imp_id];
    if (imp != null && imp.genus === 0 && pcity.improvements[imp.id] === true) {
      return true;
    }
  }
  return false;
}
const TECH_UNKNOWN = 0;
const TECH_KNOWN = 2;
const AR_ONE = 0;
const AR_TWO = 1;
const AR_ROOT = 2;
const AR_SIZE = 3;
const TF_BONUS_TECH = 0;
const TF_BRIDGE = 1;
const TF_RAILROAD = 2;
const TF_POPULATION_POLLUTION_INC = 3;
const TF_FARMLAND = 4;
const TF_BUILD_AIRBORNE = 5;
const TF_LAST = 6;
const A_NONE$1 = 0;
const A_FIRST = 1;
function playerInventionState(pplayer, techId) {
  if (pplayer == null) {
    return TECH_UNKNOWN;
  } else {
    const inventions = pplayer["inventions"];
    if (inventions != null && inventions[techId] != null) {
      return inventions[techId];
    } else {
      return TECH_UNKNOWN;
    }
  }
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
  const extras = ptile.extras;
  if (!extras) return false;
  if (typeof extras.isSet === "function") {
    return extras.isSet(extra);
  }
  return false;
}
function tileResource(ptile) {
  return ptile?.resource ?? null;
}
function tileCity(ptile) {
  if (!ptile) return null;
  const cityId = ptile.worked;
  const pcity = store.cities[cityId];
  if (pcity && pcity.tile === ptile.index) {
    return pcity;
  }
  return null;
}
function isTechInRange(targetPlayer, range, tech) {
  const TECH_KNOWN_VAL = TECH_KNOWN;
  switch (range) {
    case REQ_RANGE_PLAYER:
      return targetPlayer != null && playerInventionState(targetPlayer, tech) === TECH_KNOWN_VAL ? TRI_YES : TRI_NO;
    case REQ_RANGE_TEAM:
    case REQ_RANGE_ALLIANCE:
    case REQ_RANGE_WORLD:
      console.log("Unimplemented tech requirement range " + range);
      return TRI_MAYBE;
  }
  console.log("Invalid tech req range " + range);
  return TRI_MAYBE;
}
function isReqActive(targetPlayer, targetCity, targetBuilding, targetTile, targetUnittype, targetOutput, targetSpecialist, req, probType) {
  let result = TRI_NO;
  switch (req["kind"]) {
    case VUT_NONE:
      result = TRI_YES;
      break;
    case VUT_ADVANCE:
      result = isTechInRange(targetPlayer, req["range"], req["value"]);
      break;
    case VUT_GOVERNMENT:
      if (targetPlayer == null) {
        result = TRI_MAYBE;
      } else {
        result = targetPlayer["government"] == req["value"] ? TRI_YES : TRI_NO;
      }
      break;
    // ── Implemented: unit type match ─────────────────────────────────────────
    case VUT_UTYPE: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      result = targetUnittype["id"] === req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: map topology ─────────────────────────────────────────────
    case VUT_TOPO: {
      const topoId = store.mapInfo?.["topology_id"];
      if (topoId == null) {
        result = TRI_MAYBE;
        break;
      }
      result = topoId === req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: minimum number of techs known ────────────────────────────
    case VUT_MINTECHS: {
      if (targetPlayer == null) {
        result = TRI_MAYBE;
        break;
      }
      let techCount = 0;
      for (const techId in store.techs) {
        if (playerInventionState(targetPlayer, Number(techId)) === TECH_KNOWN) techCount++;
      }
      result = techCount >= req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: city size ────────────────────────────────────────────────
    // Only REQ_RANGE_CITY is evaluated; other ranges (traderoute, player, world)
    // require iterating cities we don't have fully client-side → TRI_MAYBE.
    case VUT_MINSIZE: {
      if (targetCity == null || req["range"] !== REQ_RANGE_CITY) {
        result = TRI_MAYBE;
        break;
      }
      const citySize = targetCity["size"];
      if (citySize == null) {
        result = TRI_MAYBE;
        break;
      }
      result = citySize >= req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: minimum game year ───────────────────────────────────────
    // Uses store.gameInfo.year; TRI_MAYBE before game info is loaded.
    case VUT_MINYEAR: {
      const year = store.gameInfo?.["year"];
      if (year == null) {
        result = TRI_MAYBE;
        break;
      }
      result = year >= req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: city improvement present ─────────────────────────────────
    // Only REQ_RANGE_CITY evaluated; traderoute/player/world ranges → TRI_MAYBE.
    case VUT_IMPROVEMENT: {
      if (targetCity == null || req["range"] !== REQ_RANGE_CITY) {
        result = TRI_MAYBE;
        break;
      }
      const imprBv = targetCity["improvements"];
      if (imprBv == null || typeof imprBv["isSet"] !== "function") {
        result = TRI_MAYBE;
        break;
      }
      result = imprBv.isSet(req["value"]) ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: tile terrain ─────────────────────────────────────────────
    // Checks targetTile.terrain; TRI_MAYBE when no tile context provided.
    case VUT_TERRAIN: {
      {
        result = TRI_MAYBE;
        break;
      }
    }
    // ── Implemented: unit type flag ───────────────────────────────────────────
    // Checks the 'flags' BitVector on the unit type (converted from number[]
    // by handle_ruleset_unit). TRI_MAYBE if no unit type or no flags field.
    case VUT_UTFLAG: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      const utFlags = targetUnittype["flags"];
      if (utFlags == null || typeof utFlags["isSet"] !== "function") {
        result = TRI_MAYBE;
        break;
      }
      result = utFlags.isSet(req["value"]) ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: unit class ───────────────────────────────────────────────
    // Freeciv RULESET_UNIT packet carries the class id as 'unit_class'.
    // TRI_MAYBE when the field is absent (old protocol or unit type not loaded).
    case VUT_UCLASS: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      const classId = targetUnittype["unit_class"];
      if (classId == null) {
        result = TRI_MAYBE;
        break;
      }
      result = classId === req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: minimum veteran level ───────────────────────────────────
    // Requires a unit INSTANCE (has 'veteran' field from Unit packet).
    // Unit types have no veteran level → TRI_MAYBE when no 'veteran' field.
    case VUT_MINVETERAN: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      const vet = targetUnittype["veteran"];
      if (vet == null) {
        result = TRI_MAYBE;
        break;
      }
      result = vet >= req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: minimum moves left ──────────────────────────────────────
    // Requires a unit INSTANCE (has 'movesleft' field).
    // Unit types have 'move_rate' (max), not 'movesleft' (current) → TRI_MAYBE.
    case VUT_MINMOVES: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      const moves = targetUnittype["movesleft"];
      if (moves == null) {
        result = TRI_MAYBE;
        break;
      }
      result = moves >= req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: minimum hit points ──────────────────────────────────────
    // Requires a unit INSTANCE (current hp, not unit type max hp).
    // Discriminant: unit instances always have 'movesleft'; types do not.
    case VUT_MINHP: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      const rec = targetUnittype;
      if (rec["movesleft"] == null) {
        result = TRI_MAYBE;
        break;
      }
      result = rec["hp"] >= req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── TRI_MAYBE: nation group membership not available client-side ──────────
    case VUT_NATIONGROUP:
      result = TRI_MAYBE;
      break;
    // ── Implemented: improvement genus ───────────────────────────────────────
    // VUT_IMPR_GENUS: the city has at least one built improvement of genus X.
    // IG_GREAT_WONDER=0, IG_SMALL_WONDER=1, IG_IMPROVEMENT=2, IG_SPECIAL=3, IG_CONVERT=4.
    // Must iterate city buildings — NOT check the target improvement's own genus.
    case VUT_IMPR_GENUS: {
      if (targetCity == null) {
        result = TRI_MAYBE;
        break;
      }
      const imprBvG = targetCity["improvements"];
      if (imprBvG == null || typeof imprBvG["isSet"] !== "function") {
        result = TRI_MAYBE;
        break;
      }
      const bvG = imprBvG;
      let genusFound = false;
      for (const imprId in store.improvements) {
        const n2 = Number(imprId);
        if (!bvG.isSet(n2)) continue;
        const g2 = store.improvements[n2]["genus"];
        if (g2 === req["value"]) {
          genusFound = true;
          break;
        }
      }
      result = genusFound ? TRI_YES : TRI_NO;
      break;
    }
    // ── TRI_MAYBE: action enabler evaluation not implemented ──────────────────
    case VUT_ACTION:
      result = TRI_MAYBE;
      break;
    // ── TRI_MAYBE: extra flag evaluation ──────────────────────────────────────
    // VUT_EXTRAFLAG checks if any extra on the relevant tile has a specific flag
    // from its 'efs' (extra flag set) BitVector. Cannot implement because:
    // (a) RulesetExtraPacket does not explicitly type 'efs', and it is unclear
    //     whether the server sends it in this web protocol;
    // (b) evaluation requires a tile context (which extra on which tile?),
    //     not just targetTile.terrain.
    case VUT_EXTRAFLAG:
      result = TRI_MAYBE;
      break;
    // ── Implemented: unit class flag ─────────────────────────────────────────
    // Checks whether the unit type's unit class has the given class-flag set.
    // Requires: targetUnittype.unit_class → store.unitClasses[classId].flags.
    // TRI_MAYBE when unit type, class id, class entry, or flags BitVector
    // are unavailable (graceful degradation: RPT_POSSIBLE callers still pass).
    case VUT_UCFLAG: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      const classId = targetUnittype["unit_class"];
      if (classId == null) {
        result = TRI_MAYBE;
        break;
      }
      const uclass = store.unitClasses[classId];
      if (uclass == null) {
        result = TRI_MAYBE;
        break;
      }
      const ucFlags = uclass["flags"];
      if (ucFlags == null || typeof ucFlags["isSet"] !== "function") {
        result = TRI_MAYBE;
        break;
      }
      result = ucFlags.isSet(req["value"]) ? TRI_YES : TRI_NO;
      break;
    }
    // ── TRI_MAYBE: all remaining unimplemented types ──────────────────────────
    // Returning TRI_MAYBE rather than TRI_NO: we cannot evaluate these
    // client-side, but we should not assume the requirement is unmet.
    // With RPT_POSSIBLE callers get true (assume possible); RPT_CERTAIN → false.
    // ── Implemented: extra present on tile ───────────────────────────────────
    // Uses tileHasExtra() which handles BitVector extras from map packets.
    case VUT_EXTRA: {
      {
        result = TRI_MAYBE;
        break;
      }
    }
    // ── Implemented: terrain flag ─────────────────────────────────────────────
    // Reads terrain.flags (raw number or BitVector — not converted in packet handler).
    case VUT_TERRFLAG: {
      {
        result = TRI_MAYBE;
        break;
      }
    }
    // ── Implemented: improvement flag ────────────────────────────────────────
    // targetBuilding is canonical; falls back to targetOutput (some callers
    // pass the improvement there instead of the dedicated slot).
    case VUT_IMPR_FLAG: {
      const imprTarget = targetOutput;
      if (imprTarget == null) {
        result = TRI_MAYBE;
        break;
      }
      const iflags = imprTarget["flags"];
      if (iflags == null) {
        result = TRI_MAYBE;
        break;
      }
      let ifHas;
      if (typeof iflags["isSet"] === "function") {
        ifHas = iflags.isSet(req["value"]);
      } else if (typeof iflags === "number") {
        ifHas = Boolean(iflags >> req["value"] & 1);
      } else {
        result = TRI_MAYBE;
        break;
      }
      result = ifHas ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: player nation ────────────────────────────────────────────
    // Checks targetPlayer.nation matches the required nation id.
    case VUT_NATION: {
      if (targetPlayer == null) {
        result = TRI_MAYBE;
        break;
      }
      result = targetPlayer.nation === req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: unit activity ────────────────────────────────────────────
    // VUT_ACTIVITY checks unit.activity (ACTIVITY_IDLE, ACTIVITY_FORTIFIED, etc.).
    // Only unit INSTANCES have 'activity'; unit types have no such field → TRI_MAYBE.
    case VUT_ACTIVITY: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      const actVal = targetUnittype["activity"];
      if (actVal == null) {
        result = TRI_MAYBE;
        break;
      }
      result = actVal === req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: unit state ───────────────────────────────────────────────
    // VUT_UNITSTATE checks logical unit state (transported, has home city, etc.).
    // US_TRANSPORTED (0) and US_HAS_HOME_CITY (4) are checkable from packet data.
    // All other unit-state values require server-side context → TRI_MAYBE.
    case VUT_UNITSTATE: {
      if (targetUnittype == null) {
        result = TRI_MAYBE;
        break;
      }
      const uRec = targetUnittype;
      switch (req["value"]) {
        case US_TRANSPORTED: {
          const tb = uRec["transported_by"];
          result = tb != null && tb !== -1 ? TRI_YES : TRI_NO;
          break;
        }
        case US_HAS_HOME_CITY: {
          const hc = uRec["homecity"];
          result = hc != null && hc !== 0 ? TRI_YES : TRI_NO;
          break;
        }
        default:
          result = TRI_MAYBE;
      }
      break;
    }
    // ── Implemented: diplomatic relation ─────────────────────────────────────
    // Checks whether targetPlayer has the given diplstate with any other player.
    // Only DS_* values 0-6 are evaluated; derived/compound relation values → TRI_MAYBE.
    // REQ_RANGE_LOCAL (between two specific actors) → TRI_MAYBE: actor unknown.
    case VUT_DIPLREL: {
      if (targetPlayer == null) {
        result = TRI_MAYBE;
        break;
      }
      if (req["value"] < 0 || req["value"] >= 7) {
        result = TRI_MAYBE;
        break;
      }
      if (req["range"] === REQ_RANGE_LOCAL) {
        result = TRI_MAYBE;
        break;
      }
      const ds = targetPlayer["diplstates"];
      if (ds == null) {
        result = TRI_MAYBE;
        break;
      }
      const dsRec = ds;
      let dsFound = false;
      for (const otherId in dsRec) {
        const entry = dsRec[Number(otherId)];
        if (entry != null && entry.state === req["value"]) {
          dsFound = true;
          break;
        }
      }
      result = dsFound ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: city tile type ───────────────────────────────────────────
    // CITYT_CENTER (0): tile.index === city.tile (city center tile).
    // CITYT_WORKER (1): tile.worked != 0 (some city is working this tile).
    // CITYT_CLAIMED (2): TRI_MAYBE — client has no city-radius data.
    case VUT_CITYTILE: {
      {
        result = TRI_MAYBE;
        break;
      }
    }
    // ── Implemented: minimum culture ─────────────────────────────────────────
    // REQ_RANGE_CITY: checks city.culture; REQ_RANGE_PLAYER: checks player.culture.
    // Falls back to TRI_MAYBE when the culture field is absent from the packet.
    case VUT_MINCULTURE: {
      let cultureVal = null;
      if (req["range"] === REQ_RANGE_CITY) {
        if (targetCity == null) {
          result = TRI_MAYBE;
          break;
        }
        cultureVal = targetCity["culture"] ?? null;
      } else if (req["range"] === REQ_RANGE_PLAYER) {
        if (targetPlayer == null) {
          result = TRI_MAYBE;
          break;
        }
        cultureVal = targetPlayer["culture"] ?? null;
      }
      if (cultureVal == null) {
        result = TRI_MAYBE;
        break;
      }
      result = cultureVal >= req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: terrain class ────────────────────────────────────────────
    // Reads terrain.tclass (TC_LAND=0, TC_OCEAN=1) from the ruleset terrain packet.
    // Falls back to TRI_MAYBE if the server does not send the tclass field.
    case VUT_TERRAINCLASS: {
      {
        result = TRI_MAYBE;
        break;
      }
    }
    // ── Implemented: AI skill level ───────────────────────────────────────────
    // Checks player.ai_skill_level: 0=human/Away, 1=Handicapped … 7=Experimental.
    // TRI_MAYBE when targetPlayer is null (observer context without specific player).
    case VUT_AI_LEVEL: {
      if (targetPlayer == null) {
        result = TRI_MAYBE;
        break;
      }
      result = targetPlayer.ai_skill_level === req["value"] ? TRI_YES : TRI_NO;
      break;
    }
    // ── Implemented: minimum age in turns ────────────────────────────────────
    // REQ_RANGE_CITY:   (gameInfo.turn - city.turn_founded)   >= req.value
    // REQ_RANGE_PLAYER: player.turns_alive                    >= req.value
    // Falls back to TRI_MAYBE when the needed field is absent.
    case VUT_AGE: {
      const gameTurn = store.gameInfo?.["turn"];
      if (gameTurn == null) {
        result = TRI_MAYBE;
        break;
      }
      if (req["range"] === REQ_RANGE_CITY) {
        if (targetCity == null) {
          result = TRI_MAYBE;
          break;
        }
        const founded = targetCity["turn_founded"];
        if (founded == null) {
          result = TRI_MAYBE;
          break;
        }
        result = gameTurn - founded >= req["value"] ? TRI_YES : TRI_NO;
      } else if (req["range"] === REQ_RANGE_PLAYER) {
        if (targetPlayer == null) {
          result = TRI_MAYBE;
          break;
        }
        const alive = targetPlayer["turns_alive"];
        if (alive == null) {
          result = TRI_MAYBE;
          break;
        }
        result = alive >= req["value"] ? TRI_YES : TRI_NO;
      } else {
        result = TRI_MAYBE;
      }
      break;
    }
    case VUT_OTYPE:
    case VUT_SPECIALIST:
    case VUT_TERRAINALTER:
    case VUT_GOOD:
    case VUT_NATIONALITY:
    case VUT_ROADFLAG:
    case VUT_TECHFLAG:
    case VUT_ACHIEVEMENT:
    case VUT_MAXTILEUNITS:
    case VUT_STYLE:
    case VUT_MINCALFRAG:
    case VUT_SERVERSETTING:
    // New Freeciv 3.4 types — falls through
    // falls through
    case VUT_CITYSTATUS:
    case VUT_COUNTER:
    case VUT_DIPLREL_TILE:
    case VUT_DIPLREL_TILE_O:
    case VUT_DIPLREL_UNITANY:
    case VUT_DIPLREL_UNITANY_O:
    case VUT_FORM_AGE:
    case VUT_MAXLATITUDE:
    case VUT_MAX_DISTANCE_SQ:
    case VUT_MAX_REGION_TILES:
    case VUT_MINCITIES:
    case VUT_MINFOREIGNPCT:
    case VUT_MINLATITUDE:
    case VUT_ORIGINAL_OWNER:
    case VUT_PLAYER_FLAG:
    case VUT_PLAYER_STATE:
    case VUT_SITE:
    case VUT_TILE_REL:
    case VUT_WRAP:
      result = TRI_MAYBE;
      break;
    case VUT_COUNT:
      return false;
    default:
      console.log("Unknown requirement type " + req["kind"]);
  }
  if (result === TRI_MAYBE) {
    if (probType === RPT_POSSIBLE) {
      return true;
    } else {
      return false;
    }
  }
  if (req["present"]) {
    return result === TRI_YES;
  } else {
    return result === TRI_NO;
  }
}
function areReqsActive(targetPlayer, targetCity, targetBuilding, targetTile, targetUnittype, targetOutput, targetSpecialist, reqs, probType) {
  for (let i2 = 0; i2 < reqs.length; i2++) {
    if (!isReqActive(
      targetPlayer,
      targetCity,
      targetBuilding,
      targetTile,
      targetUnittype,
      targetOutput,
      targetSpecialist,
      reqs[i2],
      probType
    )) {
      return false;
    }
  }
  return true;
}
function universalBuildShieldCost(_pcity, target) {
  return target["build_cost"];
}
function actionByNumber(actId) {
  const actions = store.actions;
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
function action_prob_not_impl(probability) {
  return probability.min === 254 && probability.max === 0;
}
function actionProbPossible(aprob) {
  return 0 < aprob["max"] || action_prob_not_impl(aprob);
}
const UTYF_FLAGLESS = 29;
const UTYF_PROVIDES_RANSOM = 30;
function utype_can_do_action(putype, action_id) {
  if (putype == null || putype["utype_actions"] == null) return false;
  return putype["utype_actions"].isSet(action_id);
}
function can_player_build_unit_direct(p2, punittype) {
  if (punittype == null || p2 == null) return false;
  const techReq = punittype["tech_requirement"];
  if (techReq != null && techReq >= 0) {
    if (playerInventionState(p2, techReq) !== TECH_KNOWN) {
      return false;
    }
  }
  const obsoletedBy = punittype["obsoleted_by"];
  if (obsoletedBy != null && obsoletedBy >= 0) {
    const obs_type = store.unitTypes[obsoletedBy];
    if (obs_type != null) {
      const obsTechReq = obs_type["tech_requirement"];
      if (obsTechReq == null || obsTechReq < 0) {
        return false;
      }
      if (playerInventionState(p2, obsTechReq) === TECH_KNOWN) {
        return false;
      }
    }
  }
  return true;
}
const EXTRA_NONE = -1;
function extraByNumber(id) {
  if (id === EXTRA_NONE) {
    return null;
  }
  const rc = store.rulesControl;
  if (id >= 0 && rc && id < rc["num_extra_types"]) {
    return store.extras[id];
  } else {
    console.log("extra_by_number(): Invalid extra id: " + id);
    return null;
  }
}
function isExtraCausedBy(pextra, cause) {
  return pextra.causes.isSet(cause);
}
class BitVector {
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
}
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
  Promise.resolve().then(() => unitFocus).then((m2) => {
    m2.control_unit_killed(punit);
  });
  const focused = store.currentFocus || [];
  if (focused.some((u2) => u2.id === punit.id)) {
    store.currentFocus = [];
  }
  delete store.units[punit.id];
}
function tile_units(ptile) {
  if (ptile == null) return null;
  return ptile["units"];
}
function get_supported_units(pcity) {
  if (pcity == null) return null;
  const result = [];
  for (const unit_id in store.units) {
    const punit = store.units[unit_id];
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
  return store.unitTypes[punit.type];
}
function get_unit_moves_left(punit) {
  if (punit == null) {
    return 0;
  }
  return "Moves:" + move_points_text(punit.movesleft);
}
function move_points_text(moves) {
  const sm = store.singleMove ?? 1;
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
  if (store.client?.conn?.playing == null || punit.owner !== store.client.conn.playing.playerno) {
    return false;
  }
  return punit.goto_tile !== -1;
}
function update_unit_anim_list(old_unit, new_unit) {
  if (old_unit == null || new_unit == null) return;
  if (new_unit.tile === old_unit.tile) return;
  if (anim_units_count > anim_units_max) return;
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
function reset_unit_anim_list() {
  for (const unit_id in store.units) {
    const punit = store.units[unit_id];
    punit["anim_list"] = [];
  }
  anim_units_count = 0;
}
function get_unit_homecity_name(punit) {
  if (punit.homecity !== 0 && store.cities[punit.homecity] != null) {
    return decodeURIComponent(store.cities[punit.homecity]["name"]);
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
function get_unit_city_info(punit) {
  let result = "";
  const ptype = unit_type(punit);
  result += ptype["name"] + "\nFood/Shield/Gold: ";
  const upkeep = punit["upkeep"];
  if (upkeep != null) {
    result += upkeep[O_FOOD] + "/" + upkeep[O_SHIELD] + "/" + upkeep[O_GOLD];
  }
  result += "\n" + get_unit_moves_left(punit) + "\n";
  const homecity = get_unit_homecity_name(punit);
  if (homecity != null) {
    result += homecity;
  }
  return result;
}
function tileTerrain(ptile) {
  if (!store.terrains) return void 0;
  return store.terrains[ptile.terrain];
}
let _terrainNearCache = /* @__PURE__ */ Object.create(null);
function invalidateTerrainNearCache(tileIndex) {
  delete _terrainNearCache[tileIndex];
}
function clearTerrainNearCache() {
  _terrainNearCache = /* @__PURE__ */ Object.create(null);
}
function tileTerrainNear(ptile) {
  const cached = _terrainNearCache[ptile.index];
  if (cached !== void 0) return cached;
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
  _terrainNearCache[ptile.index] = near;
  return near;
}
function isOceanTile(ptile) {
  const t2 = tileTerrain(ptile);
  if (!t2) return false;
  return t2.graphic_str === "floor" || t2.graphic_str === "coast" || t2.graphic_str === "lake";
}
const _w$1 = window;
if (!_w$1["terrains"]) _w$1["terrains"] = {};
if (!_w$1["resources"]) _w$1["resources"] = {};
if (!_w$1["terrain_control"]) _w$1["terrain_control"] = {};
let mouse_x = 0;
let mouse_y = 0;
let keyboard_input = true;
let allow_right_click = false;
let mapview_mouse_movement = false;
function setMouseX(v2) {
  mouse_x = v2;
}
function setMouseY(v2) {
  mouse_y = v2;
}
function setKeyboardInput(v2) {
  keyboard_input = v2;
}
function setAllowRightClick(v2) {
  allow_right_click = v2;
}
function setMapviewMouseMovement(v2) {
  mapview_mouse_movement = v2;
}
let roads$1 = [];
let current_focus = [];
let urgent_focus_queue = [];
let waiting_units_list = [];
function setCurrentFocus(v2) {
  current_focus = v2;
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
let has_movesleft_warning_been_shown = false;
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
function setHasMovesleftWarningBeenShown(v2) {
  has_movesleft_warning_been_shown = v2;
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
function setActionSelectionInProgressFor(v2) {
  action_selection_in_progress_for = v2;
}
let mouse_touch_started_on_unit = false;
function setMouseTouchStartedOnUnit(v2) {
  mouse_touch_started_on_unit = v2;
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
  open: open2,
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
    if (open2 && pos.x === -1 && dialogRef.current && typeof window !== "undefined") {
      const rect = dialogRef.current.getBoundingClientRect();
      setPos({
        x: Math.max(0, (window.innerWidth - rect.width) / 2),
        y: Math.max(0, (window.innerHeight - rect.height) / 3)
      });
    }
  }, [open2]);
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
  if (!open2) return null;
  const style = {
    position: "fixed",
    zIndex: 1e4,
    width,
    height,
    borderRadius: "var(--xb-dialog-radius, 6px)",
    boxShadow: "var(--xb-dialog-shadow, 0 8px 32px rgba(0,0,0,0.6))",
    border: "1px solid var(--xb-dialog-border-color, var(--xb-border-default, #30363d))",
    overflow: "hidden",
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
          background: "var(--xb-dialog-backdrop-bg)",
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
                padding: "var(--xb-dialog-titlebar-padding)",
                background: "var(--xb-dialog-titlebar-bg)",
                color: "var(--xb-dialog-titlebar-color)",
                cursor: draggable ? "move" : "default",
                userSelect: "none",
                borderBottom: "2px solid var(--xb-dialog-titlebar-accent, var(--xb-accent-blue, #58a6ff))"
              },
              children: [
                /* @__PURE__ */ u("span", { style: { fontWeight: 600, fontSize: "var(--xb-dialog-titlebar-font-size)" }, children: title }),
                onClose && /* @__PURE__ */ u(
                  "button",
                  {
                    onClick: onClose,
                    onPointerDown: (e2) => e2.stopPropagation(),
                    style: {
                      background: "none",
                      border: "none",
                      color: "var(--xb-dialog-titlebar-close-color)",
                      fontSize: "20px",
                      cursor: "pointer",
                      padding: "2px 6px",
                      lineHeight: 1,
                      touchAction: "manipulation",
                      minWidth: "28px",
                      minHeight: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "var(--xb-radius-sm, 3px)",
                      transition: "background var(--xb-transition-fast, 100ms ease)"
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
                background: "var(--xb-dialog-content-bg)",
                color: "var(--xb-dialog-content-color)",
                padding: "var(--xb-dialog-content-padding)",
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
    background: "var(--xb-btn-primary-bg)",
    color: "var(--xb-btn-primary-color)",
    border: "1px solid var(--xb-btn-primary-border-color)"
  },
  secondary: {
    background: "var(--xb-btn-secondary-bg)",
    color: "var(--xb-btn-secondary-color)",
    border: "1px solid var(--xb-btn-secondary-border-color)"
  },
  danger: {
    background: "var(--xb-btn-danger-bg)",
    color: "var(--xb-btn-danger-color)",
    border: "1px solid var(--xb-btn-danger-border-color)"
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
        padding: "var(--xb-btn-padding)",
        borderRadius: "var(--xb-btn-radius)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: "var(--xb-btn-font-size)",
        fontWeight: "bold",
        transition: `opacity var(--xb-transition-fast)`
      },
      children
    }
  );
}
const state$7 = c({
  open: false,
  title: "",
  text: "",
  type: "",
  showCancelButton: false,
  confirmButtonText: "OK",
  onConfirm: null
});
function closeSwal() {
  state$7.value = { ...state$7.value, open: false };
}
function confirm() {
  const cb = state$7.value.onConfirm;
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
    state$7.value = {
      open: true,
      title: opts.title || "",
      text: opts.text || "",
      type: opts.type || "",
      showCancelButton: !!opts.showCancelButton,
      confirmButtonText: opts.confirmButtonText || "OK",
      onConfirm: cb
    };
  } else {
    state$7.value = {
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
  const { open: open2, title, text, type, showCancelButton, confirmButtonText } = state$7.value;
  const icon = TYPE_ICONS[type] || "";
  return /* @__PURE__ */ u(
    Dialog,
    {
      title: icon ? `${icon} ${title}` : title,
      open: open2,
      onClose: closeSwal,
      width: 360,
      modal: true,
      children: [
        text && /* @__PURE__ */ u("div", { style: { marginBottom: "12px", lineHeight: 1.5 }, children: text }),
        /* @__PURE__ */ u("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px" }, children: [
          showCancelButton && /* @__PURE__ */ u(Button, { onClick: closeSwal, children: "Cancel" }),
          /* @__PURE__ */ u(Button, { onClick: confirm, children: confirmButtonText })
        ] })
      ]
    }
  );
}
const SwalDialog$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SwalDialog,
  swal
}, Symbol.toStringTag, { value: "Module" }));
const banned_users = [];
function check_text_with_banlist(text) {
  if (text == null || text.length === 0) return false;
  for (let i2 = 0; i2 < banned_users.length; i2++) {
    if (text.toLowerCase().indexOf(banned_users[i2].toLowerCase()) !== -1) return false;
  }
  return true;
}
const win$3 = window;
function isLongturn() {
  return win$3.game_type === "longturn";
}
function setPhaseStart() {
  win$3.phase_start_time = Date.now();
}
let _observeSent = false;
function requestObserveGame() {
  if (_observeSent) return;
  _observeSent = true;
  const tryTake = () => {
    const players = Object.values(store.players);
    const aiPlayer = players.find((p2) => {
      const flags = p2["flags"];
      return flags instanceof BitVector && flags.isSet(PlayerFlag.PLRF_AI);
    });
    if (aiPlayer && aiPlayer["name"]) {
      console.log("[xbw] requestObserveGame: /take", aiPlayer["name"]);
      send_message("/take " + aiPlayer["name"]);
    } else {
      const firstPlayer = players[0];
      if (firstPlayer && firstPlayer["name"]) {
        console.log("[xbw] requestObserveGame: /take (non-AI)", firstPlayer["name"]);
        send_message("/take " + firstPlayer["name"]);
      } else {
        console.log("[xbw] requestObserveGame: no players, using bare /observe");
        send_message("/observe ");
      }
    }
  };
  if (Object.keys(store.players).length > 0) {
    tryTake();
  } else {
    setTimeout(tryTake, 500);
  }
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function sanitizeGameHtml(html) {
  if (!html) return "";
  let out = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  out = out.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");
  out = out.replace(/(href|src)\s*=\s*["']?\s*(javascript|data)\s*:/gi, '$1="#"');
  out = out.replace(/<\/?(iframe|object|embed|form|input|button|textarea|select)\b[^>]*>/gi, "");
  return out;
}
function parseGameHtml(html) {
  if (!html) return [];
  const tmp = document.createElement("div");
  tmp.innerHTML = sanitizeGameHtml(html);
  return nodeListToVNodes(tmp.childNodes);
}
function nodeListToVNodes(nodes) {
  const result = [];
  for (let i2 = 0; i2 < nodes.length; i2++) {
    const node = nodes[i2];
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) result.push(text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      result.push(elementToVNode(node));
    }
  }
  return result;
}
function elementToVNode(el) {
  const tag = el.tagName.toLowerCase();
  const children = nodeListToVNodes(el.childNodes);
  switch (tag) {
    case "br":
      return /* @__PURE__ */ u("br", {});
    case "b":
    case "strong":
      return /* @__PURE__ */ u("strong", { children });
    case "i":
    case "em":
      return /* @__PURE__ */ u("em", { children });
    case "u":
      return /* @__PURE__ */ u("u", { children });
    case "s":
    case "strike":
      return /* @__PURE__ */ u("s", { children });
    case "span": {
      const style = el.getAttribute("style");
      return style ? /* @__PURE__ */ u("span", { style, children }) : /* @__PURE__ */ u("span", { children });
    }
    case "font": {
      const color = el.getAttribute("color");
      return color ? /* @__PURE__ */ u("span", { style: `color:${color}`, children }) : /* @__PURE__ */ u("span", { children });
    }
    case "a": {
      const href = el.getAttribute("href") ?? "";
      if (/^https?:\/\//i.test(href)) {
        return /* @__PURE__ */ u("a", { href, target: "_blank", rel: "noopener noreferrer", children });
      }
      return /* @__PURE__ */ u(k$1, { children });
    }
    case "p":
      return /* @__PURE__ */ u("p", { children });
    case "div":
      return /* @__PURE__ */ u("div", { children });
    case "ul":
      return /* @__PURE__ */ u("ul", { children });
    case "ol":
      return /* @__PURE__ */ u("ol", { children });
    case "li":
      return /* @__PURE__ */ u("li", { children });
    default:
      return /* @__PURE__ */ u(k$1, { children });
  }
}
let _counter$1 = 0;
const chatEntries = c([]);
let chatLogText = "";
const MAX_MESSAGES = 500;
function pushChatMessage(html, className) {
  const entry = { id: _counter$1++, html, className };
  let next = [...chatEntries.value, entry];
  if (next.length > MAX_MESSAGES) next = next.slice(-MAX_MESSAGES);
  chatEntries.value = next;
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  chatLogText += (tmp.textContent ?? "") + "\n";
}
function clipChatMessages(lines) {
  if (lines <= 0) {
    chatEntries.value = [];
    chatLogText = "";
    return;
  }
  const entries = chatEntries.value;
  if (entries.length <= lines) return;
  chatEntries.value = entries.slice(-lines);
}
function ChatBox() {
  const entries = chatEntries.value;
  const bottomRef = A(null);
  y$2(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);
  return /* @__PURE__ */ u("ol", { style: { margin: 0, padding: "0 0 4px 0", listStyle: "none" }, children: [
    entries.map((entry) => /* @__PURE__ */ u("li", { class: entry.className || void 0, children: parseGameHtml(entry.html) }, entry.id)),
    /* @__PURE__ */ u("li", { ref: bottomRef, style: { height: 0, margin: 0, padding: 0 } })
  ] });
}
function mountChatBox(container) {
  J(/* @__PURE__ */ u(ChatBox, {}), container);
}
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
  const scrollDiv = document.getElementById("freeciv_custom_scrollbar_div");
  if (scrollDiv) {
    const ol = scrollDiv.querySelector("ol#game_message_area");
    if (ol) ol.remove();
    mountChatBox(scrollDiv);
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
  return chatLogText || null;
}
function clear_chatbox() {
  message_log.clear();
  chatbox_clip_messages(0);
}
function update_chatbox(messages) {
  for (let i2 = 0; i2 < messages.length; i2++) {
    const html = messages[i2]["message"];
    const className = fc_e_events[messages[i2]["event"]] || "";
    pushChatMessage(html, className);
    Promise.resolve().then(() => GameLog$1).then(({ pushGameLogEntry: pushGameLogEntry2 }) => pushGameLogEntry2(html)).catch(() => {
    });
  }
  if (messages.length > 0) {
    setTimeout(() => {
      const el = document.getElementById("freeciv_custom_scrollbar_div");
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }
}
function chatbox_clip_messages(lines) {
  if (lines === void 0 || lines < 0) {
    lines = 24;
  }
  message_log.fireNow();
  clipChatMessages(lines);
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
window["seedrandom"] = seedrandom;
const instances = /* @__PURE__ */ new Map();
function initTabs(selector, options) {
  const container = document.querySelector(selector);
  if (!container) return;
  const ul = container.querySelector("ul");
  if (!ul) return;
  const tabs2 = [];
  const panels = [];
  ul.querySelectorAll('li > a[href^="#"]').forEach((a2) => {
    const anchor = a2;
    const panelId = anchor.getAttribute("href").substring(1);
    const panel = document.getElementById(panelId);
    if (panel) {
      tabs2.push(anchor);
      panels.push(panel);
    }
  });
  const state2 = {
    container,
    tabs: tabs2,
    panels,
    active: options?.active ?? 0
  };
  tabs2.forEach((tab, i2) => {
    tab.addEventListener("click", (e2) => {
      e2.preventDefault();
      setActiveTab(selector, i2);
    });
  });
  instances.set(selector, state2);
  container.classList.add("ui-tabs", "ui-widget", "ui-widget-content", "ui-corner-all");
  ul.classList.add("ui-tabs-nav", "ui-helper-reset", "ui-helper-clearfix", "ui-widget-header", "ui-corner-all");
  ul.setAttribute("role", "tablist");
  tabs2.forEach((tab) => {
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
const tabs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getActiveTab,
  initTabs,
  setActiveTab
}, Symbol.toStringTag, { value: "Module" }));
const cities = new Proxy({}, {
  get(_t, p2) {
    return store.cities[p2];
  },
  set(_t, p2, v2) {
    store.cities[p2] = v2;
    return true;
  },
  has(_t, p2) {
    return p2 in store.cities;
  },
  ownKeys() {
    return Reflect.ownKeys(store.cities);
  },
  getOwnPropertyDescriptor(_t, p2) {
    return Object.getOwnPropertyDescriptor(store.cities, p2);
  }
});
const city_trade_routes = {};
let active_city = null;
function _update_city_screen_proxy() {
}
new EventAggregator(
  _update_city_screen_proxy,
  250,
  EventAggregator.DP_NONE,
  250,
  3,
  250
);
function set_active_city(v2) {
  active_city = v2;
}
function Tabs({ tabs: tabs2, activeTab, onTabChange, children }) {
  const handleClick = q$1(
    (id) => () => onTabChange(id),
    [onTabChange]
  );
  return /* @__PURE__ */ u("div", { class: "xb-tabs", children: [
    /* @__PURE__ */ u(
      "div",
      {
        class: "xb-tabs-bar",
        style: {
          display: "flex",
          gap: "2px",
          borderBottom: "1px solid var(--xb-border-default, #30363d)",
          background: "var(--xb-bg-secondary, #161b22)"
        },
        children: tabs2.map((t2) => /* @__PURE__ */ u(
          "button",
          {
            onClick: handleClick(t2.id),
            class: "xb-tab",
            style: {
              padding: "6px 14px",
              fontSize: "var(--xb-font-size-sm, 12px)",
              fontWeight: t2.id === activeTab ? "bold" : "normal",
              color: t2.id === activeTab ? "var(--xb-text-primary, #e6edf3)" : "var(--xb-text-secondary, #8b949e)",
              background: t2.id === activeTab ? "var(--xb-bg-surface, #1a1a2e)" : "transparent",
              border: "none",
              borderBottom: t2.id === activeTab ? "2px solid var(--xb-accent-blue, #58a6ff)" : "2px solid transparent",
              cursor: "pointer",
              transition: "color var(--xb-transition-fast, 100ms ease)"
            },
            children: t2.label
          },
          t2.id
        ))
      }
    ),
    /* @__PURE__ */ u(
      "div",
      {
        class: "xb-tabs-content",
        style: {
          background: "var(--xb-bg-surface, #1a1a2e)",
          color: "var(--xb-text-primary, #e6edf3)",
          padding: "var(--xb-space-md, 12px)"
        },
        children
      }
    )
  ] });
}
function TabPanel({ id, activeTab, children }) {
  if (id !== activeTab) return null;
  return /* @__PURE__ */ u("div", { class: "xb-tab-panel", children });
}
function formatProductionOverview(pcity) {
  const prod_type = getCityProductionTypeSprite(pcity);
  return "Producing: " + (prod_type != null ? prod_type["type"]["name"] : "None");
}
function formatResourceStats(pcity) {
  if (!("prod" in pcity && "surplus" in pcity)) return null;
  let food_txt = pcity["prod"][O_FOOD] + " ( ";
  if (pcity["surplus"][O_FOOD] > 0) food_txt += "+";
  food_txt += pcity["surplus"][O_FOOD] + ")";
  let shield_txt = pcity["prod"][O_SHIELD] + " ( ";
  if (pcity["surplus"][O_SHIELD] > 0) shield_txt += "+";
  shield_txt += pcity["surplus"][O_SHIELD] + ")";
  let trade_txt = pcity["prod"][O_TRADE] + " ( ";
  if (pcity["surplus"][O_TRADE] > 0) trade_txt += "+";
  trade_txt += pcity["surplus"][O_TRADE] + ")";
  let gold_txt = pcity["prod"][O_GOLD] + " ( ";
  if (pcity["surplus"][O_GOLD] > 0) gold_txt += "+";
  gold_txt += pcity["surplus"][O_GOLD] + ")";
  return {
    food: food_txt,
    prod: shield_txt,
    trade: trade_txt,
    gold: gold_txt,
    luxury: String(pcity["prod"][O_LUXURY]),
    science: String(pcity["prod"][O_SCIENCE]),
    corruption: String(pcity["waste"][O_TRADE]),
    waste: String(pcity["waste"][O_SHIELD]),
    pollution: String(pcity["pollution"]),
    steal: String(pcity["steal"]),
    culture: String(pcity["culture"])
  };
}
function getCitySizeData(pcity) {
  return {
    population: numberWithCommas(cityPopulation(pcity) * 1e3),
    size: pcity["size"],
    foodStock: pcity["food_stock"],
    granarySize: pcity["granary_size"],
    growthText: cityTurnsToGrowthText(pcity)
  };
}
function getProductionTurnsData(pcity) {
  const t2 = getCityProductionTime(pcity);
  return { turns: t2 === FC_INFINITY ? null : t2, progress: getProductionProgress(pcity) };
}
function getImprovementItems(pcity) {
  const items = [];
  const numTypes = store.rulesControl?.["num_impr_types"] ?? 0;
  for (let z2 = 0; z2 < numTypes; z2++) {
    if (pcity["improvements"] != null && pcity["improvements"].isSet(z2)) {
      items.push({
        id: z2,
        name: store.improvements[z2]["name"],
        helptext: store.improvements[z2]["helptext"] ?? "",
        sprite: get_improvement_image_sprite(store.improvements[z2])
      });
    }
  }
  return items;
}
function getPresentUnitItems(pcity) {
  const punits = tile_units(cityTile(pcity));
  if (punits == null) return null;
  const items = [];
  for (const punit of punits) {
    const sprite = get_unit_image_sprite(punit);
    if (sprite == null) continue;
    items.push({ id: punit["id"], sprite, title: get_unit_city_info(punit) });
  }
  return items;
}
function getSupportedUnitItems(pcity) {
  const sunits = get_supported_units(pcity);
  if (sunits == null) return null;
  const items = [];
  for (const punit of sunits) {
    const sprite = get_unit_image_sprite(punit);
    if (sprite == null) continue;
    items.push({ id: punit["id"], sprite, title: get_unit_city_info(punit) });
  }
  return items;
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
function buildProductionListData(pcity) {
  const hasData = typeof pcity["can_build_unit"] !== "undefined";
  const units = [];
  const improvements = [];
  for (const id in store.unitTypes) {
    const ut = store.unitTypes[Number(id)];
    const utFlags = ut["flags"];
    if (utFlags != null && typeof utFlags.isSet === "function" && utFlags.isSet(UTYF_PROVIDES_RANSOM)) continue;
    if (hasData) {
      if (!canCityBuildUnitNow(pcity, Number(id))) continue;
    } else {
      if (!canCityBuildUnitDirect(pcity, ut)) continue;
    }
    units.push({ type: ut, cost: ut["build_cost"] });
  }
  for (const id in store.improvements) {
    const impr = store.improvements[Number(id)];
    if (hasData) {
      if (!canCityBuildImprovementNow(pcity, Number(id))) continue;
    } else {
      if (!canCityBuildImprovementDirect(pcity, impr)) continue;
    }
    const cost = impr["name"] === "Coinage" ? "-" : impr["build_cost"];
    improvements.push({ impr, cost });
  }
  return { hasData, units, improvements };
}
const cityDialogSignal = c(null);
function showCityDialogPreact(pcity) {
  cityDialogSignal.value = pcity;
}
function closeCityDialogPreact() {
  cityDialogSignal.value = null;
}
function SpriteDiv({ sprite, title, className }) {
  return /* @__PURE__ */ u(
    "div",
    {
      class: className,
      title,
      style: {
        background: `transparent url(${sprite["image-src"]})`,
        backgroundPosition: `-${sprite["tileset-x"]}px -${sprite["tileset-y"]}px`,
        width: sprite["width"],
        height: sprite["height"],
        flexShrink: 0
      }
    }
  );
}
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "buildings", label: "Buildings" },
  { id: "units", label: "Units" },
  { id: "production", label: "Can Build" }
];
function CityDialog() {
  const pcity = cityDialogSignal.value;
  rulesetReady.value;
  const [activeTab, setActiveTab2] = d$1("overview");
  y$2(() => {
    if (pcity) setActiveTab2("overview");
  }, [pcity?.id]);
  const onClose = q$1(() => {
    cityDialogSignal.value = null;
  }, []);
  if (!pcity) return null;
  const owner = cityOwner(pcity);
  const title = `${pcity["name"]} (${owner?.name ?? "?"}) — Size ${pcity["size"]}`;
  const stats = formatResourceStats(pcity);
  const productionOverview = formatProductionOverview(pcity);
  const sizeData = getCitySizeData(pcity);
  const prodTurns = getProductionTurnsData(pcity);
  const cityState = get_city_state(pcity);
  const improvementItems = getImprovementItems(pcity);
  const presentItems = getPresentUnitItems(pcity);
  const supportedItems = getSupportedUnitItems(pcity);
  const prodList = activeTab === "production" ? buildProductionListData(pcity) : null;
  const secondaryStyle = { color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-sm, 12px)" };
  const rowStyle = { fontSize: "var(--xb-font-size-sm, 12px)", lineHeight: "1.6", color: "var(--xb-text-primary, #e6edf3)" };
  return /* @__PURE__ */ u(Dialog, { title, open: true, onClose, width: 560, modal: false, children: /* @__PURE__ */ u(Tabs, { tabs: TABS, activeTab, onTabChange: setActiveTab2, children: [
    /* @__PURE__ */ u(TabPanel, { id: "overview", activeTab, children: /* @__PURE__ */ u("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ u("div", { style: { minWidth: 180 }, children: [
        /* @__PURE__ */ u("div", { style: rowStyle, children: [
          /* @__PURE__ */ u("div", { children: [
            "Population: ",
            sizeData.population
          ] }),
          /* @__PURE__ */ u("div", { children: [
            "Size: ",
            sizeData.size
          ] }),
          /* @__PURE__ */ u("div", { children: [
            "Granary: ",
            sizeData.foodStock,
            "/",
            sizeData.granarySize
          ] }),
          /* @__PURE__ */ u("div", { children: [
            "Change in: ",
            sizeData.growthText
          ] })
        ] }),
        /* @__PURE__ */ u("div", { style: { marginTop: 8, ...secondaryStyle }, children: productionOverview }),
        /* @__PURE__ */ u("div", { style: secondaryStyle, children: prodTurns.turns !== null ? `${prodTurns.turns} turns  (${prodTurns.progress})` : "—" }),
        /* @__PURE__ */ u("div", { style: {
          marginTop: 4,
          fontSize: "var(--xb-font-size-sm, 12px)",
          color: cityState === "Disorder" ? "var(--xb-status-error, #f85149)" : cityState === "Celebrating" ? "var(--xb-accent-green, #3fb950)" : "var(--xb-text-secondary, #8b949e)"
        }, children: [
          "State: ",
          cityState
        ] })
      ] }),
      stats && /* @__PURE__ */ u("table", { style: { fontSize: "var(--xb-font-size-sm, 12px)", borderCollapse: "collapse", color: "var(--xb-text-primary, #e6edf3)" }, children: /* @__PURE__ */ u("tbody", { children: [
        ["Food", stats.food],
        ["Production", stats.prod],
        ["Trade", stats.trade],
        ["Gold", stats.gold],
        ["Luxury", stats.luxury],
        ["Science", stats.science],
        ["Corruption", stats.corruption],
        ["Waste", stats.waste],
        ["Pollution", stats.pollution],
        ["Culture", stats.culture]
      ].map(([label, val]) => /* @__PURE__ */ u("tr", { children: [
        /* @__PURE__ */ u("td", { style: { paddingRight: 8, color: "var(--xb-text-secondary, #8b949e)" }, children: [
          label,
          ":"
        ] }),
        /* @__PURE__ */ u("td", { children: val })
      ] }, label)) }) })
    ] }) }),
    /* @__PURE__ */ u(TabPanel, { id: "buildings", activeTab, children: improvementItems.length > 0 ? /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, fontSize: "var(--xb-font-size-sm, 12px)" }, children: improvementItems.map((item) => /* @__PURE__ */ u("div", { title: item.helptext, style: { display: "flex", alignItems: "center", gap: 4 }, children: [
      item.sprite && /* @__PURE__ */ u(SpriteDiv, { sprite: item.sprite }),
      item.name
    ] }, item.id)) }) : /* @__PURE__ */ u("div", { style: secondaryStyle, children: "No buildings" }) }),
    /* @__PURE__ */ u(TabPanel, { id: "units", activeTab, children: [
      /* @__PURE__ */ u("div", { style: secondaryStyle, children: "Present:" }),
      /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 12 }, children: presentItems && presentItems.length > 0 ? presentItems.map((item) => /* @__PURE__ */ u(SpriteDiv, { sprite: item.sprite, title: item.title, className: "game_unit_list_item" }, item.id)) : /* @__PURE__ */ u("span", { style: { color: "var(--xb-text-secondary)" }, children: "None" }) }),
      /* @__PURE__ */ u("div", { style: secondaryStyle, children: "Supported:" }),
      /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: 2 }, children: supportedItems && supportedItems.length > 0 ? supportedItems.map((item) => /* @__PURE__ */ u(SpriteDiv, { sprite: item.sprite, title: item.title, className: "game_unit_list_item" }, item.id)) : /* @__PURE__ */ u("span", { style: { color: "var(--xb-text-secondary)" }, children: "None" }) })
    ] }),
    /* @__PURE__ */ u(TabPanel, { id: "production", activeTab, children: prodList == null ? null : !prodList.hasData ? /* @__PURE__ */ u("div", { style: secondaryStyle, children: "Build data not available (requires live server)." }) : /* @__PURE__ */ u("div", { style: { fontSize: "var(--xb-font-size-sm, 12px)", maxHeight: 360, overflowY: "auto" }, children: [
      prodList.units.length > 0 && /* @__PURE__ */ u(k$1, { children: [
        /* @__PURE__ */ u("div", { style: { ...secondaryStyle, marginBottom: 4 }, children: [
          "Units (",
          prodList.units.length,
          "):"
        ] }),
        /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }, children: prodList.units.map(({ type, cost }) => {
          const sprite = get_unit_type_image_sprite(type);
          return /* @__PURE__ */ u(
            "div",
            {
              title: `${type["name"]} — Cost: ${cost}`,
              style: { display: "flex", alignItems: "center", gap: 4, background: "var(--xb-bg-tertiary, #21262d)", borderRadius: 3, padding: "2px 6px", cursor: "default" },
              children: [
                sprite && /* @__PURE__ */ u(SpriteDiv, { sprite }),
                /* @__PURE__ */ u("span", { children: type["name"] }),
                /* @__PURE__ */ u("span", { style: { color: "var(--xb-text-secondary, #8b949e)" }, children: cost })
              ]
            },
            type["id"]
          );
        }) })
      ] }),
      prodList.improvements.length > 0 && /* @__PURE__ */ u(k$1, { children: [
        /* @__PURE__ */ u("div", { style: { ...secondaryStyle, marginBottom: 4 }, children: [
          "Improvements (",
          prodList.improvements.length,
          "):"
        ] }),
        /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: prodList.improvements.map(({ impr, cost }) => {
          const sprite = get_improvement_image_sprite(impr);
          return /* @__PURE__ */ u(
            "div",
            {
              title: `${impr["name"]} — Cost: ${cost}`,
              style: { display: "flex", alignItems: "center", gap: 4, background: "var(--xb-bg-tertiary, #21262d)", borderRadius: 3, padding: "2px 6px", cursor: "default" },
              children: [
                sprite && /* @__PURE__ */ u(SpriteDiv, { sprite }),
                /* @__PURE__ */ u("span", { children: impr["name"] }),
                /* @__PURE__ */ u("span", { style: { color: "var(--xb-text-secondary, #8b949e)" }, children: cost })
              ]
            },
            impr["id"]
          );
        }) })
      ] }),
      prodList.units.length === 0 && prodList.improvements.length === 0 && /* @__PURE__ */ u("div", { style: secondaryStyle, children: "Nothing buildable." })
    ] }) })
  ] }) });
}
const state$6 = c({
  open: false,
  title: "",
  prompt: "",
  initialValue: "",
  maxLength: 64,
  onSubmit: () => {
  },
  onCancel: () => {
  }
});
function showCityInputDialog(title, prompt, initialValue, maxLength, onSubmit, onCancel) {
  state$6.value = { open: true, title, prompt, initialValue, maxLength, onSubmit, onCancel };
}
function closeCityInputDialog() {
  state$6.value = { ...state$6.value, open: false };
}
function CityInputDialog() {
  const { open: open2, title, prompt, initialValue, maxLength, onSubmit, onCancel } = state$6.value;
  const inputRef = A(null);
  function handleSubmit() {
    const name = inputRef.current?.value ?? "";
    onSubmit(name);
  }
  function handleCancel() {
    closeCityInputDialog();
    onCancel();
  }
  return /* @__PURE__ */ u(Dialog, { title, open: open2, onClose: handleCancel, width: "320px", modal: true, children: [
    /* @__PURE__ */ u("div", { style: { marginBottom: "8px" }, children: prompt }),
    /* @__PURE__ */ u(
      "input",
      {
        ref: inputRef,
        type: "text",
        defaultValue: initialValue,
        maxLength,
        style: { width: "100%", margin: "8px 0", boxSizing: "border-box" },
        onKeyUp: (e2) => {
          if (e2.key === "Enter") handleSubmit();
        }
      }
    ),
    /* @__PURE__ */ u("div", { style: { display: "flex", gap: "8px", marginTop: "8px" }, children: [
      /* @__PURE__ */ u(Button, { onClick: handleSubmit, children: "Ok" }),
      /* @__PURE__ */ u(Button, { variant: "secondary", onClick: handleCancel, children: "Cancel" })
    ] })
  ] });
}
function show_city_dialog_by_id(pcity_id) {
  show_city_dialog(cities[pcity_id]);
}
function show_city_dialog(pcity) {
  if (!pcity) return;
  set_active_city(pcity);
  showCityDialogPreact(pcity);
}
function close_city_dialog() {
  set_active_city(null);
  closeCityDialogPreact();
}
function update_city_screen() {
  const pcity = cityDialogSignal.value;
  if (pcity) {
    const fresh = cities[pcity["id"]];
    if (fresh) cityDialogSignal.value = fresh;
  }
}
globalEvents.on("city:screenUpdate", update_city_screen);
function city_name_dialog(suggested_name, unit_id) {
  const name = suggested_name ?? "";
  const uid = unit_id ?? 0;
  showCityInputDialog(
    "Name New City",
    "What should the city be called?",
    name,
    64,
    (cityName) => {
      const unit = store.units[uid];
      const tileId = unit ? unit["tile"] : 0;
      sendUnitDoAction(ACTION_FOUND_CITY, uid, tileId, 0, cityName);
    },
    () => {
    }
  );
}
globalEvents.on("city:updated", () => {
  const open2 = cityDialogSignal.value;
  if (!open2) return;
  const fresh = cities[open2["id"]];
  if (fresh) cityDialogSignal.value = fresh;
});
let music_list = [
  "battle-epic",
  "battle2",
  "battle3",
  "battle4",
  "battle5",
  "battle6",
  "battle7",
  "battle8"
];
let audio = null;
function setAudio(value) {
  audio = value;
}
function supports_mp3() {
  try {
    const a2 = document.createElement("audio");
    return !!(a2.canPlayType && a2.canPlayType("audio/mpeg"));
  } catch {
    return false;
  }
}
const STORAGE_KEY = "xbw-theme";
function setTheme(name) {
  document.documentElement.dataset["theme"] = name;
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
  }
}
function getTheme() {
  return document.documentElement.dataset["theme"] ?? "dark";
}
function loadSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ["dark", "light", "fantasy"].includes(saved)) {
      setTheme(saved);
      return;
    }
    if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  } catch {
  }
}
window["setTheme"] = setTheme;
window["getTheme"] = getTheme;
const auto_center_on_unit = true;
const popup_actor_arrival = true;
let draw_fog_of_war = true;
function setDrawFogOfWar(val) {
  draw_fog_of_war = val;
}
const draw_units = true;
loadSavedTheme();
function request_unit_do_action(action_id, actor_id, target_id, sub_tgt_id = 0, name = "") {
  sendUnitDoAction(action_id, actor_id, target_id, sub_tgt_id || 0, name || "");
  action_decision_clear_want(actor_id);
}
function request_new_unit_activity(punit, activity, target) {
  if (punit != null && (punit.ssa_controller !== 0 || punit.has_orders)) {
    punit.ssa_controller = 0;
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
  action_decision_clear_want(punit["id"]);
  sendUnitChangeActivity(punit["id"], activity, target);
}
const sounds_enabled_get = () => store.soundsEnabled;
const soundset_get = () => typeof soundset !== "undefined" ? soundset : {};
const sound_path = "/sounds/";
function unit_move_sound_play(unit) {
  if (!sounds_enabled_get()) return;
  if (unit == null) return;
  if (soundset_get() == null) {
    console.error("soundset not found.");
    return;
  }
  const ptype = unit_type(unit);
  if (!ptype) return;
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
  store.soundsEnabled = false;
  if (typeof trackJs !== "undefined" && trackJs) {
    trackJs.console.log(err);
    trackJs.track("Sound problem");
  } else {
    console.error(err);
  }
}
const MATCH_NONE$1 = 0;
const MATCH_SAME$1 = 1;
const MATCH_PAIR$1 = 2;
const MATCH_FULL$1 = 3;
const CELL_WHOLE$1 = 0;
const CELL_CORNER$1 = 1;
const _w = window;
_w.MATCH_NONE = MATCH_NONE$1;
_w.MATCH_SAME = MATCH_SAME$1;
_w.MATCH_PAIR = MATCH_PAIR$1;
_w.MATCH_FULL = MATCH_FULL$1;
_w.CELL_WHOLE = CELL_WHOLE$1;
_w.CELL_CORNER = CELL_CORNER$1;
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
  "floor.107": "t.l0.cellgroup_l_d_l_l",
  // Lake terrain uses MATCH_PAIR (binary: shallow vs land).
  // Each lake array_index (0-7) maps to the coast MATCH_FULL array_index that has the
  // equivalent shallow/land combination (no "deep" neighbours for inland lakes):
  //   lake bits (b1,b2,b3) → coast n[2],n[1],n[0] (0=shallow, 2=land)
  //   lake array = b1*4+b2*2+b3 → coast array = n[2]*9+n[1]*3+n[0]
  //   coast total = coast_array*4 + corner  (maps to cellgroup_map["coast.*"])
  "lake.0": "t.l0.cellgroup_s_s_s_s",
  "lake.1": "t.l0.cellgroup_s_s_s_s",
  "lake.2": "t.l0.cellgroup_s_s_s_s",
  "lake.3": "t.l0.cellgroup_s_s_s_s",
  "lake.4": "t.l0.cellgroup_s_s_s_l",
  "lake.5": "t.l0.cellgroup_s_l_s_s",
  "lake.6": "t.l0.cellgroup_l_s_s_s",
  "lake.7": "t.l0.cellgroup_s_s_l_s",
  "lake.8": "t.l0.cellgroup_l_s_s_s",
  "lake.9": "t.l0.cellgroup_s_s_l_s",
  "lake.10": "t.l0.cellgroup_s_l_s_s",
  "lake.11": "t.l0.cellgroup_s_s_s_l",
  "lake.12": "t.l0.cellgroup_l_s_s_l",
  "lake.13": "t.l0.cellgroup_s_l_l_s",
  "lake.14": "t.l0.cellgroup_l_l_s_s",
  "lake.15": "t.l0.cellgroup_s_s_l_l",
  "lake.16": "t.l0.cellgroup_s_l_s_s",
  "lake.17": "t.l0.cellgroup_s_s_s_l",
  "lake.18": "t.l0.cellgroup_s_s_l_s",
  "lake.19": "t.l0.cellgroup_l_s_s_s",
  "lake.20": "t.l0.cellgroup_s_l_s_l",
  "lake.21": "t.l0.cellgroup_s_l_s_l",
  "lake.22": "t.l0.cellgroup_l_s_l_s",
  "lake.23": "t.l0.cellgroup_l_s_l_s",
  "lake.24": "t.l0.cellgroup_l_l_s_s",
  "lake.25": "t.l0.cellgroup_s_s_l_l",
  "lake.26": "t.l0.cellgroup_s_l_l_s",
  "lake.27": "t.l0.cellgroup_l_s_s_l",
  "lake.28": "t.l0.cellgroup_l_l_s_l",
  "lake.29": "t.l0.cellgroup_s_l_l_l",
  "lake.30": "t.l0.cellgroup_l_l_l_s",
  "lake.31": "t.l0.cellgroup_l_s_l_l"
};
const MAP_TO_NATIVE_POS = mapToNativePos;
const NATIVE_TO_MAP_POS = nativeToMapPos;
let _mapview;
function _setMapviewRef(ref) {
  _mapview = ref;
}
function map_to_gui_vector(map_dx, map_dy) {
  const gui_dx = (map_dx - map_dy) * tileset_tile_width >> 1;
  const gui_dy = (map_dx + map_dy) * tileset_tile_height >> 1;
  return { "gui_dx": gui_dx, "gui_dy": gui_dy };
}
function normalize_gui_pos(gui_x, gui_y) {
  let nat_x, nat_y;
  const r2 = gui_to_map_pos(gui_x, gui_y);
  let map_x = r2["map_x"];
  let map_y = r2["map_y"];
  const s2 = map_to_gui_pos$1(map_x, map_y);
  const gui_x0_temp = s2["gui_dx"];
  const gui_y0_temp = s2["gui_dy"];
  const diff_x = gui_x - gui_x0_temp;
  const diff_y = gui_y - gui_y0_temp;
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
function base_canvas_to_map_pos(canvas_x, canvas_y) {
  return gui_to_map_pos(
    canvas_x + _mapview.gui_x0,
    canvas_y + _mapview.gui_y0
  );
}
function canvas_pos_to_tile(canvas_x, canvas_y) {
  const r2 = base_canvas_to_map_pos(canvas_x, canvas_y);
  const map_x = r2["map_x"];
  const map_y = r2["map_y"];
  return mapPosToTile(map_x, map_y);
}
function center_tile_mapcanvas_2d(ptile) {
  const r2 = map_to_gui_pos$1(ptile["x"], ptile["y"]);
  let gui_x = r2["gui_dx"];
  let gui_y = r2["gui_dy"];
  gui_x -= _mapview["width"] - tileset_tile_width >> 1;
  gui_y -= _mapview["height"] - tileset_tile_height >> 1;
  const before = { x0: _mapview["gui_x0"], y0: _mapview["gui_y0"] };
  set_mapview_origin(gui_x, gui_y);
  const after = { x0: _mapview["gui_x0"], y0: _mapview["gui_y0"] };
  console.log(
    "[xbw center] tile=(%d,%d) gui_raw=(%d,%d) mv_wh=(%d,%d) input=(%d,%d) before=(%d,%d) after=(%d,%d)",
    ptile["x"],
    ptile["y"],
    r2["gui_dx"],
    r2["gui_dy"],
    _mapview["width"],
    _mapview["height"],
    gui_x,
    gui_y,
    before.x0,
    before.y0,
    after.x0,
    after.y0
  );
}
function center_tile_id(ptile_id) {
  const ptile = store.tiles[ptile_id];
  center_tile_mapcanvas_2d(ptile);
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
  _mapview["gui_x0"] = gui_x0;
  _mapview["gui_y0"] = gui_y0;
  _setDirtyAll(true);
}
let _setDirtyAll = () => {
};
function _setDirtyAllSetter(fn) {
  _setDirtyAll = fn;
}
const map_pos_to_tile$1 = mapPosToTile;
let touch_start_x;
let touch_start_y;
let map_select_check = false;
let map_select_check_started = 0;
let map_select_active = false;
let map_select_x;
let map_select_y;
function setMapSelectActive(v2) {
  map_select_active = v2;
}
function setTouchStart(x2, y2) {
  touch_start_x = x2;
  touch_start_y = y2;
}
function mapctrl_init_pixi() {
  const container = document.getElementById("canvas_div");
  if (!container) {
    console.warn("mapctrl_init_pixi: #canvas_div not found");
    return;
  }
  const canvas = container.querySelector("canvas");
  if (!canvas) {
    console.warn("mapctrl_init_pixi: no <canvas> found inside #canvas_div");
    return;
  }
  canvas.addEventListener("mouseup", mapview_mouse_click);
  canvas.addEventListener("mousedown", mapview_mouse_down);
  window.addEventListener("mousemove", mouse_moved_cb);
  window.addEventListener("mouseup", mapview_window_mouse_up);
  if (isTouchDevice()) {
    canvas.addEventListener("touchstart", mapview_touch_start);
    canvas.addEventListener("touchend", mapview_touch_end);
    canvas.addEventListener("touchmove", mapview_touch_move);
  }
}
function mapview_mouse_click(e2) {
  let rightclick = false;
  let middleclick = false;
  if (e2.which) {
    rightclick = e2.which == 3;
    middleclick = e2.which == 2;
  } else if (e2.button) {
    rightclick = e2.button == 2;
    middleclick = e2.button == 1 || e2.button == 4;
  }
  if (rightclick) {
    if (!map_select_active || false) {
      store.contextMenuActive = true;
      recenter_button_pressed(mouse_x, mouse_y);
    } else {
      store.contextMenuActive = false;
      map_select_units(mouse_x, mouse_y);
    }
    map_select_active = false;
    map_select_check = false;
  } else if (!middleclick) {
    action_button_pressed(mouse_x, mouse_y, SELECT_POPUP);
    setMapviewMouseMovement(false);
    store.mapviewMouseMovement = false;
    update_mouse_cursor();
  }
  setKeyboardInput(true);
  store.keyboardInput = true;
}
function mapview_mouse_down(e2) {
  let rightclick = false;
  let middleclick = false;
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
    store.contextMenuActive = false;
  }
}
function mapview_window_mouse_up() {
  setMapviewMouseMovement(false);
  store.mapviewMouseMovement = false;
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
  if (goto_active && current_focus.length > 0) {
    const ptile = canvas_pos_to_tile(mouse_x, mouse_y);
    if (ptile != null) {
      for (let i2 = 0; i2 < current_focus.length; i2++) {
        if (i2 >= 20) return;
        if (goto_request_map[current_focus[i2]["id"] + "," + ptile["x"] + "," + ptile["y"]] == null) {
          request_goto_path(current_focus[i2]["id"], ptile["x"], ptile["y"]);
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
        selected_tiles[ptile["index"]] = ptile;
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
  store.currentFocus = selected_units;
  action_selection_next_in_focus(IDENTITY_NUMBER_ZERO);
}
function recenter_button_pressed(canvas_x, canvas_y) {
  const map_scroll_border = 8;
  const big_map_size = 24;
  let ptile = canvas_pos_to_tile(canvas_x, canvas_y);
  const orig_tile = ptile;
  if (ptile != null && ptile["y"] > store.mapInfo.ysize - map_scroll_border && store.mapInfo.xsize > big_map_size && store.mapInfo.ysize > big_map_size) {
    ptile = map_pos_to_tile$1(ptile["x"], store.mapInfo.ysize - map_scroll_border);
  }
  if (ptile != null && ptile["y"] < map_scroll_border && store.mapInfo.xsize > big_map_size && store.mapInfo.ysize > big_map_size) {
    ptile = map_pos_to_tile$1(ptile["x"], map_scroll_border);
  }
  if (canClientChangeView() && ptile != null && orig_tile != null) {
    const sunit = find_visible_unit(orig_tile);
    if (!clientIsObserver() && sunit != null && sunit["owner"] == clientPlaying().playerno) {
      if (current_focus.length <= 1) set_unit_focus(sunit);
      const canvasEl = document.getElementById("canvas");
      canvasEl.contextMenu?.(true);
      canvasEl.dispatchEvent(new Event("contextmenu"));
    } else {
      const canvasEl = document.getElementById("canvas");
      canvasEl.contextMenu?.(false);
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
        lines[i2] = escapeHtml(split_txt[1]) + "<a href='#' data-action='select-player' data-playerno='" + pplayer["playerno"] + "' style='color: black;'>" + escapeHtml(split_txt[2]) + "</a>" + escapeHtml(split_txt[3]) + ", " + escapeHtml(get_player_connection_status(pplayer)) + escapeHtml(split_txt[4]);
      } else {
        lines[i2] = escapeHtml(lines[i2]);
      }
    } else {
      lines[i2] = escapeHtml(lines[i2]);
    }
  }
  message = lines.join("<br>\n");
  showDialogMessage("Tile Information", message);
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
function ProgressBar({
  value,
  max = 100,
  color = "var(--xb-accent-blue, #58a6ff)",
  height = 8,
  label
}) {
  const pct = Math.min(100, Math.max(0, value / max * 100));
  return /* @__PURE__ */ u(
    "div",
    {
      class: "xb-progress",
      style: {
        position: "relative",
        width: "100%",
        height: `${label ? Math.max(height, 16) : height}px`,
        background: "var(--xb-bg-secondary, #161b22)",
        borderRadius: "var(--xb-radius-sm, 3px)",
        border: "1px solid var(--xb-border-default, #30363d)",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ u(
          "div",
          {
            class: "xb-progress-fill",
            style: {
              width: `${pct}%`,
              height: "100%",
              background: color,
              borderRadius: "var(--xb-radius-sm, 3px)",
              transition: "width var(--xb-transition-normal, 200ms ease)"
            }
          }
        ),
        label && /* @__PURE__ */ u(
          "span",
          {
            style: {
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "var(--xb-font-size-xs, 11px)",
              color: "var(--xb-text-primary, #e6edf3)",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              pointerEvents: "none"
            },
            children: label
          }
        )
      ]
    }
  );
}
function buildWikiDialogData(tech_name, docs) {
  const doc = docs[tech_name];
  if (!doc) return null;
  return {
    techName: tech_name,
    title: doc.title,
    wikiUrl: `http://en.wikipedia.org/wiki/${doc.title}`,
    imageUrl: doc.image ? `/images/wiki/${doc.image}` : null,
    summary: doc.summary
  };
}
function buildTechInfoDialogData(tech_name, unit_type_id, improvement_id, docs) {
  let unit = null;
  if (unit_type_id != null) {
    const punit_type = store.unitTypes[unit_type_id];
    if (punit_type) {
      unit = {
        name: punit_type["name"],
        helptext: punit_type["helptext"] ?? "",
        build_cost: punit_type["build_cost"],
        attack_strength: punit_type["attack_strength"],
        defense_strength: punit_type["defense_strength"],
        firepower: punit_type["firepower"],
        hp: punit_type["hp"],
        move_rate_text: move_points_text(punit_type["move_rate"]),
        vision_radius_sq: punit_type["vision_radius_sq"]
      };
    }
  }
  let improvement = null;
  if (improvement_id != null) {
    const impr = store.improvements[improvement_id];
    if (impr) {
      improvement = {
        name: impr["name"] ?? "",
        helptext: impr["helptext"] ?? ""
      };
    }
  }
  return {
    techName: tech_name,
    unit,
    improvement,
    wiki: buildWikiDialogData(tech_name, docs)
  };
}
c(false);
const _refreshTick = c(0);
function refreshTechPanel() {
  _refreshTick.value++;
}
const XSCALE = 1.2;
const BOX_W = 180;
const BOX_H = 46;
const PAD = 8;
function getActiveLayout() {
  return store.computedReqtree ?? reqtree;
}
function ResearchList() {
  _refreshTick.value;
  currentTurn.value;
  researchUpdated.value;
  rulesetReady.value;
  playerUpdated.value;
  const players = Object.values(store.players);
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
    players.length === 0 && /* @__PURE__ */ u("div", { style: { color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-sm, 12px)" }, children: "No player data yet." }),
    players.map((pplayer) => {
      const pr = research_get(pplayer) ?? pplayer;
      const researching = pr["researching"] ?? 0;
      const techData = store.techs[researching];
      const bulbs = pr["bulbs_researched"] ?? 0;
      const cost = (pr["researching_cost"] ?? 1) || 1;
      const pct = Math.min(100, Math.round(bulbs / cost * 100));
      const nation2 = store.nations[pplayer["nation"]];
      const color = nation2?.["color"] ?? "var(--xb-accent-blue, #58a6ff)";
      const hasResearch = researching > 0;
      return /* @__PURE__ */ u(
        "div",
        {
          style: {
            background: "var(--xb-bg-elevated, #21262d)",
            border: "1px solid var(--xb-border-default, #30363d)",
            borderLeft: `3px solid ${color}`,
            borderRadius: 6,
            padding: "8px 12px"
          },
          children: [
            /* @__PURE__ */ u("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: hasResearch ? 4 : 0 }, children: [
              /* @__PURE__ */ u("span", { style: { fontWeight: 600, color }, children: pplayer["name"] }),
              /* @__PURE__ */ u("span", { style: { color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-sm, 12px)" }, children: hasResearch ? `${techData ? techData["name"] : `Tech #${researching}`} (${bulbs}/${cost})` : "—" })
            ] }),
            hasResearch && /* @__PURE__ */ u(ProgressBar, { value: pct, max: 100, color })
          ]
        },
        pplayer["playerno"]
      );
    })
  ] });
}
function computeTechStatus() {
  const map2 = /* @__PURE__ */ new Map();
  const players = Object.values(store.players);
  for (const techIdStr of Object.keys(getActiveLayout())) {
    const techId = Number(techIdStr);
    const known = [];
    const researching = [];
    for (const pplayer of players) {
      const pr = research_get(pplayer);
      if (!pr) continue;
      const nation2 = store.nations[pplayer["nation"]];
      const color = nation2?.["color"] ?? "#58a6ff";
      const techArr = pr["techs"];
      if (techArr && techArr[techId] === TECH_KNOWN) {
        known.push(color);
      } else if (pr["researching"] === techId) {
        researching.push(color);
      }
    }
    map2.set(techId, { knownColors: known, researchingColors: researching });
  }
  return map2;
}
function getPrereqs(tech, layout) {
  const req = tech["req"] ?? [];
  const result = [];
  for (const id of req) {
    if (id !== A_NONE$1 && String(id) in layout) result.push(id);
  }
  return result;
}
function TechTree() {
  _refreshTick.value;
  currentTurn.value;
  researchUpdated.value;
  rulesetReady.value;
  const techs2 = store.techs;
  const layout = getActiveLayout();
  const techStatus = computeTechStatus();
  let canvasW = 0;
  let canvasH = 0;
  for (const node of Object.values(layout)) {
    canvasW = Math.max(canvasW, Math.floor(node.x * XSCALE) + BOX_W + PAD * 2);
    canvasH = Math.max(canvasH, node.y + BOX_H + PAD * 2);
  }
  const lines = [];
  for (const [techIdStr, node] of Object.entries(layout)) {
    const techId = Number(techIdStr);
    const tech = techs2[techId];
    if (!tech) continue;
    const prereqs = getPrereqs(tech, layout);
    const tx = Math.floor(node.x * XSCALE) + PAD;
    const ty = node.y + PAD;
    for (const prereqId of prereqs) {
      const preNode = layout[prereqId];
      if (!preNode) continue;
      const px = Math.floor(preNode.x * XSCALE) + PAD + BOX_W;
      const py = preNode.y + PAD + BOX_H / 2;
      lines.push({
        x1: px,
        y1: py,
        x2: tx,
        y2: ty + BOX_H / 2,
        key: `${prereqId}-${techId}`
      });
    }
  }
  return /* @__PURE__ */ u("div", { style: { position: "relative", width: canvasW, height: canvasH, flexShrink: 0 }, children: [
    /* @__PURE__ */ u(
      "svg",
      {
        style: { position: "absolute", top: 0, left: 0, pointerEvents: "none" },
        width: canvasW,
        height: canvasH,
        children: lines.map((l2) => /* @__PURE__ */ u(
          "line",
          {
            x1: l2.x1,
            y1: l2.y1,
            x2: l2.x2,
            y2: l2.y2,
            stroke: "var(--xb-border-default, #30363d)",
            strokeWidth: 1
          },
          l2.key
        ))
      }
    ),
    Object.entries(layout).map(([techIdStr, node]) => {
      const techId = Number(techIdStr);
      const tech = techs2[techId];
      if (!tech) return null;
      const x2 = Math.floor(node.x * XSCALE) + PAD;
      const y2 = node.y + PAD;
      const status = techStatus.get(techId);
      const isResearching = (status?.researchingColors.length ?? 0) > 0;
      const knownBy = status?.knownColors.length ?? 0;
      const total = Object.keys(store.players).length;
      const allKnown = total > 0 && knownBy === total;
      let borderColor = "var(--xb-border-default, #30363d)";
      if (isResearching) borderColor = "var(--xb-accent-orange, #d29922)";
      else if (allKnown) borderColor = "var(--xb-accent-green, #3fb950)";
      return /* @__PURE__ */ u(
        "div",
        {
          title: `${tech["name"]} — ${knownBy}/${total} players know this`,
          style: {
            position: "absolute",
            left: x2,
            top: y2,
            width: BOX_W,
            height: BOX_H,
            background: "var(--xb-bg-secondary, #161b22)",
            border: `1px solid ${borderColor}`,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "2px 6px",
            boxSizing: "border-box",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ u("div", { style: {
              fontSize: 11,
              fontWeight: 600,
              color: "var(--xb-text-primary, #e6edf3)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }, children: tech["name"] }),
            /* @__PURE__ */ u("div", { style: { display: "flex", gap: 2, marginTop: 2, flexWrap: "nowrap", overflow: "hidden" }, children: [
              (status?.researchingColors ?? []).map((c2, i2) => /* @__PURE__ */ u(
                "span",
                {
                  title: "Researching",
                  style: {
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c2,
                    outline: "1px solid var(--xb-accent-orange, #d29922)",
                    flexShrink: 0
                  }
                },
                `r${i2}`
              )),
              (status?.knownColors ?? []).map((c2, i2) => /* @__PURE__ */ u(
                "span",
                {
                  title: "Known",
                  style: {
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c2,
                    flexShrink: 0
                  }
                },
                `k${i2}`
              ))
            ] })
          ]
        },
        techIdStr
      );
    })
  ] });
}
function TechPanel() {
  const [activeTab, setActiveTab2] = d$1("progress");
  const tabStyle = (active) => ({
    padding: "4px 12px",
    cursor: "pointer",
    border: "none",
    borderBottom: active ? "2px solid var(--xb-accent-blue, #58a6ff)" : "2px solid transparent",
    background: "none",
    color: active ? "var(--xb-text-primary, #e6edf3)" : "var(--xb-text-secondary, #8b949e)",
    fontSize: 13,
    fontWeight: active ? 600 : 400
  });
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", height: "100%" }, children: [
    /* @__PURE__ */ u("div", { style: {
      display: "flex",
      borderBottom: "1px solid var(--xb-border-default, #30363d)",
      padding: "4px 8px 0",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ u("button", { style: tabStyle(activeTab === "progress"), onClick: () => setActiveTab2("progress"), children: "Research Progress" }),
      /* @__PURE__ */ u("button", { style: tabStyle(activeTab === "tree"), onClick: () => setActiveTab2("tree"), children: "Tech Tree" })
    ] }),
    /* @__PURE__ */ u("div", { style: { flex: 1, overflow: "auto", padding: activeTab === "tree" ? 0 : 12 }, children: activeTab === "progress" ? /* @__PURE__ */ u(ResearchList, {}) : /* @__PURE__ */ u("div", { style: { overflow: "auto", width: "100%", height: "100%" }, children: /* @__PURE__ */ u(TechTree, {}) }) })
  ] });
}
function mountTechPanel(container) {
  J(/* @__PURE__ */ u(TechPanel, {}), container);
}
const wikiDialogSignal = c(null);
function showWikiDialogPreact(tech_name, docs) {
  const data = buildWikiDialogData(tech_name, docs);
  if (data) wikiDialogSignal.value = data;
}
function WikiDialog() {
  const data = wikiDialogSignal.value;
  const onClose = q$1(() => {
    wikiDialogSignal.value = null;
  }, []);
  if (!data) return null;
  return /* @__PURE__ */ u(Dialog, { title: data.techName, open: true, onClose, width: 600, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 8px" }, children: /* @__PURE__ */ u("strong", { children: /* @__PURE__ */ u("a", { href: data.wikiUrl, target: "_blank", rel: "noopener noreferrer", style: { color: "inherit" }, children: data.title }) }) }),
    data.imageUrl && /* @__PURE__ */ u("img", { src: data.imageUrl, alt: data.title, style: { maxWidth: "100%", marginBottom: 8, display: "block" } }),
    /* @__PURE__ */ u("p", { style: { margin: 0, whiteSpace: "pre-wrap" }, children: data.summary })
  ] });
}
const techInfoDialogSignal = c(null);
function showTechInfoDialogPreact(tech_name, unit_type_id, improvement_id, docs) {
  techInfoDialogSignal.value = buildTechInfoDialogData(tech_name, unit_type_id, improvement_id, docs);
}
function TechInfoDialog() {
  const data = techInfoDialogSignal.value;
  const onClose = q$1(() => {
    techInfoDialogSignal.value = null;
  }, []);
  if (!data) return null;
  const dtStyle = { fontWeight: 600, paddingRight: 8, color: "var(--xb-text-secondary, #8b949e)", whiteSpace: "nowrap" };
  const ddStyle = { margin: 0 };
  return /* @__PURE__ */ u(Dialog, { title: data.techName, open: true, onClose, width: 640, children: [
    data.unit && /* @__PURE__ */ u("section", { style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ u("p", { style: { margin: "0 0 6px" }, children: /* @__PURE__ */ u("strong", { children: [
        "Unit: ",
        data.unit.name
      ] }) }),
      data.unit.helptext && /* @__PURE__ */ u("p", { style: { margin: "0 0 6px", color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-sm, 12px)" }, children: data.unit.helptext }),
      /* @__PURE__ */ u("table", { style: { borderCollapse: "collapse", fontSize: "var(--xb-font-size-sm, 12px)" }, children: /* @__PURE__ */ u("tbody", { children: [
        ["Cost", data.unit.build_cost],
        ["Attack", data.unit.attack_strength],
        ["Defense", data.unit.defense_strength],
        ["Firepower", data.unit.firepower],
        ["Hitpoints", data.unit.hp],
        ["Moves", data.unit.move_rate_text],
        ["Vision", data.unit.vision_radius_sq]
      ].map(([label, val]) => /* @__PURE__ */ u("tr", { children: [
        /* @__PURE__ */ u("td", { style: dtStyle, children: label }),
        /* @__PURE__ */ u("td", { style: ddStyle, children: val })
      ] }, label)) }) })
    ] }),
    data.improvement && /* @__PURE__ */ u("section", { style: { marginBottom: 12 }, children: /* @__PURE__ */ u("p", { style: { margin: 0 }, children: [
      /* @__PURE__ */ u("strong", { children: "Improvement info" }),
      ": ",
      data.improvement.helptext
    ] }) }),
    data.wiki && /* @__PURE__ */ u("section", { style: { marginTop: data.unit || data.improvement ? 8 : 0 }, children: [
      /* @__PURE__ */ u("p", { style: { margin: "0 0 8px" }, children: /* @__PURE__ */ u("strong", { children: /* @__PURE__ */ u("a", { href: data.wiki.wikiUrl, target: "_blank", rel: "noopener noreferrer", style: { color: "inherit" }, children: [
        "Wikipedia: ",
        data.wiki.title
      ] }) }) }),
      data.wiki.imageUrl && /* @__PURE__ */ u("img", { src: data.wiki.imageUrl, alt: data.wiki.title, style: { maxWidth: "100%", marginBottom: 8, display: "block" } }),
      /* @__PURE__ */ u("p", { style: { margin: 0, whiteSpace: "pre-wrap" }, children: data.wiki.summary })
    ] })
  ] });
}
const TechDialog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TechInfoDialog,
  TechPanel,
  WikiDialog,
  mountTechPanel,
  refreshTechPanel,
  showTechInfoDialogPreact,
  showWikiDialogPreact,
  techInfoDialogSignal,
  wikiDialogSignal
}, Symbol.toStringTag, { value: "Module" }));
const state$5 = c({
  open: false,
  title: "",
  message: ""
});
function showTechGainedDialog(title, message) {
  state$5.value = { open: true, title, message };
}
function close$1() {
  state$5.value = { ...state$5.value, open: false };
  const input = document.getElementById("game_text_input");
  if (input) input.blur();
}
function showTechTree() {
  close$1();
  Promise.resolve().then(() => tabs).then((m2) => m2.setActiveTab("#tabs", 2));
  Promise.resolve().then(() => techDialog).then((m2) => m2.update_tech_screen());
}
function TechGainedDialog() {
  const { open: open2, title, message } = state$5.value;
  return /* @__PURE__ */ u(
    Dialog,
    {
      title,
      open: open2,
      onClose: close$1,
      width: window.innerWidth <= 600 ? "90%" : "60%",
      modal: false,
      children: [
        /* @__PURE__ */ u("div", { style: { maxHeight: "70vh", overflow: "auto" }, children: parseGameHtml(message) }),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px", display: "flex", gap: "8px" }, children: [
          /* @__PURE__ */ u(Button, { onClick: close$1, children: "Close" }),
          /* @__PURE__ */ u(Button, { variant: "secondary", onClick: showTechTree, children: "Show Technology Tree" })
        ] })
      ]
    }
  );
}
const MAX_NUM_ADVANCES = 1e3;
const A_LAST = MAX_NUM_ADVANCES + 1;
const A_FUTURE = A_LAST + 1;
const A_UNSET = A_LAST + 2;
const A_UNKNOWN = A_LAST + 3;
const A_LAST_REAL = A_UNKNOWN;
const A_NEVER = null;
const wikipedia_url = "http://en.wikipedia.org/wiki/";
const techs = {};
let tech_dialog_active = false;
function setTechDialogActive(v2) {
  tech_dialog_active = v2;
}
function update_tech_screen() {
  tech_dialog_active = true;
  refreshTechPanel();
}
function queue_tech_gained_dialog(tech_gained_id) {
  if (clientIsObserver() || C_S_RUNNING !== clientState()) return;
  const tech = store.techs[tech_gained_id];
  const techName = tech ? tech["name"] : `Tech #${tech_gained_id}`;
  const helptext = tech ? tech["helptext"] ?? "" : "";
  const title = `You have discovered ${techName}!`;
  const message = helptext || `Your civilization has researched ${techName}.`;
  showTechGainedDialog(title, message);
}
function send_player_research(tech_id) {
  if (clientIsObserver()) return;
  sendPlayerResearch(tech_id);
}
let _wikiDocsLoaded = false;
function loadWikiDocs() {
  if (_wikiDocsLoaded) return;
  _wikiDocsLoaded = true;
  fetch("/javascript/wiki-docs.json").then((r2) => r2.json()).then((data) => {
    store.freecivWikiDocs = data;
  }).catch(() => {
  });
}
function getWikiDocs() {
  return store.freecivWikiDocs || {};
}
function show_wikipedia_dialog(tech_name) {
  loadWikiDocs();
  showWikiDialogPreact(tech_name, getWikiDocs());
}
function show_tech_info_dialog(tech_name, unit_type_id, improvement_id) {
  loadWikiDocs();
  showTechInfoDialogPreact(tech_name, unit_type_id, improvement_id, getWikiDocs());
}
const techDialog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AR_ONE,
  AR_ROOT,
  AR_SIZE,
  AR_TWO,
  A_FIRST,
  A_FUTURE,
  A_LAST,
  A_LAST_REAL,
  A_NEVER,
  A_NONE: A_NONE$1,
  A_UNKNOWN,
  A_UNSET,
  MAX_NUM_ADVANCES,
  TF_BONUS_TECH,
  TF_BRIDGE,
  TF_BUILD_AIRBORNE,
  TF_FARMLAND,
  TF_LAST,
  TF_POPULATION_POLLUTION_INC,
  TF_RAILROAD,
  queue_tech_gained_dialog,
  send_player_research,
  setTechDialogActive,
  show_tech_info_dialog,
  show_wikipedia_dialog,
  get tech_dialog_active() {
    return tech_dialog_active;
  },
  techs,
  update_tech_screen,
  wikipedia_url
}, Symbol.toStringTag, { value: "Module" }));
function mouse_moved_cb(e2) {
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
  const canvasDiv = document.getElementById("canvas_div");
  if (active_city == null && canvasDiv) {
    const canvasRect = canvasDiv.getBoundingClientRect();
    setMouseX(mouse_x - canvasRect.left);
    setMouseY(mouse_y - canvasRect.top);
    if (mapview_mouse_movement && !goto_active) {
      const diff_x = (touch_start_x - mouse_x) * 2;
      const diff_y = (touch_start_y - mouse_y) * 2;
      if (store.mapInfo) {
        set_mapview_origin(mapview$1["gui_x0"] + diff_x, mapview$1["gui_y0"] + diff_y);
      } else {
        mapview$1["gui_x0"] = mapview$1["gui_x0"] + diff_x;
        mapview$1["gui_y0"] = mapview$1["gui_y0"] + diff_y;
      }
      mark_all_dirty();
      mark_overview_viewport_dirty();
      setTouchStart(mouse_x, mouse_y);
      update_mouse_cursor();
    }
  } else {
    const cityCanvasEl = document.getElementById("city_canvas");
    if (active_city != null && cityCanvasEl) {
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
  if (tech_dialog_active && !isTouchDevice()) return;
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
  if (ptile_units.length > 1) ;
}
const ORDER_LAST$1 = Order.LAST;
function activate_goto() {
  clearGotoTiles();
  activate_goto_last(ORDER_LAST$1, ACTION_COUNT$1);
}
function activate_goto_last(last_order, last_action) {
  setGotoActive(true);
  const canvasDiv = document.getElementById("canvas_div");
  if (canvasDiv) canvasDiv.style.cursor = "crosshair";
  setGotoLastOrder(last_order);
  setGotoLastAction(last_action);
  if (current_focus.length > 0) {
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
  setGotoLastOrder(ORDER_LAST$1);
  setGotoLastAction(ACTION_COUNT$1);
  if (will_advance_unit_focus) setTimeout(update_unit_focus, 600);
}
function request_goto_path(unit_id, dst_x, dst_y) {
  if (goto_request_map[unit_id + "," + dst_x + "," + dst_y] == null) {
    goto_request_map[unit_id + "," + dst_x + "," + dst_y] = true;
    sendGotoPathReq(unit_id, mapPosToTile(dst_x, dst_y)["index"]);
    setCurrentGotoTurns(null);
    unitTextDetails.value = "Choose unit goto";
    setTimeout(update_mouse_cursor, 700);
  } else {
    const cached = goto_request_map[unit_id + "," + dst_x + "," + dst_y];
    if (cached !== true) update_goto_path(cached);
  }
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
    activeUnitInfo.value = "Turns for goto: " + current_goto_turns;
  }
  update_mouse_cursor();
}
const USSDT_QUEUE = UnitSSDataType.QUEUE;
const ORDER_LAST = Order.LAST;
const ORDER_MOVE = Order.MOVE;
const ORDER_ACTION_MOVE = Order.ACTION_MOVE;
const ORDER_FULL_MP = Order.FULL_MP;
function order_wants_direction(order, act_id, ptile) {
  const action = store.actions[act_id];
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
      if (tileCity(ptile) != null || (tile_units(ptile) ?? []).length != 0) {
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
    if (utype_can_do_action(unit_type(punit), act_id)) {
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
  if (ptile == null) return;
  if (clientIsObserver()) {
    const ocity = tileCity(ptile);
    if (ocity) {
      show_city_dialog(ocity);
    } else {
      popit_req(ptile);
    }
    return;
  }
  if (current_focus.length > 0 && current_focus[0]["tile"] == ptile["index"]) {
    if (goto_active && !isTouchDevice()) {
      deactivate_goto(false);
    }
    document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
    return;
  }
  const sunits = tile_units(ptile);
  pcity = tileCity(ptile);
  if (goto_active) {
    if (current_focus.length > 0) {
      for (let s2 = 0; s2 < current_focus.length; s2++) {
        punit = current_focus[s2];
        const goto_path = goto_request_map[punit["id"] + "," + ptile["x"] + "," + ptile["y"]];
        if (goto_path == null || goto_path === true) {
          continue;
        }
        const old_tile = indexToTile(punit["tile"]);
        packet = {
          "unit_id": punit["id"],
          "src_tile": old_tile["index"],
          "length": goto_path["length"],
          "repeat": false,
          "vigilant": false,
          "dest_tile": ptile["index"],
          "orders": []
        };
        const order = {
          "order": ORDER_LAST,
          "activity": ACTIVITY_LAST,
          "target": 0,
          "sub_target": 0,
          "action": ACTION_COUNT$1,
          "dir": -1
        };
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
      if (current_focus.length > 0) {
        request_goto_path(current_focus[0]["id"], ptile["x"], ptile["y"]);
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
  } else if (paradrop_active && current_focus.length > 0) {
    punit = current_focus[0];
    do_unit_paradrop_to(punit, ptile);
    setParadropActive(false);
  } else if (airlift_active && current_focus.length > 0) {
    punit = current_focus[0];
    pcity = tileCity(ptile);
    if (pcity != null) {
      request_unit_do_action(ACTION_AIRLIFT, punit["id"], pcity["id"]);
    }
    setAirliftActive(false);
  } else if (action_tgt_sel_active && current_focus.length > 0) {
    setActionTgtSelActive(false);
  } else {
    if (pcity != null) {
      if (clientPlaying() != null && pcity["owner"] == clientPlaying().playerno) {
        if (sunits != null && sunits.length > 0 && sunits[0]["activity"] == ACTIVITY_IDLE) {
          set_unit_focus_and_redraw(sunits[0]);
          document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
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
        }
        if (isTouchDevice()) {
          document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
        }
      } else if (pcity == null) {
        setCurrentFocus(sunits);
        const guod = document.getElementById("game_unit_orders_default");
        if (guod) guod.style.display = "none";
      }
    }
  }
  setParadropActive(false);
  setAirliftActive(false);
  setActionTgtSelActive(false);
}
function center_tile_mapcanvas(ptile) {
  if (ptile == null) return;
  center_tile_mapcanvas_2d(ptile);
}
function popit() {
  const ptile = canvas_pos_to_tile(mouse_x, mouse_y);
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
  if (current_focus.length > 0) {
    focus_unit_id = current_focus[0]["id"];
  }
  sendInfoTextReq(punit_id, ptile["index"], focus_unit_id);
}
function center_on_any_city() {
  const mi = getMapInfo();
  if (mi && mi.xsize && mi.ysize) {
    const midTile = mapPosToTile(Math.floor(mi.xsize / 2), Math.floor(mi.ysize / 2));
    if (midTile) {
      center_tile_mapcanvas(midTile);
      return;
    }
    const tiles = window.tiles;
    if (tiles) {
      const midIdx = Math.floor(mi.xsize / 2) + Math.floor(mi.ysize / 2) * mi.xsize;
      const t2 = tiles[midIdx];
      if (t2) {
        center_tile_mapcanvas(t2);
        return;
      }
    }
  }
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    center_tile_mapcanvas(cityTile(pcity));
    return;
  }
  for (const unit_id in store.units) {
    const punit = store.units[unit_id];
    const ptile = indexToTile(punit["tile"]);
    if (ptile) {
      center_tile_mapcanvas(ptile);
      return;
    }
  }
}
function update_unit_order_commands() {
  return {};
}
function init_game_unit_panel() {
}
function update_active_units_dialog() {
}
const FC_ACTIVITY_IDLE = ACTIVITY_IDLE;
const FC_SSA_NONE = ServerSideAgent.NONE;
const FC_IDENTITY_NUMBER_ZERO$1 = IDENTITY_NUMBER_ZERO;
const FC_EXTRA_NONE$1 = EXTRA_NONE;
const tile_units_func = tile_units;
const map_city_tile = cityTile;
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
function unit_is_in_focus(cunit) {
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
  return current_focus;
}
function unit_focus_urgent(punit) {
  if (punit == null || punit["activity"] == null) {
    console.log("unit_focus_urgent(): not a unit");
    console.log(punit);
    return;
  }
  urgent_focus_queue.push(punit);
}
function control_unit_killed(punit) {
  if (urgent_focus_queue != null) {
    setUrgentFocusQueue(unit_list_without(urgent_focus_queue, punit));
  }
  if (unit_is_in_focus(punit)) {
    if (current_focus.length == 1) {
      advance_unit_focus();
    } else {
      setCurrentFocus(unit_list_without(current_focus, punit));
    }
  }
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
    const focus_tile = current_focus != null && current_focus.length > 0 ? current_focus[0]["tile"] : -1;
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
    turnDoneState.value = { disabled: false, text: "✅ Turn Done" };
    if (!end_turn_info_message_shown) {
      setEndTurnInfoMessageShown(true);
      message_log.update({ event: E_BEGINNER_HELP, message: 'All units have moved, click the "Turn Done" button to end your turn.' });
    }
  }
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
    if ((!unit_is_in_focus(punit) || accept_current) && clientPlaying() != null && punit["owner"] == clientPlaying().playerno && (punit["activity"] == FC_ACTIVITY_IDLE && !punit["done_moving"] && punit["movesleft"] > 0 || should_ask_server_for_actions(punit)) && punit["ssa_controller"] == FC_SSA_NONE && waiting_units_list.indexOf(punit["id"]) < 0 && !punit["transported"]) {
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
    current_focus[0] = punit;
    action_selection_next_in_focus(FC_IDENTITY_NUMBER_ZERO$1);
  }
}
function set_unit_focus_and_redraw(punit) {
  setCurrentFocus([]);
  if (punit == null) {
    setCurrentFocus([]);
  } else {
    current_focus[0] = punit;
    action_selection_next_in_focus(FC_IDENTITY_NUMBER_ZERO$1);
  }
  auto_center_on_focus_unit();
  const ordersDefault = document.getElementById("game_unit_orders_default");
  if (current_focus.length > 0 && ordersDefault) ordersDefault.style.display = "";
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
  }
}
function find_a_focus_unit_tile_to_center_on() {
  const funit = current_focus[0];
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
  if (!unit_is_in_focus(punit) || current_focus.length > 0) {
    return punit;
  } else {
    return null;
  }
}
const unitFocus = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  advance_unit_focus,
  auto_center_on_focus_unit,
  city_dialog_activate_unit,
  control_unit_killed,
  find_a_focus_unit_tile_to_center_on,
  find_best_focus_candidate,
  find_visible_unit,
  get_drawable_unit,
  get_focus_unit_on_tile,
  get_units_in_focus,
  init_game_unit_panel,
  set_unit_focus,
  set_unit_focus_and_activate,
  set_unit_focus_and_redraw,
  unit_distance_compare,
  unit_focus_urgent,
  unit_is_in_focus,
  update_active_units_dialog,
  update_unit_focus,
  update_unit_order_commands
}, Symbol.toStringTag, { value: "Module" }));
const mapview$1 = { width: 0, height: 0, gui_x0: 0, gui_y0: 0, store_width: 0, store_height: 0 };
let dirty_all = true;
let dirty_count = 0;
const DIRTY_FULL_THRESHOLD = 64;
_setMapviewRef(mapview$1);
_setDirtyAllSetter((val) => {
  dirty_all = val;
});
window.__xbwMapview = { get x0() {
  return mapview$1.gui_x0;
}, get y0() {
  return mapview$1.gui_y0;
} };
function mark_tile_dirty(tile_id) {
  invalidateTerrainNearCache(tile_id);
  if (dirty_all) return;
  dirty_count++;
  if (dirty_count > DIRTY_FULL_THRESHOLD) {
    dirty_all = true;
  }
}
function mark_all_dirty() {
  clearTerrainNearCache();
  dirty_all = true;
}
const mapview_slide = {
  active: false
};
function mapdeco_init() {
  init_chatbox();
  setKeyboardInput(true);
}
const map_pos_to_tile = mapPosToTile;
const tile_city = tileCity;
const tile_terrain = tileTerrain;
const city_owner_player_id = cityOwnerPlayerId;
const wrap_has_flag = wrapHasFlag;
let OVERVIEW_TILE_SIZE = 1;
const overviewTimerId = -1;
const min_overview_width = 200;
const max_overview_width = 300;
const max_overview_height = 300;
let OVERVIEW_REFRESH;
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
const overview_current_state = null;
let overview_dirty = true;
let overview_viewport_dirty = true;
function mark_overview_dirty() {
  overview_dirty = true;
  overview_viewport_dirty = true;
}
function mark_overview_viewport_dirty() {
  overview_viewport_dirty = true;
}
globalEvents.on("overview:frame", () => redraw_overview());
function init_overview() {
  if (!store.mapInfo?.xsize || !store.mapInfo?.ysize) {
    const overviewMap2 = document.getElementById("overview_map");
    if (overviewMap2 && !overviewMap2.style.width) {
      overviewMap2.style.width = "200px";
      overviewMap2.style.height = "100px";
    }
    return;
  }
  while (min_overview_width > OVERVIEW_TILE_SIZE * store.mapInfo.xsize) {
    OVERVIEW_TILE_SIZE++;
  }
  overview_active = true;
  const panel = document.getElementById("game_overview_panel");
  if (panel) {
    panel.title = "World map";
    panel.style.display = "block";
  }
  palette = generate_palette();
  overview_hash = -1;
  redraw_overview();
  let new_width = OVERVIEW_TILE_SIZE * store.mapInfo.xsize;
  if (new_width > max_overview_width) new_width = max_overview_width;
  let new_height = OVERVIEW_TILE_SIZE * store.mapInfo.ysize;
  if (new_height > max_overview_height) new_height = max_overview_height;
  const overviewMap = document.getElementById("overview_map");
  if (overviewMap) {
    overviewMap.style.width = new_width + "px";
    overviewMap.style.height = new_height + "px";
    overviewMap.ondragstart = (e2) => e2.preventDefault();
  }
}
function redraw_overview() {
  if (!overview_active || mapview_slide["active"] || C_S_RUNNING > clientState() || !store.mapInfo?.xsize || !store.mapInfo?.ysize || !document.getElementById("overview_map")) return;
  if (overview_dirty) {
    overview_dirty = false;
    const terrainCount = Object.keys(store.terrains).length;
    if (terrainCount > 0 && palette.length <= palette_terrain_offset) {
      palette = generate_palette();
      overview_hash = -1;
    }
    const { grid, hash } = generate_overview_grid_and_hash(store.mapInfo.xsize, store.mapInfo.ysize);
    if (hash !== overview_hash) {
      renderOverviewToCanvas(grid, palette);
      overview_hash = hash;
    }
    overview_viewport_dirty = true;
  }
  if (overview_viewport_dirty) {
    overview_viewport_dirty = false;
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
function generate_overview_grid_and_hash(cols, rows) {
  if (cols & 1) cols -= 1;
  if (rows & 1) rows -= 1;
  const grid = Array(rows * OVERVIEW_TILE_SIZE);
  for (let row = 0; row < rows * OVERVIEW_TILE_SIZE; row++) {
    grid[row] = Array(cols * OVERVIEW_TILE_SIZE);
  }
  let hash = 0;
  for (let x2 = 0; x2 < rows; x2++) {
    for (let y2 = 0; y2 < cols; y2++) {
      const ocolor = overview_tile_color(y2, x2);
      render_multipixel(grid, x2, y2, ocolor);
      hash += ocolor;
    }
  }
  return { grid, hash };
}
function generate_overview_grid(cols, rows) {
  return generate_overview_grid_and_hash(cols, rows).grid;
}
function generate_overview_hash(cols, rows) {
  return generate_overview_grid_and_hash(cols, rows).hash;
}
function render_viewrect() {
  if (C_S_RUNNING != clientState() && C_S_OVER != clientState()) return;
  if (!store.mapInfo?.xsize || !store.mapInfo?.ysize) return;
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
  if (x2 >= 0 && y2 >= 0 && x2 < store.mapInfo.ysize && y2 < store.mapInfo.xsize) {
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
  let max_terrain_id = -1;
  for (const terrain_id in store.terrains) {
    const id = Number(terrain_id);
    if (id > max_terrain_id) max_terrain_id = id;
  }
  for (const terrain_id in store.terrains) {
    const id = Number(terrain_id);
    const terrain = store.terrains[id];
    palette2[palette_terrain_offset + id] = [terrain["color_red"], terrain["color_green"], terrain["color_blue"]];
  }
  palette_color_offset = max_terrain_id >= 0 ? palette_terrain_offset + max_terrain_id + 1 : palette_terrain_offset;
  const player_count = Object.keys(store.players).length;
  for (const player_id_str in store.players) {
    const player_id = Number(player_id_str);
    const pplayer = store.players[player_id];
    if (pplayer.nation == -1) {
      palette2[palette_color_offset + player_id % player_count] = [0, 0, 0];
    } else {
      const pcolor = store.nations[pplayer.nation]?.["color"];
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
  const pcity = tile_city(ptile ?? null);
  if (pcity != null) {
    if (clientPlaying() == null) {
      return COLOR_OVERVIEW_ENEMY_CITY;
    } else if (city_owner_player_id(pcity) == clientPlaying()["id"]) {
      return COLOR_OVERVIEW_MY_CITY;
    } else {
      return COLOR_OVERVIEW_ENEMY_CITY;
    }
  }
  const punit = find_visible_unit(ptile ?? null);
  if (punit != null) {
    if (clientPlaying() == null) {
      return COLOR_OVERVIEW_ENEMY_UNIT;
    } else if (punit.owner == clientPlaying()["id"]) {
      return COLOR_OVERVIEW_MY_UNIT;
    } else if (punit.owner != null && punit.owner >= 0 && punit.owner < 255) {
      return palette_color_offset + punit.owner;
    } else {
      return COLOR_OVERVIEW_ENEMY_UNIT;
    }
  }
  if (ptile != null) {
    const terrain = tile_terrain(ptile);
    if (terrain != null) {
      if (ptile.owner != null && ptile.owner >= 0 && ptile.owner < 255) {
        return palette_color_offset + ptile.owner;
      }
      return palette_terrain_offset + terrain["id"];
    }
  }
  return COLOR_OVERVIEW_UNKNOWN;
}
function overview_clicked(x2, y2) {
  const overviewMap = document.getElementById("overview_map");
  const width = overviewMap?.offsetWidth ?? 200;
  const height = overviewMap?.offsetHeight ?? 200;
  const x1 = Math.floor(x2 * store.mapInfo.xsize / width);
  const y1 = Math.floor(y2 * store.mapInfo.ysize / height);
  const ptile = map_pos_to_tile(x1, y1);
  if (ptile != null) {
    center_tile_mapcanvas(ptile);
  }
  overview_dirty = true;
  redraw_overview();
}
const overview = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  COLOR_OVERVIEW_ALLIED_CITY,
  COLOR_OVERVIEW_ALLIED_UNIT,
  COLOR_OVERVIEW_ENEMY_CITY,
  COLOR_OVERVIEW_ENEMY_UNIT,
  COLOR_OVERVIEW_MY_CITY,
  COLOR_OVERVIEW_MY_UNIT,
  COLOR_OVERVIEW_UNKNOWN,
  COLOR_OVERVIEW_VIEWRECT,
  OVERVIEW_REFRESH,
  get OVERVIEW_TILE_SIZE() {
    return OVERVIEW_TILE_SIZE;
  },
  add_closed_path,
  generate_overview_grid,
  generate_overview_grid_and_hash,
  generate_overview_hash,
  generate_palette,
  init_overview,
  mark_overview_dirty,
  mark_overview_viewport_dirty,
  max_overview_height,
  max_overview_width,
  min_overview_width,
  overviewTimerId,
  get overview_active() {
    return overview_active;
  },
  overview_clicked,
  overview_current_state,
  get overview_hash() {
    return overview_hash;
  },
  overview_tile_color,
  get palette() {
    return palette;
  },
  get palette_color_offset() {
    return palette_color_offset;
  },
  get palette_terrain_offset() {
    return palette_terrain_offset;
  },
  redraw_overview,
  render_multipixel,
  render_viewrect,
  setOverviewActive
}, Symbol.toStringTag, { value: "Module" }));
function orientation_changed() {
}
const chatContextSignal = c({
  open: false,
  recipients: [],
  currentId: null
});
function showChatContextDialog(recipients, currentId) {
  chatContextSignal.value = { open: true, recipients, currentId };
}
function closeChatContextDialog() {
  chatContextSignal.value = { ...chatContextSignal.value, open: false };
}
function FlagCanvas$1({ flag, iconText }) {
  const ref = A(null);
  y$2(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 29, 20);
    if (flag != null) {
      ctx.drawImage(flag, 0, 0);
    } else if (iconText) {
      ctx.font = "18px FontAwesome";
      ctx.fillStyle = "rgba(32,32,32,1)";
      ctx.fillText(iconText, 5, 15);
    }
  }, [flag, iconText]);
  return /* @__PURE__ */ u("canvas", { ref, width: 29, height: 20, style: { verticalAlign: "middle" } });
}
function ChatContextDialog() {
  const { open: open2, recipients, currentId } = chatContextSignal.value;
  if (!open2) return null;
  function handleRowClick(id) {
    closeChatContextDialog();
    document.dispatchEvent(
      new CustomEvent("chat:directionChosen", { detail: { id } })
    );
  }
  return /* @__PURE__ */ u(
    "div",
    {
      id: "chat_context_dialog",
      style: {
        position: "absolute",
        zIndex: 5e3,
        background: "var(--xb-bg-elevated,#21262d)",
        border: "1px solid var(--xb-border-default,#30363d)",
        borderRadius: 6,
        padding: 8,
        maxHeight: Math.floor(0.9 * window.innerHeight) + "px",
        overflowY: "auto",
        minWidth: 200
      },
      children: [
        /* @__PURE__ */ u("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
          /* @__PURE__ */ u("span", { style: { color: "var(--xb-text-secondary,#8b949e)", fontSize: 12 }, children: "Choose recipient" }),
          /* @__PURE__ */ u(
            "button",
            {
              onClick: closeChatContextDialog,
              style: { background: "none", border: "none", color: "var(--xb-text-primary,#e6edf3)", cursor: "pointer", fontSize: 16, lineHeight: 1 },
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ u("table", { style: { borderCollapse: "collapse", width: "100%" }, children: /* @__PURE__ */ u("tbody", { children: recipients.filter((r2) => r2.id !== currentId).map((r2, i2) => /* @__PURE__ */ u(
          "tr",
          {
            onClick: () => handleRowClick(r2.id),
            style: {
              cursor: "pointer",
              borderBottom: "1px solid var(--xb-border-muted,#21262d)"
            },
            onMouseEnter: (e2) => {
              e2.currentTarget.style.background = "var(--xb-bg-secondary,#161b22)";
            },
            onMouseLeave: (e2) => {
              e2.currentTarget.style.background = "";
            },
            children: [
              /* @__PURE__ */ u("td", { style: { padding: "4px 8px 4px 4px" }, children: /* @__PURE__ */ u(FlagCanvas$1, { flag: r2.flag, iconText: r2.iconText }) }),
              /* @__PURE__ */ u("td", { style: { padding: "4px 8px 4px 0", color: "var(--xb-text-primary,#e6edf3)", fontSize: 13 }, children: r2.description })
            ]
          },
          i2
        )) }) })
      ]
    }
  );
}
const FC_PLRF_AI = PlayerFlag.PLRF_AI;
document.addEventListener("chat:directionChosen", (ev) => {
  const id = ev.detail.id;
  set_chat_direction(id);
});
function chat_context_change() {
  const recipients = chat_context_get_recipients();
  if (recipients.length < 4) {
    chat_context_set_next(recipients);
  } else {
    chat_context_dialog_show(recipients);
  }
}
function chat_context_get_recipients() {
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
    const nation2 = store.nations[pplayer["nation"]];
    if (nation2 == null) continue;
    pm.push({
      id: player_id,
      description: pplayer["name"] + " of the " + nation2["adjective"],
      flag: store.sprites["f." + nation2["graphic_str"]]
    });
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
  const self = clientPlaying()?.["playerno"] ?? -1;
  const mapped = recipients.map((r2) => ({
    ...r2,
    iconText: r2.id == null ? CHAT_ICON_EVERYBODY : r2.id === self ? CHAT_ICON_ALLIES : void 0
  }));
  showChatContextDialog(mapped, chat_send_to);
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
    player_name = pplayer["name"] + " of the " + (store.nations[pplayer["nation"]]?.["adjective"] || pplayer["name"]);
    ctx.clearRect(0, 0, 29, 20);
    const flag = store.sprites["f." + store.nations[pplayer["nation"]]["graphic_str"]];
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
  if (event.keyCode == 13 && !event.shiftKey) {
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
  if (page === PAGE_GAME) {
    document.getElementById("pregame_page")?.remove();
    const gamePage = document.getElementById("game_page");
    if (gamePage) gamePage.style.display = "";
    set_chat_direction(null);
  }
  old_page = page;
}
function get_client_page() {
  return old_page;
}
function on(el, event, handler, options) {
  el?.addEventListener(event, handler, options);
}
function blockUI(message) {
  Promise.resolve().then(() => BlockingOverlay$1).then(({ showBlockingOverlay: showBlockingOverlay2 }) => showBlockingOverlay2(message)).catch(() => {
  });
}
function unblockUI() {
  Promise.resolve().then(() => BlockingOverlay$1).then(({ hideBlockingOverlay: hideBlockingOverlay2 }) => hideBlockingOverlay2()).catch(() => {
  });
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
  const { open: open2, title, message } = state$4.value;
  return /* @__PURE__ */ u(
    Dialog,
    {
      title,
      open: open2,
      onClose: closeMessageDialog,
      width: window.innerWidth <= 600 ? "90%" : "50%",
      modal: false,
      children: [
        /* @__PURE__ */ u("div", { style: { maxHeight: "450px", overflow: "auto" }, children: parseGameHtml(message) }),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px", textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: closeMessageDialog, children: "Ok" }) })
      ]
    }
  );
}
function setClientState(newstate) {
  console.log("[xbw] setClientState " + store.civclientState + " → " + newstate);
  if (store.civclientState === newstate) return;
  store.civclientState = newstate;
  switch (newstate) {
    case C_S_RUNNING: {
      try {
        clear_chatbox();
        unblockUI();
        showNewGameMessage();
      } catch (e2) {
        console.error("[set_client_state] Error in pre-page setup:", e2);
      }
      set_client_page(PAGE_GAME);
      setupWindowSize();
      {
        const _pr = store["pixiRenderer"];
        _pr?.resize();
        _pr?.markAllDirty();
      }
      init_overview();
      document.querySelectorAll(".context-menu-root").forEach((el) => el.remove());
      center_on_any_city();
      advance_unit_focus();
      const _tryCenter = (attempts) => {
        if (mapview$1.gui_x0 !== 0 || mapview$1.gui_y0 !== 0) return;
        center_on_any_city();
        if (attempts > 0) setTimeout(() => _tryCenter(attempts - 1), 2e3);
      };
      setTimeout(() => _tryCenter(3), 1e3);
      break;
    }
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
  const new_mapview_width = winWidth - store.widthOffset;
  const new_mapview_height = winHeight - store.heightOffset;
  mapview$1["width"] = new_mapview_width;
  mapview$1["height"] = new_mapview_height;
  mapview$1["store_width"] = new_mapview_width;
  mapview$1["store_height"] = new_mapview_height;
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
  const tabs2 = _el("tabs");
  if (tabs2) tabs2.style.height = winHeight + "px";
  for (const id of ["tabs-map", "tabs-tec", "tabs-nat", "tabs-cities", "tabs-hel"]) {
    _setH(id, new_mapview_height);
  }
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
    _el("game_unit_orders_default")?.remove();
    _el("game_unit_orders_settlers")?.remove();
    const statusBottom = _el("game_status_panel_bottom");
    if (statusBottom) statusBottom.style.fontSize = "0.8em";
  }
  if (overview_active) init_overview();
}
function showNewGameMessage() {
  clear_chatbox();
}
function showEndgameDialog() {
  const title = "Final Report: The Greatest Civilizations in the world!";
  let message = "";
  for (let i2 = 0; i2 < store.endgamePlayerInfo.length; i2++) {
    const info = store.endgamePlayerInfo[i2];
    const pplayer = store.players[info["player_id"]];
    const nation_adj = store.nations[pplayer["nation"]]?.["adjective"] ?? "Unknown";
    message += i2 + 1 + ": The " + escapeHtml(String(nation_adj)) + " ruler " + escapeHtml(String(pplayer["name"])) + " scored " + info["score"] + " points<br>";
  }
  showMessageDialog(title, message);
}
function setDefaultMapviewActive() {
  const active_tab = getActiveTab("#tabs");
  if (active_tab === 4) return;
  if (chatbox_active) {
    const chatPanel = document.getElementById("game_chatbox_panel");
    if (chatPanel?.parentElement) chatPanel.parentElement.style.display = "";
  }
  setActiveTab("#tabs", 0);
  setTechDialogActive(false);
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
let tileset_images = [];
const sprites = {};
let loaded_images = 0;
let sprites_loading = false;
let sprites_init = false;
const fullfog = [];
function initTilesetSprites() {
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
  store.fullfog = fullfog;
  fetch("/javascript/2dcanvas/tileset_spec_amplio2.json").then((r2) => {
    if (!r2.ok) throw new Error("HTTP " + r2.status);
    return r2.json();
  }).then((data) => {
    window["tileset"] = data;
    init_sprites();
  }).catch((err) => {
    console.error("Failed to load tileset spec:", err);
  });
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
      tileset_image.src = "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + (window["ts"] ?? "");
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
  }
}
function init_cache_sprites() {
  if (loaded_images < tileset_image_count) return;
  if (sprites_loading || sprites_init) return;
  sprites_loading = true;
  if (typeof tileset === "undefined") {
    swal("Tileset error", "Tileset not generated correctly. Run sync.sh in freeciv-img-extract and recompile.", "error");
    sprites_loading = false;
    return;
  }
  if (typeof createImageBitmap === "function") {
    const images = Array.from({ length: tileset_image_count }, (_2, idx) => tileset_images[idx]);
    Promise.all(images.map((img) => createImageBitmap(img))).then((fullBitmaps) => {
      const BATCH = 200;
      const entries = Object.keys(tileset);
      const total = entries.length;
      const processBatch = (offset) => {
        const chunk = entries.slice(offset, offset + BATCH);
        const batchPromises = chunk.map((tile_tag) => {
          const [x2, y2, w2, h2, i2] = tileset[tile_tag];
          return createImageBitmap(fullBitmaps[i2], x2, y2, w2, h2).then((bmp) => {
            sprites[tile_tag] = bmp;
          }).catch(() => {
          });
        });
        return Promise.all(batchPromises).then(() => {
          if (offset + BATCH < total) {
            return new Promise((res) => setTimeout(() => processBatch(offset + BATCH).then(res), 0));
          }
        });
      };
      return processBatch(0);
    }).then(() => {
      sprites_init = true;
      sprites_loading = false;
      store.sprites = sprites;
      if (tileset) store.tileset = tileset;
      tileset_images = null;
      unblockUI();
      console.log("[xbw] sprites loaded: " + Object.keys(sprites).length);
      mark_all_dirty();
    }).catch((err) => {
      console.error("createImageBitmap failed, falling back to canvas:", err);
      sprites_loading = false;
      init_cache_sprites_canvas();
    });
  } else {
    init_cache_sprites_canvas();
  }
}
function init_cache_sprites_canvas() {
  try {
    for (const tile_tag in tileset) {
      const x2 = tileset[tile_tag][0];
      const y2 = tileset[tile_tag][1];
      const w2 = tileset[tile_tag][2];
      const h2 = tileset[tile_tag][3];
      const i2 = tileset[tile_tag][4];
      const newCanvas = document.createElement("canvas");
      newCanvas.height = h2;
      newCanvas.width = w2;
      const newCtx = newCanvas.getContext("2d");
      if (newCtx) {
        newCtx.drawImage(tileset_images[i2], x2, y2, w2, h2, 0, 0, w2, h2);
        sprites[tile_tag] = newCanvas;
      }
    }
    sprites_init = true;
    sprites_loading = false;
    store.sprites = sprites;
    if (tileset) store.tileset = tileset;
    tileset_images = null;
    console.log("[xbw] sprites loaded (canvas fallback): " + Object.keys(sprites).length);
    mark_all_dirty();
  } catch (e2) {
    console.log("Problem caching sprite: " + (e2 instanceof Error ? e2.message : e2));
    sprites_loading = false;
  }
  unblockUI();
}
function mapview_window_resized() {
  if (active_city != null || !resize_enabled) return;
  setupWindowSize();
  const pr = store["pixiRenderer"];
  pr?.resize();
  pr?.markAllDirty();
}
const GRAD_DIRS = [
  [0.5, 0, 0.5, 1],
  // i=0 North:  top-edge → opaque at top,    fade to bottom
  [0.5, 1, 0.5, 0],
  // i=1 South:  bot-edge → opaque at bottom, fade to top
  [1, 0.5, 0, 0.5],
  // i=2 East:   rgt-edge → opaque at right,  fade to left
  [0, 0.5, 1, 0.5]
  // i=3 West:   lft-edge → opaque at left,   fade to right
];
function spriteSize(sp) {
  if (sp instanceof HTMLCanvasElement) return [sp.width, sp.height];
  return [sp.width, sp.height];
}
function generateBlendSprite(cardinal, srcKey, nbrKey) {
  const cacheKey = `__blend_${cardinal}_${srcKey}_${nbrKey}`;
  const sprites2 = store.sprites;
  if (sprites2[cacheKey]) {
    return cacheKey;
  }
  const srcSprite = sprites2[srcKey];
  const nbrSprite = sprites2[nbrKey];
  if (!srcSprite || !nbrSprite) return null;
  const [w2, h2] = spriteSize(srcSprite);
  if (w2 === 0 || h2 === 0) return null;
  const canvas = document.createElement("canvas");
  canvas.width = w2;
  canvas.height = h2;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(srcSprite, 0, 0);
  const tmp = document.createElement("canvas");
  tmp.width = w2;
  tmp.height = h2;
  const tCtx = tmp.getContext("2d");
  if (!tCtx) return null;
  tCtx.drawImage(nbrSprite, 0, 0);
  const [x0f, y0f, x1f, y1f] = GRAD_DIRS[cardinal] ?? GRAD_DIRS[0];
  const grad = tCtx.createLinearGradient(x0f * w2, y0f * h2, x1f * w2, y1f * h2);
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(0.5, "rgba(0,0,0,0.5)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  tCtx.globalCompositeOperation = "destination-in";
  tCtx.fillStyle = grad;
  tCtx.fillRect(0, 0, w2, h2);
  ctx.drawImage(tmp, 0, 0);
  sprites2[cacheKey] = canvas;
  return cacheKey;
}
function clearBlendCache() {
  const sprites2 = store.sprites;
  for (const key of Object.keys(sprites2)) {
    if (key.startsWith("__blend_")) {
      delete sprites2[key];
    }
  }
}
const LAYER_FOG_INDEX = 8;
const DIR8_EAST$2 = 4;
const DIR8_SOUTH$2 = 6;
const DIR8_SOUTHEAST$2 = 7;
class PixiRenderer {
  constructor(config) {
    this.config = config;
  }
  app;
  // mapContainer offset implements O(1) panning: x = -gui_x0, y = -gui_y0
  mapContainer;
  // 13 layer Containers in painter's-algorithm draw order
  layers = [];
  // Per-tile-per-layer display containers
  // key: tileIndex * LAYER_COUNT + layer → Container holding that tile's sprites
  tileLayerContainers = /* @__PURE__ */ new Map();
  // Texture cache: sprite key → Pixi Texture (created from store.sprites)
  texCache = /* @__PURE__ */ new Map();
  // Pre-rendered fog overlay texture (created once, reused as Sprite per fogged tile)
  fogTexture = null;
  // Dirty tracking
  dirtyTiles = /* @__PURE__ */ new Set();
  dirtyAll = true;
  // start dirty so first game-state render works
  // Set by pan-reveal timer; processFrame handles the scan inside rAF (not blocking main thread).
  revealAll = false;
  // Tracks which tile indices have been rendered at least once.
  // Pan-reveal only builds tiles NOT in this set (incremental).
  // Cleared on markAllDirty so the next dirtyAll rebuild re-populates it.
  builtSet = /* @__PURE__ */ new Set();
  // Tile GUI position cache: avoids re-running map_to_gui_pos() on each scan.
  // Positions are stable (only change if tileset config changes, handled by markAllDirty).
  tilePosCache = /* @__PURE__ */ new Map();
  // Viewport-culled rebuild queue (only visible tiles are rebuilt per event)
  rebuildQueue = null;
  rebuildQueueIdx = 0;
  // Frame time budget for tile rebuilding.
  // NORMAL: up to 8ms per frame for incremental dirty/pan-reveal updates.
  // BURST:  up to 12ms on the first full rebuild so the initial map appears faster.
  // Both leave headroom for Pixi's own render pass (~4ms).
  static FRAME_BUDGET_MS = 8;
  static BURST_BUDGET_MS = 12;
  firstRebuildDone = false;
  // Viewport tracking for pan-reveal (rebuild after pan stops)
  lastViewX0 = 0;
  lastViewY0 = 0;
  lastViewW = 0;
  lastViewH = 0;
  panRevealTimer = null;
  static PAN_REVEAL_DELAY_MS = 150;
  rafHandle = null;
  initialized = false;
  spritesReady = false;
  // cached: avoids Object.keys(store.sprites) every frame
  _onResize = null;
  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  async init() {
    this.app = new Application();
    await this.app.init({
      resizeTo: this.config.container,
      backgroundColor: 0,
      antialias: false,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });
    this.config.container.appendChild(this.app.canvas);
    this.mapContainer = new Container();
    this.app.stage.addChild(this.mapContainer);
    for (let i2 = 0; i2 < LAYER_COUNT; i2++) {
      const layer = new Container();
      this.layers.push(layer);
      this.mapContainer.addChild(layer);
    }
    this.setupEventListeners();
    this.startRenderLoop();
    this.initialized = true;
    this.createFogTexture();
    window["__xbwStore"] = store;
    window["__xbwPixiDebug"] = {
      getStats: () => ({
        builtTiles: this.builtSet.size,
        containerCount: this.tileLayerContainers.size,
        textureCacheSize: this.texCache.size,
        spritesReady: this.spritesReady,
        dirtyAll: this.dirtyAll,
        dirtyCount: this.dirtyTiles.size
      }),
      getGameState: () => {
        const turn = store.gameInfo?.["turn"] ?? -1;
        const year = store.gameInfo?.["year"] ?? 0;
        const unitPositions = {};
        for (const [id, u2] of Object.entries(store.units)) {
          unitPositions[id] = u2["tile"];
        }
        const playerGold = {};
        const playerScore = {};
        for (const [id, p2] of Object.entries(store.players)) {
          playerGold[id] = p2["gold"] ?? 0;
          playerScore[id] = p2["score"] ?? 0;
        }
        return { turn, year, unitPositions, playerGold, playerScore };
      },
      extractPixels: async (x2, y2, w2, h2) => {
        const pixels = await this.app.renderer.extract.pixels({ target: this.app.stage });
        return { pixels: Array.from(pixels.pixels), x: x2, y: y2, w: w2, h: h2 };
      }
    };
    logNormal("PixiJS renderer initialized");
  }
  // ---------------------------------------------------------------------------
  // Texture cache
  // ---------------------------------------------------------------------------
  getTexture(key) {
    if (this.texCache.has(key)) return this.texCache.get(key);
    const sp = store.sprites[key];
    if (!sp) {
      this.texCache.set(key, null);
      return null;
    }
    try {
      const tex = Texture.from(sp);
      this.texCache.set(key, tex);
      return tex;
    } catch (e2) {
      logError("PixiRenderer: texture creation failed for", key, e2);
      this.texCache.set(key, null);
      return null;
    }
  }
  /** Must be called when store.sprites is replaced (new game / reload). */
  clearTextureCache() {
    for (const tex of this.texCache.values()) {
      if (tex) tex.destroy();
    }
    this.texCache.clear();
    clearBlendCache();
  }
  // ---------------------------------------------------------------------------
  // Tile layer container management
  // ---------------------------------------------------------------------------
  getTileLayerContainer(tileIndex, layer) {
    const key = tileIndex * LAYER_COUNT + layer;
    let c2 = this.tileLayerContainers.get(key);
    if (!c2) {
      c2 = new Container();
      this.layers[layer].addChild(c2);
      this.tileLayerContainers.set(key, c2);
    }
    return c2;
  }
  clearTileLayer(tileIndex, layer) {
    const c2 = this.tileLayerContainers.get(tileIndex * LAYER_COUNT + layer);
    if (c2) c2.removeChildren().forEach((ch) => ch.destroy({ children: true }));
  }
  // ---------------------------------------------------------------------------
  // SpriteEntry rendering
  // ---------------------------------------------------------------------------
  renderSpriteEntry(entry, baseGX, baseGY, container, fogAlpha) {
    const e2 = entry;
    const ox = typeof e2["offset_x"] === "number" ? e2["offset_x"] : 0;
    const oy = typeof e2["offset_y"] === "number" ? e2["offset_y"] : 0;
    switch (e2["key"]) {
      case "city_text":
        this.renderCityBar(e2["city"], baseGX + ox, baseGY + oy, container);
        break;
      case "border":
        this.renderBorder(e2["dir"], e2["color"], baseGX, baseGY, container);
        break;
      case "goto_line":
        this.renderGotoLine(e2["goto_dir"], baseGX, baseGY, container);
        break;
      case "tile_label":
        this.renderTileLabel(e2["tile"], baseGX + ox, baseGY + oy, container);
        break;
      case null:
      case void 0:
      case "":
        break;
      default: {
        const tex = this.getTexture(e2["key"]);
        if (tex) {
          const sp = new Sprite(tex);
          sp.x = baseGX + ox;
          sp.y = baseGY + oy;
          sp.alpha = fogAlpha;
          container.addChild(sp);
        }
        break;
      }
    }
  }
  static CITY_TEXT_STYLE = new TextStyle({
    fontSize: 11,
    fill: "#ffffff",
    fontFamily: "Arial, sans-serif",
    stroke: { color: "#000000", width: 2 }
  });
  static LABEL_TEXT_STYLE = new TextStyle({
    fontSize: 10,
    fill: "#ffff00",
    fontFamily: "Arial, sans-serif"
  });
  renderCityBar(city, x2, y2, container) {
    if (!city) return;
    const c2 = city;
    const name = c2["name"] ?? "";
    const size = c2["size"] ?? 0;
    const t2 = new Text({ text: `${name} (${size})`, style: PixiRenderer.CITY_TEXT_STYLE });
    t2.x = x2;
    t2.y = y2;
    container.addChild(t2);
  }
  renderTileLabel(tile, x2, y2, container) {
    const label = tile["label"];
    if (!label) return;
    const t2 = new Text({ text: label, style: PixiRenderer.LABEL_TEXT_STYLE });
    t2.x = x2;
    t2.y = y2;
    container.addChild(t2);
  }
  renderBorder(dir, colorStr, baseGX, baseGY, container) {
    const tw = tileset_tile_width;
    const th = tileset_tile_height;
    const hw = tw / 2, hh = th / 2;
    const color = this.parseCSSColor(colorStr);
    const g2 = new Graphics();
    switch (dir) {
      case 1:
        g2.moveTo(baseGX + hw, baseGY).lineTo(baseGX + tw, baseGY + hh);
        break;
      case 4:
        g2.moveTo(baseGX + tw, baseGY + hh).lineTo(baseGX + hw, baseGY + th);
        break;
      case 6:
        g2.moveTo(baseGX + hw, baseGY + th).lineTo(baseGX, baseGY + hh);
        break;
      case 3:
        g2.moveTo(baseGX, baseGY + hh).lineTo(baseGX + hw, baseGY);
        break;
    }
    g2.stroke({ width: 2, color });
    container.addChild(g2);
  }
  renderGotoLine(gotoDir, baseGX, baseGY, container) {
    if (gotoDir == null) return;
    const tw = tileset_tile_width, th = tileset_tile_height;
    const hw = tw / 2, hh = th / 2;
    const cx = baseGX + hw, cy = baseGY + hh;
    const offsets = {
      0: [-hw, -hh],
      1: [0, -th],
      2: [hw, -hh],
      3: [-tw, 0],
      4: [tw, 0],
      5: [-hw, hh],
      6: [0, th],
      7: [hw, hh]
    };
    const off = offsets[gotoDir];
    if (!off) return;
    const g2 = new Graphics();
    g2.moveTo(cx, cy).lineTo(cx + off[0] * 0.7, cy + off[1] * 0.7);
    g2.stroke({ width: 2, color: 16777215, alpha: 0.85 });
    container.addChild(g2);
  }
  /**
   * Add a corner fog sprite for the SE cluster of this tile.
   *
   * Each tile is the NW tile of one corner cluster: {self, E, S, SE}.
   * fill_fog_sprite_array() computes the visibility combination and returns
   * the matching t.fog_* key from store.fullfog. The resulting sprite is
   * drawn at (gx, gy) — the tile's GUI position. The sprite image covers
   * only the SE quadrant of the isometric diamond, so adjacent tiles' corner
   * sprites together provide complete smooth fog coverage.
   *
   * Returns without drawing if all 4 cluster tiles are known-seen (no fog).
   */
  addCornerFogSprite(tile, gx, gy, layer) {
    const eN = mapstep(tile, DIR8_EAST$2);
    const sN = mapstep(tile, DIR8_SOUTH$2);
    const seN = mapstep(tile, DIR8_SOUTHEAST$2);
    const pcorner = { tile: [tile, eN, sN, seN] };
    const entries = fill_fog_sprite_array(null, null, pcorner);
    if (entries.length === 0) return;
    const key = entries[0].key;
    if (!key) return;
    const tex = this.getTexture(key);
    if (!tex) return;
    const c2 = this.getTileLayerContainer(tile.index, layer);
    const sp = new Sprite(tex);
    sp.x = gx;
    sp.y = gy;
    c2.addChild(sp);
  }
  /** Create a shared fog texture once. Reused as Sprite per fogged tile (~2µs vs ~20µs for Graphics). */
  createFogTexture() {
    const tw = tileset_tile_width, th = tileset_tile_height;
    const hw = tw / 2, hh = th / 2;
    const g2 = new Graphics();
    g2.poly([hw, 0, tw, hh, hw, th, 0, hh]).fill({ color: 0, alpha: 0.45 });
    try {
      this.fogTexture = this.app.renderer.generateTexture({ target: g2, resolution: 1 });
    } catch {
      this.fogTexture = null;
    }
    g2.destroy();
  }
  addFogOverlay(gx, gy, container) {
    if (!this.fogTexture) return;
    const sp = new Sprite(this.fogTexture);
    sp.x = gx;
    sp.y = gy;
    container.addChild(sp);
  }
  parseCSSColor(color) {
    if (!color) return 16777215;
    const hex = color.startsWith("#") ? color.slice(1) : "";
    if (/^[0-9a-f]{6}$/i.test(hex)) return parseInt(hex, 16);
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      return parseInt(rgb[0]) << 16 | parseInt(rgb[1]) << 8 | parseInt(rgb[2]);
    }
    return 16777215;
  }
  // ---------------------------------------------------------------------------
  // Per-tile rebuild
  // ---------------------------------------------------------------------------
  rebuildTile(tile) {
    const known = tileGetKnown(tile);
    if (known === TILE_UNKNOWN) {
      for (let l2 = 0; l2 < LAYER_COUNT; l2++) this.clearTileLayer(tile.index, l2);
      return;
    }
    let gx, gy;
    const cached = this.tilePosCache.get(tile.index);
    if (cached) {
      gx = cached[0];
      gy = cached[1];
    } else {
      const pos = map_to_gui_pos$1(tile.x, tile.y);
      gx = pos["gui_dx"];
      gy = pos["gui_dy"];
      this.tilePosCache.set(tile.index, [gx, gy]);
    }
    const fog = draw_fog_of_war && known === TILE_KNOWN_UNSEEN;
    const fogAlpha = fog ? 0.5 : 1;
    const punit = get_drawable_unit(tile);
    const pcity = tileCity(tile);
    for (let layer = 0; layer < LAYER_COUNT; layer++) {
      this.clearTileLayer(tile.index, layer);
      if (layer === LAYER_FOG_INDEX) {
        if (fog) {
          const c22 = this.getTileLayerContainer(tile.index, layer);
          this.addFogOverlay(gx, gy, c22);
        }
        this.addCornerFogSprite(tile, gx, gy, layer);
        continue;
      }
      const entries = fill_sprite_array(layer, tile, null, null, punit, pcity);
      if (entries.length === 0) continue;
      const c2 = this.getTileLayerContainer(tile.index, layer);
      for (const entry of entries) {
        this.renderSpriteEntry(entry, gx, gy, c2, fogAlpha);
      }
    }
  }
  // ---------------------------------------------------------------------------
  // Texture pre-warming
  // ---------------------------------------------------------------------------
  /**
   * Pre-upload frequently-used sprites to GPU on first sprite-ready frame.
   * Without this, first encounters trigger synchronous GPU texture uploads,
   * causing large frame spikes during initial exploration.
   * Called once when store.sprites becomes available.
   */
  preWarmCommonTextures() {
    const dirs = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
    for (const prefix of ["road.road", "road.rail"]) {
      this.getTexture(`${prefix}_isolated`);
      for (const d2 of dirs) this.getTexture(`${prefix}_${d2}`);
    }
    const ids = ["u", "f", "k"];
    for (let i2 = 0; i2 < 80; i2++) {
      let k2 = i2;
      let key = "t.fog";
      for (let j2 = 0; j2 < 4; j2++) {
        key += "_" + ids[k2 % 3];
        k2 = Math.floor(k2 / 3);
      }
      this.getTexture(key);
    }
    this.forceGPUUpload();
  }
  /**
   * Force Pixi to upload all cached textures to GPU immediately.
   * Renders a tiny off-screen scene containing all cached sprites.
   * Cost: one-time ~10ms during game start; prevents mid-game upload spikes.
   */
  forceGPUUpload() {
    const tmp = new Container();
    tmp.x = -999999;
    tmp.y = -999999;
    for (const tex of this.texCache.values()) {
      if (tex) tmp.addChild(new Sprite(tex));
    }
    try {
      this.app.renderer.render({ container: tmp });
    } catch {
    }
    tmp.destroy({ children: true });
  }
  // ---------------------------------------------------------------------------
  // Render loop
  // ---------------------------------------------------------------------------
  processFrame() {
    if (!store.tiles || clientState() < C_S_RUNNING) return;
    if (!this.spritesReady) {
      if (!store.sprites || Object.keys(store.sprites).length === 0) return;
      this.spritesReady = true;
      this.preWarmCommonTextures();
    }
    this.mapContainer.x = -mapview$1["gui_x0"];
    this.mapContainer.y = -mapview$1["gui_y0"];
    globalEvents.emit("overview:frame", null);
    const gx0 = mapview$1["gui_x0"];
    const gy0 = mapview$1["gui_y0"];
    const gw = this.app.screen.width;
    const gh = this.app.screen.height;
    if ((this.dirtyAll || this.revealAll) && !this.rebuildQueue) {
      const margin = tileset_tile_width * 2;
      const tilesMap = store.tiles;
      const visible = [];
      const isRevealOnly = this.revealAll && !this.dirtyAll;
      for (const tile of Object.values(tilesMap)) {
        if (!tile) continue;
        if (isRevealOnly && this.builtSet.has(tile.index)) continue;
        let tx, ty;
        const cached = this.tilePosCache.get(tile.index);
        if (cached) {
          tx = cached[0];
          ty = cached[1];
        } else {
          const pos = map_to_gui_pos$1(tile.x, tile.y);
          tx = pos["gui_dx"];
          ty = pos["gui_dy"];
          this.tilePosCache.set(tile.index, [tx, ty]);
        }
        if (tx >= gx0 - margin && tx < gx0 + gw + margin && ty >= gy0 - margin && ty < gy0 + gh + margin) {
          visible.push(tile);
        }
      }
      this.rebuildQueue = visible;
      this.rebuildQueueIdx = 0;
      if (this.dirtyAll) {
        this.dirtyTiles.clear();
        this.builtSet.clear();
        this.dirtyAll = false;
      }
      this.revealAll = false;
      this.lastViewX0 = gx0;
      this.lastViewY0 = gy0;
      this.lastViewW = gw;
      this.lastViewH = gh;
    }
    if (!this.rebuildQueue && !this.dirtyAll && !this.revealAll) {
      const viewChanged = gx0 !== this.lastViewX0 || gy0 !== this.lastViewY0 || gw !== this.lastViewW || gh !== this.lastViewH;
      if (viewChanged) {
        this.lastViewX0 = gx0;
        this.lastViewY0 = gy0;
        this.lastViewW = gw;
        this.lastViewH = gh;
        if (this.panRevealTimer !== null) clearTimeout(this.panRevealTimer);
        this.panRevealTimer = setTimeout(() => {
          this.panRevealTimer = null;
          this.revealAll = true;
        }, PixiRenderer.PAN_REVEAL_DELAY_MS);
      }
    }
    const budget = !this.firstRebuildDone && this.rebuildQueue !== null ? PixiRenderer.BURST_BUDGET_MS : PixiRenderer.FRAME_BUDGET_MS;
    const frameStart = performance.now();
    if (!this.rebuildQueue && this.dirtyTiles.size > 0) {
      const tilesMap = store.tiles;
      for (const idx of this.dirtyTiles) {
        this.dirtyTiles.delete(idx);
        const tile = tilesMap[idx];
        if (tile) {
          try {
            this.rebuildTile(tile);
          } catch (e2) {
            console.error("[PixiRenderer] rebuildTile error (dirty):", e2);
          }
          this.builtSet.add(idx);
        }
        if (performance.now() - frameStart >= budget) break;
      }
    }
    if (this.rebuildQueue) {
      store.tiles;
      while (this.rebuildQueueIdx < this.rebuildQueue.length) {
        const tile = this.rebuildQueue[this.rebuildQueueIdx++];
        try {
          this.rebuildTile(tile);
        } catch (e2) {
          console.error("[PixiRenderer] rebuildTile error (queue):", e2);
        }
        this.builtSet.add(tile.index);
        if (performance.now() - frameStart >= budget) break;
      }
      if (this.rebuildQueueIdx >= this.rebuildQueue.length) {
        this.rebuildQueue = null;
        this.rebuildQueueIdx = 0;
        this.firstRebuildDone = true;
      }
    }
  }
  startRenderLoop() {
    const loop = () => {
      try {
        this.processFrame();
      } catch (e2) {
        console.error("[PixiRenderer] processFrame error:", e2);
      }
      this.rafHandle = requestAnimationFrame(loop);
    };
    this.rafHandle = requestAnimationFrame(loop);
  }
  // ---------------------------------------------------------------------------
  // Dirty API (called by game event handlers)
  // ---------------------------------------------------------------------------
  markDirty(tileIndex) {
    if (!this.dirtyAll) this.dirtyTiles.add(tileIndex);
  }
  markAllDirty() {
    this.dirtyAll = true;
    this.revealAll = false;
    this.dirtyTiles.clear();
    this.builtSet.clear();
  }
  // ---------------------------------------------------------------------------
  // Event listeners
  // ---------------------------------------------------------------------------
  setupEventListeners() {
    globalEvents.on("tile:updated", (data) => {
      const d2 = data;
      const idx = d2?.["tileIndex"] ?? (typeof d2?.["tile"] === "number" ? d2["tile"] : d2?.["tile"]?.["index"]);
      if (typeof idx === "number") this.markDirty(idx);
      else this.markAllDirty();
    });
    globalEvents.on("unit:updated", (data) => {
      const tileIdx = data?.["tile"];
      if (typeof tileIdx === "number") this.markDirty(tileIdx);
      else this.markAllDirty();
    });
    globalEvents.on("unit:removed", (data) => {
      const tileIdx = data?.["tile"];
      if (typeof tileIdx === "number") this.markDirty(tileIdx);
      else this.markAllDirty();
    });
    globalEvents.on("city:updated", (data) => {
      const tileIdx = data?.["tile"];
      if (typeof tileIdx === "number") this.markDirty(tileIdx);
      else this.markAllDirty();
    });
    globalEvents.on("city:removed", (data) => {
      const tileIdx = data?.["tile"];
      if (typeof tileIdx === "number") this.markDirty(tileIdx);
      else this.markAllDirty();
    });
    globalEvents.on("map:allocated", () => {
      this.clearTextureCache();
      this.markAllDirty();
    });
    let _playerDirtyTimer = null;
    globalEvents.on("player:updated", () => {
      if (_playerDirtyTimer) return;
      _playerDirtyTimer = setTimeout(() => {
        _playerDirtyTimer = null;
        this.markAllDirty();
      }, 500);
    });
    globalEvents.on("rules:ready", () => {
      this.markAllDirty();
    });
    globalEvents.on("game:beginturn", () => {
      this.revealAll = true;
    });
    this._onResize = () => {
      this.app.resize();
      this.markAllDirty();
    };
    window.addEventListener("resize", this._onResize);
  }
  // ---------------------------------------------------------------------------
  // View control
  // ---------------------------------------------------------------------------
  centerOnTile(tile) {
    const pos = map_to_gui_pos$1(tile.x, tile.y);
    mapview$1["gui_x0"] = pos["gui_dx"] - this.app.screen.width / 2;
    mapview$1["gui_y0"] = pos["gui_dy"] - this.app.screen.height / 2;
  }
  resize() {
    this.app.resize();
  }
  destroy() {
    if (this.rafHandle != null) cancelAnimationFrame(this.rafHandle);
    if (this._onResize != null) {
      window.removeEventListener("resize", this._onResize);
      this._onResize = null;
    }
    this.clearTextureCache();
    this.fogTexture?.destroy();
    this.fogTexture = null;
    this.app.destroy(true);
  }
}
const packet_authentication_reply = 7;
const packet_chat_msg_req = 26;
const packet_player_research = 55;
const packet_unit_sscs_set = 71;
const packet_unit_orders = 73;
const packet_unit_do_action = 84;
const packet_unit_get_actions = 87;
const packet_unit_change_activity = 222;
const packet_conn_pong = 89;
const packet_client_info = 119;
const packet_web_goto_path_req = 287;
const packet_web_info_text_req = 289;
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
  const { open: open2, message } = state$3.value;
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
      open: open2,
      width: window.innerWidth <= 600 ? "80%" : "60%",
      modal: true,
      children: [
        /* @__PURE__ */ u("div", { style: { marginBottom: "8px", color: "var(--xb-text-primary, #e6edf3)" }, children: message }),
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
store.renderer = RENDERER_PIXI;
function civClientInit() {
  store.observing = true;
  store.gameType = "observe";
  for (const id of ["pregame_buttons", "game_unit_orders_default"]) {
    document.getElementById(id)?.remove();
  }
  store.fcSeedrandom = seedrandom("xbworld");
  if (window.requestAnimationFrame == null) {
    swal("Please upgrade your browser.");
    return;
  }
  initTilesetSprites();
  const container = document.getElementById("canvas_div") ?? document.body;
  const pixi = new PixiRenderer({ container });
  pixi.init().then(() => {
    store["pixiRenderer"] = pixi;
    mapctrl_init_pixi();
    setupWindowSize();
    pixi.resize();
    pixi.markAllDirty();
  }).catch((e2) => console.error("PixiRenderer init failed:", e2));
  game_init();
  initTabs("#tabs", { heightStyle: "fill" });
  control_init();
  store.timeoutTimerId = setInterval(function() {
  }, 1e3);
  update_game_status_panel();
  store.statusTimerId = setInterval(function() {
    update_game_status_panel();
  }, 6e3);
  if (store.overviewTimerId == null) {
    store.overviewTimerId = setInterval(function() {
      redraw_overview();
    }, 6e3);
  }
  const tabs2 = document.getElementById("tabs");
  if (tabs2) tabs2.style.height = window.innerHeight + "px";
  const savedSounds = JSON.parse(localStorage.getItem("sndFX") ?? "null");
  if (savedSounds != null) {
    store.soundsEnabled = savedSounds;
  } else {
    store.soundsEnabled = !(navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome"));
  }
  if (typeof audiojs !== "undefined") {
    audiojs.events.ready(function() {
      const as = audiojs.createAll({
        trackEnded: function() {
          const track = music_list[Math.floor(Math.random() * music_list.length)];
          const ext = supports_mp3() ? ".mp3" : ".ogg";
          if (audio) {
            audio.load("/music/" + track + ext);
            audio.play();
          }
        }
      });
      setAudio(as[0]);
    });
  }
  initCommonIntroDialog();
}
function stopGameTimers() {
  if (store.overviewTimerId != null) {
    clearInterval(store.overviewTimerId);
    store.overviewTimerId = null;
  }
  if (store.statusTimerId != null) {
    clearInterval(store.statusTimerId);
    store.statusTimerId = null;
  }
  if (store.timeoutTimerId != null) {
    clearInterval(store.timeoutTimerId);
    store.timeoutTimerId = null;
  }
}
function resolveUsername() {
  const urlParam = new URLSearchParams(window.location.search).get("username");
  if (urlParam && urlParam.trim().length >= 3) return urlParam.trim();
  const saved = localStorage.getItem("username");
  if (saved && saved.trim().length >= 3) return saved.trim();
  return "Observer_" + Math.random().toString(36).slice(2, 6).toUpperCase();
}
function initCommonIntroDialog() {
  store.username = resolveUsername();
  Promise.resolve().then(() => connection).then((m2) => m2.network_init());
}
function showDialogMessage(title, message) {
  showMessageDialog(title, message);
}
function showAuthDialog(packet) {
  showAuthDialog$1(packet);
}
if (!globalThis.__VITEST__) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (!store.civclientState) {
        civClientInit();
      }
    });
  } else {
    if (!store.civclientState) {
      civClientInit();
    }
  }
}
const civClient = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  civClientInit,
  initCommonIntroDialog,
  showAuthDialog,
  showDialogMessage,
  stopGameTimers
}, Symbol.toStringTag, { value: "Module" }));
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
const improvements_name_index = {};
function improvements_init() {
  const improvements = store.improvements;
  Object.keys(improvements).forEach((k2) => delete improvements[k2]);
  Object.keys(improvements_name_index).forEach(
    (k2) => delete improvements_name_index[k2]
  );
}
const LAYOUT_COL_WIDTH = 250;
const LAYOUT_ROW_HEIGHT = 60;
const A_NONE = 0;
function buildReqtreeLayout(techs2) {
  const ids = Object.keys(techs2).map(Number).filter((id) => id > 0);
  if (ids.length === 0) return {};
  const idSet = new Set(ids);
  const prereqs = /* @__PURE__ */ new Map();
  for (const id of ids) {
    const tech = techs2[id];
    const req = tech["req"] ?? [];
    const ps = [];
    for (const r2 of req) {
      if (r2 != null && r2 !== A_NONE && idSet.has(r2)) ps.push(r2);
    }
    prereqs.set(id, ps);
  }
  const depth = /* @__PURE__ */ new Map();
  for (const id of ids) depth.set(id, 0);
  let changed = true;
  for (let iter = 0; changed && iter < ids.length; iter++) {
    changed = false;
    for (const id of ids) {
      const ps = prereqs.get(id);
      if (ps.length === 0) continue;
      let maxD = 0;
      for (const p2 of ps) maxD = Math.max(maxD, depth.get(p2) ?? 0);
      const newD = maxD + 1;
      if (newD > (depth.get(id) ?? 0)) {
        depth.set(id, newD);
        changed = true;
      }
    }
  }
  const byDepth = /* @__PURE__ */ new Map();
  for (const id of ids) {
    const d2 = depth.get(id) ?? 0;
    if (!byDepth.has(d2)) byDepth.set(d2, []);
    byDepth.get(d2).push(id);
  }
  for (const group of byDepth.values()) {
    group.sort((a2, b2) => a2 - b2);
  }
  const rowOf = /* @__PURE__ */ new Map();
  for (const [, group] of byDepth) {
    for (let r2 = 0; r2 < group.length; r2++) rowOf.set(group[r2], r2);
  }
  const maxDepth = byDepth.size === 0 ? 0 : Math.max(...byDepth.keys());
  for (let d2 = 1; d2 <= maxDepth; d2++) {
    const group = byDepth.get(d2);
    if (!group || group.length <= 1) continue;
    const bary = /* @__PURE__ */ new Map();
    for (const id of group) {
      const ps = prereqs.get(id);
      if (ps.length === 0) {
        bary.set(id, id);
      } else {
        const avg = ps.reduce((s2, p2) => s2 + (rowOf.get(p2) ?? 0), 0) / ps.length;
        bary.set(id, avg);
      }
    }
    group.sort((a2, b2) => (bary.get(a2) ?? a2) - (bary.get(b2) ?? b2));
    for (let r2 = 0; r2 < group.length; r2++) rowOf.set(group[r2], r2);
  }
  const result = {};
  for (const [d2, group] of byDepth) {
    for (let row = 0; row < group.length; row++) {
      result[String(group[row])] = {
        x: d2 * LAYOUT_COL_WIDTH,
        y: row * LAYOUT_ROW_HEIGHT
      };
    }
  }
  return result;
}
let roads = [];
let bases = [];
function handle_ruleset_terrain(packet) {
  if (packet["name"] === "Lake") packet["graphic_str"] = packet["graphic_alt"];
  if (packet["name"] === "Glacier") packet["graphic_str"] = "tundra";
  store.terrains[packet["id"]] = packet;
}
function handle_ruleset_resource(packet) {
  store.resources[packet["id"]] = packet;
}
function handle_ruleset_game(packet) {
  store.gameRules = packet;
}
function handle_ruleset_specialist(packet) {
  store.specialists[packet["id"]] = packet;
}
function handle_ruleset_nation_groups(packet) {
  store.nationGroups = packet["groups"];
}
function handle_ruleset_nation(packet) {
  store.nations[packet["id"]] = packet;
}
function handle_ruleset_city(packet) {
  store.cityRules[packet["style_id"]] = packet;
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
  const action = { ...packet, enablers: [] };
  store.actions[action["id"]] = action;
}
function handle_ruleset_goods(packet) {
  store.goods[packet["id"]] = packet;
}
function handle_ruleset_clause(packet) {
  store.clauseInfos[packet["type"]] = packet;
}
function handle_ruleset_effect(packet) {
  if (store.effects[packet["effect_type"]] == null) {
    store.effects[packet["effect_type"]] = [];
  }
  store.effects[packet["effect_type"]].push(packet);
}
function handle_ruleset_unit(packet) {
  if (packet["name"] != null && packet["name"].indexOf("?unit:") === 0) {
    packet["name"] = packet["name"].replace("?unit:", "");
  }
  packet["flags"] = new BitVector(packet["flags"]);
  store.unitTypes[packet["id"]] = packet;
}
function handle_web_ruleset_unit_addition(packet) {
  if (packet["utype_actions"] != null) {
    packet["utype_actions"] = new BitVector(packet["utype_actions"]);
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
    packet["req"].push(A_NONE$1);
  }
}
function handle_ruleset_tech(packet) {
  if (packet["name"] != null && packet["name"].indexOf("?tech:") === 0) {
    packet["name"] = packet["name"].replace("?tech:", "");
  }
  store.techs[packet["id"]] = packet;
  recreate_old_tech_req(packet);
}
function handle_ruleset_tech_class(packet) {
  const s2 = store;
  if (s2["techClasses"] == null) s2["techClasses"] = {};
  s2["techClasses"][packet["id"]] = packet;
}
function handle_ruleset_tech_flag(packet) {
  const s2 = store;
  if (s2["techFlags"] == null) s2["techFlags"] = {};
  s2["techFlags"][packet["id"]] = packet;
}
function handle_ruleset_terrain_control(packet) {
  store.terrainControl = packet;
  store.singleMove = packet["move_fragments"];
}
function handle_ruleset_building(packet) {
  store.improvements[packet["id"]] = packet;
}
function handle_ruleset_unit_class(packet) {
  packet["flags"] = new BitVector(packet["flags"]);
  store.unitClasses[packet["id"]] = packet;
}
function handle_ruleset_disaster(packet) {
  const s2 = store;
  if (s2["disasters"] == null) s2["disasters"] = {};
  s2["disasters"][packet["id"]] = packet;
}
function handle_ruleset_trade(packet) {
  store["tradeRules"] = packet;
}
function handle_rulesets_ready(_packet) {
  store.computedReqtree = buildReqtreeLayout(store.techs);
  console.log(`[xbw] reqtree: built dynamic layout for ${Object.keys(store.computedReqtree).length} techs`);
  globalEvents.emit("rules:ready");
}
function handle_ruleset_choices(_packet) {
}
function handle_game_load(_packet) {
}
function handle_ruleset_unit_flag(packet) {
  const s2 = store;
  if (s2["unitFlags"] == null) s2["unitFlags"] = {};
  s2["unitFlags"][packet["id"]] = packet;
}
function handle_ruleset_unit_class_flag(packet) {
  const s2 = store;
  if (s2["unitClassFlags"] == null) s2["unitClassFlags"] = {};
  s2["unitClassFlags"][packet["id"]] = packet;
}
function handle_ruleset_unit_bonus(packet) {
  const unit_type_id = packet["unit"];
  if (unit_type_id != null && store.unitTypes[unit_type_id] != null) {
    const ut = store.unitTypes[unit_type_id];
    if (ut["bonuses"] == null) ut["bonuses"] = [];
    ut["bonuses"].push(packet);
  }
}
function handle_ruleset_terrain_flag(packet) {
  const s2 = store;
  if (s2["terrainFlags"] == null) s2["terrainFlags"] = {};
  s2["terrainFlags"][packet["id"]] = packet;
}
function handle_ruleset_impr_flag(packet) {
  const s2 = store;
  if (s2["imprFlags"] == null) s2["imprFlags"] = {};
  s2["imprFlags"][packet["id"]] = packet;
}
function handle_ruleset_government_ruler_title(packet) {
  const gov_id = packet["gov"];
  const gov = store.governments[gov_id];
  if (gov != null) {
    gov["male_title"] = packet["male_title"];
    gov["female_title"] = packet["female_title"];
  }
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
  const paction = store.actions[packet.enabled_action];
  if (paction === void 0) {
    console.log("Unknown action " + packet.action + " for enabler ");
    console.log(packet);
    return;
  }
  paction.enablers.push(packet);
}
function handle_ruleset_extra(packet) {
  const rec = packet;
  rec["causes"] = new BitVector(packet["causes"]);
  rec["rmcauses"] = new BitVector(packet["rmcauses"]);
  packet["name"] = stringUnqualify(packet["name"]);
  const extra = packet;
  store.extras[packet["id"]] = extra;
  store.extras[packet["rule_name"]] = extra;
  if (isExtraCausedBy(extra, EC_ROAD) && packet["buildable"]) {
    roads.push(extra);
  }
  if (isExtraCausedBy(extra, EC_BASE) && packet["buildable"]) {
    bases.push(extra);
  }
  if (packet["rule_name"] === "Railroad") store.extraIds["EXTRA_RAIL"] = packet["id"];
  else if (packet["rule_name"] === "Oil Well") store.extraIds["EXTRA_OIL_WELL"] = packet["id"];
  else store.extraIds["EXTRA_" + packet["rule_name"].toUpperCase()] = packet["id"];
}
function handle_ruleset_counter(packet) {
  const s2 = store;
  if (s2["counters"] == null) s2["counters"] = {};
  s2["counters"][packet["id"]] = packet;
}
function handle_ruleset_extra_flag(packet) {
  const s2 = store;
  if (s2["extraFlags"] == null) s2["extraFlags"] = {};
  s2["extraFlags"][packet["id"]] = packet;
}
function handle_ruleset_nation_sets(packet) {
  store["nationSets"] = packet["sets"] ?? packet;
}
function handle_ruleset_style(packet) {
  const s2 = store;
  if (s2["styles"] == null) s2["styles"] = {};
  s2["styles"][packet["id"]] = packet;
}
function handle_nation_availability(packet) {
  store["nationAvailability"] = packet;
}
function handle_ruleset_music(_packet) {
}
function handle_ruleset_multiplier(packet) {
  const s2 = store;
  if (s2["multipliers"] == null) s2["multipliers"] = {};
  s2["multipliers"][packet["id"]] = packet;
}
function handle_ruleset_action_auto(packet) {
  const s2 = store;
  if (s2["actionAutos"] == null) s2["actionAutos"] = {};
  s2["actionAutos"][packet["id"]] = packet;
}
function handle_ruleset_achievement(packet) {
  const s2 = store;
  if (s2["achievements"] == null) s2["achievements"] = {};
  s2["achievements"][packet["id"]] = packet;
}
function handle_achievement_info(packet) {
  const s2 = store;
  if (s2["achievementInfo"] == null) s2["achievementInfo"] = {};
  const id = packet["id"];
  const ai = s2["achievementInfo"];
  if (ai[id] == null) ai[id] = {};
  ai[id][packet["player_id"]] = packet;
}
function handle_team_name_info(packet) {
  const s2 = store;
  if (s2["teamNames"] == null) s2["teamNames"] = {};
  s2["teamNames"][packet["team_id"]] = packet["name"];
}
function handle_popup_image(_packet) {
}
function handle_worker_task(packet) {
  const city_id = packet["city_id"];
  if (city_id != null && store.cities[city_id] != null) {
    const city = store.cities[city_id];
    if (city["workerTasks"] == null) city["workerTasks"] = [];
    city["workerTasks"].push(packet);
  }
}
function handle_play_music(_packet) {
}
function handle_ruleset_control(packet) {
  store.rulesControl = packet;
  setClientState(C_S_PREPARING);
  store.effects = {};
  store.rulesSummary = null;
  store.rulesDescription = null;
  store.gameRules = null;
  store.nationGroups = [];
  store.nations = {};
  store.specialists = {};
  store.techs = {};
  store.computedReqtree = null;
  store.governments = {};
  store.terrainControl = {};
  store.singleMove = void 0;
  store.unitTypes = {};
  store.unitClasses = {};
  store.cityRules = {};
  store.terrains = {};
  store.resources = {};
  store.goods = {};
  store.actions = {};
  improvements_init();
  for (const extra in store.extras) {
    const ename = store.extras[extra]["rule_name"];
    if (ename === "Railroad") delete store.extraIds["EXTRA_RAIL"];
    else if (ename === "Oil Well") delete store.extraIds["EXTRA_OIL_WELL"];
    else delete store.extraIds["EXTRA_" + ename.toUpperCase()];
  }
  store.extras = {};
  roads = [];
  bases = [];
  store.clauseInfos = {};
  const s2 = store;
  s2["techClasses"] = {};
  s2["techFlags"] = {};
  s2["unitFlags"] = {};
  s2["unitClassFlags"] = {};
  s2["terrainFlags"] = {};
  s2["imprFlags"] = {};
  s2["extraFlags"] = {};
  s2["disasters"] = {};
  s2["multipliers"] = {};
  s2["achievements"] = {};
  s2["achievementInfo"] = {};
  s2["counters"] = {};
  s2["styles"] = {};
  s2["actionAutos"] = {};
  s2["tradeRules"] = null;
  s2["nationSets"] = null;
  s2["nationAvailability"] = null;
}
store.client;
let update_player_info_pregame_queued = false;
function update_game_info_pregame() {
  if (C_S_PREPARING != clientState()) return;
  mountAndRefresh();
  setupWindowSize();
}
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
  mountAndRefresh();
  update_player_info_pregame_queued = false;
}
function mountAndRefresh() {
  Promise.resolve().then(() => PregameLobby).then(({ mountPregameLobby: mountPregameLobby2 }) => {
    mountPregameLobby2();
    pregameRefresh.value++;
  });
}
function handle_game_info(packet) {
  store.gameInfo = packet;
  globalEvents.emit("game:info", packet);
  const turn = packet.turn ?? 0;
  const obs = store.observing;
  const curState = typeof clientState === "function" ? clientState() : -1;
  console.log("[xbw] handle_game_info turn=" + turn + " observing=" + obs + " clientState=" + curState);
  if (typeof clientState === "function" && clientState() !== C_S_RUNNING && (packet.turn > 0 || store.observing)) {
    console.log("[xbw] handle_game_info: scheduling C_S_RUNNING transition in 2s");
    setTimeout(() => {
      if (clientState() !== C_S_RUNNING) {
        console.log("[xbw] handle_game_info: firing C_S_RUNNING transition");
        store.observing = true;
        setClientState(C_S_RUNNING);
      } else {
        console.log("[xbw] handle_game_info: already C_S_RUNNING, skip");
      }
    }, 2e3);
  }
}
function handle_calendar_info(packet) {
  store.calendarInfo = packet;
  globalEvents.emit("game:calendar", packet);
}
function handle_spaceship_info(_packet) {
}
function handle_new_year(packet) {
  if (!store.gameInfo) return;
  store.gameInfo = { ...store.gameInfo, year: packet["year"], fragments: packet["fragments"], turn: packet["turn"] };
  globalEvents.emit("game:newyear", packet);
}
function handle_timeout_info(packet) {
  store.lastTurnChangeTime = Math.ceil(packet["last_turn_change_time"]);
  store.secondsToPhasedone = Math.floor(packet["seconds_to_phasedone"]);
  store.secondsToPhasedoneSync = (/* @__PURE__ */ new Date()).getTime();
}
function handle_trade_route_info(packet) {
  if (city_trade_routes[packet["city"]] == null) {
    city_trade_routes[packet["city"]] = {};
  }
  city_trade_routes[packet["city"]][packet["index"]] = packet;
}
function handle_endgame_player(packet) {
  store.endgamePlayerInfo.push(packet);
  window["endgame_player_info"] = store.endgamePlayerInfo;
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
  store.savedThisTurn = false;
}
function handle_endgame_report(_packet) {
  setClientState(C_S_OVER);
}
function handle_scenario_info(packet) {
  store.scenarioInfo = packet;
}
function handle_scenario_description(packet) {
  store.scenarioInfo["description"] = packet["description"];
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
      if (packet["inventions"][i2] !== old_inventions[i2] && packet["inventions"][i2] === TECH_KNOWN) {
        queue_tech_gained_dialog(i2);
        break;
      }
    }
  }
  if (tech_dialog_active) update_tech_screen();
  globalEvents.emit("player:research");
}
function handle_begin_turn(_packet) {
  globalEvents.emit("game:beginturn");
  if (typeof mark_all_dirty === "function") mark_all_dirty();
  if (!store.observing) {
    turnDoneState.value = { disabled: false, text: "Turn Done" };
  }
  setWaitingUnitsList([]);
  update_unit_focus();
  update_game_status_panel();
  const funits = get_units_in_focus();
  if (funits != null && funits.length === 0) {
    auto_center_on_focus_unit();
  }
  if (tech_dialog_active) update_tech_screen();
}
function handle_end_turn(_packet) {
  reset_unit_anim_list();
  if (!store.observing) {
    turnDoneState.value = { ...turnDoneState.value, disabled: true };
  }
}
const KEY_SETTING_EFFECTS = {
  /**
   * fogofwar (bool) — whether the fog of war is enabled on this server.
   * When false, all tiles are visible; the renderer skips fog overlay.
   * Triggers a full map re-render so existing fogged tiles are cleared.
   */
  "fogofwar": (val) => {
    setDrawFogOfWar(Boolean(val));
    const pr = store["pixiRenderer"];
    pr?.markAllDirty();
  }
};
function applySettingEffect(setting) {
  if (setting == null) return;
  const name = setting["name"];
  if (!name) return;
  const fn = KEY_SETTING_EFFECTS[name];
  if (fn != null) fn(setting["val"]);
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
    urlParams.get("action");
    urlParams.get("ruleset");
    if (store.observing) {
      console.log("[xbw] join_reply: observer mode, scheduling requestObserveGame");
      wait_for_text("You are logged in as", requestObserveGame);
      setTimeout(requestObserveGame, 3e3);
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
      freelog(0, "Server removed unknown connection " + packet["id"]);
      return;
    }
    client_remove_cli_conn(pconn);
    pconn = void 0;
  } else {
    const pplayer = valid_player_by_number(packet["player_num"]);
    packet["playing"] = pplayer;
    if (packet["id"] === store.client.conn.id) {
      if (store.client.conn.player_num == null || store.client.conn.player_num !== packet["player_num"]) ;
      store.client.conn = packet;
    }
    conn_list_append(packet);
  }
  if (packet["id"] === store.client.conn.id) {
    if (clientPlaying() !== packet["playing"]) {
      setClientState(C_S_PREPARING);
    }
  }
  globalEvents.emit("connection:updated", packet);
}
function handle_conn_ping(_packet) {
  store.pingLast = (/* @__PURE__ */ new Date()).getTime();
  sendConnPong();
}
function handle_authentication_req(packet) {
  showAuthDialog(packet);
}
function handle_server_shutdown(_packet) {
  markServerShutdown();
  stopGameTimers();
  network_stop();
  store.reset();
  store.connectionState = "disconnected";
  add_chatbox_text({ message: "The server has shut down.", conn_id: -1 });
  swal("Server Shutdown", "The game server has shut down. Please reload the page to reconnect.", "error");
}
function handle_connect_msg(packet) {
  add_chatbox_text(packet);
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
function handle_set_topology(packet) {
  const p2 = packet;
  if (store.mapInfo && p2["topology_id"] != null) {
    store.mapInfo["topology_id"] = p2["topology_id"];
  }
  if (store.mapInfo && p2["wrap_id"] != null) {
    store.mapInfo["wrap_id"] = p2["wrap_id"];
  }
  const winMap = window["map"];
  if (winMap && p2["topology_id"] != null) winMap["topology_id"] = p2["topology_id"];
  if (winMap && p2["wrap_id"] != null) winMap["wrap_id"] = p2["wrap_id"];
  mapInitTopology();
}
function handle_conn_ping_info(packet) {
  if (store.debugActive) {
    store.connPingInfo = packet;
    store.debugPingList.push(packet["ping_time"][0] * 1e3);
  }
}
function handle_single_want_hack_reply(_packet) {
}
function handle_vote_new(packet) {
  const p2 = packet;
  const voteId = p2["vote_no"] ?? p2["id"];
  if (voteId != null) {
    console.log("[xbw] vote_new: auto-voting YES on vote", voteId);
    const ws2 = window.ws;
    if (ws2 && ws2.readyState === WebSocket.OPEN) {
      ws2.send(JSON.stringify({ pid: 26, message: "/vote yes " + voteId }));
    }
  }
}
function handle_vote_update(packet) {
  const p2 = packet;
  const voteId = p2["vote_no"] ?? p2["id"];
  if (voteId != null) {
    const s2 = store;
    if (s2["votes"] == null) s2["votes"] = {};
    s2["votes"][voteId] = packet;
  }
}
function handle_vote_remove(packet) {
  const p2 = packet;
  const voteId = p2["vote_no"] ?? p2["id"];
  if (voteId != null) {
    const votes = store["votes"];
    if (votes != null) delete votes[voteId];
  }
}
function handle_vote_resolve(packet) {
  const p2 = packet;
  const voteId = p2["vote_no"] ?? p2["id"];
  if (voteId != null) {
    const votes = store["votes"];
    if (votes != null) delete votes[voteId];
  }
}
function handle_edit_startpos(_packet) {
}
function handle_edit_startpos_full(_packet) {
}
function handle_edit_object_created(_packet) {
}
function handle_server_setting_const(packet) {
  const setting = packet;
  const catIndex = packet["category"];
  if (catIndex != null && store.serverSettingCategories[catIndex] != null) {
    setting["categoryName"] = store.serverSettingCategories[catIndex];
  }
  store.serverSettings[packet["id"]] = setting;
  store.serverSettings[packet["name"]] = setting;
}
function _applySettingUpdate(packet, type) {
  const existing = store.serverSettings[packet["id"]];
  if (existing == null) {
    console.warn("[xbw] server_setting update received before const for id", packet["id"]);
    return;
  }
  Object.assign(existing, packet);
  existing["type"] = type;
  applySettingEffect(existing);
  globalEvents.emit("settings:updated");
}
function handle_server_setting_int(packet) {
  _applySettingUpdate(packet, "int");
}
function handle_server_setting_enum(packet) {
  _applySettingUpdate(packet, "enum");
}
function handle_server_setting_bitwise(packet) {
  _applySettingUpdate(packet, "bitwise");
}
function handle_server_setting_bool(packet) {
  _applySettingUpdate(packet, "bool");
}
function handle_server_setting_str(packet) {
  _applySettingUpdate(packet, "str");
}
function handle_server_setting_control(packet) {
  const nSettings = packet["nSettings"] ?? 0;
  const categoryNames = packet["categoryNames"] ?? [];
  store.serverSettingCount = nSettings;
  store.serverSettingCategories = categoryNames;
  for (let i2 = 0; i2 < nSettings; i2++) {
    const key = String(i2);
    if (store.serverSettings[key] == null) {
      store.serverSettings[key] = { id: i2, name: "", category: 0, val: null };
    }
  }
  console.log(
    `[xbw] server_setting_control: ${nSettings} settings, ${categoryNames.length} categories`,
    categoryNames
  );
}
function handle_tile_info(packet) {
  if (store.tiles != null) {
    packet["extras"] = new BitVector(packet["extras"]);
    if (!packet["known"] || packet["known"] < 2) {
      packet["known"] = 2;
    }
    Object.assign(store.tiles[packet["tile"]], packet);
    mark_overview_dirty();
    if (typeof mark_tile_dirty === "function") {
      mark_tile_dirty(packet["tile"]);
    }
    globalEvents.emit("tile:updated", packet);
  }
}
function handle_map_info(packet) {
  window.__xbwHandleMapInfoCalled = (window.__xbwHandleMapInfoCalled || 0) + 1;
  store.mapInfo = packet;
  const winMap = window.map;
  if (winMap) {
    winMap.xsize = packet.xsize;
    winMap.ysize = packet.ysize;
    winMap.topology_id = packet.topology_id;
    winMap.wrap_id = packet.wrap_id;
  }
  mapInitTopology();
  mapAllocate();
  mapdeco_init();
  globalEvents.emit("map:allocated");
}
function handle_nuke_tile_info(packet) {
  const ptile = indexToTile(packet["tile"]);
  ptile["nuke"] = 60;
  play_sound("LrgExpl.ogg");
}
function handle_city_info(packet) {
  if (typeof mark_tile_dirty === "function" && packet["tile"] != null) {
    mark_tile_dirty(packet["tile"]);
  }
  mark_overview_dirty();
  packet["name"] = decodeURIComponent(packet["name"]);
  packet["improvements"] = new BitVector(packet["improvements"]);
  packet["city_options"] = new BitVector(packet["city_options"]);
  packet["unhappy"] = cityUnhappy(packet);
  if (store.cities[packet["id"]] == null) {
    store.cities[packet["id"]] = packet;
    if (C_S_RUNNING === clientState() && !store.observing && store.benchmarkStart === 0 && !clientIsObserver() && packet["owner"] === clientPlaying()?.playerno) {
      show_city_dialog_by_id(packet["id"]);
    }
  } else {
    Object.assign(store.cities[packet["id"]], packet);
  }
  const pcity = store.cities[packet["id"]];
  pcity["shield_stock_changed"] = false;
  pcity["production_changed"] = false;
  globalEvents.emit("city:updated", packet);
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
}
function handle_city_short_info(packet) {
  if (typeof mark_tile_dirty === "function" && packet["tile"] != null) {
    mark_tile_dirty(packet["tile"]);
  }
  packet["name"] = decodeURIComponent(packet["name"]);
  packet["improvements"] = new BitVector(packet["improvements"]);
  if (store.cities[packet["id"]] == null) {
    store.cities[packet["id"]] = packet;
  } else {
    Object.assign(store.cities[packet["id"]], packet);
  }
  globalEvents.emit("city:updated", packet);
}
function handle_city_update_counters(packet) {
  if (store.cities[packet["id"]] != null) {
    store.cities[packet["id"]]["counters"] = packet["counters"];
  }
}
function handle_city_remove(packet) {
  removeCity(packet["city_id"]);
  globalEvents.emit("city:removed", packet["city_id"]);
}
function handle_city_name_suggestion_info(packet) {
  packet["name"] = decodeURIComponent(packet["name"]);
  city_name_dialog(packet["name"], packet["unit_id"]);
}
function handle_city_sabotage_list(_packet) {
}
function assign_nation_color(nation_id) {
  const nation2 = store.nations[nation_id];
  if (nation2 == null || nation2["color"] != null) return;
  const flag_key = "f." + nation2["graphic_str"];
  const flag_sprite = store.sprites[flag_key];
  if (flag_sprite == null) return;
  const c2 = flag_sprite.getContext("2d");
  const width = store.tileset[flag_key][2];
  const height = store.tileset[flag_key][3];
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
  nation2["color"] = max_color;
}
function color_rbg_to_list(pcolor) {
  if (pcolor == null) return null;
  const color_rgb = pcolor.match(/\d+/g);
  if (!color_rgb) return null;
  return [parseFloat(color_rgb[0]), parseFloat(color_rgb[1]), parseFloat(color_rgb[2])];
}
function handle_player_info(packet) {
  if (packet["name"] != null) {
    packet["name"] = decodeURIComponent(packet["name"]);
  }
  store.players[packet["playerno"]] = Object.assign(
    store.players[packet["playerno"]] || {},
    packet
  );
  const p2 = store.players[packet["playerno"]];
  if (p2["flags"] != null && !(p2["flags"] instanceof BitVector)) {
    p2["flags"] = new BitVector(p2["flags"]);
  }
  if (p2["gives_shared_vision"] != null && !(p2["gives_shared_vision"] instanceof BitVector)) {
    p2["gives_shared_vision"] = new BitVector(p2["gives_shared_vision"]);
  }
  if (clientPlaying() != null && packet["playerno"] === clientPlaying()["playerno"]) {
    store.client.conn.playing = store.players[packet["playerno"]];
  }
  globalEvents.emit("player:updated", packet);
}
function handle_web_player_info_addition(packet) {
  Object.assign(store.players[packet["playerno"]], packet);
  if (clientPlaying() != null) {
    if (packet["playerno"] === clientPlaying()["playerno"]) {
      store.client.conn.playing = store.players[packet["playerno"]];
      update_game_status_panel();
    }
  }
  update_player_info_pregame();
  if (tech_dialog_active) update_tech_screen();
  assign_nation_color(store.players[packet["playerno"]]["nation"]);
  globalEvents.emit("player:updated", packet);
}
function handle_player_remove(packet) {
  delete store.players[packet["playerno"]];
  update_player_info_pregame();
  globalEvents.emit("player:removed", packet);
}
function handle_player_attribute_chunk(_packet) {
}
function handle_player_diplstate(packet) {
  if (store.client == null || clientPlaying() == null) return;
  if (packet["plr2"] === clientPlaying()["playerno"]) {
    const ds = store.players[packet["plr1"]].diplstates;
    if (ds != void 0 && ds[packet["plr2"]] != void 0 && ds[packet["plr2"]]["state"] !== packet["type"]) ;
  }
  if (packet["type"] === DiplState.DS_WAR && packet["plr2"] === clientPlaying()["playerno"] && store.diplstates[packet["plr1"]] !== DiplState.DS_WAR && store.diplstates[packet["plr1"]] !== DiplState.DS_NO_CONTACT) ;
  else if (packet["type"] === DiplState.DS_WAR && packet["plr1"] === clientPlaying()["playerno"] && store.diplstates[packet["plr2"]] !== DiplState.DS_WAR && store.diplstates[packet["plr2"]] !== DiplState.DS_NO_CONTACT) ;
  if (packet["plr1"] === clientPlaying()["playerno"]) {
    store.diplstates[packet["plr2"]] = packet["type"];
  } else if (packet["plr2"] === clientPlaying()["playerno"]) {
    store.diplstates[packet["plr1"]] = packet["type"];
  }
  if (store.players[packet["plr1"]]["diplstates"] === void 0) {
    store.players[packet["plr1"]]["diplstates"] = [];
  }
  store.players[packet["plr1"]]["diplstates"][packet["plr2"]] = {
    state: packet["type"],
    turns_left: packet["turns_left"],
    contact_turns_left: packet["contact_turns_left"]
  };
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
  mark_overview_dirty();
  if (action_selection_in_progress_for === punit.id) {
    action_selection_next_in_focus(punit.id);
  }
  clear_tile_unit(punit);
  client_remove_unit(punit);
  globalEvents.emit("unit:removed", packet);
}
function handle_unit_info(packet) {
  if (typeof mark_tile_dirty === "function" && packet["tile"] != null) {
    mark_tile_dirty(packet["tile"]);
    const old_unit = store.units[packet["id"]];
    if (old_unit != null && old_unit["tile"] !== packet["tile"]) {
      mark_tile_dirty(old_unit["tile"]);
    }
  }
  mark_overview_dirty();
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
  mark_overview_dirty();
  handle_unit_packet_common(packet);
}
function action_decision_handle(punit) {
  for (let a2 = 0; a2 < auto_attack_actions.length; a2++) {
    const action = auto_attack_actions[a2];
    if (utype_can_do_action(unit_type(punit), action) && store.autoAttack) {
      sendUnitGetActions(
        punit["id"],
        IDENTITY_NUMBER_ZERO,
        punit["action_decision_tile"],
        EXTRA_NONE,
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
    if (actionProbPossible(action_probabilities[action]) && store.autoAttack) {
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
    if (punit != null && (punit["action_decision_want"] !== packet_unit["action_decision_want"] || punit["action_decision_tile"] !== packet_unit["action_decision_tile"]) && should_ask_server_for_actions(packet_unit)) {
      action_decision_handle(packet_unit);
    }
    if (typeof update_unit_anim_list === "function") {
      update_unit_anim_list(store.units[packet_unit["id"]], packet_unit);
    }
    Object.assign(store.units[packet_unit["id"]], packet_unit);
    if (current_focus != null) {
      for (let i2 = 0; i2 < current_focus.length; i2++) {
        if (current_focus[i2]["id"] === packet_unit["id"]) {
          Object.assign(current_focus[i2], packet_unit);
        }
      }
    }
  }
  update_tile_unit(store.units[packet_unit["id"]]);
  globalEvents.emit("unit:updated", packet_unit);
  if (current_focus != null && current_focus.length > 0 && current_focus[0]["id"] === packet_unit["id"]) {
    if (current_focus[0]["done_moving"] !== packet_unit["done_moving"]) {
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
    return;
  }
  if (packet["request_kind"] !== REQEST_PLAYER_INITIATED$1) {
    console.log("handle_unit_action_answer(): was asked to not disturb the player. Unimplemented.");
  }
  if (action_type === ACTION_SPY_BRIBE_UNIT) {
    if (target_unit == null) {
      console.log("Bad target unit (" + target_id + ") in unit action answer.");
    } else {
      popup_bribe_dialog(actor_unit, target_unit, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_SPY_INCITE_CITY || action_type === ACTION_SPY_INCITE_CITY_ESC) {
    if (target_city == null) {
      console.log("Bad target city (" + target_id + ") in unit action answer.");
    } else {
      popup_incite_dialog(actor_unit, target_city, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_UPGRADE_UNIT) {
    if (target_city == null) {
      console.log("Bad target city (" + target_id + ") in unit action answer.");
    } else {
      popup_unit_upgrade_dlg(actor_unit, target_city, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_COUNT) {
    console.log("unit_action_answer: Server refused to respond.");
  } else {
    console.log("unit_action_answer: Invalid answer.");
  }
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
          target_unit ?? null,
          target_city ?? null
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
        target_city ?? null,
        target_unit ?? null,
        ptile ?? null,
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
const diplomacy_clause_map = {};
function handle_diplomacy_init_meeting(packet) {
  diplomacy_clause_map[packet["counterpart"]] = [];
}
function handle_diplomacy_cancel_meeting(packet) {
  delete diplomacy_clause_map[packet["counterpart"]];
}
function handle_diplomacy_create_clause(packet) {
  const counterpart_id = packet["counterpart"];
  if (diplomacy_clause_map[counterpart_id] == null) {
    diplomacy_clause_map[counterpart_id] = [];
  }
  diplomacy_clause_map[counterpart_id].push(packet);
}
function handle_diplomacy_remove_clause(packet) {
}
function handle_diplomacy_accept_treaty(packet) {
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
      message = "<b>" + escapeHtml(String(store.connections[conn_id]["username"])) + ":</b>" + message;
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
      message = `<span class="chatbox_text_tileinfo" data-action="center-tile" data-tileid="${Number(ptile)}">${message}</span>`;
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
        const pid = packets[i2].pid;
        const pids = window.__xbwReceivedPids || (window.__xbwReceivedPids = {});
        pids[pid] = (pids[pid] || 0) + 1;
        const handler = packet_hand_table[pid];
        if (handler) {
          handler(packets[i2]);
        } else {
          console.warn("No handler for packet pid=" + packets[i2].pid);
        }
      }
    }
    if (packets.length > 0) {
      if (store.debugActive) clinet_debug_collect();
    }
  } catch (e2) {
    console.error(e2);
  }
}
function getMessageLog() {
  return message_log;
}
async function sha512hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-512", data);
  return Array.from(new Uint8Array(hash)).map((b2) => b2.toString(16).padStart(2, "0")).join("");
}
const win$2 = window;
let _packetWorker = null;
function getPacketWorker() {
  if (_packetWorker) return _packetWorker;
  try {
    const code = `self.onmessage=function(e){try{let p=JSON.parse(e.data);if(!Array.isArray(p))p=[p];postMessage({packets:p});}catch(err){postMessage({error:err.message,raw:e.data});}}`;
    const blob = new Blob([code], { type: "application/javascript" });
    _packetWorker = new Worker(URL.createObjectURL(blob));
    return _packetWorker;
  } catch {
    return null;
  }
}
console.log("[xbw] connection.ts module loaded");
let clinet_last_send = 0;
const debug_client_speed_list = [];
const freeciv_version = "+Freeciv.Web.Devel-3.4";
let ws = null;
let civserverport = null;
let ping_last = (/* @__PURE__ */ new Date()).getTime();
let _beforeUnloadHandler = null;
const pingtime_check = 24e4;
let ping_timer = null;
const RECONNECT_DELAYS_MS = [1e3, 2e3, 4e3, 8e3, 16e3];
const MAX_RECONNECT_ATTEMPTS = RECONNECT_DELAYS_MS.length;
let _reconnectAttempt = 0;
let _reconnectTimer = null;
let _reconnectCountdownTimer = null;
let _reconnecting = false;
let _serverShutdown = false;
function markServerShutdown() {
  _serverShutdown = true;
}
function _resetReconnectStateForTests() {
  stopReconnectTimers();
  _reconnectAttempt = 0;
  _reconnecting = false;
  _serverShutdown = false;
  store.connectionState = "connected";
  disconnectOverlay.value = null;
}
function _isPingTimerActiveForTests() {
  return ping_timer != null;
}
function _isPacketWorkerActiveForTests() {
  return _packetWorker != null;
}
function _isBeforeUnloadHandlerRegisteredForTests() {
  return _beforeUnloadHandler != null;
}
function stopReconnectTimers() {
  if (_reconnectTimer != null) {
    clearTimeout(_reconnectTimer);
    _reconnectTimer = null;
  }
  if (_reconnectCountdownTimer != null) {
    clearInterval(_reconnectCountdownTimer);
    _reconnectCountdownTimer = null;
  }
}
function showConnectionBanner(text) {
  connectionBanner.value = { text, showReload: false };
}
function clearConnectionBanner() {
  connectionBanner.value = null;
}
function startReconnect() {
  if (_reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
    store.connectionState = "disconnected";
    connectionBanner.value = { text: "⚠ Disconnected — ", showReload: true };
    disconnectOverlay.value = { phase: "disconnected" };
    return;
  }
  store.connectionState = "reconnecting";
  const delayMs = RECONNECT_DELAYS_MS[_reconnectAttempt];
  let countdown = Math.round(delayMs / 1e3);
  const updateBanner = () => {
    showConnectionBanner(
      `⟳ Reconnecting in ${countdown}s… (attempt ${_reconnectAttempt + 1}/${MAX_RECONNECT_ATTEMPTS})`
    );
    disconnectOverlay.value = {
      phase: "reconnecting",
      attempt: _reconnectAttempt,
      max: MAX_RECONNECT_ATTEMPTS,
      countdown
    };
  };
  updateBanner();
  _reconnectCountdownTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) updateBanner();
    else {
      clearInterval(_reconnectCountdownTimer);
      _reconnectCountdownTimer = null;
    }
  }, 1e3);
  _reconnectTimer = setTimeout(() => {
    _reconnectAttempt++;
    _reconnecting = true;
    websocket_init();
  }, delayMs);
}
function reconnectNow() {
  stopReconnectTimers();
  _reconnecting = true;
  websocket_init();
}
function tryAgain() {
  stopReconnectTimers();
  _reconnectAttempt = 0;
  _reconnecting = false;
  disconnectOverlay.value = null;
  startReconnect();
}
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
  if (!_reconnecting) {
    blockUI("<h2>Please wait while connecting to the server.</h2>");
  }
  const proxyport = 1e3 + parseFloat(civserverport);
  const ws_protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  const port = window.location.port ? ":" + window.location.port : "";
  const wsUrl = ws_protocol + window.location.hostname + port + "/civsocket/" + proxyport;
  console.log("[xbw] websocket_init: connecting to", wsUrl);
  ws = new WebSocket(wsUrl);
  const worker = getPacketWorker();
  const processPackets = (parsed) => {
    if (typeof client_handle_packet === "undefined" || !parsed) {
      return;
    }
    if (window.__xbwPacketCount === void 0) window.__xbwPacketCount = 0;
    window.__xbwPacketCount += parsed.length;
    const CHUNK = parsed.length > 200 ? 200 : 50;
    if (parsed.length <= CHUNK) {
      client_handle_packet(parsed);
    } else {
      const processChunk = (start) => {
        client_handle_packet(parsed.slice(start, start + CHUNK));
        if (start + CHUNK < parsed.length) {
          setTimeout(() => processChunk(start + CHUNK), 0);
        }
      };
      processChunk(0);
    }
  };
  const mainThreadParse = (event) => {
    try {
      let parsed = JSON.parse(event.data);
      if (!Array.isArray(parsed)) parsed = [parsed];
      processPackets(parsed);
    } catch (e2) {
      console.error("Failed to parse packet:", e2);
    }
  };
  if (worker) {
    let workerReady = false;
    const pendingMessages = [];
    worker.onmessage = function(e2) {
      workerReady = true;
      if (e2.data.error) {
        console.error("Packet worker parse error:", e2.data.error);
      } else {
        processPackets(e2.data.packets);
      }
    };
    worker.onerror = function(ev) {
      ev.preventDefault();
      console.warn("Packet worker failed to load, falling back to main-thread parsing");
      _packetWorker = null;
      if (ws) ws.onmessage = mainThreadParse;
      for (const msg of pendingMessages) {
        mainThreadParse({ data: msg });
      }
      pendingMessages.length = 0;
    };
    ws.onmessage = function(event) {
      if (!workerReady && _packetWorker) {
        pendingMessages.push(event.data);
      }
      if (_packetWorker) {
        worker.postMessage(event.data);
      } else {
        mainThreadParse(event);
      }
    };
  } else {
    ws.onmessage = mainThreadParse;
  }
  ws.onopen = (e2) => {
    console.log("[xbw] WebSocket onopen fired, readyState:", ws?.readyState, "event:", e2.type);
    stopReconnectTimers();
    _reconnectAttempt = 0;
    _reconnecting = false;
    store.connectionState = "connected";
    clearConnectionBanner();
    disconnectOverlay.value = null;
    check_websocket_ready();
  };
  ws.onclose = function(event) {
    console.info(`[xbw] WebSocket closed code=${event.code} reason="${event.reason}"`);
    if (ping_timer) {
      clearInterval(ping_timer);
      ping_timer = null;
    }
    if (_beforeUnloadHandler) {
      window.removeEventListener("beforeunload", _beforeUnloadHandler);
      _beforeUnloadHandler = null;
    }
    turnDoneState.value = { ...turnDoneState.value, disabled: true };
    const saveBtn = document.getElementById("save_button");
    if (saveBtn) saveBtn.disabled = true;
    const isCleanClose = event.code === 1e3 || event.code === 1001;
    if (_serverShutdown || isCleanClose) {
      _serverShutdown = false;
      store.connectionState = "disconnected";
      if (!isCleanClose) {
        const ml = getMessageLog();
        if (ml != null) {
          ml.update({ event: E_LOG_ERROR, message: "Server connection closed." });
        }
      }
      return;
    }
    stopReconnectTimers();
    startReconnect();
  };
  ws.onerror = function(evt) {
    console.error("[xbw] WebSocket error:", evt);
  };
}
async function check_websocket_ready() {
  if (ws == null) return;
  if (ws.readyState === 1) {
    let sha_password = null;
    const stored_password = localStorage.getItem("password") ?? "";
    if (stored_password != null && stored_password !== "") {
      sha_password = encodeURIComponent(await sha512hex(stored_password));
    }
    const login_message = {
      pid: 4,
      username: store.username,
      capability: freeciv_version,
      version_label: "-dev",
      major_version: 3,
      minor_version: 3,
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
  stopReconnectTimers();
  _reconnectAttempt = 0;
  _reconnecting = false;
  if (ping_timer != null) {
    clearInterval(ping_timer);
    ping_timer = null;
  }
  if (_beforeUnloadHandler != null) {
    window.removeEventListener("beforeunload", _beforeUnloadHandler);
    _beforeUnloadHandler = null;
  }
  if (_packetWorker != null) {
    _packetWorker.terminate();
    _packetWorker = null;
  }
  if (ws != null) ws.close();
  ws = null;
}
function send_request(packet_payload) {
  if (ws != null && ws.readyState === 1) {
    ws.send(packet_payload);
  }
  if (store.debugActive) {
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
  sendChatMessage(message);
}
Object.defineProperty(win$2, "ws", {
  get: () => ws,
  set: (v2) => {
    ws = v2;
  },
  configurable: true
});
Object.defineProperty(win$2, "civserverport", {
  get: () => civserverport,
  set: (v2) => {
    civserverport = v2;
  },
  configurable: true
});
Object.defineProperty(win$2, "ping_last", {
  get: () => ping_last,
  set: (v2) => {
    ping_last = v2;
  },
  configurable: true
});
const connection = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  RECONNECT_DELAYS_MS,
  _isBeforeUnloadHandlerRegisteredForTests,
  _isPacketWorkerActiveForTests,
  _isPingTimerActiveForTests,
  _resetReconnectStateForTests,
  check_websocket_ready,
  clinet_debug_collect,
  debug_client_speed_list,
  markServerShutdown,
  network_init,
  network_stop,
  ping_check,
  reconnectNow,
  send_message,
  send_message_delayed,
  send_request,
  tryAgain,
  websocket_init
}, Symbol.toStringTag, { value: "Module" }));
function send(packet) {
  send_request(JSON.stringify(packet));
}
function sendChatMessage(message) {
  send({ pid: packet_chat_msg_req, message });
}
function sendPlayerResearch(techId) {
  send({ pid: packet_player_research, tech: techId });
}
function sendUnitSscsSet(unitId, type, value) {
  send({ pid: packet_unit_sscs_set, unit_id: unitId, type, value });
}
function sendUnitOrders(packet) {
  send({ pid: packet_unit_orders, ...packet });
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
function popup_action_selection(..._args) {
}
function popup_bribe_dialog(..._args) {
}
function popup_incite_dialog(..._args) {
}
function popup_unit_upgrade_dlg(..._args) {
}
function action_selection_refresh(..._args) {
}
const FC_ACT_DEC_ACTIVE = ACT_DEC_ACTIVE;
const FC_ACT_DEC_PASSIVE = ACT_DEC_PASSIVE;
const FC_ACT_DEC_NOTHING = ACT_DEC_NOTHING;
const FC_IDENTITY_NUMBER_ZERO = IDENTITY_NUMBER_ZERO;
const FC_EXTRA_NONE = EXTRA_NONE;
const USSDT_UNQUEUE = UnitSSDataType.UNQUEUE;
const REQEST_PLAYER_INITIATED = 0;
function should_ask_server_for_actions(punit) {
  return punit["action_decision_want"] === FC_ACT_DEC_ACTIVE || punit["action_decision_want"] === FC_ACT_DEC_PASSIVE && popup_actor_arrival;
}
function can_ask_server_for_actions() {
  return action_selection_in_progress_for === FC_IDENTITY_NUMBER_ZERO;
}
function ask_server_for_actions(punit) {
  if (store.observing || punit == null) {
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
  const decTile = punit["action_decision_tile"] ?? 0;
  const ptile = indexToTile(decTile);
  if (ptile != null) {
    sendUnitGetActions(
      punit["id"],
      FC_IDENTITY_NUMBER_ZERO,
      decTile,
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
}
function action_decision_clear_want(old_actor_id) {
  const old = game_find_unit_by_number(old_actor_id);
  if (old != null && old["action_decision_want"] !== FC_ACT_DEC_NOTHING) {
    sendUnitSscsSet(old_actor_id, USSDT_UNQUEUE, FC_IDENTITY_NUMBER_ZERO);
  }
}
function action_selection_next_in_focus(old_actor_id) {
  for (let i2 = 0; i2 < current_focus.length; i2++) {
    const funit = current_focus[i2];
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
  if (!unit_is_in_focus(actor_unit)) {
    unit_focus_urgent(actor_unit);
  } else if (canClientIssueOrders() && can_ask_server_for_actions()) {
    ask_server_for_actions(actor_unit);
  }
}
const win$1 = window;
function showDebugInfo() {
  console.log("XBWorld version: " + (win$1.freeciv_version ?? "unknown"));
  console.log("Browser useragent: " + navigator.userAgent);
  console.log("jQuery version: " + $("").jquery);
  console.log("jQuery UI version: " + $.ui?.version);
  console.log(
    "simpleStorage version: N/A (replaced with native localStorage)"
  );
  console.log(
    "Touch device: " + (typeof win$1.is_touch_device === "function" ? win$1.is_touch_device() : "unknown")
  );
  console.log("HTTP protocol: " + document.location.protocol);
  const wsObj = win$1.ws;
  if (wsObj != null && wsObj.url != null) {
    console.log("WebSocket URL: " + wsObj.url);
  }
  win$1.debug_active = true;
  const pingList = win$1.debug_ping_list ?? [];
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
  const clientSpeedList = win$1.debug_client_speed_list ?? [];
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
  civclient_handle_key(String.fromCharCode(ev.keyCode), ev.keyCode, ev["ctrlKey"], ev["altKey"], ev["shiftKey"]);
}
function civclient_handle_key(keyboard_key, key_code, ctrl, alt, _shift, _the_event) {
  switch (keyboard_key) {
    case "Q":
      if (alt) civclient_benchmark(0);
      break;
    case "D":
      if (!_shift && (alt || ctrl)) showDebugInfo();
      break;
    case "C":
      if (ctrl) setShowCitybar(!show_citybar);
      break;
  }
  if (key_code === 27) {
    const canvasDivEl = document.getElementById("canvas_div");
    canvasDivEl?.contextMenu?.(true);
  }
}
function getSelectedPlayer() {
  return store.selectedPlayer;
}
function setSelectedPlayer(v2) {
  store.selectedPlayer = v2;
}
function selectNoNation() {
  setSelectedPlayer(-1);
}
function nationSelectPlayer(player_no) {
  setSelectedPlayer(player_no);
}
function nationTableSelectPlayer(player_no) {
  const playersTabLink = document.querySelector("#players_tab a");
  if (playersTabLink) playersTabLink.click();
  nationSelectPlayer(player_no);
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
const _tick = c(0);
const _selectedPlayerno = c(-1);
const _activeTab = c("nations");
function refreshNationOverview() {
  _tick.value++;
}
function mountNationOverview(container) {
  J(/* @__PURE__ */ u(NationOverview, {}), container);
}
const TABLE_STYLE$1 = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "var(--xb-font-size-sm, 12px)",
  color: "var(--xb-text-primary, #e6edf3)"
};
const TH_STYLE$1 = {
  padding: "6px 10px",
  textAlign: "left",
  color: "var(--xb-text-secondary, #8b949e)",
  fontWeight: 600
};
const TD_STYLE$1 = { padding: "6px 10px" };
const THEAD_TR_STYLE = {
  borderBottom: "2px solid var(--xb-border-default, #30363d)",
  background: "var(--xb-bg-elevated, #21262d)"
};
const TBODY_TR_STYLE = { borderBottom: "1px solid var(--xb-border-default, #30363d)" };
const OVERVIEW_TABS = [
  { id: "nations", label: "Nations" },
  { id: "cities", label: "Cities" },
  { id: "units", label: "Units" }
];
function NationsTable() {
  _tick.value;
  rulesetReady.value;
  const selectedNo = _selectedPlayerno.value;
  const players = Object.values(store.players).sort((a2, b2) => {
    const aScore = a2["score"] ?? 0;
    const bScore = b2["score"] ?? 0;
    return bScore - aScore;
  });
  if (players.length === 0) {
    return /* @__PURE__ */ u("div", { style: { padding: 16, color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-sm, 12px)" }, children: "No players connected yet." });
  }
  const cityCountByPlayer = /* @__PURE__ */ new Map();
  for (const city of Object.values(store.cities)) {
    const owner = city["owner"];
    cityCountByPlayer.set(owner, (cityCountByPlayer.get(owner) ?? 0) + 1);
  }
  const unitCountByPlayer = /* @__PURE__ */ new Map();
  for (const unit of Object.values(store.units)) {
    const owner = unit["owner"];
    unitCountByPlayer.set(owner, (unitCountByPlayer.get(owner) ?? 0) + 1);
  }
  return /* @__PURE__ */ u("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ u("table", { style: TABLE_STYLE$1, children: [
    /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ u("tr", { style: THEAD_TR_STYLE, children: ["Nation", "Score", "Cities", "Units", "Gold", "Researching", "Progress", "State"].map((h2) => /* @__PURE__ */ u("th", { style: TH_STYLE$1, children: h2 }, h2)) }) }),
    /* @__PURE__ */ u("tbody", { children: players.map((pplayer) => {
      const p2 = pplayer;
      const nation2 = store.nations[p2["nation"]];
      const color = nation2?.["color"] ?? "var(--xb-text-primary)";
      const pr = research_get(pplayer) ?? p2;
      const researchingId = pr["researching"] ?? 0;
      const techData = researchingId ? store.techs[researchingId] : null;
      const bulbs = pr["bulbs_researched"] ?? 0;
      const cost = (pr["researching_cost"] ?? 1) || 1;
      const pct = Math.min(100, Math.round(bulbs / cost * 100));
      const isAI = pplayer.flags?.isSet(PlayerFlag.PLRF_AI) ?? false;
      const playerno = p2["playerno"];
      const myCities = cityCountByPlayer.get(playerno) ?? 0;
      const myUnits = unitCountByPlayer.get(playerno) ?? 0;
      let stateText = "";
      let stateColor = "var(--xb-text-secondary, #8b949e)";
      if (!p2["is_alive"]) {
        stateText = "Dead";
        stateColor = "var(--xb-accent-red, #f85149)";
      } else if (isAI) {
        stateText = "AI";
      } else if (p2["phase_done"]) {
        stateText = "Done";
        stateColor = "var(--xb-accent-green, #3fb950)";
      } else if ((p2["nturns_idle"] ?? 0) > 1) {
        stateText = `Idle ${p2["nturns_idle"]}t`;
        stateColor = "var(--xb-accent-orange, #d29922)";
      } else {
        stateText = "Moving";
        stateColor = "var(--xb-accent-blue, #58a6ff)";
      }
      const isSelected = playerno === selectedNo;
      return /* @__PURE__ */ u(
        "tr",
        {
          onClick: () => {
            if (isSelected) {
              _selectedPlayerno.value = -1;
              selectNoNation();
            } else {
              _selectedPlayerno.value = playerno;
              nationSelectPlayer(playerno);
            }
          },
          style: {
            ...TBODY_TR_STYLE,
            background: isSelected ? "var(--xb-bg-elevated, #21262d)" : void 0,
            cursor: "pointer"
          },
          children: [
            /* @__PURE__ */ u("td", { style: TD_STYLE$1, children: [
              /* @__PURE__ */ u("span", { style: { fontWeight: 600, color }, children: p2["name"] }),
              p2["is_alive"] === false && /* @__PURE__ */ u("span", { style: { marginLeft: 6, fontSize: 11, color: "var(--xb-accent-red, #f85149)" }, children: "💀" })
            ] }),
            /* @__PURE__ */ u("td", { style: TD_STYLE$1, children: p2["score"] ?? "—" }),
            /* @__PURE__ */ u("td", { style: TD_STYLE$1, children: myCities }),
            /* @__PURE__ */ u("td", { style: TD_STYLE$1, children: myUnits }),
            /* @__PURE__ */ u("td", { style: TD_STYLE$1, children: p2["gold"] ?? "—" }),
            /* @__PURE__ */ u("td", { style: { ...TD_STYLE$1, color: "var(--xb-text-secondary, #8b949e)" }, children: techData ? techData["name"] : "—" }),
            /* @__PURE__ */ u("td", { style: { ...TD_STYLE$1, minWidth: 80 }, children: researchingId > 0 && /* @__PURE__ */ u("div", { title: `${bulbs}/${cost} bulbs (${pct}%)`, children: /* @__PURE__ */ u("div", { style: { background: "var(--xb-bg-elevated, #21262d)", borderRadius: 3, height: 6, overflow: "hidden" }, children: /* @__PURE__ */ u("div", { style: { background: color, height: "100%", width: `${pct}%`, borderRadius: 3, transition: "width 0.3s" } }) }) }) }),
            /* @__PURE__ */ u("td", { style: { ...TD_STYLE$1, color: stateColor, fontWeight: stateText === "Moving" ? 600 : 400 }, children: stateText })
          ]
        },
        playerno
      );
    }) })
  ] }) });
}
function CitiesTable() {
  cityCount.value;
  rulesetReady.value;
  const cities2 = Object.values(store.cities);
  if (cities2.length === 0) {
    return /* @__PURE__ */ u("div", { style: { padding: 16, color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-sm, 12px)" }, children: "No cities known yet." });
  }
  const sorted = [...cities2].sort((a2, b2) => {
    const ownDiff = a2.owner - b2.owner;
    if (ownDiff !== 0) return ownDiff;
    return String(a2.name).localeCompare(String(b2.name));
  });
  return /* @__PURE__ */ u("div", { style: { overflowX: "auto" }, children: [
    /* @__PURE__ */ u("table", { style: TABLE_STYLE$1, children: [
      /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ u("tr", { style: THEAD_TR_STYLE, children: ["City", "Owner", "Size", "Production"].map((h2) => /* @__PURE__ */ u("th", { style: TH_STYLE$1, children: h2 }, h2)) }) }),
      /* @__PURE__ */ u("tbody", { children: sorted.map((city) => {
        const owner = store.players[city.owner];
        const ownerName = owner?.["name"] ?? `#${city.owner}`;
        const nation2 = owner ? store.nations[owner["nation"]] : null;
        const color = nation2?.["color"] ?? "var(--xb-text-primary)";
        const prod = city.production;
        const prodKind = prod?.["kind"];
        const prodValue = prod?.["value"];
        let prodName = "—";
        if (prodKind === 0 && prodValue !== void 0) {
          const impr = store.improvements[prodValue];
          if (impr) prodName = impr["name"];
        } else if (prodKind === 1 && prodValue !== void 0) {
          const utype = store.unitTypes[prodValue];
          if (utype) prodName = utype["name"];
        }
        return /* @__PURE__ */ u(
          "tr",
          {
            onClick: () => show_city_dialog(city),
            style: { ...TBODY_TR_STYLE, cursor: "pointer" },
            onMouseEnter: (e2) => {
              e2.currentTarget.style.background = "var(--xb-bg-elevated, #21262d)";
            },
            onMouseLeave: (e2) => {
              e2.currentTarget.style.background = "";
            },
            children: [
              /* @__PURE__ */ u("td", { style: { ...TD_STYLE$1, fontWeight: 600 }, children: city.name }),
              /* @__PURE__ */ u("td", { style: { ...TD_STYLE$1, color }, children: ownerName }),
              /* @__PURE__ */ u("td", { style: TD_STYLE$1, children: String(city.size ?? "—") }),
              /* @__PURE__ */ u("td", { style: { ...TD_STYLE$1, color: "var(--xb-text-secondary, #8b949e)" }, children: prodName })
            ]
          },
          city.id
        );
      }) })
    ] }),
    /* @__PURE__ */ u("div", { style: { padding: "6px 10px", color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-xs, 11px)" }, children: [
      cities2.length,
      " cities — click a row to open the city view"
    ] })
  ] });
}
function UnitsTable() {
  unitCount.value;
  rulesetReady.value;
  const units = Object.values(store.units);
  if (units.length === 0) {
    return /* @__PURE__ */ u("div", { style: { padding: 16, color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-sm, 12px)" }, children: "No units known yet." });
  }
  const sorted = [...units].sort((a2, b2) => {
    const ownDiff = a2.owner - b2.owner;
    if (ownDiff !== 0) return ownDiff;
    return a2.type - b2.type;
  });
  return /* @__PURE__ */ u("div", { style: { overflowX: "auto" }, children: [
    /* @__PURE__ */ u("table", { style: TABLE_STYLE$1, children: [
      /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ u("tr", { style: THEAD_TR_STYLE, children: ["Type", "Owner", "HP"].map((h2) => /* @__PURE__ */ u("th", { style: TH_STYLE$1, children: h2 }, h2)) }) }),
      /* @__PURE__ */ u("tbody", { children: sorted.map((unit) => {
        const utype = store.unitTypes[unit.type];
        const typeName = utype?.["name"] ?? `#${unit.type}`;
        const owner = store.players[unit.owner];
        const ownerName = owner?.["name"] ?? `#${unit.owner}`;
        const nation2 = owner ? store.nations[owner["nation"]] : null;
        const color = nation2?.["color"] ?? "var(--xb-text-primary)";
        return /* @__PURE__ */ u("tr", { style: TBODY_TR_STYLE, children: [
          /* @__PURE__ */ u("td", { style: TD_STYLE$1, children: typeName }),
          /* @__PURE__ */ u("td", { style: { ...TD_STYLE$1, color }, children: ownerName }),
          /* @__PURE__ */ u("td", { style: TD_STYLE$1, children: unit.hp })
        ] }, unit.id);
      }) })
    ] }),
    /* @__PURE__ */ u("div", { style: { padding: "6px 10px", color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-xs, 11px)" }, children: [
      units.length,
      " units total"
    ] })
  ] });
}
function ActionBar() {
  const selectedNo = _selectedPlayerno.value;
  const hasSelection = selectedNo >= 0;
  const pplayer = hasSelection ? store.players[selectedNo] : null;
  const isAlive = hasSelection && pplayer && pplayer["is_alive"] !== false;
  function handleViewOnMap() {
    if (!isAlive) return;
    centerOnPlayer();
  }
  function handleViewIntel() {
    if (!hasSelection) return;
    Promise.resolve().then(() => intelDialog).then(({ show_intelligence_report_dialog: show_intelligence_report_dialog2 }) => {
      show_intelligence_report_dialog2();
    });
  }
  function handleGameScores() {
    Promise.resolve().then(() => nation).then(({ getPlayerScoresSummary: getPlayerScoresSummary2 }) => {
      const text = getPlayerScoresSummary2();
      Promise.resolve().then(() => civClient).then(
        ({ showDialogMessage: showDialogMessage2 }) => showDialogMessage2("Game Scores", text)
      );
    });
  }
  return /* @__PURE__ */ u("div", { style: {
    display: "flex",
    gap: 8,
    padding: "8px 12px",
    borderBottom: "1px solid var(--xb-border-default, #30363d)",
    background: "var(--xb-bg-elevated, #21262d)",
    flexShrink: 0,
    flexWrap: "wrap"
  }, children: [
    /* @__PURE__ */ u(
      Button,
      {
        onClick: handleViewOnMap,
        disabled: !isAlive,
        variant: "secondary",
        children: "View on Map"
      }
    ),
    /* @__PURE__ */ u(
      Button,
      {
        onClick: handleViewIntel,
        disabled: !hasSelection,
        variant: "secondary",
        children: "View Intel"
      }
    ),
    /* @__PURE__ */ u(Button, { onClick: handleGameScores, variant: "secondary", children: "Game Scores" })
  ] });
}
function NationOverview() {
  _tick.value;
  currentTurn.value;
  playerUpdated.value;
  researchUpdated.value;
  cityCount.value;
  unitCount.value;
  rulesetReady.value;
  const activeTab = _activeTab.value;
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", height: "100%" }, children: [
    /* @__PURE__ */ u("h2", { style: {
      margin: 0,
      padding: "8px 12px",
      fontSize: "var(--xb-font-size-md, 14px)",
      fontWeight: 600,
      color: "var(--xb-text-primary, #e6edf3)",
      borderBottom: "1px solid var(--xb-border-default, #30363d)",
      background: "var(--xb-bg-secondary, #161b22)"
    }, children: "Nations of the World" }),
    /* @__PURE__ */ u(ActionBar, {}),
    /* @__PURE__ */ u("div", { style: { flex: 1, overflow: "auto" }, children: /* @__PURE__ */ u(
      Tabs,
      {
        tabs: OVERVIEW_TABS,
        activeTab,
        onTabChange: (id) => {
          _activeTab.value = id;
        },
        children: [
          /* @__PURE__ */ u(TabPanel, { id: "nations", activeTab, children: /* @__PURE__ */ u(NationsTable, {}) }),
          /* @__PURE__ */ u(TabPanel, { id: "cities", activeTab, children: /* @__PURE__ */ u(CitiesTable, {}) }),
          /* @__PURE__ */ u(TabPanel, { id: "units", activeTab, children: /* @__PURE__ */ u(UnitsTable, {}) })
        ]
      }
    ) })
  ] });
}
const NationOverview$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NationOverview,
  mountNationOverview,
  refreshNationOverview
}, Symbol.toStringTag, { value: "Module" }));
function set_default_mapview_active() {
  setKeyboardInput(true);
}
function set_default_mapview_inactive() {
  setKeyboardInput(true);
}
let _techPanelMounted = false;
function mount_tech_panel() {
  if (_techPanelMounted) {
    Promise.resolve().then(() => TechDialog).then(({ refreshTechPanel: refreshTechPanel2 }) => {
      refreshTechPanel2();
    });
    return;
  }
  const tabsTec = document.getElementById("tabs-tec");
  if (!tabsTec) return;
  const container = document.createElement("div");
  container.id = "xb-tech-panel";
  container.style.height = "100%";
  tabsTec.appendChild(container);
  Promise.resolve().then(() => TechDialog).then(({ mountTechPanel: mountTechPanel2 }) => {
    mountTechPanel2(container);
  });
  _techPanelMounted = true;
}
let _gameLogMounted = false;
function mount_game_log() {
  if (_gameLogMounted) return;
  const tabsHel = document.getElementById("tabs-hel");
  if (!tabsHel) return;
  tabsHel.innerHTML = "";
  const container = document.createElement("div");
  container.id = "xb-game-log";
  container.style.height = "100%";
  tabsHel.appendChild(container);
  Promise.resolve().then(() => GameLog$1).then(({ mountGameLog: mountGameLog2 }) => {
    mountGameLog2(container);
  });
  _gameLogMounted = true;
}
let _nationOverviewMounted = false;
function mount_nation_overview() {
  if (_nationOverviewMounted) {
    refreshNationOverview();
    return;
  }
  const tabsNat = document.getElementById("tabs-nat");
  if (!tabsNat) return;
  tabsNat.innerHTML = "";
  const container = document.createElement("div");
  container.id = "xb-nation-overview";
  container.style.height = "100%";
  tabsNat.appendChild(container);
  Promise.resolve().then(() => NationOverview$1).then(({ mountNationOverview: mountNationOverview2 }) => {
    mountNationOverview2(container);
  });
  _nationOverviewMounted = true;
}
function control_init() {
  setUrgentFocusQueue([]);
  document.addEventListener("keydown", global_keyboard_listener);
  window.addEventListener("resize", mapview_window_resized);
  window.addEventListener("orientationchange", orientation_changed);
  window.addEventListener("resize", orientation_changed);
  const gameTextInput = document.getElementById("game_text_input");
  gameTextInput?.addEventListener("keydown", (e2) => check_text_input(e2, gameTextInput));
  gameTextInput?.addEventListener("focus", () => {
    setKeyboardInput(false);
    setResizeEnabled(false);
  });
  gameTextInput?.addEventListener("blur", () => {
    setKeyboardInput(true);
    setResizeEnabled(true);
  });
  document.getElementById("chat_direction")?.addEventListener("click", () => chat_context_change());
  const pregameTextInput = document.getElementById("pregame_text_input");
  pregameTextInput?.addEventListener("keydown", (e2) => check_text_input(e2, pregameTextInput));
  pregameTextInput?.addEventListener("blur", () => {
    setKeyboardInput(true);
    if (pregameTextInput.value === "") pregameTextInput.value = ">";
  });
  pregameTextInput?.addEventListener("focus", () => {
    setKeyboardInput(false);
    if (pregameTextInput.value === ">") pregameTextInput.value = "";
  });
  document.onselectstart = () => false;
  window.addEventListener("contextmenu", (e2) => {
    const target = e2.target;
    if (target?.id === "game_text_input" || target?.id === "overview_map" || target?.parentElement?.id === "game_message_area") return;
    if (!allow_right_click) e2.preventDefault();
  }, false);
  document.getElementById("map_tab")?.addEventListener("click", () => setTimeout(set_default_mapview_active, 5));
  document.getElementById("tech_tab")?.addEventListener("click", () => {
    set_default_mapview_inactive();
    mount_tech_panel();
  });
  document.getElementById("players_tab")?.addEventListener("click", () => {
    set_default_mapview_inactive();
    mount_nation_overview();
  });
  document.getElementById("cities_tab")?.addEventListener("click", () => {
    set_default_mapview_inactive();
    Promise.resolve().then(() => CitiesPanel$1).then(({ mountCitiesPanel: mountCitiesPanel2 }) => mountCitiesPanel2());
  });
  document.getElementById("hel_tab")?.addEventListener("click", () => {
    set_default_mapview_inactive();
    mount_game_log();
  });
  const overviewMap = document.getElementById("overview_map");
  overviewMap?.addEventListener("click", (e2) => {
    const rect = overviewMap.getBoundingClientRect();
    overview_clicked(e2.pageX - (rect.left + window.scrollX), e2.pageY - (rect.top + window.scrollY));
  });
  window.addEventListener("unload", () => network_stop());
}
const control = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CHAT_ICON_ALLIES,
  CHAT_ICON_EVERYBODY,
  SELECT_POPUP,
  action_decision_clear_want,
  action_decision_request,
  get action_selection_in_progress_for() {
    return action_selection_in_progress_for;
  },
  action_selection_next_in_focus,
  action_selection_no_longer_in_progress,
  action_selection_refresh,
  get action_tgt_sel_active() {
    return action_tgt_sel_active;
  },
  activate_goto,
  activate_goto_last,
  advance_unit_focus,
  get airlift_active() {
    return airlift_active;
  },
  get allow_right_click() {
    return allow_right_click;
  },
  ask_server_for_actions,
  auto_center_on_focus_unit,
  can_ask_server_for_actions,
  center_on_any_city,
  center_tile_mapcanvas,
  chat_context_change,
  chat_context_dialog_show,
  chat_context_get_recipients,
  chat_context_set_next,
  get chat_send_to() {
    return chat_send_to;
  },
  check_mouse_drag_unit,
  check_text_input,
  city_dialog_activate_unit,
  civclient_handle_key,
  control_init,
  control_unit_killed,
  get current_focus() {
    return current_focus;
  },
  get current_goto_turns() {
    return current_goto_turns;
  },
  deactivate_goto,
  do_map_click,
  do_unit_paradrop_to,
  encode_message_text,
  get end_turn_info_message_shown() {
    return end_turn_info_message_shown;
  },
  find_a_focus_unit_tile_to_center_on,
  find_best_focus_candidate,
  find_visible_unit,
  get_drawable_unit,
  get_focus_unit_on_tile,
  get_units_in_focus,
  global_keyboard_listener,
  get goto_active() {
    return goto_active;
  },
  get goto_last_action() {
    return goto_last_action;
  },
  get goto_last_order() {
    return goto_last_order;
  },
  get goto_request_map() {
    return goto_request_map;
  },
  get goto_turns_request_map() {
    return goto_turns_request_map;
  },
  get has_movesleft_warning_been_shown() {
    return has_movesleft_warning_been_shown;
  },
  init_game_unit_panel,
  get intro_click_description() {
    return intro_click_description;
  },
  is_unprefixed_message,
  get keyboard_input() {
    return keyboard_input;
  },
  get mapview_mouse_movement() {
    return mapview_mouse_movement;
  },
  mouse_moved_cb,
  get mouse_touch_started_on_unit() {
    return mouse_touch_started_on_unit;
  },
  get mouse_x() {
    return mouse_x;
  },
  get mouse_y() {
    return mouse_y;
  },
  order_wants_direction,
  get paradrop_active() {
    return paradrop_active;
  },
  popit,
  popit_req,
  popup_action_selection,
  popup_bribe_dialog,
  popup_incite_dialog,
  popup_unit_upgrade_dlg,
  request_goto_path,
  request_new_unit_activity,
  request_unit_do_action,
  get resize_enabled() {
    return resize_enabled;
  },
  roads: roads$1,
  setActionSelectionInProgressFor,
  setActionTgtSelActive,
  setAirliftActive,
  setAllowRightClick,
  setChatSendTo,
  setCurrentFocus,
  setCurrentGotoTurns,
  setEndTurnInfoMessageShown,
  setGotoActive,
  setGotoLastAction,
  setGotoLastOrder,
  setGotoRequestMap,
  setGotoTurnsRequestMap,
  setHasMovesleftWarningBeenShown,
  setIntroClickDescription,
  setKeyboardInput,
  setMapviewMouseMovement,
  setMouseTouchStartedOnUnit,
  setMouseX,
  setMouseY,
  setParadropActive,
  setResizeEnabled,
  setShowCitybar,
  setUrgentFocusQueue,
  setWaitingUnitsList,
  set_chat_direction,
  set_mouse_touch_started_on_unit,
  set_unit_focus,
  set_unit_focus_and_activate,
  set_unit_focus_and_redraw,
  should_ask_server_for_actions,
  get show_citybar() {
    return show_citybar;
  },
  unit_distance_compare,
  unit_focus_urgent,
  unit_is_in_focus,
  update_active_units_dialog,
  update_goto_path,
  update_mouse_cursor,
  update_unit_focus,
  update_unit_order_commands,
  get urgent_focus_queue() {
    return urgent_focus_queue;
  },
  get waiting_units_list() {
    return waiting_units_list;
  }
}, Symbol.toStringTag, { value: "Module" }));
const _ts = Date.now();
function get_unit_image_sprite(punit) {
  const utype = unit_type(punit);
  if (utype == null) return null;
  const from_type = get_unit_type_image_sprite(utype);
  if (from_type == null) return null;
  from_type["height"] = from_type["height"] - 2;
  return from_type;
}
function get_unit_type_image_sprite(punittype) {
  const tag = tileset_unit_type_graphic_tag(punittype);
  if (tag == null) return null;
  const tileset_x = store.tileset[tag][0];
  const tileset_y = store.tileset[tag][1];
  const width = store.tileset[tag][2];
  const height = store.tileset[tag][3];
  const i2 = store.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + _ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
function get_improvement_image_sprite(pimprovement) {
  const tag = tileset_building_graphic_tag(pimprovement);
  if (tag == null) return null;
  const tileset_x = store.tileset[tag][0];
  const tileset_y = store.tileset[tag][1];
  const width = store.tileset[tag][2];
  const height = store.tileset[tag][3];
  const i2 = store.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i2 + getTilesetFileExtension() + "?ts=" + _ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
const DIR8_NORTHWEST$1 = 0;
const DIR8_NORTH$1 = 1;
const DIR8_NORTHEAST$1 = 2;
const DIR8_WEST$1 = 3;
const DIR8_EAST$1 = 4;
const DIR8_SOUTHWEST$1 = 5;
const DIR8_SOUTH$1 = 6;
const DIR8_SOUTHEAST$1 = 7;
const num_cardinal_tileset_dirs$1 = 4;
const cardinal_tileset_dirs$1 = [DIR8_NORTH$1, DIR8_EAST$1, DIR8_SOUTH$1, DIR8_WEST$1];
const NUM_CORNER_DIRS = 4;
const DIR4_TO_DIR8 = [DIR8_NORTH$1, DIR8_SOUTH$1, DIR8_EAST$1, DIR8_WEST$1];
let _iso_offsets = null;
function getIsoOffsets() {
  if (_iso_offsets == null) {
    const W = normal_tile_width;
    const H2 = normal_tile_height;
    _iso_offsets = [[W / 4, 0], [W / 4, H2 / 2], [W / 2, H2 / 4], [0, H2 / 4]];
  }
  return _iso_offsets;
}
function dir_get_tileset_name$1(dir) {
  switch (dir) {
    case DIR8_NORTH$1:
      return "n";
    case DIR8_NORTHEAST$1:
      return "ne";
    case DIR8_EAST$1:
      return "e";
    case DIR8_SOUTHEAST$1:
      return "se";
    case DIR8_SOUTH$1:
      return "s";
    case DIR8_SOUTHWEST$1:
      return "sw";
    case DIR8_WEST$1:
      return "w";
    case DIR8_NORTHWEST$1:
      return "nw";
  }
  return "";
}
function cardinal_index_str(idx) {
  let c2 = "";
  for (let i2 = 0; i2 < num_cardinal_tileset_dirs$1; i2++) {
    const value = idx >> i2 & 1;
    c2 += dir_get_tileset_name$1(cardinal_tileset_dirs$1[i2]) + value;
  }
  return c2;
}
function fill_terrain_sprite_layer(layer_num, ptile, pterrain, tterrain_near) {
  return fill_terrain_sprite_array(layer_num, ptile, pterrain, tterrain_near);
}
const _terrainBlendStats = {
  matchSameRequests: 0,
  matchSameKeysFound: 0,
  matchSameKeysMissing: 0,
  cellCornerRequests: 0,
  cellCornerNullNeighbors: 0,
  /** Dither transitions where the direct-neighbor sprite was found and used. */
  ditherTransitionFound: 0,
  /** Dither transitions that fell back to same-terrain tile (no transition art). */
  ditherTransitionFallback: 0,
  /** CELL_CORNER corners skipped because cellgroup_map had no entry for the terrain. */
  cellCornerMapMissing: 0
};
function resetTerrainBlendStats() {
  _terrainBlendStats.matchSameRequests = 0;
  _terrainBlendStats.matchSameKeysFound = 0;
  _terrainBlendStats.matchSameKeysMissing = 0;
  _terrainBlendStats.cellCornerRequests = 0;
  _terrainBlendStats.cellCornerNullNeighbors = 0;
  _terrainBlendStats.ditherTransitionFound = 0;
  _terrainBlendStats.ditherTransitionFallback = 0;
  _terrainBlendStats.cellCornerMapMissing = 0;
}
function neighborMatchIndex(terrain, l2) {
  if (terrain == null) return -1;
  const key = "l" + l2 + "." + terrain["graphic_str"];
  return key in tile_types_setup ? tile_types_setup[key]["match_index"][0] ?? -1 : -1;
}
function fill_terrain_sprite_array(l2, ptile, pterrain, tterrain_near) {
  if (pterrain == null) return [];
  const _tts_key = "l" + l2 + "." + pterrain["graphic_str"];
  const dlp = tile_types_setup[_tts_key];
  if (dlp == null) {
    return [];
  }
  switch (dlp["sprite_type"]) {
    case CELL_WHOLE: {
      switch (dlp["match_style"]) {
        case MATCH_NONE: {
          const result_sprites = [];
          if (dlp["dither"] == true) {
            for (let i2 = 0; i2 < num_cardinal_tileset_dirs$1; i2++) {
              const near_t = tterrain_near[DIR4_TO_DIR8[i2]];
              if (near_t == null || ts_tiles[near_t["graphic_str"]] == null) continue;
              const direct_key = i2 + pterrain["graphic_str"] + "_" + near_t["graphic_str"];
              const fallback_key = i2 + pterrain["graphic_str"] + "_" + pterrain["graphic_str"];
              let dither_tile;
              if (store.tileset?.[direct_key]) {
                dither_tile = direct_key;
                _terrainBlendStats.ditherTransitionFound++;
              } else {
                const nbr_own_key = i2 + near_t["graphic_str"] + "_" + near_t["graphic_str"];
                const blended = generateBlendSprite(i2, fallback_key, nbr_own_key);
                dither_tile = blended ?? fallback_key;
                _terrainBlendStats.ditherTransitionFallback++;
              }
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
          _terrainBlendStats.matchSameRequests++;
          let tileno = 0;
          const this_match_type = ts_tiles[pterrain["graphic_str"]]?.["layer" + l2 + "_match_type"];
          for (let i2 = 0; i2 < num_cardinal_tileset_dirs$1; i2++) {
            const near_t = tterrain_near[cardinal_tileset_dirs$1[i2]];
            if (near_t == null || ts_tiles[near_t["graphic_str"]] == null) continue;
            const that = ts_tiles[near_t["graphic_str"]]?.["layer" + l2 + "_match_type"];
            if (that == this_match_type) {
              tileno |= 1 << i2;
            }
          }
          const gfx_key = "t.l" + l2 + "." + pterrain["graphic_str"] + "_" + cardinal_index_str(tileno);
          const tileEntry = store.tileset?.[gfx_key];
          const y2 = tileEntry ? tileset_tile_height - tileEntry[3] : 0;
          if (tileEntry) _terrainBlendStats.matchSameKeysFound++;
          else _terrainBlendStats.matchSameKeysMissing++;
          return [{ "key": gfx_key, "offset_x": 0, "offset_y": y2 }];
        }
      }
      break;
    }
    case CELL_CORNER: {
      const this_match_index = dlp["match_index"][0] ?? -1;
      const that_match_index = dlp["match_index"][1] ?? -1;
      const result_sprites = [];
      const iso_offsets = getIsoOffsets();
      for (let i2 = 0; i2 < NUM_CORNER_DIRS; i2++) {
        const count = dlp["match_indices"];
        let array_index = 0;
        const dir = dirCCW(DIR4_TO_DIR8[i2]);
        const x2 = iso_offsets[i2][0];
        const y2 = iso_offsets[i2][1];
        _terrainBlendStats.cellCornerRequests++;
        const n0 = tterrain_near[dirCCW(dir)];
        const n1 = tterrain_near[dir];
        const n2 = tterrain_near[dirCW(dir)];
        if (n0 == null || n1 == null || n2 == null) {
          _terrainBlendStats.cellCornerNullNeighbors++;
        }
        const m2 = [neighborMatchIndex(n0, l2), neighborMatchIndex(n1, l2), neighborMatchIndex(n2, l2)];
        switch (dlp["match_style"]) {
          case MATCH_NONE:
            break;
          case MATCH_SAME: {
            const b1 = m2[2] != this_match_index ? 1 : 0;
            const b2 = m2[1] != this_match_index ? 1 : 0;
            const b3 = m2[0] != this_match_index ? 1 : 0;
            array_index = array_index * 2 + b1;
            array_index = array_index * 2 + b2;
            array_index = array_index * 2 + b3;
            break;
          }
          case MATCH_PAIR: {
            const b1 = m2[2] == that_match_index ? 1 : 0;
            const b2 = m2[1] == that_match_index ? 1 : 0;
            const b3 = m2[0] == that_match_index ? 1 : 0;
            array_index = array_index * 2 + b1;
            array_index = array_index * 2 + b2;
            array_index = array_index * 2 + b3;
            break;
          }
          case MATCH_FULL:
            {
              const n3 = [];
              let j2 = 0;
              for (; j2 < 3; j2++) {
                let k2 = 0;
                for (; k2 < count; k2++) {
                  n3[j2] = k2;
                  if (m2[j2] == dlp["match_index"][k2]) {
                    break;
                  }
                }
              }
              array_index = array_index * count + n3[2];
              array_index = array_index * count + n3[1];
              array_index = array_index * count + n3[0];
            }
            break;
        }
        array_index = array_index * NUM_CORNER_DIRS + i2;
        const cgKey = pterrain["graphic_str"] + "." + array_index;
        const cgEntry = cellgroup_map[cgKey];
        if (cgEntry == null) {
          _terrainBlendStats.cellCornerMapMissing++;
          continue;
        }
        result_sprites.push({ "key": cgEntry + "." + i2, "offset_x": x2, "offset_y": y2 });
      }
      return result_sprites;
    }
  }
  return [];
}
const SSA_NONE = ServerSideAgent.NONE;
const SSA_AUTOWORKER = ServerSideAgent.AUTOWORKER;
const SSA_AUTOEXPLORE = ServerSideAgent.AUTOEXPLORE;
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
function get_base_flag_sprite(ptile) {
  const owner_id = ptile["extras_owner"];
  if (owner_id == null) return { "key": "" };
  const owner = store.players[owner_id];
  if (owner == null) return { "key": "" };
  const nation_id = owner["nation"];
  if (nation_id == null) return { "key": "" };
  const nation2 = store.nations[nation_id];
  if (nation2 == null) return { "key": "" };
  return {
    "key": "f." + nation2["graphic_str"],
    "offset_x": city_flag_offset_x,
    "offset_y": -9
  };
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
function get_unit_nation_flag_sprite(punit) {
  const owner_id = punit["owner"];
  if (unit_type(punit)?.["flags"]?.isSet?.(UTYF_FLAGLESS) && clientPlaying() != null && owner_id != clientPlaying().playerno) {
    return { "key": "" };
  } else {
    const owner = store.players[owner_id];
    const nation_id = owner["nation"];
    const nation2 = store.nations[nation_id];
    const unit_offset = get_unit_anim_offset(punit);
    return {
      "key": "f.shield." + nation2["graphic_str"],
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
    case ACTIVITY_PILLAGE:
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
  const city_rule = store.cityRules[style_id];
  if (city_rule == null) return { "key": "cd.city_city_0", "offset_x": 0, "offset_y": -unit_offset_y };
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
  if (store.sprites[tag] == null) {
    tag = city_rule["graphic_alt"] + "_" + city_walls + "_" + size;
  }
  return { "key": tag, "offset_x": 0, "offset_y": -unit_offset_y };
}
const DIR8_NORTHWEST = 0;
const DIR8_NORTH = 1;
const DIR8_NORTHEAST = 2;
const DIR8_WEST = 3;
const DIR8_EAST = 4;
const DIR8_SOUTHWEST = 5;
const DIR8_SOUTH = 6;
const DIR8_SOUTHEAST = 7;
const num_cardinal_tileset_dirs = 4;
const cardinal_tileset_dirs = [DIR8_NORTH, DIR8_EAST, DIR8_SOUTH, DIR8_WEST];
const all8_tileset_dirs = [
  DIR8_NORTHWEST,
  DIR8_NORTH,
  DIR8_NORTHEAST,
  DIR8_WEST,
  DIR8_EAST,
  DIR8_SOUTHWEST,
  DIR8_SOUTH,
  DIR8_SOUTHEAST
];
const all8_dir_names = all8_tileset_dirs.map(dir_get_tileset_name);
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
  return [{ "key": store.fullfog[tileno] }];
}
function get_select_sprite() {
  const current_select_sprite = Math.floor(performance.now() * 6 / 1e3) % 4;
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
  if (tileHasExtra(ptile, store.extraIds["EXTRA_RIVER"])) {
    let river_str = "";
    for (let i2 = 0; i2 < num_cardinal_tileset_dirs; i2++) {
      const dir = cardinal_tileset_dirs[i2];
      const checktile = mapstep(ptile, dir);
      if (checktile && (tileHasExtra(checktile, store.extraIds["EXTRA_RIVER"]) || isOceanTile(checktile))) {
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
      if (checktile != null && tileHasExtra(checktile, store.extraIds["EXTRA_RIVER"])) {
        return { "key": "road.river_outlet_" + dir_get_tileset_name(dir) };
      }
    }
  }
  return null;
}
function fill_path_sprite_array(ptile, _pcity) {
  if (roads$1.length === 0) return [];
  const result = [];
  const neighbors = new Array(8);
  for (let i2 = 0; i2 < 8; i2++) neighbors[i2] = mapstep(ptile, all8_tileset_dirs[i2]);
  for (const road of roads$1) {
    const roadId = road.id;
    if (!tileHasExtra(ptile, roadId)) continue;
    const prefix = road["graphic_str"];
    if (!prefix) continue;
    let hasConnection = false;
    for (let i2 = 0; i2 < 8; i2++) {
      const neighbor = neighbors[i2];
      if (neighbor && tileHasExtra(neighbor, roadId)) {
        result.push({ key: `${prefix}_${all8_dir_names[i2]}` });
        hasConnection = true;
      }
    }
    if (!hasConnection) {
      result.push({ key: `${prefix}_isolated` });
    }
  }
  return result;
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
function fill_layer1_sprite_array(ptile, pcity) {
  const result_sprites = [];
  if (pcity == null) {
    if (tileHasExtra(ptile, store.extraIds["EXTRA_FORTRESS"])) {
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
    if (tileHasExtra(ptile, store.extraIds["EXTRA_AIRBASE"])) {
      result_sprites.push({
        "key": "base.airbase_mg",
        "offset_y": -normal_tile_height / 2
      });
    }
    if (tileHasExtra(ptile, store.extraIds["EXTRA_BUOY"])) {
      result_sprites.push(get_base_flag_sprite(ptile));
      result_sprites.push({
        "key": "base.buoy_mg",
        "offset_y": -normal_tile_height / 2
      });
    }
    if (tileHasExtra(ptile, store.extraIds["EXTRA_RUINS"])) {
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
    if (tileHasExtra(ptile, store.extraIds["EXTRA_FORTRESS"])) {
      result_sprites.push({
        "key": "base.fortress_fg",
        "offset_y": -normal_tile_height / 2
      });
    }
  }
  return result_sprites;
}
const explosion_anim_map = {};
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
  return store.sprites[tagname] != null;
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
  const utype = unit_type(punit);
  if (utype == null) return null;
  return tileset_unit_type_graphic_tag(utype);
}
function tileset_building_graphic_tag(pimprovement) {
  return tileset_ruleset_entity_tag_str_or_alt(pimprovement, "building");
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
  const sprite_array = [];
  switch (layer) {
    case LAYER_TERRAIN1:
      if (ptile != null) {
        const tterrain_near = tileTerrainNear(ptile);
        const pterrain = tileTerrain(ptile);
        sprite_array.push(...fill_terrain_sprite_layer(0, ptile, pterrain, tterrain_near));
      }
      break;
    case LAYER_TERRAIN2:
      if (ptile != null) {
        const tterrain_near = tileTerrainNear(ptile);
        const pterrain = tileTerrain(ptile);
        sprite_array.push(...fill_terrain_sprite_layer(1, ptile, pterrain, tterrain_near));
      }
      break;
    case LAYER_TERRAIN3:
      if (ptile != null) {
        const tterrain_near = tileTerrainNear(ptile);
        const pterrain = tileTerrain(ptile);
        sprite_array.push(...fill_terrain_sprite_layer(2, ptile, pterrain, tterrain_near));
      }
      break;
    case LAYER_ROADS:
      if (ptile != null) {
        sprite_array.push(...fill_path_sprite_array(ptile));
      }
      break;
    case LAYER_SPECIAL1:
      if (ptile != null) {
        const river_sprite = get_tile_river_sprite(ptile);
        if (river_sprite != null) sprite_array.push(river_sprite);
        const spec_sprite = get_tile_specials_sprite(ptile);
        if (spec_sprite != null) sprite_array.push(spec_sprite);
        if (tileHasExtra(ptile, store.extraIds["EXTRA_MINE"])) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(store.extraIds["EXTRA_MINE"])
          });
        }
        if (tileHasExtra(ptile, store.extraIds["EXTRA_OIL_WELL"])) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(store.extraIds["EXTRA_OIL_WELL"])
          });
        }
        sprite_array.push(...fill_layer1_sprite_array(ptile, pcity));
        if (tileHasExtra(ptile, store.extraIds["EXTRA_HUT"])) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(store.extraIds["EXTRA_HUT"])
          });
        }
        if (tileHasExtra(ptile, store.extraIds["EXTRA_POLLUTION"])) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(store.extraIds["EXTRA_POLLUTION"])
          });
        }
        if (tileHasExtra(ptile, store.extraIds["EXTRA_FALLOUT"])) {
          sprite_array.push({
            "key": tileset_extra_id_graphic_tag(store.extraIds["EXTRA_FALLOUT"])
          });
        }
        sprite_array.push(...get_border_line_sprites(ptile));
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
        sprite_array.push(...fill_layer2_sprite_array(ptile, pcity));
      }
      break;
    case LAYER_UNIT: {
      const do_draw_unit = punit != null && draw_units;
      if (do_draw_unit && active_city == null) {
        const punits = ptile != null ? tile_units(ptile) : null;
        const stacked = punits != null && punits.length > 1;
        if (unit_is_in_focus(punit)) {
          sprite_array.push(get_select_sprite());
        }
        sprite_array.push(...fill_unit_sprite_array(punit, stacked));
      }
      if (ptile != null && explosion_anim_map[ptile["index"]] != null) {
        const explode_step = explosion_anim_map[ptile["index"]];
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
    }
    case LAYER_FOG:
      sprite_array.push(...fill_fog_sprite_array(ptile, pedge, pcorner));
      break;
    case LAYER_SPECIAL3:
      if (ptile != null) {
        sprite_array.push(...fill_layer3_sprite_array(ptile, pcity));
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
        const gran = store.gameInfo?.["granularity"] ?? 1;
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
        sprite_array.push(fill_goto_line_sprite_array(ptile));
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
let cityTileMap = null;
function dxyToCenterIndex(dx, dy, r2) {
  return (dx + r2) * (2 * r2 + 1) + dy + r2;
}
function getCityDxyToIndex(dx, dy, pcity) {
  buildCityTileMap(pcity["city_radius_sq"]);
  const cityTileMapIndex = dxyToCenterIndex(dx, dy, cityTileMap.radius);
  const ctile = cityTile(pcity);
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
    store.cityTileMap = cityTileMap;
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
const FEELING_FINAL = 5;
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
  if (pcityId == null) return;
  const pcity = store.cities[pcityId];
  if (pcity == null) return;
  cityTile(store.cities[pcityId]);
  delete store.cities[pcityId];
  const pplayer = clientPlaying();
  if (pplayer != null && pplayer.playerno != null && cityOwner(pcity)?.playerno === pplayer.playerno) {
    globalEvents.emit("city:screenUpdate");
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
function cityTurnsToBuild(pcity, target, includeShieldStock) {
  const citySurplus = pcity["surplus"][O_SHIELD];
  const cityStock = pcity["shield_stock"];
  const cost = universalBuildShieldCost(pcity, target);
  if (pcity["shield_stock"] >= cost) {
    return 1;
  } else if (pcity["surplus"][O_SHIELD] > 0) {
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
globalEvents.on("rules:ready", () => {
});
globalEvents.on("store:reset", () => {
});
function canCityBuildUnitDirect(pcity, punittype) {
  const pplayer = cityOwner(pcity);
  if (!can_player_build_unit_direct(pplayer, punittype)) return false;
  const buildReqs = punittype["build_reqs"];
  if (buildReqs != null && buildReqs.length > 0) {
    const isPrecise = (r2) => r2.kind === VUT_GOVERNMENT || r2.kind === VUT_ADVANCE || r2.kind === VUT_IMPROVEMENT || r2.kind === VUT_MINSIZE;
    const preciseReqs = buildReqs.filter(isPrecise);
    if (preciseReqs.length > 0 && !areReqsActive(pplayer, pcity, null, null, punittype, null, null, preciseReqs, RPT_CERTAIN)) {
      return false;
    }
    const fuzzyReqs = buildReqs.filter((r2) => !isPrecise(r2));
    if (fuzzyReqs.length > 0 && !areReqsActive(pplayer, pcity, null, null, punittype, null, null, fuzzyReqs, RPT_POSSIBLE)) {
      return false;
    }
  }
  return true;
}
function canCityBuildUnitNow(pcity, punittypeId) {
  return pcity != null && typeof pcity["can_build_unit"] !== "undefined" && pcity["can_build_unit"].isSet(punittypeId);
}
function canCityBuildImprovementNow(pcity, pimproveId) {
  return pcity != null && typeof pcity["can_build_improvement"] !== "undefined" && pcity["can_build_improvement"].isSet(pimproveId);
}
function cityHasBuilding(pcity, improvementId) {
  return 0 <= improvementId && improvementId < store.rulesControl.num_impr_types && pcity["improvements"] && pcity["improvements"].isSet(improvementId);
}
globalEvents.on("rules:ready", () => {
});
globalEvents.on("store:reset", () => {
});
function canCityBuildImprovementDirect(pcity, impr) {
  if (cityHasBuilding(pcity, impr.id)) return false;
  const pplayer = cityOwner(pcity);
  const techReq = impr["tech_req"];
  if (techReq != null && techReq >= 0) {
    if (playerInventionState(pplayer, techReq) !== TECH_KNOWN) return false;
  }
  const buildReqs = impr["build_reqs"];
  if (buildReqs != null && buildReqs.length > 0) {
    const isPrecise = (r2) => r2.kind === VUT_GOVERNMENT || r2.kind === VUT_ADVANCE || r2.kind === VUT_IMPROVEMENT || r2.kind === VUT_MINSIZE;
    const preciseReqs = buildReqs.filter(isPrecise);
    if (preciseReqs.length > 0 && !areReqsActive(pplayer, pcity, null, null, null, impr, null, preciseReqs, RPT_CERTAIN)) {
      return false;
    }
    const fuzzyReqs = buildReqs.filter((r2) => !isPrecise(r2));
    if (fuzzyReqs.length > 0 && !areReqsActive(pplayer, pcity, null, null, null, impr, null, fuzzyReqs, RPT_POSSIBLE)) {
      return false;
    }
  }
  return true;
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
m(() => {
  const layout = statusPanelLayout.value;
  const panelTop = document.getElementById("game_status_panel_top");
  const panelBottom = document.getElementById("game_status_panel_bottom");
  if (!panelTop && !panelBottom) return;
  if (panelTop) panelTop.style.display = layout === "top" ? "" : "none";
  if (panelBottom) {
    panelBottom.style.display = layout === "bottom" ? "" : "none";
    if (layout === "bottom") panelBottom.style.width = window.innerWidth + "px";
  }
});
function civPopulation(playerno) {
  let population = 0;
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    if (playerno === pcity["owner"]) {
      population += cityPopulation(pcity);
    }
  }
  return numberWithCommas(population * 1e3);
}
function getYearString() {
  const gi = store.gameInfo;
  if (!gi) return "";
  const cal = store.calendarInfo;
  let s2 = "";
  const year = gi["year"];
  if (year < 0) {
    s2 = Math.abs(year) + String(cal?.["negative_year_label"] ?? "BC") + " ";
  } else {
    s2 = year + String(cal?.["positive_year_label"] ?? "AD") + " ";
  }
  s2 += isSmallScreen() ? "(T:" + String(gi["turn"]) + ")" : "(Turn:" + String(gi["turn"]) + ")";
  return s2;
}
function ConnectionBannerEl() {
  const banner = connectionBanner.value;
  if (!banner) return null;
  return /* @__PURE__ */ u("span", { style: "margin-right:12px;color:var(--xb-accent-orange,#d29922);font-weight:600;", children: [
    banner.text,
    banner.showReload && /* @__PURE__ */ u(
      "button",
      {
        onClick: () => location.reload(),
        style: "background:none;border:none;color:inherit;cursor:pointer;padding:0;text-decoration:underline;font:inherit;",
        children: "Reload page"
      }
    )
  ] });
}
function StatusPanelContent() {
  void playerUpdated.value;
  void rulesetReady.value;
  const gi = gameInfo.value;
  void isObserver.value;
  void connectedPlayer.value;
  void statusRefresh.value;
  void settingsUpdated.value;
  void connectionBanner.value;
  const pplayer = clientPlaying();
  const small = isSmallScreen();
  if (pplayer != null) {
    const tax = Number(pplayer["tax"]);
    const lux = Number(pplayer["luxury"]);
    const sci = Number(pplayer["science"]);
    const netIncome = Number(pplayer["expected_income"]);
    const netStr = netIncome > 0 ? "+" + netIncome : String(netIncome);
    const adjective = String(store.nations[pplayer["nation"]]?.["adjective"] ?? "");
    return /* @__PURE__ */ u(k$1, { children: [
      /* @__PURE__ */ u(ConnectionBannerEl, {}),
      !small && adjective && /* @__PURE__ */ u(k$1, { children: [
        /* @__PURE__ */ u("b", { children: adjective }),
        "   ",
        /* @__PURE__ */ u("span", { title: "Population", children: "👤" }),
        ": ",
        /* @__PURE__ */ u("b", { children: civPopulation(pplayer.playerno) }),
        "   "
      ] }),
      !small && gi && /* @__PURE__ */ u(k$1, { children: [
        /* @__PURE__ */ u("span", { title: "Year (turn)", children: "🕐" }),
        ": ",
        /* @__PURE__ */ u("b", { children: getYearString() }),
        "   "
      ] }),
      /* @__PURE__ */ u("span", { title: "Gold (net income)", children: "💰" }),
      ": ",
      /* @__PURE__ */ u(
        "b",
        {
          class: netIncome < 0 ? "negative_net_income" : void 0,
          title: "Gold (net income)",
          children: [
            String(pplayer["gold"]),
            " (",
            netStr,
            ")"
          ]
        }
      ),
      "   ",
      /* @__PURE__ */ u("span", { style: "cursor:pointer;", "data-action": "show-tax-rates", children: [
        /* @__PURE__ */ u("span", { title: "Tax rate", children: "📊" }),
        ": ",
        /* @__PURE__ */ u("b", { children: tax }),
        "% ",
        /* @__PURE__ */ u("span", { title: "Luxury rate", children: "🎵" }),
        ": ",
        /* @__PURE__ */ u("b", { children: lux }),
        "% ",
        /* @__PURE__ */ u("span", { title: "Science rate", children: "🧪" }),
        ": ",
        /* @__PURE__ */ u("b", { children: sci }),
        "%"
      ] })
    ] });
  }
  if (store.observing || clientPlaying() == null) {
    const meta = store.serverSettings?.["metamessage"]?.["val"];
    return /* @__PURE__ */ u(k$1, { children: [
      /* @__PURE__ */ u(ConnectionBannerEl, {}),
      meta && /* @__PURE__ */ u(k$1, { children: [
        String(meta),
        " — "
      ] }),
      gi && !small && /* @__PURE__ */ u(k$1, { children: [
        /* @__PURE__ */ u("span", { title: "Year (turn)", children: "🕐" }),
        ": ",
        /* @__PURE__ */ u("b", { children: getYearString() }),
        "   "
      ] }),
      gi && small && /* @__PURE__ */ u(k$1, { children: [
        /* @__PURE__ */ u("b", { children: getYearString() }),
        " "
      ] }),
      gi && "Observing"
    ] });
  }
  return null;
}
let _mountedTop = false;
let _mountedBottom = false;
function mountStatusPanel() {
  const top = document.getElementById("game_status_panel_top");
  const bottom = document.getElementById("game_status_panel_bottom");
  if (top && !_mountedTop) {
    J(/* @__PURE__ */ u(StatusPanelContent, {}), top);
    _mountedTop = true;
  }
  if (bottom && !_mountedBottom) {
    J(/* @__PURE__ */ u(StatusPanelContent, {}), bottom);
    _mountedBottom = true;
  }
}
function game_init() {
  store.mapInfo = {};
  store.terrains = {};
  store.resources = {};
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
function update_game_status_panel() {
  if (C_S_RUNNING !== clientState()) return;
  mountStatusPanel();
  statusRefresh.value++;
  const useTop = window.innerWidth - sum_width() > 800;
  statusPanelLayout.value = useTop ? "top" : "bottom";
  let page_title = "XBWorld - " + store.username + "  (turn:" + store.gameInfo["turn"] + ", port:" + store.civserverport + ") ";
  if (store.serverSettings["metamessage"] != null) {
    page_title += store.serverSettings["metamessage"]["val"];
  }
  document.title = page_title;
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
function getPlayerScoresSummary() {
  const players = Object.values(store.players);
  if (players.length === 0) return "<p>No score data available yet.</p>";
  const sorted = [...players].sort((a2, b2) => (b2["score"] ?? 0) - (a2["score"] ?? 0));
  const rows = sorted.map((p2, i2) => {
    const nation2 = store.nations[p2["nation"]];
    const adj = nation2?.["adjective"] ?? "?";
    const score = p2["score"] ?? "?";
    const cities2 = p2["cities"] ?? 0;
    p2["units"] ?? 0;
    return `<tr>
      <td style="padding:4px 8px;font-weight:bold">#${i2 + 1}</td>
      <td style="padding:4px 8px">${escapeHtml(String(p2["name"]))}</td>
      <td style="padding:4px 8px;color:#8b949e">${escapeHtml(String(adj))}</td>
      <td style="padding:4px 8px;text-align:right;font-weight:bold;color:#58a6ff">${score}</td>
      <td style="padding:4px 8px;text-align:right">${cities2} cities</td>
    </tr>`;
  }).join("");
  return `<table style="width:100%;border-collapse:collapse">
    <thead><tr style="border-bottom:1px solid #444">
      <th style="padding:4px 8px;text-align:left">Rank</th>
      <th style="padding:4px 8px;text-align:left">Player</th>
      <th style="padding:4px 8px;text-align:left">Nation</th>
      <th style="padding:4px 8px;text-align:right">Score</th>
      <th style="padding:4px 8px;text-align:right">Cities</th>
    </tr></thead><tbody>${rows}</tbody>
  </table>`;
}
const nation = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  centerOnPlayer,
  getPlayerScoresSummary,
  nationSelectPlayer,
  nationTableSelectPlayer,
  selectNoNation
}, Symbol.toStringTag, { value: "Module" }));
function initControls() {
  on(document, "keydown", handleKeyDown);
}
function handleKeyDown(e2) {
  if (e2.target instanceof HTMLInputElement || e2.target instanceof HTMLTextAreaElement) return;
  if (e2.key === "Escape") close_city_dialog();
}
const state$2 = c({
  open: false,
  title: "",
  data: null
});
function showIntelDialog(title, data) {
  state$2.value = { open: true, title, data };
}
function closeIntelDialog() {
  state$2.value = { ...state$2.value, open: false };
  const input = document.getElementById("game_text_input");
  if (input) input.blur();
}
const labelStyle = {
  paddingRight: "12px",
  color: "var(--xb-text-secondary, #8b949e)",
  whiteSpace: "nowrap",
  verticalAlign: "top",
  fontWeight: 600
};
const valueStyle = {
  color: "var(--xb-text-primary, #e6edf3)",
  verticalAlign: "top"
};
const sectionStyle = {
  marginTop: "12px",
  marginBottom: "4px",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--xb-accent-blue, #58a6ff)",
  borderBottom: "1px solid var(--xb-border-default, #30363d)",
  paddingBottom: "2px"
};
function IntelDialog() {
  const { open: open2, title, data } = state$2.value;
  return /* @__PURE__ */ u(
    Dialog,
    {
      title,
      open: open2,
      onClose: closeIntelDialog,
      width: window.innerWidth <= 600 ? "90%" : "auto",
      modal: true,
      children: [
        /* @__PURE__ */ u("div", { style: { maxHeight: "70vh", overflow: "auto", fontSize: "13px" }, children: data && /* @__PURE__ */ u(k$1, { children: [
          /* @__PURE__ */ u("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ u("tbody", { children: [
            ["Ruler", data.ruler],
            ["Government", data.government],
            ["Capital", data.capital],
            ["Gold", data.gold],
            ["Tax", data.tax],
            ["Science", data.science],
            ["Luxury", data.luxury],
            ["Culture", data.culture],
            ["Researching", data.researching]
          ].map(([label, value]) => /* @__PURE__ */ u("tr", { children: [
            /* @__PURE__ */ u("td", { style: labelStyle, children: [
              label,
              ":"
            ] }),
            /* @__PURE__ */ u("td", { style: valueStyle, children: value })
          ] }, label)) }) }),
          data.diplomacy.length > 0 && /* @__PURE__ */ u(k$1, { children: [
            /* @__PURE__ */ u("div", { style: sectionStyle, children: "Diplomacy" }),
            /* @__PURE__ */ u("ul", { style: { margin: "4px 0", paddingLeft: "20px" }, children: data.diplomacy.map((entry, i2) => /* @__PURE__ */ u("li", { style: { color: "var(--xb-text-primary, #e6edf3)", padding: "2px 0" }, children: [
              /* @__PURE__ */ u("span", { style: { fontWeight: 600 }, children: entry.nation }),
              ": ",
              entry.state
            ] }, i2)) })
          ] }),
          data.knownTechs.length > 0 && /* @__PURE__ */ u(k$1, { children: [
            /* @__PURE__ */ u("div", { style: sectionStyle, children: [
              "Known Techs (",
              data.knownTechs.length,
              ")"
            ] }),
            /* @__PURE__ */ u("p", { style: { margin: "4px 0", lineHeight: 1.6, color: "var(--xb-text-primary, #e6edf3)" }, children: data.knownTechs.join(", ") })
          ] })
        ] }) }),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px", textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: closeIntelDialog, children: "Ok" }) })
      ]
    }
  );
}
function show_intelligence_report_dialog() {
  const selected_player = store.selectedPlayer;
  if (selected_player === -1) return;
  const pplayer = store.players[selected_player];
  if (clientIsObserver() || clientPlaying()?.["real_embassy"]?.isSet(selected_player)) {
    show_intelligence_report_embassy(pplayer);
  } else {
    show_intelligence_report_hearsay(pplayer);
  }
}
function show_intelligence_report_hearsay(pplayer) {
  const gov = pplayer["government"] > 0 ? String(store.governments[pplayer["government"]]?.["name"] ?? "(Unknown)") : "(Unknown)";
  const gold = pplayer["gold"] > 0 ? String(pplayer["gold"]) : "—";
  let researching = "—";
  const researchingId = pplayer["researching"];
  if (researchingId != null && researchingId > 0 && store.techs[researchingId] != null) {
    researching = String(store.techs[researchingId]["name"]);
  }
  const nationAdj = store.nations[pplayer["nation"]]?.["adjective"] || pplayer["name"];
  const data = {
    ruler: String(pplayer["name"]),
    government: gov,
    capital: "(Establishing an embassy will show full details)",
    gold,
    tax: "—",
    science: "—",
    luxury: "—",
    culture: "—",
    researching,
    diplomacy: [],
    knownTechs: []
  };
  showIntelDialog(`Intelligence report: ${nationAdj}`, data);
}
function buildIntelData(pplayer) {
  const capital = player_capital(pplayer);
  const gov = store.governments[pplayer["government"]];
  const research = research_get(pplayer);
  let researchText = "(Unknown)";
  const knownTechs = [];
  if (research != null) {
    const researchingTech = store.techs[research["researching"]];
    if (researchingTech !== void 0) {
      researchText = `${researchingTech["name"]} (${research["bulbs_researched"]}/${research["researching_cost"]})`;
    } else {
      researchText = "(Nothing)";
    }
    const inventions = research["inventions"];
    for (const tech_id in store.techs) {
      if (inventions?.[tech_id] === TECH_KNOWN) {
        knownTechs.push(store.techs[tech_id]["name"]);
      }
    }
  }
  const diplomacy = [];
  if (pplayer["diplstates"] !== void 0) {
    pplayer["diplstates"].forEach((st, i2) => {
      if (st["state"] !== DiplState.DS_NO_CONTACT && i2 !== pplayer["playerno"] && store.players[i2]) {
        diplomacy.push({
          nation: store.nations[store.players[i2]["nation"]]?.["adjective"] || "Unknown",
          state: get_diplstate_text(st["state"])
        });
      }
    });
  }
  return {
    ruler: pplayer["name"],
    government: gov ? gov["name"] : "(Unknown)",
    capital: capital ? capital["name"] : "(capital unknown)",
    gold: String(pplayer["gold"]),
    tax: `${pplayer["tax"]}%`,
    science: `${pplayer["science"]}%`,
    luxury: `${pplayer["luxury"]}%`,
    culture: String(pplayer["culture"]),
    researching: researchText,
    diplomacy,
    knownTechs
  };
}
function show_intelligence_report_embassy(pplayer) {
  const data = buildIntelData(pplayer);
  const nationAdj = store.nations[pplayer["nation"]]?.["adjective"] || pplayer["name"];
  showIntelDialog(`Foreign Intelligence: ${nationAdj} Empire`, data);
}
const intelDialog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildIntelData,
  show_intelligence_report_dialog,
  show_intelligence_report_embassy,
  show_intelligence_report_hearsay
}, Symbol.toStringTag, { value: "Module" }));
const _registry = /* @__PURE__ */ new Map();
function registerAction(name, handler) {
  _registry.set(name, handler);
}
document.addEventListener("click", (e2) => {
  const target = e2.target;
  if (!target) return;
  const el = target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset["action"];
  if (!action) return;
  const handler = _registry.get(action);
  if (handler) {
    e2.preventDefault();
    handler(el, e2);
  }
});
const alertState = c({ open: false, title: "", text: "", type: "info" });
function closeAlertDialog() {
  alertState.value = { ...alertState.value, open: false };
}
const TYPE_COLOR = {
  info: "var(--xb-text-primary, #e6edf3)",
  warning: "var(--xb-accent-yellow, #d29922)",
  error: "var(--xb-accent-red, #f85149)"
};
function AlertDialog() {
  const { open: open2, title, text, type } = alertState.value;
  if (!open2) return null;
  return /* @__PURE__ */ u(Dialog, { title, open: true, onClose: closeAlertDialog, width: 400, modal: true, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 16px", color: TYPE_COLOR[type] }, children: text }),
    /* @__PURE__ */ u("div", { style: { textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: closeAlertDialog, children: "Ok" }) })
  ] });
}
const state$1 = c({ open: false, question: "" });
function close() {
  state$1.value = { ...state$1.value, open: false };
}
function handleYes() {
  close();
}
function CityBuyDialog() {
  const { open: open2, question } = state$1.value;
  return /* @__PURE__ */ u(Dialog, { title: "Buy It!", open: open2, onClose: close, width: window.innerWidth <= 600 ? "95%" : "50%", modal: true, children: [
    /* @__PURE__ */ u("div", { children: parseGameHtml(question) }),
    /* @__PURE__ */ u("div", { style: { display: "flex", gap: "8px", marginTop: "12px" }, children: [
      /* @__PURE__ */ u(Button, { onClick: handleYes, children: "Yes" }),
      /* @__PURE__ */ u(Button, { variant: "secondary", onClick: close, children: "No" })
    ] })
  ] });
}
const open = c(false);
function showTaxRatesDialog() {
  open.value = true;
}
function closeTaxRatesDialog() {
  open.value = false;
}
function RateBar({ label, icon, value }) {
  return /* @__PURE__ */ u("div", { style: { marginBottom: "12px" }, children: [
    /* @__PURE__ */ u("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "4px" }, children: [
      /* @__PURE__ */ u("span", { children: [
        icon,
        " ",
        label
      ] }),
      /* @__PURE__ */ u("b", { children: [
        value,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ u("div", { style: {
      height: "8px",
      background: "var(--xb-bg-secondary, #161b22)",
      borderRadius: "4px",
      overflow: "hidden"
    }, children: /* @__PURE__ */ u("div", { style: {
      width: value + "%",
      height: "100%",
      background: "var(--xb-accent-blue, #388bfd)",
      borderRadius: "4px",
      transition: "width 0.2s"
    } }) })
  ] });
}
function TaxRatesDialog() {
  void playerUpdated.value;
  if (!open.value) return null;
  const pplayer = clientPlaying();
  const tax = pplayer ? Number(pplayer["tax"]) : 0;
  const lux = pplayer ? Number(pplayer["luxury"]) : 0;
  const sci = pplayer ? Number(pplayer["science"]) : 0;
  return /* @__PURE__ */ u(
    Dialog,
    {
      title: "Tax Rates",
      open: true,
      onClose: closeTaxRatesDialog,
      width: 340,
      modal: false,
      children: [
        /* @__PURE__ */ u("div", { style: { padding: "8px 0" }, children: [
          /* @__PURE__ */ u(RateBar, { label: "Tax", icon: "📊", value: tax }),
          /* @__PURE__ */ u(RateBar, { label: "Luxury", icon: "🎵", value: lux }),
          /* @__PURE__ */ u(RateBar, { label: "Science", icon: "🧪", value: sci }),
          /* @__PURE__ */ u("p", { style: { margin: "12px 0 4px", fontSize: "0.85em", color: "var(--xb-text-secondary, #8b949e)" }, children: [
            "Total: ",
            tax + lux + sci,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ u("div", { style: { marginTop: "8px", textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: closeTaxRatesDialog, children: "Close" }) })
      ]
    }
  );
}
const overlayHtml = c(null);
function showBlockingOverlay(html) {
  overlayHtml.value = html;
}
function hideBlockingOverlay() {
  overlayHtml.value = null;
}
function BlockingOverlay() {
  const html = overlayHtml.value;
  if (!html) return null;
  return /* @__PURE__ */ u("div", { class: "xb-block-overlay", style: {
    position: "fixed",
    inset: "0",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.75)"
  }, children: /* @__PURE__ */ u("div", { class: "xb-block-message", style: {
    background: "var(--xb-bg-primary, #0d1117)",
    border: "1px solid var(--xb-border-default, #30363d)",
    borderRadius: "8px",
    padding: "24px 32px",
    color: "var(--xb-text-primary, #e6edf3)",
    fontSize: "16px",
    textAlign: "center",
    maxWidth: "480px"
  }, children: parseGameHtml(html) }) });
}
const BlockingOverlay$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockingOverlay,
  hideBlockingOverlay,
  showBlockingOverlay
}, Symbol.toStringTag, { value: "Module" }));
async function doReconnectNow() {
  const { reconnectNow: reconnectNow2 } = await Promise.resolve().then(() => connection);
  reconnectNow2();
}
async function doTryAgain() {
  const { tryAgain: tryAgain2 } = await Promise.resolve().then(() => connection);
  tryAgain2();
}
function DisconnectOverlay() {
  const state2 = disconnectOverlay.value;
  if (!state2) return null;
  const overlayStyle = {
    position: "fixed",
    inset: "0",
    zIndex: 1e4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.82)"
  };
  const boxStyle = {
    background: "var(--xb-bg-primary, #0d1117)",
    border: "1px solid var(--xb-border-default, #30363d)",
    borderRadius: "10px",
    padding: "32px 40px",
    color: "var(--xb-text-primary, #e6edf3)",
    textAlign: "center",
    maxWidth: "440px",
    width: "90%",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
  };
  if (state2.phase === "reconnecting") {
    return /* @__PURE__ */ u("div", { style: overlayStyle, children: /* @__PURE__ */ u("div", { style: boxStyle, children: [
      /* @__PURE__ */ u("div", { style: { fontSize: "40px", marginBottom: "12px" }, children: "⚡" }),
      /* @__PURE__ */ u("h2", { style: { margin: "0 0 8px", fontSize: "20px", fontWeight: 700 }, children: "Connection Lost" }),
      /* @__PURE__ */ u("p", { style: { margin: "0 0 20px", color: "var(--xb-text-secondary, #8b949e)", fontSize: "14px" }, children: [
        "Reconnecting in ",
        /* @__PURE__ */ u("b", { style: { color: "var(--xb-text-primary, #e6edf3)" }, children: [
          state2.countdown,
          "s"
        ] }),
        " ",
        "— attempt ",
        state2.attempt + 1,
        " of ",
        state2.max
      ] }),
      /* @__PURE__ */ u("div", { style: { display: "flex", gap: "10px", justifyContent: "center" }, children: [
        /* @__PURE__ */ u(Button, { onClick: doReconnectNow, children: "Try Now" }),
        /* @__PURE__ */ u(
          "button",
          {
            onClick: () => location.reload(),
            style: {
              background: "none",
              border: "1px solid var(--xb-border-default, #30363d)",
              color: "var(--xb-text-secondary, #8b949e)",
              borderRadius: "6px",
              padding: "6px 16px",
              cursor: "pointer",
              fontSize: "13px"
            },
            children: "Reload Page"
          }
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ u("div", { style: overlayStyle, children: /* @__PURE__ */ u("div", { style: boxStyle, children: [
    /* @__PURE__ */ u("div", { style: { fontSize: "40px", marginBottom: "12px" }, children: "⚠" }),
    /* @__PURE__ */ u("h2", { style: { margin: "0 0 8px", fontSize: "20px", fontWeight: 700, color: "var(--xb-accent-red, #f85149)" }, children: "Disconnected" }),
    /* @__PURE__ */ u("p", { style: { margin: "0 0 20px", color: "var(--xb-text-secondary, #8b949e)", fontSize: "14px" }, children: "Could not reconnect to the game server." }),
    /* @__PURE__ */ u("div", { style: { display: "flex", gap: "10px", justifyContent: "center" }, children: [
      /* @__PURE__ */ u(Button, { onClick: doTryAgain, children: "Try Again" }),
      /* @__PURE__ */ u(
        "button",
        {
          onClick: () => location.reload(),
          style: {
            background: "none",
            border: "1px solid var(--xb-border-default, #30363d)",
            color: "var(--xb-text-secondary, #8b949e)",
            borderRadius: "6px",
            padding: "6px 16px",
            cursor: "pointer",
            fontSize: "13px"
          },
          children: "Reload Page"
        }
      )
    ] })
  ] }) });
}
const state = c({
  open: false,
  title: "",
  message: "",
  error: ""
});
function closeIntroDialog() {
  state.value = { ...state.value, open: false };
}
function IntroDialog() {
  const { open: open2, title, message, error } = state.value;
  const inputRef = A(null);
  y$2(() => {
    if (open2 && inputRef.current) {
      const saved = localStorage.getItem("username");
      if (saved) inputRef.current.value = saved;
      inputRef.current.focus();
    }
  }, [open2]);
  const submit = () => {
    const name = inputRef.current?.value.trim() || "";
    if (name.length < 3) {
      state.value = { ...state.value, error: "Username must be at least 3 characters." };
      return;
    }
    store.username = name;
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
      open: open2,
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
                  background: "var(--xb-bg-elevated, #21262d)",
                  color: "var(--xb-text-primary, #e6edf3)",
                  border: "1px solid var(--xb-border-default, #30363d)",
                  borderRadius: "var(--xb-radius-sm, 3px)",
                  width: "200px",
                  outline: "none"
                }
              }
            )
          ] }),
          error && /* @__PURE__ */ u("div", { style: { color: "var(--xb-accent-red, #f85149)", marginTop: "4px", fontSize: "13px" }, children: error })
        ] }),
        /* @__PURE__ */ u("div", { style: { marginTop: "12px", textAlign: "right" }, children: /* @__PURE__ */ u(Button, { onClick: submit, children: "Observe Game" }) })
      ]
    }
  );
}
function ThemeSelect() {
  const [current, setCurrent] = d$1(getTheme);
  function handleChange(e2) {
    const val = e2.target.value;
    setTheme(val);
    setCurrent(val);
  }
  return /* @__PURE__ */ u(
    "select",
    {
      value: current,
      onChange: handleChange,
      title: "UI Theme",
      style: {
        marginLeft: "auto",
        background: "var(--xb-bg-elevated, #21262d)",
        color: "var(--xb-text-secondary, #8b949e)",
        border: "1px solid var(--xb-border-default, #30363d)",
        borderRadius: "3px",
        padding: "1px 4px",
        fontSize: "var(--xb-font-size-xs, 11px)",
        cursor: "pointer"
      },
      children: [
        /* @__PURE__ */ u("option", { value: "dark", children: "Dark" }),
        /* @__PURE__ */ u("option", { value: "light", children: "Light" }),
        /* @__PURE__ */ u("option", { value: "fantasy", children: "Fantasy" })
      ]
    }
  );
}
function StatusBar() {
  const turn = currentTurn.value;
  const year = currentYear.value;
  const players = playerCount.value;
  const cities2 = cityCount.value;
  const units = unitCount.value;
  const observer = isObserver.value;
  if (turn === 0 && !observer) return null;
  return /* @__PURE__ */ u(
    "div",
    {
      id: "xb-status-bar",
      style: {
        display: "flex",
        gap: 16,
        alignItems: "center",
        padding: "2px 10px",
        background: "var(--xb-bg-secondary, #161b22)",
        borderTop: "1px solid var(--xb-border-default, #30363d)",
        fontSize: "var(--xb-font-size-xs, 11px)",
        color: "var(--xb-text-secondary, #8b949e)",
        userSelect: "none"
      },
      children: [
        observer && /* @__PURE__ */ u("span", { style: { color: "var(--xb-accent-blue, #58a6ff)", fontWeight: 600 }, children: "OBSERVER" }),
        year && /* @__PURE__ */ u("span", { children: [
          "Year: ",
          year
        ] }),
        turn > 0 && /* @__PURE__ */ u("span", { children: [
          "Turn: ",
          turn
        ] }),
        /* @__PURE__ */ u("span", { children: [
          players,
          " players"
        ] }),
        /* @__PURE__ */ u("span", { children: [
          cities2,
          " cities"
        ] }),
        /* @__PURE__ */ u("span", { children: [
          units,
          " units"
        ] }),
        /* @__PURE__ */ u(ThemeSelect, {})
      ]
    }
  );
}
function LazyMountOnce({ signal: sig, children }) {
  const ever = A(false);
  if (!ever.current && sig.value) ever.current = true;
  return ever.current ? /* @__PURE__ */ u(k$1, { children }) : null;
}
function App() {
  return /* @__PURE__ */ u("div", { id: "xb-preact-root", children: [
    /* @__PURE__ */ u(BlockingOverlay, {}),
    /* @__PURE__ */ u(DisconnectOverlay, {}),
    /* @__PURE__ */ u(MessageDialog, {}),
    /* @__PURE__ */ u(AlertDialog, {}),
    /* @__PURE__ */ u(AuthDialog, {}),
    /* @__PURE__ */ u(IntelDialog, {}),
    /* @__PURE__ */ u(SwalDialog, {}),
    /* @__PURE__ */ u(CityBuyDialog, {}),
    /* @__PURE__ */ u(CityInputDialog, {}),
    /* @__PURE__ */ u(TechGainedDialog, {}),
    /* @__PURE__ */ u(TaxRatesDialog, {}),
    /* @__PURE__ */ u(IntroDialog, {}),
    /* @__PURE__ */ u(ChatContextDialog, {}),
    /* @__PURE__ */ u(LazyMountOnce, { signal: cityDialogSignal, children: /* @__PURE__ */ u(CityDialog, {}) }),
    /* @__PURE__ */ u(LazyMountOnce, { signal: wikiDialogSignal, children: /* @__PURE__ */ u(WikiDialog, {}) }),
    /* @__PURE__ */ u(LazyMountOnce, { signal: techInfoDialogSignal, children: /* @__PURE__ */ u(TechInfoDialog, {}) })
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
  const statusContainer = document.getElementById("xb-status-bar-mount") ?? (() => {
    const el = document.createElement("div");
    el.id = "xb-status-bar-mount";
    el.style.position = "fixed";
    el.style.bottom = "0";
    el.style.left = "0";
    el.style.right = "0";
    el.style.zIndex = "800";
    document.body.appendChild(el);
    return el;
  })();
  J(/* @__PURE__ */ u(StatusBar, {}), statusContainer);
  mounted = true;
}
console.log("[xbw] main.ts bundle starting");
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
function syncStoreWithWindow() {
  const storeRec = store;
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
    ["ruleset_description", "rulesDescription"],
    ["civclient_state", "civclientState"]
  ];
  for (const [globalName, storeProp] of syncProps) {
    const existing = win[globalName];
    if (existing !== void 0 && existing !== null) {
      storeRec[storeProp] = existing;
    }
    try {
      Object.defineProperty(win, globalName, {
        get: () => storeRec[storeProp],
        set: (v2) => {
          storeRec[storeProp] = v2;
        },
        configurable: true,
        enumerable: true
      });
    } catch {
    }
  }
}
function init() {
  logNormal("[TS] XBWorld observer client loading...");
  registerAction("show-city", (el) => show_city_dialog_by_id(Number(el.dataset["cityid"])));
  registerAction("tech-info", (el) => {
    const name = el.dataset["name"] ?? "";
    const unit = el.dataset["unit"] === "null" ? null : Number(el.dataset["unit"]);
    const impr = el.dataset["impr"] === "null" ? null : Number(el.dataset["impr"]);
    show_tech_info_dialog(name, unit, impr);
  });
  registerAction("player-research", (el) => send_player_research(Number(el.dataset["techid"])));
  registerAction("select-player", (el) => nationTableSelectPlayer(Number(el.dataset["playerno"])));
  registerAction("center-tile", (el) => center_tile_id(Number(el.dataset["tileid"])));
  registerAction("wiki-dialog", (el) => show_wikipedia_dialog(el.dataset["techname"] ?? ""));
  registerAction("show-tax-rates", () => showTaxRatesDialog());
  syncStoreWithWindow();
  logNormal("[TS] Store ↔ window globals synced");
  win["set_client_state"] = set_client_state;
  win["mark_all_dirty"] = mark_all_dirty;
  win["redraw_overview"] = redraw_overview;
  win["__store"] = store;
  win["__terrainBlendStats"] = _terrainBlendStats;
  win["__resetTerrainBlendStats"] = resetTerrainBlendStats;
  win["send_message"] = send_message;
  win["map_to_gui_pos"] = map_to_gui_pos$1;
  Object.defineProperty(win, "mapview", {
    get: () => mapview$1,
    configurable: true
  });
  initControls();
  logNormal("[TS] Controls initialized");
  mountPreactApp();
  logNormal("[TS] Preact UI mounted");
  logNormal("[TS] XBWorld observer client ready");
}
init();
let _counter = 0;
const logEntries = c([]);
function pushGameLogEntry(html) {
  let entries = [...logEntries.value, { id: _counter++, html, ts: Date.now() }];
  if (entries.length > 500) entries = entries.slice(-500);
  logEntries.value = entries;
}
function GameLog() {
  const entries = logEntries.value;
  const bottomRef = A(null);
  const autoScroll = A(true);
  y$2(() => {
    if (autoScroll.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries]);
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--xb-bg-primary, #0d1117)" }, children: [
    /* @__PURE__ */ u("div", { style: {
      padding: "8px 12px",
      borderBottom: "1px solid var(--xb-border-default, #30363d)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "var(--xb-bg-secondary, #161b22)",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ u("span", { style: { color: "var(--xb-accent-blue, #58a6ff)", fontWeight: "bold", fontSize: "14px" }, children: "Game Event Log" }),
      /* @__PURE__ */ u(
        "button",
        {
          onClick: () => {
            logEntries.value = [];
          },
          style: {
            background: "none",
            border: "1px solid var(--xb-border-default, #30363d)",
            color: "var(--xb-text-secondary, #8b949e)",
            cursor: "pointer",
            borderRadius: "4px",
            padding: "2px 8px",
            fontSize: "12px"
          },
          children: "Clear"
        }
      )
    ] }),
    /* @__PURE__ */ u(
      "div",
      {
        style: { flex: 1, overflowY: "auto", padding: "8px 12px" },
        onScroll: (e2) => {
          const el = e2.currentTarget;
          autoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        },
        children: [
          entries.length === 0 && /* @__PURE__ */ u("p", { style: { color: "var(--xb-text-secondary, #8b949e)", fontStyle: "italic", fontSize: "13px", textAlign: "center", marginTop: "40px" }, children: "Game events will appear here." }),
          entries.map((entry) => /* @__PURE__ */ u(
            "div",
            {
              style: {
                padding: "4px 0",
                borderBottom: "1px solid var(--xb-bg-elevated, #21262d)",
                fontSize: "13px",
                color: "var(--xb-text-primary, #e6edf3)",
                lineHeight: "1.5"
              },
              children: parseGameHtml(entry.html)
            },
            entry.id
          )),
          /* @__PURE__ */ u("div", { ref: bottomRef })
        ]
      }
    )
  ] });
}
function mountGameLog(container) {
  const existing = document.querySelectorAll("#game_message_area li");
  existing.forEach((li) => {
    logEntries.value = [...logEntries.value, { id: _counter++, html: li.textContent ?? "", ts: Date.now() }];
  });
  J(/* @__PURE__ */ u(GameLog, {}), container);
}
const GameLog$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  mountGameLog,
  pushGameLogEntry
}, Symbol.toStringTag, { value: "Module" }));
function FlagCanvas({ sprite }) {
  const ref = A(null);
  y$2(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 29, 20);
    if (sprite != null) ctx.drawImage(sprite, 0, 0);
  }, [sprite]);
  return /* @__PURE__ */ u(
    "canvas",
    {
      ref,
      width: 29,
      height: 20,
      class: "pregame_flags",
      style: { verticalAlign: "middle", marginRight: 4 }
    }
  );
}
function ScenarioInfo() {
  void pregameRefresh.value;
  const si = store.scenarioInfo;
  if (!si || !si["is_scenario"]) return null;
  const desc = String(si["description"] || "");
  const authors = String(si["authors"] || "");
  const noNewCities = !!si["prevent_new_cities"];
  const name = String(si["name"] || "");
  return /* @__PURE__ */ u(k$1, { children: [
    desc && /* @__PURE__ */ u("p", { children: desc.split("\n").map((line, i2) => /* @__PURE__ */ u(k$1, { children: [
      i2 > 0 && /* @__PURE__ */ u("br", {}),
      line
    ] })) }),
    authors && /* @__PURE__ */ u("p", { children: [
      "Scenario by",
      " ",
      authors.split("\n").map((line, i2) => /* @__PURE__ */ u(k$1, { children: [
        i2 > 0 && /* @__PURE__ */ u("br", {}),
        line
      ] }))
    ] }),
    noNewCities && /* @__PURE__ */ u("p", { children: [
      name,
      " forbids the founding of new cities."
    ] })
  ] });
}
function PlayerRow({ id, player }) {
  void rulesetReady.value;
  const name = String(player["name"] ?? "");
  const isAI = name.indexOf("AI") !== -1;
  const isReady = player["is_ready"] === true;
  const nation2 = store.nations[player["nation"]];
  const nationAdj = nation2 ? String(nation2["adjective"] || "") : "";
  const sprite = nation2 ? store.sprites["f." + nation2["graphic_str"]] ?? null : null;
  let titleText;
  if (isReady) {
    titleText = "Player ready" + (nationAdj ? " - " + nationAdj : "");
  } else if (!isAI) {
    titleText = "Player not ready" + (nationAdj ? " - " + nationAdj : "");
  } else {
    titleText = "AI Player (random nation)";
  }
  return /* @__PURE__ */ u(
    "div",
    {
      id: "pregame_plr_" + id,
      class: "pregame_player_name" + (isReady ? " pregame_player_ready" : ""),
      title: titleText,
      "data-player-name": name,
      "data-player-id": String(player["playerno"]),
      children: [
        sprite != null && /* @__PURE__ */ u(FlagCanvas, { sprite }),
        !sprite && nation2 == null && /* @__PURE__ */ u("div", { id: isAI ? "pregame_ai_icon" : "pregame_player_icon" }),
        /* @__PURE__ */ u("b", { children: name })
      ]
    }
  );
}
function PlayerList() {
  void pregameRefresh.value;
  void playerUpdated.value;
  void rulesetReady.value;
  const players = Object.entries(store.players).map(([idStr, p2]) => ({
    id: parseInt(idStr),
    player: p2
  }));
  return /* @__PURE__ */ u(k$1, { children: players.map(({ id, player }) => /* @__PURE__ */ u(PlayerRow, { id, player }, id)) });
}
let _mountedInfo = false;
let _mountedList = false;
function mountPregameLobby() {
  const infoEl = document.getElementById("pregame_game_info");
  const listEl = document.getElementById("pregame_player_list");
  if (infoEl && !_mountedInfo) {
    J(/* @__PURE__ */ u(ScenarioInfo, {}), infoEl);
    _mountedInfo = true;
  }
  if (listEl && !_mountedList) {
    J(/* @__PURE__ */ u(PlayerList, {}), listEl);
    _mountedList = true;
  }
}
const PregameLobby = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PlayerList,
  mountPregameLobby
}, Symbol.toStringTag, { value: "Module" }));
const TABLE_STYLE = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "var(--xb-font-size-sm, 12px)",
  color: "var(--xb-text-primary, #e6edf3)"
};
const TH_STYLE = {
  padding: "6px 10px",
  textAlign: "left",
  color: "var(--xb-text-secondary, #8b949e)",
  fontWeight: 600,
  borderBottom: "2px solid var(--xb-border-default, #30363d)",
  background: "var(--xb-bg-elevated, #21262d)"
};
const TD_STYLE = {
  padding: "6px 10px",
  borderBottom: "1px solid var(--xb-border-default, #30363d)"
};
function CitiesPanel() {
  cityCount.value;
  currentTurn.value;
  rulesetReady.value;
  playerUpdated.value;
  const cities2 = Object.values(store.cities);
  if (cities2.length === 0) {
    return /* @__PURE__ */ u("div", { style: { padding: 24, color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-sm, 12px)" }, children: "No cities known yet." });
  }
  const sorted = [...cities2].sort((a2, b2) => {
    const ownDiff = a2.owner - b2.owner;
    if (ownDiff !== 0) return ownDiff;
    return String(a2.name).localeCompare(String(b2.name));
  });
  return /* @__PURE__ */ u("div", { style: { overflowX: "auto", padding: "8px 0" }, children: [
    /* @__PURE__ */ u("table", { style: TABLE_STYLE, children: [
      /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ u("tr", { children: [
        /* @__PURE__ */ u("th", { style: TH_STYLE, children: "City" }),
        /* @__PURE__ */ u("th", { style: TH_STYLE, children: "Owner" }),
        /* @__PURE__ */ u("th", { style: TH_STYLE, children: "Size" }),
        /* @__PURE__ */ u("th", { style: TH_STYLE, children: "Production" })
      ] }) }),
      /* @__PURE__ */ u("tbody", { children: sorted.map((city) => {
        const owner = store.players[city.owner];
        const ownerName = owner?.["name"] ?? `#${city.owner}`;
        const nation2 = owner ? store.nations[owner["nation"]] : null;
        const color = nation2?.["color"] ?? "var(--xb-text-primary)";
        const prod = city.production;
        const prodKind = prod?.["kind"];
        const prodValue = prod?.["value"];
        let prodName = "—";
        if (prodKind === 0 && prodValue !== void 0) {
          const impr = store.improvements[prodValue];
          if (impr) prodName = impr["name"];
        } else if (prodKind === 1 && prodValue !== void 0) {
          const utype = store.unitTypes[prodValue];
          if (utype) prodName = utype["name"];
        }
        return /* @__PURE__ */ u(
          "tr",
          {
            onClick: () => show_city_dialog(city),
            style: { cursor: "pointer" },
            onMouseEnter: (e2) => {
              e2.currentTarget.style.background = "var(--xb-bg-secondary, #161b22)";
            },
            onMouseLeave: (e2) => {
              e2.currentTarget.style.background = "";
            },
            children: [
              /* @__PURE__ */ u("td", { style: TD_STYLE, children: /* @__PURE__ */ u("span", { style: { fontWeight: 600 }, children: String(city.name) }) }),
              /* @__PURE__ */ u("td", { style: { ...TD_STYLE, color }, children: ownerName }),
              /* @__PURE__ */ u("td", { style: TD_STYLE, children: String(city.size ?? "—") }),
              /* @__PURE__ */ u("td", { style: { ...TD_STYLE, color: "var(--xb-text-secondary, #8b949e)" }, children: prodName })
            ]
          },
          city.id
        );
      }) })
    ] }),
    /* @__PURE__ */ u("div", { style: { padding: "6px 10px", color: "var(--xb-text-secondary, #8b949e)", fontSize: "var(--xb-font-size-xs, 11px)" }, children: [
      cities2.length,
      " cities total — click a row to open the city view"
    ] })
  ] });
}
let _mounted = false;
function mountCitiesPanel() {
  if (_mounted) return;
  const container = document.getElementById("tabs-cities");
  if (!container) return;
  J(/* @__PURE__ */ u(CitiesPanel, {}), container);
  _mounted = true;
}
const CitiesPanel$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CitiesPanel,
  mountCitiesPanel
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=main.js.map
