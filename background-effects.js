/* Background visual effects: floating formulas, particle grid,
   breathing gradient, cursor parallax.
   Self-contained: no external deps, injects its own styles, sits
   behind all content (z-index: -1, pointer-events: none). */
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__bgFxLoaded) return;
  window.__bgFxLoaded = true;

  // ---------- Config ----------
  var ACCENT = '#14E0B1';
  var ACCENT_2 = '#0EA5E9';
  var PAPER = '#051B23';

  var FORMULAS = [
    'E = mc²', '∇ × B = μ₀J + μ₀ε₀ ∂E/∂t', '∫ f(x) dx',
    'Σ aᵢ', 'λ = h/p', 'iℏ ∂ψ/∂t = Ĥψ', 'F = ma',
    'eⁱπ + 1 = 0', '∂L/∂qᵢ − d/dt(∂L/∂q̇ᵢ) = 0',
    'σ(z) = 1/(1+e⁻ᶻ)', 'P(A|B) = P(B|A)P(A)/P(B)',
    '∇²φ = 0', '∮ E·dA = Q/ε₀', 'ds² = −c²dt² + dx²',
    'ζ(s) = Σ 1/nˢ', 'lim ₓ→∞ (1+1/x)ˣ = e',
    'arg min ‖Wx − y‖²', 'softmax(zᵢ) = eᶻᶦ/Σeᶻⱼ',
    '∂J/∂θ', 'H(X) = −Σ p(x) log p(x)',
    'ℵ₀ < 2^ℵ₀', '∀ε>0 ∃δ>0', 'φ = (1+√5)/2'
  ];

  var PARTICLE_COUNT_DESKTOP = 60;
  var PARTICLE_LINK_DIST = 130;
  var PARALLAX_MAX = 20; // px

  // ---------- Capability checks ----------
  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia &&
    window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

  // ---------- Style injection ----------
  var style = document.createElement('style');
  style.setAttribute('data-bg-fx', '');
  style.textContent = [
    // Move opaque page color to <html> so a negative-z-index layer
    // inside <body> is not occluded by body's own background-color.
    'html { background-color: #051B23; }',
    'body { background-color: transparent !important; }',
    '.bg-fx {',
    '  position: fixed; inset: 0;',
    '  z-index: -1; pointer-events: none;',
    '  overflow: hidden;',
    '  contain: strict;',
    '}',
    '.bg-fx__gradient {',
    '  position: absolute; inset: -10%;',
    '  background:',
    '    radial-gradient(ellipse 60% 50% at 20% 20%, rgba(20, 224, 177, 0.18), transparent 60%),',
    '    radial-gradient(ellipse 55% 45% at 80% 75%, rgba(14, 165, 233, 0.16), transparent 60%),',
    '    radial-gradient(ellipse 40% 35% at 60% 30%, rgba(20, 224, 177, 0.10), transparent 70%);',
    '  will-change: transform, opacity;',
    '  animation: bgFxBreath 18s ease-in-out infinite alternate;',
    '  transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1);',
    '}',
    '@keyframes bgFxBreath {',
    '  0%   { transform: scale(1)    translate(0, 0);    opacity: 0.9; }',
    '  50%  { transform: scale(1.06) translate(1%, -1%); opacity: 1;   }',
    '  100% { transform: scale(1.02) translate(-1%, 1%); opacity: 0.85; }',
    '}',
    '.bg-fx__formulas {',
    '  position: absolute; inset: 0;',
    '  transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1);',
    '}',
    '.bg-fx__formula {',
    '  position: absolute;',
    '  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;',
    '  color: ' + ACCENT + ';',
    '  white-space: nowrap;',
    '  user-select: none;',
    '  will-change: transform, opacity;',
    '  text-shadow: 0 0 12px rgba(20, 224, 177, 0.25);',
    '}',
    '.bg-fx__canvas {',
    '  position: absolute; inset: 0;',
    '  width: 100%; height: 100%;',
    '  display: block;',
    '  transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1);',
    '}',
    '@media (prefers-reduced-motion: reduce) {',
    '  .bg-fx__gradient { animation: none; }',
    '  .bg-fx__formula  { animation: none !important; }',
    '  .bg-fx__gradient,',
    '  .bg-fx__formulas,',
    '  .bg-fx__canvas   { transition: none; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // ---------- Mount root ----------
  function mount() {
    var root = document.createElement('div');
    root.className = 'bg-fx';
    root.setAttribute('aria-hidden', 'true');

    var gradient = document.createElement('div');
    gradient.className = 'bg-fx__gradient';
    root.appendChild(gradient);

    var formulasLayer = document.createElement('div');
    formulasLayer.className = 'bg-fx__formulas';
    root.appendChild(formulasLayer);

    var canvas = null;
    if (!isMobile) {
      canvas = document.createElement('canvas');
      canvas.className = 'bg-fx__canvas';
      root.appendChild(canvas);
    }

    (document.body || document.documentElement).appendChild(root);
    initFormulas(formulasLayer);
    if (canvas) initParticles(canvas);
    initParallax(root, gradient, formulasLayer, canvas);
  }

  // ---------- Floating formulas ----------
  function initFormulas(layer) {
    var count = isMobile ? 6 : 12;
    var picks = FORMULAS.slice().sort(function () { return Math.random() - 0.5; }).slice(0, count);

    // Per-element keyframes registered once.
    var kfStyle = document.createElement('style');
    document.head.appendChild(kfStyle);
    var kfBuf = [];

    picks.forEach(function (text, i) {
      var el = document.createElement('span');
      el.className = 'bg-fx__formula';
      el.textContent = text;

      var startX = Math.random() * 100;
      var startY = Math.random() * 100;
      var driftX = (Math.random() - 0.5) * 30; // vw
      var driftY = (Math.random() - 0.5) * 20; // vh
      var duration = 60 + Math.random() * 80; // 60–140s
      var delay = -Math.random() * duration;  // negative = staggered start
      var opacity = 0.05 + Math.random() * 0.10;
      var size = 12 + Math.random() * 18;

      el.style.left = startX + 'vw';
      el.style.top = startY + 'vh';
      el.style.fontSize = size + 'px';
      el.style.opacity = String(opacity);
      el.style.animation = 'bgFxDrift' + i + ' ' + duration + 's linear ' + delay + 's infinite';

      kfBuf.push(
        '@keyframes bgFxDrift' + i + ' {',
        '  0%   { transform: translate(0, 0)                            rotate(0deg); }',
        '  50%  { transform: translate(' + driftX + 'vw, ' + driftY + 'vh) rotate(' + (driftX > 0 ? 3 : -3) + 'deg); }',
        '  100% { transform: translate(0, 0)                            rotate(0deg); }',
        '}'
      );
      layer.appendChild(el);
    });

    kfStyle.textContent = kfBuf.join('\n');
  }

  // ---------- Particle network ----------
  function initParticles(canvas) {
    if (reducedMotion) return; // static-only mode skips particles entirely

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0, height = 0;
    var particles = [];
    var rafId = null;
    var paused = false;

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT_DESKTOP; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1 + Math.random() * 1.5
        });
      }
    }

    function step() {
      if (paused) { rafId = null; return; }
      ctx.clearRect(0, 0, width, height);

      // update + draw dots
      ctx.fillStyle = 'rgba(20, 224, 177, 0.45)';
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width)  p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // links
      var maxD = PARTICLE_LINK_DIST;
      var maxD2 = maxD * maxD;
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            var alpha = (1 - d2 / maxD2) * 0.2;
            ctx.strokeStyle = 'rgba(20, 224, 177,' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (paused || rafId != null) return;
      rafId = requestAnimationFrame(step);
    }
    function stop() {
      if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    resize();
    seed();
    start();

    window.addEventListener('resize', function () {
      resize();
      // re-seed sparingly to keep density even
      seed();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { paused = true; stop(); }
      else { paused = false; start(); }
    });
  }

  // ---------- Cursor parallax ----------
  function initParallax(root, gradient, formulas, canvas) {
    if (reducedMotion || isMobile) return;

    var targetX = 0, targetY = 0;
    var curX = 0, curY = 0;
    var rafScheduled = false;

    function onMove(e) {
      var w = window.innerWidth || 1;
      var h = window.innerHeight || 1;
      var nx = (e.clientX / w) * 2 - 1; // -1..1
      var ny = (e.clientY / h) * 2 - 1;
      targetX = nx * PARALLAX_MAX;
      targetY = ny * PARALLAX_MAX;
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(tick);
      }
    }

    function tick() {
      rafScheduled = false;
      // ease toward target
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      // depth: gradient moves least, formulas medium, canvas most
      gradient.style.transform =
        'translate3d(' + (curX * 0.3).toFixed(2) + 'px,' + (curY * 0.3).toFixed(2) + 'px,0)';
      formulas.style.transform =
        'translate3d(' + (curX * 0.7).toFixed(2) + 'px,' + (curY * 0.7).toFixed(2) + 'px,0)';
      if (canvas) {
        canvas.style.transform =
          'translate3d(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px,0)';
      }
      if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
        rafScheduled = true;
        requestAnimationFrame(tick);
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true });
  }

  // ---------- Boot ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
