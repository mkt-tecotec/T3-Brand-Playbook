/* ═══════════════════════════════════════════════════
   T3 BRAND PLAYBOOK: Localisation
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  var SUPPORTED_LANGUAGES = ['vi', 'en'];
  var DEFAULT_LANGUAGE = 'vi';
  var STORAGE_KEY = 't3-brand-playbook-language';
  var content = null;
  var currentLanguage = DEFAULT_LANGUAGE;

  function isSupported(language) {
    return SUPPORTED_LANGUAGES.indexOf(language) !== -1;
  }

  function readStoredLanguage() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      return isSupported(stored) ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function storeLanguage(language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }

  function languageFromUrl() {
    var requested = new URL(window.location.href).searchParams.get('lang');
    return isSupported(requested) ? requested : null;
  }

  function resolveInitialLanguage() {
    return languageFromUrl() || readStoredLanguage() || DEFAULT_LANGUAGE;
  }

  function validateContent(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('content.json must contain an object');
    }

    Object.keys(data).forEach(function (key) {
      var entry = data[key];
      if (!entry || typeof entry !== 'object') {
        throw new Error('Invalid translation entry: ' + key);
      }

      SUPPORTED_LANGUAGES.forEach(function (language) {
        if (typeof entry[language] !== 'string') {
          throw new Error('Missing ' + language + ' translation: ' + key);
        }
      });
    });
  }

  function valueFor(key, language) {
    if (!content[key] || typeof content[key][language] !== 'string') {
      throw new Error('Translation key not found: ' + key + ' (' + language + ')');
    }
    return content[key][language];
  }

  function applyAttributes(language) {
    document.querySelectorAll('[data-i18n-attr]').forEach(function (element) {
      element.getAttribute('data-i18n-attr').split(';').forEach(function (binding) {
        var separator = binding.indexOf(':');
        if (separator < 1) return;
        var attribute = binding.slice(0, separator).trim();
        var key = binding.slice(separator + 1).trim();
        element.setAttribute(attribute, valueFor(key, language));
      });
    });
  }

  function updateLanguageControls(language) {
    document.querySelectorAll('[data-language]').forEach(function (button) {
      var isCurrent = button.getAttribute('data-language') === language;
      button.classList.toggle('is-active', isCurrent);
      button.setAttribute('aria-pressed', String(isCurrent));
    });
  }

  function render(language, options) {
    var settings = options || {};

    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      element.textContent = valueFor(element.getAttribute('data-i18n'), language);
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (element) {
      element.innerHTML = valueFor(element.getAttribute('data-i18n-html'), language);
    });

    applyAttributes(language);
    document.documentElement.lang = language;
    document.title = valueFor('meta.title', language);

    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', valueFor('meta.description', language));

    currentLanguage = language;
    storeLanguage(language);
    updateLanguageControls(language);
    document.body.removeAttribute('aria-busy');

    if (settings.updateUrl || settings.replaceUrl) {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      var historyMethod = settings.replaceUrl ? 'replaceState' : 'pushState';
      window.history[historyMethod]({ language: language }, '', url);
    }

    if (!settings.initial) {
      document.dispatchEvent(new CustomEvent('t3:languagechange', {
        detail: { language: language }
      }));
    }
  }

  function showLoadError(language, error) {
    var fallback = language === 'en'
      ? {
          title: 'Content could not be loaded',
          body: 'Reload the page or try again later.',
          retry: 'Reload page'
        }
      : {
          title: 'Không tải được nội dung',
          body: 'Vui lòng tải lại trang hoặc thử lại sau.',
          retry: 'Tải lại trang'
        };

    var errorPanel = document.getElementById('i18nError');
    if (errorPanel) {
      errorPanel.querySelector('strong').textContent = fallback.title;
      errorPanel.querySelector('span').textContent = fallback.body;
      var retryButton = errorPanel.querySelector('button');
      retryButton.textContent = fallback.retry;
      retryButton.addEventListener('click', function () { window.location.reload(); });
      errorPanel.hidden = false;
    }

    document.body.removeAttribute('aria-busy');
    console.error('T3 Brand Playbook localisation failed:', error);
  }

  function bindLanguageControls() {
    document.querySelectorAll('[data-language]').forEach(function (button) {
      button.addEventListener('click', function () {
        var language = button.getAttribute('data-language');
        if (!content || !isSupported(language) || language === currentLanguage) return;
        render(language, { updateUrl: true });
      });
    });

    window.addEventListener('popstate', function () {
      var language = languageFromUrl() || DEFAULT_LANGUAGE;
      if (language !== currentLanguage) render(language);
    });
  }

  async function initialise() {
    currentLanguage = resolveInitialLanguage();
    document.body.setAttribute('aria-busy', 'true');
    bindLanguageControls();

    try {
      var response = await fetch('content.json', { credentials: 'same-origin' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      content = await response.json();
      validateContent(content);
      render(currentLanguage, { initial: true, replaceUrl: !languageFromUrl() });
      return { language: currentLanguage };
    } catch (error) {
      showLoadError(currentLanguage, error);
      throw error;
    }
  }

  window.T3I18n = {
    getLanguage: function () { return currentLanguage; },
    setLanguage: function (language) {
      if (content && isSupported(language) && language !== currentLanguage) {
        render(language, { updateUrl: true });
      }
    }
  };

  window.i18nReady = initialise();
})();
