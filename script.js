const cart = new Map();
const cartCount = document.querySelector('#cartCount');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const toastMessage = document.querySelector('#toastMessage');
const toastEl = document.querySelector('#addedToast');
const toast = toastEl && window.bootstrap ? bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2200 }) : null;
const productChoiceModal = document.querySelector('#productChoiceModal');
const productChoiceTitle = document.querySelector('#productChoiceTitle');
const productChoiceDescription = document.querySelector('#productChoiceDescription');
const productChoiceOptions = document.querySelector('#productChoiceOptions');

const productVariants = {
  'produk baru': {
    description: 'Pilihan jajanan praktis. Harga dan ketersediaan dikonfirmasi oleh toko.',
    options: [
      { name: 'Permen assorted', price: 1000, detail: 'Camilan manis satuan.' },
      { name: 'Wafer mini', price: 2000, detail: 'Wafer kecil untuk teman santai.' },
      { name: 'Makanan ringan', price: 5000, detail: 'Snack kemasan, pilihan rasa mengikuti stok.' },
    ],
  },
  jajanan: {
    description: 'Pilih jajanan ringan yang tersedia. Stok dan varian rasa bisa ditanyakan lewat WhatsApp.',
    options: [
      { name: 'Permen', price: 5000, detail: 'Camilan manis, pilihan rasa mengikuti stok.' },
      { name: 'Kerupuk', price: 4000, detail: 'Camilan gurih dan renyah.' },
      { name: 'Cokelat', price: 7000, detail: 'Camilan cokelat, merek mengikuti stok.' },
      { name: 'Wafer', price: 5000, detail: 'Wafer renyah untuk camilan.' },
      { name: 'Biskuit', price: 5000, detail: 'Biskuit kemasan untuk camilan.' },
      { name: 'Snack gurih', price: 5000, detail: 'Snack asin/gurih, pilihan mengikuti stok.' },
    ],
  },
  'produk umkm': {
    description: 'Produk dari pelaku usaha lokal. Jenis produk dan ketersediaan dapat dikonfirmasi ke toko.',
    options: [
      { name: 'Keripik UMKM', price: 15000, detail: 'Camilan renyah produksi usaha lokal.' },
      { name: 'Kue kering UMKM', price: 18000, detail: 'Kue kemasan, jenis mengikuti stok.' },
      { name: 'Sambal UMKM', price: 20000, detail: 'Produk lokal dalam kemasan.' },
    ],
  },
  rekomendasi: {
    description: 'Inspirasi pilihan camilan dan kebutuhan favorit. Tanyakan stok sebelum memesan.',
    options: [
      { name: 'Paket snack campur', price: 20000, detail: 'Kombinasi snack pilihan sesuai stok toko.' },
      { name: 'Biskuit favorit', price: 12000, detail: 'Biskuit kemasan, merek mengikuti stok.' },
      { name: 'Camilan gurih', price: 10000, detail: 'Pilihan camilan gurih yang tersedia.' },
    ],
  },
  'ibu anak': {
    description: 'Pilihan kebutuhan praktis ibu dan anak. Merek serta ukuran dikonfirmasi saat pemesanan.',
    options: [
      { name: 'Tisu basah', price: 10000, detail: 'Kemasan praktis untuk dibawa.' },
      { name: 'Popok anak', price: 18000, detail: 'Ukuran dan merek mengikuti stok.' },
      { name: 'Bedak bayi', price: 15000, detail: 'Produk perawatan anak, merek mengikuti stok.' },
    ],
  },
  rokok: {
    description: 'Tersedia pembelian per slop atau per batang. Merek dan ketersediaan dikonfirmasi ke toko.',
    options: [
      { name: '1 Slop', price: 24000, detail: 'Pembelian kemasan slop; harga mengikuti merek.' },
      { name: '1 Batang', price: 5000, detail: 'Pembelian eceran per batang.' },
    ],
  },
  'perlengkapan sehari hari': {
    description: 'Perlengkapan praktis untuk kebutuhan sehari-hari. Pilihan merek mengikuti stok toko.',
    options: [
      { name: 'Korek api', price: 3000, detail: 'Perlengkapan kecil untuk kebutuhan harian.' },
      { name: 'Baterai', price: 10000, detail: 'Ukuran dan merek mengikuti stok.' },
      { name: 'Masker', price: 5000, detail: 'Kemasan masker, jumlah mengikuti jenis produk.' },
    ],
  },
  rumah: {
    description: 'Pilihan perlengkapan kebersihan rumah. Merek, ukuran, dan stok dapat dikonfirmasi ke toko.',
    options: [
      { name: 'Sabun', price: 8000, detail: 'Sabun kebutuhan rumah, jenis mengikuti stok.' },
      { name: 'Sampo', price: 12000, detail: 'Sampo kemasan, merek/ukuran mengikuti stok.' },
      { name: 'Sikat Gigi', price: 10000, detail: 'Sikat gigi untuk kebutuhan harian.' },
      { name: 'Sapu Pel', price: 15000, detail: 'Perlengkapan untuk membersihkan lantai.' },
      { name: 'Detergen', price: 12000, detail: 'Detergen kemasan, merek/ukuran mengikuti stok.' },
      { name: 'Cairan pencuci piring', price: 10000, detail: 'Pembersih peralatan makan, ukuran mengikuti stok.' },
    ],
  },
  minuman: {
    description: 'Pilihan minuman kemasan. Rasa, ukuran, dan ketersediaan mengikuti stok toko.',
    options: [
      { name: 'Air mineral', price: 5000, detail: 'Minuman kemasan, ukuran mengikuti stok.' },
      { name: 'Teh kemasan', price: 7000, detail: 'Minuman teh siap minum.' },
      { name: 'Susu kemasan', price: 10000, detail: 'Minuman susu, rasa mengikuti stok.' },
      { name: 'Minuman rasa buah', price: 8000, detail: 'Minuman kemasan, rasa mengikuti stok.' },
    ],
  },
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
      <div class="cart-row-copy"><b>${item.name}</b><small>${formatRupiah(item.price)} / item · Subtotal ${formatRupiah(item.price * item.quantity)}</small></div>
      <div class="qty-control" aria-label="Jumlah ${item.name}">
        <button type="button" data-action="decrease" data-name="${item.name}" aria-label="Kurangi ${item.name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increase" data-name="${item.name}" aria-label="Tambah ${item.name}">+</button>
      </div>
    </div>`).join('');
}

function showProductChoice(name, fallbackPrice) {
  const key = normalizeProductKey(name);
  const product = productVariants[key] || (key.includes('rumah') ? productVariants.rumah : null);
  const options = product?.options || [];

  if (!options.length) {
    addToCartItem(name, fallbackPrice);
    return;
  }

  if (!productChoiceModal || !productChoiceTitle || !productChoiceOptions) {
    addToCartItem(name, fallbackPrice);
    return;
  }

  productChoiceTitle.textContent = `Pilih variasi ${name}`;
  if (productChoiceDescription) {
    productChoiceDescription.textContent = product?.description || 'Pilih produk yang tersedia; stok dapat dikonfirmasi melalui WhatsApp.';
  }
  productChoiceOptions.innerHTML = options.map((option) => `
    <button type="button" class="product-choice-item" data-choice-name="${option.name}" data-choice-price="${option.price}">
      <span class="product-choice-copy"><b>${option.name}</b><small>${option.detail}</small></span>
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

  const entries = [...cart.values()];
  const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderedItems = entries.map((item, index) =>
    `${index + 1}. ${item.name}\n   ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}`,
  ).join('\n');
  const message = `Halo Toko Hj. Anna, saya ingin memesan:\n\n${orderedItems}\n\nTotal: ${formatRupiah(total)}\n\nMohon konfirmasi ketersediaan produk dan pesanan ini. Terima kasih.`;
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
