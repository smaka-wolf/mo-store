window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollBtn").style.display = "block";
    } else {
        document.getElementById("scrollBtn").style.display = "none";
    }
}

document.getElementById("scrollBtn").addEventListener("click", function() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
});

// nav 
var nav = document.getElementById('header');
var scrollUp = "scroll-up";
var scrollDown = "scroll-down";
var lastScroll = 0;

if (window.addEventListener) {
    window.addEventListener("scroll", scrollHandler);
} else {
    window.attachEvent("scroll", scrollHandler);
}

function scrollHandler() {
     var currentScroll = window.pageYOffset;
     if (currentScroll === 0) {
         nav.classList.remove(scrollDown);
         nav.classList.remove(scrollUp);
        return;
     }
     if (currentScroll > lastScroll && !nav.classList.contains(scrollDown)) {
                // down
        nav.classList.remove(scrollUp);
        nav.classList.add(scrollDown);
    } 
    else if (currentScroll < lastScroll && nav.classList.contains(scrollDown)) {
                // up
        nav.classList.remove(scrollDown);
        nav.classList.add(scrollUp);
    }
    lastScroll = currentScroll;
}

// cart 
let closeCart = document.querySelector('.closeCart');
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

function viewCart(){
    window.location.href = "cartPage.html"
}

function setupUI() {
    let logout = document.getElementById("display_login");
    let login = document.getElementById("login_btn");
    let token = localStorage.getItem("email");

    if (token) {
        logout.style.display = "flex";
        login.style.display = "none";
    } else {
        logout.style.display = "none";
        login.style.display = "inline-block";
    }
}

function logout(){
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    setupUI();
}
setupUI();

// Load products from localStorage or fallback to json/products.json via fetch
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        renderProducts();
    } else {
        fetch('json/products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                renderProducts();
            })
            .catch(error => {
                alert('خطأ في تحميل بيانات المنتجات');
                console.error(error);
            });
    }
}

let products = [];

function renderProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const imgSrc = product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/280x180?text=No+Image';

        productCard.innerHTML = `
            <img src="${imgSrc}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p>${product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
            <button class="addToCartBtn" data-id="${product.id}">أضف إلى السلة</button>
        `;

        productsContainer.appendChild(productCard);
    });

    // Attach event listeners for add to cart buttons
    document.querySelectorAll('.addToCartBtn').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
