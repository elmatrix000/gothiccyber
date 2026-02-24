// Auto Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const update = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 100;

        if(count < target){
            counter.innerText = Math.ceil(count + increment);
            setTimeout(update, 20);
        } else {
            counter.innerText = target;
        }
    }
    update();
});

// Auto Slide
document.querySelectorAll('.slider').forEach(slider=>{
    setInterval(()=>{
        slider.scrollBy({left:500,behavior:'smooth'});
    },4000);
});

// Modal
function openModal(src){
    document.getElementById("imageModal").style.display="flex";
    document.getElementById("modalImg").src=src;
}
function closeModal(){
    document.getElementById("imageModal").style.display="none";
}
