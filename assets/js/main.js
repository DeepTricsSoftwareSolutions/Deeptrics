// Shared JavaScript for DeepTrics website

// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
    navLinks.classList.toggle('show');
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const nav = document.querySelector('nav');
  const burger = document.querySelector('.burger');
  const navLinks = document.getElementById('nav-links');
  
  if (navLinks && navLinks.classList.contains('show')) {
    if (!nav.contains(event.target) && event.target !== burger) {
      navLinks.classList.remove('show');
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
    
    if (spinner) {
      spinner.classList.remove('hidden');
      spinner.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    setStatus('', '');
    
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

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
        status.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus('Submitting...', null);
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const payload = (typeof window.buildApplicationPayload === 'function')
      ? window.buildApplicationPayload(formData)
      : (function() {
          const g = (k) => formData.get(k) || '';
          const p = new URLSearchParams();
          p.append('Timestamp', new Date().toISOString());
          p.append('firstName', g('firstName')); p.append('middleName', g('middleName')); p.append('lastName', g('lastName'));
          p.append('email', g('email')); p.append('country', g('country')); p.append('timezone', g('timezone'));
          p.append('phone', g('phone')); p.append('institution', g('institution')); p.append('degree', g('degree'));
          p.append('currentStatus', g('currentStatus')); p.append('programType', g('programType'));
          p.append('preferredRole', g('preferredRole')); p.append('whyInterested', g('whyInterested'));
          p.append('hasProjects', g('hasProjects')); p.append('portfolioLink', g('portfolioLink'));
          p.append('hopeToLearn', g('hopeToLearn')); p.append('weeklyHours', g('weeklyHours'));
          p.append('workingMode', g('workingMode')); p.append('comfortableTimezones', g('comfortableTimezones'));
          p.append('expectFreeRealWork', g('expectFreeRealWork')); p.append('expectNotCertificateOnly', g('expectNotCertificateOnly'));
          p.append('expectCollaborate', g('expectCollaborate')); p.append('expectCommitTime', g('expectCommitTime'));
          return p;
        })();

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
        status.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Add active class to current page navigation
const setActiveNavLink = () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('#nav-links a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

// Set active nav link on page load
window.addEventListener('load', setActiveNavLink);
