// ==========================================
// MOTSOMALO HOLDINGS - FIXED & UPGRADED
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if required libraries loaded
    if (typeof Swiper === 'undefined') {
        console.error('Swiper library not loaded');
    }
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded');
    }
    
    // Initialize all components
    initSwipers();
    initCounters();
    initNavigation();
    initScrollAnimations();
    initEmailJS();
    initWhatsAppButton();
    updateCopyright();
});

// Company Contact Info - UNIFIED NUMBER
const COMPANY = {
    phone: '+27789685258',
    whatsapp: '+27789685258', // Same number
    email: 'MzwakheKhumalo91@gmail.com',
    formatted: '+27 (78) 968-5258'
};

// ==========================================
// SWIPER SLIDERS - FIXED INIT
// ==========================================
function initSwipers() {
    if (typeof Swiper === 'undefined') return;
    
    const commonConfig = {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        keyboard: { enabled: true },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        preloadImages: true,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2
        },
        watchSlidesProgress: true,
        speed: 600
    };

    // Initialize Swiper 1 if element exists
    const swiper1El = document.querySelector('.projectSwiper1');
    if (swiper1El) {
        new Swiper('.projectSwiper1', {
            ...commonConfig,
            navigation: {
                nextEl: '.swiper-button-next-1',
                prevEl: '.swiper-button-prev-1'
            }
        });
    }

    // Initialize Swiper 2 if element exists
    const swiper2El = document.querySelector('.projectSwiper2');
    if (swiper2El) {
        new Swiper('.projectSwiper2', {
            ...commonConfig,
            navigation: {
                nextEl: '.swiper-button-next-2',
                prevEl: '.swiper-button-prev-2'
            }
        });
    }
}

// ==========================================
// COUNTERS - FIXED INTERSECTION OBSERVER
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: animate immediately
        counters.forEach(counter => animateCounter(counter));
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target')) || 0;
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOut);
        
        counter.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(update);
}

// ==========================================
// NAVIGATION - FIXED MOBILE MENU
// ==========================================
function initNavigation() {
    const header = document.querySelector('.header');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = nav.classList.contains('nav-open');
            
            this.classList.toggle('active');
            nav.classList.toggle('nav-open');
            document.body.classList.toggle('menu-open');
            this.setAttribute('aria-expanded', !isOpen);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('nav-open') && !nav.contains(e.target) && !mobileBtn.contains(e.target)) {
                mobileBtn.classList.remove('active');
                nav.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                if (nav && nav.classList.contains('nav-open')) {
                    mobileBtn.classList.remove('active');
                    nav.classList.remove('nav-open');
                    document.body.classList.remove('menu-open');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service, .stats > div, h2, .about-text');
    if (!elements.length || !('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

// ==========================================
// EMAILJS - FIXED & TESTED
// ==========================================
function initEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded');
        return;
    }
    
    // Initialize with public key
    try {
        emailjs.init("kcfQ4oTXD-9-ckF5a");
    } catch (e) {
        console.error('EmailJS init failed:', e);
        return;
    }
    
    const form = document.getElementById("contact-form");
    if (!form) return;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send';
    
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Validate
        if (!validateForm(form)) return;
        
        // Loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
        }
        
        // Get form data
        const formData = new FormData(form);
        const params = {
            from_name: formData.get('name') || '',
            from_email: formData.get('email') || '',
            phone: formData.get('phone') || 'Not provided',
            project_type: formData.get('project_type') || 'Not specified',
            message: formData.get('message') || '',
            to_email: COMPANY.email,
            reply_to: formData.get('email') || ''
        };
        
        console.log('Sending email with params:', params);
        
        // Send email
        emailjs.send("service_5o6z66k", "template_imj3sps", params)
            .then(function(response) {
                console.log('EmailJS SUCCESS:', response);
                showNotification("✓ Message sent successfully! We'll contact you within 24 hours.", "success");
                form.reset();
            }, function(error) {
                console.error('EmailJS FAILED:', error);
                showNotification("✗ Failed to send. Please call us directly at " + COMPANY.formatted, "error");
            })
            .finally(function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
    });
}

function validateForm(form) {
    let isValid = true;
    const required = form.querySelectorAll('[required]');
    
    required.forEach(field => {
        // Remove existing errors
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'This field is required');
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.classList.add('error');
                showFieldError(field, 'Please enter a valid email');
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    field.parentNode.appendChild(error);
}

// ==========================================
// WHATSAPP BUTTON - SHOW NUMBER
// ==========================================
function initWhatsAppButton() {
    const waBtn = document.querySelector('.wa-btn');
    const floating = document.querySelector('.floating');
    if (!waBtn || !floating) return;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'wa-tooltip';
    tooltip.innerHTML = `
        <div class="wa-number">${COMPANY.formatted}</div>
        <div class="wa-text">Click to chat</div>
    `;
    floating.insertBefore(tooltip, waBtn);
    
    // Update all WhatsApp links
    const waLinks = document.querySelectorAll('a[href*="wa.me"]');
    waLinks.forEach(link => {
        const cleanNumber = COMPANY.whatsapp.replace(/\D/g, '');
        const message = encodeURIComponent("Hello Motsomalo Holdings, I would like to inquire about your services.");
        link.href = `https://wa.me/${cleanNumber}?text=${message}`;
    });
    
    // Show/hide tooltip
    waBtn.addEventListener('mouseenter', () => tooltip.classList.add('show'));
    floating.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(message, type) {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close">&times;</button>
    `;
    
    document.body.appendChild(notif);
    
    // Animate in
    setTimeout(() => notif.classList.add('show'), 10);
    
    // Close button
    notif.querySelector('.notification-close').addEventListener('click', () => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    });
    
    // Auto close
    setTimeout(() => {
        if (notif.parentNode) {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }
    }, 6000);
}

// ==========================================
// UTILITIES
// ==========================================
function updateCopyright() {
    const yearEl = document.querySelector('.current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
