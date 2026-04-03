/* ═══════════════════════════════════════════════════
   T3 BRAND PLAYBOOK — Interactions
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Scroll Spy ──────────────────────────────── */
  function initScrollSpy() {
    const links = document.querySelectorAll('.nav-link');
    const sections = [];

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var target = document.getElementById(href.slice(1));
        if (target) sections.push({ el: target, link: link });
      }
    });

    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (match) match.link.classList.add('is-active');
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(function (s) { observer.observe(s.el); });
  }

  /* ── 2. Color Swatch Copy ───────────────────────── */
  function initSwatchCopy() {
    document.querySelectorAll('.swatch-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var hex = card.getAttribute('data-hex');
        if (!hex) return;

        var tooltip = card.querySelector('.swatch-card__tooltip');

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(hex).then(function () {
            showTooltip(tooltip);
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = hex;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showTooltip(tooltip);
        }
      });
    });

    function showTooltip(tooltip) {
      if (!tooltip) return;
      tooltip.classList.add('is-visible');
      setTimeout(function () {
        tooltip.classList.remove('is-visible');
      }, 1500);
    }
  }

  /* ── 3. Content Filter Checklist ────────────────── */
  function initContentFilter() {
    var checkboxes = document.querySelectorAll('.filter-item input[type="checkbox"]');
    var completion = document.querySelector('.filter-completion');
    if (!checkboxes.length || !completion) return;

    checkboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        var allChecked = Array.from(checkboxes).every(function (c) { return c.checked; });
        if (allChecked) {
          completion.classList.add('is-visible');
        } else {
          completion.classList.remove('is-visible');
        }
      });
    });
  }

  /* ── 4. Mobile Sidebar Toggle ───────────────────── */
  function initMobileNav() {
    var hamburger = document.querySelector('.header__hamburger');
    var sidebar = document.querySelector('.sidebar');
    var backdrop = document.querySelector('.sidebar-backdrop');
    if (!hamburger || !sidebar) return;

    function openSidebar() {
      sidebar.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (sidebar.classList.contains('is-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        closeSidebar();
      }
    });

    // Close sidebar when nav link clicked on mobile
    sidebar.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 1024) closeSidebar();
      });
    });
  }

  /* ── 5. Reading Progress Bar (JS fallback) ──────── */
  function initProgressBar() {
    if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;

    var bar = document.getElementById('progress-bar');
    if (!bar) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollTop = window.scrollY || document.documentElement.scrollTop;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? scrollTop / docHeight : 0;
          bar.style.transform = 'scaleX(' + Math.min(progress, 1) + ')';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ── 6. Scroll Reveal ───────────────────────────── */
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── 7. Print Quick Reference ───────────────────── */
  function initPrint() {
    var printBtn = document.querySelector('.btn--print');
    if (!printBtn) return;
    printBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.print();
    });
  }

  /* ── Init ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollSpy();
    initSwatchCopy();
    initContentFilter();
    initMobileNav();
    initProgressBar();
    initScrollReveal();
    initPrint();
  });

})();
