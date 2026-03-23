// Estado actual
let currentIndex = 0;
let pages = [];

// Elementos del DOM
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const themeToggle = document.getElementById('themeToggle');
const floatingMessage = document.getElementById('floatingMessage');

// Mensajes románticos aleatorios
const loveMessages = [
    '💖 Te amo, Jhoselyn',
    '✨ Eres mi sueño hecho realidad',
    '🌹 Cada día te elijo a ti',
    '💫 Tu sonrisa ilumina mi mundo',
    '🌸 Eres hermosa por dentro y por fuera',
    '🌟 No hay nadie como tú',
    '💕 Gracias por existir',
    '🌺 Eres mi lugar favorito en el mundo',
    '💗 Contigo todo es mejor',
    '✨ Eres la mejor parte de mi día'
];

// Función para mostrar mensaje flotante aleatorio
function showRandomMessage() {
    const randomIndex = Math.floor(Math.random() * loveMessages.length);
    floatingMessage.textContent = loveMessages[randomIndex];
    floatingMessage.classList.add('show');
    
    setTimeout(() => {
        floatingMessage.classList.remove('show');
    }, 2000);
}

// Mostrar mensaje cada 30 segundos
setInterval(showRandomMessage, 30000);

// Mostrar uno al cargar la página
setTimeout(showRandomMessage, 3000);

// Inicializar páginas
function initPages() {
    pages = document.querySelectorAll('.page, .cover, .back-cover');
    totalPagesSpan.textContent = pages.length;
    
    // Ocultar todas y mostrar solo la primera
    pages.forEach((page, index) => {
        page.classList.remove('active');
        if (index === currentIndex) {
            page.classList.add('active');
        }
    });
    
    updatePageIndicator();
    updateButtons();
}

// Actualizar indicador de página
function updatePageIndicator() {
    if (pages[currentIndex]) {
        if (pages[currentIndex].classList.contains('cover')) {
            currentPageSpan.textContent = 'Portada';
        } else if (pages[currentIndex].classList.contains('back-cover')) {
            currentPageSpan.textContent = 'Contraportada';
        } else {
            currentPageSpan.textContent = currentIndex;
        }
    }
}

// Actualizar estado de botones
function updateButtons() {
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === pages.length - 1;
        
        // Estilo visual para botones deshabilitados
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === pages.length - 1 ? '0.5' : '1';
    }
}

// Cambiar de página
function goToPage(index) {
    if (index < 0 || index >= pages.length) return;
    
    // Quitar clase active de todas
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Agregar a la nueva página
    currentIndex = index;
    pages[currentIndex].classList.add('active');
    
    updatePageIndicator();
    updateButtons();
    
    // Efecto sutil al cambiar de página
    pages[currentIndex].style.animation = 'none';
    setTimeout(() => {
        if (pages[currentIndex]) {
            pages[currentIndex].style.animation = 'fadeInUp 0.5s ease';
        }
    }, 10);
}

// Navegación
function nextPage() {
    if (currentIndex < pages.length - 1) {
        goToPage(currentIndex + 1);
    }
}

function prevPage() {
    if (currentIndex > 0) {
        goToPage(currentIndex - 1);
    }
}

// Tema oscuro/claro
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

// Efecto de teclado (flechas izquierda/derecha)
function handleKeyPress(e) {
    if (e.key === 'ArrowRight') {
        nextPage();
    } else if (e.key === 'ArrowLeft') {
        prevPage();
    }
}

// Eventos de clic en las páginas (opcional: avanzar al hacer clic)
function initClickNavigation() {
    const book = document.querySelector('.book');
    if (book) {
        book.addEventListener('click', (e) => {
            // Evitar que se active si se hace clic en un botón
            if (e.target.closest('.nav-btn') || e.target.closest('.theme-toggle')) {
                return;
            }
            
            const rect = book.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const bookWidth = rect.width;
            
            // Si se hace clic en la mitad derecha, avanzar; en la izquierda, retroceder
            if (clickX > bookWidth / 2) {
                nextPage();
            } else {
                prevPage();
            }
        });
    }
}

// Eventos táctiles para móviles
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
            prevPage();
        } else {
            nextPage();
        }
    }
}

// Efecto de corazones flotantes al hacer clic
function createFloatingHeart(e) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.opacity = '1';
    heart.style.transition = 'all 1s ease';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.transform = 'translateY(-100px)';
        heart.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initPages();
    initTheme();
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Navegación táctil
    const book = document.querySelector('.book');
    if (book) {
        book.addEventListener('touchstart', handleTouchStart);
        book.addEventListener('touchend', handleTouchEnd);
    }
    
    initClickNavigation();
    
    // Corazones al hacer clic en cualquier parte
    document.body.addEventListener('click', (e) => {
        // No crear corazón si se hace clic en botones
        if (!e.target.closest('.nav-btn') && !e.target.closest('.theme-toggle')) {
            createFloatingHeart(e);
        }
    });
});

// Guardar la página actual en caso de recarga (opcional)
window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastPage', currentIndex);
});

// Recuperar última página (opcional)
window.addEventListener('load', () => {
    const lastPage = localStorage.getItem('lastPage');
    if (lastPage && parseInt(lastPage) !== currentIndex && pages[lastPage]) {
        goToPage(parseInt(lastPage));
    }
});
