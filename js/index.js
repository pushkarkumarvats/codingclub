// Create animated background particles for visual enhancement
function createParticles() {
  const particlesContainer = document.getElementById('particles');

  // Exit early if particles container doesn't exist (defensive programming)
  if (!particlesContainer) return;

  const particleCount = 50;

  // Generate 50 particles with randomized properties for organic animation
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Randomize horizontal starting position across full viewport width
    particle.style.left = Math.random() * 100 + '%';

    // Stagger animation start times (0-6 seconds) to avoid synchronized movement
    particle.style.animationDelay = Math.random() * 6 + 's';

    // Vary animation speed (3-6 seconds per cycle) for natural movement
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';

    particlesContainer.appendChild(particle);
  }
}

// Initialize particles when page is fully loaded
window.addEventListener('load', createParticles);

// Smart header visibility: hide on scroll down, show on scroll up
// This creates a more immersive reading experience by giving users more screen space
let lastScrollTop = 0;  // Track previous scroll position for direction detection

window.addEventListener('scroll', function () {
  // Get current scroll position (cross-browser compatible)
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.querySelector('.header');

  // Exit early if header doesn't exist (defensive programming)
  if (!header) return;

  // Only hide header when scrolling down AND past the header height
  if (scrollTop > lastScrollTop && scrollTop > header.clientHeight) {
    // Hide header by sliding it up out of view
    header.style.transform = 'translateY(-100%)';
  } else {
    // Show header by sliding it back to original position
    header.style.transform = 'translateY(0)';
  }

  // Update last scroll position, preventing negative values
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Typewriter animation for hero section
const words = ["Code.", "Create.", "Collaborate."];
const typewriterText = document.getElementById("typewriter-text");
const cursor = document.querySelector(".typewriter-cursor");
let wordIndex = 0;
let charIndex = 0;
let typing = true;

function typeWord() {
  if (typing) {
    if (charIndex < words[wordIndex].length) {
      typewriterText.textContent += words[wordIndex][charIndex];
      charIndex++;
      setTimeout(typeWord, 100);
    } else {
      typing = false;
      setTimeout(eraseWord, 1200);
    }
  }
}

function eraseWord() {
  if (!typing) {
    if (charIndex > 0) {
      typewriterText.textContent = words[wordIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(eraseWord, 50);
    } else {
      typing = true;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeWord, 400);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typewriterText && cursor) {
    typeWord();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll functionality for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Scroll to top button visibility and functionality
  const scrollBtn = document.getElementById("scrollToTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) scrollBtn.style.display = "block";
      else scrollBtn.style.display = "none";
    });
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});