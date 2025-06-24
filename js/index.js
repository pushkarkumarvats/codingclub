// Create animated background particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if(!particlesContainer) return;
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particlesContainer.appendChild(particle);
  }
}
window.addEventListener('load', createParticles);

// Hide header on scroll down, show on scroll up
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.querySelector('.header');
  if(!header) return;
  if (scrollTop > lastScrollTop && scrollTop > header.clientHeight) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Typewriter animation for hero heading
const heroHeading = document.querySelector('.hero-content h1');
if (heroHeading) {
  const words = ['Code.', 'Create.', 'Collaborate.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentWord = '';

  function type() {
    currentWord = words[wordIndex];
    if (!isDeleting) {
      heroHeading.innerHTML =
        currentWord.substring(0, charIndex + 1) +
        (charIndex + 1 === currentWord.length ? '<br>' : '');
      charIndex++;
      if (charIndex === currentWord.length) {
        setTimeout(() => {
          isDeleting = true;
          setTimeout(type, 1000);
        }, 1000);
        return;
      }
    } else {
      heroHeading.innerHTML =
        currentWord.substring(0, charIndex) + (charIndex === 0 ? '' : '<br>');
      charIndex--;
      if (charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
        return;
      }
    }
    setTimeout(type, isDeleting ? 50 : 120);
  }
  type();
}