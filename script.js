let currentIndex = 0;
let images = [];

document.addEventListener("DOMContentLoaded", function() {

    images = Array.from(document.querySelectorAll(".gallery img"));

    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            openLightbox(index);
        });
    });

});

function openLightbox(index) {
    currentIndex = index;
    document.getElementById("lightbox").style.display = "flex";
    updateImage();
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

function changeSlide(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;

    updateImage();
}

function updateImage() {
    const lightboxImg = document.getElementById("lightbox-img");
    const counter = document.getElementById("image-counter");

    lightboxImg.src = images[currentIndex].src;
    counter.innerText = (currentIndex + 1) + " / " + images.length;
}

/* Swipe Support */
let startX = 0;

document.getElementById("lightbox").addEventListener("touchstart", function(e) {
    startX = e.touches[0].clientX;
});

document.getElementById("lightbox").addEventListener("touchend", function(e) {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) changeSlide(1);
    if (endX - startX > 50) changeSlide(-1);
});

/* EmailJS */
document.getElementById('consultation-form').addEventListener('submit', function(e) {
    e.preventDefault();

    emailjs.sendForm(
        'service_506z66k',
        'template_motsomalo_consult',
        this
    )
    .then(function() {
        alert('Consultation request sent successfully!');
        document.getElementById('consultation-form').reset();
    }, function(error) {
        alert('Failed to send. Please try again.');
        console.log(error);
    });
});
