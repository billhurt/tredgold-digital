/* Tredgold Digital — generative art.
   Every visual on the site that isn't a product preview is drawn here.

   Usage: <canvas data-art="tangle|flow|contour|converge"> is mounted
   automatically. The handle is stored on canvas._art (tangle exposes
   .progress, 0 = chaos, 1 = one straight line).

   All canvases: devicePixelRatio capped at 2, paused while off-screen,
   fewer lines on small screens, and a single static frame under
   prefers-reduced-motion. */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var C = {
    ink: '#0d0d0d', inkRule: '#2a2a2a', inkRuleStrong: '#6e6e6a',
    onInk: '#f4f4f2', onInkMuted: '#8a8a86', accent: '#1a56db', accentOnInk: '#6f9bf2',
    rule: '#d8d8d4', ruleStrong: '#b0b0aa'
  };

  /* ── helpers ── */
  function rng(seed) { // mulberry32: deterministic so layouts don't reshuffle on resize
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function mixGrey(t) { // --ink-rule → --on-ink-muted
    var v0 = [42, 42, 42], v1 = [138, 138, 134];
    return 'rgb(' + Math.round(lerp(v0[0], v1[0], t)) + ',' + Math.round(lerp(v0[1], v1[1], t)) + ',' + Math.round(lerp(v0[2], v1[2], t)) + ')';
  }
  function spineX() {
    var g = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter')) || 0;
    // --gutter is a clamp(); resolve it from a real element instead when we can
    var w = document.querySelector('.wrap');
    if (w) g = parseFloat(getComputedStyle(w).paddingLeft) || g;
    return Math.max((window.innerWidth - 1440) / 2, 0) + g / 2;
  }

  /* simplex noise (2D) */
  function makeNoise(seed) {
    var r = rng(seed), p = new Uint8Array(512), i, j, t;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = p[i]; p[i] = p[j]; p[j] = t; }
    for (i = 0; i < 256; i++) p[i + 256] = p[i];
    var G = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
    var F2 = .5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
    return function (x, y) {
      var s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s), t = (i + j) * G2;
      var x0 = x - (i - t), y0 = y - (j - t), i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
      var x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
      var ii = i & 255, jj = j & 255, n = 0, a, g;
      a = .5 - x0 * x0 - y0 * y0; if (a > 0) { g = G[p[ii + p[jj]] & 7]; n += a * a * a * a * (g[0] * x0 + g[1] * y0); }
      a = .5 - x1 * x1 - y1 * y1; if (a > 0) { g = G[p[ii + i1 + p[jj + j1]] & 7]; n += a * a * a * a * (g[0] * x1 + g[1] * y1); }
      a = .5 - x2 * x2 - y2 * y2; if (a > 0) { g = G[p[ii + 1 + p[jj + 1]] & 7]; n += a * a * a * a * (g[0] * x2 + g[1] * y2); }
      return 70 * n; // -1..1
    };
  }

  /* ── canvas mount: sizing, visibility pause, rAF loop ── */
  function mount(canvas, gen, opts) {
    var ctx = canvas.getContext('2d');
    var h = { progress: 0, canvas: canvas, opts: opts || {} };
    var w = 0, ht = 0, state = null, raf = 0, visible = false, t0 = performance.now(), last = 0;
    var animated = gen.animated !== false && !RM && !h.opts.still;

    function size() {
      var r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      if (Math.abs(r.width - w) < 1 && Math.abs(r.height - ht) < 80 && state) return true; // ignore mobile URL-bar jitter
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; ht = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(ht * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = gen.setup(w, ht, h);
      return true;
    }
    function frame(now) {
      raf = 0;
      if (!state) return;
      var t = (now - t0) / 1000, dt = Math.min((now - last) / 16.667, 3) || 1; last = now;
      gen.draw(ctx, w, ht, t, state, h, dt);
      if (animated && visible) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    h.redraw = function () { if (!animated) { if (state) gen.draw(ctx, w, ht, 0, state, h, 1); } else kick(); };

    var rt = 0;
    function onResize() { clearTimeout(rt); rt = setTimeout(function () { if (size()) { if (!animated && gen.still) gen.still(ctx, w, ht, state, h); else if (!animated) gen.draw(ctx, w, ht, 0, state, h, 1); else kick(); } }, 120); }
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(canvas); else window.addEventListener('resize', onResize);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && animated) kick();
      }, { rootMargin: '80px' }).observe(canvas);
    } else { visible = true; }

    if (size()) {
      if (!animated && gen.still) gen.still(ctx, w, ht, state, h);
      else gen.draw(ctx, w, ht, 0, state, h, 1);
    }
    canvas._art = h;
    return h;
  }

  /* ── GRAIN: feTurbulence noise tile, exposed as --grain ── */
  function grain() {
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>" +
      "<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -.2'/></filter>" +
      "<rect width='100%' height='100%' filter='url(%23n)'/></svg>";
    document.documentElement.style.setProperty('--grain', 'url("data:image/svg+xml,' + svg.replace(/</g, '%3C').replace(/>/g, '%3E') + '")');
  }

  /* ── BLUEPRINT GRID: 1px dot grid behind diagram sections ── */
  function blueprint(el) {
    el.style.backgroundImage = 'radial-gradient(circle, rgba(110,110,106,.4) 1px, transparent 1.4px)';
    el.style.backgroundSize = '32px 32px';
    el.style.backgroundPosition = 'center';
  }

  /* ── TANGLE FIELD: crossing hairlines that pull taut into one cobalt line ── */
  var tangle = {
    setup: function (w, h, hd) {
      var r = rng(hd.opts.seed || 7), n = w < 700 ? 16 : 40, lines = [], i, k;
      var sx = hd.opts.targetX != null ? hd.opts.targetX * w : spineX();
      function edge(side) {
        if (side === 0) return [-20, r() * h];
        if (side === 1) return [w + 20, r() * h];
        if (side === 2) return [r() * w, -20];
        return [r() * w, h + 20];
      }
      for (i = 0; i < n; i++) {
        var a = Math.floor(r() * 4), b = (a + 1 + Math.floor(r() * 3)) % 4;
        var pts = [edge(a), [r() * w, r() * h], [r() * w, r() * h], edge(b)];
        var drift = [];
        for (k = 0; k < 4; k++) drift.push([(.04 + r() * .09) * Math.min(w, h * 1.4), .12 + r() * .22, r() * 6.28, .1 + r() * .2, r() * 6.28]);
        var shade = Math.pow(r(), 2.2);
        lines.push({ pts: pts, drift: drift, delay: r(), color: mixGrey(shade), alpha: .55 + shade * .45, width: 1 });
      }
      // the cobalt line: wanders like the rest, but always leaves through the spine
      lines.push({
        accent: true, delay: 0, width: 1.5,
        pts: [[w * .96, -20], [w * .5, h * .34], [sx, h * .66], [sx, h + 20]],
        drift: [[0, 0, 0, 0, 0], [Math.min(w, h) * .12, .16, 1.2, .13, 4], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
      });
      return { lines: lines, sx: sx };
    },
    draw: function (ctx, w, h, t, s, hd) {
      var p = clamp(hd.progress, 0, 1), i, k;
      ctx.clearRect(0, 0, w, h);
      for (i = 0; i < s.lines.length; i++) {
        var L = s.lines[i];
        var q = ease(clamp((p - L.delay * .3) / .7, 0, 1));
        var a = L.accent ? 1 : L.alpha * (1 - q * q);
        if (a < .01) continue;
        var P = [];
        for (k = 0; k < 4; k++) {
          var d = L.drift[k];
          var x = L.pts[k][0] + Math.sin(t * d[1] + d[2]) * d[0];
          var y = L.pts[k][1] + Math.cos(t * d[3] + d[4]) * d[0];
          P.push(lerp(x, s.sx, q), lerp(y, -20 + (h + 40) * k / 3, q));
        }
        ctx.globalAlpha = a;
        ctx.strokeStyle = L.accent ? C.accent : L.color;
        ctx.lineWidth = L.width;
        ctx.beginPath();
        ctx.moveTo(P[0], P[1]);
        ctx.bezierCurveTo(P[2], P[3], P[4], P[5], P[6], P[7]);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };

  /* ── FLOW FIELD: particle trails converging into one horizontal line ── */
  var flow = {
    setup: function (w, h, hd) {
      var r = rng(21), n = w < 700 ? 46 : 130, ps = [], i;
      var y0 = h * (hd.opts.lineY || .5);
      function spawn(p, fresh) {
        var side = r();
        if (side < .55) { p.x = fresh ? r() * w * .5 : -10; p.y = r() * h; }
        else if (side < .78) { p.x = r() * w * .55; p.y = -10; }
        else { p.x = r() * w * .55; p.y = h + 10; }
        p.v = .9 + r() * 1.5; p.ph = r() * 6.28; p.f = .6 + r() * 1.2; p.shade = Math.pow(r(), 2); p.px = p.x; p.py = p.y;
      }
      for (i = 0; i < n; i++) { var p = {}; spawn(p, true); ps.push(p); }
      return { ps: ps, y0: y0, spawn: spawn, noise: makeNoise(5), cleared: false };
    },
    step: function (p, w, h, s, t, dt) {
      var k = .003 + .07 * smooth(w * .15, w * .78, p.x);
      p.px = p.x; p.py = p.y;
      p.x += p.v * dt * (1 + smooth(w * .5, w, p.x));
      p.y += ((s.y0 - p.y) * k + s.noise(p.x * .004, p.y * .004 + p.ph) * 1.3 * (1 - smooth(w * .3, w * .75, p.x))) * dt;
    },
    draw: function (ctx, w, h, t, s, hd, dt) {
      var i, p;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,' + (.035 * dt) + ')';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 1;
      for (i = 0; i < s.ps.length; i++) {
        p = s.ps[i];
        flow.step(p, w, h, s, t, dt);
        var near = Math.abs(p.y - s.y0) < 1.2 && p.x > w * .6;
        ctx.strokeStyle = near ? C.accent : mixGrey(.15 + p.shade * .6);
        ctx.globalAlpha = near ? 1 : .8;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        if (p.x > w + 10) s.spawn(p, false);
      }
      ctx.globalAlpha = 1;
    },
    still: function (ctx, w, h, s) { // one resolved frame: full traces, no animation
      var i, p, n;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (i = 0; i < s.ps.length; i++) {
        p = s.ps[i];
        p.x = p.px = (i % 3 === 0) ? Math.random() * w * .4 : -10;
        ctx.strokeStyle = mixGrey(.1 + p.shade * .5); ctx.globalAlpha = .55;
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
        for (n = 0; n < 900 && p.x < w + 10; n++) { flow.step(p, w, h, s, 0, 2); ctx.lineTo(p.x, p.y); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.strokeStyle = C.accent; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(w * .62, s.y0); ctx.lineTo(w, s.y0); ctx.stroke();
    }
  };

  /* ── CONTOUR LINES: topographic isolines from simplex noise ── */
  var contour = {
    animated: false,
    setup: function () { return { noise: makeNoise(11) }; },
    draw: function (ctx, w, h, t, s, hd) {
      var cell = w < 700 ? 9 : 7, cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
      var f = hd.opts.scale || .0022, v = new Float32Array(cols * rows), x, y, li;
      for (y = 0; y < rows; y++) for (x = 0; x < cols; x++) {
        v[y * cols + x] = s.noise(x * cell * f, y * cell * f) + .45 * s.noise(x * cell * f * 2.3 + 40, y * cell * f * 2.3);
      }
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = hd.opts.color || C.ruleStrong;
      var levels = [-1, -.75, -.5, -.25, 0, .25, .5, .75, 1];
      function ip(a, b, lv) { return (lv - a) / (b - a); }
      for (li = 0; li < levels.length; li++) {
        var lv = levels[li];
        ctx.beginPath();
        for (y = 0; y < rows - 1; y++) for (x = 0; x < cols - 1; x++) {
          var a = v[y * cols + x], b = v[y * cols + x + 1], c = v[(y + 1) * cols + x + 1], d = v[(y + 1) * cols + x];
          var idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
          if (idx === 0 || idx === 15) continue;
          var X = x * cell, Y = y * cell;
          var T = [X + ip(a, b, lv) * cell, Y], R = [X + cell, Y + ip(b, c, lv) * cell],
            B = [X + ip(d, c, lv) * cell, Y + cell], Lf = [X, Y + ip(a, d, lv) * cell];
          var segs;
          switch (idx) {
            case 1: case 14: segs = [Lf, B]; break;
            case 2: case 13: segs = [B, R]; break;
            case 3: case 12: segs = [Lf, R]; break;
            case 4: case 11: segs = [T, R]; break;
            case 6: case 9: segs = [T, B]; break;
            case 7: case 8: segs = [Lf, T]; break;
            case 5: segs = [Lf, T, B, R]; break;
            default: segs = [Lf, B, T, R];
          }
          for (var k = 0; k < segs.length; k += 2) { ctx.moveTo(segs[k][0], segs[k][1]); ctx.lineTo(segs[k + 1][0], segs[k + 1][1]); }
        }
        ctx.stroke();
      }
    }
  };

  /* ── CONVERGE: many lines resolving into one, around a person ── */
  var converge = {
    setup: function (w, h) {
      var r = rng(33), n = w < 500 ? 12 : 26, ls = [], i;
      for (i = 0; i < n; i++) {
        ls.push({ y: h * (.06 + .88 * (i + r() * .7) / n), c1: .18 + r() * .2, c2: .38 + r() * .12, wob: 6 + r() * 16, f: .2 + r() * .35, ph: r() * 6.28, shade: Math.pow(r(), 1.6) });
      }
      return { ls: ls, mx: w * .6, my: h * .56 };
    },
    draw: function (ctx, w, h, t, s) {
      var i, L;
      ctx.fillStyle = C.ink; ctx.fillRect(0, 0, w, h);
      // faint dot grid
      ctx.fillStyle = 'rgba(110,110,106,.35)';
      for (var gx = 16; gx < w; gx += 32) for (var gy = 16; gy < h; gy += 32) ctx.fillRect(gx, gy, 1, 1);
      ctx.lineWidth = 1;
      for (i = 0; i < s.ls.length; i++) {
        L = s.ls[i];
        var y = L.y + Math.sin(t * L.f + L.ph) * L.wob;
        var y2 = L.y + Math.cos(t * L.f * .8 + L.ph) * L.wob * 1.6;
        ctx.strokeStyle = mixGrey(.45 + L.shade * .55);
        ctx.beginPath(); ctx.moveTo(-5, y);
        ctx.bezierCurveTo(w * L.c1, y2, w * L.c2, s.my, s.mx, s.my);
        ctx.stroke();
      }
      // the one line out
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(s.mx, s.my); ctx.lineTo(w + 5, s.my); ctx.stroke();
      var px = s.mx + ((t * 90) % (w - s.mx + 60));
      ctx.fillStyle = C.accentOnInk; ctx.beginPath(); ctx.arc(px, s.my, 2.5, 0, 6.283); ctx.fill();
      // the person at the point where it resolves
      var u = Math.max(8, Math.min(w, h * 2) * .022);
      ctx.fillStyle = C.ink; ctx.strokeStyle = C.onInk; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(s.mx, s.my, u * 3.1, 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(s.mx, s.my - u * .75, u * .8, 0, 6.283); ctx.stroke();
      ctx.beginPath(); ctx.arc(s.mx, s.my + u * 2.05, u * 1.55, Math.PI * 1.13, Math.PI * 1.87); ctx.stroke();
    }
  };

  var GENERATORS = { tangle: tangle, flow: flow, contour: contour, converge: converge };

  function init() {
    grain();
    Array.prototype.forEach.call(document.querySelectorAll('[data-blueprint]'), blueprint);
    Array.prototype.forEach.call(document.querySelectorAll('canvas[data-art]'), function (cv) {
      var gen = GENERATORS[cv.getAttribute('data-art')];
      if (!gen) return;
      var opts = {};
      if (cv.dataset.color) opts.color = cv.dataset.color;
      if (cv.dataset.lineY) opts.lineY = parseFloat(cv.dataset.lineY);
      if (cv.dataset.targetX) opts.targetX = parseFloat(cv.dataset.targetX);
      if (cv.dataset.progress) opts.startProgress = parseFloat(cv.dataset.progress);
      if (cv.dataset.still != null) opts.still = true;
      var mountNow = function () {
        var h = mount(cv, gen, opts);
        if (opts.startProgress) { h.progress = opts.startProgress; h.redraw(); }
      };
      // hero art mounts straight away; everything else waits until it is nearly on screen
      if (cv.hasAttribute('data-eager') || !('IntersectionObserver' in window)) return mountNow();
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); mountNow(); }
      }, { rootMargin: '300px' });
      io.observe(cv);
    });
  }

  window.TDArt = { init: init, mount: mount, generators: GENERATORS, grain: grain, blueprint: blueprint, spineX: spineX, colors: C };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
