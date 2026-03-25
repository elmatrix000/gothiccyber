// ==========================================
// MOTSOMALO HOLDINGS - MODERN JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize all components
    initSwipers();
    initCounters();
    initNavigation();
    initScrollAnimations();
    initEmailJS();
    initLazyLoading();
});

// ==========================================
// SWIPER SLIDERS - Enhanced with modern config
// ==========================================
function initSwipers() {
    const swiperConfig = {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        slidesPerView: 1,
        spaceBetween: 24,
        grabCursor: true,
        keyboard: {
            enabled: true,
        },
        pagination: {
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1.2,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 24
            },
            1024: {
                slidesPerView: 2.5,
                spaceBetween: 30
            },
            1280: {
                slidesPerView: 3,
                spaceBetween: 32
            }
        },
        effect: 'slide',
        speed: 800,
        lazy: {
            loadPrevNext: true,
        }
    };

    // Project Swiper 1 - School Projects
    if (document.querySelector('.projectSwiper1')) {
        new Swiper('.projectSwiper1', {
            ...swiperConfig,
            navigation: {
                nextEl: '.swiper-button-next-1',
                prevEl: '.swiper-button-prev-1',
            }
        });
    }

    // Project Swiper 2 - Infrastructure Projects
    if (document.querySelector('.projectSwiper2')) {
        new Swiper('.projectSwiper2', {
            ...swiperConfig,
            navigation: {
                nextEl: '.swiper-button-next-2',
                prevEl: '.swiper-button-prev-2',
            }
        });
    }
}

// ==========================================
// ANIMATED COUNTERS - Intersection Observer
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        counter.innerText = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.innerText = target.toLocaleString();
            counter.classList.add('counter-complete');
        }
    }

    requestAnimationFrame(update);
}

// ==========================================
// STICKY NAVIGATION - Mobile & Desktop
// ==========================================
function initNavigation() {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    // Scroll behavior for header
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            nav.classList.toggle('nav-open');
            document.body.classList.toggle('menu-open');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (nav.classList.contains('nav-open')) {
                    mobileMenuBtn.classList.remove('active');
                    nav.classList.remove('nav-open');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS - Reveal on scroll
// ==========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service, .stats > div, h2, .about-text');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100); // Stagger effect
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });
}

// ==========================================
// EMAILJS - Contact Form Handling
// ==========================================
function initEmailJS() {
    // Initialize with your public key
    emailjs.init("kcfQ4oTXD-9-ckF5a");

    const form = document.getElementById("contact-form");
    const submitBtn = form?.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;

    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            // Loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            }

            try {
                await emailjs.sendForm(
                    "service_5o6z66k",
                    "template_imj3sps",
                    this
                );
                
                // Success
                showNotification("Success! Your consultation request has been sent.", "success");
                form.reset();
                
            } catch (error) {
                console.error('EmailJS Error:', error);
                showNotification("Failed to send message. Please try again or call us directly.", "error");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==========================================
// LAZY LOADING - Images & Iframes
// ==========================================
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('img[data-src], iframe[data-src]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.src = el.dataset.src;
                el.removeAttribute('data-src');
                el.classList.add('loaded');
                lazyObserver.unobserve(el);
            }
        });
    });

    lazyElements.forEach(el => lazyObserver.observe(el));
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Preload critical images
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
