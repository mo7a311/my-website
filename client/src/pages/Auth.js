import { loginUser, registerUser } from '../api.js';

export function renderAuth() {
  return `
    <div class="auth-page animate-fade-in" style="max-width: 400px; margin: 4rem auto; text-align:center;">
      <div class="glass-effect" style="padding: 2rem; border-radius: 12px; position: relative;">
        
        <!-- Login Form -->
        <div id="login-container">
          <h2 style="color:var(--primary); margin-bottom: 1.5rem;">Login</h2>
          <form id="login-form">
            <input type="email" id="login-email" placeholder="Email" required style="width:100%; padding:0.8rem; margin-bottom:1rem; border-radius:6px; border:1px solid var(--glass-border); background:rgba(0,0,0,0.2); color:#fff;" />
            <input type="password" id="login-password" placeholder="Password" required style="width:100%; padding:0.8rem; margin-bottom:1.5rem; border-radius:6px; border:1px solid var(--glass-border); background:rgba(0,0,0,0.2); color:#fff;" />
            <button type="submit" class="btn-primary" style="width:100%;" id="login-btn">Sign In</button>
            <p id="login-error" style="color: red; margin-top: 10px; display: none;"></p>
          </form>
          <p style="margin-top: 1rem; font-size: 0.9rem;">Don't have an account? <a href="#" id="show-register" style="color:var(--primary);">Register here</a></p>
        </div>

        <!-- Register Form -->
        <div id="register-container" style="display: none;">
          <h2 style="color:var(--primary); margin-bottom: 1.5rem;">Register</h2>
          <form id="register-form">
            <input type="text" id="reg-name" placeholder="Full Name" required style="width:100%; padding:0.8rem; margin-bottom:1rem; border-radius:6px; border:1px solid var(--glass-border); background:rgba(0,0,0,0.2); color:#fff;" />
            <input type="email" id="reg-email" placeholder="Email" required style="width:100%; padding:0.8rem; margin-bottom:1rem; border-radius:6px; border:1px solid var(--glass-border); background:rgba(0,0,0,0.2); color:#fff;" />
            <input type="password" id="reg-password" placeholder="Password" required style="width:100%; padding:0.8rem; margin-bottom:1.5rem; border-radius:6px; border:1px solid var(--glass-border); background:rgba(0,0,0,0.2); color:#fff;" />
            <button type="submit" class="btn-primary" style="width:100%;" id="register-btn">Sign Up</button>
            <p id="register-error" style="color: red; margin-top: 10px; display: none;"></p>
            <p id="register-success" style="color: #4ade80; margin-top: 10px; display: none;"></p>
          </form>
          <p style="margin-top: 1rem; font-size: 0.9rem;">Already have an account? <a href="#" id="show-login" style="color:var(--primary);">Login here</a></p>
        </div>
        
      </div>
    </div>
  `;
}

export function setupAuthEvents() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterBtn = document.getElementById('show-register');
  const showLoginBtn = document.getElementById('show-login');
  
  const loginContainer = document.getElementById('login-container');
  const registerContainer = document.getElementById('register-container');

  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  const registerSuccess = document.getElementById('register-success');

  // Toggle Forms
  showRegisterBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
  });

  showLoginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  });

  // Handle Login
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');
    
    try {
      btn.textContent = 'Signing in...';
      btn.disabled = true;
      loginError.style.display = 'none';
      
      const data = await loginUser(email, password);
      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to home/explore
      window.location.hash = 'home';
      // Ideally refresh navbar to show logged in state here or reload
      window.location.reload(); 
    } catch (err) {
      loginError.textContent = err.message;
      loginError.style.display = 'block';
    } finally {
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  });

  // Handle Register
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const btn = document.getElementById('register-btn');

    try {
      btn.textContent = 'Registering...';
      btn.disabled = true;
      registerError.style.display = 'none';
      registerSuccess.style.display = 'none';
      
      const data = await registerUser(name, email, password);
      // Save token and login immediately
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      registerSuccess.textContent = 'Registration successful! Logging in...';
      registerSuccess.style.display = 'block';
      setTimeout(() => {
        window.location.hash = 'home';
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      registerError.textContent = err.message;
      registerError.style.display = 'block';
    } finally {
      btn.textContent = 'Sign Up';
      btn.disabled = false;
    }
  });
}
