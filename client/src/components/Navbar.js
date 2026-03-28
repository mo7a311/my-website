export function renderNavbar() {
  return `
    <header class="navbar glass-effect">
      <div class="logo">EgyptGuide</div>
      <nav>
        <a href="#home">Home</a>
        <a href="#explore">Explore</a>
        <a href="#recommendations">Near Me</a>
        <a href="#ai-recommendations" style="color: var(--primary); font-weight: bold;">AI Categories</a>
        <a href="#planner">AI Trip Planner</a>
        <a href="#map">Map</a>
        <a href="#dashboard" id="nav-dashboard-link" style="display: none;">Dashboard</a>
        <a href="#login" class="btn-primary" id="nav-login-btn">Login / Register</a>
      </nav>
    </header>
  `;
}

export function setupNavbarEvents(appElement) {
  const token = localStorage.getItem('token');
  const loginBtn = document.getElementById('nav-login-btn');
  const dashboardLink = document.getElementById('nav-dashboard-link');
  
  if (token) {
    loginBtn.textContent = 'Logout';
    loginBtn.href = '#';
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '';
      window.location.reload();
    });
    if (dashboardLink) dashboardLink.style.display = 'inline-block';
  } else {
    loginBtn.textContent = 'Login / Register';
    loginBtn.href = '#login';
    if (dashboardLink) dashboardLink.style.display = 'none';
  }
}
