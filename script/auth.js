// Handle Signup
if (document.getElementById("signupForm")) {
  document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!username || !password || !role) {
      alert("Please fill all fields");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
      alert("Username already exists");
      return;
    }

    users.push({ username, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  });
}

// Handle Login
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "index.html";
  });
}
