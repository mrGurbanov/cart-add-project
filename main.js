const cartIcon = document.querySelector(".cart_icon");
const cartTab = document.querySelector(".cart_tab");
const cartList = cartTab.querySelector(".cart_list");
const closeBtn = document.querySelector(".close_btn");
const productList = document.querySelector(".product_list");
const searchElement = document.querySelector(".search");
const resetBtn = cartTab.querySelector(".reset_cart_btn");
const sortFilterSelect = document.querySelector(".product_list_wrapper .sorting");

cartIcon.addEventListener("click", () => {
  cartTab.style.translate = "0 0";
});
closeBtn.addEventListener("click", () => {
  cartTab.style.translate = "100% 0";
});

let cart = [];

async function main() {
  const requestData = await fetch("./products.json");
  const datas = await requestData.json();
  if (datas) {
    createProductListHTML(datas);

    const products = productList.querySelectorAll(".product");

    if (products) {
      products.forEach((p) => {
        p.querySelector(".add_to_cart_btn").addEventListener("click", () => {
          addToCart(parseInt(p.dataset.id));
        });
      });
    };

    cartList.addEventListener("click", ({ target }) => {
      if (
        target.classList.contains("plus") ||
        target.classList.contains("minus")
      ) {
        const productId = parseInt(
          target.parentElement.parentElement.dataset.id
        );

        const itemId = cart.findIndex(function (item) {
          return item.product_id === productId;
        });

        let type = "minus";

        if (target.classList.contains("plus")) {
          type = "plus";
        };

        changeItemQuantity(itemId, type);
        createCartItemElement();
      };

      if (target.classList.contains("trash")) {
        const cartItemId = parseInt(target.parentElement.dataset.id);
        cart = cart.filter((item) => item.product_id !== cartItemId);
        createCartItemElement();
      };
    });

    resetBtn.addEventListener("click", () => {
      cart = [];
      createCartItemElement();
    });

    searchFilterByName(datas);

    sortFilterSelect.addEventListener("change", ({ target }) => {
      const selectedOption = target.value;

      sortFilterBy(selectedOption);
    });
  };

  function createProductListHTML(arr) {
    productList.innerHTML = "";

    arr.forEach((item) => {
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
  };

  function sortFilterBy(option) {
    if (option === "cheap") {
      createProductListHTML(datas.sort((a, b) => a.price - b.price));
    }
    else if (option === 'expensive') {
      createProductListHTML(datas.sort((a, b) => b.price - a.price));
    }
  };

  function searchFilterByName(arr) {
    searchElement
      .querySelector("& > input")
      .addEventListener("input", ({ target }) => {
        const val = target.value;

        const filteredDatas = arr.filter((item) =>
          item.name.toLowerCase().includes(val.toLowerCase())
        );
        createProductListHTML(filteredDatas);
      });
  };

  // [{id: 1}, {id: 2}, {id: 3}]
  // [{id: 1}, {id: 3}]

  function changeItemQuantity(id, type) {
    if (type === "plus") {
      cart[id].quantity += 1;
      cart[id].item_total_price += cart[id].item_price;
    }
    if (type === "minus" && cart[id].quantity > 1) {
      cart[id].quantity -= 1;
      cart[id].item_total_price -= cart[id].item_price;
    }
  };

  function addToCart(productId) {
    const existItem = cart.findIndex((item) => {
      return item.product_id === productId;
    });
    const existItemInfo = datas.find((item) => item.id === productId);

    if (cart.length <= 0) {
      cart.push({
        product_id: productId,
        quantity: 1,
        item_price: existItemInfo.price,
        item_total_price: existItemInfo.price,
      });
    } else if (existItem < 0) {
      cart.push({
        product_id: productId,
        quantity: 1,
        item_price: existItemInfo.price,
        item_total_price: existItemInfo.price,
      });
    } else {
      cart[existItem].quantity += 1;
      cart[existItem].item_total_price =
        cart[existItem].quantity * existItemInfo.price;
    }
    createCartItemElement();
    cartIcon.querySelector("& > span").innerHTML = cart.length;
  };

  function createCartItemElement() {
    cartList.innerHTML = "";
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart_item");
      cartItem.dataset.id = item.product_id;

      const itemInfo = datas.find((data) => data.id === item.product_id);

      cartItem.innerHTML = `
      <div class="image">
        <img src=${itemInfo.image} alt="">
      </div>
      <div class="name">${itemInfo.name}</div>
      <div class="price">${itemInfo.price}</div>
      <div class="quantity">
          <span class="minus">-</span>
          <span class="count">${item.quantity}</span>
          <span class="plus">+</span>
      </div>
      <i class="fa-solid fa-trash trash"></i>
      `;
      cartList.appendChild(cartItem);
    });
    let totalPrice = 0;
    cart.forEach((item) => (totalPrice += item.item_total_price));
    cartTab.querySelector(".total_price").innerHTML = totalPrice.toFixed(2);
  };
};

main();
