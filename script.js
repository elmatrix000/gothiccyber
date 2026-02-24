function openModal(img){
document.getElementById("modal").style.display="flex";
document.getElementById("modalImg").src=img.src;
}

function closeModal(){
document.getElementById("modal").style.display="none";
}

document.querySelectorAll("[data-carousel]").forEach(carousel=>{
const track = carousel.querySelector(".track");
const slides = track.children;
let index = 0;

function update(){
track.style.transform = "translateX(-"+(index*100)+"%)";
}

carousel.querySelector(".next").addEventListener("click",()=>{
index = (index+1)%slides.length;
update();
});

carousel.querySelector(".prev").addEventListener("click",()=>{
index = (index-1+slides.length)%slides.length;
update();
});

setInterval(()=>{
index = (index+1)%slides.length;
update();
},4000);
});
