const swiper1 = new Swiper(".projectSwiper1", {

loop:true,

autoplay:{
delay:3000
},

slidesPerView:1,

spaceBetween:20

});

const swiper2 = new Swiper(".projectSwiper2", {

loop:true,

autoplay:{
delay:3000
},

slidesPerView:1,

spaceBetween:20

});


emailjs.init("kcfQ4oTXD-9-ckF5a");

document.getElementById("contact-form")
.addEventListener("submit", function(e){

e.preventDefault();

emailjs.sendForm(
"service_5o6z66k",
"template_imj3sps",
this
).then(function(){

alert("Consultation request sent successfully");

}, function(){

alert("Failed to send message");

});

});
