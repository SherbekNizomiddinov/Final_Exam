const API_BASE_URL = 'http://localhost:5000/api';
let currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);

function updateThemeButton() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('.theme-text');

  if (currentTheme === 'dark') {
    icon.textContent = '☀️';
    text.textContent = 'Yorug';
  } else {
    icon.textContent = '🌙';
    text.textContent = 'Qorongu';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateThemeButton();

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      updateThemeButton();
    });
  }
});
let authToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let cart = [];
let currentPage = 'home';
let searchQuery = '';
let loginPendingUserId = null;

// UI Elements
const mainContent = document.getElementById('mainContent');
const authModal = document.getElementById('authModal');
const productModal = document.getElementById('productModal');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const profileModal = document.getElementById('profileModal');
const notificationEl = document.getElementById('notification');

// Event Listeners
document.getElementById('cartBtn').addEventListener('click', openCartModal);
document.getElementById('profileBtn').addEventListener('click', openProfileModal);
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value;
  if (currentPage === 'home') loadProducts();
});

// Auth Tabs
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const tab = e.target.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById(tab).classList.add('active');
  });
});

document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('registerForm').addEventListener('submit', handleRegister);
document.getElementById('otpForm').addEventListener('submit', handleOTPVerify);

// Modal Close Buttons
document.querySelectorAll('.modal-close').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.modal').classList.remove('active');
  });
});

// Checkout Steps
document.getElementById('nextShippingBtn').addEventListener('click', (e) => {
  e.preventDefault();
  if (validateAddressForm()) {
    switchCheckoutStep('shipping');
  }
});

document.getElementById('nextPaymentBtn').addEventListener('click', (e) => {
  e.preventDefault();
  switchCheckoutStep('payment');
});

document.getElementById('paymentForm').addEventListener('submit', handleCheckout);
document.getElementById('checkoutBtn').addEventListener('click', () => {
  cartModal.classList.remove('active');
  checkoutModal.classList.add('active');
  switchCheckoutStep('address');
});

// Initial Load - Check if user is logged in
if (authToken) {
  loadHome();
} else {
  showAuthModal();
}

// Helper Functions
function showNotification(message, type = 'success') {
  notificationEl.textContent = message;
  notificationEl.className = `notification show ${type}`;
  setTimeout(() => {
    notificationEl.classList.remove('show');
  }, 3500);
}

async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    });

    if (response.status === 401 && refreshToken) {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        authToken = data.accessToken;
        localStorage.setItem('accessToken', authToken);
        return apiCall(url, options);
      } else {
        logout();
        return { ok: false, status: 401 };
      }
    }

    return response;
  } catch (error) {
    console.error('API call error:', error);
    return { ok: false, error };
  }
}

// Authentication Functions
async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(`Ro'yhatdan o'tish muvafaqqiyatli tasdiqlandi. Iltimos Login sahifasini kuting`);
      document.getElementById('registerForm').reset();
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelector('[data-tab="login"]').classList.add('active');
      document.getElementById('login').classList.add('active');
      document.getElementById('register').classList.remove('active');
    } else {
      showNotification(data.message || `Ro'yhatdan o'tishda hato !`, 'error');
    }
  } catch (error) {
    console.error(`Ro'yhatdan o'tishda hato:`, error);
    showNotification(`Ro'yhatdan o'tishda hato`, 'error');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      loginPendingUserId = data.userId;
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      document.getElementById('twofa').classList.add('active');
      document.getElementById('otpInput').focus();
      showNotification('Emailingizga 6 xonali OTP kod yuborildi iltimos uni kiriting.');
    } else {
      showNotification(data.message || 'Kirishda hatolik !', 'error');
    }
  } catch (error) {
    console.error('Kirishda hato:', error);
    showNotification('Kirishda hato', 'error');
  }
}

async function handleOTPVerify(e) {
  e.preventDefault();
  const otp = document.getElementById('otpInput').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: loginPendingUserId, otp }),
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.accessToken;
      refreshToken = data.refreshToken;
      currentUser = data.user;

      localStorage.setItem('accessToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      authModal.classList.remove('active');
      showNotification('Muvafaqiyatli kirildi!');
      loadHome();
    } else {
      showNotification(data.message || 'OTP kod yuborishda hatolik', 'error');
    }
  } catch (error) {
    console.error('OTPda hatolik !:', error);
    showNotification('OTP kod yuborishda hatolik', 'error');
  }
}

function showAuthModal() {
  authModal.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
  document.querySelector('[data-tab="register"]').classList.add('active');
  document.getElementById('register').classList.add('active');
}

function logout() {
  authToken = null;
  refreshToken = null;
  currentUser = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
  cart = [];
  showAuthModal();
  showNotification('Tizimdan muvafaqqiyatli chiqildi !');
}

// Product Functions
async function loadHome() {
  currentPage = 'home';
  mainContent.innerHTML = `
    <div class="hero">
      <h1>Xush kelibsiz Apple Magazinga </h1>
      <p>Premium Apple mahsulotlari bilan tanishing</p>
      <button class="btn btn-primary" onclick="document.querySelector('.products-grid')?.scrollIntoView({ behavior: 'smooth' })">Harid qilish</button>
    </div>
    <div class="products-header">
      <h2>Featured Products</h2>
    </div>
    <div class="products-grid" id="productsGrid"></div>
  `;
  await loadProducts();
}

async function loadProducts() {
  try {
    const url = searchQuery ? `${API_BASE_URL}/products?search=${encodeURIComponent(searchQuery)}` : `${API_BASE_URL}/products`;
    const response = await apiCall(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    const products = await response.json();

    const grid = document.getElementById('productsGrid');
    if (!grid) throw new Error('Mahsulotlar toʻplami topilmadi !');

    grid.innerHTML = products
      .map(
        (product) => `
        <div class="product-card">
          <div class="product-image">
            <img src="http://localhost:5000${product.image || '/images/placeholder.png'}" alt="${product.name}" onerror="this.onerror=null; this.src='http://localhost:5000/images/placeholder.png'" />
          </div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-stock">Stock: ${product.stock}</div>
            <div class="product-actions">
              <button class="btn btn-primary" style="flex: 1" onclick="openProductDetail(${product.id})">Ko'rish</button>
              <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); addToCart(${product.id})">Qo'shish</button>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    if (products.length === 0) {
      grid.innerHTML = '<p style="text-align: center; color: #999; padding: 40px; grid-column: 1 / -1;">Mahsulot Topilmadi.</p>';
    }
  } catch (error) {
    console.error('Mahsulotlarni yuklash xatosi !:', error);
    showNotification(`Mahsulotlar yuklanmadi !: ${error.message}`, 'error');
  }
} 

function formatProductDescription(description) {
  const labels = [
    'Display',
    'Chip',
    'Cameras',
    'Front Camera',
    'Battery',
    'Battery Life',
    'Storage',
    'Storage Options',
  ];

  const regex = new RegExp(`(${labels.join('|')}):`, 'gi');
  const matches = [...description.matchAll(regex)];

  if (matches.length === 0) {
    return `<div class="desc-line"><span class="desc-value">${description}</span></div>`;
  }

  return matches.map((match, index) => {
    const label = match[1];
    const start = match.index + match[0].length;
    const end = matches[index + 1] ? matches[index + 1].index : description.length;
    const value = description.slice(start, end).trim();

    return `
      <div class="desc-line">
        <span class="desc-label">${label}:</span>
        <span class="desc-value">${value}</span>
      </div>
    `;
  }).join('');
}

async function openProductDetail(productId) {
  try {
    const response = await apiCall(`${API_BASE_URL}/products/${productId}`);

    if (!response.ok) throw new Error('Mahsulot tafsilotlarini olib bo‘lmadi');

    const product = await response.json();

    document.getElementById('productDetail').innerHTML = `
      <div class="product-detail">
        <div class="product-detail-image">
          <img src="http://localhost:5000${product.image || '/images/placeholder.png'}" />
        </div>

        <div class="product-detail-info">
          <h2>${product.name}</h2>

          <div class="product-detail-description">
            ${formatProductDescription(product.description || '')}
          </div>

          <div class="product-detail-actions">
            <div class="product-detail-quantity">
              <button onclick="decreaseQuantity(${product.id}, ${product.stock})">−</button>
              <input id="detailQuantity_${product.id}" value="1" readonly />
              <button onclick="increaseQuantity(${product.id}, ${product.stock})">+</button>
            </div>

            <button class="btn btn-primary" onclick="addToCartFromDetail(${product.id})">
              Savatchaga qo‘shish
            </button>
          </div>
        </div>
      </div>
    `;

    productModal.classList.add('active');
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function increaseQuantity(productId, maxStock) {
  const input = document.getElementById(`detailQuantity_${productId}`);
  let qty = parseInt(input.value, 10) || 1;
  if (qty < maxStock) qty++;
  input.value = qty;
}

function decreaseQuantity(productId, maxStock) {
  const input = document.getElementById(`detailQuantity_${productId}`);
  let qty = parseInt(input.value, 10) || 1;
  if (qty > 1) qty--;
  input.value = qty;
}

async function addToCartFromDetail(productId) {
  if (!authToken) {
    showAuthModal();
    showNotification('Avval login qiling', 'error');
    return;
  }

  const quantityInput = document.getElementById(`detailQuantity_${productId}`);
  const qty = quantityInput ? Number(quantityInput.value) || 1 : 1;

  try {
    const response = await apiCall(`${API_BASE_URL}/cart`, {
      method: 'POST',
      body: JSON.stringify({
        productId: Number(productId),
        quantity: qty,
      }),
    });

    const data =
    response && typeof response.json === 'function'
      ? await response.json().catch(() => ({}))
      : {};

    if (response.ok) {
      await loadCart();
      updateCartCount();
      showNotification('Mahsulot savatchaga qo‘shildi!');
      productModal.classList.remove('active');
    } else {
      showNotification(data.message || `Cart error: ${response.status}`, 'error');
      console.log('Cart error:', data);
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    showNotification(error.message || 'Savatchaga qo‘shishda xatolik', 'error');
  }
}

async function addToCart(productId) {
  if (!authToken) {
    showAuthModal();
    showNotification('Avval login qiling', 'error');
    return;
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/cart`, {
      method: 'POST',
      body: JSON.stringify({
        productId: Number(productId),
        quantity: 1,
      }),
    });

    const data =
      response && typeof response.json === 'function'
        ? await response.json().catch(() => ({}))
        : {};

    if (response.ok) {
      await loadCart();
      updateCartCount();
      showNotification('Mahsulot savatchaga qo‘shildi!');
    } else {
      showNotification(data.message || `Cart error: ${response.status}`, 'error');
      console.log('Cart error:', data);
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    showNotification(error.message || 'Savatchaga qo‘shishda xatolik', 'error');
  }
}

// Cart Functions
async function loadCart() {
  if (!authToken) return;

  try {
    const response = await apiCall(`${API_BASE_URL}/cart`);
    cart = await response.json();
    updateCartCount();
    await renderCart();
  } catch (error) {
    console.error('Load cart error:', error);
    showNotification(`Failed to load cart: ${error.message}`, 'error');
  }
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

async function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Your cart is empty</p>';
    document.getElementById('checkoutBtn').disabled = true;
    return;
  }

  document.getElementById('checkoutBtn').disabled = false;

  let subtotal = 0;
  cartItemsEl.innerHTML = '';

  for (const item of cart) {
    try {
      const productResponse = await apiCall(`${API_BASE_URL}/products/${item.productId}`);
      if (!productResponse.ok) throw new Error('Mahsulot Topilmadi');
      const product = await productResponse.json();
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      cartItemsEl.innerHTML += `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="http://localhost:5000${product.image || '/images/placeholder.png'}" alt="${product.name}" onerror="this.onerror=null; this.src='http://localhost:5000/images/placeholder.png'" />
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">$${product.price.toFixed(2)} each</div>
            <div class="cart-item-quantity">
              <button onclick="updateCartQuantity(${product.id}, -1)">−</button>
              <input type="number" id="cartQuantity_${product.id}" value="${item.quantity}" min="1" max="${product.stock}" readonly />
              <button onclick="updateCartQuantity(${product.id}, 1)">+</button>
            </div>
            <div class="cart-item-remove" onclick="removeFromCart(${product.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Remove
            </div>
          </div>
          <div style="text-align: right; font-weight: 600; min-width: 80px;">$${itemTotal.toFixed(2)}</div>
        </div>
      `;
    } catch (error) {
      console.error('Render cart item error:', error);
    }
  }

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

async function updateCartQuantity(productId, change) {
  const quantityInput = document.getElementById(`cartQuantity_${productId}`);
  if (!quantityInput) return;

  let newQuantity = parseInt(quantityInput.value) + change;

  if (newQuantity <= 0) {
    await removeFromCart(productId);
    return;
  }

  if (newQuantity < 1) newQuantity = 1;

  try {
    const productResponse = await apiCall(`${API_BASE_URL}/products/${productId}`);
    if (productResponse.ok) {
      const product = await productResponse.json();
      if (newQuantity > product.stock) {
        showNotification(`Only ${product.stock} items available`, 'error');
        newQuantity = product.stock;
      }
    }
  } catch (error) {
    console.error('Stock check error:', error);
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/cart/${productId}/quantity`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (response.ok) {
      quantityInput.value = newQuantity;
      await updateCartPrices();
    } else {
      showNotification('Failed to update quantity', 'error');
    }
  } catch (error) {
    console.error('Update quantity error:', error);
    showNotification(`Failed to update quantity: ${error.message}`, 'error');
  }
}

async function removeFromCart(productId) {
  try {
    const response = await apiCall(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await loadCart();
      showNotification(`Mahsulot o'chirildi`);

      if (cart.length === 0) {
        setTimeout(() => {
          cartModal.classList.remove('active');
        }, 1000);
      }
    } else {
      showNotification('Failed to remove from cart', 'error');
    }
  } catch (error) {
    console.error(`Mahsulotni o'chirishda hatolik`, error);
    showNotification(`Failed to remove from cart: ${error.message}`, 'error');
  }
}

async function updateCartPrices() {
  const cartItemsEl = document.getElementById('cartItems');
  let subtotal = 0;

  for (const item of cart) {
    try {
      const productResponse = await apiCall(`${API_BASE_URL}/products/${item.productId}`);
      if (productResponse.ok) {
        const product = await productResponse.json();
        const quantityInput = document.getElementById(`cartQuantity_${product.id}`);
        const qty = parseInt(quantityInput.value);
        subtotal += product.price * qty;
      }
    } catch (error) {
      console.error('Mahsulotni Hisoblashda Hatolik:', error);
    }
  }

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function openCartModal() {
  if (!authToken) {
    showAuthModal();
    return;
  }
  loadCart();
  cartModal.classList.add('active');
}

// Profile & Admin Functions
function openProfileModal() {
  if (!authToken) {
    showAuthModal();
    return;
  }

  document.getElementById('profileContent').innerHTML = `
    <div class="profile-info">
      <div class="profile-row">
        <span class="profile-label">Name:</span>
        <span>${currentUser.name}</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Email:</span>
        <span>${currentUser.email}</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Role:</span>
        <span>${currentUser.role === 'admin' ? 'Administrator' : 'Customer'}</span>
      </div>
    </div>
    ${
      currentUser.role === 'admin'
        ? `
      <div style="margin-top: 24px;">
        <h3 style="margin-bottom: 16px;">Admin Functions</h3>
        <button class="btn btn-primary btn-block" onclick="openAddProductModal()">Mahsulot Qo'shish</button>
      </div>
    `
        : ''
    }
  `;

  profileModal.classList.add('active');
}

// Checkout Functions
function validateAddressForm() {
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zip = document.getElementById('zip').value;

  if (!street || !city || !state || !zip) {
    showNotification('Please fill in all address fields', 'error');
    return false;
  }
  return true;
}

function switchCheckoutStep(step) {
  document.querySelectorAll('.checkout-step').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach((s) => s.classList.remove('active'));
  document.getElementById(step + 'Step').classList.add('active');
  document.querySelector(`[data-step="${step}"]`).classList.add('active');
}

async function handleCheckout(e) {
  e.preventDefault();

  const address = `${document.getElementById('street').value}, ${document.getElementById('city').value}, ${document.getElementById('state').value} ${document.getElementById('zip').value}`;
  const shippingMethod = document.querySelector('input[name="shipping"]:checked').value;
  const paymentMethod = 'credit_card';

  try {
    const response = await apiCall(`${API_BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify({ address, shippingMethod, paymentMethod }),
    });

    if (response.ok) {
      const order = await response.json();
      checkoutModal.classList.remove('active');
      showNotification('Order placed successfully!');
      cart = [];
      updateCartCount();
      document.getElementById('addressForm').reset();
      await loadHome();
    } else {
      showNotification('Failed to place order', 'error');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    showNotification(`Checkout failed: ${error.message}`, 'error');
  }
}

async function openAddProductModal() {
  const modal = document.createElement('div');
  modal.className = 'modal active';

  modal.innerHTML = `
    <div class="modal-content add-product-modal">
      <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>

      <div class="add-product-head">
        <h2>Add New Product</h2>
        <p>Premium Apple mahsulotini chiroyli forma orqali qo‘shing</p>
      </div>

      <form id="addProductForm" class="add-product-form">
        <div class="form-group">
          <label>Product Name</label>
          <input type="text" id="newProductName" placeholder="Apple iPhone 17 Pro Max" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Price</label>
            <input type="number" id="newProductPrice" placeholder="1999" required />
          </div>

          <div class="form-group">
            <label>Stock</label>
            <input type="number" id="newProductStock" placeholder="30" required />
          </div>
        </div>

        <div class="form-group">
          <label>Category</label>
          <select id="newProductCategory" required>
            <option value="Telefonlar">Phones</option>
            <option value="Noutbuklar">Laptops</option>
            <option value="Planshetlar">Tablets</option>
            <option value="Aksessuarlar">Accessories</option>
          </select>
        </div>

        <div class="form-group">
          <label>Image Path</label>
          <input type="text" id="newProductImage" placeholder="/images/iphone17.jpg" />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea id="newProductDescription" placeholder="Display: 6.9 Super Retina XDR
          Chip: A19 Pro
          Storage Options: 256 GB, 512 GB, 1 TB
          Cameras: Triple 48 MP
          Battery Life: Video playback up to 39 hours" required></textarea>
        </div>

        <button class="btn btn-primary btn-block" type="submit">Mahsulot Yaratish</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
      name: document.getElementById('newProductName').value.trim(),
      price: Number(document.getElementById('newProductPrice').value),
      category: document.getElementById('newProductCategory').value,
      stock: Number(document.getElementById('newProductStock').value),
      image: document.getElementById('newProductImage').value.trim() || '/images/placeholder.png',
      description: document.getElementById('newProductDescription').value.trim(),
    };

    try {
      const response = await apiCall(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        showNotification(`Mahsulot muvaffaqiyatli Qo'shildi !`);
        modal.remove();
        await loadHome();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification(errorData.message || 'Failed to add product', 'error');
      }
    } catch (error) {
      showNotification(`Failed to add product: ${error.message}`, 'error');
    }
  });
}

// Close modals on background click
document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});