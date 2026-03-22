const products = {
    1: { title: "Smart Watch", price: "$120", img: "assets/Image/tech/8.png", desc: "Modern smartwatch with fitness tracking" },
    2: { title: "Laptop", price: "$190", img: "assets/Image/tech/image 34.png", desc: "High performance laptop" },
    3: { title: "Camera", price: "$450", img: "assets/Image/tech/6.png", desc: "Professional camera" },
    4: { title: "Headphones", price: "$90", img: "assets/Image/tech/image 29.png", desc: "Noise cancelling headphones" },
    5: { title: "Shirt", price: "$25", img: "assets/Layout/alibaba/Image/cloth/Bitmap.png", desc: "Comfortable cotton shirt" },
    6: { title: "Sofa", price: "$420", img: "assets/Image/interior/1.png", desc: "Modern comfortable sofa" },
    7: { title: "Phone", price: "$90", img: "assets/Image/tech/image 23.png", desc: "Best phone for android" },
    8: { title: "Jacket", price: "$80", img: "assets/Layout/alibaba/Image/cloth/jac.png", desc: "Stylish winter jacket" },
    9: { title: "Coat", price: "$40", img: "assets/Layout/alibaba/Image/cloth/image 30.png", desc: "Formal Coat." },
    10: { title: "Bag", price: "$50", img: "assets/Layout/alibaba/Image/cloth/image 26.png", desc: "Bag for daily school useage." }
};

// --- CART LOGIC ---
let cart = JSON.parse(localStorage.getItem('myCart')) || [];

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(cart));
}

// --- PRODUCT DETAIL PAGE ---
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (document.getElementById("title") && products[id]) {
    const p = products[id];
    document.getElementById("title").innerText = p.title;
    document.getElementById("main-img").src = p.img;
    if(document.getElementById("desc")) document.getElementById("desc").innerText = p.desc;
}

// "Add to Cart" Button
const cartBtn = document.querySelector('.cart');
if (cartBtn) {
    cartBtn.onclick = function() {
        // Add item to the cart array
        cart.push({ ...products[id], id: id, qty: 1 });
        saveCart();
        window.location.href = "checkout.html";
    };
}

// --- CHECKOUT PAGE LOGIC ---
if (window.location.pathname.includes("checkout.html")) {
    renderCart();
}

function renderCart() {
    const container = document.querySelector('.checkout-left');
    const cartListArea = document.getElementById('cart-items-list'); // Add this ID to your HTML
    
    if (cart.length === 0) {
        cartListArea.innerHTML = "<h3>Your cart is empty</h3>";
        updatePrices(0);
        return;
    }

    cartListArea.innerHTML = ''; // Clear current view
    let subtotal = 0;

    cart.forEach((item, index) => {
        let itemPrice = parseFloat(item.price.replace('$', ''));
        subtotal += itemPrice * item.qty;

        cartListArea.innerHTML += `
            <div class="cart-item" style="display: flex; gap: 20px; padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
                <div style="width: 100px; height: 100px;"><img src="${item.img}" style="width: 100%; object-fit: contain;"></div>
                <div style="flex: 2;">
                    <h4 style="margin: 0;">${item.title}</h4>
                    <p style="color: #666; font-size: 14px;">${item.desc}</p>
                    <button onclick="removeItem(${index})" style="color: red; border: 1px solid #ddd; background: white; cursor: pointer;">Remove</button>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold;">$${(itemPrice * item.qty).toFixed(2)}</p>
                    <input type="number" value="${item.qty}" min="1" onchange="updateQty(${index}, this.value)" style="width: 50px;">
                </div>
            </div>
        `;
    });

    updatePrices(subtotal);
}

function updateQty(index, newQty) {
    cart[index].qty = parseInt(newQty);
    saveCart();
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1); // Remove 1 item at that index
    saveCart();
    renderCart();
}

function removeAll() {
    cart = [];
    saveCart();
    renderCart();
}

function updatePrices(subtotal) {
    document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
    let finalTotal = subtotal > 0 ? (subtotal - 20 + 10) : 0;
    document.getElementById("total-amount").innerText = `$${finalTotal.toFixed(2)}`;
}


// 1. Function to show the receipt
function showReceipt() {
    const modal = document.getElementById("receipt-modal");
    const details = document.getElementById("receipt-details");
    const totalAmount = document.getElementById("total-amount").innerText;
    
    // Create a list of items bought
    let itemsList = cart.map(item => `<div>• ${item.title} (x${item.qty})</div>`).join('');

    // Fill the receipt HTML
    details.innerHTML = `
        <div style="display:flex; justify-content:space-between;"><strong>Order ID:</strong> <span>#${Math.floor(Math.random() * 100000)}</span></div>
        <div style="display:flex; justify-content:space-between;"><strong>Date:</strong> <span>${new Date().toLocaleDateString()}</span></div>
        <div style="margin-top:10px;"><strong>Items:</strong></div>
        <div style="padding-left:10px; color:#555;">${itemsList}</div>
        <div style="display:flex; justify-content:space-between; margin-top:15px; font-size:18px; font-weight:bold; border-top: 1px solid #eee; pt:10px;">
            <span>Total Paid:</span> <span>${totalAmount}</span>
        </div>
    `;

    modal.style.display = "flex";
}

// 2. Function to close receipt and clear cart
function closeReceipt() {
    localStorage.removeItem('myCart'); // Clear the data
    window.location.href = "index.html"; // Go home
}

// 3. Link the Checkout button
// Look for the green checkout button and add the click event
const checkoutBtn = document.querySelector('button[style*="#00B517"]');
if (checkoutBtn) {
    checkoutBtn.onclick = showReceipt;
}