document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initSwipers();
    initProjectTabs();
    initEmailJS();
    initFab();
});

// Header scroll effect
function initHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile menu
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// Swipers
function initSwipers() {
    if (typeof Swiper === 'undefined') return;
    
    new Swiper('.projectSwiper1', {
        loop: true,
        autoplay: { delay: 4000 },
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: {
            nextEl: '.swiper-button-next-1',
            prevEl: '.swiper-button-prev-1'
        }
    });

    new Swiper('.projectSwiper2', {
        loop: true,
        autoplay: { delay: 4000 },
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: {
            nextEl: '.swiper-button-next-2',
            prevEl: '.swiper-button-prev-2'
        }
    });
}

// Project tabs
function initProjectTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById('tab-' + target).classList.add('active');
        });
    });
}

// EmailJS
function initEmailJS() {
    if (typeof emailjs === 'undefined') return;
    
    emailjs.init("kcfQ4oTXD-9-ckF5a");
    
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        
        emailjs.sendForm("service_5o6z66k", "template_imj3sps", this)
            .then(() => {
                alert('Message sent successfully! We will contact you soon.');
                form.reset();
            }, (err) => {
                alert('Failed to send. Please call us at +27 (78) 968-5258');
                console.log(err);
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    });
}

// FAB (Floating Action Button)
function initFab() {
    const fab = document.getElementById('fabMain');
    const container = document.querySelector('.fab-container');
    
    fab.addEventListener('click', () => {
        container.classList.toggle('active');
        fab.classList.toggle('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            container.classList.remove('active');
            fab.classList.remove('active');
        }
    });
}
