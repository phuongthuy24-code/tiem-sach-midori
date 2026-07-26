// ===================================================
// XỬ LÝ TRANG GIỎ HÀNG (CART.JS) - TIỆM SÁCH MIDORI
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. Lấy các phần tử HTML chính trên trang giỏ hàng
    const emptyCartBox = document.getElementById('empty-cart');      // Khung chứa giao diện giỏ hàng trống
    const cartContent = document.getElementById('cart-content');        // Khung chứa toàn bộ bảng sản phẩm + thanh toán
    const cartItemsList = document.getElementById('cart-items-list');  // Nơi chứa danh sách từng dòng sản phẩm
    const checkAllHeader = document.getElementById('check-all');       // Ô chọn tất cả trên đầu bảng
    const checkAllFooter = document.getElementById('check-all-footer'); // Ô chọn tất cả ở thanh thanh toán dưới cùng

    // Nếu không tìm thấy các thẻ chính thì dừng (tránh báo lỗi ở các trang khác)
    if (!emptyCartBox || !cartContent) return;

    /**
     * HÀM RENDER (VẼ) DANH SÁCH GIỎ HÀNG
     */
    function renderCart() {
        // Lấy giỏ hàng từ localStorage (Nếu chưa có thì gán mảng rỗng [])
        let cart = JSON.parse(localStorage.getItem('midori_cart')) || [];

        // TRƯỜNG HỢP 1: GIỎ HÀNG TRỐNG
        if (cart.length === 0) {
            emptyCartBox.style.display = 'flex';   /* Hiện khung giỏ hàng trống */
            cartContent.style.display = 'none';    /* Ẩn bảng giỏ hàng */
        } 
        // TRƯỜNG HỢP 2: CÓ SẢN PHẨM TRONG GIỎ
        else {
            emptyCartBox.style.display = 'none';   /* Ẩn khung giỏ hàng trống */
            cartContent.style.display = 'block';   /* Hiện bảng giỏ hàng */

            // Xóa sạch nội dung cũ trong danh sách trước khi vẽ lại
            cartItemsList.innerHTML = '';

            // Lặp qua từng món hàng trong mảng cart để sinh HTML
            cart.forEach((item, index) => {
                let itemTotal = item.price * item.quantity; // Tính tổng tiền cho từng món (Giá x Số lượng)
                let itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                
                // Cấu trúc HTML của 1 dòng sản phẩm (Trùng khớp với file index.js)
                itemDiv.innerHTML = `
                    <div class="col-check">
                        <input type="checkbox" class="item-check" data-index="${index}" checked onchange="onItemCheckChange()">
                    </div>
                    <div class="col-product product-info">
                        <img src="${item.image || 'images/default-book.jpg'}" class="product-img" alt="${item.name}">
                        <span class="product-name">${item.name}</span>
                    </div>
                    <div class="col-price price-unit">${Number(item.price).toLocaleString('vi-VN')}₫</div>
                    <div class="col-quantity">
                        <div class="quantity-box">
                            <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                            <input type="text" class="qty-input" value="${item.quantity}" readonly>
                            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div class="col-total price-total">${Number(itemTotal).toLocaleString('vi-VN')}₫</div>
                    <div class="col-action">
                        <button class="btn-delete" onclick="removeItem(${index})">Xóa</button>
                    </div>
                `;
                cartItemsList.appendChild(itemDiv);
            });

            // Cập nhật số loại sản phẩm có trong giỏ
            const totalCountElem = document.getElementById('total-count');
            if (totalCountElem) totalCountElem.innerText = cart.length;

            // Tính toán tổng tiền ngay sau khi vẽ xong
            calculateTotal();
        }
    }

    /**
     * HÀM TĂNG / GIẢM SỐ LƯỢNG SẢN PHẨM (- 1 +)
     */
    window.changeQty = function(index, amount) {
        let cart = JSON.parse(localStorage.getItem('midori_cart')) || [];
        if (!cart[index]) return;

        cart[index].quantity += amount;

        // Nếu giảm xuống dưới 1 thì giữ nguyên là 1
        if (cart[index].quantity < 1) cart[index].quantity = 1;

        // Lưu lại vào localStorage và vẽ lại giao diện
        localStorage.setItem('midori_cart', JSON.stringify(cart));
        renderCart();
    };

    /**
     * HÀM XÓA 1 SẢN PHẨM KHỎI GIỎ HÀNG
     */
    window.removeItem = function(index) {
        if (confirm('Thúy có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            let cart = JSON.parse(localStorage.getItem('midori_cart')) || [];
            cart.splice(index, 1); // Xóa 1 phần tử tại vị trí index

            localStorage.setItem('midori_cart', JSON.stringify(cart));
            renderCart(); // Vẽ lại giỏ hàng
        }
    };

    /**
     * HÀM XÓA TẤT CẢ SẢN PHẨM TRONG GIỎ (Nút Xóa tất cả ở Footer)
     */
    window.clearCart = function() {
        if (confirm('Thúy có chắc muốn xóa toàn bộ giỏ hàng?')) {
            localStorage.removeItem('midori_cart');
            renderCart();
        }
    };

    /**
     * HÀM TÍNH TỔNG TIỀN CÁC SẢN PHẨM ĐƯỢC TICK CHỌN
     */
    window.calculateTotal = function() {
        let cart = JSON.parse(localStorage.getItem('midori_cart')) || [];
        let checkboxes = document.querySelectorAll('.item-check');
        let total = 0;
        let selectedCount = 0;

        checkboxes.forEach(cb => {
            if (cb.checked) {
                let idx = cb.getAttribute('data-index');
                if (cart[idx]) {
                    total += cart[idx].price * cart[idx].quantity;
                    selectedCount++;
                }
            }
        });

        // Hiển thị tổng tiền và số lượng sản phẩm được chọn lên màn hình
        const totalPriceElem = document.getElementById('total-price');
        const selectedCountElem = document.getElementById('selected-count');

        if (totalPriceElem) totalPriceElem.innerText = total.toLocaleString('vi-VN') + '₫';
        if (selectedCountElem) selectedCountElem.innerText = selectedCount;
    };

    /**
     * HÀM XỬ LÝ KHI THAY ĐỔI TICK CHỌN TỪNG SẢN PHẨM
     */
    window.onItemCheckChange = function() {
        let checkboxes = document.querySelectorAll('.item-check');
        let allChecked = Array.from(checkboxes).every(cb => cb.checked);

        // Tự động bỏ/tick chọn ở nút "Chọn Tất Cả" nếu người dùng tick lẻ tẻ
        if (checkAllHeader) checkAllHeader.checked = allChecked;
        if (checkAllFooter) checkAllFooter.checked = allChecked;

        calculateTotal();
    };

    /**
     * HÀM THAO TÁC TICK / BỎ TICK "CHỌN TẤT CẢ"
     */
    function toggleCheckAll(checked) {
        let checkboxes = document.querySelectorAll('.item-check');
        checkboxes.forEach(cb => cb.checked = checked);
        
        if (checkAllHeader) checkAllHeader.checked = checked;
        if (checkAllFooter) checkAllFooter.checked = checked;

        calculateTotal();
    }

    // Gán sự kiện click vào checkbox "Chọn Tất Cả" ở Đầu trang và Cuối trang
    if (checkAllHeader) checkAllHeader.addEventListener('change', (e) => toggleCheckAll(e.target.checked));
    if (checkAllFooter) checkAllFooter.addEventListener('change', (e) => toggleCheckAll(e.target.checked));

    // Chạy hàm vẽ giỏ hàng lần đầu tiên khi mở trang
    renderCart();
});