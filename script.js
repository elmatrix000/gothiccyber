// Project data with correct file names
const projects = [
    { img: './project1.JPG', title: 'Commercial Building Project' },
    { img: './project2.JPG', title: 'Road Infrastructure Development' },
    { img: './project3.JPG', title: 'Mining Facility Construction' },
    { img: './project4.JPG', title: 'Residential Complex' },
    { img: './project5.JPG', title: 'Industrial Warehouse' },
    { img: './project6.JPG.jpg', title: 'Bridge Construction' },
    { img: './project7.JPG.jpg', title: 'School Infrastructure' },
    { img: './project8.JPG.jpg', title: 'Hospital Development' },
    { img: './project9.JPG.jpg', title: 'Water Treatment Plant' },
    { img: './project10.JPG.jpg', title: 'Shopping Mall Construction' },
    { img: './project11.JPG.jpg', title: 'Office Building' },
    { img: './project12.JPG.jpg', title: 'Factory Construction' },
    { img: './project13.JPG.jpg', title: 'Highway Expansion' },
    { img: './project14.JPG.jpg', title: 'Dam Construction' },
    { img: './project15.JPG.jpg', title: 'Airport Runway' },
    { img: './project16.JPG.jpg', title: 'Power Station' }
];

let currentSlide = 0;
let slideInterval;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    initSlider();
    initCounters();
    initNavigation();
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(hideLoader, 500);
    });
});

// Hide loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// Initialize project slider
function initSlider() {
    const slider = document.getElementById('projectsSlider');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slider || !dotsContainer) {
        console.error('Slider elements not found');
        return;
    }
    
    // Create slides
    projects.forEach((project, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'project-slide';
        slide.innerHTML = `
            <img src="${project.img}" alt="${project.title}" onerror="this.src='./project1.JPG'">
            <div class="project-slide-overlay">
                <span class="project-tag">Construction</span>
                <h3>${project.title}</h3>
                <p>Professional construction and infrastructure development</p>
            </div>
        `;
        slider.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
        dot.onclick = function() { goToSlide(index); };
        dotsContainer.appendChild(dot);
    });
    
    // Start auto-slide
    startAutoSlide();
}

// Change slide
function changeSlide(direction) {
    currentSlide = (currentSlide + direction + projects.length) % projects.length;
    updateSlider();
}

// Go to specific slide
function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoSlide();
}

// Update slider display
function updateSlider() {
    const slider = document.getElementById('projectsSlider');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!slider) return;
    
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Auto-slide functionality
function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.hero-stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                if (!isNaN(target)) {
                    animateCounter(counter, target);
                }
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Animate counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const suffix = target === 100 ? '%' : '+';
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
}

// Navigation
function initNavigation() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                document.getElementById('navLinks').classList.remove('active');
            }
        });
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Scroll to contact
function scrollToContact() {
    const contact = document.getElementById('contact');
    if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Log form data (replace with actual submission)
    console.log('Form submitted:', Object.fromEntries(formData));
    
    showToast('Thank you! Your message has been sent. We will contact you within 24 hours.');
    form.reset();
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
