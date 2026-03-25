// Project images array
const projectImages = [
    'project1.JPG', 'project2.JPG', 'project3.JPG', 'project4.JPG',
    'project5.JPG', 'project6.JPG.jpg', 'project7.JPG.jpg', 'project8.JPG.jpg',
    'project9.JPG.jpg', 'project10.JPG.jpg', 'project11.JPG.jpg', 'project12.JPG.jpg',
    'project13.JPG.jpg', 'project14.JPG.jpg', 'project15.JPG.jpg', 'project16.JPG.jpg'
];

const projectTitles = [
    'Commercial Building Project',
    'Road Infrastructure Development',
    'Mining Facility Construction',
    'Residential Complex',
    'Industrial Warehouse',
    'Bridge Construction',
    'School Infrastructure',
    'Hospital Development',
    'Water Treatment Plant',
    'Shopping Mall Construction',
    'Office Building',
    'Factory Construction',
    'Highway Expansion',
    'Dam Construction',
    'Airport Runway',
    'Power Station'
];

let currentSlide = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initCounters();
    hideLoader();
});

// Hide loader
function hideLoader() {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 500);
}

// Initialize project slider
function initSlider() {
    const slider = document.getElementById('projectsSlider');
    const dotsContainer = document.getElementById('sliderDots');
    const thumbsContainer = document.getElementById('projectsGrid');
    
    // Create slides
    projectImages.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'project-slide';
        slide.innerHTML = `
            <img src="${img}" alt="${projectTitles[index]}" onerror="this.src='project1.JPG'">
            <div class="project-slide-overlay">
                <span class="project-tag">Construction</span>
                <h3>${projectTitles[index]}</h3>
                <p>Professional construction and infrastructure development</p>
            </div>
        `;
        slider.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
        
        // Create thumbnail
        if (index < 8) {
            const thumb = document.createElement('div');
            thumb.className = 'project-thumb' + (index === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${img}" alt="${projectTitles[index]}">`;
            thumb.onclick = () => goToSlide(index);
            thumbsContainer.appendChild(thumb);
        }
    });
    
    // Auto slide
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Change slide
function changeSlide(direction) {
    currentSlide = (currentSlide + direction + projectImages.length) % projectImages.length;
    updateSlider();
}

// Go to specific slide
function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// Update slider display
function updateSlider() {
    const slider = document.getElementById('projectsSlider');
    const dots = document.querySelectorAll('.slider-dot');
    const thumbs = document.querySelectorAll('.project-thumb');
    
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    slider.style.transition = 'transform 0.5s ease';
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlide);
    });
}

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.hero-stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
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

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Scroll to contact
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    showToast('Thank you! Your message has been sent. We will contact you within 24 hours.');
    document.getElementById('consultationForm').reset();
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
