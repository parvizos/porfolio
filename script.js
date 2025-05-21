// JavaScript code will go here
console.log("script.js loaded");

// --- Product Detail Page (product-detail.html) ---
if (document.title === "Product Detail") {
    const addToCartButton = document.getElementById('add-to-cart');

    // Function to fetch product details (simplified to get the first product)
    async function getProductDetails() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            if (products.length > 0) {
                return products[0]; // Return the first product as a placeholder
            } else {
                throw new Error("No products found in products.json");
            }
        } catch (error) {
            console.error("Failed to fetch product details:", error);
            return null; // Return null if fetching fails
        }
    }

    if (addToCartButton) {
        addToCartButton.addEventListener('click', async () => {
            const product = await getProductDetails();

            if (!product) {
                alert("Could not add product to cart. Details unavailable.");
                return;
            }

            // Use details from the fetched product
            const productId = product.id;
            const productName = product.name;
            const productPrice = product.price;

            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
            } catch (error) {
                console.error("Error parsing cart data from localStorage on Product Detail page: ", error);
                // Cart remains an empty array, allowing the user to add items as if to a new cart.
            }
            
            let productInCart = cart.find(item => item.id === productId);

            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${productName} has been added to your cart.`);
            console.log('Cart updated:', cart);
            // TODO: Update the product-detail.html page to display these fetched details
            // For example, update elements like:
            // document.getElementById('product-name-element-id').textContent = productName;
            // document.getElementById('product-description-element-id').textContent = product.description;
            // document.getElementById('product-price-element-id').textContent = `$${productPrice.toFixed(2)}`;
            // document.getElementById('product-image-element-id').src = product.image;
        });
    } else {
        console.error("Add to Cart button not found on Product Detail page.");
    }

    // Optional: Load and display product details when the page loads
    // This part is not strictly for "Add to Cart" but makes sense for a detail page.
    // We'll add a placeholder for where to display these details.
    async function displayProductDetailsOnPage() {
        const product = await getProductDetails();
        if (product) {
            // Assuming you have elements in product-detail.html to show these details
            // For example:
            // const nameElement = document.getElementById('product-name');
            // const descriptionElement = document.getElementById('product-description');
            // const priceElement = document.getElementById('product-price');
            // const imageElement = document.getElementById('product-image'); // If it's an <img> tag
            // if (nameElement) nameElement.textContent = product.name;
            // if (descriptionElement) descriptionElement.textContent = product.description;
            // if (priceElement) priceElement.textContent = `$${product.price.toFixed(2)}`;
            // if (imageElement && imageElement.querySelector('img')) { // Assuming image section has an img
            //     imageElement.querySelector('img').src = product.image;
            //     imageElement.querySelector('img').alt = product.name;
            // } else if (imageElement) { // Fallback to text if no img
            //      imageElement.textContent = `Image: ${product.image}`;
            // }
            console.log("Product details for display (using first product):", product);
        } else {
            // Handle case where product details couldn't be fetched
            // e.g., display an error message in the main content area
            console.log("Could not load product details for display.");
        }
    }
    // Call this function if you want to display details on page load
    // displayProductDetailsOnPage();
}

// --- Products Page (products.html) ---
if (document.title === "Products") {
    const productCardsSection = document.getElementById('product-cards');

    async function displayProducts() {
        if (!productCardsSection) {
            console.error("Product cards section not found on Products page.");
            return;
        }

        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();

            if (products.length === 0) {
                productCardsSection.innerHTML = '<p>No products available at the moment.</p>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card'; // Add a class for potential styling
                card.style.border = '1px solid #eee';
                card.style.padding = '15px';
                card.style.margin = '10px';
                card.style.width = '250px'; // Example width
                card.style.textAlign = 'center';


                const name = document.createElement('h3');
                name.textContent = product.name;

                const image = document.createElement('p');
                // For now, displaying image path as text.
                // Could be: const imgTag = document.createElement('img'); imgTag.src = product.image; imgTag.alt = product.name;
                image.textContent = `Image: ${product.image}`;
                image.style.height = '100px'; // Placeholder height
                image.style.backgroundColor = '#f0f0f0'; // Placeholder background

                const price = document.createElement('p');
                price.textContent = `$${product.price.toFixed(2)}`;

                const viewDetailsButton = document.createElement('a');
                viewDetailsButton.href = 'product-detail.html'; // Links to product-detail.html
                // Later, this will be: viewDetailsButton.href = `product-detail.html?id=${product.id}`;
                viewDetailsButton.textContent = 'View Details';
                viewDetailsButton.style.display = 'inline-block';
                viewDetailsButton.style.marginTop = '10px';
                viewDetailsButton.style.padding = '8px 15px';
                viewDetailsButton.style.backgroundColor = '#333';
                viewDetailsButton.style.color = 'white';
                viewDetailsButton.style.textDecoration = 'none';


                card.appendChild(name);
                card.appendChild(image);
                card.appendChild(price);
                card.appendChild(viewDetailsButton);

                productCardsSection.appendChild(card);
            });

        } catch (error) {
            console.error("Failed to fetch or display products:", error);
            productCardsSection.innerHTML = '<p>Could not load products. Please try again later.</p>';
        }
    }

    // Display products on page load
    displayProducts();
}


// --- Cart Page (cart.html) ---
if (document.title === "Shopping Cart") {
    const cartItemsSection = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');
    const paymentFormSection = document.getElementById('payment-form-section');
    const paymentForm = document.getElementById('payment-form');
    const confirmPaymentButton = document.getElementById('confirm-payment-button');
    const paymentMessageDiv = document.getElementById('payment-message');

    function displayCartItems() {
        if (!cartItemsSection) {
            console.error("Cart items section not found on Cart page.");
            return;
        }

        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
        } catch (error) {
            console.error("Error parsing cart data from localStorage in displayCartItems: ", error);
            // Cart remains an empty array, so the "empty cart" message will be shown.
        }
        
        cartItemsSection.innerHTML = ''; // Clear previous items

        if (cart.length === 0) {
            cartItemsSection.innerHTML = '<p>Your cart is empty.</p>';
        if (checkoutButton) checkoutButton.style.display = 'none';
        if (paymentFormSection) paymentFormSection.style.display = 'none';
            return;
        }

        if (checkoutButton) checkoutButton.style.display = 'block';
        if (paymentFormSection) paymentFormSection.style.display = 'none'; // Ensure payment form is hidden initially

        let grandTotal = 0;
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';

        cart.forEach(item => {
            const li = document.createElement('li');
            li.style.border = '1px solid #ccc';
            li.style.marginBottom = '10px';
            li.style.padding = '10px';

            const subtotal = item.price * item.quantity;
            grandTotal += subtotal;

            li.innerHTML = `
                <div><strong>${item.name}</strong></div>
                <div>Price: $${item.price.toFixed(2)}</div>
                <div>Quantity: ${item.quantity}</div>
                <div>Subtotal: $${subtotal.toFixed(2)}</div>
            `;
            ul.appendChild(li);
        });
        cartItemsSection.appendChild(ul);

        // Display Grand Total
        const totalElement = document.createElement('p');
        totalElement.style.fontWeight = 'bold';
        totalElement.style.marginTop = '20px';
        totalElement.innerHTML = `Total: $${grandTotal.toFixed(2)}`;
        cartItemsSection.appendChild(totalElement);
    }

    // Display items on page load
    displayCartItems();

    // Display items on page load
    displayCartItems();

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
            } catch (error) {
                console.error("Error parsing cart data from localStorage on Checkout button click: ", error);
                // Cart will be treated as empty, and the alert below will be shown.
            }

            if (cart.length === 0) {
                alert("Your cart is empty. Please add items before checking out.");
                return;
            }

            if (cartItemsSection) cartItemsSection.style.display = 'none';
            checkoutButton.style.display = 'none';
            if (paymentFormSection) paymentFormSection.style.display = 'block';
            if (paymentMessageDiv) paymentMessageDiv.style.display = 'none'; // Hide any previous messages
        });
    }

    if (confirmPaymentButton && paymentForm) {
        confirmPaymentButton.addEventListener('click', () => {
            // Basic validation (ensure fields are not empty)
            const cardholderName = paymentForm.elements['cardholder-name'].value;
            const cardNumber = paymentForm.elements['card-number'].value;
            const expiryDate = paymentForm.elements['expiry-date'].value;
            const cvv = paymentForm.elements['cvv'].value;

            if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
                alert("Please fill in all payment details.");
                return;
            }
            
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert("Please enter expiry date in MM/YY format.");
                return;
            }


            if (paymentMessageDiv) paymentMessageDiv.style.display = 'block';
            if (paymentMessageDiv) paymentMessageDiv.textContent = 'Processing payment...';
            if (paymentFormSection) paymentFormSection.style.display = 'none';


            setTimeout(() => {
                const paymentSucceeded = Math.random() < 0.8; // 80% chance of success

                if (paymentSucceeded) {
                    if (paymentMessageDiv) paymentMessageDiv.textContent = 'Payment successful! Your order is confirmed.';
                    localStorage.removeItem('cart'); // Clear cart on successful payment
                    
                    // Optionally, clear the payment form fields
                    paymentForm.reset();

                    // Redirect to homepage after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000); // 3 seconds delay
                } else {
                    if (paymentMessageDiv) paymentMessageDiv.textContent = 'Payment failed. Please try again or use a different card.';
                    // Don't clear cart, allow user to try again or modify cart
                    // Show payment form again to allow retry or hide it and show checkout button
                    // For simplicity, we'll just show the message. User can refresh or navigate.
                }
                // Refresh cart display (which will show empty if cleared)
                // displayCartItems(); // Call this if you want to re-render the cart (e.g. to show it's empty)
                                   // or manage visibility of sections differently.
                                   // For now, redirecting or showing message is enough.
            }, 2000); // Simulate 2-second payment processing delay
        });
    }
}
