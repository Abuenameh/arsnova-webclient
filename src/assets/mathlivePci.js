(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory(require('qtiCustomInteractionContext')))
    : typeof define === 'function' && define.amd
      ? define(['qtiCustomInteractionContext'], factory)
      : ((global =
          typeof globalThis !== 'undefined' ? globalThis : global || self),
        (global['mathlive-pci'] = factory(global.ctx)));
})(this, function (ctx) {
  'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(
            n,
            k,
            d.get
              ? d
              : {
                  enumerable: true,
                  get: function () {
                    return e[k];
                  },
                }
          );
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var ctx__namespace = /*#__PURE__*/ _interopNamespaceDefault(ctx);

  var n,
    l$2,
    u$3,
    i$2,
    o$2,
    r$1,
    f$3,
    e$1,
    c$2,
    s$2,
    h$2 = {},
    v$2 = [],
    p$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
    y$2 = Array.isArray;
  function d$2(n, l) {
    for (var u in l) n[u] = l[u];
    return n;
  }
  function _$1(n) {
    var l = n.parentNode;
    l && l.removeChild(n);
  }
  function g(l, u, t) {
    var i,
      o,
      r,
      f = {};
    for (r in u)
      'key' == r ? (i = u[r]) : 'ref' == r ? (o = u[r]) : (f[r] = u[r]);
    if (
      (arguments.length > 2 &&
        (f.children = arguments.length > 3 ? n.call(arguments, 2) : t),
      'function' == typeof l && null != l.defaultProps)
    )
      for (r in l.defaultProps) void 0 === f[r] && (f[r] = l.defaultProps[r]);
    return b$1(l, f, i, o, null);
  }
  function b$1(n, t, i, o, r) {
    var f = {
      type: n,
      props: t,
      key: i,
      ref: o,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      constructor: void 0,
      __v: null == r ? ++u$3 : r,
      __i: -1,
      __u: 0,
    };
    return null == r && null != l$2.vnode && l$2.vnode(f), f;
  }
  function w$2(n) {
    return n.children;
  }
  function k$1(n, l) {
    (this.props = n), (this.context = l);
  }
  function x(n, l) {
    if (null == l) return n.__ ? x(n.__, n.__i + 1) : null;
    for (var u; l < n.__k.length; l++)
      if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
    return 'function' == typeof n.type ? x(n) : null;
  }
  function C$1(n) {
    var l, u;
    if (null != (n = n.__) && null != n.__c) {
      for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)
        if (null != (u = n.__k[l]) && null != u.__e) {
          n.__e = n.__c.base = u.__e;
          break;
        }
      return C$1(n);
    }
  }
  function P(n) {
    ((!n.__d && (n.__d = !0) && i$2.push(n) && !S.__r++) ||
      o$2 !== l$2.debounceRendering) &&
      ((o$2 = l$2.debounceRendering) || r$1)(S);
  }
  function S() {
    var n, u, t, o, r, e, c, s;
    for (i$2.sort(f$3); (n = i$2.shift()); )
      n.__d &&
        ((u = i$2.length),
        (o = void 0),
        (e = (r = (t = n).__v).__e),
        (c = []),
        (s = []),
        t.__P &&
          (((o = d$2({}, r)).__v = r.__v + 1),
          l$2.vnode && l$2.vnode(o),
          O(
            t.__P,
            o,
            r,
            t.__n,
            void 0 !== t.__P.ownerSVGElement,
            32 & r.__u ? [e] : null,
            c,
            null == e ? x(r) : e,
            !!(32 & r.__u),
            s
          ),
          (o.__v = r.__v),
          (o.__.__k[o.__i] = o),
          j$1(c, o, s),
          o.__e != e && C$1(o)),
        i$2.length > u && i$2.sort(f$3));
    S.__r = 0;
  }
  function $(n, l, u, t, i, o, r, f, e, c, s) {
    var a,
      p,
      y,
      d,
      _,
      g = (t && t.__k) || v$2,
      b = l.length;
    for (u.__d = e, I(u, l, g), e = u.__d, a = 0; a < b; a++)
      null != (y = u.__k[a]) &&
        'boolean' != typeof y &&
        'function' != typeof y &&
        ((p = -1 === y.__i ? h$2 : g[y.__i] || h$2),
        (y.__i = a),
        O(n, y, p, i, o, r, f, e, c, s),
        (d = y.__e),
        y.ref &&
          p.ref != y.ref &&
          (p.ref && N(p.ref, null, y), s.push(y.ref, y.__c || d, y)),
        null == _ && null != d && (_ = d),
        65536 & y.__u || p.__k === y.__k
          ? (e && !e.isConnected && (e = x(p)), (e = H(y, e, n)))
          : 'function' == typeof y.type && void 0 !== y.__d
            ? (e = y.__d)
            : d && (e = d.nextSibling),
        (y.__d = void 0),
        (y.__u &= -196609));
    (u.__d = e), (u.__e = _);
  }
  function I(n, l, u) {
    var t,
      i,
      o,
      r,
      f,
      e = l.length,
      c = u.length,
      s = c,
      a = 0;
    for (n.__k = [], t = 0; t < e; t++)
      (r = t + a),
        null !=
        (i = n.__k[t] =
          null == (i = l[t]) || 'boolean' == typeof i || 'function' == typeof i
            ? null
            : 'string' == typeof i ||
                'number' == typeof i ||
                'bigint' == typeof i ||
                i.constructor == String
              ? b$1(null, i, null, null, null)
              : y$2(i)
                ? b$1(w$2, { children: i }, null, null, null)
                : void 0 === i.constructor && i.__b > 0
                  ? b$1(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v)
                  : i)
          ? ((i.__ = n),
            (i.__b = n.__b + 1),
            (f = A(i, u, r, s)),
            (i.__i = f),
            (o = null),
            -1 !== f && (s--, (o = u[f]) && (o.__u |= 131072)),
            null == o || null === o.__v
              ? (-1 == f && a--,
                'function' != typeof i.type && (i.__u |= 65536))
              : f !== r &&
                (f === r + 1
                  ? a++
                  : f > r
                    ? s > e - r
                      ? (a += f - r)
                      : a--
                    : f < r
                      ? f == r - 1 && (a = f - r)
                      : (a = 0),
                f !== t + a && (i.__u |= 65536)))
          : (o = u[r]) &&
            null == o.key &&
            o.__e &&
            0 == (131072 & o.__u) &&
            (o.__e == n.__d && (n.__d = x(o)),
            q$1(o, o, !1),
            (u[r] = null),
            s--);
    if (s)
      for (t = 0; t < c; t++)
        null != (o = u[t]) &&
          0 == (131072 & o.__u) &&
          (o.__e == n.__d && (n.__d = x(o)), q$1(o, o));
  }
  function H(n, l, u) {
    var t, i;
    if ('function' == typeof n.type) {
      for (t = n.__k, i = 0; t && i < t.length; i++)
        t[i] && ((t[i].__ = n), (l = H(t[i], l, u)));
      return l;
    }
    n.__e != l && (u.insertBefore(n.__e, l || null), (l = n.__e));
    do {
      l = l && l.nextSibling;
    } while (null != l && 8 === l.nodeType);
    return l;
  }
  function A(n, l, u, t) {
    var i = n.key,
      o = n.type,
      r = u - 1,
      f = u + 1,
      e = l[u];
    if (
      null === e ||
      (e && i == e.key && o === e.type && 0 == (131072 & e.__u))
    )
      return u;
    if (t > (null != e && 0 == (131072 & e.__u) ? 1 : 0))
      for (; r >= 0 || f < l.length; ) {
        if (r >= 0) {
          if ((e = l[r]) && 0 == (131072 & e.__u) && i == e.key && o === e.type)
            return r;
          r--;
        }
        if (f < l.length) {
          if ((e = l[f]) && 0 == (131072 & e.__u) && i == e.key && o === e.type)
            return f;
          f++;
        }
      }
    return -1;
  }
  function F$1(n, l, u) {
    '-' === l[0]
      ? n.setProperty(l, null == u ? '' : u)
      : (n[l] =
          null == u ? '' : 'number' != typeof u || p$2.test(l) ? u : u + 'px');
  }
  function L(n, l, u, t, i) {
    var o;
    n: if ('style' === l)
      if ('string' == typeof u) n.style.cssText = u;
      else {
        if (('string' == typeof t && (n.style.cssText = t = ''), t))
          for (l in t) (u && l in u) || F$1(n.style, l, '');
        if (u) for (l in u) (t && u[l] === t[l]) || F$1(n.style, l, u[l]);
      }
    else if ('o' === l[0] && 'n' === l[1])
      (o = l !== (l = l.replace(/(PointerCapture)$|Capture$/i, '$1'))),
        (l =
          l.toLowerCase() in n || 'onFocusOut' === l || 'onFocusIn' === l
            ? l.toLowerCase().slice(2)
            : l.slice(2)),
        n.l || (n.l = {}),
        (n.l[l + o] = u),
        u
          ? t
            ? (u.u = t.u)
            : ((u.u = e$1), n.addEventListener(l, o ? s$2 : c$2, o))
          : n.removeEventListener(l, o ? s$2 : c$2, o);
    else {
      if (i) l = l.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's');
      else if (
        'width' != l &&
        'height' != l &&
        'href' != l &&
        'list' != l &&
        'form' != l &&
        'tabIndex' != l &&
        'download' != l &&
        'rowSpan' != l &&
        'colSpan' != l &&
        'role' != l &&
        l in n
      )
        try {
          n[l] = null == u ? '' : u;
          break n;
        } catch (n) {}
      'function' == typeof u ||
        (null == u || (!1 === u && '-' !== l[4])
          ? n.removeAttribute(l)
          : n.setAttribute(l, u));
    }
  }
  function M(n) {
    return function (u) {
      if (this.l) {
        var t = this.l[u.type + n];
        if (null == u.t) u.t = e$1++;
        else if (u.t < t.u) return;
        return t(l$2.event ? l$2.event(u) : u);
      }
    };
  }
  function O(n, u, t, i, o, r, f, e, c, s) {
    var a,
      h,
      v,
      p,
      _,
      g,
      b,
      m,
      x,
      C,
      P,
      S,
      I,
      H,
      T,
      A = u.type;
    if (void 0 !== u.constructor) return null;
    128 & t.__u && ((c = !!(32 & t.__u)), (r = [(e = u.__e = t.__e)])),
      (a = l$2.__b) && a(u);
    n: if ('function' == typeof A)
      try {
        if (
          ((m = u.props),
          (x = (a = A.contextType) && i[a.__c]),
          (C = a ? (x ? x.props.value : a.__) : i),
          t.__c
            ? (b = (h = u.__c = t.__c).__ = h.__E)
            : ('prototype' in A && A.prototype.render
                ? (u.__c = h = new A(m, C))
                : ((u.__c = h = new k$1(m, C)),
                  (h.constructor = A),
                  (h.render = B$1)),
              x && x.sub(h),
              (h.props = m),
              h.state || (h.state = {}),
              (h.context = C),
              (h.__n = i),
              (v = h.__d = !0),
              (h.__h = []),
              (h._sb = [])),
          null == h.__s && (h.__s = h.state),
          null != A.getDerivedStateFromProps &&
            (h.__s == h.state && (h.__s = d$2({}, h.__s)),
            d$2(h.__s, A.getDerivedStateFromProps(m, h.__s))),
          (p = h.props),
          (_ = h.state),
          (h.__v = u),
          v)
        )
          null == A.getDerivedStateFromProps &&
            null != h.componentWillMount &&
            h.componentWillMount(),
            null != h.componentDidMount && h.__h.push(h.componentDidMount);
        else {
          if (
            (null == A.getDerivedStateFromProps &&
              m !== p &&
              null != h.componentWillReceiveProps &&
              h.componentWillReceiveProps(m, C),
            !h.__e &&
              ((null != h.shouldComponentUpdate &&
                !1 === h.shouldComponentUpdate(m, h.__s, C)) ||
                u.__v === t.__v))
          ) {
            for (
              u.__v !== t.__v &&
                ((h.props = m), (h.state = h.__s), (h.__d = !1)),
                u.__e = t.__e,
                u.__k = t.__k,
                u.__k.forEach(function (n) {
                  n && (n.__ = u);
                }),
                P = 0;
              P < h._sb.length;
              P++
            )
              h.__h.push(h._sb[P]);
            (h._sb = []), h.__h.length && f.push(h);
            break n;
          }
          null != h.componentWillUpdate && h.componentWillUpdate(m, h.__s, C),
            null != h.componentDidUpdate &&
              h.__h.push(function () {
                h.componentDidUpdate(p, _, g);
              });
        }
        if (
          ((h.context = C),
          (h.props = m),
          (h.__P = n),
          (h.__e = !1),
          (S = l$2.__r),
          (I = 0),
          'prototype' in A && A.prototype.render)
        ) {
          for (
            h.state = h.__s,
              h.__d = !1,
              S && S(u),
              a = h.render(h.props, h.state, h.context),
              H = 0;
            H < h._sb.length;
            H++
          )
            h.__h.push(h._sb[H]);
          h._sb = [];
        } else
          do {
            (h.__d = !1),
              S && S(u),
              (a = h.render(h.props, h.state, h.context)),
              (h.state = h.__s);
          } while (h.__d && ++I < 25);
        (h.state = h.__s),
          null != h.getChildContext &&
            (i = d$2(d$2({}, i), h.getChildContext())),
          v ||
            null == h.getSnapshotBeforeUpdate ||
            (g = h.getSnapshotBeforeUpdate(p, _)),
          $(
            n,
            y$2(
              (T =
                null != a && a.type === w$2 && null == a.key
                  ? a.props.children
                  : a)
            )
              ? T
              : [T],
            u,
            t,
            i,
            o,
            r,
            f,
            e,
            c,
            s
          ),
          (h.base = u.__e),
          (u.__u &= -161),
          h.__h.length && f.push(h),
          b && (h.__E = h.__ = null);
      } catch (n) {
        (u.__v = null),
          c || null != r
            ? ((u.__e = e), (u.__u |= c ? 160 : 32), (r[r.indexOf(e)] = null))
            : ((u.__e = t.__e), (u.__k = t.__k)),
          l$2.__e(n, u, t);
      }
    else
      null == r && u.__v === t.__v
        ? ((u.__k = t.__k), (u.__e = t.__e))
        : (u.__e = z$1(t.__e, u, t, i, o, r, f, c, s));
    (a = l$2.diffed) && a(u);
  }
  function j$1(n, u, t) {
    u.__d = void 0;
    for (var i = 0; i < t.length; i++) N(t[i], t[++i], t[++i]);
    l$2.__c && l$2.__c(u, n),
      n.some(function (u) {
        try {
          (n = u.__h),
            (u.__h = []),
            n.some(function (n) {
              n.call(u);
            });
        } catch (n) {
          l$2.__e(n, u.__v);
        }
      });
  }
  function z$1(l, u, t, i, o, r, f, e, c) {
    var s,
      a,
      v,
      p,
      d,
      g,
      b,
      m = t.props,
      w = u.props,
      k = u.type;
    if (('svg' === k && (o = !0), null != r))
      for (s = 0; s < r.length; s++)
        if (
          (d = r[s]) &&
          'setAttribute' in d == !!k &&
          (k ? d.localName === k : 3 === d.nodeType)
        ) {
          (l = d), (r[s] = null);
          break;
        }
    if (null == l) {
      if (null === k) return document.createTextNode(w);
      (l = o
        ? document.createElementNS('http://www.w3.org/2000/svg', k)
        : document.createElement(k, w.is && w)),
        (r = null),
        (e = !1);
    }
    if (null === k) m === w || (e && l.data === w) || (l.data = w);
    else {
      if (
        ((r = r && n.call(l.childNodes)), (m = t.props || h$2), !e && null != r)
      )
        for (m = {}, s = 0; s < l.attributes.length; s++)
          m[(d = l.attributes[s]).name] = d.value;
      for (s in m)
        (d = m[s]),
          'children' == s ||
            ('dangerouslySetInnerHTML' == s
              ? (v = d)
              : 'key' === s || s in w || L(l, s, null, d, o));
      for (s in w)
        (d = w[s]),
          'children' == s
            ? (p = d)
            : 'dangerouslySetInnerHTML' == s
              ? (a = d)
              : 'value' == s
                ? (g = d)
                : 'checked' == s
                  ? (b = d)
                  : 'key' === s ||
                    (e && 'function' != typeof d) ||
                    m[s] === d ||
                    L(l, s, d, m[s], o);
      if (a)
        e ||
          (v && (a.__html === v.__html || a.__html === l.innerHTML)) ||
          (l.innerHTML = a.__html),
          (u.__k = []);
      else if (
        (v && (l.innerHTML = ''),
        $(
          l,
          y$2(p) ? p : [p],
          u,
          t,
          i,
          o && 'foreignObject' !== k,
          r,
          f,
          r ? r[0] : t.__k && x(t, 0),
          e,
          c
        ),
        null != r)
      )
        for (s = r.length; s--; ) null != r[s] && _$1(r[s]);
      e ||
        ((s = 'value'),
        void 0 !== g &&
          (g !== l[s] ||
            ('progress' === k && !g) ||
            ('option' === k && g !== m[s])) &&
          L(l, s, g, m[s], !1),
        (s = 'checked'),
        void 0 !== b && b !== l[s] && L(l, s, b, m[s], !1));
    }
    return l;
  }
  function N(n, u, t) {
    try {
      'function' == typeof n ? n(u) : (n.current = u);
    } catch (n) {
      l$2.__e(n, t);
    }
  }
  function q$1(n, u, t) {
    var i, o;
    if (
      (l$2.unmount && l$2.unmount(n),
      (i = n.ref) && ((i.current && i.current !== n.__e) || N(i, null, u)),
      null != (i = n.__c))
    ) {
      if (i.componentWillUnmount)
        try {
          i.componentWillUnmount();
        } catch (n) {
          l$2.__e(n, u);
        }
      i.base = i.__P = null;
    }
    if ((i = n.__k))
      for (o = 0; o < i.length; o++)
        i[o] && q$1(i[o], u, t || 'function' != typeof n.type);
    t || null == n.__e || _$1(n.__e), (n.__c = n.__ = n.__e = n.__d = void 0);
  }
  function B$1(n, l, u) {
    return this.constructor(n, u);
  }
  function D$1(u, t, i) {
    var o, r, f, e;
    l$2.__ && l$2.__(u, t),
      (r = (o = 'function' == typeof i) ? null : (i && i.__k) || t.__k),
      (f = []),
      (e = []),
      O(
        t,
        (u = ((!o && i) || t).__k = g(w$2, null, [u])),
        r || h$2,
        h$2,
        void 0 !== t.ownerSVGElement,
        !o && i ? [i] : r ? null : t.firstChild ? n.call(t.childNodes) : null,
        f,
        !o && i ? i : r ? r.__e : t.firstChild,
        o,
        e
      ),
      j$1(f, u, e);
  }
  (n = v$2.slice),
    (l$2 = {
      __e: function (n, l, u, t) {
        for (var i, o, r; (l = l.__); )
          if ((i = l.__c) && !i.__)
            try {
              if (
                ((o = i.constructor) &&
                  null != o.getDerivedStateFromError &&
                  (i.setState(o.getDerivedStateFromError(n)), (r = i.__d)),
                null != i.componentDidCatch &&
                  (i.componentDidCatch(n, t || {}), (r = i.__d)),
                r)
              )
                return (i.__E = i);
            } catch (l) {
              n = l;
            }
        throw n;
      },
    }),
    (u$3 = 0),
    (k$1.prototype.setState = function (n, l) {
      var u;
      (u =
        null != this.__s && this.__s !== this.state
          ? this.__s
          : (this.__s = d$2({}, this.state))),
        'function' == typeof n && (n = n(d$2({}, u), this.props)),
        n && d$2(u, n),
        null != n && this.__v && (l && this._sb.push(l), P(this));
    }),
    (k$1.prototype.forceUpdate = function (n) {
      this.__v && ((this.__e = !0), n && this.__h.push(n), P(this));
    }),
    (k$1.prototype.render = w$2),
    (i$2 = []),
    (r$1 =
      'function' == typeof Promise
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout),
    (f$3 = function (n, l) {
      return n.__v.__b - l.__v.__b;
    }),
    (S.__r = 0),
    (e$1 = 0),
    (c$2 = M(!1)),
    (s$2 = M(!0));

  var f$2 = 0;
  function u$2(e, t, n, o, i, u) {
    var a,
      c,
      p = {};
    for (c in t) 'ref' == c ? (a = t[c]) : (p[c] = t[c]);
    var l = {
      type: e,
      props: p,
      key: n,
      ref: a,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      constructor: void 0,
      __v: --f$2,
      __i: -1,
      __u: 0,
      __source: i,
      __self: u,
    };
    if ('function' == typeof e && (a = e.defaultProps))
      for (c in a) void 0 === p[c] && (p[c] = a[c]);
    return l$2.vnode && l$2.vnode(l), l;
  }

  'undefined' != typeof window &&
    window.__PREACT_DEVTOOLS__ &&
    window.__PREACT_DEVTOOLS__.attachPreact('10.20.2', l$2, {
      Fragment: w$2,
      Component: k$1,
    });

  var o$1 = {};
  function a$1(e) {
    return e.type === w$2
      ? 'Fragment'
      : 'function' == typeof e.type
        ? e.type.displayName || e.type.name
        : 'string' == typeof e.type
          ? e.type
          : '#text';
  }
  var i$1 = [],
    s$1 = [];
  function c$1() {
    return i$1.length > 0 ? i$1[i$1.length - 1] : null;
  }
  var l$1 = !1;
  function u$1(e) {
    return 'function' == typeof e.type && e.type != w$2;
  }
  function f$1(n) {
    for (var e = [n], t = n; null != t.__o; ) e.push(t.__o), (t = t.__o);
    return e.reduce(function (n, e) {
      n += '  in ' + a$1(e);
      var t = e.__source;
      return (
        t
          ? (n += ' (at ' + t.fileName + ':' + t.lineNumber + ')')
          : l$1 ||
            ((l$1 = !0),
            console.warn(
              'Add @babel/plugin-transform-react-jsx-source to get a more detailed component stack. Note that you should not add it to production builds of your App for bundle size reasons.'
            )),
        n + '\n'
      );
    }, '');
  }
  var p$1 = 'function' == typeof WeakMap;
  function d$1(n) {
    var e = [];
    return n.__k
      ? (n.__k.forEach(function (n) {
          n && 'function' == typeof n.type
            ? e.push.apply(e, d$1(n))
            : n && 'string' == typeof n.type && e.push(n.type);
        }),
        e)
      : e;
  }
  function h$1(n) {
    return n
      ? 'function' == typeof n.type
        ? null === n.__
          ? null !== n.__e && null !== n.__e.parentNode
            ? n.__e.parentNode.localName
            : ''
          : h$1(n.__)
        : n.type
      : '';
  }
  var v$1 = k$1.prototype.setState;
  function y$1(n) {
    return (
      'table' === n ||
      'tfoot' === n ||
      'tbody' === n ||
      'thead' === n ||
      'td' === n ||
      'tr' === n ||
      'th' === n
    );
  }
  k$1.prototype.setState = function (n, e) {
    return (
      null == this.__v &&
        null == this.state &&
        console.warn(
          'Calling "this.setState" inside the constructor of a component is a no-op and might be a bug in your application. Instead, set "this.state = {}" directly.\n\n' +
            f$1(c$1())
        ),
      v$1.call(this, n, e)
    );
  };
  var m$1 =
      /^(address|article|aside|blockquote|details|div|dl|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|main|menu|nav|ol|p|pre|search|section|table|ul)$/,
    b = k$1.prototype.forceUpdate;
  function w$1(n) {
    var e = n.props,
      t = a$1(n),
      o = '';
    for (var r in e)
      if (e.hasOwnProperty(r) && 'children' !== r) {
        var i = e[r];
        'function' == typeof i &&
          (i = 'function ' + (i.displayName || i.name) + '() {}'),
          (i =
            Object(i) !== i || i.toString
              ? i + ''
              : Object.prototype.toString.call(i)),
          (o += ' ' + r + '=' + JSON.stringify(i));
      }
    var s = e.children;
    return '<' + t + o + (s && s.length ? '>..</' + t + '>' : ' />');
  }
  (k$1.prototype.forceUpdate = function (n) {
    return (
      null == this.__v
        ? console.warn(
            'Calling "this.forceUpdate" inside the constructor of a component is a no-op and might be a bug in your application.\n\n' +
              f$1(c$1())
          )
        : null == this.__P &&
          console.warn(
            'Can\'t call "this.forceUpdate" on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.\n\n' +
              f$1(this.__v)
          ),
      b.call(this, n)
    );
  }),
    (function () {
      !(function () {
        var n = l$2.__b,
          t = l$2.diffed,
          o = l$2.__,
          r = l$2.vnode,
          a = l$2.__r;
        (l$2.diffed = function (n) {
          u$1(n) && s$1.pop(), i$1.pop(), t && t(n);
        }),
          (l$2.__b = function (e) {
            u$1(e) && i$1.push(e), n && n(e);
          }),
          (l$2.__ = function (n, e) {
            (s$1 = []), o && o(n, e);
          }),
          (l$2.vnode = function (n) {
            (n.__o = s$1.length > 0 ? s$1[s$1.length - 1] : null), r && r(n);
          }),
          (l$2.__r = function (n) {
            u$1(n) && s$1.push(n), a && a(n);
          });
      })();
      var n = !1,
        t = l$2.__b,
        r = l$2.diffed,
        c = l$2.vnode,
        l = l$2.__r,
        v = l$2.__e,
        b = l$2.__,
        g = l$2.__h,
        E = p$1
          ? {
              useEffect: new WeakMap(),
              useLayoutEffect: new WeakMap(),
              lazyPropTypes: new WeakMap(),
            }
          : null,
        k = [];
      (l$2.__e = function (n, e, t, o) {
        if (e && e.__c && 'function' == typeof n.then) {
          var r = n;
          n = new Error(
            'Missing Suspense. The throwing component was: ' + a$1(e)
          );
          for (var i = e; i; i = i.__)
            if (i.__c && i.__c.__c) {
              n = r;
              break;
            }
          if (n instanceof Error) throw n;
        }
        try {
          ((o = o || {}).componentStack = f$1(e)),
            v(n, e, t, o),
            'function' != typeof n.then &&
              setTimeout(function () {
                throw n;
              });
        } catch (n) {
          throw n;
        }
      }),
        (l$2.__ = function (n, e) {
          if (!e)
            throw new Error(
              'Undefined parent passed to render(), this is the second argument.\nCheck if the element is available in the DOM/has the correct id.'
            );
          var t;
          switch (e.nodeType) {
            case 1:
            case 11:
            case 9:
              t = !0;
              break;
            default:
              t = !1;
          }
          if (!t) {
            var o = a$1(n);
            throw new Error(
              'Expected a valid HTML node as a second argument to render.\tReceived ' +
                e +
                ' instead: render(<' +
                o +
                ' />, ' +
                e +
                ');'
            );
          }
          b && b(n, e);
        }),
        (l$2.__b = function (e) {
          var r = e.type;
          if (((n = !0), void 0 === r))
            throw new Error(
              'Undefined component passed to createElement()\n\nYou likely forgot to export your component or might have mixed up default and named imports' +
                w$1(e) +
                '\n\n' +
                f$1(e)
            );
          if (null != r && 'object' == typeof r) {
            if (void 0 !== r.__k && void 0 !== r.__e)
              throw new Error(
                'Invalid type passed to createElement(): ' +
                  r +
                  '\n\nDid you accidentally pass a JSX literal as JSX twice?\n\n  let My' +
                  a$1(e) +
                  ' = ' +
                  w$1(r) +
                  ';\n  let vnode = <My' +
                  a$1(e) +
                  ' />;\n\nThis usually happens when you export a JSX literal and not the component.\n\n' +
                  f$1(e)
              );
            throw new Error(
              'Invalid type passed to createElement(): ' +
                (Array.isArray(r) ? 'array' : r)
            );
          }
          if (
            void 0 !== e.ref &&
            'function' != typeof e.ref &&
            'object' != typeof e.ref &&
            !('$$typeof' in e)
          )
            throw new Error(
              'Component\'s "ref" property should be a function, or an object created by createRef(), but got [' +
                typeof e.ref +
                '] instead\n' +
                w$1(e) +
                '\n\n' +
                f$1(e)
            );
          if ('string' == typeof e.type)
            for (var i in e.props)
              if (
                'o' === i[0] &&
                'n' === i[1] &&
                'function' != typeof e.props[i] &&
                null != e.props[i]
              )
                throw new Error(
                  'Component\'s "' +
                    i +
                    '" property should be a function, but got [' +
                    typeof e.props[i] +
                    '] instead\n' +
                    w$1(e) +
                    '\n\n' +
                    f$1(e)
                );
          if ('function' == typeof e.type && e.type.propTypes) {
            if (
              'Lazy' === e.type.displayName &&
              E &&
              !E.lazyPropTypes.has(e.type)
            ) {
              var s =
                'PropTypes are not supported on lazy(). Use propTypes on the wrapped component itself. ';
              try {
                var c = e.type();
                E.lazyPropTypes.set(e.type, !0),
                  console.warn(s + 'Component wrapped in lazy() is ' + a$1(c));
              } catch (n) {
                console.warn(
                  s +
                    "We will log the wrapped component's name once it is loaded."
                );
              }
            }
            var l = e.props;
            e.type.__f &&
              delete (l = (function (n, e) {
                for (var t in e) n[t] = e[t];
                return n;
              })({}, l)).ref,
              (function (n, e, t, r, a) {
                Object.keys(n).forEach(function (t) {
                  var i;
                  try {
                    i = n[t](
                      e,
                      t,
                      r,
                      'prop',
                      null,
                      'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
                    );
                  } catch (n) {
                    i = n;
                  }
                  i &&
                    !(i.message in o$1) &&
                    ((o$1[i.message] = !0),
                    console.error(
                      'Failed prop type: ' +
                        i.message +
                        ((a && '\n' + a()) || '')
                    ));
                });
              })(e.type.propTypes, l, 0, a$1(e), function () {
                return f$1(e);
              });
          }
          t && t(e);
        }),
        (l$2.__r = function (e) {
          l && l(e), (n = !0);
        }),
        (l$2.__h = function (e, t, o) {
          if (!e || !n)
            throw new Error('Hook can only be invoked from render methods.');
          g && g(e, t, o);
        });
      var _ = function (n, e) {
          return {
            get: function () {
              var t = 'get' + n + e;
              k &&
                k.indexOf(t) < 0 &&
                (k.push(t),
                console.warn('getting vnode.' + n + ' is deprecated, ' + e));
            },
            set: function () {
              var t = 'set' + n + e;
              k &&
                k.indexOf(t) < 0 &&
                (k.push(t),
                console.warn('setting vnode.' + n + ' is not allowed, ' + e));
            },
          };
        },
        I = {
          nodeName: _('nodeName', 'use vnode.type'),
          attributes: _('attributes', 'use vnode.props'),
          children: _('children', 'use vnode.props.children'),
        },
        T = Object.create({}, I);
      (l$2.vnode = function (n) {
        var e = n.props;
        if (
          null !== n.type &&
          null != e &&
          ('__source' in e || '__self' in e)
        ) {
          var t = (n.props = {});
          for (var o in e) {
            var r = e[o];
            '__source' === o
              ? (n.__source = r)
              : '__self' === o
                ? (n.__self = r)
                : (t[o] = r);
          }
        }
        (n.__proto__ = T), c && c(n);
      }),
        (l$2.diffed = function (e) {
          var t,
            o = e.type,
            i = e.__;
          if (
            (e.__k &&
              e.__k.forEach(function (n) {
                if ('object' == typeof n && n && void 0 === n.type) {
                  var t = Object.keys(n).join(',');
                  throw new Error(
                    'Objects are not valid as a child. Encountered an object with the keys {' +
                      t +
                      '}.\n\n' +
                      f$1(e)
                  );
                }
              }),
            'string' == typeof o && (y$1(o) || 'p' === o))
          ) {
            var s = h$1(i);
            if ('' !== s)
              'table' === o && 'td' !== s && y$1(s)
                ? (console.log(s, i.__e),
                  console.error(
                    'Improper nesting of table. Your <table> should not have a table-node parent.' +
                      w$1(e) +
                      '\n\n' +
                      f$1(e)
                  ))
                : ('thead' !== o && 'tfoot' !== o && 'tbody' !== o) ||
                    'table' === s
                  ? 'tr' === o &&
                    'thead' !== s &&
                    'tfoot' !== s &&
                    'tbody' !== s &&
                    'table' !== s
                    ? console.error(
                        'Improper nesting of table. Your <tr> should have a <thead/tbody/tfoot/table> parent.' +
                          w$1(e) +
                          '\n\n' +
                          f$1(e)
                      )
                    : 'td' === o && 'tr' !== s
                      ? console.error(
                          'Improper nesting of table. Your <td> should have a <tr> parent.' +
                            w$1(e) +
                            '\n\n' +
                            f$1(e)
                        )
                      : 'th' === o &&
                        'tr' !== s &&
                        console.error(
                          'Improper nesting of table. Your <th> should have a <tr>.' +
                            w$1(e) +
                            '\n\n' +
                            f$1(e)
                        )
                  : console.error(
                      'Improper nesting of table. Your <thead/tbody/tfoot> should have a <table> parent.' +
                        w$1(e) +
                        '\n\n' +
                        f$1(e)
                    );
            else if ('p' === o) {
              var c = d$1(e).filter(function (n) {
                return m$1.test(n);
              });
              c.length &&
                console.error(
                  'Improper nesting of paragraph. Your <p> should not have ' +
                    c.join(', ') +
                    'as child-elements.' +
                    w$1(e) +
                    '\n\n' +
                    f$1(e)
                );
            }
          }
          if (((n = !1), r && r(e), null != e.__k))
            for (var l = [], u = 0; u < e.__k.length; u++) {
              var p = e.__k[u];
              if (p && null != p.key) {
                var v = p.key;
                if (-1 !== l.indexOf(v)) {
                  console.error(
                    'Following component has two or more children with the same key attribute: "' +
                      v +
                      '". This may cause glitches and misbehavior in rendering process. Component: \n\n' +
                      w$1(e) +
                      '\n\n' +
                      f$1(e)
                  );
                  break;
                }
                l.push(v);
              }
            }
          if (null != e.__c && null != e.__c.__H) {
            var b = e.__c.__H.__;
            if (b)
              for (var g = 0; g < b.length; g += 1) {
                var E = b[g];
                if (E.__H)
                  for (var k = 0; k < E.__H.length; k++)
                    if ((t = E.__H[k]) != t) {
                      var _ = a$1(e);
                      throw new Error(
                        'Invalid argument passed to hook. Hooks should not be called with NaN in the dependency array. Hook index ' +
                          g +
                          ' in component ' +
                          _ +
                          ' was called with NaN.'
                      );
                    }
              }
          }
        });
    })();

  var t,
    r,
    u,
    i,
    o = 0,
    f = [],
    c = [],
    e = l$2,
    a = e.__b,
    v = e.__r,
    l = e.diffed,
    m = e.__c,
    s = e.unmount,
    d = e.__;
  function h(n, t) {
    e.__h && e.__h(r, n, o || t), (o = 0);
    var u = r.__H || (r.__H = { __: [], __h: [] });
    return n >= u.__.length && u.__.push({ __V: c }), u.__[n];
  }
  function p(n) {
    return (o = 1), y(D, n);
  }
  function y(n, u, i) {
    var o = h(t++, 2);
    if (
      ((o.t = n),
      !o.__c &&
        ((o.__ = [
          i ? i(u) : D(void 0, u),
          function (n) {
            var t = o.__N ? o.__N[0] : o.__[0],
              r = o.t(t, n);
            t !== r && ((o.__N = [r, o.__[1]]), o.__c.setState({}));
          },
        ]),
        (o.__c = r),
        !r.u))
    ) {
      var f = function (n, t, r) {
        if (!o.__c.__H) return !0;
        var u = o.__c.__H.__.filter(function (n) {
          return !!n.__c;
        });
        if (
          u.every(function (n) {
            return !n.__N;
          })
        )
          return !c || c.call(this, n, t, r);
        var i = !1;
        return (
          u.forEach(function (n) {
            if (n.__N) {
              var t = n.__[0];
              (n.__ = n.__N), (n.__N = void 0), t !== n.__[0] && (i = !0);
            }
          }),
          !(!i && o.__c.props === n) && (!c || c.call(this, n, t, r))
        );
      };
      r.u = !0;
      var c = r.shouldComponentUpdate,
        e = r.componentWillUpdate;
      (r.componentWillUpdate = function (n, t, r) {
        if (this.__e) {
          var u = c;
          (c = void 0), f(n, t, r), (c = u);
        }
        e && e.call(this, n, t, r);
      }),
        (r.shouldComponentUpdate = f);
    }
    return o.__N || o.__;
  }
  function _(n, u) {
    var i = h(t++, 3);
    !e.__s && C(i.__H, u) && ((i.__ = n), (i.i = u), r.__H.__h.push(i));
  }
  function F(n) {
    return (
      (o = 5),
      q(function () {
        return { current: n };
      }, [])
    );
  }
  function q(n, r) {
    var u = h(t++, 7);
    return C(u.__H, r) ? ((u.__V = n()), (u.i = r), (u.__h = n), u.__V) : u.__;
  }
  function j() {
    for (var n; (n = f.shift()); )
      if (n.__P && n.__H)
        try {
          n.__H.__h.forEach(z), n.__H.__h.forEach(B), (n.__H.__h = []);
        } catch (t) {
          (n.__H.__h = []), e.__e(t, n.__v);
        }
  }
  (e.__b = function (n) {
    (r = null), a && a(n);
  }),
    (e.__ = function (n, t) {
      n && t.__k && t.__k.__m && (n.__m = t.__k.__m), d && d(n, t);
    }),
    (e.__r = function (n) {
      v && v(n), (t = 0);
      var i = (r = n.__c).__H;
      i &&
        (u === r
          ? ((i.__h = []),
            (r.__h = []),
            i.__.forEach(function (n) {
              n.__N && (n.__ = n.__N), (n.__V = c), (n.__N = n.i = void 0);
            }))
          : (i.__h.forEach(z), i.__h.forEach(B), (i.__h = []), (t = 0))),
        (u = r);
    }),
    (e.diffed = function (n) {
      l && l(n);
      var t = n.__c;
      t &&
        t.__H &&
        (t.__H.__h.length &&
          ((1 !== f.push(t) && i === e.requestAnimationFrame) ||
            ((i = e.requestAnimationFrame) || w)(j)),
        t.__H.__.forEach(function (n) {
          n.i && (n.__H = n.i),
            n.__V !== c && (n.__ = n.__V),
            (n.i = void 0),
            (n.__V = c);
        })),
        (u = r = null);
    }),
    (e.__c = function (n, t) {
      t.some(function (n) {
        try {
          n.__h.forEach(z),
            (n.__h = n.__h.filter(function (n) {
              return !n.__ || B(n);
            }));
        } catch (r) {
          t.some(function (n) {
            n.__h && (n.__h = []);
          }),
            (t = []),
            e.__e(r, n.__v);
        }
      }),
        m && m(n, t);
    }),
    (e.unmount = function (n) {
      s && s(n);
      var t,
        r = n.__c;
      r &&
        r.__H &&
        (r.__H.__.forEach(function (n) {
          try {
            z(n);
          } catch (n) {
            t = n;
          }
        }),
        (r.__H = void 0),
        t && e.__e(t, r.__v));
    });
  var k = 'function' == typeof requestAnimationFrame;
  function w(n) {
    var t,
      r = function () {
        clearTimeout(u), k && cancelAnimationFrame(t), setTimeout(n);
      },
      u = setTimeout(r, 100);
    k && (t = requestAnimationFrame(r));
  }
  function z(n) {
    var t = r,
      u = n.__c;
    'function' == typeof u && ((n.__c = void 0), u()), (r = t);
  }
  function B(n) {
    var t = r;
    (n.__c = n.__()), (r = t);
  }
  function C(n, t) {
    return (
      !n ||
      n.length !== t.length ||
      t.some(function (t, r) {
        return t !== n[r];
      })
    );
  }
  function D(n, t) {
    return 'function' == typeof t ? t(n) : t;
  }

  var __awaiter =
    (undefined && undefined.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P
          ? value
          : new P(function (resolve) {
              resolve(value);
            });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator['throw'](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done
            ? resolve(result.value)
            : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
  class Store {
    constructor(initialState, restoreData) {
      this.initialState = initialState;
      this.listeners = [];
      this.actionListeners = [];
      this.actions = [];
      this.reducers = {};
      this.timeout = (ms) => new Promise((res) => setTimeout(res, ms));
      this.state =
        (restoreData === null || restoreData === void 0
          ? void 0
          : restoreData.state) || initialState;
      if (
        restoreData === null || restoreData === void 0
          ? void 0
          : restoreData.actions
      ) {
        this.state = initialState;
        this.actions = restoreData.actions;
        for (const action of this.actions) {
          this.state = this.reduce(this.state, action);
        }
      }
    }
    getState() {
      return this.state;
    }
    getActions() {
      return this.actions;
    }
    dispatch(payload) {
      const timestamp = Date.now();
      const payloadWithTimestamp = Object.assign(Object.assign({}, payload), {
        timestamp,
      });
      this.actions.push(payloadWithTimestamp);
      this.state = this.reduce(this.state, payloadWithTimestamp);
      this.notifyListeners(payloadWithTimestamp);
    }
    reset() {
      this.state = this.initialState;
      this.actions = [];
    }
    restoreState(state, actions) {
      this.state = state;
      this.actions = actions;
    }
    replay(actions, config) {
      return __awaiter(this, void 0, void 0, function* () {
        this.reset();
        this.actions = [];
        let previousTimestamp = 0;
        // if config.until is not null or undefined but accept 0
        if (
          (config === null || config === void 0 ? void 0 : config.until) != null
        ) {
          actions = actions.slice(0, config.until);
        }
        for (const action of actions) {
          // get the delay between the previous action and this action in milliseconds
          let delay =
            (config === null || config === void 0 ? void 0 : config.animate) ===
            false
              ? 0
              : !previousTimestamp
                ? 0
                : action.timestamp - previousTimestamp;
          if (config === null || config === void 0 ? void 0 : config.speed) {
            delay /= config.speed;
          }
          yield this.timeout(delay);
          this.actions.push(action);
          this.state = this.reduce(this.state, action);
          this.notifyListeners(action);
          previousTimestamp = action.timestamp;
        }
      });
    }
    subscribe(listener) {
      this.listeners.push(listener);
      // Immediately notify the listener with the current state
      listener(this.state);
    }
    subscribeActions(listener) {
      this.actionListeners.push(listener);
    }
    unsubscribe(listener) {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    }
    unsubscribeAll() {
      this.listeners = [];
    }
    addReducer(type, reducer) {
      this.reducers[type] = reducer;
    }
    reduce(state, action) {
      const reducer = this.reducers[action.type];
      return reducer ? reducer(state, action.payload) : state;
    }
    notifyListeners(action) {
      for (const listener of this.listeners) {
        listener(this.state);
      }
      for (const listener of this.actionListeners) {
        listener(action);
      }
      console.log('Action:', action);
    }
  }
  function useStore(store) {
    const [state, setState] = p(store.getState());
    _(() => {
      const listener = (newState) => {
        setState(newState);
      };
      store.subscribe(listener);
      return () => {
        store.unsubscribe(listener);
      };
    }, [store]);
    return state;
  }

  const Interaction = ({ config, dom, store }) => {
    const mf = F();
    const state = useStore(store);
    dom.addEventListener('changed', (e) => {
      mf.current.setValue(e.detail);
    });
    const handleChange = (e) => {
      const input = e.target;
      store.dispatch({ type: 'SET_INPUT', payload: { input: input.value } });
    };
    return u$2('math-field', {
      ref: mf,
      'math-virtual-keyboard-policy': 'auto',
      onfocusin: () => {
        window.mathVirtualKeyboard.layouts = config.layouts;
      },
      onChange: handleChange,
      style: {
        width: config.width,
        height: config.height,
        display: config.display,
      },
      children: state.input,
    });
  };

  var css_248z = 'h1 {\n    color: red;\n}';

  var width = '400px';
  var height = '400px';
  var display = 'inline-block';
  var layouts = 'numeric-only';
  var configProps = {
    width: width,
    height: height,
    display: display,
    layouts: layouts,
  };

  const initStore = (initialState, restoreData) => {
    const store = new Store(initialState, restoreData);
    store.addReducer('SET_INPUT', (state, { input }) => {
      return Object.assign(Object.assign({}, state), { input });
    });
    return store;
  };

  class App {
    constructor() {
      this.typeIdentifier = 'mathlivePci';
      this.logActions = [];
      this.initialState = { input: undefined };
      this.getInstance = (dom, config, stateString) => {
        config.properties = Object.assign(
          Object.assign({}, configProps),
          config.properties
        );
        this.config = config;
        this.logActions = stateString ? JSON.parse(stateString).log : [];
        this.store = initStore(this.initialState);
        try {
          const restoredState = stateString ? JSON.parse(stateString) : null;
          if (restoredState) {
            this.store.restoreState(
              restoredState === null || restoredState === void 0
                ? void 0
                : restoredState.state,
              this.logActions
            );
          }
        } catch (error) {
          console.log(error);
        }
        this.store.subscribe(() => {
          dom.dispatchEvent(
            new CustomEvent('changed', { detail: this.getResponse() })
          );
        });
        this.shadowdom = dom.attachShadow({ mode: 'closed' });
        this.render();
        this.config.onready && this.config.onready(this);
      };
      this.render = () => {
        D$1(null, this.shadowdom);
        const css = document.createElement('style');
        css.innerHTML = css_248z;
        this.shadowdom.appendChild(css);
        D$1(
          u$2(Interaction, {
            config: this.config.properties,
            dom: this.shadowdom,
            store: this.store,
          }),
          this.shadowdom
        );
      };
      this.getState = () =>
        JSON.stringify({
          state: this.store.getState(),
          log: this.store.getActions(),
        });
      this.getResponse = () => {
        var _a, _b;
        const state =
          ((_b =
            (_a = this.store) === null || _a === void 0
              ? void 0
              : _a.getState()) === null || _b === void 0
            ? void 0
            : _b.input) || undefined;
        if (state === undefined) return undefined;
        return {
          base: {
            string: this.store.getState().input,
          },
        };
      };
      this.setResponse = (response) => {
        this.store.dispatch({
          type: 'SET_INPUT',
          payload: { input: response },
        });
        this.shadowdom.dispatchEvent(
          new CustomEvent('changed', { detail: response })
        );
      };
      ctx__namespace && ctx__namespace.register(this);
    }
  }
  var index = new App();

  return index;
});
//# sourceMappingURL=mathlivePci.js.map
