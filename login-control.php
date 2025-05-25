<?php
// Hata raporlamayı aç (geliştirme için)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Türkçe karakter desteği
header('Content-Type: text/html; charset=utf-8');

// Kullanıcı bilgileri 
$valid_users = array(
    'b1234567890@sakarya.edu.tr' => 'b1234567890',
    'berha.celik@sakarya.edu.tr' => 'b241210099', 
    'berha@sakarya.edu.tr' => 'berha123' // Test için ek kullanıcı
);

// Form gönderildi mi kontrolü
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Form verilerini al ve temizle
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    
    // Boş alan kontrolü
    if (empty($email) || empty($password)) {
        redirectToLogin("E-posta veya şifre boş bırakılamaz!");
    }
    
    // E-posta format kontrolü
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        redirectToLogin("Geçerli bir e-posta adresi giriniz!");
    }
    
    // Sakarya.edu.tr domain kontrolü
    if (!str_ends_with($email, '@sakarya.edu.tr')) {
        redirectToLogin("E-posta adresi @sakarya.edu.tr ile bitmelidir!");
    }
    
    // Kullanıcı adı ve şifre kontrolü
    if (isset($valid_users[$email]) && $valid_users[$email] === $password) {
        // Başarılı giriş
        $student_number = str_replace('@sakarya.edu.tr', '', $email);
        showSuccessPage($student_number, $email);
    } else {
        // Başarısız giriş
        redirectToLogin("Kullanıcı adı veya şifre hatalı!");
    }
    
} else {
    // Doğrudan PHP dosyasına erişim engelle
    redirectToLogin("Geçersiz erişim!");
}

function redirectToLogin($error_message = "") {
    $redirect_url = "login.html";
    if (!empty($error_message)) {
        // URL'ye hata mesajını ekle (JavaScript ile gösterilebilir)
        $redirect_url .= "?error=" . urlencode($error_message);
    }
    header("Location: " . $redirect_url);
    exit();
}

function showSuccessPage($student_number, $email) {
    $current_time = date('d.m.Y H:i:s');
    ?>
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Giriş Başarılı - Kişisel Web Sitem</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card shadow-lg">
                        <div class="card-header bg-success text-white text-center">
                            <h2 class="mb-0">
                                <i class="fas fa-check-circle me-2"></i>Giriş Başarılı!
                            </h2>
                        </div>
                        <div class="card-body text-center p-5">
                            <div class="mb-4">
                                <i class="fas fa-user-circle text-success" style="font-size: 4rem;"></i>
                            </div>
                            
                            <h3 class="text-success mb-3">Hoşgeldiniz <?php echo htmlspecialchars($student_number); ?>!</h3>
                            
                            <div class="alert alert-success" role="alert">
                                <h5 class="alert-heading">
                                    <i class="fas fa-info-circle me-2"></i>Giriş Bilgileri
                                </h5>
                                <hr>
                                <p class="mb-1"><strong>E-posta:</strong> <?php echo htmlspecialchars($email); ?></p>
                                <p class="mb-1"><strong>Öğrenci No:</strong> <?php echo htmlspecialchars($student_number); ?></p>
                                <p class="mb-0"><strong>Giriş Zamanı:</strong> <?php echo $current_time; ?></p>
                            </div>
                            
                            <div class="mt-4">
                                <p class="text-muted mb-3">
                                    <i class="fas fa-graduation-cap me-2"></i>
                                    Web Teknolojileri Dersi - Login Sistemi Başarıyla Çalışıyor!
                                </p>
                                
                                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                                    <a href="index.html" class="btn btn-primary">
                                        <i class="fas fa-home me-2"></i>Ana Sayfaya Dön
                                    </a>
                                    <a href="login.html" class="btn btn-outline-secondary">
                                        <i class="fas fa-sign-out-alt me-2"></i>Çıkış Yap
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    <?php
}
?>