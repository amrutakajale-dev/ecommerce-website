// Display featured products on the homepage
const featuredContainer = document.getElementById("featured-products");

if (featuredContainer) {
  const featuredProducts = products.slice(0, 4);

  featuredContainer.innerHTML = featuredProducts
    .map(
      (product) => `
        <a href="product.html?id=${product.id}" class="product-card">
          <div class="product-image">
           <img src="${product.image}" alt="${product.name}">
        </div>

          <div class="product-info">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <div class="rating">
              <i class="fa-solid fa-star"></i>
              ${product.rating}
            </div>
          </div>
        </a>
      `
    )
    .join("");
}


// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cart-count");

  if (cartCount) {
    const totalItems = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    cartCount.textContent = totalItems;
  }
}

updateCartCount();

// Toast Notification
function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Products Page Functionality
const productsContainer = document.getElementById("all-products");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const resultsCount = document.getElementById("results-count");
const filterButtons = document.querySelectorAll(".filter-btn");

let selectedCategory = "All";
let searchTerm = "";

// Display products
function displayProducts(productList) {
  if (!productsContainer) return;

  resultsCount.textContent = `${productList.length} products found`;

  if (productList.length === 0) {
    productsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  productsContainer.innerHTML = productList
    .map(
      (product) => `
        <a href="product.html?id=${product.id}" class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>

          <div class="product-info">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <div class="rating">
              <i class="fa-solid fa-star"></i>
              ${product.rating}
            </div>
          </div>
        </a>
      `
    )
    .join("");
}

// Filter and sort products
function updateProducts() {
  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (sortSelect) {
    if (sortSelect.value === "low-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "high-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }
  }

  displayProducts(filteredProducts);
}


// Search functionality
if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value;
    updateProducts();
  });
}


// Sort functionality
if (sortSelect) {
  sortSelect.addEventListener("change", updateProducts);
}


// Category filter functionality
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    filterButtons.forEach((btn) =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    updateProducts();
  });
});


// Show products when Products page opens
if (productsContainer) {
  updateProducts();
}
// Product Details Page
const productDetailsContainer = document.getElementById("product-details");

if (productDetailsContainer) {
  // Get product ID from URL
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  // Find selected product
  const selectedProduct = products.find(
    (product) => product.id === productId
  );

  if (selectedProduct) {
    productDetailsContainer.innerHTML = `
      <div class="product-details">

        <div class="details-image">
          <img src="${selectedProduct.image}" alt="${selectedProduct.name}">
        </div>

        <div class="details-info">
          <p class="subtitle">${selectedProduct.category}</p>

          <h1>${selectedProduct.name}</h1>

          <div class="details-rating">
            <i class="fa-solid fa-star"></i>
            ${selectedProduct.rating} / 5
          </div>

          <h2>₹${selectedProduct.price}</h2>

          <p class="product-description">
            A stylish and high-quality product designed for comfort
            and everyday use. Perfect for adding to your collection.
          </p>

          <div class="quantity-section">
            <p>Quantity</p>

            <div class="quantity-control">
              <button id="decrease-quantity">−</button>
              <span id="quantity">1</span>
              <button id="increase-quantity">+</button>
            </div>
          </div>

          <button class="btn add-cart-btn" id="add-to-cart">
            <i class="fa-solid fa-cart-shopping"></i>
            Add to Cart
          </button>

          <a href="products.html" class="continue-link">
            ← Continue Shopping
          </a>
        </div>

      </div>
    `;

    // Quantity functionality
    let quantity = 1;

    const quantityElement = document.getElementById("quantity");

    document
      .getElementById("increase-quantity")
      .addEventListener("click", () => {
        quantity++;
        quantityElement.textContent = quantity;
      });

    document
      .getElementById("decrease-quantity")
      .addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          quantityElement.textContent = quantity;
        }
      });

    // Add to Cart functionality
    document
      .getElementById("add-to-cart")
      .addEventListener("click", () => {
        let cart =
          JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(
          (item) => item.id === selectedProduct.id
        );

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.push({
            ...selectedProduct,
            quantity: quantity
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        showToast(`${selectedProduct.name} added to cart!`);
      });
  } else {
    productDetailsContainer.innerHTML =
      "<h2>Product not found.</h2>";
  }
}

// Cart Page Functionality
const cartItemsContainer = document.getElementById("cart-items");

function renderCart() {
  if (!cartItemsContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  // Empty cart
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <h2>Your cart is empty</h2>
        <p>Add some products to start shopping.</p>
        <a href="products.html" class="btn">Shop Now</a>
      </div>
    `;

    subtotalElement.textContent = "₹0";
    totalElement.textContent = "₹0";
    return;
  }

  // Display cart items
  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
        </div>

          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <p>${item.category}</p>
            <strong>₹${item.price}</strong>
          </div>

          <div class="cart-item-actions">
            <div class="quantity-control">
              <button onclick="changeCartQuantity(${item.id}, -1)">−</button>
              <span>${item.quantity}</span>
              <button onclick="changeCartQuantity(${item.id}, 1)">+</button>
            </div>

            <button
              class="remove-btn"
              onclick="removeFromCart(${item.id})"
            >
              <i class="fa-solid fa-trash"></i> Remove
            </button>
          </div>
        </div>
      `
    )
    .join("");

  // Calculate total
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  subtotalElement.textContent = `₹${subtotal}`;
  totalElement.textContent = `₹${subtotal}`;
}


// Show cart when cart page opens
if (cartItemsContainer) {
  renderCart();
}


// Change quantity
function changeCartQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity += change;

    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    renderCart();
  }
}


// Remove product
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter((item) => item.id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  renderCart();
}

// Checkout Page Functionality
const checkoutItemsContainer = document.getElementById("checkout-items");
const checkoutTotalElement = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");

function renderCheckout() {
  if (!checkoutItemsContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // If cart is empty
  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML =
      "<p>Your cart is empty.</p>";

    if (checkoutTotalElement) {
      checkoutTotalElement.textContent = "₹0";
    }
    return;
  }

  // Display order items
  checkoutItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="checkout-item">
          <div>
            <h4>${item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
          </div>

          <strong>₹${item.price * item.quantity}</strong>
        </div>
      `
    )
    .join("");

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  checkoutTotalElement.textContent = `₹${total}`;
}


// Show order details
if (checkoutItemsContainer) {
  renderCheckout();
}

// Validate shipping details and go to payment
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      showToast("Please enter a valid 10-digit phone number.");
      return;
    }

    // PIN code validation
    if (!/^\d{6}$/.test(pincode)) {
      showToast("Please enter a valid 6-digit PIN code.");
      return;
    }

    const shippingDetails = {
      name,
      phone,
      address,
      city,
      pincode
    };

    localStorage.setItem(
      "shippingDetails",
      JSON.stringify(shippingDetails)
    );

    window.location.href = "payment.html";
  });
}


// Payment Page Functionality
const paymentTotalElement = document.getElementById("payment-total");
const confirmPaymentButton = document.getElementById("confirm-payment");

if (paymentTotalElement) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Calculate total amount
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  paymentTotalElement.textContent = `₹${total}`;
}


// Confirm payment
if (confirmPaymentButton) {
  confirmPaymentButton.addEventListener("click", () => {
    const selectedPayment = document.querySelector(
      'input[name="payment"]:checked'
    );

    // Save selected payment method
    localStorage.setItem(
      "paymentMethod",
      selectedPayment.value
    );

    // Redirect to success page
    window.location.href = "success.html";
  });
}

// Success Page Functionality
const successPaymentElement =
  document.getElementById("success-payment");

const successTotalElement =
  document.getElementById("success-total");

const successOrderIdElement =
  document.getElementById("success-order-id");

const successDeliveryElement =
  document.getElementById("success-delivery");


if (
  successPaymentElement &&
  successTotalElement &&
  successOrderIdElement &&
  successDeliveryElement
) {
  // Get cart data
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Clear cart after successful order
  localStorage.removeItem("cart");
  
   // Calculate final total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Get selected payment method
  const paymentMethod =
    localStorage.getItem("paymentMethod") || "Not selected";

  // Get shipping details
  const shippingDetails =
    JSON.parse(localStorage.getItem("shippingDetails")) || {};

  // Generate Order ID
  const orderId =
    "SE-" + Math.floor(100000 + Math.random() * 900000);

  // Display order details
  successOrderIdElement.textContent = orderId;
  successPaymentElement.textContent = paymentMethod;
  successTotalElement.textContent = `₹${total}`;

  successDeliveryElement.textContent =
    shippingDetails.city && shippingDetails.pincode
      ? `${shippingDetails.city} - ${shippingDetails.pincode}`
      : "Not available";
 
    // Save order to order history
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
    id: orderId,
    items: cart,
    total: total,
    paymentMethod: paymentMethod,
    shippingDetails: shippingDetails,
    date: new Date().toLocaleString()
 };

orders.push(newOrder);

localStorage.setItem("orders", JSON.stringify(orders));
  // Clear cart after successful order
  localStorage.removeItem("cart");

  // Update cart count
  updateCartCount();
}

// Clear Cart Functionality
const clearCartButton = document.getElementById("clear-cart");

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    localStorage.removeItem("cart");

    updateCartCount();
    renderCart();
  });
}

// Prevent checkout when cart is empty
const checkoutButton = document.getElementById("checkout-btn");

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      showToast("Your cart is empty. Please add products before checkout.");
    } else {
      window.location.href = "checkout.html";
    }
  });
}

// Order History Page
const ordersContainer = document.getElementById("orders-container");

if (ordersContainer) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="empty-orders">
        <h2>No orders yet</h2>
        <p>You haven't placed any orders yet.</p>
        <a href="products.html" class="btn">Start Shopping</a>
      </div>
    `;
  } else {
    ordersContainer.innerHTML = orders
      .slice()
      .reverse()
      .map((order) => {
        const itemNames = order.items
          .map((item) => `${item.name} × ${item.quantity}`)
          .join(", ");

        return `
          <div class="order-card">
            <div class="order-header">
              <div>
                <h3>${order.id}</h3>
                <p>${order.date}</p>
              </div>

              <strong>₹${order.total}</strong>
            </div>

            <div class="order-info">
              <p><strong>Items:</strong> ${itemNames}</p>
              <p><strong>Payment:</strong> ${order.paymentMethod}</p>
              <p><strong>Delivery:</strong> ${order.shippingDetails.city || "N/A"} - ${order.shippingDetails.pincode || "N/A"}</p>
            </div>
          </div>
        `;
      })
      .join("");
  }
}

// =========================
// Admin Dashboard
// =========================

const totalProductsElement = document.getElementById("total-products");
const totalOrdersElement = document.getElementById("total-orders");
const totalRevenueElement = document.getElementById("total-revenue");
const adminOrdersContainer = document.getElementById("admin-orders-container");

if (
  totalProductsElement &&
  totalOrdersElement &&
  totalRevenueElement &&
  adminOrdersContainer
) {
  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  // Total Products
  totalProductsElement.textContent = products.length;

  // Total Orders
  totalOrdersElement.textContent = orders.length;

  // Total Revenue
  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  totalRevenueElement.textContent = `₹${totalRevenue}`;

  // Recent Orders
  if (orders.length === 0) {
    adminOrdersContainer.innerHTML = `
      <div class="no-admin-orders">
        <p>No orders available yet.</p>
      </div>
    `;
  } else {
    // Show latest 5 orders
    const recentOrders = orders.slice(-5).reverse();

    adminOrdersContainer.innerHTML = recentOrders
      .map(
        (order, index) => `
          <div class="admin-order-item">
            <div>
              <h3>Order #${orders.length - index}</h3>
              <p>${order.date || "Recent Order"}</p>
            </div>

            <div class="admin-order-total">
              ₹${order.total || 0}
            </div>
          </div>
        `
      )
      .join("");
  }
}