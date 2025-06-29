// Resources page JavaScript functionality
// This file contains shared functionality used across the resources page

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
// This creates a cleaner browsing experience when viewing learning resources
let lastScrollTop = 0;  // Track previous scroll position for direction detection

window.addEventListener('scroll', function () {
    // Get current scroll position (cross-browser compatible)
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.header');

    // Exit early if header doesn't exist (defensive programming)
    if (!header) return;

    // Only hide header when scrolling down AND past the header height
    // This prevents header from hiding when user is still at the top of the page
    if (scrollTop > lastScrollTop && scrollTop > header.clientHeight) {
        // Hide header by sliding it up out of view
        header.style.transform = 'translateY(-100%)';
    } else {
        // Show header by sliding it back to original position
        // This happens when scrolling up or when at the top of the page
        header.style.transform = 'translateY(0)';
    }

    // Update last scroll position, preventing negative values
    // Negative values can occur on iOS Safari with bounce scrolling
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});