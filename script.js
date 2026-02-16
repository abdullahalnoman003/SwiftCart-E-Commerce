const API_BASE_URL = 'https://fakestoreapi.com';
let allProductsData = [];
let cart = []; 


async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        const categories = await response.json();
        
        const categoryFilters = document.getElementById('categoryFilters');
        if (!categoryFilters) return;
        categories.forEach(category => {
            const button = document.createElement('button');
            button.onclick = () => filterProducts(category);
            button.className = 'px-6 py-3 rounded-full font-semibold border-2 bg-white text-primary border-gray-200 hover:border-primary hover:bg-indigo-50 transition-all duration-300 capitalize';
            button.setAttribute('data-category', category);
            button.textContent = category;
            categoryFilters.appendChild(button);
        });
    } catch (e) {
        console.log("Error loading categories:", e);
    }
}

async function filterProducts(category) {
    try {
        const spinner = document.getElementById('loadingSpinner');
        const productsGrid = document.getElementById('AllProducts');
        
        if (spinner) spinner.classList.remove('hidden');
        if (spinner) spinner.classList.add('flex');

        document.querySelectorAll('[data-category]').forEach(btn => {
            const btnCategory = btn.getAttribute('data-category');
            if (btnCategory === category) {
                btn.className = 'px-6 py-3 rounded-full font-semibold border-2 bg-primary text-white border-primary hover:bg-indigo-700 transition-all duration-300 capitalize';
            } else {
                btn.className = 'px-6 py-3 rounded-full font-semibold border-2 bg-white text-primary border-gray-200 hover:border-primary hover:bg-indigo-50 transition-all duration-300 capitalize';
            }
        });

        let products;
        if (category === 'all') {
            const response = await fetch(`${API_BASE_URL}/products`);
            products = await response.json();
        } else {
            const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
            products = await response.json();
        }
        displayProducts(products, productsGrid);
        if (spinner) spinner.classList.add('hidden');
        if (spinner) spinner.classList.remove('flex');

    } catch (e) {
        console.log("Error filtering products:", e);
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.add('hidden');
            spinner.classList.remove('flex');
        }
    }
}

// Display products in grid
function displayProducts(products, container) {
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
            <img src="${product.image}" alt="${product.title}" class="w-full h-64 object-contain p-4 bg-white">
            <div class="p-6 flex-1 flex flex-col">
                <span class="bg-gray-100 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase w-fit mb-2">${product.category}</span>
                <h3 class="text-lg mb-2 text-gray-800 font-semibold line-clamp-2">${product.title}</h3>
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-yellow-400"><i class="fas fa-star"></i> ${product.rating.rate}</span>
                    <span class="text-gray-700 text-sm">(${product.rating.count})</span>
                </div>
                <div class="text-3xl font-bold text-primary mb-4">$${product.price.toFixed(2)}</div>
                <div class="flex gap-3 mt-auto">
                    <button class="flex-1 px-3 py-3 bg-gray-100 text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all" onclick="showProductDetails(${product.id})">Details</button>
                    <button class="flex-1 px-3 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}


async function TrendingProducts() {
    try{
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        const topRated = data.sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 3);
        const product = document.getElementById('trendingProducts');
        if (!product) return;
        
        product.innerHTML = topRated.map(product => `
        <div class="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
            <img src="${product.image}" alt="${product.title}" class="w-full h-64 object-contain p-4 bg-white">
            <div class="p-6 flex-1 flex flex-col">
                <span class="bg-gray-100 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase w-fit mb-2">${product.category}</span>
                <h3 class="text-lg mb-2 text-gray-800 font-semibold line-clamp-2">${product.title}</h3>
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-yellow-400"><i class="fas fa-star"></i> ${product.rating.rate}</span>
                    <span class="text-gray-700 text-sm">(${product.rating.count})</span>
                </div>
                <div class="text-3xl font-bold text-primary mb-4">$${product.price.toFixed(2)}</div>
                <div class="flex gap-3 mt-auto">
                    <button class="flex-1 px-3 py-3 bg-gray-100 text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all" onclick="showProductDetails(${product.id})">Details</button>
                    <button class="flex-1 px-3 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    }catch(e){
        console.log("error loading", e);  
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    updateCartDisplay();
    TrendingProducts();
    loadCategories();
    const productsContainer = document.getElementById('AllProducts');
    if (productsContainer) {
        filterProducts('all');
    }
});

async function addToCart(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCartToStorage();
        updateCartDisplay();
        
        alert('Product added to cart!');
    } catch (e) {
        console.log('Error adding to cart:', e);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="text-center text-gray-500 py-8">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="bg-white rounded-lg p-3 mb-3 shadow-sm">
                <div class="flex gap-3">
                    <img src="${item.image}" class="w-16 h-16 object-contain">
                    <div class="flex-1">
                        <h4 class="font-semibold text-sm line-clamp-2">${item.title}</h4>
                        <div class="text-primary font-bold">$${item.price.toFixed(2)}</div>
                        <div class="text-sm text-gray-600">Qty: ${item.quantity}</div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="btn btn-sm btn-ghost btn-circle text-red-500">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Checkout feature coming soon! Total: $' + cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));
}


async function showProductDetails(productId){
    try{
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();

        const modalContent = document.getElementById('modalContent');

        modalContent.innerHTML = `
            <div class="bg-gray-50 flex items-center justify-center p-6">
                <img src="${product.image}" class="max-h-72 object-contain">
            </div>
            <div class="flex flex-col">
                <span class="badge badge-outline uppercase w-max mb-2">${product.category}</span>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${product.title}</h2>
                <div class="flex items-center gap-2 mb-3">
                    <div class="text-yellow-400 text-lg">
                        <i class="fas fa-star"></i> ${product.rating.rate}
                    </div>
                    <span class="text-gray-500 text-sm">(${product.rating.count} reviews)</span>
                </div>
                <div class="text-3xl font-extrabold text-primary mb-4">
                    $${product.price}
                </div>
                <p class="text-gray-600 text-sm leading-relaxed mb-6">
                    ${product.description}
                </p>
                <div class="flex gap-3 mt-auto">
                    <button class="btn btn-primary flex-1"
                        onclick="addToCart(${product.id})">
                       <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline flex-1"
                        onclick="document.getElementById('productModal').close()">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
        document.getElementById('productModal').showModal();

    }catch(e){
        console.log("error loading details", e);  
    }
}




