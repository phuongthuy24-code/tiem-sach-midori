document.addEventListener('DOMContentLoaded', function() {
    const productContainer = document.getElementById('product-list');

    if (!productContainer) return;

    // 1. Gọi API lấy dữ liệu từ Backend/CSDL
    fetch('http://localhost:3000/api/products') // Thay đường dẫn API Backend của Thúy vào đây
        .then(response => response.json())
        .then(products => {
            // Xóa chữ "Đang tải dữ liệu..."
            productContainer.innerHTML = '';

            // Nếu không có sản phẩm nào trong CSDL
            if (products.length === 0) {
                productContainer.innerHTML = '<p>Không có sản phẩm nào.</p>';
                return;
            }

            // 2. Vòng lặp duyệt qua từng sản phẩm trong CSDL để tạo HTML
            products.forEach(product => {
                const productHTML = `
                    <div class="product-card">
                        <a href="product-detail.html?id=${product.id}">
                            <img src="${product.image}" alt="${product.name}">
                        </a>
                        <h3 class="title">${product.name}</h3>
                        <p class="price">${Number(product.price).toLocaleString('vi-VN')}₫</p>
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
                    </div>
                `;
                // Nối HTML sản phẩm vào khung chứa
                productContainer.innerHTML += productHTML;
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
            productContainer.innerHTML = '<p>Không thể tải danh sách sản phẩm. Vui lòng thử lại sau!</p>';
        });
});



/* ==========================================
   XỬ LÝ TRANG CHI TIẾT SẢN PHẨM (PRODUCT DETAIL)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cụm nút Tăng / Giảm số lượng
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const qtyInput = document.getElementById('qty-input');

    if (btnMinus && btnPlus && qtyInput) {
        btnMinus.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value) || 1;
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1;
            }
        });

        btnPlus.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value) || 1;
            qtyInput.value = currentQty + 1;
        });
    }

    // 2. Tự động đọc dữ liệu từ đường link URL (nếu có id sản phẩm)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const detailTitle = document.getElementById('detail-title');
        if (detailTitle) {
            detailTitle.innerText = "Sách Cũ Mã Số #" + productId;
        }
    }
});

// 3. HÀM XỬ LÝ MUA NGAY: Lưu vào LocalStorage & Chuyển sang trang Checkout
function buyNow() {
    // Lấy thông tin sản phẩm hiện tại trên màn hình
    const title = document.getElementById('detail-title')?.innerText || "Sách Cũ Midori";
    const priceText = document.getElementById('detail-price')?.innerText || "49,000đ";
    const imgSrc = document.getElementById('detail-img')?.src || "images/logo.png";
    const quantity = parseInt(document.getElementById('qty-input')?.value) || 1;

    // Chuyển giá từ chuỗi "49,000đ" sang số nguyên 49000
    const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 49000;

    // Tạo đối tượng sản phẩm
    const productItem = {
        id: new Date().getTime(), // Tạo ID ngẫu nhiên theo thời gian
        title: title,
        price: price,
        image: imgSrc,
        quantity: quantity
    };

    // Lấy giỏ hàng hiện tại từ LocalStorage (nếu chưa có thì tạo mảng rỗng)
    let cart = JSON.parse(localStorage.getItem('midori_cart')) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingIndex = cart.findIndex(item => item.title === productItem.title);
    if (existingIndex > -1) {
        // Nếu đã có thì cộng dồn số lượng
        cart[existingIndex].quantity += quantity;
    } else {
        // Nếu chưa có thì thêm mới vào giỏ
        cart.push(productItem);
    }

    // Lưu lại danh sách giỏ hàng mới vào LocalStorage
    localStorage.setItem('midori_cart', JSON.stringify(cart));

    // Chuyển hướng người dùng sang trang Thanh Toán
    window.location.href = 'checkout.html';
}