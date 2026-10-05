const cart = new Map();
const cartCount = document.querySelector('#cartCount');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const toastMessage = document.querySelector('#toastMessage');
const toastEl = document.querySelector('#addedToast');
const toast = toastEl && window.bootstrap ? bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2200 }) : null;
const productChoiceModal = document.querySelector('#productChoiceModal');
const productChoiceTitle = document.querySelector('#productChoiceTitle');
const productChoiceOptions = document.querySelector('#productChoiceOptions');

const productVariants = {
  jajanan: [
    { name: 'Permen', price: 5000 },
    { name: 'Kerupuk', price: 4000 },
    { name: 'Cokelat', price: 7000 },
  ],
  rumah: [
    { name: 'Sabun', price: 8000 },
    { name: 'Sampo', price: 12000 },
    { name: 'Sikat Gigi', price: 10000 },
    { name: 'Sapu Pel', price: 15000 },
  ],
  'rumah tangga': [
    { name: 'Sabun', price: 8000 },
    { name: 'Sampo', price: 12000 },
    { name: 'Sikat Gigi', price: 10000 },
    { name: 'Sapu Pel', price: 15000 },
  ],
  rokok: [
    { name: '1 Slop', price: 24000 },
    { name: '1 Batang', price: 5000 },
  ],
};

const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(amount);

const normalizeProductKey = (value = '') => String(value)
  .trim()
  .toLocaleLowerCase('id')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

function addToCartItem(name, price) {
  const item = cart.get(name) || { name, price: Number(price), quantity: 0 };
  item.quantity += 1;
  cart.set(name, item);
  renderCart();
  if (toastMessage && toast) {
    toastMessage.textContent = `${name} ditambahkan ke keranjang.`;
    toast.show();
  }
}

function renderCart() {
  if (!cartCount || !cartItems || !cartTotal) return;

  const entries = [...cart.values()];
  const itemCount = entries.reduce((sum, item) => sum + item.quantity, 0);
  const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = itemCount;
  cartTotal.textContent = formatRupiah(total);

  if (!entries.length) {
    cartItems.innerHTML = '<p class="cart-empty">Keranjangmu masih kosong. Pilih menu favoritmu, yuk!</p>';
    return;
  }

  cartItems.innerHTML = entries.map((item) => `
    <div class="cart-row">
      <div class="cart-row-copy"><b>${item.name}</b><small>${formatRupiah(item.price)} / porsi</small></div>
      <div class="qty-control" aria-label="Jumlah ${item.name}">
        <button type="button" data-action="decrease" data-name="${item.name}" aria-label="Kurangi ${item.name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increase" data-name="${item.name}" aria-label="Tambah ${item.name}">+</button>
      </div>
    </div>`).join('');
}

function showProductChoice(name, fallbackPrice) {
  const key = normalizeProductKey(name);
  const options = productVariants[key] || (key.includes('rumah') ? productVariants.rumah : []);

  if (!options.length) {
    addToCartItem(name, fallbackPrice);
    return;
  }

  if (!productChoiceModal || !productChoiceTitle || !productChoiceOptions) {
    addToCartItem(name, fallbackPrice);
    return;
  }

  productChoiceTitle.textContent = `Pilih variasi ${name}`;
  productChoiceOptions.innerHTML = options.map((option) => `
    <button type="button" class="product-choice-item" data-choice-name="${option.name}" data-choice-price="${option.price}">
      <span>${option.name}</span>
      <b>${formatRupiah(option.price)}</b>
    </button>
  `).join('');

  productChoiceModal.classList.add('is-open');
  productChoiceModal.setAttribute('aria-hidden', 'false');
}

function closeProductChoice() {
  if (!productChoiceModal) return;
  productChoiceModal.classList.remove('is-open');
  productChoiceModal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.quick-add').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const { name, price } = button.dataset;
    showProductChoice(name, Number(price) || 0);
  });
});

document.querySelectorAll('.product-col').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('.quick-add')) return;
    const name = card.dataset.name || card.querySelector('.category-text')?.textContent?.trim() || 'Produk';
    const fallbackPrice = Number(card.querySelector('.quick-add')?.dataset?.price || 0);
    showProductChoice(name, fallbackPrice);
  });
});

if (productChoiceModal) {
  productChoiceModal.addEventListener('click', (event) => {
    if (event.target === productChoiceModal) closeProductChoice();
  });
}

document.querySelector('.product-choice-close')?.addEventListener('click', closeProductChoice);

if (productChoiceOptions) {
  productChoiceOptions.addEventListener('click', (event) => {
    const button = event.target.closest('.product-choice-item');
    if (!button) return;
    const name = button.dataset.choiceName;
    const price = Number(button.dataset.choicePrice || 0);
    if (!name) return;
    addToCartItem(name, price);
    closeProductChoice();
  });
}

if (cartItems) {
  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const item = cart.get(button.dataset.name);
    if (!item) return;
    item.quantity += button.dataset.action === 'increase' ? 1 : -1;
    if (item.quantity <= 0) cart.delete(item.name);
    renderCart();
  });
}

const filterButtons = document.querySelectorAll('.filter-chip');
const productCards = document.querySelectorAll('.product-col');
const searchInput = document.querySelector('#menuSearch');
let activeFilter = 'all';

function updateProducts() {
  const emptyState = document.querySelector('#emptyState');
  if (!searchInput || !productCards.length) return;

  const query = searchInput.value.trim().toLocaleLowerCase('id');
  let visibleCount = 0;

  productCards.forEach((card) => {
    const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesSearch = String(card.dataset.name || '').includes(query);
    const visible = matchesCategory && matchesSearch;
    card.classList.toggle('d-none', !visible);
    if (visible) visibleCount += 1;
  });

  if (emptyState) {
    emptyState.classList.toggle('d-none', visibleCount > 0);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((filter) => filter.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    updateProducts();
  });
});

if (searchInput) searchInput.addEventListener('input', updateProducts);

document.querySelector('#checkoutBtn')?.addEventListener('click', () => {
  if (cart.size === 0) {
    if (toastMessage) toastMessage.textContent = 'Keranjang masih kosong. Pilih produk terlebih dahulu.';
    toast?.show();
    return;
  }

  const orderedItems = [...cart.values()]
    .map((item) => `${item.name} (${item.quantity})`)
    .join(', ');
  const message = `Saya ingin memesan produk ${orderedItems}, mohon lakukan proses nya :3`;
  const whatsappUrl = `https://wa.me/6289530053728?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

document.querySelector('#year') && (document.querySelector('#year').textContent = new Date().getFullYear());

const promoSlides = document.querySelectorAll('.promo-slide');
const promoDots = document.querySelectorAll('.slider-dot');
const promoPrev = document.querySelector('.promo-arrow--prev');
const promoNext = document.querySelector('.promo-arrow--next');
let promoIndex = 0;

function updatePromoSlide(nextIndex) {
  promoIndex = (nextIndex + promoSlides.length) % promoSlides.length;

  promoSlides.forEach((slide, index) => {
    slide.classList.toggle('is-active', index === promoIndex);
  });

  promoDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === promoIndex);
  });
}

if (promoSlides.length && promoDots.length) {
  promoPrev?.addEventListener('click', () => updatePromoSlide(promoIndex - 1));
  promoNext?.addEventListener('click', () => updatePromoSlide(promoIndex + 1));

  setInterval(() => {
    updatePromoSlide(promoIndex + 1);
  }, 5000);
}

renderCart();
