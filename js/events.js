
// Create floating particles for background animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    // Generate 50 random particles with varying positions and animation timing
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Randomize horizontal position across full width
        particle.style.left = Math.random() * 100 + '%';

        // Stagger animation start times for natural effect (0-6 seconds)
        particle.style.animationDelay = Math.random() * 6 + 's';

        // Vary animation duration for organic movement (3-6 seconds)
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';

        particlesContainer.appendChild(particle);
    }
}

// Event filtering functionality
// Get all filter tab buttons and event cards for manipulation
const filterTabs = document.querySelectorAll('.filter-tab');
const eventCards = document.querySelectorAll('.event-card');

// Add click event listener to each filter tab
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active styling from all tabs first
        filterTabs.forEach(t => t.classList.remove('active'));

        // Add active styling to the clicked tab
        tab.classList.add('active');

        // Get the filter type from the clicked tab's data attribute
        const filter = tab.dataset.filter;

        // Show/hide event cards based on filter selection
        eventCards.forEach(card => {
            // Show card if "all" is selected OR card type matches filter
            if (filter === 'all' || card.dataset.type === filter) {
                card.style.display = 'block';
                // Add smooth fade-in animation when showing cards
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                // Hide cards that don't match the filter
                card.style.display = 'none';
            }
        });
    });
});

// Real-time search functionality for events
const searchBar = document.querySelector('.search-bar');

searchBar.addEventListener('input', (e) => {
    // Convert search term to lowercase for case-insensitive matching
    const searchTerm = e.target.value.toLowerCase();

    // Check each event card against the search term
    eventCards.forEach(card => {
        // Extract text content from title and description elements
        const title = card.querySelector('.event-title').textContent.toLowerCase();
        const description = card.querySelector('.event-description').textContent.toLowerCase();

        // Show card if search term is found in title OR description
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            // Hide card if search term doesn't match
            card.style.display = 'none';
        }
    });
});

// Initialize particle animation when page fully loads
window.addEventListener('load', createParticles);

// Scroll-triggered animations using Intersection Observer API
// Configuration for when elements should trigger animations
const observerOptions = {
    threshold: 0.1,        // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px'  // Trigger 50px before element enters viewport
};

// Create observer to watch for elements entering viewport
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        // When element becomes visible in viewport
        if (entry.isIntersecting) {
            // Animate element to full opacity and original position
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply scroll animations to event cards and timeline items
document.querySelectorAll('.event-card, .timeline-item').forEach(element => {
    // Set initial state: invisible and slightly below final position
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';

    // Define smooth transition for the animation
    element.style.transition = 'all 0.6s ease';

    // Start observing this element for viewport intersection
    observer.observe(element);
});

// Dynamically inject CSS animation keyframes for fade-in effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { 
            opacity: 0; 
            transform: translateY(20px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
`;
// Append the style element to document head to make animations available
document.head.appendChild(style);
