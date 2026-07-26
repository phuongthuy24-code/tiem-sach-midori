// ===================================================
// TRANG CHỦ INDEX.JS - TIỆM SÁCH MIDORI
// ===================================================

document.addEventListener('DOMContentLoaded', function () {
    // 1. Tải danh sách sản phẩm từ Backend / CSDL khi trang chủ mở lên
    fetchProducts();
});

/**
 * Hàm gọi API lấy danh sách sản phẩm từ máy chủ CSDL
 */
function fetchProducts() {
    // Thay đường dẫn API Backend của Thúy vào đây (Ví dụ Node.js hoặc PHP)
    const API_URL = 'http://localhost:3000/api/products';

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối máy chủ CSDL');
            return response.json();
        })
        .then(products => {
            // Đã lấy được danh sách sản phẩm từ CSDL!
            // Giờ bắt đầu chia ra đổ vào 2 khu vực trên trang chủ:

            // 1. Lấy 5 sản phẩm đầu tiên làm "SÁCH BÁN CHẠY"
            const bestSellers = products.slice(0, 5);
            renderProductList(bestSellers, 'bestseller-list');

            // 2. Lấy 5 sản phẩm tiếp theo làm "TOP SÁCH HOT HIỆN NAY"
            const hotProducts = products.slice(5, 10);
            renderProductList(hotProducts, 'hot-list');
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
            
            // Thông báo nếu chưa bật Backend / CSDL
            const bestSellerBox = document.getElementById('bestseller-list');
            if (bestSellerBox) {
                bestSellerBox.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Đang kết nối Cơ sở dữ liệu...</p>';
            }
        });
}

/**
 * Hàm vẽ thẻ HTML cho từng sản phẩm và chèn vào khung chứa
 * @param {Array} items - Danh sách sách
 * @param {String} containerId - ID của khung chứa trong HTML (bestseller-list hoặc hot-list)
 */
function renderProductList(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Xóa chữ/nội dung cũ trong khung
    container.innerHTML = '';

    // Vòng lặp duyệt qua từng cuốn sách
    items.forEach(book => {
        // Tạo thẻ div cho từng sản phẩm
        const cardHTML = `
            <div class="product-card">
                <a href="product-detail.html?id=${book.id}">
                    <img src="${book.image || 'images/default-book.jpg'}" alt="${book.name}">
                </a>
                <h3>${book.name}</h3>
                <p class="price">Giá: ${Number(book.price).toLocaleString('vi-VN')} VND</p>
                
                <!-- Nút Thêm vào giỏ truyền thẳng ID và thông tin sách -->
                <button class="btn-add" onclick="addToCart(${book.id}, '${book.name}', ${book.price}, '${book.image}')">
                    Thêm vào giỏ
                </button>
            </div>
        `;
        // Nối HTML sản phẩm vào khung chứa
        container.innerHTML += cardHTML;
    });
}

/**
 * HÀM THÊM SẢN PHẨM VÀO GIỎ HÀNG (Lưu vào localStorage)
 */
function addToCart(id, name, price, image) {
    // 1. Lấy giỏ hàng hiện tại từ localStorage (nếu chưa có thì tạo mảng rỗng [])
    let cart = JSON.parse(localStorage.getItem('midori_cart')) || [];

    // 2. Kiểm tra xem cuốn sách này đã có trong giỏ hàng chưa
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        // Nếu đã có -> Tăng số lượng lên 1
        cart[existingIndex].quantity += 1;
    } else {
        // Nếu chưa có -> Thêm món mới vào giỏ
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    // 3. Lưu lại giỏ hàng mới vào localStorage
    localStorage.setItem('midori_cart', JSON.stringify(cart));

    // 4. Thông báo xinh xắn cho người dùng
    alert(`Đã thêm cuốn "${name}" vào giỏ hàng thành công! ✨`);
}