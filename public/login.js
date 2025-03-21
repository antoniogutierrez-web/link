document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessageEl = document.getElementById('error-message');
  
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          errorMessageEl.textContent = data.error || 'Error al iniciar sesión.';
        } else {
          // Almacenar el token en localStorage
          localStorage.setItem('token', data.token);
          // Redirigir al panel de administración (admin.html)
          window.location.href = '/admin.html';
        }
      } catch (error) {
        errorMessageEl.textContent = 'Error en la conexión con el servidor.';
      }
    });
  });
  