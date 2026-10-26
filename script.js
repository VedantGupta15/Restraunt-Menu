const dishes = [
  {
    id: 1,
    name: "Crispy Bruschetta",
    category: "Starters",
    price: 249,
    tag: "BESTSELLER",
    description: "Toasted bread, juicy tomatoes, basil and olive oil.",
    image: "photo-1572695157366-5e585ab2b69f"
  },
  {
    id: 2,
    name: "Garden Fresh Salad",
    category: "Starters",
    price: 199,
    tag: "FRESH PICK",
    description: "Crunchy greens, avocado and our signature dressing.",
    image: "photo-1512621776951-a57141f2eefd"
  },
  {
    id: 3,
    name: "Creamy Alfredo Pasta",
    category: "Mains",
    price: 349,
    tag: "POPULAR",
    description: "Silky parmesan sauce, herbs and perfectly cooked pasta.",
    image: "photo-1473093295043-cdd812d0e601"
  },
  {
    id: 4,
    name: "Classic Margherita",
    category: "Mains",
    price: 399,
    tag: "CHEF'S PICK",
    description: "Golden crust, melted mozzarella and fresh basil.",
    image: "photo-1579751626657-72bc17010498"
  },
  {
    id: 5,
    name: "Chocolate Indulgence",
    category: "Desserts",
    price: 229,
    tag: "MUST TRY",
    description: "Rich chocolate dessert for your sweet cravings.",
    image: "photo-1606313564200-e75d5e30476c"
  },
  {
    id: 6,
    name: "Berry Cheesecake",
    category: "Desserts",
    price: 259,
    tag: "SWEET FAVOURITE",
    description: "Creamy cheesecake with a bright berry topping.",
    image: "photo-1533134242443-d4fd215305ad"
  },
  {
    id: 7,
    name: "Iced Caramel Latte",
    category: "Drinks",
    price: 179,
    tag: "CHILL OUT",
    description: "Cold coffee, creamy milk and sweet caramel.",
    image: "photo-1461023058943-07fcbe16d735"
  },
  {
    id: 8,
    name: "Fresh Berry Smoothie",
    category: "Drinks",
    price: 199,
    tag: "FRUIT POWER",
    description: "A refreshing blend of berries and creamy goodness.",
    image: "photo-1505252585461-04db1eb84625"
  },
  {
    id: 9,
    name: "Loaded Burger",
    category: "Mains",
    price: 329,
    tag: "CROWD FAVOURITE",
    description: "A juicy burger with fresh toppings and a toasted bun.",
    image: "photo-1568901346375-23c9450c58cd"
  }
];

const menuGrid = document.getElementById("menuGrid");
const cartCount = document.getElementById("cartCount");
const cartDialog = document.getElementById("cartDialog");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const cart = new Map();
let activeCategory = "All";
let toastTimer;

const money = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

function renderMenu() {
  const visibleDishes = dishes.filter(dish =>
    activeCategory === "All" ||
    dish.category === activeCategory
  );

  menuGrid.innerHTML = visibleDishes.map(dish => `
    <article class="food-card">
      <div class="food-image">
        <img
          src="https://images.unsplash.com/${dish.image}?auto=format&fit=crop&w=700&q=80"
          alt="${dish.name}"
          loading="lazy">
        <span class="food-tag">${dish.tag}</span>
      </div>
      <div class="food-info">
        <div class="food-title-row">
          <h3>${dish.name}</h3>
          <span class="food-price">${money(dish.price)}</span>
        </div>
        <p>${dish.description}</p>
        <button class="add-btn" data-add="${dish.id}">
          + Add to cart
        </button>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addToCart(id) {
  const dish = dishes.find(item => item.id === id);
  if (!dish) return;

  const current = cart.get(id) || 0;
  cart.set(id, current + 1);

  renderCart();
  showToast(`${dish.name} added to your cart!`);
}

function changeQuantity(id, amount) {
  const quantity = (cart.get(id) || 0) + amount;

  if (quantity <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, quantity);
  }

  renderCart();
}

function renderCart() {
  let totalItems = 0;
  let totalPrice = 0;

  for (const [id, quantity] of cart) {
    const dish = dishes.find(item => item.id === id);
    if (!dish) continue;

    totalItems += quantity;
    totalPrice += dish.price * quantity;
  }

  cartCount.textContent = totalItems;
  cartTotal.textContent = money(totalPrice);

  if (cart.size === 0) {
    cartItems.innerHTML =
      "<p>Your cart is empty. Let's find something delicious!</p>";
    return;
  }

  cartItems.innerHTML = [...cart.entries()].map(([id, quantity]) => {
    const dish = dishes.find(item => item.id === id);

    return `
      <div class="cart-row">
        <div>
          <strong>${dish.name}</strong>
          <p>${money(dish.price)} each</p>
          <div class="quantity-controls">
            <button data-change="${id}" data-amount="-1"
              aria-label="Remove one ${dish.name}">−</button>
            <span>${quantity}</span>
            <button data-change="${id}" data-amount="1"
              aria-label="Add one ${dish.name}">+</button>
          </div>
        </div>
        <strong>${money(dish.price * quantity)}</strong>
      </div>
    `;
  }).join("");
}

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter-btn").forEach(item => {
    const selected = item === button;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });

  renderMenu();
});

menuGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (!button) return;

  changeQuantity(
    Number(button.dataset.change),
    Number(button.dataset.amount)
  );
});

document.getElementById("cartButton").addEventListener("click", () => {
  cartDialog.showModal();
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartDialog.close();
});

cartDialog.addEventListener("click", event => {
  if (event.target === cartDialog) {
    cartDialog.close();
  }
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.size === 0) {
    showToast("Your cart is empty!");
    return;
  }

  showToast("Demo website: checkout is not connected yet.");
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Toggle navigation"
  );
});

navLinks.addEventListener("click", event => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

renderMenu();
renderCart();
