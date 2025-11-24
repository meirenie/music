// Скрипт для аутентификации

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация форм аутентификации
    initAuthForms();
    
    // Проверка статуса авторизации
    checkAuthStatus();
});

// Инициализация форм входа и регистрации
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Обработка входа
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // В реальном приложении здесь был бы запрос к серверу
    if (email && password) {
        // Сохраняем информацию о пользователе в localStorage
        const user = {
            email: email,
            name: email.split('@')[0], // В реальном приложении имя пришло бы с сервера
            isLoggedIn: true
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Закрываем модальное окно
        document.getElementById('loginModal').style.display = 'none';
        
        // Обновляем интерфейс
        updateUIForAuth(user);
        
        alert('Вход выполнен успешно!');
    } else {
        alert('Пожалуйста, заполните все поля.');
    }
}

// Обработка регистрации
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают.');
        return;
    }
    
    if (name && email && password) {
        // Сохраняем пользователя в localStorage (в реальном приложении - запрос к серверу)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Проверяем, существует ли уже пользователь с таким email
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert('Пользователь с таким email уже зарегистрирован.');
            return;
        }
        
        // Добавляем нового пользователя
        users.push({
            name: name,
            email: email,
            password: password // В реальном приложении пароль должен быть хеширован
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Автоматически входим после регистрации
        const user = {
            name: name,
            email: email,
            isLoggedIn: true
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Закрываем модальное окно
        document.getElementById('registerModal').style.display = 'none';
        
        // Обновляем интерфейс
        updateUIForAuth(user);
        
        alert('Регистрация прошла успешно! Добро пожаловать, ' + name + '!');
    } else {
        alert('Пожалуйста, заполните все поля.');
    }
}

// Проверка статуса авторизации
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.isLoggedIn) {
        updateUIForAuth(currentUser);
    }
}

// Обновление интерфейса после авторизации
function updateUIForAuth(user) {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (authButtons) {
        authButtons.innerHTML = `
            <div class="user-info">
                <span>Привет, ${user.name}!</span>
                <a href="my-bookings.html" class="btn btn-outline">Мои записи</a>
                <button class="btn btn-primary" id="logoutBtn">Выйти</button>
            </div>
        `;
        
        // Добавляем обработчик для кнопки выхода
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    }
}

// Обработка выхода
function handleLogout() {
    // Обновляем информацию о пользователе
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentUser.isLoggedIn = false;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Обновляем интерфейс
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn btn-outline" id="loginBtn">Войти</button>
            <button class="btn btn-primary" id="registerBtn">Регистрация</button>
        `;
        
        // Переинициализируем модальные окна
        initModals();
    }
    
    alert('Вы успешно вышли из системы.');
}