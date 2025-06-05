import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

const addProductBtn = document.getElementById('addProductBtn');
const productFormSection = document.getElementById('productFormSection');
const productForm = document.getElementById('productForm');
const formTitle = document.getElementById('formTitle');
const logoutBtn = document.getElementById('logoutBtn');
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const productCategorySelect = document.getElementById('productCategory');

let products = [];
let editProductId = null;

function renderProducts(filteredCategory = 'all') {
    productsGrid.innerHTML = '';
    const filteredProducts = filteredCategory === 'all' ? products : products.filter(p => p.category === filteredCategory);
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imgSrc = product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/280x180?text=No+Image';

        card.innerHTML = `
            <img src="${imgSrc}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p class="price">${product.price} د.إ</p>
            <p>${product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
            <div class="actions">
                <button class="editBtn" data-id="${product.id}">تعديل</button>
                <button class="deleteBtn" data-id="${product.id}">حذف</button>
            </div>
        `;

        productsGrid.appendChild(card);
    });

    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            startEditProduct(id);
        });
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            deleteProduct(id);
        });
    });
}

function populateCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category))];
    categoryFilter.innerHTML = '<option value="all">الكل</option>';
    productCategorySelect.innerHTML = '';
    categories.forEach(category => {
        const optionFilter = document.createElement('option');
        optionFilter.value = category;
        optionFilter.textContent = category;
        categoryFilter.appendChild(optionFilter);

        const optionSelect = document.createElement('option');
        optionSelect.value = category;
        optionSelect.textContent = category;
        productCategorySelect.appendChild(optionSelect);
    });
}

function startEditProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editProductId = id;
    formTitle.textContent = 'تعديل المنتج';
    productFormSection.style.display = 'block';

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    for (let i = 0; i < productCategorySelect.options.length; i++) {
        if (productCategorySelect.options[i].value === product.category) {
            productCategorySelect.selectedIndex = i;
            break;
        }
    }
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImages').value = product.images.join(', ');
}

async function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        try {
            await deleteDoc(doc(db, "products", id));
        } catch (error) {
            alert('خطأ في حذف المنتج');
            console.error(error);
        }
    }
}

addProductBtn.addEventListener('click', () => {
    editProductId = null;
    formTitle.textContent = 'إضافة منتج جديد';
    productForm.reset();
    productFormSection.style.display = 'block';
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    productFormSection.style.display = 'none';
});

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = editProductId || Date.now().toString();
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const category = productCategorySelect.value;
    const description = document.getElementById('productDescription').value.trim();
    const images = document.getElementById('productImages').value.split(',').map(img => img.trim()).filter(img => img);

    if (!name || !price || !category || !description || images.length === 0) {
        alert('يرجى ملء جميع الحقول بشكل صحيح');
        return;
    }

    const productData = { id, name, price, category, description, images };

    try {
        if (editProductId) {
            const productRef = doc(db, "products", id);
            await updateDoc(productRef, productData);
        } else {
            const productRef = doc(db, "products", id);
            await setDoc(productRef, productData);
        }
        productFormSection.style.display = 'none';
        editProductId = null;
    } catch (error) {
        alert('خطأ في حفظ المنتج');
        console.error(error);
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    window.location.href = '../login.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('email');
    if (email !== 'admin') {
        alert('يجب تسجيل الدخول كمسؤول للوصول إلى لوحة التحكم');
        window.location.href = '../login.html';
    } else {
        const q = query(collection(db, "products"));
        onSnapshot(q, (querySnapshot) => {
            products = [];
            querySnapshot.forEach((doc) => {
                products.push(doc.data());
            });
            populateCategoryFilter();
            renderProducts(categoryFilter.value);
        });
    }
});

categoryFilter.addEventListener('change', () => {
    renderProducts(categoryFilter.value);
});
