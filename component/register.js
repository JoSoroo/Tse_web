class UserRegister extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.render();
      this.handleRegister = this.handleRegister.bind(this); // `this`-ийг зөв холбоход зайлшгүй шаардлагатай
  }

  connectedCallback() {
      this.shadowRoot.querySelector("#register-form").addEventListener("submit", this.handleRegister);
  }

  disconnectedCallback() {
      this.shadowRoot.querySelector("#register-form").removeEventListener("submit", this.handleRegister);
  }

  async handleRegister(event) {
      event.preventDefault(); // Формаас өгөгдөл илгээхээс сэргийлэх

      const email = this.shadowRoot.querySelector("#email").value;
      const password = this.shadowRoot.querySelector("#password").value;

      if (email && password) {
        //Сервер рүү өгөгдөл илгээж, бүртгүүлэх хүсэлт илгээнэ.
          try {
              const response = await fetch("http://localhost:5000/admin/register", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ email, password })
              });

              const result = await response.json();
              if (response.ok) {
                  alert("Амжилттай бүртгэгдлээ!");
                  window.location.href = "/profile.html";  // Бүртгүүлсний дараа нэвтрэх хуудас руу шилжих
              } else {
                  alert(result.message || "Алдаа гарлаа. Дахин оролдоно уу.");
              }
          } catch (error) {
              console.error("Сүлжээний алдаа:", error);
              alert("Сүлжээний алдаа гарлаа.");
          }
      } else {
          alert("Бүх талбарыг бөглөнө үү.");
      }
  }

  render() {
      this.shadowRoot.innerHTML = `
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-image: linear-gradient(135deg, #ffcc00, #333333);
              color: white;
          }

          .section {
              display: flex;
              flex-direction: column;
              background-color: #1e1e1e;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              max-width: 400px;
              width: 100%;
              text-align: center;
          }

          h1 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #ffcc00;
          }

          .input {
              margin: 10px 0;
              padding: 12px;
              font-size: 16px;
              width: 100%;
              box-sizing: border-box;
              border: none;
              border-radius: 5px;
              outline: none;
              background-color: #333333;
              color: #fff;
          }

          .input:focus {
              border: 2px solid #ffcc00;
          }

          .submit-btn {
              padding: 12px;
              background-color: #ffcc00;
              color: #333;
              border: none;
              cursor: pointer;
              font-size: 16px;
              border-radius: 5px;
              transition: background-color 0.3s ease;
              margin-top: 10px;
          }

          .submit-btn:hover {
              background-color: #ffaa00;
          }

          .error-message {
              color: red;
              font-size: 14px;
              margin-top: 10px;
          }

          a {
              color: #ffcc00;
              text-decoration: none;
              margin-top: 15px;
              font-size: 14px;
          }

          a:hover {
              text-decoration: underline;
          }

      </style>
      <section class="section">
          <h1>Бүртгүүлэх</h1>
          <form id="register-form">
              <input type="email" id="email" class="input" placeholder="Email" required>
              <input type="password" id="password" class="input" placeholder="Нууц үг" required>
              <button type="submit" class="submit-btn">Бүртгүүлэх</button>
          </form>
          <a href="./profile.html">Нэвтрэх хуудас руу шилжих</a>
      </section>
      `;
  }
}

customElements.define("user-register", UserRegister);
