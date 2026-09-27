const productGrid = document.getElementById("productsGrid");
let allProducts = [];
let currentModalProduct = null;
const productModal = document.getElementById("productModal");
const closeModalButton = document.getElementById("closeProductModalBtn");
const cartButton = document.getElementById("cartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartButton = document.getElementById("closeCartBtn");
cartButton.addEventListener("click", () => {
  cartOverlay.style.display = "flex";
});
closeModalButton.addEventListener("click", () => {
  productModal.style.display = "none";
});
closeCartButton.addEventListener("click", () => {
  cartOverlay.style.display = "none";
});
 

// const cartItems = document.getElementById("cartItems");
const cartCountBadge = document.getElementById("cartCount");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartItemsContainer = document.getElementById("cartItems");
let cart = [];

const renderCart = () => {
  cartItemsContainer.innerHTML = ""; 

  cart.forEach((item) => {
    const cartItems = document.getElementById("cartItems");
        const cartItemCard = document.createElement("div");
        cartItemCard.classList.add("cart-item");
        const itemImage = document.createElement("img");
        itemImage.src = item.image;
        itemImage.alt = item.title;
        const itemInfo = document.createElement("div");
        itemInfo.classList.add("cart-item-info");
        const cartItemTitle = document.createElement("p");
        cartItemTitle.classList.add("cart-item-title");
        cartItemTitle.textContent = `${item.title}`;
        const cartItemprice = document.createElement("p");
        cartItemprice.classList.add("cart-item-price");
        cartItemprice.textContent = `${item.price}`;
        //item Quantity
        const cardItemQuantity = document.createElement("div");
        cardItemQuantity.classList.add("cart-item-qty");
        const decreaseItemButton = document.createElement("button");
        decreaseItemButton.classList.add("qty-btn", "decrease-qty-btn");
        decreaseItemButton.textContent = "-";
        const itemAmoutn = document.createElement("span");
        itemAmoutn.classList.add("qty-value");
        itemAmoutn.textContent = `${item.qty}`;
        const increaseItemButton = document.createElement("button");
        increaseItemButton.classList.add("qty-btn", "increase-qty-btn");
        increaseItemButton.textContent = "+";
        cardItemQuantity.appendChild(decreaseItemButton);
        cardItemQuantity.appendChild(itemAmoutn)
        cardItemQuantity.appendChild(increaseItemButton);
        //delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("remove-item-btn")
        deleteButton.textContent = "X";
        increaseItemButton.addEventListener("click", () => {
          item.qty += 1;
          renderCart();
        });
        decreaseItemButton.addEventListener("click", () => {
          item.qty -= 1;
          if (item.qty <= 0) {
            cart = cart.filter((c) => c.id !== item.id);
          }
          renderCart();
        });
        deleteButton.addEventListener("click", () => {
          cart = cart.filter((c) => c.id !== item.id);
          renderCart();
        });
        // append into info
        itemInfo.appendChild(cartItemTitle);
        itemInfo.appendChild(cartItemprice);
        itemInfo.appendChild(cardItemQuantity);
        //append in card
        cartItemCard.append(itemImage);
        cartItemCard.appendChild(itemInfo)
        cartItemCard.append(deleteButton);
        //append in the parent
        cartItems.appendChild(cartItemCard);
    
  });

 
  cartCountBadge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
};


const renderCategory = (categories) => {
  const searchCategory = document.getElementById("searchCategory");
  categories.forEach((category) => {
    const searchOption = document.createElement("option");
    searchOption.value = category;
    searchOption.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    searchCategory.appendChild(searchOption);
  });

};

const renderCategoryFilters = (categories) => {
  const filterGroup = document.getElementById("categoryFilterGroup");
  filterGroup.innerHTML = ""; // clear in case this ever re-runs

  // --- "All" checkbox, added first, handled separately ---
  const allLabel = document.createElement("label");
  allLabel.classList.add("filter-checkbox");
  allLabel.textContent = "All";
  const allCheckbox = document.createElement("input");
  allCheckbox.type = "checkbox";
  allCheckbox.name = "category";
  allCheckbox.value = "all";
  allCheckbox.checked = true; //default

  allLabel.appendChild(allCheckbox);
  filterGroup.appendChild(allLabel);
  const categoryCheckboxes = [];

  categories.forEach((category) => {
    const label = document.createElement("label");
    label.classList.add("filter-checkbox");
    label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "category";
    checkbox.value = category;

    label.appendChild(checkbox);
    filterGroup.appendChild(label);
    categoryCheckboxes.push(checkbox);
  });

  // Checking "All" clears every other category checkbox
  allCheckbox.addEventListener("change", () => {
    if (allCheckbox.checked) {
      categoryCheckboxes.forEach((cb) => (cb.checked = false));
    }
  });

  // unchecks "All"
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        allCheckbox.checked = false;
      }
      //fall back to "All"
      const anyChecked = categoryCheckboxes.some((cb) => cb.checked);
      if (!anyChecked) {
        allCheckbox.checked = true;
      }
    });
  });
};
// const renderCategoryFilters = (categories) => {
//   const filterGroup = document.getElementById("categoryFilterGroup");

//   categories.forEach((category) => {
//     const label = document.createElement("label");
//     label.classList.add("filter-checkbox");
//     label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
//     const checkbox = document.createElement("input");
//     checkbox.type = "checkbox";
//     checkbox.name = "category";
//     checkbox.value = category;

//     label.appendChild(checkbox);
//     filterGroup.appendChild(label);
//   });
// };
const filterBySearch = (products, term)=>{
  if(!term){
    return products;
  }
  const lowerTerm = term.toLowerCase();
  return products.filter((product) =>
    product.title.toLowerCase().includes(lowerTerm)
  );
}

const filterByCategory = (products, selectedCategories) => {
  if (selectedCategories.length === 0) return products;
  return products.filter((product) =>
    selectedCategories.includes(product.category)
  );
};

const filterByPrice = (products, min, max) => {
  return products.filter((product) => {
    const containMin = min === "" || product.price >= Number(min);
    const containMax = max === "" || product.price <= Number(max);
    return containMin && containMax;
  });
};

const renderProducts = (products) => {
  productGrid.innerHTML = "";

  if (products.length === 0) {
    productGrid.innerHTML = "<p>No products match your filters.</p>";
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // image
    const productImageContainer = document.createElement("div");
    productImageContainer.classList.add("product-image");
    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.title;
    productImageContainer.appendChild(productImage);

    // category
    const productcategory = document.createElement("p");
    productcategory.classList.add("product-category");
    productcategory.textContent = product.category;

    // title
    const producttitle = document.createElement("h3");
    producttitle.classList.add("product-title");
    producttitle.textContent = product.title;

    // rating
    const productRating = document.createElement("div");
    productRating.classList.add("product-rating");

    const starsSpan = document.createElement("span");
    starsSpan.classList.add("stars");
    starsSpan.style.setProperty("--rating", product.rating.rate);

    const ratingValue = document.createElement("span");
    ratingValue.classList.add("rating-value");
    ratingValue.textContent = product.rating.rate;

    const ratingCount = document.createElement("span");
    ratingCount.classList.add("rating-count");
    ratingCount.textContent = `(${product.rating.count})`;

    productRating.appendChild(starsSpan);
    productRating.appendChild(ratingValue);
    productRating.appendChild(ratingCount);

    // product price
    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");

    const currency = document.createElement("span");
    currency.classList.add("currency");
    currency.textContent = "$" + product.price;
    productPrice.appendChild(currency);

    // convert price button 
    const convertCurrency = document.createElement("button");
    convertCurrency.classList.add("btn-currency");
    convertCurrency.textContent = "Convert to EUR";
    productPrice.appendChild(convertCurrency);

  
    const eurPrice = (product.price * eurRate).toFixed(2);

    convertCurrency.addEventListener("click", () => {
      const isUSD = currency.textContent.startsWith("$");
      if (isUSD) {
        currency.textContent = `€${eurPrice}`;
        convertCurrency.textContent = "Convert to $";
      } else {
        currency.textContent = `$${product.price}`;
        convertCurrency.textContent = "Convert to EUR";
      }
    });

    // product actions
    const productActionContainer = document.createElement("div");
    productActionContainer.classList.add("product-actions");

    const detailsButton = document.createElement("button");
    detailsButton.classList.add("btn", "btn-secondary", "view-details-btn");
    detailsButton.textContent = "View Details";

    detailsButton.addEventListener("click", () => {
      currentModalProduct = product;
      productModal.style.display = "flex";
      const imageContainer = document.getElementById("imageContainer");
      imageContainer.innerHTML = "";
      const modalImage = document.createElement("img");
      modalImage.src = product.image;
      modalImage.alt = product.title;
      imageContainer.appendChild(modalImage);
    
      document.getElementById("modalCategory").textContent = product.category;
      document.getElementById("modalTitle").textContent = product.title;
      document.getElementById("modalPrice").textContent = `$${product.price}`;
      document.getElementById("modalDescription").textContent = product.description;
    
      document.getElementById("modalStars").style.setProperty("--rating", product.rating.rate);
      document.getElementById("modalRatingValue").textContent = product.rating.rate;
      document.getElementById("modalRatingCount").textContent = `(${product.rating.count})`;
    });

    productActionContainer.appendChild(detailsButton);

    const cartButton = document.createElement("button");
    cartButton.classList.add("btn", "btn-secondary", "add-to-cart-btn");
    cartButton.textContent = "Add to Cart";

    
    cartButton.addEventListener("click", () => {
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1
        });
      }

      renderCart();
    });

    productActionContainer.appendChild(cartButton);

    // append all into the card parent
    productCard.appendChild(productImageContainer);
    productCard.appendChild(productcategory);
    productCard.appendChild(producttitle);
    productCard.appendChild(productRating);
    productCard.appendChild(productPrice);
    productCard.appendChild(productActionContainer);

    // append the finished card into the grid
    productGrid.appendChild(productCard);
  });
};

document.getElementById("modalAddToCartBtn").addEventListener("click", () => {
  if (!currentModalProduct) return;
  const existingItem = cart.find((item) => item.id === currentModalProduct.id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: currentModalProduct.id,
      title: currentModalProduct.title,
      price: currentModalProduct.price,
      image: currentModalProduct.image,
      qty: 1,
    });
  }
  renderCart();
});

const applyFilters = () => {
  let result = allProducts;

  // search term
  const searchTerm = document.getElementById("searchInput").value.trim();
  result = filterBySearch(result, searchTerm);

  // selected categories
  const checkedBoxes = document.querySelectorAll(
    '#categoryFilterGroup input[name="category"]:checked'
  );
  const selectedCategories = Array.from(checkedBoxes).map((cb) => cb.value);
  result = filterByCategory(result, selectedCategories);


  // price range
  const minPrice = document.getElementById("minPrice")?.value ?? "";
  const maxPrice = document.getElementById("maxPrice")?.value ?? "";
  result = filterByPrice(result, minPrice, maxPrice);

  currentFilteredProducts = result;
  currentPage = 1;                  
  displayPage(); 
};

const resetFilters = () => {
  
  document.getElementById("searchInput").value = "";

  document
    .querySelectorAll('#categoryFilterGroup input[name="category"]')
    .forEach((checkbox) => {
      checkbox.checked = false;
    });

  const minPriceEl = document.getElementById("minPrice");
  const maxPriceEl = document.getElementById("maxPrice");
  if (minPriceEl) minPriceEl.value = "";
  if (maxPriceEl) maxPriceEl.value = "";

  const searchCategoryEl = document.getElementById("searchCategory");
  if (searchCategoryEl) searchCategoryEl.value = "all";
  currentFilteredProducts = allProducts;
  currentPage = 1;
  displayPage();
};

//paggination
let currentPage = 1;
const itemsPerPage = 8; 
let currentFilteredProducts = [];
const paginate = (products, page) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.slice(start, end);
};
const renderPagination = (totalItems) => {
  const paginationContainer = document.getElementById("paginationContainer");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return;
  // Prev button
  const prevBtn = document.createElement("button");
  prevBtn.classList.add("page-btn" ,"page-nav");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    currentPage--;
    displayPage();
  });
  paginationContainer.appendChild(prevBtn);

  // Page numbered buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-btn", "page-number");
    if (i === currentPage) pageBtn.classList.add("active");

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      displayPage();
    });
    paginationContainer.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.classList.add("page-btn" ,"page-nav");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    currentPage++;
    displayPage();
  });
  paginationContainer.appendChild(nextBtn);
};

// renders the current page of currentFilteredProducts
const displayPage = () => {
  const pageItems = paginate(currentFilteredProducts, currentPage);
  renderProducts(pageItems);
  renderPagination(currentFilteredProducts.length);
};

let eurRate = 1;
const fetchProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    eurRate = await currencyConverter();
    renderProducts(products);
    allProducts = products;
    currentFilteredProducts = products;
    currentPage = 1;
    displayPage(); 
    const categories = [...new Set(products.map((item) => item.category))];
    // renderCategory(categories);         
    renderCategoryFilters(categories); 
    
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

fetchProducts();

const currencyConverter = async () => {
  const url =
    "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EGP,GBP,EUR";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.rates.EUR;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
  }
};

document.getElementById("searchBtn").addEventListener("click", ()=>{
  applyFilters();
});
document.getElementById("applyFiltersBtn").addEventListener("click", ()=>{
  applyFilters();
});

document.getElementById("clearFiltersBtn").addEventListener("click", ()=>{
  resetFilters();
});

document.getElementById("modalAddToCartBtn").addEventListener("click", () => {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  renderCart();
});






