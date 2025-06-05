import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBTh1iwq-xns8PUybwkSKsbZQyycGJR8pE",
    authDomain: "mo-store-bd161.firebaseapp.com",
    projectId: "mo-store-bd161",
    storageBucket: "mo-store-bd161.firebasestorage.app",
    messagingSenderId: "72929276087",
    appId: "1:72929276087:web:07d4d95848dd8df05e9d32"
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
            <img onclick="displayDetails(${productsContainer[i].id});"
             src="${productsContainer[i].images[0]}"
             alt="${productsContainer[i].name}">
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

async function loadProducts(category = null) {
    const q = query(collection(db, "products"));
    try {
        onSnapshot(q, (querySnapshot) => {
            productsContainer = [];
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                productsContainer.push(product);
            });
            console.log("Fetched products:", productsContainer);
            if (productsContainer.length === 0) {
                console.warn("No products found in Firestore 'products' collection. Loading from local JSON.");
                loadProductsFromJSON(category);
                return;
            }
            if (category) {
                productsContainer = productsContainer.filter(product => product.category === category);
            }
            displayProducts();
        }, (error) => {
            console.error("Error fetching products from Firestore:", error);
            loadProductsFromJSON(category);
        });
    } catch (error) {
        console.error("Error in Firestore onSnapshot:", error);
        loadProductsFromJSON(category);
    }
}

async function loadProductsFromJSON(category = null) {
    try {
        const response = await fetch('json/products.json');
        const json = await response.json();
        productsContainer = json;
        if (category) {
            productsContainer = productsContainer.filter(product => product.category === category);
        }
        displayProducts();
    } catch (error) {
        console.error("Error loading products from local JSON:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
