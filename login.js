// Login sayfası JavaScript validasyonu
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleIcon = document.getElementById('toggleIcon');
    const errorMessages = document.getElementById('error-messages');
    
    // Şifre göster/gizle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // İkonu değiştir
            if (type === 'text') {
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        });
    }
    
    // Form validasyonu
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Varsayılan form gönderimini engelle
            
            // Hata mesajlarını temizle
            clearErrors();
            
            // Validasyon
            let isValid = true;
            const errors = [];
            
            // E-posta validasyonu
            const emailValue = emailInput.value.trim();
            if (!emailValue) {
                isValid = false;
                emailInput.classList.add('is-invalid');
                errors.push('E-posta adresi boş bırakılamaz.');
            } else if (!isValidEmail(emailValue)) {
                isValid = false;
                emailInput.classList.add('is-invalid');
                errors.push('Geçerli bir e-posta adresi giriniz.');
            } else if (!emailValue.endsWith('@sakarya.edu.tr')) {
                isValid = false;
                emailInput.classList.add('is-invalid');
                errors.push('E-posta adresi @sakarya.edu.tr ile bitmelidir.');
            } else {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }
            
            // Şifre validasyonu
            const passwordValue = passwordInput.value.trim();
            if (!passwordValue) {
                isValid = false;
                passwordInput.classList.add('is-invalid');
                errors.push('Şifre boş bırakılamaz.');
            } else {
                passwordInput.classList.remove('is-invalid');
                passwordInput.classList.add('is-valid');
            }
            
            // Hataları göster
            if (!isValid) {
                showErrors(errors);
                return;
            }
            
            // Form geçerliyse, PHP'ye gönder
            this.submit();
        });
    }
    
    // Input değişikliklerinde hataları temizle
    emailInput.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        clearErrors();
    });
    
    passwordInput.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        clearErrors();
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    function showErrors(errors) {
        errorMessages.innerHTML = '';
        errors.forEach(error => {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger alert-dismissible fade show';
            alertDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>${error}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            errorMessages.appendChild(alertDiv);
        });
        errorMessages.classList.remove('d-none');
    }
    
    function clearErrors() {
        errorMessages.innerHTML = '';
        errorMessages.classList.add('d-none');
    }
});