// Shared JavaScript for DeepTrics website

// Toggle mobile menu (keeps aria-expanded in sync for screen readers)
function toggleMenu(btn) {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;
  const isOpen = navLinks.classList.toggle('show');
  const burger = btn || document.querySelector('.burger');
  if (burger) burger.setAttribute('aria-expanded', String(isOpen));
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const nav = document.querySelector('nav');
  const burger = document.querySelector('.burger');
  const navLinks = document.getElementById('nav-links');

  if (navLinks && navLinks.classList.contains('show')) {
    if (nav && !nav.contains(event.target)) {
      navLinks.classList.remove('show');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  }
});

// Scroll reveal animation
const revealOnScroll = () => {
  const sections = document.querySelectorAll('.section');
  const triggerBottom = window.innerHeight * 0.85;
  
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add('visible');
    }
  });
};

// Initialize scroll reveal
if (document.querySelectorAll('.section').length > 0) {
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
}

// Typewriter effect for motto
const initTypewriter = () => {
  const quote = document.querySelector('#motto');
  if (!quote) return;
  
  const fullText = quote.textContent;
  let i = 0;

  function typeWriter() {
    if (i < fullText.length) {
      quote.textContent += fullText.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    } else {
      setTimeout(() => {
        quote.textContent = "";
        i = 0;
        typeWriter();
      }, 3000);
    }
  }

  window.addEventListener('load', () => {
    quote.textContent = "";
    typeWriter();
  });
};

// Initialize typewriter if element exists
initTypewriter();

// Contact form Web App URL - create a separate Web App for Contact (Part 2 in docs/GOOGLE_SHEETS_SETUP.md)
// Replace with your Contact Form Web App URL; using the Apply form URL below will not store Contact data correctly
const CONTACT_FORM_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwk59RnV2PlZzTkj2IrnXxvH2D1wxP4O-iBXMQRKbuipHDBOAtLzOSMbxylGiV7dCOQLw/exec';

// Form submission handler
const initContactForm = () => {
  const form = document.getElementById('myForm');
  if (!form) return;
  
  const status = document.getElementById('contactStatus');
  const formWrapper = document.getElementById('contactFormWrapper');
  const spinner = document.getElementById('spinner');

  const setStatus = (message, type) => {
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status ' + (type === 'success' ? 'success-message' : 'error-message');
  };

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot: real users never see/fill this. If filled, it's a bot —
    // pretend success and drop it silently.
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      setStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
      return;
    }

    if (spinner) {
      spinner.classList.remove('hidden');
      spinner.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    setStatus('', '');

    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    data.delete('website'); // never forward the honeypot to the sheet

    // NOTE: 'no-cors' returns an opaque response, so .then() runs even if the
    // Apps Script rejects the data. Only true network errors hit .catch().
    fetch(CONTACT_FORM_SCRIPT_URL, {
      method: 'POST',
      body: data,
      mode: 'no-cors'
    })
    .then(() => {
      setStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
      if (formWrapper) formWrapper.style.display = 'none';
      if (status) {
        status.style.display = 'block';
        if (typeof status.scrollIntoView === 'function') {
          status.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      
      if (spinner) {
        spinner.classList.remove('show');
        spinner.classList.add('hidden');
      }
      document.body.style.overflow = 'auto';
    })
    .catch(() => {
      setStatus('Something went wrong. Please try again.', 'error');
      
      if (spinner) {
        spinner.classList.remove('show');
        spinner.classList.add('hidden');
      }
      document.body.style.overflow = 'auto';
    });
  });
};

// Initialize contact form if it exists
initContactForm();

// Application form submission handler (Google Sheets)
const initApplicationForm = () => {
  const form = document.getElementById('globalApplicationForm');
  if (!form) return;

  const status = document.getElementById('applyStatus');
  const formWrapper = document.getElementById('applyFormWrapper');
  const submitBtn = form.querySelector('button[type="submit"]');

  const setStatus = (message, type) => {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('error-message', 'success-message');
    if (type === 'error') status.classList.add('error-message');
    if (type === 'success') status.classList.add('success-message');
  };

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot: filled = bot. Pretend success and drop it.
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      setStatus('Application submitted successfully!', 'success');
      form.reset();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (typeof window.buildApplicationPayload !== 'function') {
      // The payload module must load before main.js on the page with this form.
      setStatus('Form is not ready. Please refresh and try again.', 'error');
      return;
    }

    setStatus('Submitting...', null);
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const payload = window.buildApplicationPayload(formData);

    // NOTE: 'no-cors' returns an opaque response, so .then() runs even if the
    // Apps Script rejects the data. Only true network errors hit .catch().
    fetch('https://script.google.com/macros/s/AKfycbwxpPJfAd9U0y1BohJOv-gDBfbCSmUb1Cp0I0byj5tTFhaYoxThKkRjNGd3IrCiIc-x/exec', {
      method: 'POST',
      body: payload,
      mode: 'no-cors'
    })
    .then(() => {
      setStatus('Application submitted successfully!', 'success');
      form.reset();
      if (formWrapper) formWrapper.style.display = 'none';
      if (status) {
        status.style.display = 'block';
        if (typeof status.scrollIntoView === 'function') {
          status.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    })
    .catch(() => {
      setStatus('Something went wrong. Please try again.', 'error');
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
  });
};

// Initialize application form if it exists
initApplicationForm();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Add active class to current page navigation (folder-based clean URLs)
const setActiveNavLink = () => {
  // Normalize any path to a trailing-slash form, dropping index.html
  const norm = (p) => {
    p = (p || '/').replace(/index\.html$/, '');
    if (!p.endsWith('/')) p += '/';
    return p;
  };
  const current = norm(window.location.pathname);
  document.querySelectorAll('#nav-links a').forEach(link => {
    let linkPath;
    try { linkPath = norm(new URL(link.href).pathname); }
    catch (e) { linkPath = norm(link.getAttribute('href')); }
    link.classList.toggle('active', linkPath === current);
  });
};

// Set active nav link on page load
window.addEventListener('load', setActiveNavLink);

// Adapt the contact page to the ?type= query param so each entry point
// (Get a Quote, Notify Me, Start a Project, ...) feels purposeful instead of
// dumping everyone onto an identical page. Also pre-selects the subject.
const setContactContext = () => {
  const form = document.getElementById('myForm');
  if (!form) return;
  const type = (new URLSearchParams(window.location.search).get('type') || '').toLowerCase();
  const map = {
    quote:       { heading: 'Request a quote',     intro: "Tell us about your project — scope, timeline, whatever you have — and we'll come back with an estimate.", subject: 'Request a quote' },
    project:     { heading: 'Start a project',     intro: "Ready to build? Share what you have in mind and we'll figure out the best way to ship it.",                subject: 'Start a new project' },
    notify:      { heading: 'Get product updates', intro: "Want to know when our products launch? Leave your details and we'll keep you posted.",                       subject: 'Product updates / waitlist' },
    partnership: { heading: 'Partner with us',     intro: 'Interested in working together? Tell us about your institution or organisation.',                            subject: 'Partnership' },
    internship:  { heading: 'Internship questions',intro: 'Have a question about our internship program? Ask away.',                                                    subject: 'Internship question' }
  };
  const ctx = map[type];
  if (!ctx) return;
  const heading = document.getElementById('contactHeading');
  const intro = document.getElementById('contactIntro');
  const subject = document.getElementById('contactSubject');
  if (heading) heading.textContent = ctx.heading;
  if (intro) intro.textContent = ctx.intro;
  if (subject) subject.value = ctx.subject;
};
setContactContext();

// Keep footer copyright year current automatically
const setFooterYear = () => {
  const year = new Date().getFullYear();
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = year;
  });
};
setFooterYear();
