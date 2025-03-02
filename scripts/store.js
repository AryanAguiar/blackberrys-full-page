// Function to save cart data to localStorage
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

// Function to load cart data from localStorage
function loadCartFromStorage() {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItems = document.getElementsByClassName('cart-items')[0];

    cartItems.innerHTML = ''; // Clear the current cart display to avoid duplicates

    storedCart.forEach(item => {
        addItemToCart(item.title, item.price, item.image, item.quantity);
    });

    updateCartTotal();
}

// Event listener to load cart functionality
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
});

// Event listener for removing items from the cart
const removeCartItemButtons = document.getElementsByClassName('btn-danger');
for (const button of removeCartItemButtons) {
    button.addEventListener('click', removeCartItem);
}

// Function to handle item removal from cart
function removeCartItem(event) {
    const buttonClicked = event.target;

    // Traverse up the DOM to find the cart row to remove
    const cartRow = buttonClicked.closest('.cart-row');
    if (cartRow) {
        cartRow.remove();
        updateCartTotal();
        saveCartToStorage();
    } else {
        console.error("Could not find the parent cart row for removal.");
    }
}

// Function to update cart total
function updateCartTotal() {
    const cartItemsContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemsContainer.getElementsByClassName('cart-row');
    let total = 0;

    for (const cartRow of cartRows) {
        const priceElement = cartRow.querySelector('.cart-price');
        const quantityInput = cartRow.querySelector('.cart-quantity-input');

        // Extract and parse the price
        const priceText = priceElement.textContent.replace(/[^\d.]/g, ''); // Remove non-numeric characters
        const price = parseFloat(priceText);

        // Parse the quantity
        const quantity = parseInt(quantityInput.value, 10);

        // Ensure valid price and quantity before calculating
        if (isNaN(price) || isNaN(quantity)) {
            console.error("Invalid price or quantity detected", { price, quantity });
            continue; // Skip this row if invalid data is found
        }

        total += price * quantity;
    }

    // Update the total display
    const totalDisplay = document.querySelector('.cart-total-price');
    if (totalDisplay) {
        totalDisplay.textContent = `₹${total.toFixed(2)}`;
    } else {
        console.error("Cart total display element not found");
    }
}


// Event listener for quantity change
const quantityInputs = document.getElementsByClassName('cart-quantity-input');
for (const input of quantityInputs) {
    input.addEventListener('change', quantityChanged);
}

// Event listeners for adding items to the cart
const addToCartButtons = document.getElementsByClassName('shop-item-button');
for (const button of addToCartButtons) {
    button.addEventListener('click', addToCartClicked);
}

// Event listener for purchase button
document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);

// Function to handle purchase
function purchaseClicked() {
    showPopup("Items purchased");
    const cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
    saveCartToStorage();
}

// Function to handle adding items to the cart
function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement.parentElement;
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    const price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    const image = shopItem.getElementsByClassName('shop-item-image')[0].src;
    addItemToCart(title, price, image);
    updateCartTotal();
    saveCartToStorage();
}

// Function to add an item to the cart
function addItemToCart(title, price, image, quantity = 1) {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    for (const cartItemName of cartItemNames) {
        if (cartItemName.innerText === title) {
            showPopup("Item already in cart.");
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
                    <div class=remove-container d-flex">
                        <button class="btn btn-edit" type="button"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="btn btn-danger" type="button"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;

    cartRow.innerHTML = cartRowContent;
    cartItems.append(cartRow);

    // Attach event listener for the remove button
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);

    // Attach event listener for quantity change in input field
    const quantityInput = cartRow.querySelector('.cart-quantity-input');
    quantityInput.addEventListener('change', (event) => quantityChanged(event, cartRow));

    // Attach event listeners for increment and decrement buttons
    const decrementButton = cartRow.querySelector('.decrement');
    const incrementButton = cartRow.querySelector('.increment');

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

    // Save the cart to storage after modification
    saveCartToStorage();
}



// Function to handle quantity change
function quantityChanged(event, cartRow) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }

    // Update cart total after quantity change
    updateCartTotal();
    saveCartToStorage();
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

