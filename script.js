function openLightbox(img) {
    document.getElementById("lightbox").style.display = "flex";
    document.getElementById("lightbox-img").src = img.src;
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

const faders = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("appear");
        }
    });
});

faders.forEach(el => observer.observe(el));

document.getElementById('consultation-form').addEventListener('submit', function(e) {
    e.preventDefault();

    emailjs.sendForm(
        'PASTE_YOUR_SERVICE_ID',
        'PASTE_YOUR_TEMPLATE_ID',
        this
    )
    .then(function() {
        alert('Consultation request sent successfully!');
        document.getElementById('consultation-form').reset();
    }, function() {
        alert('Failed to send. Please try again.');
    });
});
