class Sags extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        //localStorage-оос өгөгдөл уншиж, cartItems массивыг үүсгэнэ. Хоосон бол шинэ массив ашиглана.
        this.cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    }

    connectedCallback() {
        // Сагсанд бараа нэмэх эвентийн мэдээллийг сонсож, барааг массивд нэмнэ.
        window.addEventListener("add-to-cart", (event) => {
            const { product, quantity } = event.detail;

            const existingProduct = this.cartItems.find((item) => item.id === product.id);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                this.cartItems.push({ ...product, quantity });
            }

            // LocalStorage-ийг шинэчлэх
            localStorage.setItem("cart", JSON.stringify(this.cartItems));

            // Дахин render хийх
            this.render();
        });

        // Shadow DOM доторх "click" эвентийг сонсох
        this.shadowRoot.addEventListener("click", (event) => {
            if (event.target.classList.contains("ustgah")) {
                const productId = event.target.getAttribute("data-id");

                // Бүтээгдэхүүний ID-г тохирох байдлаар шалгах
                this.cartItems = this.cartItems.filter(item => String(item.id) !== productId);

                // LocalStorage-ийг шинэчлэх
                localStorage.setItem("cart", JSON.stringify(this.cartItems));

                // Дахин render хийх
                this.render();
            }
            if (event.target.classList.contains("checkout")) {
                this.handleCheckout();
            }
        });

        this.render();
    }
    async handleCheckout() {
        if (this.cartItems.length === 0) {
            alert("Сагс хоосон байна.");
            return;
        }
    
        // Бүтээгдэхүүний нэр, тоо, үнэ гэх мэт мэдээллийг зөв форматад оруулах
        const formattedItems = this.cartItems.map(item => ({
            product: item.title,  // Бүтээгдэхүүний нэр
            quantity: item.quantity,  // Тоо
            price: item.price,  // Үнэ
            img: item.img || '', // Бүтээгдэхүүний зураг (заавал байх шаардлагагүй)
            description: item.description || '', // Бүтээгдэхүүний тайлбар (заавал байх шаардлагагүй)
        }));
    
        // Сервер рүү өгөгдөл илгээн захиалга бүртгэх.
        try {
            const response = await fetch("http://localhost:5000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ items: formattedItems })  // Шинэ format-тай items
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert("Захиалга амжилттай бүртгэгдлээ!");
                this.cartItems = []; // Сагс хоослох
                localStorage.removeItem("cart"); // LocalStorage-ийг хоослох
                this.render();  // Дахин render хийх
            } else {
                alert(result.message || "Захиалга хийхэд алдаа гарлаа.");
            }
        } catch (error) {
            console.error("Сүлжээний алдаа:", error);
            alert("Сүлжээний алдаа гарлаа.");
        }
    }
    
    


    render() {
        if (this.cartItems.length === 0) {
            this.shadowRoot.innerHTML = "<p>Сагс хоосон байна.</p>";
        } else {
            const html = this.cartItems.map(item => `
                <style>
    .article_zah {
        display: flex;
        align-items: center;
        margin-top: 10px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 10px;
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.5s ease, transform 0.3s ease;
    }

    /* Fade-out Animation */
    .article_zah.fade-out {
        opacity: 0;
        transform: scale(0.95);
    }

    .img_zah {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
        margin-right: 20px;
    }

    .zah_text {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .span_zah_text {
        font-size: 16px;
        margin-bottom: 5px;
        color: #333;
    }

    .ustgah {
        background-color: #ff4d4d;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .ustgah:hover {
        background-color: #e60000;
        transform: scale(1.1);
    }

    .checkout {
        margin-top: 15px;
        background-color:rgb(238, 232, 82);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 15px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .checkout:hover {
        background-color:#ffb800
        transform: scale(1.05);
    }
</style>

                <article class="article_zah">
                    <img src="${item.img || './hool.png'}" alt="Бүтээгдэхүүний зураг" class="img_zah">
                    <section class="zah_text">
                        <h2 class="span_zah_text">${item.title}</h2>
                        <p class="span_zah_text">Үнэ: ${item.price}</p>
                        <p class="span_zah_text">Тоо: ${item.quantity}</p>
                    </section>
                    <button class="ustgah" data-id="${item.id}">❌</button>
                </article>
            `).join("");

            this.shadowRoot.innerHTML = `
                <div id="cart-section">${html}</div>
                <button class="checkout">Баталгаажуулах</button>
            `;
        }
    }
}

customElements.define("sags-component", Sags);
