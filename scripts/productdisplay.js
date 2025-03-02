const productGrid = document.querySelector('.container12.product-grid');

// Function to render products
function displayProducts(products) {
    products.forEach(product => {
        // Create product card structure
        const productCard = document.createElement('div');
        productCard.classList.add('product');
        productCard.innerHTML = `
            <div class="image-container">
                <img class="shop-item-image" src="${product.image}" alt="Product Image" data-id="${product.id}">
                <button class="btn btn-secondary wishlist-button" type="button" data-id="${product.id}"><i class="fa-regular fa-heart"></i></button>
                <div class="new-arrival">NEW ARRIVAL</div>
            </div>
            <div class="product-details">
                <h2 class="shop-item-title">${product.title}</h2>
                <p class="shop-item-price price">${product.price}</p>
                <button class="btn btn-primary shop-item-button" type="button" data-id="${product.id}">ADD TO CART</button>
                <button class="btn btn-buy" type="button" data-id="${product.id}">BUY NOW</button>
                <div class="button-container">
                    

                </div>
            </div>
        `;

        // Append the product card to the product grid
        productGrid.appendChild(productCard);
    });

    console.log('Products rendered successfully.');
    
    // Initialize functionalities after rendering products
    initializeImageClick();
    initializeWishlist();
    initializeAddToCart();
    initializeBuyNow();
}

function initializeImageClick() {
    const productImages = document.querySelectorAll('.shop-item-image');

    productImages.forEach(image => {
        image.addEventListener('click', function () {
            const id = image.getAttribute('data-id');

            // Fetch product details from the products array
            fetch('scripts/products.json')
                .then(response => response.json())
                .then(products => {
                    const product = products.find(p => p.id === id);

                    if (!product) {
                        console.error(`Product with ID ${id} not found.`);
                        return;
                    }

                    const { title, price, image, altImages } = product;

                    // Create an object with the product details, including alt images
                    const productDetails = { id, title, price, image, altImages };

                    // Save the product details in localStorage
                    localStorage.setItem('selectedProduct', JSON.stringify(productDetails));

                    // Redirect to the product display page
                    window.location.href = `productdetails.html?id=${id}`;
                })
                .catch(error => console.error('Error fetching product details:', error));
        });
    });
}

// Function to initialize "Buy Now" functionality
function initializeBuyNow() {
    const buyNowButtons = document.querySelectorAll('.btn-buy');

    buyNowButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productElement = button.closest('.product');
            const id = button.getAttribute('data-id');

            // Fetch product details from the products array
            fetch('scripts/products.json')
                .then(response => response.json())
                .then(products => {
                    const product = products.find(p => p.id === id);

                    if (!product) {
                        console.error(`Product with ID ${id} not found.`);
                        return;
                    }

                    const { title, price, image, altImages } = product;

                    // Create an object with the product details, including alt images
                    const productDetails = { id, title, price, image, altImages };

                    // Save the product details in localStorage
                    localStorage.setItem('selectedProduct', JSON.stringify(productDetails));

                    // Redirect to the product display page
                    window.location.href = `productdetails.html?id=${id}`;
                })
                .catch(error => console.error('Error fetching product details:', error));
        });
    });
}

// Function to initialize wishlist functionality
function initializeWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist-button');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = button.getAttribute('data-id');
            if (!id) {
                console.error('Product ID is missing in the button:', button);
                return;
            }

            const productElement = button.closest('.product');
            const title = productElement.querySelector('.shop-item-title').innerText;
            const price = productElement.querySelector('.shop-item-price').innerText;
            const image = productElement.querySelector('.shop-item-image').src;

            let wishlists = JSON.parse(localStorage.getItem('wishlists')) || {};

            if (Object.keys(wishlists).length === 0) {
                // No wishlists found, prompt to create a new one
                showModal('No wishlists found. Enter a name for your new wishlist:', true, (newWishlistName) => {
                    if (newWishlistName) {
                        wishlists[newWishlistName] = [];
                        localStorage.setItem('wishlists', JSON.stringify(wishlists));
                        showPopup(`New wishlist "${newWishlistName}" created!`);
                    } else {
                        showPopup('Wishlist not created. Please provide a valid name.');
                    }
                });
                return;
            }

            const wishlistNames = Object.keys(wishlists).join('\n');
            showModal(`Select a wishlist or create a new one:\n${wishlistNames}`, true, (wishlistChoice) => {
                if (wishlistChoice) {
                    if (!wishlists[wishlistChoice]) {
                        wishlists[wishlistChoice] = [];
                        showPopup(`New wishlist "${wishlistChoice}" created!`);
                    }

                    const selectedWishlist = wishlists[wishlistChoice];
                    const itemExists = selectedWishlist.some(item => item.id === id);

                    if (!itemExists) {
                        selectedWishlist.push({ id, title, price, image });
                        localStorage.setItem('wishlists', JSON.stringify(wishlists));
                        showPopup(`${title} has been added to the wishlist "${wishlistChoice}"!`);
                    } else {
                        showPopup(`${title} is already in the wishlist "${wishlistChoice}".`);
                    }
                } else {
                    showPopup('No wishlist selected or created.');
                }
            });
        });
    });
}

// Function to initialize the "Add to Cart" functionality
function initializeAddToCart() {
    const addToCartButtons = document.querySelectorAll('.shop-item-button');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productElement = button.closest('.product');
            const title = productElement.querySelector('.shop-item-title').innerText;
            const price = productElement.querySelector('.shop-item-price').innerText;
            const image = productElement.querySelector('.shop-item-image').src;
            addItemToCart(title, price, image);
            updateCartTotal();
            saveCartToStorage();
        });
    });
}

// Function to add an item to the cart
function addItemToCart(title, price, image, id, quantity = 1) {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartItemIds = Array.from(cartItems.getElementsByClassName('cart-row')).map(row => 
        row.getAttribute('data-id')
    );

    // Check if the item is already in the cart by comparing the id
    if (cartItemIds.includes(id)) {
        showPopup("Item already in cart.");
        return;
    }

    // Set the id attribute on the cart row
    cartRow.setAttribute('data-id', id);

    // Create the cart row HTML content
    const cartRowContent = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${image}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="${quantity}">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
    `;

    cartRow.innerHTML = cartRowContent;
    cartItems.append(cartRow);

    // Add event listeners for remove button and quantity change
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);

    // Now save the item to the cart in localStorage
    saveCartToStorage(id, title, price, image, quantity);
}


// Function to handle quantity change
function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
    saveCartToStorage();
}

// Function to remove items from the cart
function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    saveCartToStorage();
}

// Function to update cart total
function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;

    for (const cartRow of cartRows) {
        const priceElement = cartRow.getElementsByClassName('cart-price')[0];
        const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceElement.innerText.replace('₹', ''));
        const quantity = quantityElement.value;
        total += price * quantity;
    }

    total = Math.round(total * 100) / 100; // Round to 2 decimal places
    document.getElementsByClassName('cart-total-price')[0].innerText = "₹" + total;
}

// Function to save cart data to localStorage
function saveCartToStorage(id, title, price, image, quantity) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item with the same ID already exists in the cart
    const itemIndex = cartItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        // Update the quantity if the item already exists
        cartItems[itemIndex].quantity += quantity;
    } else {
        // Add the new item to the cart array
        cartItems.push({ id, title, price, image, quantity });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Function to load cart data from localStorage
function loadCartFromStorage() {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItems = document.getElementsByClassName('cart-items')[0];

    cartItems.innerHTML = ''; // Clear the current cart display to avoid duplicates

    storedCart.forEach(item => {
        addItemToCart(item.title, item.price, item.image, item.id, item.quantity);
    });

    updateCartTotal();
}

// Fetch and display products on page load
async function fetchProducts() {
    try {
        const response = await fetch('scripts/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    fetchProducts();
});
