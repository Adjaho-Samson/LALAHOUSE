(() => {
  'use strict';
  const products = Array.isArray(window.LALAHOUSE_PRODUCTS) ? window.LALAHOUSE_PRODUCTS : [];
  const WHATSAPP_NUMBER = '2290144603910'; // Numéro WhatsApp confirmé par la propriétaire.
  const grid = document.getElementById('product-grid');
  const dialog = document.getElementById('product-dialog');
  const dialogContent = document.getElementById('dialog-content');
  const toast = document.getElementById('toast');
  let activeCategory = 'all';
  let toastTimer;

  const formatPrice = (price) => `${new Intl.NumberFormat('fr-FR').format(price)} FCFA`;
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const whatsappLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const messages = {
    general: 'Bonjour LalaHouse, je souhaite découvrir vos articles et connaître les modalités de commande. Merci !',
    delivery: 'Bonjour LalaHouse, pourriez-vous me préciser les modalités et délais de livraison ou de retrait, s’il vous plaît ?'
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
  }

  function cardTemplate(product, index) {
    return `<article class="product-card reveal" style="--card-index:${index}" data-product-id="${escapeHTML(product.id)}">
      <button class="product-image-button" type="button" data-open-product="${escapeHTML(product.id)}" aria-label="Voir le détail de ${escapeHTML(product.name)}">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" loading="lazy"><span class="product-badge">${escapeHTML(product.badge)}</span><span class="image-zoom" aria-hidden="true">Voir la pièce <b>↗</b></span>
      </button>
      <div class="product-card-info"><div class="product-title-row"><div><p class="product-category">${escapeHTML(product.categoryLabel)}</p><h3>${escapeHTML(product.name)}</h3></div><span class="product-price">${formatPrice(product.price)}</span></div>
        <p class="product-description">${escapeHTML(product.description)}</p>
        <div class="product-card-bottom"><span class="availability"><i aria-hidden="true"></i>${escapeHTML(product.availability)}</span><button class="product-view" type="button" data-open-product="${escapeHTML(product.id)}">Voir le produit <span aria-hidden="true">↗</span></button></div></div>
    </article>`;
  }

  function filteredProducts() {
    let result = products.filter((product) => activeCategory === 'all' || product.category === activeCategory);
    const price = document.getElementById('price-filter')?.value || 'all';
    if (price === 'under-10000') result = result.filter((product) => product.price < 10000);
    if (price === '10000-15000') result = result.filter((product) => product.price >= 10000 && product.price <= 15000);
    if (price === 'over-15000') result = result.filter((product) => product.price > 15000);
    const availability = document.getElementById('availability-filter')?.value || 'all';
    if (availability === 'available') result = result.filter((product) => product.availability === 'Disponible');
    if (availability === 'confirm') result = result.filter((product) => product.availability === 'À confirmer');
    const sort = document.getElementById('sort-products')?.value || 'featured';
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }

  function renderProducts() {
    if (!grid) return;
    const visible = filteredProducts();
    if (!visible.length) {
      grid.innerHTML = '<div class="empty-state"><span aria-hidden="true">—</span><h3>Aucun article dans cette sélection</h3><p>Essayez un autre filtre ou contactez-nous pour obtenir de l’aide.</p><button class="text-link reset-filters" type="button">Réinitialiser les filtres <span aria-hidden="true">↗</span></button></div>';
      return;
    }
    grid.innerHTML = visible.map(cardTemplate).join('');
    observeReveals(grid);
  }

  function openProduct(id) {
    const product = products.find((item) => item.id === id);
    if (!product || !dialog || !dialogContent) return;
    dialogContent.innerHTML = `<div class="dialog-product-image"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}"></div>
      <div class="dialog-product-details"><p class="eyebrow">${escapeHTML(product.categoryLabel)} · LALAHOUSE</p><h2 id="dialog-title">${escapeHTML(product.name)}</h2><p class="dialog-price">${formatPrice(product.price)}</p><p class="dialog-description">${escapeHTML(product.description)}</p>
      <p class="dialog-stock"><i aria-hidden="true"></i>Disponibilité à confirmer auprès de la boutique</p>
      <form class="order-form" id="order-form" data-product-id="${escapeHTML(product.id)}">
        <label for="order-size">Taille souhaitée</label><select id="order-size" name="size" required><option value="">Choisir une taille</option>${product.sizes.map((size) => `<option value="${escapeHTML(size)}">${escapeHTML(size)}</option>`).join('')}<option value="Autre">Autre / à préciser</option></select>
        <label for="order-color">Couleur souhaitée</label><select id="order-color" name="color" required><option value="">Choisir une couleur</option>${product.colors.map((color) => `<option value="${escapeHTML(color)}">${escapeHTML(color)}</option>`).join('')}</select>
        <div class="quantity-row"><label for="order-quantity">Quantité</label><div class="quantity-control"><button type="button" data-quantity="minus" aria-label="Diminuer la quantité">−</button><input id="order-quantity" name="quantity" type="number" min="1" max="10" value="1" inputmode="numeric"><button type="button" data-quantity="plus" aria-label="Augmenter la quantité">+</button></div></div>
        <p class="visual-disclaimer">Les visuels sont des images d'ambiance. Le modèle, la taille, la couleur et la disponibilité sont à confirmer par message.</p>
        <button class="button button-dark dialog-order" type="submit" data-intent="commander">Commander sur WhatsApp <span aria-hidden="true">↗</span></button>
        <button class="button button-outline dialog-reserve" type="submit" data-intent="reserver">Réserver cet article <span aria-hidden="true">↗</span></button>
        <p class="no-payment">Aucun paiement n'est effectué sur le site.</p>
      </form></div>`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('dialog-open');
    dialog.querySelector('.dialog-close')?.focus();
  }

  function closeDialog() {
    if (dialog?.open) dialog.close();
    document.body.classList.remove('dialog-open');
  }

  function handleOrder(event) {
    event.preventDefault();
    const form = event.target.closest('#order-form');
    if (!form || !form.reportValidity()) return;
    const product = products.find((item) => item.id === form.dataset.productId);
    if (!product) return;
    const data = new FormData(form);
    const intent = event.submitter?.dataset.intent || 'commander';
    const verb = intent === 'reserver' ? 'réserver' : 'commander';
    const message = `Bonjour LalaHouse,\n\nJe souhaite ${verb} cet article :\n\nProduit : ${product.name}\nPrix : ${formatPrice(product.price)}\nTaille : ${data.get('size')}\nCouleur : ${data.get('color')}\nQuantité : ${data.get('quantity')}\n\nMerci de me confirmer sa disponibilité et les modalités de livraison.\n\nJe note que la photo est un visuel d’ambiance et peut différer de l’article proposé.`;
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  }

  document.addEventListener('click', (event) => {
    const whatsapp = event.target.closest('[data-whatsapp]');
    if (whatsapp) {
      event.preventDefault();
      window.open(whatsappLink(messages[whatsapp.dataset.whatsapp] || messages.general), '_blank', 'noopener,noreferrer');
      if (whatsapp.closest('.mobile-menu')) {
        if (mobileMenu) mobileMenu.hidden = true;
        menuToggle?.setAttribute('aria-expanded', 'false');
        menuToggle?.setAttribute('aria-label', 'Ouvrir le menu');
        document.body.classList.remove('menu-open');
      }
      return;
    }
    const productButton = event.target.closest('[data-open-product]');
    if (productButton) { openProduct(productButton.dataset.openProduct); return; }
    const categoryLink = event.target.closest('[data-category-link]');
    if (categoryLink) {
      activeCategory = categoryLink.dataset.categoryLink;
      document.querySelectorAll('.filter-button').forEach((button) => {
        const selected = button.dataset.filter === activeCategory;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      renderProducts();
    }
    if (event.target.closest('.dialog-close')) closeDialog();
    if (event.target.closest('.reset-filters')) {
      activeCategory = 'all';
      document.querySelectorAll('.filter-button').forEach((button) => {
        const selected = button.dataset.filter === 'all';
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      ['price-filter', 'availability-filter', 'sort-products'].forEach((id) => { const control = document.getElementById(id); if (control) control.value = id === 'sort-products' ? 'featured' : 'all'; });
      renderProducts();
    }
    const quantityButton = event.target.closest('[data-quantity]');
    if (quantityButton) {
      const input = document.getElementById('order-quantity');
      if (!input) return;
      input.value = Math.max(1, Math.min(10, Number(input.value || 1) + (quantityButton.dataset.quantity === 'plus' ? 1 : -1)));
    }
    if (event.target.matches('.product-dialog')) closeDialog();
  });

  document.addEventListener('submit', (event) => { if (event.target.matches('#order-form')) handleOrder(event); });
  dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((other) => {
      const selected = other === button;
      other.classList.toggle('is-active', selected);
      other.setAttribute('aria-pressed', String(selected));
    });
    renderProducts();
  }));
  ['price-filter', 'availability-filter', 'sort-products'].forEach((id) => document.getElementById(id)?.addEventListener('change', renderProducts));

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Ouvrir le menu' : 'Fermer le menu');
    if (mobileMenu) mobileMenu.hidden = expanded;
    document.body.classList.toggle('menu-open', !expanded);
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    if (link.hasAttribute('data-whatsapp')) return;
    mobileMenu.hidden = true;
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.classList.remove('menu-open');
  }));

  const themeToggle = document.querySelector('.theme-toggle');
  const applyTheme = (theme, persist = false) => {
    const selected = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = selected;
    if (themeToggle) {
      const action = selected === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre';
      themeToggle.setAttribute('aria-label', action);
      themeToggle.setAttribute('title', action);
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', selected === 'dark' ? '#1b1a18' : '#f8f5ef');
    if (persist) {
      try { localStorage.setItem('lalahouse-theme', selected); } catch (_) { /* Le thème reste actif pour cette visite. */ }
    }
  };
  applyTheme(document.documentElement.dataset.theme || 'light');
  themeToggle?.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  let revealObserver;
  function observeReveals(scope = document) {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scope.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
      return;
    }
    if (!revealObserver) revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    scope.querySelectorAll('.reveal:not(.is-visible)').forEach((node) => revealObserver.observe(node));
  }
  observeReveals();
  renderProducts();
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  // A gentle, non-blocking check that assets resolve; missing images keep useful alt text.
  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement) event.target.classList.add('image-unavailable');
  }, true);
})();
