class Product_list extends HTMLElement {
    async connectedCallback() {
        // Хэрэглэгчийн токеныг localStorage-аас авах
        const token = localStorage.getItem("authToken");

        if (!token) {
            // Токен байхгүй бол нэвтрэх хуудас руу шилжих
            window.location.href = "index.html"; // Нэвтрэх хуудас руу шилжүүлэх
            return;
        }

        try {
            // Бүтээгдэхүүнүүдийг авах хүсэлт илгээх
            const response = await fetch("http://localhost:3000/product", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Authorization   токен илгээх
                },
            });

            const result = await response.json();

            if (response.ok) {
                // Одоогийн контентыг цэвэрлэх
                this.innerHTML = "";

                // Бүтээгдэхүүнүүдийг гаргах
                result.products.forEach(product => {
                    const productDiv = document.createElement("div");
                    productDiv.classList.add("product");
                    productDiv.innerHTML = `
                        <img src="../hool.png" alt="">
                        <h3>${product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Category: ${product.category}</p>
                    `;
                    this.appendChild(productDiv); // Бүтээгдэхүүнүүдийг элементийг DOM-д нэмэх
                });
            } else {
                // Продукцийн мэдээлэл ачаалахад алдаа гарсан бол харуулах
                this.innerHTML = `<p>${result.message || "Failed to load products"}</p>`;
            }
        } catch (error) {
            // Алдаа гарсан үед консольд бичих ба хэрэглэгчид мэдэгдэл харуулах
            console.error("Error fetching products:", error);
            this.innerHTML = `<p>Error loading products.</p>`; // Продукцийн ачаалалд алдаа гарсан тухай мэдээлэл
        }
    }
}

// Хувийн элемент (custom element) бүртгэх
customElements.define("product-list", Product_list);
