document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const authLinks = document.getElementById("authLinks");

  if (authLinks) {
    if (user) {
      let dashboardLinks = `<a href="dashboard.html">Profile</a>`;
      if (user.role === "organizer") {
        dashboardLinks += `<a href="create-event.html">Create Event</a>`;
      }

      authLinks.innerHTML = `
        <span>Welcome, ${user.username}</span>
        ${dashboardLinks}
        <button id="logoutBtn">Logout</button>
      `;
    } else {
      authLinks.innerHTML = `
        <a href="login.html">Login</a>
        <a href="signup.html">Signup</a>
      `;
    }
  }

  // Apply logout button logic globally (in navs or headers)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      alert("Logged out!");
      window.location.href = "index.html";
    });
  }
});
