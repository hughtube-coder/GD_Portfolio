(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;

  function qsa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function motionOff() { return root.classList.contains("motion-off"); }

  /* ---------- icons: one 24px, 2px-stroke set ---------- */
  var ICONS = {
    prev: '<path d="M15 18l-6-6 6-6"/>',
    next: '<path d="M9 6l6 6-6 6"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    play: '<path d="M8 5l11 7-11 7z"/>'
  };
  function icon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + "</svg>";
  }
  function fillIcons() {
    qsa("[data-icon]").forEach(function (el) { el.innerHTML = icon(el.getAttribute("data-icon")); });
  }

  /* ---------- nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      toggle.setAttribute("aria-expanded", String(nav.classList.toggle("is-open")));
    });
  }

  /* ---------- lava-lamp side columns ---------- */
  var TEAL = "radial-gradient(circle at 32% 30%, #6df0f3, #00a3ad 45%, #007d86 78%)";
  var CORAL = "radial-gradient(circle at 32% 30%, #ffb08a, #f0592e 55%, #ae3631)";
  var BLOBS = {
    left: [
      { size: 112, left: 42, dur: 19, delay: -4, wob: 16, s0: 0.85, s1: 1.25, fill: TEAL, stat: 72 },
      { size: 70, left: 64, dur: 14, delay: -9, wob: -22, s0: 0.9, s1: 1.4, fill: CORAL, stat: 18 },
      { size: 140, left: 30, dur: 27, delay: -15, wob: 12, s0: 0.8, s1: 1.2, fill: TEAL, stat: 44 },
      { size: 56, left: 72, dur: 12, delay: -2, wob: -14, s0: 1, s1: 1.5, fill: CORAL, stat: 88 },
      { size: 96, left: 50, dur: 22, delay: -11, wob: 20, s0: 0.85, s1: 1.3, fill: TEAL, stat: 8 },
      { size: 82, left: 36, dur: 17, delay: -7, wob: -18, s0: 0.9, s1: 1.35, fill: CORAL, stat: 58 },
      { size: 124, left: 58, dur: 24, delay: -18, wob: 14, s0: 0.8, s1: 1.2, fill: TEAL, stat: 30 }
    ],
    right: [
      { size: 126, left: 55, dur: 23, delay: -12, wob: -16, s0: 0.8, s1: 1.25, fill: CORAL, stat: 60 },
      { size: 64, left: 34, dur: 13, delay: -5, wob: 20, s0: 0.95, s1: 1.45, fill: TEAL, stat: 14 },
      { size: 104, left: 46, dur: 20, delay: -16, wob: -12, s0: 0.85, s1: 1.3, fill: TEAL, stat: 80 },
      { size: 60, left: 68, dur: 11, delay: -3, wob: 16, s0: 1, s1: 1.5, fill: CORAL, stat: 36 },
      { size: 138, left: 40, dur: 28, delay: -9, wob: -14, s0: 0.8, s1: 1.2, fill: TEAL, stat: 4 },
      { size: 78, left: 60, dur: 16, delay: -13, wob: 18, s0: 0.9, s1: 1.35, fill: CORAL, stat: 70 },
      { size: 92, left: 38, dur: 21, delay: -1, wob: -20, s0: 0.85, s1: 1.3, fill: TEAL, stat: 48 }
    ]
  };
  function initLava() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
    svg.style.position = "absolute";
    // blur + alpha threshold = blobs that stretch and merge like lava
    svg.innerHTML = '<defs><filter id="goo" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"/></filter></defs>';
    document.body.appendChild(svg);

    ["left", "right"].forEach(function (side) {
      var col = document.createElement("div");
      col.className = "lava lava--" + side;
      col.setAttribute("aria-hidden", "true");
      var goo = document.createElement("div");
      goo.className = "lava-goo";
      BLOBS[side].forEach(function (b) {
        var i = document.createElement("i");
        i.style.cssText = "--size:" + b.size + "px;--left:" + b.left + "%;--dur:" + b.dur + "s;--delay:" + b.delay + "s;--wob:" + b.wob +
          "px;--s0:" + b.s0 + ";--s1:" + b.s1 + ";--static:" + b.stat + "vh;--fill:" + b.fill;
        goo.appendChild(i);
      });
      col.appendChild(goo);
      document.body.appendChild(col);
    });
  }

  /* ---------- global pause for decorative motion ---------- */
  function initMotionToggle() {
    if (reduceMotion) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "motion-toggle";
    btn.setAttribute("aria-pressed", "false");
    function paint() {
      var off = motionOff();
      btn.setAttribute("aria-pressed", String(off));
      btn.innerHTML = icon(off ? "play" : "pause") + "<span>" + (off ? "Play motion" : "Pause motion") + "</span>";
    }
    try { if (sessionStorage.getItem("motionOff") === "1") root.classList.add("motion-off"); } catch (e) { /* storage blocked */ }
    btn.addEventListener("click", function () {
      var off = root.classList.toggle("motion-off");
      try { sessionStorage.setItem("motionOff", off ? "1" : "0"); } catch (e) { /* storage blocked */ }
      paint();
      window.dispatchEvent(new Event("motionchange"));
    });
    paint();
    document.body.appendChild(btn);
  }

  /* ---------- hero: title letters, cycling intro line ---------- */
  function initHeroTitle() {
    var h1 = document.querySelector(".hero h1");
    if (!h1 || reduceMotion) return;
    var text = h1.textContent.trim();
    h1.setAttribute("aria-label", text);
    h1.textContent = "";
    var n = 0;
    text.split(" ").forEach(function (word, wi, all) {
      var w = document.createElement("span");
      w.style.display = "inline-block";
      w.setAttribute("aria-hidden", "true");
      word.split("").forEach(function (ch) {
        var s = document.createElement("span");
        s.className = "ch";
        s.style.setProperty("--i", n++);
        s.textContent = ch;
        w.appendChild(s);
      });
      h1.appendChild(w);
      if (wi < all.length - 1) h1.appendChild(document.createTextNode(" "));
    });
  }
  function initTyped() {
    var el = document.querySelector("[data-typed]");
    if (!el || reduceMotion) return;
    var words = (el.getAttribute("data-words") || "").split("|").filter(Boolean);
    if (words.length < 2) return;
    var w = 0, c = words[0].length, deleting = true;
    function tick() {
      if (motionOff()) { setTimeout(tick, 300); return; }
      c += deleting ? -1 : 1;
      el.textContent = words[w].slice(0, c);
      var delay = deleting ? 40 : 85;
      if (!deleting && c === words[w].length) { deleting = true; delay = 1600; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 2600);
  }

  function initMarquee() {
    var list = document.querySelector("[data-marquee]");
    if (!list) return;
    Array.prototype.slice.call(list.children).forEach(function (li) {
      var copy = li.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      list.appendChild(copy);
    });
  }

  /* ---------- slow scroll reveals ---------- */
  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var sel = ".pathways a, .work, .projects article, .gallery figure, .skills > div, .cert-entry, .contact-list li, main h2, main .lede, .profile > *, .end-note";
    var pending = [];

    function reveal(el) {
      if (!el.classList.contains("reveal") || el.classList.contains("is-in")) return;
      el.classList.add("is-in");
      var delay = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
      // hand control back to normal hover styles once the reveal has played
      setTimeout(function () { el.classList.remove("reveal", "is-in"); el.removeAttribute("data-dir"); el.style.removeProperty("--d"); }, 1300 + delay);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        reveal(e.target);
        io.unobserve(e.target);
        pending = pending.filter(function (el) { return el !== e.target; });
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    // Jumping down the page (anchor links, End key) can skip items entirely; show anything we scrolled past.
    function sweep() {
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().bottom < 0) { reveal(el); io.unobserve(el); return false; }
        return true;
      });
    }
    var sweeping = false;
    window.addEventListener("scroll", function () {
      if (!sweeping) { sweeping = true; requestAnimationFrame(function () { sweep(); sweeping = false; }); }
    }, { passive: true });
    window.addEventListener("load", sweep);

    qsa(sel).forEach(function (el) {
      var parent = el.parentElement;
      var idx = parent ? Array.prototype.indexOf.call(parent.children, el) : 0;
      var dir = "up";
      if (el.classList.contains("work")) dir = idx % 2 === 0 ? "left" : "right";
      else if (parent && parent.classList.contains("profile")) dir = idx === 0 ? "left" : "right";
      else if (el.matches(".gallery figure, .projects article")) dir = "zoom";
      if (dir !== "up") el.setAttribute("data-dir", dir);
      if (!el.classList.contains("work")) el.style.setProperty("--d", Math.min(idx, 6) * 120 + "ms");
      el.classList.add("reveal");
      pending.push(el);
      io.observe(el);
    });
    sweep();
  }

  /* ---------- 3D tilt on cards and images (mouse only) ---------- */
  function initTilt() {
    if (reduceMotion || !canHover) return;
    qsa(".gallery figure, .projects article, .cert-media, .work-media").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        if (motionOff()) return;
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = "transform 80ms linear";
        el.style.transform = "perspective(900px) rotateX(" + (-y * 8).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) scale(1.02)";
      });
      el.addEventListener("pointerleave", function () {
        el.style.transition = "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      });
    });
  }

  /* ---------- scroll progress + back to top ---------- */
  function initScrollUi() {
    var bar = document.querySelector(".progress");
    var top = document.querySelector(".to-top");
    var ticking = false;
    function update() {
      var y = window.scrollY || root.scrollTop;
      var h = root.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
      if (top) top.classList.toggle("is-visible", y > 500);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
    update();
  }

  /* ---------- About: slideshow ---------- */
  function initSlideshow() {
    var box = document.querySelector("[data-slideshow]");
    if (!box) return;
    var slides = qsa("[data-slideshow] .slide");
    var dotsBox = box.querySelector(".dots");
    var pauseBtn = box.querySelector(".pause");
    var index = 0, timer = null, userPaused = false;

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to photo " + (i + 1));
      b.addEventListener("click", function () { show(i); restart(); });
      dotsBox.appendChild(b);
      return b;
    });
    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
      dots.forEach(function (d, n) { d.setAttribute("aria-current", String(n === index)); });
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() {
      if (!reduceMotion && !userPaused && !motionOff() && !timer) timer = setInterval(function () { show(index + 1); }, 4500);
    }
    function restart() { stop(); start(); }

    box.querySelector(".prev").addEventListener("click", function () { show(index - 1); restart(); });
    box.querySelector(".next").addEventListener("click", function () { show(index + 1); restart(); });
    pauseBtn.addEventListener("click", function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute("aria-pressed", String(userPaused));
      pauseBtn.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
      pauseBtn.innerHTML = icon(userPaused ? "play" : "pause");
      if (userPaused) stop(); else start();
    });
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", start);
    box.addEventListener("focusin", stop);
    box.addEventListener("focusout", start);
    window.addEventListener("motionchange", function () { if (motionOff()) stop(); else start(); });
    show(0);
    start();
  }

  /* ---------- About: paged gallery kept in the URL (?page=2) ---------- */
  function initPager() {
    var gallery = document.querySelector("[data-gallery]");
    var pager = document.querySelector("[data-pager]");
    if (!gallery || !pager) return;
    var items = Array.prototype.slice.call(gallery.children);
    var perPage = Number(gallery.getAttribute("data-per-page")) || 6;
    var pages = Math.max(1, Math.ceil(items.length / perPage));

    function pageFromUrl() {
      var n = parseInt(new URLSearchParams(window.location.search).get("page"), 10);
      return n >= 1 && n <= pages ? n : 1;
    }
    function btn(content, label, onClick, state) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", label);
      b.innerHTML = content;
      if (state === "disabled") b.disabled = true;
      if (state === "current") b.setAttribute("aria-current", "page");
      b.addEventListener("click", onClick);
      return b;
    }
    function render(current) {
      items.forEach(function (el, i) { el.hidden = Math.ceil((i + 1) / perPage) !== current; });
      pager.textContent = "";
      pager.appendChild(btn(icon("prev"), "Previous page", function () { go(current - 1); }, current === 1 ? "disabled" : ""));
      for (var p = 1; p <= pages; p++) {
        (function (page) {
          pager.appendChild(btn(String(page), "Page " + page, function () { go(page); }, page === current ? "current" : ""));
        })(p);
      }
      pager.appendChild(btn(icon("next"), "Next page", function () { go(current + 1); }, current === pages ? "disabled" : ""));
    }
    function go(page) {
      var next = Math.min(Math.max(page, 1), pages);
      render(next);
      try { history.replaceState(null, "", "?page=" + next + window.location.hash); } catch (e) { /* file:// or sandboxed */ }
    }
    render(pageFromUrl());
  }

  /* ---------- lightbox (images wrapped in real buttons) ---------- */
  function initLightbox() {
    var imgs = qsa(".gallery img, .work-media img, .cert-media img");
    if (imgs.length === 0) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image preview");
    var big = document.createElement("img");
    var cap = document.createElement("p");
    var close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Close preview");
    close.innerHTML = icon("close");
    box.appendChild(big); box.appendChild(cap); box.appendChild(close);
    document.body.appendChild(box);
    var opener = null;

    function open(img, trigger) {
      opener = trigger;
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      cap.textContent = img.alt;
      box.classList.add("is-open");
      close.focus();
    }
    function shut() {
      box.classList.remove("is-open");
      if (opener) opener.focus();
    }
    imgs.forEach(function (img) {
      var trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "zoom";
      img.parentNode.insertBefore(trigger, img);
      trigger.appendChild(img);
      trigger.addEventListener("click", function () { open(img, trigger); });
    });
    box.addEventListener("click", function (e) { if (e.target !== big) shut(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("is-open")) shut();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillIcons();
    initNav();
    initLava();
    initMotionToggle();
    initHeroTitle();
    initTyped();
    initMarquee();
    initSlideshow();
    initPager();
    initLightbox();   // before reveal/tilt so they act on the wrapped images' containers
    initReveal();
    initTilt();
    initScrollUi();
  });
})();
