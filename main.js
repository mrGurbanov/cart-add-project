const cartIcon = document.querySelector(".cart_icon");
const cartTab = document.querySelector(".cart_tab");
const closeBtn = document.querySelector(".close_btn");
const productList = document.querySelector(".product_list");

cartIcon.addEventListener("click", () => {
  cartTab.style.translate = "0 0";
});
closeBtn.addEventListener("click", () => {
  cartTab.style.translate = "100% 0";
});

const cart = [];

async function main() {
  const requestData = await fetch("./products.json");
  const datas = await requestData.json();
  if (datas) {
    productList.innerHTML = "";

    datas.forEach((item) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product");
      productElement.dataset.id = item.id;
      productElement.innerHTML = `
            <img width="200" height="200" src=${item.image}
            alt="">
        <h3>${item.name}</h3>
        <p>${item.price} ₼</p>
        <button class="add_to_cart_btn">ADD TO CART</button>
            `;
      productList.appendChild(productElement);
    });

    const products = productList.querySelectorAll(".product");

    if (products) {
      products.forEach((p) => {
        p.querySelector(".add_to_cart_btn").addEventListener("click", () => {
          addToCart(p.dataset.id);
        });
      });
    }
  }
}

main();

function addToCart(productId) {
  const existItem = cart.findIndex((item) => {
    return item.product_id === parseInt(productId);
  });
  if (cart.length <= 0) {
    cart.push({
      product_id: parseInt(productId),
      quantity: 1,
    });
  } else if (existItem < 0) {
    cart.push({
      product_id: parseInt(productId),
      quantity: 1,
    });
  } else {
    cart[existItem].quantity += 1;
  }
}

// function createCartItemElement() {

// }