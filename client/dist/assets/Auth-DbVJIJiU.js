import{l as u,r as b}from"./index-C5o8Pg2r.js";function h(){return`
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
  `}function v(){const m=document.getElementById("login-form"),c=document.getElementById("register-form"),p=document.getElementById("show-register"),y=document.getElementById("show-login"),l=document.getElementById("login-container"),g=document.getElementById("register-container"),n=document.getElementById("login-error"),i=document.getElementById("register-error"),s=document.getElementById("register-success");p?.addEventListener("click",t=>{t.preventDefault(),l.style.display="none",g.style.display="block"}),y?.addEventListener("click",t=>{t.preventDefault(),g.style.display="none",l.style.display="block"}),m?.addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("login-email").value,d=document.getElementById("login-password").value,r=document.getElementById("login-btn");try{r.textContent="Signing in...",r.disabled=!0,n.style.display="none";const e=await u(a,d);localStorage.setItem("token",e.token),localStorage.setItem("user",JSON.stringify(e.user)),window.location.hash="home",window.location.reload()}catch(e){n.textContent=e.message,n.style.display="block"}finally{r.textContent="Sign In",r.disabled=!1}}),c?.addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("reg-name").value,d=document.getElementById("reg-email").value,r=document.getElementById("reg-password").value,e=document.getElementById("register-btn");try{e.textContent="Registering...",e.disabled=!0,i.style.display="none",s.style.display="none";const o=await b(a,d,r);localStorage.setItem("token",o.token),localStorage.setItem("user",JSON.stringify(o.user)),s.textContent="Registration successful! Logging in...",s.style.display="block",setTimeout(()=>{window.location.hash="home",window.location.reload()},1e3)}catch(o){i.textContent=o.message,i.style.display="block"}finally{e.textContent="Sign Up",e.disabled=!1}})}export{h as renderAuth,v as setupAuthEvents};
