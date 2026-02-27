var swiper1 = new Swiper(".mySwiper1", {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".mySwiper1 .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".mySwiper1 .swiper-button-next",
    prevEl: ".mySwiper1 .swiper-button-prev",
  },
});

var swiper2 = new Swiper(".mySwiper2", {
  loop: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".mySwiper2 .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".mySwiper2 .swiper-button-next",
    prevEl: ".mySwiper2 .swiper-button-prev",
  },
});
