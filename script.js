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
    initWhatsAppButton();
});

// Company Contact Information
const COMPANY_INFO = {
    phone: '+27789685258',
    whatsapp: '+27789685258', // Same as phone
    email: 'MzwakheKhumalo91@gmail.com',
    address: '3331 Thandekile Drive, Kagiso, Krugersdorp, 1754'
};

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
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
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

                if (nav.classList.contains('nav-open')) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
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
                }, index * 100);
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
    // Initialize EmailJS with your public key
    emailjs.init("kcfQ4oTXD-9-ckF5a");

    const form = document.getElementById("contact-form");
    const submitBtn = form?.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;

    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm(form)) {
                return;
            }

            // Loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            }

            // Prepare template parameters
            const formData = new FormData(form);
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                phone: formData.get('phone') || 'Not provided',
                project_type: formData.get('project_type') || 'Not specified',
                message: formData.get('message'),
                to_email: COMPANY_INFO.email,
                reply_to: formData.get('email')
            };

            try {
                // Send using send method instead of sendForm for better control
                await emailjs.send(
                    "service_5o6z66k",
                    "template_imj3sps",
                    templateParams
                );
                
                showNotification("Success! Your consultation request has been sent. We'll contact you within 24 hours.", "success");
                form.reset();
                
                // Track successful submission (optional analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'contact',
                        'event_label': 'consultation_request'
                    });
                }
                
            } catch (error) {
                console.error('EmailJS Error:', error);
                showNotification("Failed to send message. Please try again or contact us directly via phone/WhatsApp.", "error");
                
                // Show alternative contact methods on error
                showAlternativeContact();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'This field is required');
        } else {
            field.classList.remove('error');
            removeFieldError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.classList.add('error');
                showFieldError(field, 'Please enter a valid email address');
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    removeFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showAlternativeContact() {
    const alternatives = document.querySelector('.contact-alternatives');
    if (alternatives) {
        alternatives.style.animation = 'pulse 0.5s ease';
        alternatives.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ==========================================
// WHATSAPP BUTTON - Show number on hover/click
// ==========================================
function initWhatsAppButton() {
    const waBtn = document.querySelector('.wa-btn');
    const floatingContainer = document.querySelector('.floating');
    
    if (waBtn && floatingContainer) {
        // Create number display element
        const numberDisplay = document.createElement('div');
        numberDisplay.className = 'wa-number-display';
        numberDisplay.innerHTML = `
            <span class="wa-number">${formatPhoneNumber(COMPANY_INFO.whatsapp)}</span>
            <span class="wa-label">Click to chat</span>
        `;
        
        // Insert before the button
        floatingContainer.insertBefore(numberDisplay, waBtn);
        
        // Update href with proper WhatsApp API
        waBtn.href = `https://wa.me/${COMPANY_INFO.whatsapp.replace(/\+/g, '')}?text=Hello%20Motsomalo%20Holdings,%20I%20would%20like%20to%20inquire%20about%20your%20services.`;
        
        // Show number on hover
        waBtn.addEventListener('mouseenter', () => {
            numberDisplay.classList.add('show');
        });
        
        floatingContainer.addEventListener('mouseleave', () => {
            numberDisplay.classList.remove('show');
        });
        
        // Mobile tap to show
        waBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // On mobile, toggle number display
                e.preventDefault();
                numberDisplay.classList.toggle('show');
                
                // If showing, open WhatsApp after delay
                if (numberDisplay.classList.contains('show')) {
                    setTimeout(() => {
                        window.open(waBtn.href, '_blank');
                    }, 1000);
                }
            }
        });
    }
    
    // Update all WhatsApp links on page
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        const currentHref = link.getAttribute('href');
        if (currentHref && !currentHref.includes(COMPANY_INFO.whatsapp.replace(/\+/g, ''))) {
            link.href = `https://wa.me/${COMPANY_INFO.whatsapp.replace(/\+/g, '')}`;
        }
    });
}

function formatPhoneNumber(number) {
    // Format: +27 (78) 968-5258
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('27')) {
        return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return number;
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });

    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 6000);
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

// Update copyright year automatically
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
