// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initSwipers();
    initCounters();
    initNavigation();
    initEmailJS();
});

// Contact Info
const PHONE = '+27789685258';
const WHATSAPP = '+27789685258';
const EMAIL = 'MzwakheKhumalo91@gmail.com';

// Swiper Sliders
function initSwipers() {
    if (typeof Swiper === 'undefined') return;
    
    new Swiper('.projectSwiper1', {
        loop: true,
        autoplay: { delay: 3000 },
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: { clickable: true, el: '.swiper-pagination' },
        navigation: {
            nextEl: '.swiper-button-next-1',
            prevEl: '.swiper-button-prev-1'
        }
    });

    new Swiper('.projectSwiper2', {
        loop: true,
        autoplay: { delay: 3000 },
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: { clickable: true, el: '.swiper-pagination' },
        navigation: {
            nextEl: '.swiper-button-next-2',
            prevEl: '.swiper-button-prev-2'
        }
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.innerText = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCounter();
    });
}

// Mobile Navigation
function initNavigation() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
            menuBtn.classList.toggle('active');
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                nav.classList.remove('nav-open');
                menuBtn.classList.remove('active');
            }
        });
    });
}

// EmailJS Contact Form
function initEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.log('EmailJS not loaded');
        return;
    }
    
    emailjs.init("kcfQ4oTXD-9-ckF5a");
    
    const form = document.getElementById("contact-form");
    if (!form) return;
    
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending...';
        btn.disabled = true;
        
        emailjs.sendForm("service_5o6z66k", "template_imj3sps", this)
            .then(() => {
                alert("Message sent successfully!");
                form.reset();
            }, (error) => {
                alert("Failed to send. Please call " + PHONE);
                console.log(error);
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    });
}
