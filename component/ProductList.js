class ProductList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });//нь тусгаарлагдсан DOM үүсгэж, элементэд дотоод HTML болон CSS-г нууцалдаг.
        this.products = [];
        this.filteredProducts = []; //бүтээгдэхүүний жагсаалт хадгалах массивууд
        
    }
    // Гаднаас бүтээгдэхүүний жагсаалтыг хүлээн авч хадгална.
    setProducts(products) { 
        this.products = products;
        this.filteredProducts = products;//Бүтээгдэхүүнүүдийг шүүхээс өмнө бүх бүтээгдэхүүнийг filteredProducts-д хадгална.
        this.render();
    }
//Элемент холбогдох үед шүүлтүүр болон эвентийн сонсогч нэмэх
    connectedCallback() {
        window.addEventListener("category-changed", (event) => {//Өөрчлөгдсөн категорийн утгыг сонсож, бүтээгдэхүүнийг шүүнэ.
            const category = event.detail;
            this.filteredProducts =
                category === "all"//Хэрэв категори нь "all" бол бүх бүтээгдэхүүнүүдийг харуулна.
                    ? this.products
                    : this.products.filter((p) => p.category === category);//Эс бөгөөс тухайн категорид харгалзах бүтээгдэхүүнүүдийг filter-ээр шүүж байна.
            this.render();
        });

        this.render();
    }
//Тоо хэмжээг нэмэх, хасах
    handleQuantityChange(productId, action) {
        const quantityElement = this.shadowRoot.querySelector(`#quantity-${productId}`);
        let quantity = parseInt(quantityElement.textContent);

        if (action === 'increment') {
            quantity++;
        } else if (action === 'decrement' && quantity > 1) {
            quantity--;
        }

        quantityElement.textContent = quantity;
        return quantity;  
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Scoped styles for ProductList */
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                }
                .red-circle {
                    position: absolute;
                    top: -5px;
                    right: -10px;
                    width: 15px;
                    height: 15px;
                    background-color: red;
                    border-radius: 50%;
                    display: none;
                    z-index: 1;
                }
                .red-circle.active {
                    display: block;
                    z-index: 2;
                }
                .product {
                    display: inline-block;
                    width: 250px;  /* Бүтээгдэхүүний өргөн */
                    height: 400px;  /* Бүтээгдэхүүний өндөр, эдгээрийг харгалзан тохируулна */
                    background-color: white;
                    border: 1px solid #e0e0e0;  /* Гаднах хүрээ */
                    border-radius: 5px;
                    margin: 10px;
                    padding: 15px;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    box-sizing: border-box;  /* Хүрээг тооцоололтод оруулах */
                }

                .product img {
                    width: 100%;  /* Зургийг бүтээгдэхүүний өргөнд тохируулна */
                    height: 200px;  /* Зургийн өндөр */
                    object-fit: cover;  /* Зураг ачаалагдахдаа бүтэн талбарыг бүрэх */
                }

                .product-title {
                    font-size: 18px;
                    margin: 10px 0;
                    font-weight: bold;
                }

                .productsub {
                    font-size: 14px;
                    margin: 5px 0;
                }

                .product-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 15px;
                }

                .tooluur,
                .zahialah {
                    border: none;
                    padding: 5px 10px;
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 2px;
                }

                .tooluur {
                    background-color: #f5f5f5;
                    color: #333;
                    margin: 0 5px;
                }

                .zahialah {
                    background-color: #ffb800;
                    color: white;
                    width: 100px;
                    font-weight: bold;
                }
            </style>
            <section class="sharefoodsection">
                ${this.filteredProducts
                    .map(
                        (product) => `
                    <article class="product">
                        <img src="${product.img || './hool.png'}" alt="Бүтээгдэхүүний зураг" class="productimg">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="productsub">${product.Orts}</p>
                        <p class="productsub">Үнэ: ${product.price}₮</p>
                        <div class="product-actions">
                            <button class="tooluur decrement" data-id="${product.id}" data-action="decrement">-</button>
                            <p class="too" id="quantity-${product.id}">1</p>
                            <button class="tooluur increment" data-id="${product.id}" data-action="increment">+</button>
                            <button class="zahialah" data-id="${product.id}" data-quantity="1">Сагсанд нэмэх</button>
                        </div>
                    </article>
                `
                    )
                    .join("")}
            </section>
        `;

        // Тоо хэмжээг өөрчлөх эвентийн сонсогч
        this.shadowRoot.querySelectorAll(".tooluur").forEach((button) => {
            button.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-id");//Дарсан товчлуурын data-id аттрибутын утгыг авч, бүтээгдэхүүний ID-г тодорхойлно.
                const action = e.target.getAttribute("data-action");//арсан товчлуурын үйлдлийг (increment буюу decrement) тодорхойлно.
                const updatedQuantity = this.handleQuantityChange(productId, action);//Бүтээгдэхүүний тоо хэмжээг нэмэх эсвэл хасах функцийг дуудна.
                this.shadowRoot.querySelector(`#quantity-${productId}`).textContent = updatedQuantity;//Бүтээгдэхүүний тоо хэмжээг харуулдаг элементийг олж шинэ утгыг харуулна.
            });
        });

        // "Сагсанд нэмэх" товчлуурын эвентийн сонсогч
        this.shadowRoot.querySelectorAll(".zahialah").forEach((button) => {
            button.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-id");  // Бүтээгдэхүүний ID
                const quantity = this.shadowRoot.querySelector(`#quantity-${productId}`).textContent;  // Тоо хэмжээ
                const product = this.products.find((p) => p.id === parseInt(productId));  // products массив дотроос ID-гаар нь бүтээгдэхүүнийг хайж олох.sz
        
                // "add-to-cart" event илгээх
                this.dispatchEvent(
                    new CustomEvent("add-to-cart", {//"add-to-cart" гэсэн өөрчлөн зохион бүтээсэн (custom) эвентыг үүсгэж, product болон quantity мэдээллийг агуулна.
                        detail: { product, quantity: parseInt(quantity) },
                        bubbles: true,  // Тархалт хийх
                        composed: true,  // Shadow DOM-оос гадна ажиллах
                    })
                );
        
                // icon дээр red-circle харуулах
                const redCircle = document.getElementById("redCircle");
                if (redCircle) {
                    redCircle.classList.add("active");
                }
            });
        });
       
        
    }
}

customElements.define("product-list", ProductList);
