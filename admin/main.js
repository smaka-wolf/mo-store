const productsTableBody = document.querySelector('#productsTable tbody');
const addProductBtn = document.getElementById('addProductBtn');
const productFormSection = document.getElementById('productFormSection');
const productForm = document.getElementById('productForm');
const formTitle = document.getElementById('formTitle');
const logoutBtn = document.getElementById('logoutBtn');

let products = [];
let editProductId = null;

// Load products from localStorage or fallback to json/products.json via fetch
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        populateCategoryFilter();
        renderProducts();
    } else {
        fetch('../json/products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                localStorage.setItem('products', JSON.stringify(products));
                populateCategoryFilter();
                renderProducts();
            })
            .catch(error => {
                alert('خطأ في تحميل بيانات المنتجات');
                console.error(error);
            });
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Render products as cards in grid
function renderProducts(filteredCategory = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    const filteredProducts = filteredCategory === 'all' ? products : products.filter(p => p.category === filteredCategory);
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imgSrc = product.images.length > 0 ? '../' + product.images[0] : 'https://via.placeholder.com/280x180?text=No+Image';

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

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            startEditProduct(id);
        });
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            deleteProduct(id);
        });
    });
}

// Start adding a new product
addProductBtn.addEventListener('click', () => {
    editProductId = null;
    formTitle.textContent = 'إضافة منتج جديد';
    productForm.reset();
    productFormSection.style.display = 'block';
});

// Populate category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categorySelect = document.getElementById('productCategory');
    const categories = [...new Set(products.map(p => p.category))];
    categoryFilter.innerHTML = '<option value="all">الكل</option>';
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const optionFilter = document.createElement('option');
        optionFilter.value = category;
        optionFilter.textContent = category;
        categoryFilter.appendChild(optionFilter);

        const optionSelect = document.createElement('option');
        optionSelect.value = category;
        optionSelect.textContent = category;
        categorySelect.appendChild(optionSelect);
    });
}

// Filter products when category changes
document.getElementById('categoryFilter').addEventListener('change', (e) => {
    renderProducts(e.target.value);
});

// Start editing a product
function startEditProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editProductId = id;
    formTitle.textContent = 'تعديل المنتج';
    productFormSection.style.display = 'block';

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    const categorySelect = document.getElementById('productCategory');
    for (let i = 0; i < categorySelect.options.length; i++) {
        if (categorySelect.options[i].value === product.category) {
            categorySelect.selectedIndex = i;
            break;
        }
    }
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImages').value = product.images.join(', ');
}

// Delete a product
function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
    }
}

// Cancel form
document.getElementById('cancelBtn').addEventListener('click', () => {
    productFormSection.style.display = 'none';
});

// Save product (add or edit)
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = editProductId || (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1);
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const categorySelect = document.getElementById('productCategory');
    const category = categorySelect.options[categorySelect.selectedIndex].value;
    const description = document.getElementById('productDescription').value.trim();
    const images = document.getElementById('productImages').value.split(',').map(img => img.trim()).filter(img => img);

    if (!name || !price || !category || !description || images.length === 0) {
        alert('يرجى ملء جميع الحقول بشكل صحيح');
        return;
    }

    if (editProductId) {
        // Edit existing product
        const productIndex = products.findIndex(p => p.id === editProductId);
        if (productIndex !== -1) {
            products[productIndex] = { id, name, price, category, description, images };
        }
    } else {
        // Add new product
        products.push({ id, name, price, category, description, images });
    }

    saveProducts();
    renderProducts();
    productFormSection.style.display = 'none';
    editProductId = null;
});

// Logout button
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    window.location.href = '../login.html';
});

// Check admin login on page load
document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('email');
    if (email !== 'admin') {
        alert('يجب تسجيل الدخول كمسؤول للوصول إلى لوحة التحكم');
        window.location.href = '../login.html';
    } else {
        loadProducts();
    }
});
