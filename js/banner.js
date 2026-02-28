/* =============================================================
   Y.A.M. BANNER — Animation, Shatter, Dismiss, localStorage
   ============================================================= */
(function() {
  'use strict';

  /* =============================================================
     CONFIG
     ============================================================= */
  const NOW_OPEN = true; // Set to true when Y.A.M. officially opens
  const STORAGE_KEY = 'yam-banner-dismissed-permanently';

  /* =============================================================
     LOCALSTORAGE GUARD — bail early if user opted out
     ============================================================= */
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    var overlayEarly = document.getElementById('yam-overlay');
    if (overlayEarly) overlayEarly.remove();
    return;
  }

  /* =============================================================
     DOM REFERENCES
     ============================================================= */
  var overlay    = document.getElementById('yam-overlay');
  var backdrop   = document.getElementById('yam-backdrop');
  var newspaper  = document.getElementById('yam-newspaper');
  var dismissBtn = document.getElementById('yam-dismiss');
  var comingSoon = document.getElementById('coming-soon');
  var nowOpen    = document.getElementById('now-open');
  var dateBanner = document.getElementById('date-banner');
  var noRepeatLabel = document.getElementById('yam-no-repeat');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =============================================================
     IMAGE FALLBACKS
     ============================================================= */
  var yamLogoImg = document.getElementById('yam-logo-img');
  if (yamLogoImg) {
    yamLogoImg.addEventListener('error', function() {
      this.style.display = 'none';
      var fb = document.getElementById('yam-logo-fallback');
      if (fb) fb.style.display = 'flex';
    });
  }

  var nteLogoImg = document.getElementById('nte-logo-img');
  if (nteLogoImg) {
    nteLogoImg.addEventListener('error', function() {
      this.style.display = 'none';
      var fb = document.getElementById('nte-logo-fallback');
      if (fb) fb.style.display = 'block';
    });
  }

  /* =============================================================
     FOCUS TRAP
     ============================================================= */
  function trapFocus() {
    dismissBtn.focus();
    overlay.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        dismissBtn.focus();
      }
      if (e.key === 'Escape') {
        dismiss();
      }
    });
  }

  /* =============================================================
     SHARD GENERATION (Voronoi-like grid tessellation)
     ============================================================= */
  function generateShards(sourceEl) {
    var isMobile = window.innerWidth < 768;
    var cols = isMobile ? 5 : 7;
    var rows = isMobile ? 3 : 5;

    var pts = [];
    for (var r = 0; r <= rows; r++) {
      pts[r] = [];
      for (var c = 0; c <= cols; c++) {
        var px = (c / cols) * 100;
        var py = (r / rows) * 100;
        if (r > 0 && r < rows && c > 0 && c < cols) {
          px += (Math.random() - 0.5) * (100 / cols) * 0.65;
          py += (Math.random() - 0.5) * (100 / rows) * 0.65;
        }
        px = Math.max(0, Math.min(100, px));
        py = Math.max(0, Math.min(100, py));
        pts[r][c] = { x: px, y: py };
      }
    }

    var shards = [];

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var tl = pts[r][c];
        var tr = pts[r][c + 1];
        var bl = pts[r + 1][c];
        var br = pts[r + 1][c + 1];

        var triangles;
        if (Math.random() > 0.5) {
          triangles = [[tl, tr, br], [tl, br, bl]];
        } else {
          triangles = [[tl, tr, bl], [tr, br, bl]];
        }

        triangles.forEach(function(tri) {
          var cx = (tri[0].x + tri[1].x + tri[2].x) / 3;
          var cy = (tri[0].y + tri[1].y + tri[2].y) / 3;

          var angle = Math.atan2(cy - 50, cx - 50);
          var dist  = 150 + Math.random() * 350;
          var tx    = Math.cos(angle) * dist + (Math.random() - 0.5) * 150;
          var ty    = Math.sin(angle) * dist + Math.random() * 200 + 50;
          var rz    = (Math.random() - 0.5) * 600;
          var rx    = (Math.random() - 0.5) * 300;
          var delay = Math.random() * 0.12;
          var dur   = 0.55 + Math.random() * 0.45;

          var clipPath = 'polygon(' + tri.map(function(p) { return p.x.toFixed(2) + '% ' + p.y.toFixed(2) + '%'; }).join(', ') + ')';

          shards.push({ clipPath: clipPath, tx: tx, ty: ty, rz: rz, rx: rx, delay: delay, dur: dur });
        });
      }
    }

    return shards;
  }

  /* =============================================================
     CREATE CRACK LINES
     ============================================================= */
  function createCracks(containerEl) {
    var crackCount = 12;
    var w = containerEl.offsetWidth;
    var h = containerEl.offsetHeight;
    var cx = w / 2;
    var cy = h / 2;

    var crackOverlay = document.createElement('div');
    crackOverlay.className = 'crack-overlay';
    crackOverlay.style.position = 'absolute';
    crackOverlay.style.top = '0';
    crackOverlay.style.left = '0';
    crackOverlay.style.width = '100%';
    crackOverlay.style.height = '100%';
    crackOverlay.style.zIndex = '5';
    crackOverlay.style.pointerEvents = 'none';

    for (var i = 0; i < crackCount; i++) {
      var crack = document.createElement('div');
      crack.className = 'crack-line';
      var angle = (i / crackCount) * 360 + (Math.random() - 0.5) * 25;
      var length = Math.max(w, h) * (0.5 + Math.random() * 0.5);
      crack.style.left = cx + 'px';
      crack.style.top = cy + 'px';
      crack.style.width = length + 'px';
      crack.style.background = 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.1) 100%)';
      crack.style.transform = 'rotate(' + angle + 'deg) scaleX(0)';
      crack.style.animationDelay = (Math.random() * 0.15) + 's';
      requestAnimationFrame(function(c) { return function() { c.classList.add('animate'); }; }(crack));
      crackOverlay.appendChild(crack);
    }

    containerEl.style.position = 'relative';
    containerEl.appendChild(crackOverlay);

    return crackOverlay;
  }

  /* =============================================================
     TRIGGER SHATTER SEQUENCE
     ============================================================= */
  function triggerShatter() {
    if (prefersReducedMotion) {
      comingSoon.style.display = 'none';
      nowOpen.classList.add('revealed');
      showDismiss();
      return;
    }

    var rect = comingSoon.getBoundingClientRect();
    var styles = window.getComputedStyle(comingSoon);

    // Phase 1: Cracks
    var crackOverlay = createCracks(comingSoon);

    // Phase 2: Burst (after cracks finish)
    setTimeout(function() {
      var shardData = generateShards(comingSoon);

      var shardContainer = document.createElement('div');
      shardContainer.className = 'shard-container';
      shardContainer.style.position = 'fixed';
      shardContainer.style.left = rect.left + 'px';
      shardContainer.style.top = rect.top + 'px';
      shardContainer.style.width = rect.width + 'px';
      shardContainer.style.height = rect.height + 'px';
      shardContainer.style.zIndex = '100000';
      shardContainer.style.overflow = 'visible';
      shardContainer.style.pointerEvents = 'none';

      var bg = styles.background;
      var color = styles.color;
      var font = styles.font;
      var ls = styles.letterSpacing;
      var textContent = comingSoon.textContent;

      shardData.forEach(function(s) {
        var shard = document.createElement('div');
        shard.className = 'shard';
        shard.style.clipPath = s.clipPath;
        shard.style.background = bg;
        shard.style.color = color;
        shard.style.font = font;
        shard.style.letterSpacing = ls;
        shard.style.display = 'flex';
        shard.style.alignItems = 'center';
        shard.style.justifyContent = 'center';
        shard.style.setProperty('--tx', s.tx + 'px');
        shard.style.setProperty('--ty', s.ty + 'px');
        shard.style.setProperty('--rz', s.rz + 'deg');
        shard.style.setProperty('--rx', s.rx + 'deg');
        shard.style.setProperty('--delay', s.delay + 's');
        shard.style.setProperty('--duration', s.dur + 's');
        shard.textContent = textContent;
        shardContainer.appendChild(shard);
      });

      overlay.appendChild(shardContainer);

      comingSoon.style.visibility = 'hidden';
      if (crackOverlay.parentNode) crackOverlay.remove();

      requestAnimationFrame(function() {
        shardContainer.querySelectorAll('.shard').forEach(function(s) { s.classList.add('burst'); });
      });

      // Screen shake
      newspaper.classList.add('shake');
      setTimeout(function() { newspaper.classList.remove('shake'); }, 200);

      // Shockwave
      createShockwave(rect);

      // Reveal "NOW OPEN" after shards start clearing
      setTimeout(function() {
        nowOpen.classList.add('revealed');
        createSparkles(rect);
      }, 250);

      // Clean up shards & show dismiss
      setTimeout(function() {
        if (shardContainer.parentNode) shardContainer.remove();
        showDismiss();
      }, 1200);

    }, 350);
  }

  /* =============================================================
     SHOCKWAVE
     ============================================================= */
  function createShockwave(originRect) {
    var cx = originRect.left + originRect.width / 2;
    var cy = originRect.top + originRect.height / 2;
    var size = Math.max(window.innerWidth, window.innerHeight) * 0.8;

    var wave = document.createElement('div');
    wave.className = 'shockwave';
    wave.style.left = (cx - size / 2) + 'px';
    wave.style.top = (cy - size / 2) + 'px';
    wave.style.width = size + 'px';
    wave.style.height = size + 'px';
    overlay.appendChild(wave);

    var wave2 = wave.cloneNode();
    wave2.style.animationDelay = '0.08s';
    wave2.style.borderColor = 'rgba(255, 180, 50, 0.3)';
    overlay.appendChild(wave2);

    setTimeout(function() {
      wave.remove();
      wave2.remove();
    }, 800);
  }

  /* =============================================================
     SPARKLES
     ============================================================= */
  function createSparkles(originRect) {
    var cx = originRect.left + originRect.width / 2;
    var cy = originRect.top + originRect.height / 2;
    var count = window.innerWidth < 768 ? 10 : 18;

    for (var i = 0; i < count; i++) {
      var spark = document.createElement('div');
      spark.className = 'sparkle';

      var x = cx + (Math.random() - 0.5) * originRect.width * 1.5;
      var y = cy + (Math.random() - 0.5) * originRect.height * 3;
      var size = 2 + Math.random() * 5;
      var hue = Math.random() > 0.5 ? '40' : '0';
      var dur = 0.5 + Math.random() * 0.8;
      var delay = Math.random() * 0.4;
      var drift = 10 + Math.random() * 30;

      spark.style.left = x + 'px';
      spark.style.top = y + 'px';
      spark.style.width = size + 'px';
      spark.style.height = size + 'px';
      spark.style.background = 'radial-gradient(circle, hsla(' + hue + ', 90%, 60%, 1), hsla(' + hue + ', 90%, 50%, 0.4))';
      spark.style.boxShadow = '0 0 ' + size + 'px hsla(' + hue + ', 90%, 60%, 0.6)';
      spark.style.setProperty('--sparkle-dur', dur + 's');
      spark.style.setProperty('--sparkle-delay', delay + 's');
      spark.style.setProperty('--sparkle-drift', drift + 'px');

      overlay.appendChild(spark);

      setTimeout(function(el) { return function() { el.remove(); }; }(spark), (dur + delay) * 1000 + 100);
    }
  }

  /* =============================================================
     SHOW DISMISS BUTTON + "DON'T SHOW AGAIN"
     ============================================================= */
  function showDismiss() {
    dismissBtn.classList.add('visible');
    if (noRepeatLabel) noRepeatLabel.classList.add('visible');
    trapFocus();
  }

  /* =============================================================
     DISMISS
     ============================================================= */
  function dismiss() {
    if (newspaper.classList.contains('np-exit')) return;

    // Save "don't show again" preference
    var foreverCheckbox = document.getElementById('yam-dismiss-forever');
    if (foreverCheckbox && foreverCheckbox.checked) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }

    newspaper.classList.remove('np-bounce', 'shake');
    newspaper.style.animation = 'none';
    void newspaper.offsetHeight;
    newspaper.style.animation = '';

    newspaper.classList.add('np-exit');
    backdrop.classList.add('bd-exit');

    newspaper.addEventListener('animationend', function handler(e) {
      if (e.animationName === 'newspaperExit') {
        overlay.remove();
        newspaper.removeEventListener('animationend', handler);
      }
    });

    setTimeout(function() {
      if (overlay.parentNode) overlay.remove();
    }, 1000);
  }

  /* =============================================================
     MAIN SEQUENCE
     ============================================================= */
  function init() {
    if (prefersReducedMotion) {
      newspaper.style.opacity = '1';
      newspaper.style.transform = 'scale(1) rotate(0)';
      newspaper.classList.add('np-enter');

      setTimeout(function() {
        if (NOW_OPEN) {
          comingSoon.style.display = 'none';
          nowOpen.classList.add('revealed');
        }
        showDismiss();
      }, 600);

      dismissBtn.addEventListener('click', dismiss);
      return;
    }

    requestAnimationFrame(function() {
      newspaper.classList.add('np-enter');
    });

    newspaper.addEventListener('animationend', function handler(e) {
      if (e.animationName === 'newspaperSpin') {
        newspaper.removeEventListener('animationend', handler);

        newspaper.style.opacity = '1';
        newspaper.style.transform = 'scale(1) rotate(0deg)';
        newspaper.classList.remove('np-enter');

        requestAnimationFrame(function() {
          newspaper.classList.add('np-bounce');
        });

        newspaper.addEventListener('animationend', function bounceHandler(e2) {
          if (e2.animationName === 'newspaperBounce') {
            newspaper.removeEventListener('animationend', bounceHandler);
            newspaper.classList.remove('np-bounce');
            onLanded();
          }
        });
      }
    });

    dismissBtn.addEventListener('click', dismiss);
  }

  function onLanded() {
    if (NOW_OPEN) {
      setTimeout(triggerShatter, 2000);
    } else {
      setTimeout(showDismiss, 500);
    }
  }

  /* =============================================================
     LAUNCH
     ============================================================= */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
