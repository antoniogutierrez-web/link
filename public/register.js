document.addEventListener('DOMContentLoaded', function() {
  // Selecciona el formulario y el elemento para mostrar errores.
  const registerForm = document.getElementById('register-form');
  const errorEl = document.getElementById('register-error');

  // Agrega un listener para el envío del formulario.
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional.

    // Recupera y limpia los valores de los inputs.
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    // Validación básica: asegúrate de que no estén vacíos.
    if (!name || !email || !password) {
      errorEl.textContent = 'Todos los campos son obligatorios.';
      return;
    }

    try {
      // Envía la solicitud POST a la ruta /api/auth/register con el cuerpo en formato JSON.
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      // Se espera una respuesta en formato JSON.
      const data = await res.json();

      // Si la respuesta no es exitosa, muestra el error.
      if (!res.ok) {
        errorEl.textContent = data.error || 'Error al registrar el usuario.';
      } else {
        // Registro exitoso, redirige a la página de login.
        window.location.href = '/login.html';
      }
    } catch (err) {
      console.error(err); // Muestra el error en la consola para depuración.
      errorEl.textContent = 'Error en la conexión con el servidor.';
    }
  });
});
