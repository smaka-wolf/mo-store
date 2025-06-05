document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('btn-login');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const invalidUsername = document.getElementById('invalidUsername');
    const invalidPass = document.getElementById('invalidPass');

    invalidUsername.style.display = 'none';
    invalidPass.style.display = 'none';

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Simple validation: check if username and password are 'admin'
        if (username !== 'admin') {
            invalidUsername.style.display = 'block';
            invalidPass.style.display = 'none';
            return;
        } else {
            invalidUsername.style.display = 'none';
        }

        if (password !== 'admin') {
            invalidPass.style.display = 'block';
            return;
        } else {
            invalidPass.style.display = 'none';
        }

        // Save login state in localStorage
        localStorage.setItem('email', username);
        localStorage.setItem('password', password);

        // Redirect to admin dashboard
        window.location.href = 'admin/index.html';
    });
});
