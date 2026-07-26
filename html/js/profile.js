// ===================================================
// XỬ LÝ TRANG CÁ NHÂN (PROFILE.JS) - TIỆM SÁCH MIDORI
// ===================================================

document.addEventListener('DOMContentLoaded', function () {

    // ---------------------------------------------------
    // 1. KIỂM TRA BẢO VỆ: CHƯA ĐĂNG NHẬP -> ĐẨY RA LOGIN
    // ---------------------------------------------------
    const currentUser = JSON.parse(localStorage.getItem('midori_user'));

    if (!currentUser) {
        alert('Thúy cần đăng nhập để xem thông tin tài khoản nhé!');
        window.location.href = 'login.html';
        return;
    }


    // ---------------------------------------------------
    // 2. HIỂN THỊ THÔNG TIN NGƯỜI DÙNG RA GIAO DIỆN
    // ---------------------------------------------------
    const displayName = currentUser.fullName || currentUser.name || 'Độc giả Midori';
    const displayEmail = currentUser.email || 'Chưa cập nhật email';
    const displayPhone = currentUser.phone || 'Chưa cập nhật SĐT';

    // Cột trái (Sidebar)
    const usernameElem = document.getElementById('user-username');
    const avatarTextElem = document.getElementById('avatar-text');

    if (usernameElem) usernameElem.innerText = displayName;
    if (avatarTextElem) avatarTextElem.innerText = displayName.charAt(0).toUpperCase();

    // Cột phải (Hồ sơ)
    const infoNameElem = document.getElementById('info-name');
    const infoEmailElem = document.getElementById('info-email');
    const infoPhoneElem = document.getElementById('info-phone');

    if (infoNameElem) infoNameElem.innerText = displayName;
    if (infoEmailElem) infoEmailElem.innerText = displayEmail;
    if (infoPhoneElem) infoPhoneElem.innerText = displayPhone;


    // ---------------------------------------------------
    // 3. HIỂN THỊ DANH SÁCH ĐƠN MUA
    // ---------------------------------------------------
    renderMyOrders();


    // ---------------------------------------------------
    // 4. XỬ LÝ NÚT ĐĂNG XUẤT (LOGOUT)
    // ---------------------------------------------------
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Thúy có chắc chắn muốn đăng xuất khỏi Tiệm sách Midori?')) {
                localStorage.removeItem('midori_user');
                alert('Đã đăng xuất thành công. Hẹn gặp lại Thúy nhé! 🌿');
                window.location.href = 'login.html';
            }
        });
    }


    // ---------------------------------------------------
    // 5. CHUYỂN TAB TRẠNG THÁI (Tất cả, Chờ thanh toán...)
    // ---------------------------------------------------
    const statusBtns = document.querySelectorAll('.order-status-tabs .status-btn');
    statusBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            statusBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

});


// ===================================================
// HÀM HIỂN THỊ ĐƠN HÀNG
// ===================================================
function renderMyOrders() {
    const orderListBox = document.querySelector('.order-list-box');
    if (!orderListBox) return;

    // Lấy đơn hàng từ LocalStorage
    let myOrders = JSON.parse(localStorage.getItem('midori_orders'));


    // ----------------------------------------------------------------------
    // ❌❌❌ [BẮT ĐẦU ĐOẠN CẦN XÓA SAU NÀY] ❌❌❌
    // Khi nào Thúy làm xong trang Checkout (đã lưu đơn thật), 
    // hãy BỎ HOẶC XÓA nguyên khối 'if (!myOrders) { ... }' bên dưới này đi nhé!
    // ----------------------------------------------------------------------
    if (!myOrders) {
        myOrders = [
            {
                orderId: 'MD202608',
                orderDate: '26/07/2026',
                status: 'Chờ giao hàng',
                items: [
                    {
                        name: 'Vòng tay hạt cườm Midori Handmade',
                        price: 45000,
                        quantity: 2,
                        image: 'images/product1.jpg'
                    },
                    {
                        name: 'Sách - Cây Cam Ngọt Của Tôi',
                        price: 108000,
                        quantity: 1,
                        image: 'images/product2.jpg'
                    }
                ],
                totalPrice: 198000
            }
        ];
        // Lưu mẫu tạm thời
        localStorage.setItem('midori_orders', JSON.stringify(myOrders));
    }
    // ----------------------------------------------------------------------
    // ❌❌❌ [KẾT THÚC ĐOẠN CẦN XÓA SAU NÀY] ❌❌❌
    // ----------------------------------------------------------------------


    // Nếu thực sự danh sách rỗng (Chưa mua đơn nào) -> Hiện giỏ trống
    if (myOrders.length === 0) {
        orderListBox.innerHTML = `
            <div class="empty-orders">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-3840333-3200922.png" alt="Chưa có đơn hàng" class="empty-order-img">
                <p>Chưa có đơn hàng nào</p>
            </div>
        `;
        return;
    }

    // Đổ danh sách đơn hàng ra giao diện
    let ordersHTML = '';
    
    myOrders.forEach(order => {
        let itemsHTML = order.items.map(item => `
            <div class="order-item-row" style="display: flex; gap: 15px; padding: 12px 0; border-bottom: 1px dashed #eee; align-items: center;">
                <img src="${item.image || 'images/logo.png'}" 
                     onerror="this.src='https://via.placeholder.com/60'" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #eee;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0 0 5px 0; font-size: 15px; color: #333;">${item.name}</h4>
                    <p style="margin: 0; color: #888; font-size: 13px;">Số lượng: x${item.quantity}</p>
                </div>
                <div style="color: #ee4d2d; font-weight: 600; font-size: 15px;">
                    ${Number(item.price).toLocaleString('vi-VN')}₫
                </div>
            </div>
        `).join('');

        ordersHTML += `
            <div class="order-card" style="background: #fff; border: 1px solid #e0e0e0; margin-bottom: 20px; padding: 18px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                <div class="order-card-header" style="display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; font-size: 14px;">
                    <span><b>Mã đơn:</b> <span style="color: #0b5345;">#${order.orderId}</span> | <small style="color: #777;">${order.orderDate}</small></span>
                    <span style="color: #26aa99; font-weight: 600; background: #e8f8f5; padding: 3px 8px; border-radius: 4px;">${order.status}</span>
                </div>
                
                <div class="order-card-body">
                    ${itemsHTML}
                </div>

                <div class="order-card-footer" style="text-align: right; padding-top: 12px; font-size: 15px; border-top: 1px solid #f0f0f0; margin-top: 5px;">
                    Thành tiền: <strong style="color: #ee4d2d; font-size: 18px; margin-left: 5px;">${Number(order.totalPrice).toLocaleString('vi-VN')}₫</strong>
                </div>
            </div>
        `;
    });

    orderListBox.innerHTML = ordersHTML;
}


// ===================================================
// HÀM CHUYỂN TAB CỘT PHẢI
// ===================================================
window.switchMainTab = function (tabName) {
    const ordersTabContent = document.getElementById('tab-content-orders');
    const profileTabContent = document.getElementById('tab-content-profile');
    const menuOrders = document.getElementById('menu-orders');
    const menuAccount = document.getElementById('menu-account');

    if (!ordersTabContent || !profileTabContent) return;

    ordersTabContent.classList.remove('active');
    profileTabContent.classList.remove('active');
    if (menuOrders) menuOrders.classList.remove('active');
    if (menuAccount) menuAccount.classList.remove('active');

    if (tabName === 'orders') {
        ordersTabContent.classList.add('active');
        if (menuOrders) menuOrders.classList.add('active');
    } else if (tabName === 'profile') {
        profileTabContent.classList.add('active');
        if (menuAccount) menuAccount.classList.add('active');
    }
};



// ---------------------------------------------------
    // 6. XỬ LÝ XÓA TÀI KHOẢN
    // ---------------------------------------------------
    const deleteAccountBtn = document.getElementById('btn-delete-account');

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function () {
            // Bước 1: Hỏi xác nhận lần 1
            const confirmDelete = confirm('⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA TÀI KHOẢN?\nTất cả dữ liệu tài khoản sẽ bị mất hoàn toàn và không thể phục hồi!');
            
            if (confirmDelete) {
                // Lấy thông tin người dùng hiện tại
                const currentUser = JSON.parse(localStorage.getItem('midori_user'));
                // Lấy danh sách tất cả các tài khoản đã đăng ký
                let allUsers = JSON.parse(localStorage.getItem('midori_accounts')) || [];

                if (currentUser) {
                    // Lọc bỏ tài khoản hiện tại ra khỏi danh sách (Xóa tài khoản)
                    // Giả sử mỗi tài khoản phân biệt bằng email hoặc username
                    allUsers = allUsers.filter(user => user.email !== currentUser.email && user.username !== currentUser.username);

                    // Cập nhật lại danh sách tài khoản trong LocalStorage
                    localStorage.setItem('midori_accounts', JSON.stringify(allUsers));

                    // Xóa luôn phiên đăng nhập hiện tại
                    localStorage.removeItem('midori_user');

                    alert('Tài khoản của Thúy đã được xóa thành công. Tiệm sách Midori hân hạnh được đồng hành cùng bạn thời gian qua! 🌿');

                    // Chuyển về trang đăng ký hoặc trang chủ
                    window.location.href = 'index.html';
                }
            }
        });
    }