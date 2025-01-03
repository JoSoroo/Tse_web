class MenuFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.menus = [];
    }

    setMenus(menus) {
        this.menus = menus;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ul {list-style: none;}
                li button { display: block; padding: 10px; border: none; text-decoration: none; color: #333; font-weight: bold; margin-bottom: 10px; border-left: 3px solid transparent; }
                li button:hover {
                color: #ffb800;
                border-left: 3px solid #ffb800;
                }
            </style>
            <ul>
                <li>
                ${this.menus
                    .map(
                        (menu) =>
                        `<button data-id="${menu.id}">${menu.title}</button>`
                    )
                    .join("")}
                </li>
            </ul>
        `;
//menu filter хэсэг 
        this.shadowRoot.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => {
                this.shadowRoot.querySelectorAll("button").forEach((btn) =>
                    btn.classList.remove("active")
                );
                button.classList.add("active");

                const category = button.textContent.toLowerCase(); 
                this.dispatchEvent(
                    new CustomEvent("category-changed", {
                        detail: category,
                        bubbles: true,
                    })
                );
            });
        });
    }
}

customElements.define("menu-filter", MenuFilter);