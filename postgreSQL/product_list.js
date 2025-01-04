class Product_list extends HTMLElement {
    async connectedCallback() {
        // Get token from localStorage
        const token = localStorage.getItem("authToken");

        if (!token) {
            window.location.href = "index.html"; // Redirect to login if not authenticated
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/product", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Send token in Authorization header
                },
            });

            const result = await response.json();

            if (response.ok) {
                // Clear existing content
                this.innerHTML = "";

                // Add products to the component
                result.products.forEach(product => {
                    const productDiv = document.createElement("div");
                    productDiv.classList.add("product");
                    productDiv.innerHTML = `
                        <img src="../hool.png" alt="">
                        <h3>${product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Category: ${product.category}</p>
                    `;
                    this.appendChild(productDiv);
                });
            } else {
                this.innerHTML = `<p>${result.message || "Failed to load products"}</p>`;
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            this.innerHTML = `<p>Error loading products.</p>`;
        }
    }
}

// Register the custom element
customElements.define("product-list", Product_list);