// ==========================================
// 1. CẤU HÌNH & BIẾN TOÀN CỤC
// ==========================================
const SHIP_FEE = 30000;         // Phí vận chuyển cố định
let checkoutItems = [];         // Danh sách sản phẩm đầy đủ thông tin (kết hợp với DB)
let isFromTemp = false;         // Đánh dấu: true = Mua Ngay, false = Từ Giỏ Hàng
let appliedDiscountPercent = 0; // % Giảm giá mặc định là 0%

// ==========================================
// 2. KHỞI TẠO KHI TRANG TẢI XONG (DOM LOADED)
// ==========================================
document.addEventListener('DOMContentLoaded', async function () {
    // A. Tự động điền thông tin nếu User đã đăng nhập trước đó
    loadUserInfo();

    // B. Xác định nguồn sản phẩm (Ưu tiên đơn "Mua Ngay" trước)
    let rawItems = JSON.parse(localStorage.getItem('midori_checkout_temp'));
    
    if (rawItems && rawItems.length > 0) {
        isFromTemp = true; // Đến từ nút Mua Ngay
    } else {
        rawItems = JSON.parse(localStorage.getItem('midori_cart')) || [];
        isFromTemp = false; // Đến từ Giỏ hàng
    }

    // Nếu không có sản phẩm nào thì chuyển hướng về trang chủ
    if (rawItems.length === 0) {
        alert('Không tìm thấy sản phẩm nào để thanh toán!');
        window.location.href = 'index.html';
        return;
    }

    // C. Lấy dữ liệu sản phẩm từ Cơ sở dữ liệu (API)
    await fetchProductsFromDatabase(rawItems);
});

// ==========================================
// 3. TẢI THÔNG TIN USER TỪ LOCALSTORAGE
// ==========================================
function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('midori_user'));
    if (user) {
        if (user.fullName || user.username) {
            document.getElementById('order-name').value = user.fullName || user.username;
        }
        if (user.phone) {
            document.getElementById('order-phone').value = user.phone;
        }
        if (user.address) {
            document.getElementById('order-address').value = user.address;
        }
    }
}

// ==========================================
// 4. KHAI BÁO & LẤY DỮ LIỆU TỪ DATABASE (API)
// ==========================================
async function fetchProductsFromDatabase(rawItems) {
    try {
        /* 
           VÍ DỤ KHI GỌI API THỰC TẾ VỚI BACKEND (Node.js/PHP/Java...):
           const res = await fetch('https://api.tiemsachmidori.com/products/batch', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ ids: rawItems.map(item => item.id) })
           });
           const dbProducts = await res.json();
        */

        // Giả lập Dữ liệu lấy từ Database của hệ thống
        const mockDatabase = [
            { id: 101, title: 'Nhà Giả Kim', price: 79000 },
            { id: 102, title: 'Cây Cam Ngọt Của Tôi', price: 108000 },
            { id: 103, title: 'Đắc Nhân Tâm', price: 95000 }
        ];

        // Ghép thông tin chuẩn từ DB với số lượng (quantity) người dùng chọn
        checkoutItems = rawItems.map(item => {
            const dbProduct = mockDatabase.find(p => p.id == item.id) || {
                title: item.title || 'Sách Midori',
                price: item.price || 0
            };

            return {
                id: item.id,
                title: dbProduct.title,
                price: dbProduct.price,
                quantity: item.quantity || 1
            };
        });

        // Tải xong dữ liệu thì render ra màn hình
        renderSummaryList();

    } catch (error) {
        console.error('Lỗi kết nối CSDL:', error);
        alert('Không thể tải dữ liệu sản phẩm từ máy chủ. Vui lòng thử lại!');
    }
}

// ==========================================
// 5. RENDER DANH SÁCH SẢN PHẨM & TÍNH TIỀN
// ==========================================
function renderSummaryList() {
    const summaryList = document.getElementById('cart-summary-list');
    let subTotal = 0;
    let html = '';

    checkoutItems.forEach(item => {
        let itemTotal = item.price * item.quantity;
        subTotal += itemTotal;

        html += `
            <div class="summary-item">
                <div>
                    <div class="summary-item-name">${item.title}</div>
                    <div class="summary-item-qty">Đơn giá: ${item.price.toLocaleString('vi-VN')}đ | SL: ${item.quantity}</div>
                </div>
                <strong>${itemTotal.toLocaleString('vi-VN')}đ</strong>
            </div>
        `;
    });

    summaryList.innerHTML = html;

    // TÍNH TOÁN GIẢM GIÁ VÀ TỔNG TIỀN
    let discountAmount = subTotal * (appliedDiscountPercent / 100);
    let finalTotal = subTotal + SHIP_FEE - discountAmount;

    // Cập nhật lên giao diện HTML
    document.getElementById('sub-total').innerText = subTotal.toLocaleString('vi-VN') + 'đ';

    // Ẩn/Hiện dòng Giảm Giá
    const discountRow = document.getElementById('discount-row');
    if (appliedDiscountPercent > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discount-amount').innerText = '-' + discountAmount.toLocaleString('vi-VN') + 'đ';
    } else {
        discountRow.style.display = 'none';
    }

    // Tổng tiền thanh toán cuối cùng (Không âm)
    document.getElementById('final-total').innerText = (finalTotal > 0 ? finalTotal : 0).toLocaleString('vi-VN') + 'đ';
}

// ==========================================
// 6. XỬ LÝ MÃ GIẢM GIÁ (COUPON)
// ==========================================
function applyCoupon() {
    const couponInput = document.getElementById('coupon-code');
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
        alert('Thúy vui lòng nhập mã giảm giá!');
        return;
    }

    // Danh sách các mã Coupon hợp lệ (Thúy có thể thay bằng API kiểm tra từ DB)
    if (code === 'MIDORI10') {
        appliedDiscountPercent = 10;
        alert('Mã MIDORI10 hợp lệ! Bạn được giảm 10%.');
    } else if (code === 'MIDORI20') {
        appliedDiscountPercent = 20;
        alert('Mã MIDORI20 hợp lệ! Bạn được giảm 20%.');
    }else if (code === 'TOI YEU MIDORI') {
        appliedDiscountPercent = 50;
        alert('Mã TOI YEU MIDORI hợp lệ! Bạn được giảm 50%.');
    } else {
        appliedDiscountPercent = 0;
        alert('❌ Mã giảm giá không đúng hoặc đã hết hạn!');
    }

    // Tính lại tiền sau khi áp mã
    renderSummaryList();
}

// ==========================================
// 7. XỬ LÝ SỰ KIỆN NÚT "ĐẶT HÀNG NGAY"
// ==========================================
async function handleOrderSubmit(e) {
    e.preventDefault();

    // Khóa nút submit để tránh bấm liên tục nhiều lần
    const btnSubmit = document.getElementById('btnSubmitOrder');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...';

    // Lấy thông tin từ form
    const name = document.getElementById('order-name').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked').value;

    // Tính toán tổng tiền cuối
    let subTotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = subTotal * (appliedDiscountPercent / 100);
    let finalTotal = subTotal + SHIP_FEE - discountAmount;

    // Đóng gói Object Đơn Hàng
    const newOrder = {
        orderId: 'MDR' + Math.floor(Math.random() * 89999 + 10000),
        orderDate: new Date().toLocaleString('vi-VN'),
        customerName: name,
        phone: phone,
        address: address,
        paymentMethod: payment === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản Ngân hàng (QR)',
        items: checkoutItems,
        subTotal: subTotal,
        discountAmount: discountAmount,
        shippingFee: SHIP_FEE,
        totalAmount: finalTotal > 0 ? finalTotal : 0,
        status: 'Chờ xác nhận'
    };

    /* 
       GỬI ĐƠN HÀNG VỀ SERVER DATABASE (NẾU CÓ BACKEND):
       await fetch('https://api.tiemsachmidori.com/orders', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(newOrder)
       });
    */

    // Lưu Đơn hàng vào LocalStorage (Được dùng hiển thị ở trang Lịch sử đơn hàng / Profile)
    let orders = JSON.parse(localStorage.getItem('midori_orders')) || [];
    orders.unshift(newOrder);
    localStorage.setItem('midori_orders', JSON.stringify(orders));

    // DỌN DẸP DỮ LIỆU
    if (isFromTemp) {
        // Nếu mua ngay: Chỉ xóa đơn tạm, giỏ hàng giữ nguyên
        localStorage.removeItem('midori_checkout_temp');
    } else {
        // Nếu mua từ giỏ hàng: Xóa luôn giỏ hàng
        localStorage.removeItem('midori_cart');
    }

    // Thông báo & Chuyển hướng
    alert(`🎉 Cảm ơn ${name}! Bạn đã đặt thành công đơn hàng #${newOrder.orderId}`);
    window.location.href = 'profile.html'; // Hoặc trang 'thank-you.html'
}