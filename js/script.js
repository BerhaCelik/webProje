// TMDB Film API Entegrasyonu
const TMDB_API_KEY = '9d803e595d72a298b9869f9d2d7f3e62'; 
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    console.log('İlgi Alanlarım sayfası yüklendi');
    
    // Sadece ilgi-alanlarim.html sayfasındaysak çalıştır
    if (window.location.pathname.includes('ilgi-alanlarim.html') || 
        document.getElementById('filmler-loading')) {
        initializeMovieAPI();
    }
});

function initializeMovieAPI() {
    loadPopularMovies();
    
    // Daha fazla yükle butonuna event listener ekle
    const loadMoreBtn = document.getElementById('load-more-films');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            loadPopularMovies(false); // Mevcut filmlerin üzerine ekle
        });
    }
}

async function loadPopularMovies(clearPrevious = true) {
    const loadingElement = document.getElementById('filmler-loading');
    const errorElement = document.getElementById('filmler-error');
    const containerElement = document.getElementById('filmler-container');
    const loadMoreButton = document.getElementById('load-more-films');
    
    try {
        // API anahtarı kontrolü
        if (!TMDB_API_KEY || TMDB_API_KEY === 'BURAYA_API_ANAHTARINIZI_YAZIN') {
            throw new Error('API anahtarı tanımlanmamış. Lütfen geçerli bir TMDB API anahtarı ekleyin.');
        }
        
        // Yükleniyor göster
        if (clearPrevious && loadingElement) {
            loadingElement.classList.remove('d-none');
            if (errorElement) errorElement.classList.add('d-none');
            if (containerElement) containerElement.classList.add('d-none');
        }
        
        console.log('Film verileri çekiliyor...', currentPage);
        
        // API çağrısı yap
        const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=tr-TR&page=${currentPage}`);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('API anahtarı geçersiz. Lütfen doğru API anahtarını kontrol edin.');
            } else if (response.status === 404) {
                throw new Error('API endpoint bulunamadı.');
            } else {
                throw new Error(`API isteği başarısız (${response.status})`);
            }
        }
        
        const data = await response.json();
        console.log('Film verileri alındı:', data);
        
        // Filmleri göster
        displayMovies(data.results, clearPrevious);
        
        // Yükleniyor gizle, container göster
        if (loadingElement) loadingElement.classList.add('d-none');
        if (containerElement) containerElement.classList.remove('d-none');
        
        // Daha fazla sayfa varsa butonu göster
        if (loadMoreButton && currentPage < data.total_pages && currentPage < 3) { // Maksimum 3 sayfa
            loadMoreButton.classList.remove('d-none');
        } else if (loadMoreButton) {
            loadMoreButton.classList.add('d-none');
        }
        
    } catch (error) {
        console.error('Film yükleme hatası:', error);
        
        // Hata göster
        if (loadingElement) loadingElement.classList.add('d-none');
        if (errorElement) {
            errorElement.classList.remove('d-none');
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${error.message}
            `;
        }
    }
}

function displayMovies(movies, clearPrevious = true) {
    const container = document.getElementById('filmler-container');
    if (!container) return;
    
    if (clearPrevious) {
        container.innerHTML = '';
    }
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        container.appendChild(movieCard);
    });
}

function createMovieCard(movie) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-sm-6 mb-4';
    
    // Poster URL'si oluştur
    const posterUrl = movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
        : 'https://via.placeholder.com/300x450/6c757d/ffffff?text=Poster+Yok';
    
    // Çıkış yılı
    const releaseYear = movie.release_date 
        ? new Date(movie.release_date).getFullYear() 
        : 'Bilinmiyor';
    
    // Özet (çok uzunsa kısalt)
    const overview = movie.overview 
        ? (movie.overview.length > 120 ? movie.overview.substring(0, 120) + '...' : movie.overview)
        : 'Açıklama bulunmuyor.';
    
    // IMDB puanı
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    
    col.innerHTML = `
        <div class="card h-100 shadow-sm movie-card">
            <img src="${posterUrl}" class="card-img-top" alt="${movie.title}" 
                 style="height: 350px; object-fit: cover;" 
                 onerror="this.src='https://via.placeholder.com/300x450/6c757d/ffffff?text=Poster+Yok'">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title" title="${movie.title}">${movie.title}</h5>
                <p class="card-text flex-grow-1">${overview}</p>
                <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>${releaseYear}
                        </small>
                        <span class="badge bg-warning text-dark">
                            <i class="fas fa-star me-1"></i>${rating}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return col;
}