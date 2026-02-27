(function() {
  emailjs.init("kcfQ40TXD-9-ckF5a");
})();

document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  emailjs.sendForm("service_5o6z66k", "template_imj3sps", this)
    .then(() => {
      alert("Message sent successfully!");
      this.reset();
    }, (err) => {
      alert("Error sending message: " + JSON.stringify(err));
    });
});
