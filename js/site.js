/* Artem Demchenko — portfolio interactions: lightbox + scroll reveal */
(function () {
  "use strict";

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- lightbox gallery ---------- */
  function initLightbox() {
    var shots = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    if (!shots.length) return;

    var sources = shots.map(function (s) {
      return s.getAttribute("data-src") || (s.querySelector("img") && s.querySelector("img").src);
    });
    var idx = 0;

    var lb = document.createElement("div");
    lb.className = "lb";
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-nav prev" aria-label="Previous">&#8249;</button>' +
      '<img alt="Screenshot">' +
      '<button class="lb-nav next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);

    var img = lb.querySelector("img");
    var btnClose = lb.querySelector(".lb-close");
    var btnPrev = lb.querySelector(".prev");
    var btnNext = lb.querySelector(".next");

    function show(i) {
      idx = (i + sources.length) % sources.length;
      img.src = sources[idx];
    }
    function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }

    shots.forEach(function (s, i) {
      s.addEventListener("click", function (e) { e.preventDefault(); open(i); });
    });
    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () { show(idx - 1); });
    btnNext.addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- footer year ---------- */
  function initYear() {
    var y = document.querySelectorAll("[data-year]");
    y.forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () { initReveal(); initLightbox(); initYear(); });
})();
