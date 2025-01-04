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
                :host {
                display: block; /* Компонентыг блок гэж үзнэ */
                font-family: 'Arial', sans-serif; /* Фонт */
                --primary-bg: #fff; /* Анхны фоны өнгө */
                --secondary-bg: #333; /* Хоёрдогч фоны өнгө */
                --primary-text: #333; /* Анхны текстийн өнгө */
                --secondary-text: #fff; /* Хоёрдогч текстийн өнгө */
                --highlight-color: #ffb800; /* Онцгой өнгө */
                --border-radius: 10px; /* Баганын ирмэгийн дугуйралт */
                --transition-duration: 0.3s; /* Залгах хугацаа */
                --font-size: 16px; /* Үсгийн хэмжээ */
                --spacing: 10px; /* Заагдсан зай */
            }

            /* Dark/Light горим */
            :host([theme='dark']) {
                --primary-bg: #333; /* Dark горимд фоны өнгө */
                --secondary-bg: #fff; /* Dark горимд хоёрдогч фоны өнгө */
                --primary-text: #fff; /* Dark горимд текстийн өнгө */
                --secondary-text: #333; /* Dark горимд хоёрдогч текстийн өнгө */
            }

            /* Бүтээгдэхүүн жагсаалтын контейнер */
            .sharefoodsection {
                display: grid; /* Грид ашиглаж байна */
                grid-template-columns: repeat(4, 1fr); /* 4 баганагаар байршуулна */
                gap: 80px; /* Бүтээгдэхүүн хоорондын зайг нэмнэ */
                padding: 20px; /* Контейнерын доторх зай */
                transition: background-color var(--transition-duration), color var(--transition-duration); /* Фоны өнгө болон текстийн өнгө өөрчлөгдөхөд аажмаар шилжих */
            }

            /* Гар утасны том дэлгэцийн хувьд (1024px-аас бага) */
            @media (max-width: 1024px) {
                .sharefoodsection {
                    grid-template-columns: repeat(3, 1fr); /* 3 баганаар байршуулна */
                }
            }

            /* Гар утасны дэлгэцийн хувьд (768px-аас бага) */
            @media (max-width: 768px) {
                .sharefoodsection {
                    grid-template-columns: repeat(2, 1fr); /* 2 баганаар байршуулна */
                }
            }

            /* Гар утасны хамгийн жижиг дэлгэцийн хувьд (480px-аас бага) */
            @media (max-width: 480px) {
                .sharefoodsection {
                    grid-template-columns: 1fr; /* 1 баганаар байршуулна */
                }
            }

            /* Бүтээгдэхүүний карт */
            .product {
                display: inline-block; /* Бүтээгдэхүүний картуудын байрлалыг inline block болгон тохируулна */
                width: 100%; /* Өргөн */
                background-color: white; /* Фон цагаан */
                border: 1px solid #ccc; /* Хүрээ нарийн, саарал өнгөтэй */
                border-radius: 8px; /* Баганын дугуйралт */
                margin: 10px; /* Бүтээгдэхүүн хоорондын зай */
                padding: 15px; /* Картын доторх зай */
                text-align: center; /* Текстийг төвлөрүүлнэ */
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Сүүдэр нэмнэ */
                transition: transform 0.3s ease, box-shadow 0.3s ease; /* Сүүлд нэмж оруулсан transform болон box-shadow transition */
            }

            /* Бүтээгдэхүүний зураг */
            .product img {
                width: 100%; /* Зураг өргөнтэйгээ тааруулах */
                height: 200px; /* Зургийн өндөр */
                object-fit: cover; /* Зургийн хэсэгчилсэн таглах */
                border-radius: 8px; /* Баганын дугуйралт */
                transition: transform 0.4s ease, filter 0.4s ease; /* Зургийн hover үед анимаци */
            }

            /* Бүтээгдэхүүний карт дээр hover (хулганы заагч) */
            .product:hover {
                transform: scale(1.05); /* Картыг ихэсгэх */
                box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2); /* Илүү тод сүүдэр */
            }

            /* Бүтээгдэхүүний зураг дээр hover (хулганы заагч) */
            .product img:hover {
                transform: scale(1.1); /* Зураг томрох */
                filter: brightness(1.1); /* Гэрэлтүүлэх */
            }

            /* Бүтээгдэхүүний гарчиг */
            .product-title {
                font-size: 1.2rem; /* Үсгийн хэмжээ */
                margin: var(--spacing) 0; /* Заагдсан зай */
                font-weight: bold; /* Жирийн */
            }

            /* Бүтээгдэхүүний тодорхойлолт */
            .productsub {
                font-size: 1rem; /* Үсгийн хэмжээ */
                margin: var(--spacing) 0; /* Заагдсан зай */
            }

            /* Бүтээгдэхүүний үйлдлүүд */
            .product-actions {
                display: flex; /* Flexbox ашиглаж байна */
                justify-content: space-between; /* Хажуу талаас нь байрлуулах */
                align-items: center; /* Дунд нь байрлах */
            }

            /* Үйлдлүүдийн товчлуур */
            .tooluur, .zahialah {
                padding: 10px; /* Доторх зай */
                border-radius: var(--border-radius); /* Дугуйралт */
                font-size: 1rem; /* Үсгийн хэмжээ */
                cursor: pointer; /* Хулгана товчлуурын дүрс */
                transition: background-color var(--transition-duration), transform var(--transition-duration); /* Хулганы заагчийн өөрчлөлт */
            }

            /* Үйлдлийн товчлуурын өнгө */
            .tooluur {
                background-color: #f5f5f5; /* Нэрмэл өнгө */
                color: var(--primary-text); /* Эхний текстийн өнгө */
            }

            .tooluur:hover {
                background-color: #d6d6d6; /* Hover үед өнгө өөрчлөгдөнө */
                transform: scale(1.1); /* Томрох */
            }

            /* Сагсанд нэмэх товчлуур */
            .zahialah {
                background-color: var(--highlight-color); /* Онцгой өнгө */
                color: var(--secondary-text); /* Хоёрдогч текстийн өнгө */
                font-weight: bold; /* Жирийн */
            }

            .zahialah:hover {
                background-color: #e69d00; /* Hover үед өнгө өөрчлөгдөнө */
                transform: scale(1.05); /* Томрох */
            }

            /* Анимаци: Fade-in */
            @keyframes fadeIn {
                0% {
                    opacity: 0; /* Эхэнд нь харагдахгүй */
                    transform: translateY(20px); /* Эхний байршил */
                }
                100% {
                    opacity: 1; /* Харагдах болно */
                    transform: translateY(0); /* Байршилд очно */
                }
            }

            /* Бүтээгдэхүүн fade-in анимаци */
            .product {
                animation: fadeIn 0.5s ease-in-out; /* Анимаци */
            }

            /* Media Queries-ийг Responsive-д тохируулна */
            @media (max-width: 768px) {
                :host {
                    --font-size: 14px; /* Үсгийн хэмжээг багасгах */
                }
                .sharefoodsection {
                    grid-template-columns: 1fr 1fr; /* 2 багана */
                }
            }

            @media (max-width: 480px) {
                :host {
                    --font-size: 12px; /* Үсгийн хэмжээг багасгах */
                }
                .sharefoodsection {
                    grid-template-columns: 1fr; /* 1 багана */
                }
            }

            /* Бүх товчлуурт дугуйралт болон сүүдэр */
            .tooluur, .zahialah {
                border-radius: var(--border-radius); /* Дугуйралт */
                border: 2px solid transparent; /* Хүрээг өнгөгүй болгох */
            }

            /* Flexbox Layout for Product Actions */
            .product-actions {
                display: flex; /* Flexbox ашиглаж байна */
                justify-content: space-between; /* Хажуу талаас байрлуулах */
                gap: 10px; /* Заагдсан зай */
                margin-top: 10px; /* Дээд талын зай */
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
