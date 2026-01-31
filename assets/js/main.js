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

// Form submission handler
const initContactForm = () => {
  const form = document.getElementById('myForm');
  if (!form) return;
  
  const status = document.getElementById('statusMessage');
  const spinner = document.getElementById('spinner');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (spinner) {
      spinner.classList.remove('hidden');
      spinner.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    fetch('https://script.google.com/macros/s/AKfycby_HinKrRtEfFuNfXT5ERS44hRFREuC3M-TsuBPq9cSdVsW3zxaIsK8J0ey4dMNBhjVLQ/exec', {
      method: 'POST',
      body: data,
      mode: 'no-cors'
    })
    .then(response => response.text())
    .then(result => {
      if (status) {
        status.innerText = "Form submitted successfully!";
        status.classList.add('success-message');
        status.classList.remove('error-message');
      }
      form.reset();
      
      if (spinner) {
        spinner.classList.remove('show');
        spinner.classList.add('hidden');
      }
      document.body.style.overflow = 'auto';
    })
    .catch(error => {
      if (status) {
        status.innerText = "Something went wrong. Please try again.";
        status.classList.add('error-message');
        status.classList.remove('success-message');
      }
      
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
