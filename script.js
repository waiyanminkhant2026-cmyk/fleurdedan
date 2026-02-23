// Sample products – replace images with your own
const products = [
  { id: 1, name: "Roses bouquets",           price: 1200, image: "assets/images/1.jpg",         category: "roses" },
  { id: 2, name: "Mixed-Type bouquets",      price: 2200, image: "assets/images/2.jpg",         category: "mixed" },
  { id: 3, name: "Sunflower bouquets",       price: 4800, image: "assets/images/4.jpg",         category: "sunflower" },
  { id: 4, name: "Snacks bouquets",          price: 1900, image: "assets/images/3.jpg",         category: "snack" },
  { id: 5, name: "Spray Roses bouquets",     price: 2500, image: "assets/images/6.jpg",         category: "spray" },
  { id: 6, name: "Money bouquets",           price: 3200, image: "assets/images/7.jpg",         category: "money" },
  { id: 7, name: "Tulip bouquets",           price: 3200, image: "assets/images/5.jpg",         category: "tulip" },
  { id: 8, name: "Daisy bouquets",           price: 3200, image: "assets/images/8.jpg",         category: "daisy" },
  // ကျန်တဲ့ ပစ္စည်းတွေလည်း category ထည့်ပါ
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const productGrid   = document.getElementById('product-grid');
const cartToggle    = document.getElementById('cart-toggle');
const cartModal     = document.getElementById('cart-modal');
const closeCart     = document.getElementById('close-cart');
const cartItemsDiv  = document.getElementById('cart-items');
const cartTotalEl   = document.getElementById('cart-total');
const cartCountEl   = document.getElementById('cart-count');

// Render products
function renderProducts() {
  productGrid.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <a href="${p.category}.html" class="btn-primary">
          View ${p.category.charAt(0).toUpperCase() + p.category.slice(1)} Bouquets
        </a>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

// Add item to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  saveCart();
}

// Update cart display
function updateCart() {
  cartItemsDiv.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.price.toLocaleString()} × ${item.quantity}</p>
      </div>
      <div class="quantity-controls">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  cartTotalEl.textContent = `${total.toLocaleString()} THB`;
  cartCountEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity < 1) {
      cart = cart.filter(i => i.id !== id);
    }
    updateCart();
    saveCart();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCart();

  // Add to cart
  productGrid.addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
      const id = Number(e.target.dataset.id);
      addToCart(id);
    }
  });

  // Open / close cart
  cartToggle.addEventListener('click', e => {
    e.preventDefault();
    cartModal.style.display = 'flex';
  });

  closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });

  cartModal.addEventListener('click', e => {
    if (e.target === cartModal) cartModal.style.display = 'none';
  });
});

// nav-links ထဲက dropdown တွေကို click နဲ့ toggle
document.querySelectorAll('.dropdown > .dropbtn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      this.parentElement.classList.toggle('active');
    }
  });
});

document.getElementById("quickAddBtn")?.addEventListener("click",()=>{
  const name = document.getElementById("quick-name").textContent;
  const price = document.getElementById("quick-price").textContent.replace(" THB","");
  const img = document.getElementById("quick-img").src;

  addToCart(name,price,img);
});

/* ===== HIDE CART ON HOME PAGE ===== */
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  
  // hide cart nav
  const cartNav = document.getElementById("cart-toggle");
  if (cartNav) cartNav.style.display = "none";

  // hide cart drawer
  const cartDrawer = document.getElementById("cartDrawer");
  if (cartDrawer) cartDrawer.style.display = "none";
}

