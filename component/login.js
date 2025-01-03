class UserLogin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
        this.handleLogin = this.handleLogin.bind(this); // handleLogin функцэд this-ийг зөв оноох. Тиймээс эвентийн сонсогчид функцыг дуудах үед зөв ажиллана.
    }

    connectedCallback() {
        this.shadowRoot 
            .querySelector(".login")//"Нэвтрэх" товчийг сонгож, "click" эвентийн сонсогч нэмнэ.
            .addEventListener("click", this.handleLogin);
    }
    //Элемент DOM-оос устах үед ажиллана.
    disconnectedCallback() {
        this.shadowRoot
            .querySelector(".login")
            .removeEventListener("click", this.handleLogin);
    }

    async handleLogin() {
        //Email болон нууц үгийн утгыг form-оос авна.
        const email = this.shadowRoot.querySelector(".email").value.trim();
        const password = this.shadowRoot.querySelector(".password").value.trim();
        console.log({ email, password });

        const errorMessage = this.shadowRoot.querySelector(".error-message");
        errorMessage.textContent = ""; // Алдааны мессежийг цэвэрлэх
        //Хоосон талбар байгаа эсэхийг шалгана. 
        if (!email || !password) {
            errorMessage.textContent = "Та бүх талбарыг бөглөнө үү.";
            return;
        }
        //Сервер рүү POST хүсэлт илгээж, email, password-ийг дамжуулна.
        try {
            const response = await fetch("http://localhost:5000/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            //Хүсэлт амжилттай байвал үр дүнг JSON форматаар уншина.
            if (response.ok) {
                const result = await response.json();
                if (result.token) {
                    localStorage.setItem("token", result.token); // Токен хадгалах
                    window.location.href = "/order.html"; // Шилжих
                } else {
                    errorMessage.textContent = result.message || "Нэвтрэхэд алдаа гарлаа.";
                }
            } else {
                const errorResult = await response.json();
                errorMessage.textContent = errorResult.message || "Серверээс хариу авахад алдаа гарлаа.";
            }
            
        } catch (error) {
            console.error("Сүлжээний алдаа:", error);
            errorMessage.textContent = "Сүлжээний алдаа гарлаа. Дахин оролдоно уу.";
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

            .email, .password {
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

            .email:focus, .password:focus {
                border: 2px solid #ffcc00;
            }

            .login {
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

            .login:hover {
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
            <h1>Нэвтрэх</h1>
            <input type="email" placeholder="Email" class="email">
            <input type="password" placeholder="Нууц үг" class="password">
            <button class="login">Нэвтрэх</button>
            <div class="error-message"></div>
            <a href="./register.html">Бүртгүүлэх</a>
        </section>
        `;
    }
}

customElements.define("user-login", UserLogin);
