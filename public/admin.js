document.addEventListener('DOMContentLoaded', function() {
    // Recuperar el token JWT del localStorage
    const TOKEN = localStorage.getItem('token');
    if (!TOKEN) {
      // Si no hay token, redirige a la página de login
      window.location.href = '/login.html';
      return;
    }
   // Manejo del Dark Mode
   const darkModeToggle = document.getElementById('dark-mode-toggle');
   // Al cargar la página, revisa si ya se ha guardado una preferencia en localStorage
   if (localStorage.getItem('theme') === 'dark') {
     document.body.classList.add('dark-mode');
     darkModeToggle.textContent = 'Modo Claro';
   } else {
     darkModeToggle.textContent = 'Modo Oscuro';
   }
 
   darkModeToggle.addEventListener('click', function() {
     document.body.classList.toggle('dark-mode');
     // Guarda la preferencia en localStorage
     if (document.body.classList.contains('dark-mode')) {
       localStorage.setItem('theme', 'dark');
       darkModeToggle.textContent = 'Modo Claro';
     } else {
       localStorage.setItem('theme', 'light');
       darkModeToggle.textContent = 'Modo Oscuro';
     }
   });
 
    const userListEl = document.getElementById('user-list');
    const updateUserForm = document.getElementById('update-user-form');
    const userIdInput = document.getElementById('user-id');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const userRoleSelect = document.getElementById('user-role');
  
    // Función para obtener usuarios de la API usando el token
    async function fetchUsers() {
      const res = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      const users = await res.json();
      return users;
    }
  
    // Función para renderizar la lista de usuarios
    function renderUsers(users) {
      userListEl.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} - ${user.email} [${user.role}]`;
        li.dataset.id = user._id;
  
        // Contenedor para botones de acción
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'user-actions';
  
        // Botón para editar (cargar datos en el formulario)
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => loadUserIntoForm(user));
        actionsDiv.appendChild(editBtn);
  
        // Botón para eliminar usuario
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'delete-user-btn';
        deleteBtn.addEventListener('click', async () => {
          if (confirm('¿Eliminar este usuario?')) {
            await fetch(`/api/users/${user._id}`, { 
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${TOKEN}`
              }
            });
            loadUsers();
          }
        });
        actionsDiv.appendChild(deleteBtn);
  
        li.appendChild(actionsDiv);
        userListEl.appendChild(li);
      });
    }
  
    // Función para cargar y renderizar usuarios
    async function loadUsers() {
      const users = await fetchUsers();
      renderUsers(users);
    }
  
    // Función para cargar datos de un usuario en el formulario de actualización
    function loadUserIntoForm(user) {
      userIdInput.value = user._id;
      userNameInput.value = user.name;
      userEmailInput.value = user.email;
      userRoleSelect.value = user.role;
    }
  
    // Manejar el formulario de actualización
    updateUserForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const id = userIdInput.value;
      const updatedData = {
        name: userNameInput.value,
        email: userEmailInput.value,
        role: userRoleSelect.value
      };
  
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        loadUsers();
        updateUserForm.reset();
      } else {
        alert('Error al actualizar el usuario.');
      }
    });
  
    // Cargar usuarios al inicio
    loadUsers();
  });
  