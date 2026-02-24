function scrollSlider(id, direction) {
    const slider = document.getElementById(id);
    const scrollAmount = 350;
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

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
