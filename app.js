// Display featured products on the homepage
const featuredContainer = document.getElementById("featured-products");

if (featuredContainer) {
  const featuredProducts = products.slice(0, 4);

  featuredContainer.innerHTML = featuredProducts
    .map(
      (product) => `
        <a href="product.html?id=${product.id}" class="product-card">
          <div class="product-image">
            <i class="fa-solid ${product.icon}"></i>
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
            <i class="fa-solid ${product.icon}"></i>
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
          <i class="fa-solid ${selectedProduct.icon}"></i>
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

        alert(`${selectedProduct.name} added to cart!`);
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
        <div class="cart-item">
          <div class="cart-item-image">
            <i class="fa-solid ${item.icon}"></i>
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