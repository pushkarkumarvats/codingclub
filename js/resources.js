// Placeholder for resources page JavaScript
// Add interactivity for resources page here if needed

function createParticles() { const particlesContainer = document.getElementById('particles'); if(!particlesContainer) return; const particleCount = 50; for (let i = 0; i < particleCount; i++) { const particle = document.createElement('div'); particle.className = 'particle'; particle.style.left = Math.random() * 100 + '%'; particle.style.animationDelay = Math.random() * 6 + 's'; particle.style.animationDuration = (Math.random() * 3 + 3) + 's'; particlesContainer.appendChild(particle); } }
        window.addEventListener('load', createParticles);
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() { let scrollTop = window.pageYOffset || document.documentElement.scrollTop; const header = document.querySelector('.header'); if(!header) return; if (scrollTop > lastScrollTop && scrollTop > header.clientHeight) { header.style.transform = 'translateY(-100%)'; } else { header.style.transform = 'translateY(0)'; } lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; });