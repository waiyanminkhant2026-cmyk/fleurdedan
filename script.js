/* =========================================================
   🧠 GLOBAL CART STATE
========================================================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =========================================================
   🚀 DOM READY — unified safe init
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initMobileDropdown();
  initCartToggle();
  updateCartCount();
  renderCart();
  renderHomeProducts();
});

/* =========================================================
   🛍️ HOME PRODUCTS RENDER (INDEX PAGE ONLY)
========================================================= */
function renderHomeProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const products = [
    { id: 1, name: "Roses bouquets", image: "assets/images/1.jpg", link: "roses.html" },
    { id: 2, name: "Mixed-Type bouquets", image: "assets/images/2.jpg", link: "mixed.html" },
    { id: 3, name: "Sunflower bouquets", image: "assets/images/4.jpg", link: "sunflower.html" },
    { id: 4, name: "Snacks bouquets", image: "assets/images/3.jpg", link: "snack.html" },
    { id: 5, name: "Spray Roses bouquets", image: "assets/images/6.jpg", link: "spray.html" },
    { id: 6, name: "Money bouquets", image: "assets/images/7.jpg", link: "money.html" },
    { id: 7, name: "Daisy bouquets", image: "assets/images/8.jpg", link: "daisy.html" },
    { id: 8, name: "Tulip bouquets", image: "assets/images/5.jpg", link: "tulip.html" },
  ];

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <a href="${product.link}" class="btn-primary">
          View More Bouquets
        </a>
      </div>
    </div>
  `).join("");
}

/* =========================================================
   🍔 HAMBURGER MENU
========================================================= */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });
  });
}

/* =========================================================
   📱 MOBILE DROPDOWN
========================================================= */
function initMobileDropdown() {
  const dropdown = document.querySelector(".dropdown");
  if (!dropdown) return;

  const dropBtn = dropdown.querySelector(".dropbtn");
  if (!dropBtn) return;

  dropBtn.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdown.classList.toggle("open");
    }
  });
}

/* =========================================================
   🛒 CART DRAWER TOGGLE
========================================================= */
function initCartToggle() {
  const cartToggle = document.getElementById("cart-toggle");
  if (!cartToggle) return;

  cartToggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleCart();
  });
}

function toggleCart() {
  document.getElementById("cartDrawer")?.classList.toggle("open");
}

/* =========================================================
   🔢 UPDATE CART COUNT
========================================================= */
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  let totalQty = 0;
  cart.forEach(item => {
    totalQty += item.qty || 1;
  });

  countEl.textContent = totalQty;
}

/* =========================================================
   ➕ NORMAL ADD TO CART
========================================================= */
function addToCart(name, price, img) {
  const found = cart.find(item => item.name === name);

  if (found) {
    found.qty = (found.qty || 1) + 1;
  } else {
    cart.push({
      name,
      price: price || null,
      img,
      qty: 1
    });
  }

  saveCart();
  renderCart();
}

/* =========================================================
   🔄 CHANGE QUANTITY
========================================================= */
function changeQty(index, change) {
  if (!cart[index]) return;

  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

/* =========================================================
   ❌ REMOVE ITEM
========================================================= */
function removeItem(index) {
  if (!cart[index]) return;

  cart.splice(index, 1);
  saveCart();
  renderCart();
}

/* =========================================================
   💾 SAVE CART
========================================================= */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/* =========================================================
   🧾 RENDER CART
========================================================= */
function renderCart() {
  const box = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const isMoneyPage = document.body.classList.contains("money-page");
  if (!box) return;

  box.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const qty = item.qty || 1;

    if (typeof item.price === "number") {
      total += item.price * qty;
    }

    box.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" class="cart-thumb" alt="${item.name}">
        <div class="cart-info">
          <h4>${item.name}</h4>

          <!-- 🌸 Flower Color -->
<div class="cart-option">
  <label>Flower Color:</label>
  <select onchange="updateOption(${index}, 'flowerColor', this.value)">
    <option value="">Select color</option>
    <option value="Red">Red</option>
    <option value="Pink">Pink</option>
    <option value="White">White</option>
    <option value="Purple">Purple</option>
    <option value="Yellow">Yellow</option>
  </select>
</div>

<!-- 🎀 Wrapping Color -->
<div class="cart-option">
  <label>Wrapping Paper:</label>
  <select onchange="updateOption(${index}, 'wrapColor', this.value)">
    <option value="">Select wrap</option>
    <option value="Pink">Pink</option>
    <option value="White">White</option>
    <option value="Black">Black</option>
    <option value="Gold">Gold</option>
    <option value="Purple">Purple</option>
  </select>
</div>


<!-- ✍️ Custom Note -->
<div class="cart-option">
  <label>Special Note:</label>
  <textarea
    placeholder="Write your request..."
    oninput="updateOption(${index}, 'customNote', this.value)"
  >${item.customNote || ""}</textarea>
</div>

          ${item.isMoney && isMoneyPage ? `
  <label>Money Value:</label>
  <select onchange="updateMoneyItem(${index}, 'value', this.value)">
    <option value="">Select</option>
    <option value="1000" ${item.value==1000?"selected":""}>1,000 THB</option>
    <option value="2000" ${item.value==2000?"selected":""}>2,000 THB</option>
    <option value="5000" ${item.value==5000?"selected":""}>5,000 THB</option>
  </select>

  <label>Notes:</label>
  <input type="number" min="1"
    value="${item.notes || 1}"
    onchange="updateMoneyItem(${index}, 'notes', this.value)">
` : ""}

          <small style="color:#777;">
            ${item.notes ? `${item.value} THB × ${item.notes} notes<br>
            Service Fee: ${item.serviceFee?.toLocaleString()} THB` : ""}
          </small>

          ${!item.notes && item.price ? `<p>${item.price.toLocaleString()} THB</p>` : ""}

          <div class="qty-box">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
            <button class="remove-btn" onclick="removeItem(${index})">🗑</button>
          </div>
        </div>
      </div>
    `;
  
  });

  if (totalEl) totalEl.textContent = total.toLocaleString();
  updateCartCount();
}

/* =========================================================
   💰 MONEY MODAL SYSTEM
========================================================= */

let moneyTemp = null;

function openMoneyModal(name, img) {
  console.log("MODAL OPEN", name);

  moneyTemp = { name, img };

  document.getElementById("money-title").textContent = name;
  document.getElementById("money-modal")?.classList.add("active");

  updateMoneyPreview();
}

function closeMoneyModal() {
  document.getElementById("money-modal")?.classList.remove("active");
}

/* ⭐ IMPORTANT — ADD THIS */
window.openMoneyModal = openMoneyModal;
window.closeMoneyModal = closeMoneyModal;

function getServiceFee(notes) {
  return notes * 50;
}

function updateMoneyPreview() {
  const valueEl = document.getElementById("money-value");
  const notesEl = document.getElementById("money-notes");
  if (!valueEl || !notesEl) return;

  const value = Number(valueEl.value);
  const notes = Number(notesEl.value);

  const serviceFee = getServiceFee(notes);
  const total = value * notes + serviceFee;

  document.getElementById("service-fee").textContent = serviceFee.toLocaleString();
  document.getElementById("money-total-preview").textContent = total.toLocaleString();
}

/* live update */
document.addEventListener("input", (e) => {
  if (e.target.id === "money-value" || e.target.id === "money-notes") {
    updateMoneyPreview();
  }
});

function confirmMoneyCart() {
  if (!moneyTemp) return;

  const value = Number(document.getElementById("money-value").value);
  const notes = Number(document.getElementById("money-notes").value);

  if (!value || !notes) return;

  const serviceFee = getServiceFee(notes);
  const total = value * notes + serviceFee;

  cart.push({
    name: moneyTemp.name,
    price: total,
    img: moneyTemp.img,
    qty: 1,
    isMoney: true,
    notes,
    value,
    serviceFee
  });

  saveCart();
  renderCart();
  closeMoneyModal();
}

/* =========================================================
   🔧 UPDATE OPTIONS
========================================================= */
function updateOption(index, key, value) {
  if (!cart[index]) return;
  cart[index][key] = value;
  saveCart();
}

function updateMoneyItem(index, key, value) {
  if (!cart[index]) return;

  cart[index][key] = Number(value);

  const notes = cart[index].notes || 0;
  const moneyValue = cart[index].value || 0;

  const serviceFee = getServiceFee(notes);
  const total = moneyValue * notes + serviceFee;

  cart[index].serviceFee = serviceFee;
  cart[index].price = total;

  saveCart();
  renderCart();
}




