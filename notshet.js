// Data produk Sony (18 produk)
const products = [
    {
        id: 'A7CII',
        name: 'Sony Alpha A7C II',
        category: 'Kamera Mirrorless',
        image: 'https://i.pinimg.com/736x/60/cd/20/60cd20b131065d654cdcbc74e8bdeddb.jpg',
        desc: 'Kamera mirrorless full-frame kompak dengan sensor 33MP, autofokus canggih, dan stabilisasi gambar 5-axis.',
        priceBody: 27537020,
        priceComplete: 29200000,
        originalPrice: 29999000
    },
    // ... (other products remain the same)
];

// Variabel global
let currentProduct = null;
let selectedPackage = 'body';
let selectedPackageName = 'Body Only';
let currentPaymentMethod = 'transfer';
let orderTotal = 0;
let customerData = {};

// Format mata uang Rupiah
function formatRupiah(angka) {
    return 'Rp' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Inisialisasi daftar produk
function initializeProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.onclick = () => showDetail(product.id);

        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <p><strong>${product.name}</strong></p>
            <p class="price">${formatRupiah(product.priceBody)}</p>
            <p>${product.category}</p>
        `;

        productGrid.appendChild(productItem);
    });
}

// Tampilkan detail produk
function showDetail(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    document.getElementById('detailTitle').textContent = currentProduct.name;
    document.getElementById('detailImage').src = currentProduct.image;
    document.getElementById('detailImage').alt = currentProduct.name;
    document.getElementById('detailCategory').textContent = currentProduct.category;
    document.getElementById('detailDesc').textContent = currentProduct.desc;

    // Update harga
    updatePriceDisplay();

    // Opsi paket
    const packageOptions = document.getElementById('packageOptions');
    packageOptions.innerHTML = `
        <h3>Pilih Paket:</h3>
        <label class="package-option ${selectedPackage === 'body' ? 'selected' : ''}" data-package-type="body">
            <input type="radio" name="package" value="body" ${selectedPackage === 'body' ? 'checked' : ''}
                   onchange="updatePackageSelection('body', 'Body Only')">
            <strong>Body Only</strong> - ${formatRupiah(currentProduct.priceBody)}
        </label>
        <label class="package-option ${selectedPackage === 'complete' ? 'selected' : ''}" data-package-type="complete">
            <input type="radio" name="package" value="complete" ${selectedPackage === 'complete' ? 'checked' : ''}
                   onchange="updatePackageSelection('complete', 'Paket Komplit')">
            <strong>Paket Komplit</strong> - ${formatRupiah(currentProduct.priceComplete)}
            <span class="discount">(Hemat ${formatRupiah(currentProduct.originalPrice - currentProduct.priceComplete)})</span>
            <br><small>Termasuk lensa kit dan aksesoris tambahan</small>
        </label>
    `;

    document.getElementById('productList').classList.remove('active');
    document.getElementById('productDetail').classList.add('active');
}

// Update tampilan harga
function updatePriceDisplay() {
    const price = selectedPackage === 'body' ? currentProduct.priceBody : currentProduct.priceComplete;
    document.getElementById('detailPrice').textContent = formatRupiah(price);
    document.getElementById('detailOriginalPrice').textContent = currentProduct.originalPrice ? 
        formatRupiah(currentProduct.originalPrice) : '';
}

// Update pilihan paket
function updatePackageSelection(packageType, packageName) {
    selectedPackage = packageType;
    selectedPackageName = packageName;

    // Update tampilan
    document.querySelectorAll('.package-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.packageType === packageType);
    });

    // Update harga yang ditampilkan
    updatePriceDisplay();
}

// Navigation functions
function goBackToList() {
    document.getElementById('productDetail').classList.remove('active');
    document.getElementById('productList').classList.add('active');
}

function showCheckout() {
    if (!currentProduct) return;

    const price = selectedPackage === 'body' ? currentProduct.priceBody : currentProduct.priceComplete;
    const protection = Math.round(price * 0.004);
    const discount = selectedPackage === 'complete' ? 
        (currentProduct.originalPrice - currentProduct.priceComplete) : 0;
    orderTotal = price + protection;

    document.getElementById('checkoutProduct').textContent = `${currentProduct.name} - ${selectedPackageName}`;
    document.getElementById('checkoutPrice').textContent = formatRupiah(price);
    document.getElementById('checkoutProtection').textContent = formatRupiah(protection);
    document.getElementById('checkoutDiscount').textContent = formatRupiah(discount);
    document.getElementById('checkoutTotal').textContent = formatRupiah(orderTotal);

    document.getElementById('productDetail').classList.remove('active');
    document.getElementById('checkout').classList.add('active');
}

function goBackToDetail() {
    document.getElementById('checkout').classList.remove('active');
    document.getElementById('productDetail').classList.add('active');
}

function goBackToCheckout() {
    document.getElementById('paymentMethod').classList.remove('active');
    document.getElementById('checkout').classList.add('active');
}

// Form validation
function validateCheckoutForm() {
    let isValid = true;
    const errors = {
        'name': 'Harap isi nama lengkap',
        'address': 'Harap isi alamat lengkap',
        'email': 'Harap isi email yang valid',
        'phone': 'Harap isi nomor yang valid (10-13 digit)'
    };

    // Reset error messages
    document.querySelectorAll('#orderForm .error').forEach(el => el.style.display = 'none');

    // Validate each field
    for (const [fieldId, errorMsg] of Object.entries(errors)) {
        const input = document.getElementById(fieldId);
        const value = input.value.trim();
        let fieldValid = true;

        if (!value) {
            fieldValid = false;
        } else if (fieldId === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
            fieldValid = false;
        } else if (fieldId === 'phone' && !/^[0-9]{10,13}$/.test(value)) {
            fieldValid = false;
        }

        if (!fieldValid) {
            document.getElementById(`${fieldId}-error`).style.display = 'block';
            isValid = false;
        }
    }

    if (isValid) {
        customerData = {
            name: document.getElementById('name').value.trim(),
            address: document.getElementById('address').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };
    }

    return isValid;
}

function validateBankTransferForm() {
    let isValid = true;
    const fields = {
        'bankName': 'Harap pilih nama bank',
        'accountNumber': 'Harap isi nomor rekening',
        'accountName': 'Harap isi nama pemilik rekening'
    };

    // Reset error messages
    document.querySelectorAll('#bankTransferForm .error').forEach(el => el.style.display = 'none');

    for (const [fieldId, errorMsg] of Object.entries(fields)) {
        const value = document.getElementById(fieldId).value.trim();
        if (!value) {
            document.getElementById(`${fieldId}-error`).style.display = 'block';
            isValid = false;
        }
    }

    return isValid;
}

// Payment method selection
function selectPayment(method) {
    currentPaymentMethod = method;

    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.paymentType === method);
    });

    document.getElementById('bankTransferForm').style.display = method === 'transfer' ? 'block' : 'none';
    document.getElementById('codForm').style.display = method === 'cod' ? 'block' : 'none';
    
    if (method === 'transfer') {
        document.getElementById('transferAmount').value = formatRupiah(orderTotal);
    } else if (method === 'cod') {
        document.getElementById('codAmount').textContent = formatRupiah(orderTotal);
    }
}

// Form submissions
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateCheckoutForm()) return;

    const btn = document.getElementById('submitOrder');
    const loading = document.getElementById('loading');

    btn.disabled = true;
    loading.classList.add('active');

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        document.getElementById('loading').classList.remove('active');
        document.getElementById('checkout').classList.remove('active');
        document.getElementById('paymentMethod').classList.add('active');
        selectPayment('transfer');
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
        btn.disabled = false;
        loading.classList.remove('active');
    }
});

document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (currentPaymentMethod === 'transfer' && !validateBankTransferForm()) return;

    const btn = document.getElementById('submitPayment');
    const loading = document.getElementById('paymentLoading');

    btn.disabled = true;
    loading.classList.add('active');

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const successBankDetails = document.getElementById('successBankDetails');
        successBankDetails.innerHTML = currentPaymentMethod === 'transfer' ? `
            <p>Silakan lakukan transfer ke rekening berikut:</p>
            <p><strong>Bank:</strong> BCA</p>
            <p><strong>No. Rekening:</strong> 1234567890</p>
            <p><strong>Atas Nama:</strong> PANG2 STORE</p>
            <p><strong>Jumlah:</strong> ${formatRupiah(orderTotal)}</p>
            <p>Pesanan Anda akan segera diproses setelah pembayaran terkonfirmasi.</p>
        ` : `
            <p>Pesanan Anda telah berhasil ditempatkan dengan metode pembayaran COD.</p>
            <p>Total yang harus dibayar saat barang diterima: <strong>${formatRupiah(orderTotal)}</strong></p>
            <p>Barang akan segera kami kirimkan ke alamat:</p>
            <p><strong>Nama:</strong> ${customerData.name}</p>
            <p><strong>Alamat:</strong> ${customerData.address}</p>
            <p>Kami akan menghubungi Anda di <strong>${customerData.phone}</strong> untuk konfirmasi pengiriman.</p>
        `;

        document.getElementById('paymentMethod').classList.remove('active');
        document.getElementById('successModal').classList.add('active');
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
    } finally {
        btn.disabled = false;
        loading.classList.remove('active');
    }
});

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('productList').classList.add('active');
    
    // Reset forms and data
    document.getElementById('orderForm').reset();
    document.getElementById('paymentForm').reset();
    currentProduct = null;
    selectedPackage = 'body';
    selectedPackageName = 'Body Only';
    currentPaymentMethod = 'transfer';
    orderTotal = 0;
    customerData = {};
    
    initializeProducts();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeProducts);