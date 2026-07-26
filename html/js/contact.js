document.addEventListener('DOMContentLoaded', function () {
    renderChatMessages();
    renderReviews();

    // Lắng nghe tín hiệu khi Admin trả lời
    window.addEventListener('storage', function (e) {
        if (e.key === 'midori_chat_data') {
            renderChatMessages();
        }
    });
});

// Lấy thông tin người dùng đang đăng nhập hoặc tạo ID ẩn danh
function getCustomerInfo() {
    const currentUser = JSON.parse(localStorage.getItem('midori_user'));
    if (currentUser) {
        return {
            id: currentUser.email || currentUser.username || 'user_guest',
            name: currentUser.fullName || currentUser.username || 'Độc giả Midori'
        };
    }
    
    // Nếu chưa đăng nhập, dùng ID máy cố định trong Session
    let guestId = sessionStorage.getItem('midori_guest_id');
    if (!guestId) {
        guestId = 'guest_' + Math.floor(Math.random() * 8999 + 1000);
        sessionStorage.setItem('midori_guest_id', guestId);
    }
    return { id: guestId, name: 'Khách (' + guestId + ')' };
}

// ===================================================
// 1. XỬ LÝ CHAT PHÍA KHÁCH HÀNG
// ===================================================
function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    const customer = getCustomerInfo();
    let allChatData = JSON.parse(localStorage.getItem('midori_chat_data')) || {};

    // Nếu khách này chưa có trong hệ thống thì tạo mới
    if (!allChatData[customer.id]) {
        allChatData[customer.id] = {
            customerName: customer.name,
            messages: [
                {
                    sender: 'shop',
                    text: 'Xin chào! Tiệm sách Midori có thể giúp gì cho bạn hôm nay? 😊',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]
        };
    }

    // Thêm tin nhắn mới của Khách
    allChatData[customer.id].messages.push({
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Cập nhật lại Tên khách (nếu đổi)
    allChatData[customer.id].customerName = customer.name;

    localStorage.setItem('midori_chat_data', JSON.stringify(allChatData));
    input.value = '';
    renderChatMessages();
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

function renderChatMessages() {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;

    const customer = getCustomerInfo();
    let allChatData = JSON.parse(localStorage.getItem('midori_chat_data')) || {};
    let customerChat = allChatData[customer.id];

    if (!customerChat || !customerChat.messages) {
        chatBox.innerHTML = `<div class="msg shop">Xin chào! Tiệm sách Midori có thể giúp gì cho bạn hôm nay? 😊</div>`;
        return;
    }

    let html = '';
    customerChat.messages.forEach(msg => {
        if (msg.sender === 'user') {
            html += `<div class="msg user">${msg.text}</div>`;
        } else {
            html += `<div class="msg shop">${msg.text}</div>`;
        }
    });

    chatBox.innerHTML = html;
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ===================================================
// 2. PHẦN GÓC CẢM NHẬN SÁCH (GIỮ NGUYÊN)
// ===================================================
function postReview() {
    const bookTitle = document.getElementById('bookTitleInput').value.trim();
    const reviewText = document.getElementById('reviewTextInput').value.trim();

    if (!bookTitle || !reviewText) {
        alert('Thúy vui lòng nhập đầy đủ tên sách và cảm nhận nhé!');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('midori_user'));
    const authorName = currentUser ? (currentUser.fullName || currentUser.username) : 'Độc giả ẩn danh';

    const newReview = {
        id: Date.now(),
        author: authorName,
        book: bookTitle,
        content: reviewText,
        date: new Date().toLocaleDateString('vi-VN')
    };

    let allReviews = JSON.parse(localStorage.getItem('midori_reviews')) || [];
    allReviews.unshift(newReview);
    localStorage.setItem('midori_reviews', JSON.stringify(allReviews));

    document.getElementById('bookTitleInput').value = '';
    document.getElementById('reviewTextInput').value = '';
    renderReviews();
}

function renderReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    let allReviews = JSON.parse(localStorage.getItem('midori_reviews')) || [];
    let html = '';
    allReviews.forEach(item => {
        html += `
            <div class="review-card">
                <h5>📖 ${item.book}</h5>
                <small>Bởi <b>${item.author}</b> - <i>${item.date}</i></small>
                <p>"${item.content}"</p>
            </div>
        `;
    });
    reviewsList.innerHTML = html;
}