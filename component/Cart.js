class Cart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.cartItems = JSON.parse(localStorage.getItem("cart")) || [];//localStorage-оос cart өгөгдлийг JSON форматтай уншиж, массив болгон хадгална. Хэрэв өгөгдөл байхгүй бол хоосон массив ([]) үүсгэнэ.
    }
//Компонент холбогдох үед
    connectedCallback() {
        window.addEventListener("add-to-cart", (event) => { //"add-to-cart" эвент үүсэх үед сагсанд нэмэх логик ажиллана.
            const product = event.detail.product; //Эвентийн мэдээллээс бүтээгдэхүүний өгөгдлийг авна.
            const quantity = event.detail.quantity;

            const existing = this.cartItems.find((item) => item.id === product.id); //Сагсанд аль хэдийн байгаа бүтээгдэхүүнийг ID-аар нь хайж олох.

            if (existing) {
               existing.quantity += quantity; // Increment by the quantity
            } else {
                this.cartItems.push({ ...product, quantity });
            }

            localStorage.setItem("cart", JSON.stringify(this.cartItems));//Сагсны шинэчлэгдсэн өгөгдлийг localStorage-д хадгална.
            this.render();
        });

        this.render();
    }
//Бүтээгдэхүүнийг ID-аар нь сагснаас устгана.
    removeItem(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        localStorage.setItem("cart", JSON.stringify(this.cartItems));//Сагсны шинэчилсэн өгөгдлийг localStorage-д хадгална.
        this.render();
    }
//Сагсыг бүрэн хоослох.
    clearCart() {
        this.cartItems = [];
        localStorage.removeItem("cart");
        this.render();
    }

    render() {
        const total = this.cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        this.shadowRoot.innerHTML = `
            <style>
                .cart { border: 1px solid #ddd; padding: 10px; }
                .cart-item { display: flex; justify-content: space-between; margin: 5px 0; }
                .delete { font-size: 15px; cursor: pointer; transition: color 0.3s; }
                .delete:hover { color: darkred; }
                .clear-cart { font-size: 16px; cursor: pointer; margin-top: 10px; padding: 5px 10px; background-color: red; color: white; border: none; border-radius: 5px; }
                .clear-cart:hover { background-color: darkred; }
            </style>
            <div class="cart">
                <h3>Миний Сагс</h3>
                <p>Нийт: ${total}₮</p>
                <div>
                    ${this.cartItems
                        .map(
                            (item) => `
                        <div class="cart-item">
                            <span>${item.title} x ${item.quantity}</span>
                            <span>${item.price * item.quantity}₮</span>
                        </div>
                    `
                        )
                        .join("")}
                </div>
                <button class="clear-cart">Сагс хоослох 🗑️</button>
            </div>
        `;

        this.shadowRoot.querySelector(".clear-cart").addEventListener("click", () => {
            this.clearCart();
        });
    }
}

customElements.define("cart-component", Cart);
