/* ============================================================
   Family Matters Legal | Curtis Law — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── Cookie Consent ────────────────────────────────────────
  const COOKIE_KEY = 'fml_cookie_consent';

  function getCookieConsent() {
    return localStorage.getItem(COOKIE_KEY);
  }

  function setCookieConsent(value) {
    localStorage.setItem(COOKIE_KEY, value);
  }

  function initCookieBanner() {
    if (getCookieConsent()) return; // already decided

    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    // Show after short delay
    setTimeout(function () {
      banner.classList.add('visible');
    }, 1200);

    const btnAccept   = banner.querySelector('.btn-cookie-accept');
    const btnDecline  = banner.querySelector('.btn-cookie-decline');
    const btnSettings = banner.querySelector('.btn-cookie-settings');

    if (btnAccept) {
      btnAccept.addEventListener('click', function () {
        setCookieConsent('accepted');
        hideBanner(banner);
        // Activate analytics/tracking here when ready
      });
    }

    if (btnDecline) {
      btnDecline.addEventListener('click', function () {
        setCookieConsent('declined');
        hideBanner(banner);
      });
    }

    if (btnSettings) {
      btnSettings.addEventListener('click', function () {
        window.location.href = 'cookie-policy.html';
      });
    }
  }

  function hideBanner(banner) {
    banner.classList.remove('visible');
    setTimeout(function () {
      banner.style.display = 'none';
    }, 500);
  }

  // ── Sticky Header ─────────────────────────────────────────
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile Navigation ─────────────────────────────────────
  function initMobileNav() {
    var hamburger = document.querySelector('.hamburger');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute(
        'aria-expanded',
        hamburger.classList.contains('open') ? 'true' : 'false'
      );
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      }
    });
  }

  // ── Active Nav Link ───────────────────────────────────────
  function initActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.site-nav a, .mobile-nav a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ── Scroll Reveal ─────────────────────────────────────────
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ── Contact Form ──────────────────────────────────────────
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var originalText = btn.textContent;

      // Basic validation
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        showFormMessage(form, 'Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      var emailField = form.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          emailField.style.borderColor = '#c0392b';
          showFormMessage(form, 'Please enter a valid email address.', 'error');
          return;
        }
      }

      // Phone validation (simple check)
      var phoneField = form.querySelector('[type="tel"]');
      if (phoneField && phoneField.value) {
        var stripped = phoneField.value.replace(/\D/g, '');
        if (stripped.length < 10) {
          phoneField.style.borderColor = '#c0392b';
          showFormMessage(form, 'Please enter a valid phone number.', 'error');
          return;
        }
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Simulate submission (replace with real endpoint)
      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = originalText;
        form.reset();
        showFormMessage(
          form,
          'Thank you! We will be in touch within one business day. For urgent matters, please call our office directly.',
          'success'
        );
      }, 1800);
    });
  }

  function showFormMessage(form, message, type) {
    var existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    var msg = document.createElement('div');
    msg.className = 'form-message';
    msg.textContent = message;
    msg.style.cssText = [
      'padding: 14px 18px',
      'border-radius: 6px',
      'font-size: 0.9rem',
      'font-weight: 600',
      'margin-top: 16px',
      type === 'success'
        ? 'background: #EAF2EC; color: #1B3A28; border: 1px solid #8BB89A;'
        : 'background: #FDECEA; color: #7B1B1B; border: 1px solid #E8ACAC;'
    ].join(';');

    form.appendChild(msg);

    if (type === 'success') {
      setTimeout(function () {
        if (msg.parentNode) msg.remove();
      }, 6000);
    }
  }

  // ── Phone Number Formatter ────────────────────────────────
  function initPhoneFormatter() {
    var phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var digits = this.value.replace(/\D/g, '').substring(0, 10);
        if (digits.length >= 6) {
          this.value = '(' + digits.substring(0,3) + ') ' + digits.substring(3,6) + '-' + digits.substring(6);
        } else if (digits.length >= 3) {
          this.value = '(' + digits.substring(0,3) + ') ' + digits.substring(3);
        } else {
          this.value = digits;
        }
      });
    });
  }

  // ── Smooth scroll for anchor links ───────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var headerH = document.querySelector('.site-header')
            ? document.querySelector('.site-header').offsetHeight
            : 0;
          var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // ── Chatbot ──────────────────────────────────────────────
  function initChatbot() {
    var DISCLAIMER_KEY = 'fml_chat_ok';

    /* ── Q&A Data ── */
    var QA = [
      {
        id: 'services',
        chips: ['What services do you offer?'],
        keywords: ['service', 'offer', 'practice', 'help', 'handle', 'speciali', 'what do you'],
        html: 'We handle a full range of family law matters across Arizona:<br><br>' +
              '&bull; Divorce &amp; Legal Separation<br>' +
              '&bull; Child Custody &amp; Parenting Plans<br>' +
              '&bull; Child Support<br>' +
              '&bull; Spousal Support / Alimony<br>' +
              '&bull; Property Division<br>' +
              '&bull; Domestic Violence / Orders of Protection<br>' +
              '&bull; Adoption<br>' +
              '&bull; Paternity<br>' +
              '&bull; Pre &amp; Postnuptial Agreements<br>' +
              '&bull; Guardianship<br><br>' +
              'Would you like details on any specific area?',
        follow: ['divorce', 'custody', 'childsupport', 'consultation']
      },
      {
        id: 'consultation',
        chips: ['How do I book a consultation?'],
        keywords: ['consult', 'schedule', 'appoint', 'meet', 'book', 'free'],
        html: 'We offer <strong>free initial consultations!</strong><br><br>' +
              '&#128222; Call: <a href="tel:+16025550100">(602) 555-0100</a><br>' +
              '&#9993; Email: <a href="mailto:info@familymatterslegal.com">info@familymatterslegal.com</a><br>' +
              '&#128187; <a href="contact.html">Online contact form</a><br><br>' +
              'Office hours: Mon&ndash;Fri 8am&ndash;6pm, Sat by appointment.',
        follow: ['hours', 'cost', 'services']
      },
      {
        id: 'divorce',
        chips: ['How does divorce work in Arizona?'],
        keywords: ['divorce', 'separat', 'dissolv', 'marri'],
        html: 'Arizona is a <strong>no-fault divorce state</strong>. Neither spouse needs to prove wrongdoing &mdash; the only grounds are &ldquo;irretrievable breakdown.&rdquo;<br><br>' +
              '<strong>Key facts:</strong><br>' +
              '&bull; 90-day Arizona residency requirement<br>' +
              '&bull; Community property generally split 50/50<br>' +
              '&bull; Parenting plans required for minor children<br>' +
              '&bull; Spousal maintenance may be awarded<br><br>' +
              'Uncontested divorces move faster and cost less. Contested cases may go to trial.',
        follow: ['custody', 'property', 'spousal', 'consultation']
      },
      {
        id: 'custody',
        chips: ['How is child custody decided?'],
        keywords: ['custody', 'parenting plan', 'visitation', 'parent time', 'child custody'],
        html: 'Arizona courts base custody on the <strong>best interests of the child</strong>. Factors include:<br><br>' +
              '&bull; Each parent&rsquo;s relationship with the child<br>' +
              '&bull; Adjustment to home, school &amp; community<br>' +
              '&bull; Mental and physical health of all parties<br>' +
              '&bull; Willingness to allow contact with the other parent<br>' +
              '&bull; Any history of domestic violence<br><br>' +
              'Custody covers both <em>legal custody</em> (decision-making) and <em>physical custody</em> (residence). Joint custody is common in Arizona.',
        follow: ['childsupport', 'divorce', 'consultation']
      },
      {
        id: 'childsupport',
        chips: ['How is child support calculated?'],
        keywords: ['child support', 'support payment', 'support amount', 'support calcul'],
        html: 'Arizona uses <strong>state guidelines</strong> to calculate child support based on:<br><br>' +
              '&bull; Both parents&rsquo; gross incomes<br>' +
              '&bull; Number of children<br>' +
              '&bull; Each parent&rsquo;s parenting time<br>' +
              '&bull; Health insurance costs<br>' +
              '&bull; Childcare expenses<br><br>' +
              'Support can be modified if there is a substantial and continuing change in circumstances.',
        follow: ['custody', 'consultation', 'cost']
      },
      {
        id: 'spousal',
        chips: ['What is spousal support?'],
        keywords: ['spousal', 'alimony', 'maintenance', 'spouse support'],
        html: 'Spousal maintenance (alimony) in Arizona is <strong>not automatic</strong> &mdash; it must be requested and justified. Courts consider:<br><br>' +
              '&bull; Length of the marriage<br>' +
              '&bull; Standard of living during the marriage<br>' +
              '&bull; Each spouse&rsquo;s financial resources and earning ability<br>' +
              '&bull; Contributions to the other&rsquo;s career or education<br>' +
              '&bull; Age and health of both spouses<br><br>' +
              'It can be short-term (rehabilitative) or long-term depending on circumstances.',
        follow: ['divorce', 'property', 'consultation']
      },
      {
        id: 'property',
        chips: ['How is property divided?'],
        keywords: ['property', 'asset', 'division', 'house', 'debt', 'community property'],
        html: 'Arizona is a <strong>community property state</strong>. Property and debts acquired during marriage are generally split equally.<br><br>' +
              '<strong>Separate property</strong> (owned before marriage, or received as a gift/inheritance) typically stays with the original owner.<br><br>' +
              'Business interests, retirement accounts, and disputed valuations often require financial experts.',
        follow: ['divorce', 'spousal', 'consultation']
      },
      {
        id: 'dv',
        chips: ['Domestic violence & protection orders'],
        keywords: ['domestic violence', 'abuse', 'order of protection', 'restraining', 'violent'],
        html: 'We handle domestic violence matters with <strong>urgency and confidentiality</strong>. We can help with:<br><br>' +
              '&bull; Orders of Protection<br>' +
              '&bull; Emergency custody arrangements<br>' +
              '&bull; Divorce proceedings involving DV<br>' +
              '&bull; Safety-focused legal planning<br><br>' +
              '&#9888;&#65039; If you are in <strong>immediate danger</strong>, call <strong>911</strong>.<br>' +
              'National DV Hotline: <a href="tel:18007997233">1-800-799-7233</a><br><br>' +
              'For legal help: <a href="tel:+16025550100">(602) 555-0100</a>',
        follow: ['custody', 'consultation']
      },
      {
        id: 'adoption',
        chips: ['Tell me about adoption'],
        keywords: ['adopt'],
        html: 'We assist with several types of adoption in Arizona:<br><br>' +
              '&bull; <strong>Stepparent Adoption</strong><br>' +
              '&bull; <strong>Foster-to-Adopt</strong><br>' +
              '&bull; <strong>Private / Independent Adoption</strong><br>' +
              '&bull; <strong>Relative (Kinship) Adoption</strong><br><br>' +
              'The process includes home studies, court approval, and &mdash; where applicable &mdash; termination of parental rights. We guide families through every step.',
        follow: ['consultation', 'services']
      },
      {
        id: 'prenup',
        chips: ['What are prenuptial agreements?'],
        keywords: ['prenup', 'postnup', 'premarital', 'agreement'],
        html: 'Pre and postnuptial agreements clarify financial rights before or after marriage:<br><br>' +
              '&#128196; <strong>Prenuptial:</strong> Signed before marriage<br>' +
              '&#128196; <strong>Postnuptial:</strong> Signed after marriage<br><br>' +
              'They can address property division, spousal support, debts, and business interests. Each party should have <strong>independent legal counsel</strong> to ensure enforceability.',
        follow: ['consultation', 'property']
      },
      {
        id: 'hours',
        chips: ['What are your office hours?'],
        keywords: ['hour', 'open', 'office hour', 'available', 'when are', 'time'],
        html: '&#128343; <strong>Monday &ndash; Friday:</strong> 8:00 AM &ndash; 6:00 PM<br>' +
              '&#128197; <strong>Saturday:</strong> By Appointment Only<br><br>' +
              '&#128222; <a href="tel:+16025550100">(602) 555-0100</a><br>' +
              '&#9993; <a href="mailto:info@familymatterslegal.com">info@familymatterslegal.com</a><br><br>' +
              'Evening consultations are available for clients who cannot visit during regular hours.',
        follow: ['consultation', 'cost']
      },
      {
        id: 'cost',
        chips: ['How much do your services cost?'],
        keywords: ['cost', 'fee', 'price', 'charge', 'how much', 'afford', 'rate', 'payment'],
        html: 'Legal fees vary by case complexity. We offer:<br><br>' +
              '&#10003; <strong>Free initial consultation</strong><br>' +
              '&#128179; Flexible payment options<br>' +
              '&#128203; Clear, upfront fee agreements &mdash; no surprises<br><br>' +
              'During your free consultation we&rsquo;ll discuss fees openly.<br><br>' +
              '&#128222; <a href="tel:+16025550100">(602) 555-0100</a>',
        follow: ['consultation', 'services']
      },
      {
        id: 'location',
        chips: ['What areas do you serve?'],
        keywords: ['arizona', 'area', 'location', 'phoenix', 'scottsdale', 'where', 'serve'],
        html: 'We serve clients throughout <strong>Arizona</strong>, including:<br><br>' +
              '&#128205; Phoenix &amp; Metro Area<br>' +
              '&#128205; Scottsdale<br>' +
              '&#128205; Tempe &amp; Mesa<br>' +
              '&#128205; Chandler &amp; Gilbert<br>' +
              '&#128205; Glendale &amp; Peoria<br>' +
              '&#128205; And surrounding communities<br><br>' +
              'Contact us to confirm jurisdiction for your specific matter.',
        follow: ['consultation', 'hours']
      }
    ];

    /* ── Build lookup & main chip list ── */
    var qaById = {};
    QA.forEach(function (q) { qaById[q.id] = q; });
    var mainChipIds = ['services', 'consultation', 'divorce', 'custody', 'childsupport', 'spousal', 'cost', 'hours', 'location'];

    /* ── Create DOM ── */
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'chat-toggle';
    toggleBtn.setAttribute('aria-label', 'Open chat assistant');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML =
      '<span class="icon-open"><i class="fa-solid fa-comment-dots"></i></span>' +
      '<span class="icon-close"><i class="fa-solid fa-xmark"></i></span>';

    var windowEl = document.createElement('div');
    windowEl.className = 'chat-window';
    windowEl.setAttribute('role', 'dialog');
    windowEl.setAttribute('aria-label', 'Legal Chat Assistant');
    windowEl.setAttribute('aria-hidden', 'true');
    windowEl.innerHTML =
      /* Disclaimer */
      '<div class="chat-disclaimer" id="chatDisclaimer">' +
        '<div class="chat-disclaimer-icon"><i class="fa-solid fa-scale-balanced"></i></div>' +
        '<h3>Important Notice</h3>' +
        '<p>This chat assistant provides <strong>general information only</strong> and <strong>cannot provide legal advice</strong>. Nothing shared here constitutes legal advice or creates an attorney-client relationship.<br><br>' +
        'For advice specific to your situation, please <a href="contact.html">schedule a consultation</a> with one of our attorneys.</p>' +
        '<button class="chat-disclaimer-accept" id="chatDisclaimerAccept">I Understand &mdash; Continue</button>' +
        '<button class="chat-disclaimer-decline" id="chatDisclaimerDecline">No thanks, close</button>' +
      '</div>' +
      /* Header */
      '<div class="chat-header">' +
        '<div class="chat-header-info">' +
          '<div class="chat-avatar"><i class="fa-solid fa-scale-balanced"></i></div>' +
          '<div>' +
            '<div class="chat-name">Legal Assistant</div>' +
            '<div class="chat-status"><span class="chat-dot"></span>General Info Only</div>' +
          '</div>' +
        '</div>' +
        '<button class="chat-close" id="chatClose" aria-label="Close chat"><i class="fa-solid fa-xmark"></i></button>' +
      '</div>' +
      /* Messages */
      '<div class="chat-messages" id="chatMessages"></div>' +
      /* Quick replies */
      '<div class="chat-quick-wrap"><div class="chat-quick" id="chatQuick"></div></div>' +
      /* Input */
      '<div class="chat-input-wrap">' +
        '<div class="chat-input-row">' +
          '<input type="text" id="chatInput" class="chat-input" placeholder="Ask a question&hellip;" autocomplete="off" maxlength="200" />' +
          '<button class="chat-send" id="chatSend" aria-label="Send message"><i class="fa-solid fa-paper-plane"></i></button>' +
        '</div>' +
        '<p class="chat-footer-note">General info only &mdash; not legal advice. <a href="contact.html">Free consultation &rarr;</a></p>' +
      '</div>';

    document.body.appendChild(toggleBtn);
    document.body.appendChild(windowEl);

    /* ── Refs ── */
    var disclaimerEl = document.getElementById('chatDisclaimer');
    var disclaimerOk = document.getElementById('chatDisclaimerAccept');
    var disclaimerNo = document.getElementById('chatDisclaimerDecline');
    var closeBtn     = document.getElementById('chatClose');
    var messagesEl   = document.getElementById('chatMessages');
    var quickEl      = document.getElementById('chatQuick');
    var inputEl      = document.getElementById('chatInput');
    var sendBtn      = document.getElementById('chatSend');
    var isOpen       = false;
    var chatStarted  = false;
    var typingEl     = null;

    /* ── Helpers ── */
    function openChat() {
      isOpen = true;
      windowEl.classList.add('open');
      windowEl.setAttribute('aria-hidden', 'false');
      toggleBtn.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (!sessionStorage.getItem(DISCLAIMER_KEY)) {
        disclaimerEl.classList.remove('dismissed');
      } else {
        disclaimerEl.classList.add('dismissed');
        if (!chatStarted) startChat();
      }
    }

    function closeChat() {
      isOpen = false;
      windowEl.classList.remove('open');
      windowEl.setAttribute('aria-hidden', 'true');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    function acceptDisclaimer() {
      sessionStorage.setItem(DISCLAIMER_KEY, '1');
      disclaimerEl.classList.add('dismissed');
      if (!chatStarted) startChat();
    }

    function startChat() {
      chatStarted = true;
      botMessage(
        'Hello! I\'m the Family Matters Legal assistant. I can answer <strong>general questions</strong> about family law in Arizona.<br><br>How can I help you today?',
        function () { showChips(mainChipIds); }
      );
    }

    function addMessage(content, role) {
      var msg = document.createElement('div');
      msg.className = 'chat-msg chat-msg-' + role;
      if (role === 'bot') {
        msg.innerHTML = content;  /* bot HTML comes from our own QA data, not user input */
      } else {
        msg.textContent = content; /* user input rendered as plain text — no XSS */
      }
      messagesEl.appendChild(msg);
      scrollBottom();
    }

    function showTyping() {
      typingEl = document.createElement('div');
      typingEl.className = 'chat-typing';
      typingEl.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typingEl);
      scrollBottom();
    }

    function hideTyping() {
      if (typingEl && typingEl.parentNode) {
        typingEl.parentNode.removeChild(typingEl);
        typingEl = null;
      }
    }

    function botMessage(html, callback) {
      showTyping();
      var delay = Math.min(500 + html.replace(/<[^>]*>/g, '').length * 1.4, 1500);
      setTimeout(function () {
        hideTyping();
        addMessage(html, 'bot');
        if (callback) callback();
      }, delay);
    }

    function scrollBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showChips(ids) {
      quickEl.innerHTML = '';
      ids.forEach(function (id) {
        var qa = qaById[id];
        if (!qa) return;
        qa.chips.forEach(function (label) {
          var chip = document.createElement('button');
          chip.className = 'chat-chip';
          chip.textContent = label;
          chip.addEventListener('click', function () {
            handleChipClick(id, label);
          });
          quickEl.appendChild(chip);
        });
      });
    }

    function handleChipClick(id, label) {
      var qa = qaById[id];
      if (!qa) return;
      quickEl.innerHTML = '';
      addMessage(label, 'user');
      botMessage(qa.html, function () { showChips(qa.follow || mainChipIds); });
    }

    function handleUserInput(raw) {
      var text = raw.trim();
      if (!text) return;
      inputEl.value = '';
      quickEl.innerHTML = '';
      addMessage(text, 'user');

      /* Keyword match */
      var lower = text.toLowerCase();
      var matched = null;
      for (var i = 0; i < QA.length; i++) {
        for (var j = 0; j < QA[i].keywords.length; j++) {
          if (lower.indexOf(QA[i].keywords[j]) !== -1) {
            matched = QA[i];
            break;
          }
        }
        if (matched) break;
      }

      if (matched) {
        botMessage(matched.html, function () { showChips(matched.follow || mainChipIds); });
      } else {
        botMessage(
          'Thanks for your question! For the most accurate answer, I recommend speaking directly with one of our attorneys.<br><br>' +
          '&#128222; <a href="tel:+16025550100">(602) 555-0100</a><br>' +
          '&#128187; <a href="contact.html">Book a free consultation</a><br><br>' +
          'In the meantime, here are some topics I can help with:',
          function () { showChips(mainChipIds); }
        );
      }
    }

    /* ── Events ── */
    toggleBtn.addEventListener('click', function () {
      if (isOpen) { closeChat(); } else { openChat(); }
    });

    closeBtn.addEventListener('click', closeChat);
    disclaimerOk.addEventListener('click', acceptDisclaimer);
    disclaimerNo.addEventListener('click', closeChat);

    sendBtn.addEventListener('click', function () { handleUserInput(inputEl.value); });

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { handleUserInput(inputEl.value); }
    });

    document.addEventListener('click', function (e) {
      if (isOpen && !windowEl.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeChat();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });
  }

  // ── Init ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initCookieBanner();
    initStickyHeader();
    initMobileNav();
    initActiveNav();
    initScrollReveal();
    initContactForm();
    initPhoneFormatter();
    initSmoothScroll();
    initChatbot();
  });
})();
