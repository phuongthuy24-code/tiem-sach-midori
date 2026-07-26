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