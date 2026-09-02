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