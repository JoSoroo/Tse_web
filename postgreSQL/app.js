document.addEventListener("DOMContentLoaded", () => {
  // Хэрэглэгчийн маягт болон текстийн элементийг авна
  const form = document.getElementById("user-form");
  const formTitle = document.getElementById("form-title");
  const toggleText = document.getElementById("toggle-text");
  const toggleLink = document.getElementById("toggle-link");
  const usernameGroup = document.getElementById("username-group");
  const messageDiv = document.getElementById("message");

  // Нэвтрэх эсвэл бүртгүүлэх төлөвийг хадгална
  let isLogin = true;

  // Нэвтрэх болон бүртгэл хаягийн хувиргалтыг хариуцсан хэсэг
  toggleLink.addEventListener("click", () => {
    // Нэвтрэх болон бүртгүүлэх төлөвийг солих
    isLogin = !isLogin;
    // Маягтын гарчигийг өөрчлөх
    formTitle.textContent = isLogin ? "Login" : "Register";
    // Текстийг өөрчлөх
    toggleText.textContent = isLogin ? "Don't have an account? " : "Already have an account? ";
    toggleLink.textContent = isLogin ? "Register" : "Login";
    // Бүртгэлийн хэсгийг харуулах эсвэл нууцлах
    usernameGroup.style.display = isLogin ? "none" : "block";
  });

  // Маягтыг илгээх үед үйлдлийг удирдах
  form.addEventListener("submit", async (event) => {
    // Хувийн зогсоол
    event.preventDefault();

    // Нэвтрэх эсвэл бүртгэх API-ийн замыг тодорхойлох
    const endpoint = isLogin ? "/login" : "/register";
    const apiUrl = `http://localhost:3000${endpoint}`;
    // Хэрэглэгчийн имэйл болон нууц үгийг авах
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Email:", email, "Password:", password); // Шалгах
    const username = isLogin ? null : document.getElementById("username").value;

    // API руу илгээх биеийн агуулга
    const requestBody = isLogin
      ? { email, password }
      : { username, email, password };
    
    try {
      // API руу хүсэлт илгээх
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
        // Нэвтрэх бол, токеныг хадгалах
        if (isLogin) {
          localStorage.setItem("authToken", result.token);  // JWT токеныг хадгалах
          messageDiv.style.color = "green";
          messageDiv.textContent = "Login successful!"; // Нэвтрэх амжилттай
          window.location.href = "products.html";  // Продукцийн хуудсанд шилжих
        } else {
          messageDiv.style.color = "green";
          messageDiv.textContent = "Registration successful!"; // Бүртгэл амжилттай
        }
      } else {
        // Алдаа гарсан үед
        messageDiv.style.color = "red";
        messageDiv.textContent = result.message || "Something went wrong!"; // Алдааны мэдээлэл
      }
    } catch (error) {
      // Сэрвэртэй холбогдох алдаа
      messageDiv.style.color = "red";
      messageDiv.textContent = "Error connecting to the server!"; // Холбогдож чадсангүй
    }
  });
});
