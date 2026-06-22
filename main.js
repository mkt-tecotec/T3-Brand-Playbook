/* ═══════════════════════════════════════════════════
   T3 BRAND PLAYBOOK: Interactions
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  var cleanupTasks = [];
  var observers = [];

  function listen(target, eventName, handler, options) {
    if (!target) return;
    target.addEventListener(eventName, handler, options);
    cleanupTasks.push(function () {
      target.removeEventListener(eventName, handler, options);
    });
  }

  function trackObserver(observer) {
    observers.push(observer);
    return observer;
  }

  function resetInteractions() {
    cleanupTasks.forEach(function (cleanup) { cleanup(); });
    observers.forEach(function (observer) { observer.disconnect(); });
    cleanupTasks = [];
    observers = [];
  }

  function initScrollSpy() {
    var links = document.querySelectorAll('.nav-link');
    var sections = [];

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      var target = document.getElementById(href.slice(1));
      if (target) sections.push({ el: target, link: link });
    });

    if (!sections.length) return;

    var observer = trackObserver(new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.remove('is-active'); });
        var match = sections.find(function (section) { return section.el === entry.target; });
        if (match) match.link.classList.add('is-active');
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }));

    sections.forEach(function (section) { observer.observe(section.el); });
  }

  function initSwatchCopy() {
    document.querySelectorAll('.swatch-card').forEach(function (card) {
      function copyColour() {
        var hex = card.getAttribute('data-hex');
        if (!hex) return;
        var tooltip = card.querySelector('.swatch-card__tooltip');

        function showTooltip() {
          if (!tooltip) return;
          tooltip.classList.add('is-visible');
          window.setTimeout(function () {
            tooltip.classList.remove('is-visible');
          }, 1500);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(hex).then(showTooltip);
          return;
        }

        var textarea = document.createElement('textarea');
        textarea.value = hex;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showTooltip();
      }

      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      listen(card, 'click', copyColour);
      listen(card, 'keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          copyColour();
        }
      });
    });
  }

  function initContentFilter() {
    var checkboxes = document.querySelectorAll('.filter-item input[type="checkbox"]');
    var completion = document.querySelector('.filter-completion');
    if (!checkboxes.length || !completion) return;

    function updateCompletion() {
      var allChecked = Array.from(checkboxes).every(function (checkbox) {
        return checkbox.checked;
      });
      completion.classList.toggle('is-visible', allChecked);
    }

    checkboxes.forEach(function (checkbox) {
      listen(checkbox, 'change', updateCompletion);
    });
  }

  function initMobileNav() {
    var hamburger = document.querySelector('.header__hamburger');
    var sidebar = document.querySelector('.sidebar');
    var backdrop = document.querySelector('.sidebar-backdrop');
    if (!hamburger || !sidebar) return;

    function closeSidebar() {
      sidebar.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-visible');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }

    function openSidebar() {
      sidebar.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
    }

    hamburger.setAttribute('aria-expanded', String(sidebar.classList.contains('is-open')));
    listen(hamburger, 'click', function () {
      if (sidebar.classList.contains('is-open')) closeSidebar();
      else openSidebar();
    });
    listen(backdrop, 'click', closeSidebar);
    listen(document, 'keydown', function (event) {
      if (event.key === 'Escape' && sidebar.classList.contains('is-open')) closeSidebar();
    });

    sidebar.querySelectorAll('.nav-link').forEach(function (link) {
      listen(link, 'click', function () {
        if (window.innerWidth < 1024) closeSidebar();
      });
    });
  }

  function initProgressBar() {
    if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;
    var bar = document.getElementById('progress-bar');
    if (!bar) return;
    var ticking = false;

    function updateProgress() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = documentHeight > 0 ? scrollTop / documentHeight : 0;
        bar.style.transform = 'scaleX(' + Math.min(progress, 1) + ')';
        ticking = false;
      });
    }

    listen(window, 'scroll', updateProgress, { passive: true });
    updateProgress();
  }

  function initScrollReveal() {
    var revealItems = document.querySelectorAll('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealItems.forEach(function (element) { element.classList.add('is-visible'); });
      return;
    }

    var observer = trackObserver(new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }));

    revealItems.forEach(function (element) { observer.observe(element); });
  }

  function initPrint() {
    var printButton = document.querySelector('.btn--print');
    listen(printButton, 'click', function (event) {
      event.preventDefault();
      window.print();
    });
  }

  function initImageModal() {
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('modalImage');
    var closeButton = document.getElementById('closeModal');
    var activeCard = null;
    if (!modal || !modalImage || !closeButton) return;

    function closeModal() {
      if (!modal.classList.contains('active')) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modalImage.removeAttribute('src');
      if (activeCard) activeCard.focus();
      activeCard = null;
    }

    function openModal(card) {
      var image = card.querySelector('img');
      if (!image || image.src.includes('placeholder')) return;
      activeCard = card;
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    }

    modal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.image-card').forEach(function (card) {
      card.setAttribute('tabindex', '0');
      listen(card, 'click', function () { openModal(card); });
      listen(card, 'keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal(card);
        }
      });
    });

    listen(closeButton, 'click', closeModal);
    listen(modal, 'click', function (event) {
      if (event.target === modal) closeModal();
    });
    listen(document, 'keydown', function (event) {
      if (event.key === 'Escape') closeModal();
    });
  }

  function initialiseInteractions() {
    resetInteractions();
    initScrollSpy();
    initSwatchCopy();
    initContentFilter();
    initMobileNav();
    initProgressBar();
    initScrollReveal();
    initPrint();
    initImageModal();
  }

  document.addEventListener('t3:languagechange', initialiseInteractions);

  if (window.i18nReady) {
    window.i18nReady.then(initialiseInteractions).catch(function () {
      // i18n.js renders the user-facing error state.
    });
  } else {
    document.addEventListener('DOMContentLoaded', initialiseInteractions);
  }
})();
