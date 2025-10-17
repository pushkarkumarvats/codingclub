// ================================================
// SOLVOTHON 2025 PAGE JAVASCRIPT
// IIT Guwahati Online Degree Coding Club
// ================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initParticles();
  initCountdown();
  initMobileMenu();
  initScrollToTop();
  initFAQ();
  initRegistrationForm();
  initSmoothScroll();
  initScrollAnimations();
});

// ================================================
// PARTICLE ANIMATION BACKGROUND
// ================================================
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  // Create particles
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'rgba(0, 212, 255, ' + (Math.random() * 0.5 + 0.2) + ')';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animation = `particleFloat ${Math.random() * 10 + 5}s linear infinite`;
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    particlesContainer.appendChild(particle);
  }

  // Add particle animation CSS dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ================================================
// COUNTDOWN TIMER
// ================================================
function initCountdown() {
  // Set the date for Solvothon 2025 (February 15, 2025, 10:00 AM IST)
  const eventDate = new Date('2025-02-15T10:00:00+05:30').getTime();

  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      // Event has started or ended
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    daysElement.textContent = String(days).padStart(2, '0');
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
  }

  // Update countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ================================================
// MOBILE MENU TOGGLE
// ================================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close menu when clicking on a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      navLinks.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

// ================================================
// SCROLL TO TOP BUTTON
// ================================================
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (!scrollToTopBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  // Scroll to top when clicked
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ================================================
// FAQ ACCORDION
// ================================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// ================================================
// REGISTRATION FORM HANDLING
// ================================================
function initRegistrationForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      institution: document.getElementById('institution').value,
      experience: document.getElementById('experience').value
    };

    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    // Show success message
    showNotification('Registration Successful! We will contact you soon.', 'success');

    // Reset form
    form.reset();

    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
  });
}

function validateForm(data) {
  // Name validation
  if (data.fullName.trim().length < 3) {
    showNotification('Please enter a valid name (at least 3 characters)', 'error');
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showNotification('Please enter a valid email address', 'error');
    return false;
  }

  // Phone validation (basic)
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
    showNotification('Please enter a valid phone number', 'error');
    return false;
  }

  // Institution validation
  if (data.institution.trim().length < 3) {
    showNotification('Please enter a valid institution name', 'error');
    return false;
  }

  return true;
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.position = 'fixed';
  notification.style.top = '100px';
  notification.style.right = '20px';
  notification.style.padding = '1rem 2rem';
  notification.style.borderRadius = '10px';
  notification.style.zIndex = '9999';
  notification.style.fontWeight = '600';
  notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
  notification.style.animation = 'slideInRight 0.3s ease-out';
  
  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
    notification.style.color = '#000';
  } else {
    notification.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
    notification.style.color = '#fff';
  }

  // Add to DOM
  document.body.appendChild(notification);

  // Add animation keyframes if not already present
  if (!document.getElementById('notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// ================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ================================================
// SCROLL ANIMATIONS
// ================================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  const animatedElements = document.querySelectorAll('.about-card, .highlight-card, .timeline-item, .prize-card, .faq-item, .contact-card');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// ================================================
// HEADER BACKGROUND ON SCROLL
// ================================================
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (!header) return;

  if (window.pageYOffset > 100) {
    header.style.background = 'rgba(15, 15, 35, 0.95)';
  } else {
    header.style.background = 'transparent';
  }
});

// ================================================
// LAZY LOADING IMAGES (if any are added)
// ================================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  const lazyImages = document.querySelectorAll('img.lazy');
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ================================================
// PERFORMANCE MONITORING (Optional)
// ================================================
if ('performance' in window) {
  window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time:', pageLoadTime + 'ms');
  });
}

// ================================================
// ERROR HANDLING
// ================================================
window.addEventListener('error', function(e) {
  console.error('An error occurred:', e.error);
  // In production, you might want to send this to an error tracking service
});

// ================================================
// ACCESSIBILITY ENHANCEMENTS
// ================================================
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  // ESC key to close mobile menu
  if (e.key === 'Escape') {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      if (menuToggle) {
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  }
});

// ================================================
// CONSOLE MESSAGE
// ================================================
console.log('%c🚀 Solvothon 2025 🚀', 'color: #00d4ff; font-size: 24px; font-weight: bold;');
console.log('%cIIT Guwahati Online Degree Coding Club', 'color: #00d4ff; font-size: 14px;');
console.log('%cWebsite loaded successfully!', 'color: #00ff88; font-size: 12px;');
