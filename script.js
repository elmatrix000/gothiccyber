/* ============================= */
/* SWIPER INITIALIZATION */
/* ============================= */

document.addEventListener("DOMContentLoaded", function () {

  const swiperContainers = document.querySelectorAll(".swiper-container");

  swiperContainers.forEach(container => {

    new Swiper(container, {
      loop: true,
      speed: 800,
      spaceBetween: 20,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: container.querySelector(".swiper-button-next"),
        prevEl: container.querySelector(".swiper-button-prev"),
      },
      pagination: {
        el: container.querySelector(".swiper-pagination"),
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 1
        },
        1200: {
          slidesPerView: 1
        }
      }
    });

  });

});


/* ============================= */
/* SMOOTH SCROLL */
/* ============================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});


/* ============================= */
/* CONTACT FORM FEEDBACK */
/* ============================= */

const contactForm = document.getElementById("contact-form");

if (contactForm) {

  contactForm.addEventListener("submit", function () {

    const button = contactForm.querySelector("button");

    button.innerHTML = "Sending...";
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = "Message Sent ✔";
    }, 2000);

  });

}
