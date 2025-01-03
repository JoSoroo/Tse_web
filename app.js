import "./component/ProductList.js";
import "./component/Cart.js";
import "./component/MenuFilter.js"
//DOM ачаалcаны дараа гүйцэтгэх үйлдлүүд
document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cartIcon");
    const tooltip = document.getElementById("tooltip");

    // document.createElement()-ийг ашиглан сагс компонентыг бүтээж байна.
    const cartComponent = document.createElement("cart-component");

    cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        // Сагс дээр дарах бүрд өмнөх агуулгыг устгаж, шинэ агуулга
        tooltip.innerHTML = '';  
        tooltip.appendChild(cartComponent);  //Сагсны компонентыг tooltip контейнерт нэмэх.
        tooltip.classList.add("active");
    });

    document.addEventListener("click", (event) => {
      //Хэрэв хэрэглэгч сагсны товч эсвэл tooltip (сагсны жагсаалт) дээр биш газар дарвал tooltip-ийг хаах
        if (!cartIcon.contains(event.target) && !tooltip.contains(event.target)) {
            tooltip.classList.remove("active");
        }
    });
});

fetch("http://localhost:5000/menu")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP алдаа! Статус: ${response.status}`);
    }
    //JSON өгөгдлийг боловсруулж, буцааж авна.  
    return response.json();
  })
  .then((menu) => {
    console.log("Menus:", menu); // Ирж буй өгөгдлийг шалгах
    //Меню мэдээллийг авснаар menu-filter элементэд дамжуулж, тухайн компонент дахь setMenus функц рүү дамжуулна.
    document.querySelector("menu-filter").setMenus(menu);
  })
  .catch((error) => {
    console.error("Failed to fetch menus:", error);
  });



fetch("http://localhost:5000/products")
    .then((response) => response.json())
    .then((products) => {
        document.querySelector("product-list").setProducts(products);
    });