/* Tredgold Digital — behaviour and motion.
   Motion is an enhancement: without GSAP, or under prefers-reduced-motion,
   everything below renders in its final, resolved state. */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     DIAGRAM CONFIG — "Many tools in. One system out."
     Positions are in SVG user units: [x, y, rotation°] for the scattered
     "before" state, [x, y] for the ordered "after" state. `side` + `port`
     say where each connector enters the hub card. `web` lists the node
     pairs joined by the chaotic grey connectors in stage 1.
     ───────────────────────────────────────────────────────────── */
  var DIAGRAM = {
    desktop: {
      view: [900, 640], node: [128, 44], fig: 1,
      hub: { x: 450, y: 320, w: 250, h: 204 },
      nodes: [
        { label: 'Spreadsheets', chaos: [140, 118, -8], order: [220, 54], side: 'top', port: -62 },
        { label: 'Email', chaos: [520, 58, 6], order: [450, 54], side: 'top', port: 0 },
        { label: 'Paper forms', chaos: [770, 170, -5], order: [680, 54], side: 'top', port: 62 },
        { label: 'WhatsApp', chaos: [196, 300, 5], order: [812, 320], side: 'right', port: 0 },
        { label: 'Calendar', chaos: [742, 430, 9], order: [680, 586], side: 'bottom', port: 62 },
        { label: 'CRM', chaos: [560, 566, -6], order: [450, 586], side: 'bottom', port: 0 },
        { label: 'Accounts', chaos: [300, 530, 4], order: [220, 586], side: 'bottom', port: -62 },
        { label: 'Job sheets', chaos: [96, 470, -10], order: [88, 320], side: 'left', port: 0 }
      ],
      web: [[0, 1], [0, 2], [0, 5], [1, 3], [1, 6], [2, 7], [2, 4], [3, 4], [3, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 7], [2, 6]]
    },
    mobile: { // 5 nodes, stacked vertically, routed into the hub from the left
      view: [360, 440], node: [112, 36], fig: .8,
      hub: { x: 262, y: 200, w: 150, h: 210 },
      nodes: [
        { label: 'Spreadsheets', chaos: [84, 48, -7], order: [70, 56], side: 'left', port: -72 },
        { label: 'Email', chaos: [272, 40, 6], order: [70, 128], side: 'left', port: -36 },
        { label: 'Paper forms', chaos: [66, 196, 5], order: [70, 200], side: 'left', port: 0 },
        { label: 'WhatsApp', chaos: [104, 318, -6], order: [70, 272], side: 'left', port: 36 },
        { label: 'CRM', chaos: [262, 386, 8], order: [70, 344], side: 'left', port: 72 }
      ],
      web: [[0, 1], [0, 3], [0, 4], [1, 2], [1, 3], [2, 4], [1, 4], [2, 3], [0, 2]]
    },
    labels: { hub: 'Your system', figure: 'Your team' },
    // timeline positions (the pinned scroll is scrubbed across `end`)
    stages: { discovery: .8, after: 1.8, links: 2.35, end: 3 },
    pinLength: '+=250%'
  };

  var html = document.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ── NAV ── */
  var nav = $('#nav'), menu = $('#menu'), burger = $('.nav-burger');
  var themed = $$('[data-nav]');
  var navTick = false;
  function navTheme() {
    navTick = false;
    if (!nav) return;
    var y = nav.offsetHeight / 2, theme = nav.dataset.fallback || 'light', i, r;
    for (i = 0; i < themed.length; i++) {
      r = themed[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { theme = themed[i].dataset.nav; break; }
    }
    nav.classList.toggle('nav--ink', theme === 'ink');
    nav.classList.toggle('nav--light', theme !== 'ink');
    nav.classList.toggle('nav--top', window.scrollY < 24);
  }
  window.addEventListener('scroll', function () { if (!navTick) { navTick = true; requestAnimationFrame(navTheme); } }, { passive: true });
  window.addEventListener('resize', navTheme);
  navTheme();

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    nav.classList.toggle('is-menu', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    $$('main, footer').forEach(function (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    $$('a', menu).forEach(function (a) { a.tabIndex = open ? 0 : -1; });
  }
  if (burger && menu) {
    setMenu(false);
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
    window.matchMedia('(min-width: 821px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  // in-page anchors (CSS smooth scrolling is left off because it fights pinned sections)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1), target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    var top = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top, behavior: RM ? 'auto' : 'smooth' });
    if (history.pushState) history.pushState(null, '', id === 'top' ? location.pathname : '#' + id);
    if (id !== 'top') { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  });

  /* ── CONTACT FORM (Netlify) ── */
  var form = $('#contactForm'), submitBtn = $('#submitBtn'), successMsg = $('#formSuccess');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      try {
        var formData = new FormData(form);
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        form.style.display = 'none';
        successMsg.style.display = 'block';
        requestAnimationFrame(function () {
          successMsg.classList.add('visible');
          // the card has changed height: redraw its outline
          if (html.classList.contains('motion')) window.ScrollTrigger.refresh(); else { layoutSpine(); layoutOutline(); }
        });
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message →';
        alert('Something went wrong — please try again or email us directly.');
      }
    });
  }

  /* ── PROBLEM: which item is in focus (works with or without GSAP) ── */
  var problem = $('.problem'), pItems = $$('.problem-item'), scenes = $$('.problem-panel .scene'), pIdx = $('.panel-idx');
  function setProblem(i) {
    pItems.forEach(function (el, n) { el.classList.toggle('is-active', n === i); });
    scenes.forEach(function (el, n) { el.classList.toggle('is-active', n === i); });
    if (pIdx) pIdx.textContent = '0' + (i + 1);
  }
  if (problem && 'IntersectionObserver' in window) {
    var pio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) setProblem(pItems.indexOf(en.target)); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    pItems.forEach(function (el) { pio.observe(el); });
    // dim the items that aren't in focus only while the list is actually being read
    new IntersectionObserver(function (es) { problem.classList.toggle('is-live', es[0].isIntersecting); },
      { rootMargin: '-45% 0px -45% 0px' }).observe($('.problem-list'));
  }

  /* ── MARQUEE: strike each word through as it passes centre ── */
  var marquee = $('.marquee');
  if (marquee && !RM && 'IntersectionObserver' in window) {
    var mItems = $$('.marquee-item', marquee), mTimer = 0;
    var strike = function () {
      var mid = window.innerWidth / 2;
      mItems.forEach(function (it) {
        var r = it.getBoundingClientRect();
        if (r.right < -20) it.classList.remove('is-struck');
        else if (r.left + r.width / 2 < mid) it.classList.add('is-struck');
        else it.classList.remove('is-struck');
      });
    };
    new IntersectionObserver(function (es) {
      clearInterval(mTimer);
      if (es[0].isIntersecting) { strike(); mTimer = setInterval(strike, 140); }
    }).observe(marquee);
  }

  /* ── DIAGRAM builder ── */
  var NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name), k;
    for (k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function linkPath(node, cfg) {
    var h = cfg.hub, nw = cfg.node[0] / 2, nh = cfg.node[1] / 2, x = node.order[0], y = node.order[1];
    var L = h.x - h.w / 2, R = h.x + h.w / 2, T = h.y - h.h / 2, B = h.y + h.h / 2, px, py, mid;
    if (node.side === 'top' || node.side === 'bottom') {
      var top = node.side === 'top', y0 = top ? y + nh : y - nh, y1 = top ? T : B;
      px = h.x + node.port; mid = Math.round((y0 + y1) / 2);
      return px === x ? 'M' + x + ' ' + y0 + 'V' + y1 : 'M' + x + ' ' + y0 + 'V' + mid + 'H' + px + 'V' + y1;
    }
    var left = node.side === 'left', x0 = left ? x + nw : x - nw, x1 = left ? L : R;
    py = h.y + node.port; mid = Math.round((x0 + x1) / 2);
    return py === y ? 'M' + x0 + ' ' + y + 'H' + x1 : 'M' + x0 + ' ' + y + 'H' + mid + 'V' + py + 'H' + x1;
  }
  function buildDiagram(svg, cfg) {
    var h = cfg.hub, f = cfg.fig, nw = cfg.node[0], nh = cfg.node[1], d = {};
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 ' + cfg.view[0] + ' ' + cfg.view[1]);

    d.web = el('g', { 'class': 'dg-web' }, svg);
    cfg.web.forEach(function (pr, i) {
      var a = cfg.nodes[pr[0]].chaos, b = cfg.nodes[pr[1]].chaos;
      var bulge = (((i * 37) % 9) - 4) / 4 * .3;
      var cx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bulge, cy = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bulge;
      var p = el('path', { d: 'M' + a[0] + ' ' + a[1] + 'Q' + Math.round(cx) + ' ' + Math.round(cy) + ' ' + b[0] + ' ' + b[1] }, d.web);
      if (i % 3 === 1) p.setAttribute('stroke-dasharray', '3 7');
      if (i % 2 === 0) { p.setAttribute('class', 'flick'); p.style.animationDelay = (-(i * .47) % 2.8) + 's'; p.style.animationDuration = (2.2 + (i % 4) * .6) + 's'; }
    });

    d.rings = el('g', { 'class': 'dg-rings' }, svg);
    [58, 92, 126].forEach(function (r) { el('circle', { 'class': 'dg-ring', cx: h.x, cy: h.y, r: Math.round(r * f) }, d.rings); });

    d.links = cfg.nodes.map(function (n) { return el('path', { 'class': 'dg-link', d: linkPath(n, cfg) }, svg); });

    d.card = el('rect', { 'class': 'dg-hub-card', x: h.x - h.w / 2, y: h.y - h.h / 2, width: h.w, height: h.h, rx: 3 }, svg);
    d.hubLabel = el('text', { 'class': 'dg-label', x: h.x - h.w / 2 + 16, y: h.y - h.h / 2 + 27 }, svg);
    d.hubLabel.textContent = DIAGRAM.labels.hub;

    d.figure = el('g', {}, svg);
    el('circle', { 'class': 'dg-figure', cx: h.x, cy: h.y - 22 * f, r: 15 * f }, d.figure);
    el('path', { 'class': 'dg-figure', d: 'M' + (h.x - 28 * f) + ' ' + (h.y + 34 * f) + 'a' + 28 * f + ' ' + 28 * f + ' 0 0 1 ' + 56 * f + ' 0' }, d.figure);
    var fl = el('text', { 'class': 'dg-label', x: h.x, y: h.y + 62 * f, 'text-anchor': 'middle' }, d.figure);
    fl.textContent = DIAGRAM.labels.figure;

    d.pulses = d.links.map(function () { return el('circle', { 'class': 'dg-pulse', r: 3, cx: 0, cy: 0, opacity: 0 }, svg); });

    d.nodes = cfg.nodes.map(function (n) {
      var g = el('g', { 'class': 'dg-node' }, svg);
      el('rect', { x: -nw / 2, y: -nh / 2, width: nw, height: nh, rx: 3 }, g);
      var t = el('text', { x: 0, y: 0, dy: '.35em', 'text-anchor': 'middle' }, g);
      t.textContent = n.label;
      return g;
    });
    d.state = cfg.nodes.map(function () { return { p: 0 }; });
    d.render = function () {
      cfg.nodes.forEach(function (n, i) {
        var p = d.state[i].p, c = n.chaos, o = n.order;
        d.nodes[i].setAttribute('transform', 'translate(' + (c[0] + (o[0] - c[0]) * p).toFixed(1) + ' ' + (c[1] + (o[1] - c[1]) * p).toFixed(1) + ') rotate(' + (c[2] * (1 - p)).toFixed(2) + ')');
      });
    };
    d.render();
    return d;
  }
  function resolveDiagram(d) { // the final "after" state, used when there is no motion
    d.state.forEach(function (s) { s.p = 1; });
    d.render();
    d.web.style.display = 'none';
    d.rings.style.display = 'none';
  }

  /* ── static mode: no GSAP, or reduced motion ── */
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  var svg = $('#diagram');
  var spine = $('.spine'), contact = $('.contact'), card = $('.form-card'), outline = $('.contact-outline path');

  function spineX() { return window.TDArt ? window.TDArt.spineX() : 0; }
  function layoutSpine() {
    if (!spine) return null;
    var hero = $('.hero'), main = $('main');
    if (!hero || !contact) { spine.style.display = 'none'; return null; }
    var mTop = main.getBoundingClientRect().top + window.scrollY;
    var top = hero.getBoundingClientRect().bottom + window.scrollY - mTop;
    var end = contact.getBoundingClientRect().top + window.scrollY - mTop;
    spine.style.top = top + 'px'; spine.style.height = Math.max(0, end - top) + 'px';
    return { top: top + mTop, height: end - top };
  }
  function layoutOutline() {
    if (!outline || !card) return 0;
    var s = contact.getBoundingClientRect(), c = card.getBoundingClientRect();
    var sx = spineX(), l = c.left - s.left + .75, t = c.top - s.top + .75, r = c.right - s.left - .75, b = c.bottom - s.top - .75;
    outline.setAttribute('d', 'M' + sx + ' 0V' + t + 'H' + r + 'V' + b + 'H' + l + 'V' + t);
    contact.classList.add('is-drawn');
    return outline.getTotalLength();
  }

  function staticMode() {
    if (svg) resolveDiagram(buildDiagram(svg, window.innerWidth < 768 ? DIAGRAM.mobile : DIAGRAM.desktop));
    var lay = function () { layoutSpine(); layoutOutline(); };
    lay();
    window.addEventListener('resize', lay);
    window.addEventListener('load', lay);
  }

  if (!gsap || !ScrollTrigger || RM) { staticMode(); return; }

  /* ─────────────────────────────────────────────────────────────
     MOTION
     ───────────────────────────────────────────────────────────── */
  html.classList.add('motion');
  gsap.registerPlugin(ScrollTrigger);
  if (window.MotionPathPlugin) gsap.registerPlugin(window.MotionPathPlugin);
  gsap.defaults({ ease: 'power3.out', duration: .9 });
  var mm = gsap.matchMedia();

  /* line-mask reveal: split a heading into its rendered lines */
  function splitLines(node) {
    var text = node._text || (node._text = node.textContent.trim().replace(/\s+/g, ' '));
    node.textContent = '';
    var words = text.split(' ').map(function (w) {
      var s = document.createElement('span'); s.style.display = 'inline-block'; s.textContent = w;
      node.appendChild(s); node.appendChild(document.createTextNode(' '));
      return s;
    });
    var lines = [], top = null, cur;
    words.forEach(function (s) {
      if (top === null || Math.abs(s.offsetTop - top) > 4) { cur = []; lines.push(cur); top = s.offsetTop; }
      cur.push(s.textContent);
    });
    node.textContent = '';
    return lines.map(function (ws) {
      var o = document.createElement('span'), i = document.createElement('span');
      o.className = 'split-line'; i.textContent = ws.join(' ');
      o.appendChild(i); node.appendChild(o); node.appendChild(document.createTextNode(' '));
      return i;
    });
  }
  var splits = $$('[data-split]');
  function applySplits() {
    splits.forEach(function (node) {
      node._lines = splitLines(node);
      if (!node._shown) gsap.set(node._lines, { yPercent: 112 });
    });
  }
  function showSplit(node, delay) {
    if (node._shown) return;
    node._shown = true;
    gsap.to(node._lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .08, delay: delay || 0 });
  }

  function init() {
    applySplits();

    /* pinned sections first, so everything below them measures correctly */
    setupDiagram();
    setupHow();

    /* hero: tangle pulls taut over the first screen; three parallax depths */
    var hero = $('.hero'), heroCv = $('.hero-canvas');
    if (hero && heroCv && hero.id === 'top') {
      var hp = { p: 0 };
      gsap.to(hp, {
        p: 1, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: function () { return '+=' + hero.offsetHeight * .85; }, scrub: .6 },
        onUpdate: function () { if (heroCv._art) heroCv._art.progress = hp.p; }
      });
      var par = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(heroCv, { yPercent: 10, ease: 'none', scrollTrigger: par });
      gsap.to('.hero-h1', { yPercent: -9, ease: 'none', scrollTrigger: par });
      gsap.to('.hero-foot', { yPercent: -15, ease: 'none', scrollTrigger: par });
    }

    /* spine: one cobalt line drawn down the page by scroll progress */
    var fill = spine && $('i', spine), sp = null;
    if (fill) {
      var drawSpine = function () {
        if (!sp) return;
        var tip = window.scrollY + window.innerHeight * .6;
        fill.style.transform = 'scaleY(' + clamp((tip - sp.top) / sp.height, 0, 1).toFixed(4) + ')';
      };
      ScrollTrigger.addEventListener('refresh', function () { sp = layoutSpine(); drawSpine(); });
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: drawSpine });
    }

    /* contact: the spine turns along the rule and draws the form card */
    if (outline && card) {
      var len = 0, op = { p: 0 };
      var drawOutline = function () { outline.style.strokeDasharray = len; outline.style.strokeDashoffset = (len * (1 - op.p)).toFixed(1); };
      ScrollTrigger.addEventListener('refresh', function () { len = layoutOutline(); drawOutline(); });
      gsap.to(op, { p: 1, ease: 'none', onUpdate: drawOutline, scrollTrigger: { trigger: contact, start: 'top 60%', end: 'bottom bottom', scrub: .6 } });
    }

    /* reveals */
    splits.forEach(function (node) {
      if (node.closest('.how') && window.matchMedia('(min-width: 900px) and (min-height: 640px)').matches) return; // handled by the pin
      ScrollTrigger.create({ trigger: node, start: 'top 88%', once: true, onEnter: function () { showSplit(node); } });
    });
    var rises = $$('[data-rise]');
    gsap.set(rises, { opacity: 0, y: 24 });
    ScrollTrigger.batch(rises, {
      start: 'top 80%', once: true,
      onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: .9, stagger: .06, overwrite: true }); }
    });
    $$('[data-curtain]').forEach(function (node) {
      gsap.fromTo(node, { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', clearProps: 'clipPath',
        scrollTrigger: { trigger: node, start: 'top 85%', once: true }
      });
    });

    setupPointer();

    /* re-split headings when the width changes */
    var lastW = window.innerWidth, rt = 0;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(rt);
      rt = setTimeout(function () { applySplits(); ScrollTrigger.refresh(); }, 200);
    });

    ScrollTrigger.refresh();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });

    // arriving with a hash (e.g. from /products): the pins have changed the page length
    if (location.hash.length > 1) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
    }
  }

  /* ── diagram: pinned, three stages scrubbed by scroll ── */
  function setupDiagram() {
    var section = $('.diagram');
    if (!section || !svg) return;
    var caps = $$('.dg-cap', section), steps = $$('.dg-steps i', section);

    var run = function (cfg) {
      var d = buildDiagram(svg, cfg), S = DIAGRAM.stages, stage = -1, pulsing = false;
      var lens = d.links.map(function (p) { return p.getTotalLength(); });
      var cardLen = 2 * (cfg.hub.w + cfg.hub.h);

      gsap.set(caps, { autoAlpha: 0, y: 16 }); gsap.set(caps[0], { autoAlpha: 1, y: 0 });
      gsap.set(d.figure, { opacity: 0 });
      gsap.set(d.rings, { opacity: 0 });
      gsap.set(d.hubLabel, { opacity: 0 });
      gsap.set(d.card, { strokeDasharray: cardLen, strokeDashoffset: cardLen, fillOpacity: 0 });
      d.links.forEach(function (p, i) { gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }); });

      var pulses = [];
      if (window.MotionPathPlugin) {
        pulses = d.pulses.map(function (dot, i) {
          return gsap.to(dot, { motionPath: { path: d.links[i], align: d.links[i], alignOrigin: [.5, .5] }, duration: 1.4 + lens[i] / 260, ease: 'none', repeat: -1, repeatDelay: .5, delay: i * .23, paused: true });
        });
      }
      var setPulsing = function (on) {
        if (on === pulsing) return;
        pulsing = on;
        pulses.forEach(function (t) { if (on) t.play(); else t.pause(); });
        gsap.to(d.pulses, { opacity: on ? 1 : 0, duration: .3, overwrite: true });
      };
      var setStage = function (time) {
        var s = time < S.discovery + .15 ? 0 : time < S.after + .15 ? 1 : 2;
        if (s !== stage) { stage = s; steps.forEach(function (n, i) { n.classList.toggle('is-on', i <= s); }); d.rings.classList.toggle('is-on', s === 1); }
        setPulsing(time > S.end - .12);
      };

      var tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section, pin: true, start: 'top top', end: DIAGRAM.pinLength, scrub: .6, refreshPriority: 2,
          onUpdate: function () { setStage(tl.time()); }
        }
      });
      tl.to(d.web, { opacity: .16, duration: .5 }, S.discovery)
        .to(caps[0], { autoAlpha: 0, y: -16, duration: .25 }, S.discovery)
        .to(caps[1], { autoAlpha: 1, y: 0, duration: .3 }, S.discovery + .2)
        .to(d.rings, { opacity: 1, duration: .3 }, S.discovery + .1)
        .to(d.figure, { opacity: 1, duration: .4 }, S.discovery + .1)
        .to(d.web, { opacity: 0, duration: .35 }, S.after)
        .to(d.rings, { opacity: 0, duration: .35 }, S.after)
        .to(caps[1], { autoAlpha: 0, y: -16, duration: .25 }, S.after)
        .to(caps[2], { autoAlpha: 1, y: 0, duration: .3 }, S.after + .2)
        .to(d.state, { p: 1, duration: .7, stagger: .03, ease: 'power3.inOut', onUpdate: d.render }, S.after)
        .to(d.card, { strokeDashoffset: 0, fillOpacity: 1, duration: .5 }, S.after + .25)
        .to(d.hubLabel, { opacity: 1, duration: .25 }, S.after + .5)
        .to(d.links, { strokeDashoffset: 0, duration: .45, stagger: .035, ease: 'power2.out' }, S.links)
        .to({}, { duration: .01 }, S.end);

      return function () { pulses.forEach(function (t) { t.kill(); }); gsap.set(caps, { clearProps: 'all' }); };
    };
    mm.add('(min-width: 768px)', function () { return run(DIAGRAM.desktop); });
    mm.add('(max-width: 767px)', function () { return run(DIAGRAM.mobile); });
  }

  /* ── how we work: pinned horizontal scroll, two parallel tracks ── */
  function setupHow() {
    var how = $('.how');
    if (!how) return;
    var track = $('.how-track', how), build = $('.how-build', how), stages = $$('.stage', how), head = $('.how-head .h2', how);

    mm.add('(min-width: 900px) and (min-height: 640px)', function () {
      var dist = function () { return Math.max(0, track.offsetWidth - window.innerWidth); };
      gsap.set(build, { scaleX: 0, scaleY: 1 });
      var tween = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: how, pin: true, start: 'top top', end: function () { return '+=' + dist(); },
          scrub: .6, invalidateOnRefresh: true, refreshPriority: 1,
          onUpdate: function (self) { build.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')'; },
          onEnter: function () { showSplit(head); }
        }
      });
      ScrollTrigger.create({ trigger: how, start: 'top 70%', once: true, onEnter: function () { showSplit(head); } });
      stages.forEach(function (st, i) {
        var parts = $$('.stage-top, .stage-body', st);
        if (i === 0) {
          gsap.from(parts, { opacity: 0, y: 24, stagger: .08, scrollTrigger: { trigger: how, start: 'top 55%', once: true } });
        } else {
          gsap.from(parts, { opacity: 0, y: 24, stagger: .08, scrollTrigger: { trigger: st, containerAnimation: tween, start: 'left 82%', toggleActions: 'play none none none' } });
        }
      });
      return function () { gsap.set([track, build], { clearProps: 'transform' }); };
    });

    mm.add('(max-width: 899px), (max-height: 639px)', function () {
      var bp = { p: 0 };
      build.style.transform = 'scaleY(0)';
      gsap.to(bp, {
        p: 1, ease: 'none', onUpdate: function () { build.style.transform = 'scaleY(' + bp.p.toFixed(4) + ')'; },
        scrollTrigger: { trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: .6 }
      });
      stages.forEach(function (st) {
        gsap.from($$('.stage-top, .stage-body', st), { opacity: 0, y: 24, stagger: .08, scrollTrigger: { trigger: st, start: 'top 80%', once: true } });
      });
      return function () { build.style.transform = ''; };
    });
  }

  /* ── pointer niceties: magnetic CTAs and the "Visit" cursor label ── */
  function setupPointer() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    $$('[data-magnetic]').forEach(function (b) {
      var pull = 9;
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: ((e.clientX - r.left) / r.width - .5) * 2 * pull, y: ((e.clientY - r.top) / r.height - .5) * 2 * pull, duration: .4, overwrite: 'auto' });
      });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'expo.out', overwrite: 'auto' }); });
    });

    var label = $('.cursor-label'), targets = $$('[data-cursor]');
    if (label && targets.length) {
      var xTo = gsap.quickTo(label, 'x', { duration: .35, ease: 'power3' }), yTo = gsap.quickTo(label, 'y', { duration: .35, ease: 'power3' });
      targets.forEach(function (t) {
        t.addEventListener('mouseenter', function (e) { gsap.set(label, { x: e.clientX, y: e.clientY }); gsap.to(label, { opacity: 1, scale: 1, duration: .35, overwrite: 'auto' }); });
        t.addEventListener('mousemove', function (e) { xTo(e.clientX); yTo(e.clientY); });
        t.addEventListener('mouseleave', function () { gsap.to(label, { opacity: 0, scale: .4, duration: .3, overwrite: 'auto' }); });
      });
    }
  }

  // wait for the display font so headings are split on their real line breaks
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([ready, new Promise(function (r) { setTimeout(r, 1500); })]).then(init);
})();
