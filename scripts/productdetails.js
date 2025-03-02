// Load cart items from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadCartFromStorage);

// Function to extract query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'), // Get the 'id' parameter from the URL
    };
}

// Function to load the product details
function loadProductDetails() {
    const { id } = getQueryParams();
    if (id) {
        console.log(`Product ID: ${id}`); // Logs the product ID for debugging

        // You can now use this ID to fetch the product details from an API or use a static object.
        // Here, we're just simulating it with static data:

        // Example: Update the product details (use an actual fetch if connecting to a database)
        const product = getProductById(id); // Simulated function to fetch product data based on ID

        // Update the page with the product details
        if (product) {
            document.querySelector("#product-title").textContent = product.title;
            document.querySelector("#product-id").textContent = `Product ID: ${product.id}`;
            document.querySelector("#product-price").textContent = `MRP: ${product.price}`;
            document.querySelector("#product-image").src = product.image;
        } else {
            alert("Product not found!");
        }
    } else {
        alert("Product ID is missing! Cannot load product details.");
    }
}

// Function to fetch products from the JSON file
async function fetchProducts() {
    try {
        const response = await fetch('scripts/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Function to get product by ID
async function getProductById(id) {
    const products = await fetchProducts();
    return products.find(product => product.id === id);
}

// Function to load product details
async function loadProductDetails() {
    const { id } = getQueryParams();
    if (id) {
        console.log(`Product ID: ${id}`);

        // Fetch product details
        const product = await getProductById(id);

        if (product) {
            // Update the title, price, and main image
            document.querySelector('.shop-item-title').textContent = product.title;
            document.querySelector('.shop-item-price').textContent = product.price;
            document.querySelector('.shop-item-image').src = product.image;

            // Update the carousel images
            const carouselInner = document.querySelector('.carousel-inner');
            
            // Handle altimages (check for altimage1 and altimage2 properties)
            const altimages = [product.altimage1, product.altimage2].filter(Boolean);

            carouselInner.innerHTML = `
                <div class="carousel-item active">
                    <img src="${product.image}" class="d-block w-100 main-product-image shop-item-image" alt="Product Image 1">
                </div>
                ${altimages
                    .map(
                        (altImage, index) => `
                    <div class="carousel-item">
                        <img src="${altImage}" class="d-block w-100 main-product-image alt-item${index + 1}" alt="Product Image ${index + 2}">
                    </div>
                `
                    )
                    .join('')}
            `;

            // Add event listeners to carousel images for overlay
            document.querySelectorAll('.carousel-item img').forEach((image) => {
                image.addEventListener('click', () => {
                    showOverlay(image.src);
                });
            });

            // Update EMI information
            document.querySelector('.emi-info').textContent = `4 Monthly Payments of ₹${Math.ceil(
                parseInt(product.price.replace(/[^\d]/g, '')) / 4
            )} Buy on EMI`;

            // Update the product details section
            document.querySelector('.details p').innerHTML = `
                <div class="container21">
                    <div class="content">
                        <div id="pre-ordering" class="content-section">
                            <h4>Product Details and Care<i class="fa-solid fa-caret-up"></i></h4>
                            <p> Introduce classic charm to your collection with this ${product.title}, epitomizing refined grace.
                                <br>● A stylish design plays a crucial role in enhancing your overall style statement, not just through clothing, but through every element of your appearance.
                                <br>● Combining formal trousers and leather shoes for a professional look is a classic style choice that exudes confidence, sophistication, and attention to detail. 
                                <br>
                                Fabric Composition: 100% Cotton
                                <br>Wash Care: Gentle machine wash. Follow wash care label instructions for durability.
                                <br>
                            </p>
                        </div>
                        <div id="shipping" class="content-section">
                            <h4>Size and Alteration<i class="fa-solid fa-caret-down"></i></h4>
                        </div>
                        <div id="shipping" class="content-section">
                            <h4>Specifications<i class="fa-solid fa-caret-down"></i></h4>
                        </div>
                        <div id="return" class="content-section">
                            <h4>Return policies<i class="fa-solid fa-caret-down"></i></h4>
                        </div>
                    </div>
                </div>
            `;

            // Optionally update additional custom fields (e.g., product ID)
            document.querySelector('.details-toggle').textContent = ``;
        } else {
            alert("Product not found!");
        }
    } else {
        alert("Product ID is missing! Cannot load product details.");
    }
}

// Function to show the overlay
function showOverlay(imageSrc) {
    const overlay = document.getElementById('image-overlay');
    const overlayImage = document.getElementById('overlay-image');

    overlayImage.src = imageSrc;
    overlay.classList.remove('hidden'); // Show the overlay

    // Add a click event to hide the overlay when clicked
    overlay.addEventListener('click', hideOverlay);
}

// Function to hide the overlay
function hideOverlay() {
    const overlay = document.getElementById('image-overlay');
    overlay.classList.add('hidden'); // Hide the overlay

    // Remove the click event listener to avoid duplicates
    overlay.removeEventListener('click', hideOverlay);
}

// Attach click event to the main image only
document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.querySelector('.main-product-image'); // Ensure the main image has this class

    if (mainImage) {
        mainImage.addEventListener('click', () => {
            showOverlay(mainImage.src);
        });
    }
});

// Function to get query parameters (like ID from the URL)
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id')  // Assuming the URL contains ?id=someProductId
    };
}

document.addEventListener('DOMContentLoaded', loadProductDetails);

// Save cart items to localStorage
function saveCartToStorage() {
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItems.getElementsByClassName('cart-row');
    const cartData = [];

    for (let i = 0; i < cartRows.length; i++) {
        const cartRow = cartRows[i];
        const title = cartRow.getElementsByClassName('cart-item-title')[0].innerText;
        const price = cartRow.getElementsByClassName('cart-price')[0].innerText;
        const image = cartRow.getElementsByClassName('cart-item-image')[0].src;
        const quantity = cartRow.getElementsByClassName('cart-quantity-input')[0].value;

        cartData.push({ title, price, image, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cartData));
}

// Load cart items from localStorage
function loadCartFromStorage() {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItems = document.getElementsByClassName('cart-items')[0];

    cartItems.innerHTML = '';

    storedCart.forEach(item => {
        addItemToCart(item.title, item.price, item.image, item.quantity);
    });

    updateCartTotal();
}

// Add item to cart when "Add to Cart" button is clicked
function addToCartClicked(event) {
    const button = event.target;
    const titleElement = document.querySelector('.shop-item-title');
    const priceElement = document.querySelector('.shop-item-price');
    const imageElement = document.querySelector('.shop-item-image');

    if (titleElement && priceElement && imageElement) {
        const title = titleElement.innerText;
        const price = priceElement.innerText;
        const image = imageElement.src;

        addItemToCart(title, price, image);
        updateCartTotal();
        saveCartToStorage();
    } else {
        console.error("Could not find title, price, or image element.");
    }
}

// Add item to the cart
function addItemToCart(title, price, image, quantity = 1) {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            showPopup("Item already in cart");
            return;
        }
    }

    const cartRowContent = `
        <div class="cart-item">
            <img class="cart-item-image" src="${image}" width="100" height="100" alt="${title}">
            <div class="cart-item-details">
                <span class="cart-item-title">${title}</span>
                <p class="size">36</p>
                <div class="cart-item-options">
                    <span class="cart-price">${price}</span>
                    <div class="cart-quantity-selector">
                        <button class="quantity-btn decrement">-</button>
                        <input class="cart-quantity-input values" type="number" value="${quantity}" min="1">
                        <button class="quantity-btn increment">+</button>
                    </div>
                    <button class="btn btn-danger" type="button"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    `;

    cartRow.innerHTML = cartRowContent;
    cartItems.append(cartRow);

    const decrementButton = cartRow.querySelector('.decrement');
    const incrementButton = cartRow.querySelector('.increment');
    const quantityInput = cartRow.querySelector('.cart-quantity-input');

    decrementButton.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        quantityInput.value = Math.max(1, currentQuantity - 1);
        updateCartTotal();
        saveCartToStorage();
    });

    incrementButton.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        quantityInput.value = currentQuantity + 1;
        updateCartTotal();
        saveCartToStorage();
    });

    quantityInput.addEventListener('change', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        quantityInput.value = Math.max(1, currentQuantity || 1); // Ensure minimum value is 1
        updateCartTotal();
        saveCartToStorage();
    });

    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    saveCartToStorage();
}

// Remove item from cart
function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.closest('.cart-row').remove();
    updateCartTotal();
    saveCartToStorage();
}

// Update the total price of items in the cart
function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;

    for (let i = 0; i < cartRows.length; i++) {
        const cartRow = cartRows[i];
        const priceElement = cartRow.getElementsByClassName('cart-price')[0];
        const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceElement.innerText.replace('₹', ''));
        const quantity = quantityElement.value;
        total += price * quantity;
    }

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = "₹" + total;
}

// Handle quantity changes
function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
    saveCartToStorage();
}

// Handle "Add to Cart" button click for the product details page
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.querySelector('.shop-item-button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addToCartClicked);
    }
});


// Function to show a custom modal
function showModal(message, isInput, callback) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalInput = document.getElementById('modal-input');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');

    // Check if modal elements exist
    if (!modal || !modalMessage || !modalConfirm || !modalCancel) {
        console.error("Modal elements not found in the DOM");
        return;
    }

    // Set the message
    modalMessage.innerText = message;

    // Show input field if required
    if (isInput) {
        modalInput.classList.remove('hidden');
        modalInput.value = ''; // Clear previous input
    } else {
        modalInput.classList.add('hidden');
    }

    // Display the modal
    modal.classList.remove('hidden');

    // Confirm button handler
    const handleConfirm = () => {
        callback(isInput ? modalInput.value : true);
        closeModal();
    };

    // Cancel button handler
    const handleCancel = () => {
        callback(null);
        closeModal();
    };

    // Add event listeners (use `{ once: true }` to avoid duplicate listeners)
    modalConfirm.addEventListener('click', handleConfirm, { once: true });
    modalCancel.addEventListener('click', handleCancel, { once: true });
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

//popup button
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.innerText = message;
    popup.classList.remove('hidden');
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
}

async function initializeWishlist() {
    // Extract the product ID from the URL query parameters
    const { id } = getQueryParams();
    if (!id) {
        console.error('Product ID not found in the query parameters.');
        return;
    }

    // Retrieve product details using the product ID
    const product = await getProductById(id);
    if (!product) {
        console.error(`Product with ID ${id} not found.`);
        showPopup('Error: Could not find product details.');
        return;
    }

    const wishlistButtons = document.querySelectorAll('.wishlist-button');

    wishlistButtons.forEach(button => {
        button.setAttribute('data-product-id', id); // Assign the product ID to the button's data attribute

        button.addEventListener('click', function () {
            // Retrieve the product ID from the button's data attribute
            const productId = button.getAttribute('data-product-id');
            if (!productId) {
                console.error('Product ID not found in the button data attribute.');
                showPopup('Error: Could not find product details.');
                return;
            }

            // Validate the fetched product details
            const { title, price, image } = product;
            if (!title || !price || !image) {
                console.error('Incomplete product details.');
                showPopup('Error: Product details are incomplete.');
                return;
            }

            // Retrieve existing wishlists from localStorage
            let wishlists = JSON.parse(localStorage.getItem('wishlists')) || {};

            // Handle case where no wishlists exist
            if (Object.keys(wishlists).length === 0) {
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

            // Show modal to select an existing wishlist or create a new one
            const wishlistNames = Object.keys(wishlists);
            showModal(`Select a wishlist or create a new one:\n${wishlistNames.join('\n')}\n\nType the name of the wishlist:`, true, (wishlistChoice) => {
                if (wishlistChoice) {
                    // Create a new wishlist if it doesn't exist
                    if (!wishlists[wishlistChoice]) {
                        wishlists[wishlistChoice] = [];
                        showPopup(`New wishlist "${wishlistChoice}" created!`);
                    }

                    const selectedWishlist = wishlists[wishlistChoice];
                    const itemExists = selectedWishlist.some(item => item.id === productId); // Check if the product is already in the wishlist

                    if (!itemExists) {
                        // Add the product to the selected wishlist
                        selectedWishlist.push({ title, price, image, id: productId });
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


// Call initializeWishlist on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    initializeWishlist();
});

document.getElementById("navigate-button").addEventListener("click", function () {
    window.location.href = "cart.html";
});

