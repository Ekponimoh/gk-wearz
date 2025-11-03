"use strict";

const products = [
  {
    id: 1,
    title: "GK Elegant Leather Sneaker",
    price: "$120.00",
    desc: "A handcrafted leather sneaker for women.",
    images: ["img/gk-large.jpg", "img/hero-large.jpeg", "img/img2-large.jpeg"],
  },
  {
    id: 2,
    title: "GK real Street Runner",
    price: "$110.00",
    desc: "A sporty men's sneaker with style.",
    images: ["img/img2-large.jpeg", "img/img2-large.jpeg"],
  },

  {
    id: 3,
    title: "GK Street foot Runner",
    price: "$180.00",
    desc: "A sporty men's sneaker with style.",
    images: ["img/img3-large.jpeg", "img/img3-large.jpeg"],
  },

  {
    id: 4,
    title: "GK Street wearz",
    price: "$150.00",
    desc: "A sporty Wommen's sneaker with style.",
    images: ["img/ladies-1-large.jpeg", "img/ladies-1-large.jpeg"],
  },

  {
    id: 5,
    title: "GK Street Runner",
    price: "$150.00",
    desc: "A sporty men's sneaker with style.",
    images: ["img/ladies-2-large.jpeg", "img/ladies-2-large.jpeg"],
  },

  {
    id: 6,
    title: "GK Street Runner",
    price: "$170.00",
    desc: "A sporty Women's sneaker with style.",
    images: ["img/ladies-3-large.jpeg", "img/ladies-3-large.jpeg"],
  },

  {
    id: 7,
    title: "GK Street Runner",
    price: "$130.00",
    desc: "A sporty Women's sneaker with style.",
    images: ["img/ladies-4-large.jpeg", "img/ladies-4-large.jpeg"],
  },

  {
    id: 8,
    title: "GK Street Runner",
    price: "$130.00",
    desc: "A sporty men's sneaker with style.",
    images: ["img/img4-mini.jpeg", "img/img4-mini.jpeg"],
  },

  {
    id: 9,
    title: "GK Street Runner",
    price: "$130.00",
    desc: "A sporty men's sneaker with style.",
    images: ["img/hero-large.jpeg", "img/hero-large.jpeg"],
  },

  {
    id: 10,
    title: "GK Street Runner",
    price: "$100.00",
    desc: "A sporty men's sneaker with style.",
    images: ["img/ladies-5-large.jpeg", "img/ladies-5-large.jpeg"],
  },

  {
    id: 11,
    title: "GK Street Runner",
    price: "$100.00",
    desc: "A sporty men's sneaker with style.",
    images: ["img/img5-large.jpeg", "img/img5-large.jpeg"],
  },
];

function loadProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  document.getElementById("main-image").src = product.images[0];
  document.getElementById("product-title").textContent = product.title;
  document.getElementById("product-price").textContent = product.price;
  document.getElementById("product-desc").textContent = product.desc;

  const thumbContainer = document.getElementById("thumbnails");
  thumbContainer.innerHTML = "";
  product.images.forEach((img, i) => {
    const thumb = document.createElement("img");
    thumb.src = img;
    thumb.className = "thumb" + (i === 0 ? " active" : "");
    thumb.addEventListener("click", () => {
      document.getElementById("main-image").src = img;
      document
        .querySelectorAll(".thumb")
        .forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
    thumbContainer.appendChild(thumb);
  });
}

// Attach click events to product cards
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", () => {
    const productId = parseInt(card.dataset.id);
    loadProduct(productId);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Load the first product on page load
loadProduct(1);

// LOAD IMAGE
document.querySelectorAll(".shop-grid img").forEach((img) => {
  img.addEventListener("load", () => {
    img.classList.add("loaded");
  });
});

