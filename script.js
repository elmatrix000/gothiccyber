// Project sliders

new Swiper(".projectSwiper1",{

loop:true,

autoplay:{
delay:3000
},

slidesPerView:1,

spaceBetween:20

});

new Swiper(".projectSwiper2",{

loop:true,

autoplay:{
delay:3000
},

slidesPerView:1,

spaceBetween:20

});


// COUNTER ANIMATION

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

counter.innerText = "0";

const updateCounter = () => {

const target = +counter.getAttribute("data-target");

const c = +counter.innerText;

const increment = target / 200;

if(c < target){

counter.innerText = `${Math.ceil(c + increment)}`;

setTimeout(updateCounter,10);

}

else{

counter.innerText = target;

}

};

updateCounter();

});


// EMAILJS

emailjs.init("kcfQ4oTXD-9-ckF5a");

document.getElementById("contact-form")
.addEventListener("submit",function(e){

e.preventDefault();

emailjs.sendForm(
"service_5o6z66k",
"template_imj3sps",
this
).then(function(){

alert("Consultation request sent successfully");

},function(){

alert("Message failed. Try again.");

});

});
