// ===================================================
// XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ (LOGIN.JS)
// Tối ưu sẵn cấu trúc để ghép Backend CSDL sau này
// ===================================================

// CONFIG: Cấu hình địa chỉ API Backend (Sau này có Server chỉ cần đổi đường dẫn ở đây)
const API_CONFIG = {
    USE_FAKE_DATA: true, // 🟢 Đang bật chế độ GIẢ LẬP (Chưa dùng CSDL). Khi nào có CSDL thật thì đổi thành false!
    BASE_URL: 'http://localhost:3000/api' // Đường dẫn API Backend CSDL sau này
};

document.addEventListener('DOMContentLoaded', function () {

    // 0. NẾU ĐÃ ĐĂNG NHẬP RỒI -> CHUYỂN NGHUYÊN SANG PROFILE
    const currentUser = JSON.parse(localStorage.getItem('midori_user'));
    if (currentUser) {
        window.location.href = 'profile.html';
        return;
    }

    // ---------------------------------------------------
    // 1. XỬ LÝ CHUYỂN TAB ĐĂNG NHẬP <-> ĐĂNG KÝ
    // ---------------------------------------------------
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => switchTab('login'));
        tabRegister.addEventListener('click', () => switchTab('register'));
    }

    function switchTab(type) {
        if (type === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }


    // ---------------------------------------------------
    // 2. XỬ LÝ ĐĂNG NHẬP
    // ---------------------------------------------------
    const loginFormElem = loginForm ? loginForm.querySelector('form') : null;

    if (loginFormElem) {
        loginFormElem.addEventListener('submit', async function (e) {
            e.preventDefault();

            const inputs = loginFormElem.querySelectorAll('input');
            const email = inputs[0].value.trim();
            const password = inputs[1].value.trim();

            if (!email || !password) {
                alert('Vui lòng điền đầy đủ Email và Mật khẩu!');
                return;
            }

            // Gọi hàm xử lý Đăng nhập
            const result = await handleLoginService(email, password);

            if (result.success) {
                // Lưu thông tin xác thực vào LocalStorage
                localStorage.setItem('midori_user', JSON.stringify(result.user));
                alert('Đăng nhập thành công! ✨');
                window.location.href = 'profile.html';
            } else {
                alert(result.message);
            }
        });
    }


    // ---------------------------------------------------
    // 3. XỬ LÝ ĐĂNG KÝ
    // ---------------------------------------------------
    const registerFormElem = registerForm ? registerForm.querySelector('form') : null;

    if (registerFormElem) {
        registerFormElem.addEventListener('submit', async function (e) {
            e.preventDefault();

            const inputs = registerFormElem.querySelectorAll('input');
            const registerData = {
                fullName: inputs[0].value.trim(),
                phone: inputs[1].value.trim(),
                email: inputs[2].value.trim(),
                password: inputs[3].value.trim()
            };

            if (!registerData.fullName || !registerData.email || !registerData.password) {
                alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
                return;
            }

            // Gọi hàm xử lý Đăng ký
            const result = await handleRegisterService(registerData);

            if (result.success) {
                alert(result.message);
                switchTab('login'); // Chuyển về tab đăng nhập

                // Điền sẵn email vừa đăng ký sang form đăng nhập
                const loginEmailInput = loginFormElem.querySelectorAll('input')[0];
                if (loginEmailInput) loginEmailInput.value = registerData.email;

                registerFormElem.reset();
            } else {
                alert(result.message);
            }
        });
    }
});


// ===================================================
// HÀM DỊCH VỤ XỬ LÝ DỮ LIỆU (SERVICE LAYER)
// Sau này chỉ cần sửa logic trong 2 hàm này khi nối CSDL!
// ===================================================

/**
 * Hàm gửi dữ liệu Đăng nhập
 */
async function handleLoginService(email, password) {
    // A. NẾU ĐANG CHẠY GIẢ LẬP (CHƯA CÓ CSDL)
    if (API_CONFIG.USE_FAKE_DATA) {
        return {
            success: true,
            message: 'Đăng nhập thành công',
            user: {
                name: email.includes('@') ? email.split('@')[0] : email,
                email: email,
                phone: '0987654321',
                role: 'customer'
            }
        };
    }

    // B. NẾU ĐÃ CÓ CSDL THẬT (Mở comment đoạn dưới này ra khi nối CSDL)
    /*
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Lỗi kết nối máy chủ CSDL!' };
    }
    */
}

/**
 * Hàm gửi dữ liệu Đăng ký
 */
async function handleRegisterService(data) {
    // A. NẾU ĐANG CHẠY GIẢ LẬP (CHƯA CÓ CSDL)
    if (API_CONFIG.USE_FAKE_DATA) {
        return {
            success: true,
            message: `Tạo tài khoản thành công cho ${data.fullName}! Mời bạn đăng nhập 🌸`
        };
    }

    // B. NẾU ĐÃ CÓ CSDL THẬT (Mở comment đoạn dưới này ra khi nối CSDL)
    /*
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Lỗi kết nối máy chủ CSDL!' };
    }
    */
}