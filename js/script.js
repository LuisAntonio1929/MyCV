// Puedes usar este archivo para añadir interactividad
document.addEventListener('DOMContentLoaded', function() {
    // Ejemplo: Cargar habilidades dinámicamente
    const skills = [
        'HTML5', 'CSS3', 'JavaScript', 'React', 
        'Node.js', 'Git', 'Diseño UX/UI', 
        'Gestión de Proyectos', 'Trabajo en Equipo', 'Comunicación'
    ];
    
    const skillsContainer = document.getElementById('skills-container');
    
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill';
        skillElement.textContent = skill;
        skillsContainer.appendChild(skillElement);
    });
    
    // Ejemplo: Cambiar tema claro/oscuro
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Cambiar Tema';
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.padding = '10px 15px';
    themeToggle.style.backgroundColor = 'var(--primary-color)';
    themeToggle.style.color = 'white';
    themeToggle.style.border = 'none';
    themeToggle.style.borderRadius = '5px';
    themeToggle.style.cursor = 'pointer';
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
    });
    
    document.body.appendChild(themeToggle);
});

// Añade aquí más funcionalidades según necesites
// Manejo del formulario
document.getElementById('emailForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Mostrar estado de carga
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Enviar formulario
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => {
        if (response.ok) {
            // Mostrar mensaje de éxito
            form.reset();
            const confirmation = document.createElement('div');
            confirmation.className = 'form-confirmation';
            confirmation.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado con éxito! Te responderé pronto.';
            form.parentNode.insertBefore(confirmation, form.nextSibling);
            confirmation.style.display = 'block';
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                confirmation.style.display = 'none';
            }, 5000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al enviar el mensaje. Por favor inténtalo nuevamente.');
    })
    .finally(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
});