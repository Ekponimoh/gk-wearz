"use strict";
const slides = [
  {
    heading: "Handcrafted Shoes. Timeless Style",
    title:
      "Step into confidence with artisan-crafted footwear designed for comfort, elegance, and durability.",
    button: "Explore Our Story", //ABOUT US PAGE
    link: "about.html", //ABOUT US PAGE
    bg: "img/hero-large.jpeg",
  },

  {
    heading: "Luxury You Can Walk In.",
    title:
      "From handpicked leather to meticulous stiching, GK Wearz is redefining footwear craftmanship.",
    button: "Browse Collection",
    link: "product.html", //SHOP PAGE
    bg: "img/img1-large.jpg",
  },
];

let current = 0;
const hero = document.getElementById("hero");
const heading = document.getElementById("hero-heading");
const title = document.getElementById("hero-title");
const button = document.getElementById("hero-button");

function updateHero() {
  const slide = slides[current];
  hero.style.backgroundImage = `url(${slide.bg})`;
  heading.textContent = slide.heading;
  title.textContent = slide.title;
  button.textContent = slide.button;
  button.href = slide.link;
  // preload image to avoid flicker
  slides.forEach((slide) => {
    const img = new Image();
    img.src = slide.bg;
  });
}

updateHero();

setInterval(() => {
  current = (current + 1) % slides.length;
  updateHero();
}, 6000);

const heroEl = document.getElementById("hero");
const overlay = document.createElement("div");
overlay.style.position = "absolute";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(13, 94, 78, 0.6)"; // Adjust opacity as needed
overlay.style.zIndex = "1";

// MAKE HERO CONTENT STAY ABOVE OVERLAY
heroEl.style.position = "relative";
Array.from(heroEl.children).forEach((child) => {
  child.style.position = "relative";
  child.style.zIndex = "2";
});

heroEl.appendChild(overlay);

// TO ADD THE ACTIVE LINK ON EACH ELEMENT
const headerLinks = document.querySelectorAll(".header__nav-link");
headerLinks.forEach((link) => {
  link.addEventListener("click", () => {
    headerLinks.forEach((I) => I.classList.remove("active"));
    link.classList.add("active");
  });
});

// // FORM ALERT FOR NOW
// document
//   .querySelector(".newsletter__form")
//   .addEventListener("submit", function () {
//     alert("Thanks for subscribing! you'll hear from us soon.");
//   });

// Render cart items
function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty.</li>";
    return;
  }

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price} (${item.color})`;
    cartList.appendChild(li);
  });
}
