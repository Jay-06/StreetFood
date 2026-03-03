
const FOOD_ITEMS = [
    { id: 1, name: "Okoy", price: 20, desc: "Okoy with Mongo", image: "/images/Okoy.webp" },
    { id: 2, name: "Chicharon", price: 100, desc: "Chicharon With Bulakbalak", image: "/images/chicharon-bulaklak-1200t.jpg" },
    { id: 3, name: "Carioca", price: 200, desc: "Sweet Rice Ball", image: "/images/carioca-recipe.jpg" },
    { id: 4, name: "Chicken Feet", price: 20, desc: "Fried Chicken Feet", image: "/images/chicken-feet.jpg" },
    { id: 5, name: "Fishball", price: 50, desc: "Fried Fishball", image: "/images/Fishball.jpg" },
    { id: 6, name: "Isaw", price: 30, desc: "Chicken Fried Isaw", image: "/images/isaw.jpg" },
    { id: 7, name: "Kikiam", price: 50, desc: "Savory Dish Sausage", image: "/images/Kikiam.jpg" },
    { id: 8, name: "Kwek-Kwek", price: 20, desc: "Boiled Fried Egg", image: "/images/kwek-kwek.webp" },
    { id: 9, name: "Pork BBQ", price: 50, desc: "Pork Barbecue", image: "/images/porkbbq.jpg" },
    { id: 10, name: "Proben", price: 100, desc: "Chicken's Glandular Stomach", image: "/images/proven.jpg" },
    { id: 11, name: "Taho", price: 20, desc: "Street Drinks", image: "/images/Taho.jpg" },
    { id: 12, name: "Turon", price: 20, desc: "Banana Fried with Sugar", image: "/images/Turon.jpg" }
];

if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
if (!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify([]));
if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    const publicPages = ['login.html', 'signup.html'];
    const currentPage = window.location.href.split('/').pop();

    if (!user && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
    } else if (user && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'home.html';
    }
    updateNavbar();
}


function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navContainer = document.getElementById('nav-links');
    const userDisplay = document.getElementById('user-display');
    
    if (navContainer) {
        if (user) {
            userDisplay.textContent = `Hi, ${user.name}`;
            navContainer.innerHTML = `
                <a href="home.html">Menu</a>
                <a href="cart.html">Cart</a>
                <a href="orders.html">My Orders</a>
                <a href="payment.html">Payment/History</a>
                <a href="profile.html">Profile</a>
                <a href="#" onclick="logout()">Logout</a>
            `;
        } else {
            userDisplay.textContent = '';
            navContainer.innerHTML = `
                <a href="login.html">Login</a>
                <a href="signup.html">Sign Up</a>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}


document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const page = window.location.href.split('/').pop();

    if (page === 'home.html') loadMenu();
    if (page === 'cart.html') loadCart();
    if (page === 'orders.html') loadOrders();
    if (page === 'payment.html') loadPaymentHistory();
    if (page === 'profile.html') loadProfile();
    if (page === 'search.html') performSearch();
    if (page === 'search.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const searchInput = document.getElementById('search-input');
        if(query) {
            searchInput.value = query;
            const results = FOOD_ITEMS.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
            const container = document.getElementById('search-results');
            container.innerHTML = results.length ? 
                results.map(item => `
                    <div class="food-card">
                        <div class="food-info">
                            <h3>${item.name}</h3>
                            <div class="price">₱${item.price}</div>
                            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
                        </div>
                    </div>
                `).join('') : '<p>No results found.</p>';
        } else {
            performSearch();
        }
    }
});

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'home.html';
    } else {
        alert('Invalid credentials');
    }
}


function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const contact = document.getElementById('contact').value;
    const address = document.getElementById('address').value;

    const users = JSON.parse(localStorage.getItem('users'));
    
    if (users.find(u => u.username === username)) {
        alert('Username already exists');
        return;
    }

    const newUser = { name, username, password, contact, address };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Signup successful! Please login.');
    window.location.href = 'login.html';
}


function loadMenu() {
    const container = document.getElementById('menu-container');
    if(!container) return;

    container.innerHTML = FOOD_ITEMS.map(item => `
        <div class="food-card animate-fade">
            <div class="food-img">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     style="width:100%; height:100%; object-fit:cover;"
                     onerror="this.src='https://via.placeholder.com/250x180?text=${item.name}'">
            </div>
            <div class="food-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="price">₱${item.price}</div>
                <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}


function addToCart(id) {
    const item = FOOD_ITEMS.find(f => f.id === id);
    let cart = JSON.parse(localStorage.getItem('cart'));
    
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} added to cart!`);
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const container = document.getElementById('cart-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('total-price').innerText = '0';
        return;
    }

    const groupedCart = cart.reduce((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = { ...item, qty: 0 };
        }
        acc[item.id].qty += 1;
        return acc;
    }, {});

    let total = 0;

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${Object.values(groupedCart).map(item => {
                    const subtotal = item.price * item.qty;
                    total += subtotal;
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td>₱${item.price}</td>
                            <td>
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <button onclick="updateQuantity(${item.id}, 'decrease')" class="btn" style="width:30px; padding:5px; font-weight:bold;">-</button>
                                    <span style="font-weight:bold; font-size:1.1rem;">${item.qty}</span>
                                    <button onclick="updateQuantity(${item.id}, 'increase')" class="btn" style="width:30px; padding:5px; font-weight:bold;">+</button>
                                </div>
                            </td>
                            <td>₱${subtotal}</td>
                            <td><button class="btn-danger" onclick="removeItem(${item.id})">Remove</button></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('total-price').innerText = `₱${total}`;
    document.getElementById('checkout-total').value = total;
}

function updateQuantity(id, action) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;

    if (action === 'increase') {
        const itemToAdd = cart.find(item => item.id === id);
        cart.push(itemToAdd);
    } else if (action === 'decrease') {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); 
}

function removeItem(id) {
    if(!confirm("Remove all of this item from cart?")) return;
    
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function processCheckout(e) {
    e.preventDefault();
    const total = document.getElementById('checkout-total').value;
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if(cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const newOrder = {
        id: Date.now(),
        userId: user.username,
        items: cart,
        total: parseInt(total),
        date: new Date().toLocaleString(),
        status: 'Pending'
    };

    const orders = JSON.parse(localStorage.getItem('orders'));
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    localStorage.setItem('cart', JSON.stringify([]));
    
    alert("Order Placed Successfully!");
    window.location.href = 'orders.html';
}

function loadOrders() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const allOrders = JSON.parse(localStorage.getItem('orders'));
    const userOrders = allOrders.filter(o => o.userId === user.username);
    const container = document.getElementById('orders-container');

    if (!container) return;

    if (userOrders.length === 0) {
        container.innerHTML = '<p>No orders found.</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${userOrders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.date}</td>
                        <td>${order.items.length} items</td>
                        <td>₱${order.total}</td>
                        <td>${order.status}</td>
                        <td>
                            ${order.status === 'Pending' ? 
                            `<button class="btn-danger" onclick="deleteOrder(${order.id})">Cancel</button>` : '-'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function deleteOrder(orderId) {
    if(!confirm("Are you sure you want to cancel this order?")) return;
    
    let orders = JSON.parse(localStorage.getItem('orders'));
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
}

function loadPaymentHistory() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const allOrders = JSON.parse(localStorage.getItem('orders'));
    const userPayments = allOrders.filter(o => o.userId === user.username); 
    const container = document.getElementById('payment-container');

    if (!container) return;

    if (userPayments.length === 0) {
        container.innerHTML = '<p>No payment history.</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Amount Paid</th>
                    <th>Method</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${userPayments.map(p => `
                    <tr>
                        <td>TXN-${p.id}</td>
                        <td>${p.date}</td>
                        <td>₱${p.total}</td>
                        <td>Cash on Delivery</td>
                        <td>${p.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('profile-name').value = user.name;
    document.getElementById('profile-username').value = user.username;
    document.getElementById('profile-contact').value = user.contact;
    document.getElementById('profile-address').value = user.address;
}

function updateProfile(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name').value;
    const contact = document.getElementById('profile-contact').value;
    const address = document.getElementById('profile-address').value;
    const password = document.getElementById('profile-password').value;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users'));

    const index = users.findIndex(u => u.username === currentUser.username);
    if(index !== -1) {
        users[index].name = name;
        users[index].contact = contact;
        users[index].address = address;
        if(password) users[index].password = password;

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[index]));
        alert("Profile Updated Successfully!");
    }
}

function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const container = document.getElementById('search-results');
    
    const results = FOOD_ITEMS.filter(item => item.name.toLowerCase().includes(query));
    
    if(container) {
        container.innerHTML = results.length ? 
            results.map(item => `
                <div class="food-card animate-fade">
                    <div class="food-img">
                        <img src="${item.image}" 
                             alt="${item.name}" 
                             style="width:100%; height:100%; object-fit:cover;"
                             onerror="this.src='https://via.placeholder.com/250x180?text=${item.name}'">
                    </div>
                    <div class="food-info">
                        <h3>${item.name}</h3>
                        <p>${item.desc}</p>
                        <div class="price">₱${item.price}</div>
                        <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
                    </div>
                </div>
            `).join('') : '<p>No results found.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const page = window.location.href.split('/').pop();
    if (page === 'search.html' || page === '') {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const searchInput = document.getElementById('search-input');
        
        if (searchInput) {
            if (query) {
                searchInput.value = query;
                performSearch();
            } else {
                document.getElementById('search-results').innerHTML = '<p>Type to search...</p>';
            }
        }
    }
});