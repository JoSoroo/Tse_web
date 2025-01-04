document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("user-form");
  const formTitle = document.getElementById("form-title");
  const toggleText = document.getElementById("toggle-text");
  const toggleLink = document.getElementById("toggle-link");
  const usernameGroup = document.getElementById("username-group");
  const messageDiv = document.getElementById("message");

  let isLogin = true;

  // Toggle between Login and Register
  toggleLink.addEventListener("click", () => {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? "Login" : "Register";
    toggleText.textContent = isLogin ? "Don't have an account? " : "Already have an account? ";
    toggleLink.textContent = isLogin ? "Register" : "Login";
    usernameGroup.style.display = isLogin ? "none" : "block";
  });

  // Handle form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = isLogin ? "/login" : "/register";
    const apiUrl = `http://localhost:3000${endpoint}`;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Email:", email, "Password:", password); // Шалгах
    const username = isLogin ? null : document.getElementById("username").value;

    const requestBody = isLogin
      ? { email, password }
      : { username, email, password };
    
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        
      });
      console.log("Response status:", response.status); 
      const result = await response.json();
      if (response.ok) {
        // If it's a login, store the token
        if (isLogin) {
          localStorage.setItem("authToken", result.token);  // Save the JWT token
          messageDiv.style.color = "green";
          messageDiv.textContent = "Login successful!";
          window.location.href = "products.html";  // Redirect to products page
        } else {
          messageDiv.style.color = "green";
          messageDiv.textContent = "Registration successful!";
        }
      } else {
        messageDiv.style.color = "red";
        messageDiv.textContent = result.message || "Something went wrong!";
      }
    } catch (error) {
      messageDiv.style.color = "red";
      messageDiv.textContent = "Error connecting to the server!";
    }
  });
});
