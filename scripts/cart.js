document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.querySelector('.cart-total-price');
    const purchaseButton = document.querySelector('.btn-purchase');

    // Function to load products from products.json
    function loadProductsFromJSON() {
        return fetch('scripts/products.json')
            .then(response => response.json())
            .catch(error => {
                console.error('Error loading products:', error);
                showPopup('Error: Could not load product data.');
            });
    }

    // Function to display cart items
    function displayCartItems(cartItems) {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <p class="message">Your Cart is Empty</p>
                <a href="productsection.html" class="message">
                    <button class="continue">Go to Shop</button>
                </a>
            `;
            cartTotalPrice.textContent = "₹0";
            return;
        }

        cartItems.forEach((item, index) => {
            const cartRow = document.createElement('div');
            cartRow.classList.add('cart-row');
            cartRow.innerHTML = `
                <div class="cart-item cart-column">
                    <img src="${item.image}" width="100" height="100" alt="${item.title}">
                    <div class="cart-item-details">
                        <span class="cart-item-title1">${item.title}</span>
                        <span class="cart-item-price">${item.price}</span>
                    </div>
                </div>
                <div class="cart-item">
                    <div class="cartstuff">
                        <div class="size-container">
                            SIZE: 36
                            <i class="fa-regular fa-pen-to-square"></i>
                        </div>
                        <div class="cart-quantity">
                            <button class="quantity-btn decrement">-</button>
                            <input class="cart-quantity-input values" type="number" value="${item.quantity}" min="1">
                            <button class="quantity-btn increment">+</button>
                        </div>

                        <button class="btn-remove"><i class="fa fa-trash" aria-hidden="true"></i></button>
                 
                        
                    <div/>

                </div>
            `;

            // Update quantity using input field
            const quantityInput = cartRow.querySelector('.cart-quantity-input');
            quantityInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value, 10);
                if (newQuantity > 0) {
                    cartItems[index].quantity = newQuantity; // Update the quantity in the array
                    updateCartItems(cartItems); // Save the updated array to localStorage
                    updateTotalPrice(cartItems); // Update the total price
                } else {
                    e.target.value = 1; // Prevent invalid values
                }
            });

            // Handle decrement button
            cartRow.querySelector('.decrement').addEventListener('click', () => {
                const currentQuantity = parseInt(quantityInput.value, 10);
                if (currentQuantity > 1) {
                    quantityInput.value = currentQuantity - 1;
                    cartItems[index].quantity = currentQuantity - 1;
                    updateCartItems(cartItems);
                    updateTotalPrice(cartItems);
                }
            });

            // Handle increment button
            cartRow.querySelector('.increment').addEventListener('click', () => {
                const currentQuantity = parseInt(quantityInput.value, 10);
                quantityInput.value = currentQuantity + 1;
                cartItems[index].quantity = currentQuantity + 1;
                updateCartItems(cartItems);
                updateTotalPrice(cartItems);
            });

            // Remove item from cart
            cartRow.querySelector('.btn-remove').addEventListener('click', () => {
                cartItems.splice(index, 1); // Remove the item from the array
                updateCartItems(cartItems); // Update localStorage
                displayCartItems(cartItems); // Update the UI
            });

            cartItemsContainer.appendChild(cartRow);

            const itemPrice = parseFloat(item.price.replace('₹', '').replace(',', ''));
            total += itemPrice * parseInt(item.quantity, 10);
        });

        cartTotalPrice.textContent = `₹${total}`;
    }

    // Function to update the total price
    function updateTotalPrice(cartItems) {
        let total = 0;
        cartItems.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('₹', '').replace(',', ''));
            total += itemPrice * parseInt(item.quantity, 10);
        });
        cartTotalPrice.textContent = `₹${total}`;
    }

    // Function to update cart in localStorage
    function updateCartItems(cartItems) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // Purchase button functionality
    purchaseButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        cartItemsContainer.innerHTML = `
            <p>Your Cart is Empty</p>
            <a href="productsection.html">
                <button class="continue">Go to Shop</button>
            </a>
        `;
        cartTotalPrice.textContent = "₹0";
        alert("Thank you for your purchase!");
    });

    // Load products and initialize cart
    loadProductsFromJSON().then(products => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        cartItems.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                cartItem.image = product.image;
                cartItem.title = product.title;
                cartItem.price = product.price;
            }
        });

        displayCartItems(cartItems);
    });
});
