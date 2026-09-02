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