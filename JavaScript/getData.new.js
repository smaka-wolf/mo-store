import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    // Your Firebase config here
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let productsContainer = [];
let linkName = document.getElementsByClassName("categories_link");

function displayProducts() {
    let container = ``;
    for (let i = 0; i < productsContainer.length; i++) {
        container += `
        <div class="product-card" data-id="${productsContainer[i].id}">
        <div class="card-img">
            <img onclick=displayDetails(${productsContainer[i].id});
             src=${productsContainer[i].images[0]}
             alt=${productsContainer[i].name}>
            <a href=""  class="addToCart">
                <ion-icon name="cart-outline" class="Cart"></ion-icon>
            </a>
        </div>
        <div class="card-info">
             <h4 class="product-name" onclick=displayDetails(${productsContainer[i].id});>${productsContainer[i].name}</h4>
             <h5 class="product-price">${productsContainer[i].price}</h5>
        </div>
    </div>`;
    }
    document.getElementById("productCount").innerHTML = `${productsContainer.length} Products`;
    document.querySelector('.products .content').innerHTML = container;
    // Adding event listener to each "addToCart" link
    let addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                let id_product = productCard.dataset.id;
                addToCart(id_product);
            }
        });
    });
}

function getCategory(e) {
    let category = e.target.getAttribute('productCategory');
    setActiveLink(e.target);
    try {
        if (category === 'all') {
            loadProducts();
        } else {
            loadProducts(category);
        }
    } catch (e) {
        console.log("not found");
    }
    if (window.innerWidth <= 768) {
        // to close when use select category
        toggleSidebar();
    }
}

function setActiveLink(activeLink) {
    Array.from(linkName).forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

Array.from(linkName).forEach(function (element) {
    element.addEventListener('click', getCategory);
});

function toggleSidebar() {
    var sidebar = document.querySelector(".aside");
    sidebar.classList.toggle("open");
}

function displayDetails(productId) {
    window.location.href = `ProductDetails.html?productId=${productId}`;
}

function loadProducts(category = null) {
    const q = query(collection(db, "products"));
    onSnapshot(q, (querySnapshot) => {
        productsContainer = [];
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            productsContainer.push(product);
        });
        if (category) {
            productsContainer = productsContainer.filter(product => product.category === category);
        }
        displayProducts();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
