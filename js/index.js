// Create animated background particles for visual enhancement
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  
  // Exit early if particles container doesn't exist (defensive programming)
  if(!particlesContainer) return;
  
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

window.addEventListener('scroll', function() {
  // Get current scroll position (cross-browser compatible)
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.querySelector('.header');
  
  // Exit early if header doesn't exist (defensive programming)
  if(!header) return;
  
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

// Dynamic typewriter animation for hero heading
// Creates an engaging visual effect by typing and erasing words in sequence
const heroHeading = document.querySelector('.hero-content h1');

if (heroHeading) {
  // Define the words to cycle through in the animation
  const words = ['Code.', 'Create.', 'Collaborate.'];
  
  // Animation state variables
  let wordIndex = 0;        // Current word being animated
  let charIndex = 0;        // Current character position within word
  let isDeleting = false;   // Whether we're currently erasing or typing
  let currentWord = '';     // Cache of current word being processed

  function type() {
    currentWord = words[wordIndex];
    
    if (!isDeleting) {
      // TYPING MODE: Add characters one by one
      heroHeading.innerHTML =
        currentWord.substring(0, charIndex + 1) +
        // Add line break when word is complete for visual formatting
        (charIndex + 1 === currentWord.length ? '<br>' : '');
      charIndex++;
      
      // When word is complete, pause then start deleting
      if (charIndex === currentWord.length) {
        setTimeout(() => {
          isDeleting = true;
          setTimeout(type, 1000);  // Pause at end of word
        }, 1000);
        return;
      }
    } else {
      // DELETING MODE: Remove characters one by one
      heroHeading.innerHTML =
        currentWord.substring(0, charIndex) + 
        (charIndex === 0 ? '' : '<br>');
      charIndex--;
      
      // When word is fully deleted, move to next word
      if (charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;  // Cycle through words
        setTimeout(type, 500);  // Brief pause before starting next word
        return;
      }
    }
    
    // Recursive call with timing: faster when deleting, slower when typing
    setTimeout(type, isDeleting ? 50 : 120);
  }
  
  // Start the typewriter animation
  type();
}