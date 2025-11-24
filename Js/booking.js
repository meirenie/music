// Скрипт для функциональности записи на уроки

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация формы записи
    initBookingForm();
    
    // Загрузка доступных преподавателей и времени
    loadTeachers();
    loadAvailableTimes();
});

// Инициализация формы записи
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const instrumentSelect = document.getElementById('instrument');
    const teacherSelect = document.getElementById('teacher');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    
    // Установка минимальной даты (сегодня)
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Обновление сводки при изменении формы
    [instrumentSelect, teacherSelect, dateInput, timeSelect].forEach(element => {
        if (element) {
            element.addEventListener('change', updateBookingSummary);
        }
    });
    
    // Обработка отправки формы
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
}

// Загрузка преподавателей
function loadTeachers() {
    // В реальном приложении здесь был бы запрос к серверу
    const teachers = [
        { id: 1, name: 'Анна Петрова', instruments: ['piano'], experience: '10 лет' },
        { id: 2, name: 'Иван Сидоров', instruments: ['guitar', 'bass'], experience: '8 лет' },
        { id: 3, name: 'Мария Иванова', instruments: ['violin', 'viola'], experience: '12 лет' },
        { id: 4, name: 'Дмитрий Козлов', instruments: ['drums'], experience: '6 лет' },
        { id: 5, name: 'Елена Смирнова', instruments: ['piano', 'vocal'], experience: '15 лет' }
    ];
    
    const teacherSelect = document.getElementById('teacher');
    if (teacherSelect) {
        // Очищаем существующие опции, кроме первой
        while (teacherSelect.options.length > 1) {
            teacherSelect.remove(1);
        }
        
        // Добавляем преподавателей
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = `${teacher.name} (${teacher.experience})`;
            option.dataset.instruments = teacher.instruments.join(',');
            teacherSelect.appendChild(option);
        });
    }
    
    // Обновляем доступных преподавателей при выборе инструмента
    const instrumentSelect = document.getElementById('instrument');
    if (instrumentSelect) {
        instrumentSelect.addEventListener('change', filterTeachersByInstrument);
    }
}

// Фильтрация преподавателей по выбранному инструменту
function filterTeachersByInstrument() {
    const instrumentSelect = document.getElementById('instrument');
    const teacherSelect = document.getElementById('teacher');
    const selectedInstrument = instrumentSelect.value;
    
    if (teacherSelect) {
        // Показываем всех преподавателей, если инструмент не выбран
        if (!selectedInstrument) {
            for (let i = 1; i < teacherSelect.options.length; i++) {
                teacherSelect.options[i].style.display = '';
            }
            return;
        }
        
        // Фильтруем преподавателей по инструменту
        for (let i = 1; i < teacherSelect.options.length; i++) {
            const option = teacherSelect.options[i];
            const teacherInstruments = option.dataset.instruments.split(',');
            
            if (teacherInstruments.includes(selectedInstrument)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        }
        
        // Сбрасываем выбор преподавателя, если текущий выбранный не подходит
        if (teacherSelect.value) {
            const selectedOption = teacherSelect.options[teacherSelect.selectedIndex];
            if (selectedOption.style.display === 'none') {
                teacherSelect.value = '';
            }
        }
    }
}

// Загрузка доступного времени
function loadAvailableTimes() {
    // В реальном приложении здесь был бы запрос к серверу
    // с учетом выбранной даты и преподавателя
    const times = [
        '09:00', '10:00', '11:00', '12:00', '13:00', 
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
    ];
    
    const timeSelect = document.getElementById('time');
    if (timeSelect) {
        // Очищаем существующие опции, кроме первой
        while (timeSelect.options.length > 1) {
            timeSelect.remove(1);
        }
        
        // Добавляем временные слоты
        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
    }
}

// Обновление сводки записи
function updateBookingSummary() {
    const instrumentSelect = document.getElementById('instrument');
    const teacherSelect = document.getElementById('teacher');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const lessonTypeSelect = document.getElementById('lessonType');
    
    const summaryContent = document.getElementById('summaryContent');
    const priceInfo = document.getElementById('priceInfo');
    
    if (!summaryContent) return;
    
    let summaryHTML = '';
    let priceHTML = '';
    
    // Информация об инструменте
    if (instrumentSelect.value) {
        const instrumentText = instrumentSelect.options[instrumentSelect.selectedIndex].text;
        summaryHTML += `<p><strong>Инструмент:</strong> ${instrumentText}</p>`;
    }
    
    // Информация о преподавателе
    if (teacherSelect.value) {
        const teacherText = teacherSelect.options[teacherSelect.selectedIndex].text;
        summaryHTML += `<p><strong>Преподаватель:</strong> ${teacherText}</p>`;
    }
    
    // Информация о типе урока
    if (lessonTypeSelect.value) {
        const lessonTypeText = lessonTypeSelect.options[lessonTypeSelect.selectedIndex].text;
        summaryHTML += `<p><strong>Тип урока:</strong> ${lessonTypeText}</p>`;
        
        // Расчет стоимости
        let price = 0;
        if (instrumentSelect.value === 'piano') {
            price = lessonTypeSelect.value === 'individual' ? 1500 : 1000;
        } else if (instrumentSelect.value === 'guitar') {
            price = lessonTypeSelect.value === 'individual' ? 1200 : 800;
        } else if (instrumentSelect.value === 'violin') {
            price = lessonTypeSelect.value === 'individual' ? 1400 : 900;
        } else if (instrumentSelect.value === 'drums') {
            price = lessonTypeSelect.value === 'individual' ? 1300 : 850;
        } else if (instrumentSelect.value === 'vocal') {
            price = lessonTypeSelect.value === 'individual' ? 1600 : 1100;
        }
        
        if (price > 0) {
            priceHTML = `<div class="price"><strong>Стоимость:</strong> ${price} руб.</div>`;
        }
    }
    
    // Информация о дате и времени
    if (dateInput.value) {
        const date = new Date(dateInput.value);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        summaryHTML += `<p><strong>Дата:</strong> ${formattedDate}</p>`;
    }
    
    if (timeSelect.value) {
        summaryHTML += `<p><strong>Время:</strong> ${timeSelect.value}</p>`;
    }
    
    // Если ничего не выбрано
    if (summaryHTML === '') {
        summaryHTML = '<p>Выберите параметры урока, чтобы увидеть сводку</p>';
    }
    
    summaryContent.innerHTML = summaryHTML;
    if (priceInfo) {
        priceInfo.innerHTML = priceHTML;
    }
}

// Обработка отправки формы записи
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Проверяем, авторизован ли пользователь
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isLoggedIn) {
        alert('Пожалуйста, войдите в систему, чтобы записаться на урок.');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    // Собираем данные формы
    const formData = {
        instrument: document.getElementById('instrument').value,
        teacher: document.getElementById('teacher').value,
        lessonType: document.getElementById('lessonType').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        notes: document.getElementById('notes').value,
        userId: currentUser.email,
        bookingDate: new Date().toISOString()
    };
    
    // Валидация
    if (!formData.instrument || !formData.teacher || !formData.lessonType || 
        !formData.date || !formData.time) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }
    
    // Сохраняем запись (в реальном приложении - отправка на сервер)
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const newBooking = {
        id: Date.now().toString(),
        ...formData
    };
    
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Показываем подтверждение
    alert('Вы успешно записались на урок! Подробности вы можете посмотреть в разделе "Мои записи".');
    
    // Перенаправляем на страницу с записями
    window.location.href = 'my-bookings.html';
}