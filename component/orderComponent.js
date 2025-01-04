class OrderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
    }

    async connectedCallback() {
        //Захиалгын жагсаалтыг серверээс авах функц дуудаж, мэдээлэл уншина.
        await this.getOrders();
        this.shadowRoot
            .querySelector("#order-list")
            //Захиалгын устгах товчлуур дээр дарах үйлдлийг сонсож, тухайн захиалгын ID-г олж, устгах функцийг дуудаж байна.
            .addEventListener("click", (event) => {
                if (event.target.classList.contains("delete-btn")) {
                    const orderId = event.target.getAttribute("data-id");
                    this.deleteOrder(orderId);
                }
            });
    }

    async getOrders() {
        try {
            //Серверээс захиалгын жагсаалтыг авах хүсэлт илгээнэ
            const response = await fetch("http://localhost:5000/orders");
            const orders = await response.json();
            //Хэрэв хүсэлт амжилттай бол мэдээллийг JSON болгон уншиж, renderOrders() функц руу дамжуулна.
            if (response.ok) {
                this.renderOrders(orders);
            } else {
                console.error("Захиалгуудыг авахад алдаа гарлаа");
            }
        } catch (error) {
            console.error("Сүлжээний алдаа:", error);
        }
    }

    renderOrders(orders) {
        //Захиалгын жагсаалтыг хадгалах DOM элемент.
        const orderList = this.shadowRoot.getElementById("order-list");
    
        if (orders.length === 0) {
            orderList.innerHTML = "<p>Захиалга байхгүй.</p>";
        } else {
            orderList.innerHTML = orders.map(order => {
                // `items` массив доторхи бүтээгдэхүүнийг харуулах
                return `
                    <div class="order-item">
                        <p>Захиалгын дугаар: ${order._id}</p>
                        ${order.items.map(item => `
                            <p>Бүтээгдэхүүн: ${item.product || "Тодорхойгүй"}</p>
                            <p>Тоо: ${item.quantity || "Тоо тодорхойгүй"}</p>
                            <p>Үнэ: ${item.price}</p>
                        `).join('')}
                        <button class="delete-btn" data-id="${order._id}">Устгах</button>
                    </div>
                `;
            }).join("");
        }
    }
    
    
    

    async deleteOrder(orderId) {
        try {
            console.log("Deleting order with ID:", orderId);
    
            // Устгах товчлуураас холбогдох order-item элементийг олох
            const orderElement = this.shadowRoot.querySelector(`[data-id="${orderId}"]`).closest('.order-item');
    
            // fade-out класс нэмж анимацийг идэвхжүүлэх
            orderElement.classList.add('fade-out');
    
            // Анимаци дуусах хүртэл түр хүлээнэ (300ms)
            await new Promise(resolve => setTimeout(resolve, 300));
    
            // Серверээс устгах хүсэлт илгээх
            const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                alert("Захиалга амжилттай устгагдлаа.");
                this.getOrders(); // Захиалгуудыг дахин авах
            } else {
                console.error("Захиалгыг устгахад алдаа гарлаа.");
            }
        } catch (error) {
            console.error("Сүлжээний алдаа:", error);
        }
    }
    

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                 .order-item {
                    margin: 15px 0;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    opacity: 1;
                    transform: translateY(0);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }

                .order-item.fade-out {
                    opacity: 0;
                    transform: translateY(20px);
                }

                .delete-btn {
                    background-color: red;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }

                .delete-btn:hover {
                    background-color: darkred;
                    transform: scale(1.1);
                }

                /* Fade-in анимэйшн */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                #order-list .order-item {
                    animation: fadeIn 0.5s ease both;
                }
            </style>
            <div>
                <h2>Захиалгууд</h2>
                <div id="order-list"></div>
            </div>
        `;
    }
}

customElements.define("order-component", OrderComponent);