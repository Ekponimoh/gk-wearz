"use strict";

// TO MAKE THE NAV BUTTON TOGGLE
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const btnNav = document.querySelector(".header__mobile-btn");
  const btnClose = document.querySelector(".header__mobile-btn-close");
  const overlay = document.querySelector(".header__overlay");
  const navLinks = document.querySelectorAll(".header__nav-link");

  // Toggle nav
  btnNav.addEventListener("click", () => {
    header.classList.toggle("open");
  });

  // Close nav when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("open");
    });
  });

  // To close the nav
  btnClose.addEventListener("click", () => {
    header.classList.remove("open");
  });

  // Optional: close when clicking outside
  overlay.addEventListener("click", () => {
    header.classList.remove("open");
  });
});

// // FORM SUBMMISSION

// document.getElementById("contact").addEventListener("submit", function (e) {
//   e.preventDefault();

//   const form = e.target;
//   const data = new FormData(form);

//   fetch("/", {
//     method: "POST",
//     body: data,
//   })
//     .then(() => {
//       form.style.display = "none";

//       document.getElementById("successMessage").style.display = "block";
//     })
//     .catch((error) => {
//       alert("opps! something went wrong.");
//       console.log(error);
//     });
// });

// ADDING TO WISHLIST
document.addEventListener("DOMContentLoaded", () => {
  /********
   *  CONFIG / STATE  *
   ********/
  // single source of truth
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  /********
   *  SELECT ELEMENTS *
   ********/
  const cartCountEl = document.getElementById("cart-count");
  const wishlistCountEl = document.getElementById("wishlist-count");
  const cartListEl = document.getElementById("cart-list");
  const wishlistListEl = document.getElementById("wishlist-list");
  const cartTotalEl = document.getElementById("cart-total");

  const cartSidebar = document.querySelector(".cart-sidebar");
  const wishlistSidebar = document.querySelector(".wishlist-sidebar");
  const overlay = document.querySelector(".cart-overlay");

  // header icons/buttons (may be one or many)
  const cartIcons = document.querySelectorAll(".cart-icon");
  const wishlistHeaderButtons = document.querySelectorAll(
    ".wishlist-icon-btn, .wishlist"
  ); // if you have a header heart wrapper

  /********
   *  UTIL HELPERS    *
   ********/
  const parsePrice = (s) => {
    if (!s) return 0;
    return Number(String(s).replace(/[^0-9.-]+/g, "")) || 0;
  };

  const formatCurrency = (n) => {
    // basic formatting, preserves cents
    return "$" + Number(n).toFixed(2);
  };

  const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  };
  const saveWishlist = () => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
  };

  const totalQty = () => cart.reduce((s, i) => s + (i.quantity || 0), 0);
  const totalSum = () =>
    cart.reduce((s, i) => s + parsePrice(i.price) * (i.quantity || 0), 0);

  /********
   *  READ PRODUCT UI *
   ********/
  function readProductData(productEl) {
    if (!productEl) return null;
    // search common selectors (you use .heading-3 for title)
    const id =
      productEl.dataset.id || productEl.getAttribute("data-id") || null;
    const titleNode = productEl.querySelector(
      ".product-title, .heading-3, h3, h1, #product-title"
    );
    const priceNode = productEl.querySelector(
      ".product-price, .price, p.price, #product-price"
    );
    const imgNode = productEl.querySelector("img");

    return {
      id: id || (titleNode ? titleNode.textContent.trim() : null),
      name: titleNode ? titleNode.textContent.trim() : id || "Product",
      price: priceNode ? priceNode.textContent.trim() : "$0",
      image: imgNode
        ? imgNode.getAttribute("src") || imgNode.getAttribute("data-src") || ""
        : "",
    };
  }

  /********
   *  RENDER HELPERS  *
   ********/
  function updateCartCount() {
    if (!cartCountEl) return;
    cartCountEl.textContent = totalQty();
  }
  function updateWishlistCount() {
    if (!wishlistCountEl) return;
    wishlistCountEl.textContent = wishlist.length;
  }

  function renderCart() {
    if (!cartListEl) return;
    cartListEl.innerHTML = "";

    if (!cart.length) {
      cartListEl.innerHTML = '<li class="empty">Your cart is empty.</li>';
      if (cartTotalEl) cartTotalEl.textContent = "$0.00";
      return;
    }

    // build list
    cart.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.dataset.index = idx;

      li.innerHTML = `
        <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
          <div style="display:flex;align-items:center;gap:30px;flex:1;">
            ${
              item.image
                ? `<img src="${item.image}" alt="${item.name}" style="width:200px;height:200px;object-fit:cover;border-radius:6px;">`
                : ""
            }
            <div style="flex:1">
              <div style="font-weight:600; font-size:2rem;">${escapeHtml(
                item.name
              )}</div>
              <div style="font-size:2rem;color:#666; font-weight:600; ">${escapeHtml(
                item.price
              )}</div>
              <div style="margin-top:6px;display:flex;align-items:center;gap:8px;">
                <button class="decrease-qty" style="border:none; background-color:#0d5e4e; color:#fff;  width:5rem; height:5rem;  border-radius:100%; font-size:2rem;" data-idx="${idx}">−</button>
                <span class="qty-display" style="font-size:3rem;" data-idx="${idx}">${
        item.quantity
      }</span>
                <button class="increase-qty" style="border:none; background-color:#0d5e4e;  color:#fff; width:5rem;  height:5rem;  border-radius:100%; font-size:2rem;" data-idx="${idx}">+</button>
              </div>
            </div>
          </div>
          <div>
            <button class="remove-item" data-idx="${idx}" style="background:none;border:none;color:#0d5e4e;font-size:2rem;cursor:pointer;">✕</button>
          </div>
        </div>
      `;
      cartListEl.appendChild(li);
    });

    if (cartTotalEl) cartTotalEl.textContent = formatCurrency(totalSum());
  }

  function renderWishlist() {
    if (!wishlistListEl) return;
    wishlistListEl.innerHTML = "";

    if (!wishlist.length) {
      wishlistListEl.innerHTML =
        '<li class="empty">Your wishlist is empty.</li>';
      updateWishlistCount();
      syncHearts();
      return;
    }

    wishlist.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "wishlist-item";
      li.dataset.idx = idx;

      li.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;flex:1;">
          ${
            item.image
              ? `<img src="${item.image}" alt="${item.name}" style="width:200px;height:200px;object-fit:cover;border-radius:6px;">`
              : ""
          }
          <div>
            <div style="font-weight:600; font-size:2rem">${escapeHtml(
              item.name
            )}</div>
            <div style="font-size:2rem;color:#666">${escapeHtml(
              item.price
            )}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="move-to-cart" data-idx="${idx}" style=" width:5rem; height:5rem; font-size:2rem;  background:#0d5e4e;color:#fff;padding:6px;border:none;border-radius:6px;cursor:pointer;">🛒</button>
          <button class="remove-wishlist" data-idx="${idx}" style=" width:5rem;  height:5rem; font-size:2rem; background:#1abc9c;color:#fff;padding:6px;border:none;border-radius:6px;cursor:pointer;">✕</button>
        </div>
      `;
      wishlistListEl.appendChild(li);
    });

    updateWishlistCount();
    syncHearts();
  }

  // ensure hearts reflect wishlist state
  function syncHearts() {
    document.querySelectorAll(".wishlist-icon").forEach((icon) => {
      const product = icon.closest(".product-card");
      if (!product) return;
      const pd = readProductData(product);
      const exists = wishlist.some(
        (i) => (i.id || i.name) === (pd.id || pd.name)
      );
      icon.classList.toggle("saved", !!exists);
    });
  }

  // simple html escape for safety
  function escapeHtml(str) {
    return String(str || "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  /********
   *  DELEGATED CLICK HANDLER
   *  (handles add-to-cart, wishlist toggle, cart/wishlist buttons)
   ********/
  document.body.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-to-cart");
    if (addBtn) {
      e.preventDefault();
      const product = addBtn.closest(".product-card, .product-info, .product");
      const pd = readProductData(product);
      if (!pd) return;

      // find by id if available, otherwise by name
      const key = pd.id || pd.name;
      const existing = cart.find((i) => (i.id || i.name) === key);
      if (existing) existing.quantity = (existing.quantity || 0) + 1;
      else
        cart.push({
          id: pd.id,
          name: pd.name,
          price: pd.price,
          image: pd.image,
          quantity: 1,
        });

      saveCart();
      renderCart();
      // open cart
      openSidebar(cartSidebar);
      return;
    }

    // wishlist toggle (heart on product)
    const heart = e.target.closest(".wishlist-icon");
    if (heart) {
      e.preventDefault();
      const product = heart.closest(".product-card, .product-info, .product");
      const pd = readProductData(product);
      if (!pd) return;

      const key = pd.id || pd.name;
      const idx = wishlist.findIndex((i) => (i.id || i.name) === key);
      if (idx > -1) {
        wishlist.splice(idx, 1);
        heart.classList.remove("saved");
      } else {
        wishlist.push({
          id: pd.id,
          name: pd.name,
          price: pd.price,
          image: pd.image,
        });
        heart.classList.add("saved");
      }
      saveWishlist();
      renderWishlist();
      // optionally open wishlist sidebar:
      // openSidebar(wishlistSidebar);
      return;
    }

    // clicks inside cart list (increase/decrease/remove)
    if (e.target.closest("#cart-list")) {
      const inc = e.target.closest(".increase-qty");
      const dec = e.target.closest(".decrease-qty");
      const rem = e.target.closest(".remove-item");
      // old generated buttons used specific class names - we add handlers below in delegation
    }

    // clicks inside wishlist list (move-to-cart or remove)
    if (e.target.closest("#wishlist-list")) {
      const moveBtn = e.target.closest(".move-to-cart");
      const removeWBtn = e.target.closest(".remove-wishlist");

      if (moveBtn) {
        const idx = Number(moveBtn.dataset.idx);
        const item = wishlist[idx];
        if (!item) return;

        // add to cart (match structure)
        const key = item.id || item.name;
        const existing = cart.find((i) => (i.id || i.name) === key);
        if (existing) existing.quantity = (existing.quantity || 0) + 1;
        else
          cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
          });

        saveCart();

        // remove from wishlist
        wishlist = wishlist.filter((_, i) => i !== idx);
        saveWishlist();

        renderCart();
        renderWishlist();
        openSidebar(cartSidebar);
        return;
      }

      if (removeWBtn) {
        const idx = Number(removeWBtn.dataset.idx);
        wishlist = wishlist.filter((_, i) => i !== idx);
        saveWishlist();
        renderWishlist();
        return;
      }
    }
  });

  /********
   *  CART LIST EVENT DELEGATION (buttons inside list)
   ********/
  // Because cart list items are dynamically created, bind events on the container using delegation:
  (function bindCartListDelegation() {
    if (!cartListEl) return;
    cartListEl.addEventListener("click", (e) => {
      const inc = e.target.closest(".increase-qty");
      const dec = e.target.closest(".decrease-qty");
      const rem = e.target.closest(".remove-item");
      if (inc) {
        const idx = Number(inc.dataset.idx);
        if (!Number.isNaN(idx) && cart[idx]) {
          cart[idx].quantity = (cart[idx].quantity || 0) + 1;
          saveCart();
          renderCart();
        }
      } else if (dec) {
        const idx = Number(dec.dataset.idx);
        if (!Number.isNaN(idx) && cart[idx]) {
          if ((cart[idx].quantity || 0) > 1) cart[idx].quantity--;
          else cart.splice(idx, 1);
          saveCart();
          renderCart();
        }
      } else if (rem) {
        const idx = Number(rem.dataset.idx);
        if (!Number.isNaN(idx)) {
          cart.splice(idx, 1);
          saveCart();
          renderCart();
        }
      }
    });
  })();

  /********
   *  SIDEBAR CONTROLS
   ********/
  function openSidebar(sidebar) {
    // close others
    if (cartSidebar) cartSidebar.classList.remove("open");
    if (wishlistSidebar) wishlistSidebar.classList.remove("open");

    if (sidebar === cartSidebar && cartSidebar) {
      cartSidebar.classList.add("open");
    } else if (sidebar === wishlistSidebar && wishlistSidebar) {
      wishlistSidebar.classList.add("open");
    }
    if (overlay) overlay.style.display = "block";
  }
  function closeSidebars() {
    if (cartSidebar) cartSidebar.classList.remove("open");
    if (wishlistSidebar) wishlistSidebar.classList.remove("open");
    if (overlay) overlay.style.display = "none";
  }

  // make header icons open sidebars
  cartIcons.forEach((ci) =>
    ci.addEventListener("click", () => {
      renderCart();
      openSidebar(cartSidebar);
    })
  );
  wishlistHeaderButtons.forEach((wb) =>
    wb.addEventListener("click", () => {
      renderWishlist();
      openSidebar(wishlistSidebar);
    })
  );

  // overlay and close buttons
  document
    .querySelectorAll(".close-cart, .close-wishlist")
    .forEach((btn) => btn.addEventListener("click", closeSidebars));
  if (overlay) overlay.addEventListener("click", closeSidebars);

  // allow clicking the count badges to open sidebars
  if (cartCountEl)
    cartCountEl.addEventListener("click", () => {
      renderCart();
      openSidebar(cartSidebar);
    });
  if (wishlistCountEl)
    wishlistCountEl.addEventListener("click", () => {
      renderWishlist();
      openSidebar(wishlistSidebar);
    });

  /********
   *  INIT (render + sync)
   ********/
  // ensure counts shown correctly on load
  updateCartCount();
  updateWishlistCount();
  renderCart();
  renderWishlist();
  syncHearts();

  // expose for debugging (optional)
  window.__GK = {
    cart,
    wishlist,
    renderCart,
    renderWishlist,
    saveCart,
    saveWishlist,
    openSidebar,
    closeSidebars,
  };
});

//
const cartSidebar = document.querySelector(".cart-sidebar");
const cartOverlay = document.querySelector(".cart-overlay");
const openCartBtn = document.querySelector(".header__count"); // cart count in header
const closeCartBtn = document.querySelector(".close-cart"); // close button inside cart

// WISHLIST
const wishlistSidebar = document.querySelector(".wishlist-idebar");
const wishlistOverlay = document.querySelector(".wishlist-overlay");
const openWishlistBtn = document.querySelector(".header__count"); // cart count in header
const closeWishlistBtn = document.querySelector(".close-cart"); // close button inside cart

// Open Cart
openCartBtn?.addEventListener("click", () => {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("show");
});

// Close Cart
closeCartBtn?.addEventListener("click", () => {
  closeCart();
});
cartOverlay?.addEventListener("click", () => {
  closeCart();
});

// Close function
function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("show");
}
//

// Open Cart
openWishlistBtn?.addEventListener("click", () => {
  wishlistSidebar.classList.add("open");
  wishlistOverlay.classList.add("show");
});

// Close Cart
closeWishlistBtn?.addEventListener("click", () => {
  closeCart();
});
wishlistOverlay?.addEventListener("click", () => {
  closeCart();
});

// Close function
function closeCart() {
  wishlistSidebar.classList.remove("open");
  wishlistOverlay.classList.remove("show");
}

// FADE INS
const fadeIns = document.querySelectorAll(".fade-in");

const appearOnScroll = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.3,
  }
);

fadeIns.forEach((el) => appearOnScroll.observe(el));

//Animate why choose us icon
// Animate icons when scrolled into view
document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll(".animate-icon");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.3 } // trigger when 30% is visible
  );

  icons.forEach((icon) => observer.observe(icon));
});

// TESTIMONIAL CHANGE
const testimonials = document.querySelectorAll(".testimonial__card");
let index = 0;

function showTestimonial() {
  testimonials.forEach((t, i) => {
    t.classList.remove("active");
    if (i === index) t.classList.add("active");
  });
  index = (index + 1) % testimonials.length; // loop back to start
}

setInterval(showTestimonial, 3000);

// ACCORDION
document.querySelectorAll(".faq__flex").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const faqItem = trigger.closest(".faq__item");
    const answer = faqItem.querySelector(".faq__answer");

    if (faqItem.classList.contains("active")) {
      // Closing
      answer.style.maxHeight = answer.scrollHeight + "px"; // set current height
      requestAnimationFrame(() => {
        answer.style.maxHeight = "0"; // then collapse
      });
      faqItem.classList.remove("active");
    } else {
      // Opening
      answer.style.maxHeight = answer.scrollHeight + "px";
      faqItem.classList.add("active");

      // Reset to "auto" after transition ends (so it resizes properly)
      answer.addEventListener(
        "transitionend",
        () => {
          if (faqItem.classList.contains("active")) {
            answer.style.maxHeight = "none";
          }
        },
        { once: true }
      );
    }
  });
});

// SCROLL TO TOP
const scrollToTopBtn = document.getElementById("scrollToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});
console.log("button clicked");

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
