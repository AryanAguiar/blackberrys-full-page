document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded. Initializing wishlist...");
    initializeWishlist();
    loadWishlist();
    loadSaveForLater(); // Load saved items into the "Save for Later" section
});

// Initialize wishlist and saveForLater in localStorage if they don't exist
function initializeWishlist() {
    if (!localStorage.getItem("wishlists")) {
        localStorage.setItem("wishlists", JSON.stringify({}));
        console.log("Wishlist initialized in localStorage.");
    }
    if (!localStorage.getItem("saveForLater")) {
        localStorage.setItem("saveForLater", JSON.stringify([]));
        console.log("Save for Later list initialized in localStorage.");
    }
}

// Function to load and display wishlist items
function loadWishlist() {
    console.log("Loading wishlists...");
    const wishlistContainer = document.getElementById("wishlist");
    if (!wishlistContainer) {
        console.error("Wishlist container not found!");
        return;
    }
    wishlistContainer.innerHTML = ""; 

    const wishlistData = localStorage.getItem("wishlists");
    if (!wishlistData) {
        console.warn("No wishlist data found in localStorage.");
        displayMessage(wishlistContainer, "Your wishlist is empty.");
        return;
    }

    let wishlists;
    try {
        wishlists = JSON.parse(wishlistData);
    } catch (error) {
        console.error("Error parsing wishlist data:", error);
        displayMessage(wishlistContainer, "Could not load wishlists. Please try again later.", "text-danger");
        return;
    }

    const wishlistNames = Object.keys(wishlists);
    if (wishlistNames.length === 0) {
        displayMessage(wishlistContainer, "You have no saved wishlists.");
        return;
    }

    wishlistNames.forEach(wishlistName => {
        const wishlistItems = wishlists[wishlistName];
        if (!wishlistItems || wishlistItems.length === 0) {
            console.warn(`Skipping empty wishlist: ${wishlistName}`);
            return;
        }

        const wishlistSection = createWishlistSection(wishlistName, wishlistItems);
        wishlistContainer.appendChild(wishlistSection);
    });
}

// Function to display a message in a container
function displayMessage(container, message, className = "text-center") {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.className = className;
    container.appendChild(messageElement);
}

// Create a wishlist section
function createWishlistSection(wishlistName, wishlistItems) {
    const wishlistSection = document.createElement("div");
    wishlistSection.className = "wishlist-section mb-5";

    const wishlistHeader = document.createElement("div");
    wishlistHeader.className = "d-flex justify-content-between align-items-center mb-4";

    const wishlistTitle = document.createElement("h3");
    wishlistTitle.textContent = wishlistName;
    wishlistTitle.className = "text-center mb-0";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Wishlist";
    deleteButton.className = "btn btn-danger";
    deleteButton.onclick = () => deleteWishlist(wishlistName);

    wishlistHeader.appendChild(wishlistTitle);
    wishlistHeader.appendChild(deleteButton);
    wishlistSection.appendChild(wishlistHeader);

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "items-container d-flex flex-wrap justify-content-center";

    wishlistItems.forEach(item => {
        const wishlistCard = createWishlistCard(item, wishlistName);
        itemsContainer.appendChild(wishlistCard);
    });

    wishlistSection.appendChild(itemsContainer);
    return wishlistSection;
}

// Create a card for a wishlist item
function createWishlistCard(item, wishlistName) {
    const wishlistCard = document.createElement("div");
    wishlistCard.className = "wishlist-card mb-3 mx-2";
    wishlistCard.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="${item.image}" class="card-img-top" alt="${item.title}" style="max-height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">Price: ${item.price}</p>
                <button class="btn btn-danger" onclick="removeFromWishlist('${wishlistName}', '${item.title}')">Remove</button>
            </div>
        </div>
    `;
    return wishlistCard;
}

// Function to remove an item from a wishlist and save it for later
function removeFromWishlist(wishlistName, title) {
    console.log(`Removing item "${title}" from wishlist "${wishlistName}".`);

    const wishlistData = localStorage.getItem("wishlists");
    if (!wishlistData) return;

    let wishlists = JSON.parse(wishlistData);
    const wishlist = wishlists[wishlistName];
    if (!wishlist) return;

    const itemIndex = wishlist.findIndex(item => item.title === title);
    if (itemIndex === -1) return;

    const [removedItem] = wishlist.splice(itemIndex, 1); // Remove the item
    localStorage.setItem("wishlists", JSON.stringify(wishlists)); // Update wishlists

    // Add the removed item to "Save for Later"
    const saveForLater = JSON.parse(localStorage.getItem("saveForLater")) || [];
    saveForLater.push({
        id: removedItem.id, // Ensure the product ID is included
        title: removedItem.title,
        price: removedItem.price,
        image: removedItem.image,
    });
    localStorage.setItem("saveForLater", JSON.stringify(saveForLater));

    // Refresh the current wishlist view
    const wishlistContainer = document.getElementById("wishlist");
    if (wishlistContainer && wishlists[wishlistName].length > 0) {
        // If the wishlist still has items, reload only this section
        const itemsContainer = wishlistContainer.querySelector(".items-container");
        itemsContainer.innerHTML = ""; // Clear current items
        wishlists[wishlistName].forEach(item => {
            const wishlistCard = createWishlistCard(item, wishlistName);
            itemsContainer.appendChild(wishlistCard);
        });
    } else {
        // If the wishlist is now empty, display a message
        loadWishlistPreviews(); // Go back to preview cards if it's empty
    }

    loadSaveForLater(); // Refresh the "Save for Later" section
}

// Function to load and display "Save for Later" items
function loadSaveForLater() {
    console.log("Loading Save for Later items...");
    const saveForLaterContainer = document.getElementById("save-for-later");
    if (!saveForLaterContainer) {
        console.error("Save for Later container not found!");
        return;
    }
    saveForLaterContainer.innerHTML = ""; // Clear existing items

    const saveForLaterData = localStorage.getItem("saveForLater");
    if (!saveForLaterData) {
        displayMessage(saveForLaterContainer, "No items saved for later.");
        return;
    }

    let saveForLater;
    try {
        saveForLater = JSON.parse(saveForLaterData);
    } catch (error) {
        console.error("Error parsing Save for Later data:", error);
        displayMessage(saveForLaterContainer, "Could not load Save for Later items.", "text-danger");
        return;
    }

    if (saveForLater.length === 0) {
        displayMessage(saveForLaterContainer, "No items saved for later.");
        return;
    }

    saveForLater.forEach(item => {
        const saveForLaterCard = createSaveForLaterCard(item);
        saveForLaterContainer.appendChild(saveForLaterCard);
    });
}

// Create a card for a "Save for Later" item
function createSaveForLaterCard(item) {
    const saveForLaterCard = document.createElement("div");
    saveForLaterCard.className = "save-for-later-card mb-3 mx-2";
    saveForLaterCard.innerHTML = `
        <div class="card78" style="width: 18rem;">
            <img src="${item.image}" class="card-img-top" alt="${item.title}" style="max-height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">Price: ${item.price}</p>

            </div>
            <div class="vire">
                <span class="view-details" data-id="${item.id}">MOVE TO CART</span>
            </div>
            <div class="vire1">
                <span class="remove-item" >Remove</span>
            </div>
        </div>
    `;

    // Add event listeners to buttons
    const viewDetailsButton = saveForLaterCard.querySelector(".view-details");
    const removeButton = saveForLaterCard.querySelector(".remove-item");

    // Navigate to the product details page
    viewDetailsButton.onclick = () => {
        if (item.id) { // Use a unique ID for the product
            const productDetailsUrl = `productdetails.html?id=${encodeURIComponent(item.id)}`;
            console.log(`Redirecting to: ${productDetailsUrl}`);
            window.location.href = productDetailsUrl; // Redirect to the product details page
        } else {
            alert("Product ID is missing! Cannot navigate to the details page.");
        }
    };

    // Remove the item from "Save for Later"
    removeButton.onclick = () => {
        removeFromSaveForLater(item.title);
    };

    return saveForLaterCard;
}



// Function to remove an item from Save for Later
function removeFromSaveForLater(title) {
    console.log(`Removing item "${title}" from Save for Later.`);

    const saveForLaterData = localStorage.getItem("saveForLater");
    if (!saveForLaterData) return;

    let saveForLater = JSON.parse(saveForLaterData);
    const itemIndex = saveForLater.findIndex(item => item.title === title);
    if (itemIndex === -1) return;

    saveForLater.splice(itemIndex, 1); // Remove the item
    localStorage.setItem("saveForLater", JSON.stringify(saveForLater)); // Update localStorage
    loadSaveForLater(); // Refresh the Save for Later list
}

// Function to delete an entire wishlist
function deleteWishlist(wishlistName) {
    console.log(`Deleting wishlist: "${wishlistName}"`);

    const wishlistData = localStorage.getItem("wishlists");
    if (!wishlistData) return;

    let wishlists = JSON.parse(wishlistData);
    delete wishlists[wishlistName]; // Remove the wishlist
    localStorage.setItem("wishlists", JSON.stringify(wishlists)); // Save updated wishlists
    alert(`Wishlist "${wishlistName}" has been deleted.`);
    loadWishlist(); // Reload wishlist
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded. Initializing wishlist...");
    initializeWishlist();
    loadWishlist();
    loadSaveForLater();

    // Add event listeners for toggle buttons
    const showWishlistButton = document.getElementById("show-wishlist-button");
    const showSaveForLaterButton = document.getElementById("show-save-for-later-button");

    showWishlistButton.addEventListener("click", () => toggleSections("wishlist"));
    showSaveForLaterButton.addEventListener("click", () => toggleSections("saveForLater"));
});

// Function to toggle between Wishlist and Save for Later sections
function toggleSections(section) {
    const wishlistSection = document.getElementById("wishlist-section");
    const saveForLaterSection = document.getElementById("save-for-later-section");
    const showWishlistButton = document.getElementById("show-wishlist-button");
    const showSaveForLaterButton = document.getElementById("show-save-for-later-button");

    if (section === "wishlist") {
        wishlistSection.classList.remove("d-none");
        saveForLaterSection.classList.add("d-none");
        showWishlistButton.classList.add("btn-primary");
        showWishlistButton.classList.remove("btn-secondary");
        showSaveForLaterButton.classList.remove("btn-primary");
        showSaveForLaterButton.classList.add("btn-secondary");
    } else if (section === "saveForLater") {
        saveForLaterSection.classList.remove("d-none");
        wishlistSection.classList.add("d-none");
        showSaveForLaterButton.classList.add("btn-primary");
        showSaveForLaterButton.classList.remove("btn-secondary");
        showWishlistButton.classList.remove("btn-primary");
        showWishlistButton.classList.add("btn-secondary");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded. Initializing wishlist...");
    initializeWishlist();
    loadWishlistPreviews(); // Load preview cards
    loadSaveForLater();

    // Add event listeners for toggle buttons
    const showWishlistButton = document.getElementById("show-wishlist-button");
    const showSaveForLaterButton = document.getElementById("show-save-for-later-button");

    showWishlistButton.addEventListener("click", () => toggleSections("wishlist"));
    showSaveForLaterButton.addEventListener("click", () => toggleSections("saveForLater"));
});

// Initialize wishlist and saveForLater in localStorage if they don't exist
function initializeWishlist() {
    if (!localStorage.getItem("wishlists")) {
        localStorage.setItem("wishlists", JSON.stringify({}));
        console.log("Wishlist initialized in localStorage.");
    }
    if (!localStorage.getItem("saveForLater")) {
        localStorage.setItem("saveForLater", JSON.stringify([]));
        console.log("Save for Later list initialized in localStorage.");
    }
}

// Load and display wishlist preview cards
function loadWishlistPreviews() {
    console.log("Loading wishlist previews...");
    const wishlistContainer = document.getElementById("wishlist");
    if (!wishlistContainer) {
        console.error("Wishlist container not found!");
        return;
    }
    wishlistContainer.innerHTML = ""; // Clear existing items

    const wishlistData = localStorage.getItem("wishlists");
    if (!wishlistData) {
        displayMessage(wishlistContainer, "Your wishlist is empty.");
        return;
    }

    let wishlists;
    try {
        wishlists = JSON.parse(wishlistData);
    } catch (error) {
        console.error("Error parsing wishlist data:", error);
        displayMessage(wishlistContainer, "Could not load wishlists. Please try again later.", "text-danger");
        return;
    }

    const wishlistNames = Object.keys(wishlists);
    if (wishlistNames.length === 0) {
        displayMessage(wishlistContainer, "You have no saved wishlists.");
        return;
    }

    wishlistNames.forEach(wishlistName => {
        const wishlistItems = wishlists[wishlistName];
        if (!wishlistItems || wishlistItems.length === 0) {
            console.warn(`Skipping empty wishlist: ${wishlistName}`);
            return;
        }

        const previewCard = createWishlistPreviewCard(wishlistName, wishlistItems);
        wishlistContainer.appendChild(previewCard);
    });
}

// Create a preview card for a wishlist
function createWishlistPreviewCard(wishlistName, wishlistItems) {
    const firstItem = wishlistItems[0]; // Get the first item in the wishlist

    // Create the main card container
    const previewCard = document.createElement("div");
    previewCard.className = "wishlist-preview-card mb-3 mx-2";
    previewCard.style.cursor = "pointer";

    // Card HTML structure
    previewCard.innerHTML = `
        <div class="card31" style="height: 28rem; width: 28rem; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Card Body -->
            <div class="card-body text-center">
                <!-- Wishlist Title -->
                <h5 class="card-title" style="font-size: 1.2rem; font-weight: bold; color: #333; margin-bottom: 10px;">${wishlistName}</h5>
                
                <!-- Product Count -->
                <p class="card-text" style="font-size: 0.9rem; color: #777;">${wishlistItems.length} product${wishlistItems.length > 1 ? 's' : ''}</p>
            </div>

            <!-- Card Image -->
            <img src="${firstItem.image}" class="card-img-top" alt="${wishlistName}">

            <span class="view-list-span">
                View List
            </span>
        </div>
    `;

    // Add click event to navigate to the full wishlist view
    previewCard.onclick = () => loadFullWishlist(wishlistName, wishlistItems);

    return previewCard;
}


// Load and display the full view of a wishlist

function loadFullWishlist(wishlistName, wishlistItems) {
    console.log(`Loading full view for wishlist: ${wishlistName}`);

    const wishlistContainer = document.getElementById("wishlist");
    if (!wishlistContainer) {
        console.error("Wishlist container not found!");
        return;
    }

    wishlistContainer.innerHTML = ""; // Clear the container
    
    // Create the header section
    const header = document.createElement("div");
    header.className = "wishlist-header";

    const title = document.createElement("h2");
    title.textContent = wishlistName;

    // Add "Back" button
    const backButton = document.createElement("button");
    backButton.textContent = "< Back";
    backButton.className = "backbutton";
    backButton.onclick = loadWishlistPreviews;

    // Add "Delete Wishlist" button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Wishlist";
    deleteButton.className = "deletebutton";
    deleteButton.onclick = () => {
        if (confirm(`Are you sure you want to delete the wishlist "${wishlistName}"?`)) {
            deleteWishlist(wishlistName);
            loadWishlistPreviews(); // Return to preview view after deletion
        }
    };

    // Add elements to the header
    header.appendChild(backButton);
    wishlistContainer.appendChild(title);
    wishlistContainer.appendChild(deleteButton);
    // Add header to the container
    wishlistContainer.appendChild(header);

    // Create the items container
    const itemsContainer = document.createElement("div");
    itemsContainer.className = "items-container";

    wishlistItems.forEach(item => {
        const wishlistCard = createWishlistCard(item, wishlistName);
        itemsContainer.appendChild(wishlistCard);
    });

    // Add items container to the main container
    wishlistContainer.appendChild(itemsContainer);
}



// Function to display a message in a container
function displayMessage(container, message, className = "text-center") {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.className = className;
    container.appendChild(messageElement);
}

// Create a card for a wishlist item
function createWishlistCard(item, wishlistName) {
    const wishlistCard = document.createElement("div");
    wishlistCard.className = "wishlist-card mb-3 mx-2";
    wishlistCard.innerHTML = `
        <div class="card9" style="width: 18rem;">
            <img src="${item.image}" class="card-img-top" alt="${item.title}" style="max-height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">Price: ${item.price}</p>
            </div>
            <div class="hei">
                <span class="click23" onclick="removeFromWishlist('${wishlistName}', '${item.title}')">Remove</span>
            </div>
        </div>
        
    `;
    return wishlistCard;
}

function toggleActiveButton(event) {
    // Remove 'active' class from all buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => button.classList.remove('active'));

    // Add 'active' class to the clicked button
    event.target.classList.add('active');
}

// Add event listeners to all buttons (use event delegation if needed)
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', toggleActiveButton);
});