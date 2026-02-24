function scrollSlider(button, direction) {
    const slider = button.parentElement.querySelector(".slider");
    const scrollAmount = slider.clientWidth * 0.8;
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth"
    });
}
