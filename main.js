const cartIcon = document.querySelector(".cart_icon");
const cartTab = document.querySelector(".cart_tab");
const cartList = cartTab.querySelector(".cart_list");
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
          addToCart(parseInt(p.dataset.id));
        });
      });
    }


    cartList.addEventListener('click', ({target}) => {
      if (target.classList.contains('plus') || target.classList.contains('minus')) {
        const productId = parseInt(target.parentElement.parentElement.dataset.id);

        const itemId = cart.findIndex(function(item){
          return item.product_id === productId
        });

        let type = 'minus';

        if (target.classList.contains('plus')) {
          type = 'plus'
        }

        changeItemQuantity(itemId, type);
        createCartItemElement();
      }
    });
  }

  function changeItemQuantity(id, type) {
    if (type === 'plus') {
      cart[id].quantity += 1;
    }
    if (type === 'minus' && cart[id].quantity > 1) {
      cart[id].quantity -= 1;
    }
  }

  function addToCart(productId) {
    const existItem = cart.findIndex((item) => {
      return item.product_id === productId;
    });
    if (cart.length <= 0) {
      cart.push({
        product_id: productId,
        quantity: 1,
      });
    } else if (existItem < 0) {
      cart.push({
        product_id: productId,
        quantity: 1,
      });
    } else {
      cart[existItem].quantity += 1;
    }
    createCartItemElement();
    cartIcon.querySelector('& > span').innerHTML = cart.length;
  }

  function createCartItemElement() {
    if (cart.length) {
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
      `;
        cartList.appendChild(cartItem);
      });
    }
  }
}

main();
